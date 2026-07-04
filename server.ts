import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { Aula, EmailLog, Aluno, Curso, Modulo, Pacote, Pagamento } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  app.use(express.json({ limit: '50mb' }));

  // Serve uploads statically
  app.use('/uploads', express.static(uploadsDir));

  // Logger helper
  const logEmail = (to: string, subject: string, body: string) => {
    const newLog: EmailLog = {
      id: `email-${Date.now()}`,
      to,
      subject,
      body,
      sent_at: new Date().toISOString()
    };
    db.addEmailLog(newLog);
    console.log(`[Resend Email Dispatched] To: ${to} | Subject: ${subject}`);
    return newLog;
  };

  // Helper function to process 24h reminders (the simulated pg_cron job)
  const runCronReminders = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Check classes scheduled +/- 2 hours around exactly 24 hours from now
    const targetMin = new Date(tomorrow.getTime() - 2 * 60 * 60 * 1000);
    const targetMax = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000);

    const activeLessons = db.getAulas().filter(a => a.status === 'agendada');
    const emailsSent: EmailLog[] = [];

    activeLessons.forEach(aula => {
      const aulaTime = new Date(aula.data_hora);
      if (aulaTime >= targetMin && aulaTime <= targetMax) {
        // Find if we already sent a reminder for this lesson
        const alreadySent = db.getEmails().some(e => 
          e.to === db.getAlunos().find(al => al.id === aula.aluno_id)?.email &&
          e.subject.includes('Lembrete de Aula') &&
          e.body.includes(aula.data_hora.substring(11, 16))
        );

        if (!alreadySent) {
          const student = db.getAlunos().find(al => al.id === aula.aluno_id);
          const teacher = db.getProfessores().find(p => p.id === aula.professor_id);
          
          if (student && teacher) {
            const timeStr = aula.data_hora.substring(11, 16);
            const dateStr = new Date(aula.data_hora).toLocaleDateString('pt-BR');
            const subject = `⚠️ Lembrete de Aula Amanhã às ${timeStr}`;
            const body = `Olá ${student.nome},\n\nEste é um lembrete automático de que você tem uma aula agendada com ${teacher.nome} amanhã, dia ${dateStr} às ${timeStr}.\n\nLink da videochamada: ${aula.link_video}\n\nPrepare seus materiais!`;
            
            const log = logEmail(student.email, subject, body);
            emailsSent.push(log);
          }
        }
      }
    });

    return emailsSent;
  };

  // ----------------- API ROUTES -----------------

  // Auth Endpoints
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    const credentials = db.getCredentials();
    const userCreds = credentials[email.toLowerCase()];

    if (!userCreds || userCreds.passwordHash !== password) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    let userDetails = null;
    if (userCreds.role === 'professor') {
      userDetails = db.getProfessores().find(p => p.id === userCreds.userId);
    } else {
      userDetails = db.getAlunos().find(a => a.id === userCreds.userId);
    }

    if (!userDetails) {
      return res.status(404).json({ error: 'Detalhes do usuário não encontrados.' });
    }

    res.json({
      id: userCreds.userId,
      nome: userDetails.nome,
      email: userDetails.email,
      role: userCreds.role,
      professor_id: userCreds.role === 'aluno' ? (userDetails as Aluno).professor_id : undefined
    });
  });

  // Students CRUD (Isolated by Teacher)
  app.get('/api/alunos', (req, res) => {
    const { professor_id } = req.query;
    if (!professor_id) {
      return res.status(400).json({ error: 'ID do professor é obrigatório.' });
    }

    const teacherAlunos = db.getAlunos().filter(a => a.professor_id === professor_id);
    
    // Add enrichment details (course, active package status)
    const enriched = teacherAlunos.map(student => {
      const matricula = db.getMatriculas().find(m => m.aluno_id === student.id);
      const curso = matricula ? db.getCursos().find(c => c.id === matricula.curso_id) : null;
      
      const pacotes = db.getPacotes().filter(p => p.aluno_id === student.id);
      const activePacote = pacotes.find(p => p.status === 'ativo') || pacotes[0];
      
      const aulas = db.getAulas().filter(au => au.aluno_id === student.id && au.status === 'agendada');
      const proxima = aulas.length > 0 ? aulas.sort((a,b) => a.data_hora.localeCompare(b.data_hora))[0].data_hora : undefined;

      const pagamento = db.getPagamentos().filter(pa => pa.aluno_id === student.id);
      const currentPagamento = pagamento.length > 0 ? pagamento.sort((a,b) => b.data.localeCompare(a.data))[0] : null;

      return {
        ...student,
        curso_nome: curso ? curso.nome : 'Não matriculado',
        aulas_restantes: activePacote ? (activePacote.quantidade_aulas - activePacote.aulas_consumidas) : 0,
        proxima_aula: proxima,
        pagamento_status: currentPagamento ? currentPagamento.status : 'em_dia'
      };
    });

    res.json(enriched);
  });

  app.post('/api/alunos', (req, res) => {
    const { nome, email, professor_id, curso_id, senha, quantidade_aulas, valor } = req.body;
    if (!nome || !email || !professor_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    // Verify uniqueness
    const credentials = db.getCredentials();
    if (credentials[email.toLowerCase()]) {
      return res.status(400).json({ error: 'Este e-mail já está em uso.' });
    }

    const newStudentId = `aluno-${Date.now()}`;
    const newStudent: Aluno = {
      id: newStudentId,
      nome,
      email: email.toLowerCase(),
      professor_id,
      criado_em: new Date().toISOString()
    };

    db.addAluno(newStudent);
    db.registerCredential(email, { role: 'aluno', userId: newStudentId, passwordHash: senha || 'aluno' });

    // Auto matricula if curso_id is provided
    if (curso_id) {
      db.addMatricula({
        id: `mat-${Date.now()}`,
        aluno_id: newStudentId,
        curso_id,
        criado_em: new Date().toISOString()
      });
    }

    // Create default package if specified
    if (quantidade_aulas) {
      const newPacId = `pac-${Date.now()}`;
      db.addPacote({
        id: newPacId,
        aluno_id: newStudentId,
        quantidade_aulas: Number(quantidade_aulas),
        aulas_consumidas: 0,
        valor: Number(valor || 0),
        vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
        status: 'ativo'
      });

      // Create a pending payment
      db.addPagamento({
        id: `pag-${Date.now()}`,
        aluno_id: newStudentId,
        pacote_id: newPacId,
        valor: Number(valor || 0),
        data: new Date().toISOString().substring(0, 10),
        status: 'pendente'
      });
    }

    // Send confirmation email simulation
    const pName = db.getProfessores().find(p => p.id === professor_id)?.nome || 'Sua Professora';
    logEmail(
      newStudent.email, 
      `Bem-vindo(a) à Plataforma de Idiomas!`, 
      `Olá ${nome},\n\nSeu cadastro foi realizado com sucesso por ${pName}.\n\nPara acessar sua área, faça login em ${email} com a senha definida.\n\nBons estudos!`
    );

    res.status(201).json(newStudent);
  });

  app.put('/api/alunos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, email } = req.body;
    const updated = db.updateAluno(id, { nome, email });
    if (!updated) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.json(updated);
  });

  app.delete('/api/alunos/:id', (req, res) => {
    const { id } = req.params;
    db.deleteAluno(id);
    res.json({ success: true });
  });

  // Courses Endpoints
  app.get('/api/cursos', (req, res) => {
    const { professor_id } = req.query;
    if (!professor_id) {
      return res.status(400).json({ error: 'ID do professor é obrigatório.' });
    }

    const teacherCursos = db.getCursos().filter(c => c.professor_id === professor_id);
    const enriched = teacherCursos.map(c => ({
      ...c,
      modulos_count: db.getModulos().filter(m => m.curso_id === c.id).length
    }));

    res.json(enriched);
  });

  app.post('/api/cursos', (req, res) => {
    const { professor_id, nome } = req.body;
    if (!professor_id || !nome) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const newCurso: Curso = {
      id: `curso-${Date.now()}`,
      professor_id,
      nome,
      criado_em: new Date().toISOString()
    };

    db.addCurso(newCurso);
    res.status(201).json(newCurso);
  });

  app.delete('/api/cursos/:id', (req, res) => {
    const { id } = req.params;
    db.deleteCurso(id);
    res.json({ success: true });
  });

  // Modules Endpoints
  app.get('/api/cursos/:cursoId/modulos', (req, res) => {
    const { cursoId } = req.params;
    const courseModulos = db.getModulos()
      .filter(m => m.curso_id === cursoId)
      .sort((a,b) => a.ordem - b.ordem);

    res.json(courseModulos);
  });

  app.post('/api/cursos/:cursoId/modulos', (req, res) => {
    const { cursoId } = req.params;
    const { titulo, descricao, arquivo_url, ordem } = req.body;

    if (!titulo || !descricao) {
      return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
    }

    // Determine order
    let nextOrdem = Number(ordem);
    if (!nextOrdem) {
      const existing = db.getModulos().filter(m => m.curso_id === cursoId);
      nextOrdem = existing.length > 0 ? Math.max(...existing.map(e => e.ordem)) + 1 : 1;
    }

    const newMod: Modulo = {
      id: `mod-${Date.now()}`,
      curso_id: cursoId,
      ordem: nextOrdem,
      titulo,
      descricao,
      arquivo_url: arquivo_url || '/uploads/modulo_exemplo.pdf'
    };

    db.addModulo(newMod);
    res.status(201).json(newMod);
  });

  app.delete('/api/modulos/:id', (req, res) => {
    const { id } = req.params;
    db.deleteModulo(id);
    res.json({ success: true });
  });

  // Student Modules & Access (Manual Unlock)
  // Get all courses & modules for a student including their unlocked status
  app.get('/api/aluno-conteudo/:alunoId', (req, res) => {
    const { alunoId } = req.params;
    const student = db.getAlunos().find(a => a.id === alunoId);
    if (!student) {
      return res.status(404).json({ error: 'Aluno não encontrado.' });
    }

    const matricula = db.getMatriculas().find(m => m.aluno_id === alunoId);
    if (!matricula) {
      return res.json({ curso: null, modulos: [] });
    }

    const curso = db.getCursos().find(c => c.id === matricula.curso_id);
    if (!curso) {
      return res.json({ curso: null, modulos: [] });
    }

    const modulos = db.getModulos()
      .filter(m => m.curso_id === curso.id)
      .sort((a, b) => a.ordem - b.ordem);

    const progressoes = db.getProgresso().filter(p => p.matricula_id === matricula.id);

    const modulosEnriched = modulos.map(m => {
      const prog = progressoes.find(p => p.modulo_id === m.id);
      return {
        ...m,
        liberado: !!prog,
        liberado_em: prog ? prog.liberado_em : null
      };
    });

    res.json({
      curso,
      matricula,
      modulos: modulosEnriched
    });
  });

  // Release/unlock module manually
  app.post('/api/progresso/liberar', (req, res) => {
    const { matricula_id, modulo_id } = req.body;
    if (!matricula_id || !modulo_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const newProg = {
      id: `prog-${Date.now()}`,
      matricula_id,
      modulo_id,
      liberado_em: new Date().toISOString(),
      liberado_by: 'manual' as const,
      liberado_por: 'manual' as const
    };

    db.addProgresso(newProg);

    // Simulated confirmation email to student
    const mat = db.getMatriculas().find(m => m.id === matricula_id);
    const mod = db.getModulos().find(m => m.id === modulo_id);
    if (mat && mod) {
      const student = db.getAlunos().find(a => a.id === mat.aluno_id);
      if (student) {
        logEmail(
          student.email,
          `📚 Novo material liberado: ${mod.titulo}`,
          `Olá ${student.nome},\n\nSua professora liberou um novo material de estudo para você: "${mod.titulo}".\n\nFaça login na plataforma para baixar o PDF e estudar!\n\nBons estudos!`
        );
      }
    }

    res.json({ success: true, progresso: newProg });
  });

  // Lock/block module back
  app.post('/api/progresso/bloquear', (req, res) => {
    const { matricula_id, modulo_id } = req.body;
    if (!matricula_id || !modulo_id) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    db.removeProgresso(matricula_id, modulo_id);
    res.json({ success: true });
  });

  // Lesson scheduling endpoints
  app.get('/api/aulas', (req, res) => {
    const { professor_id, aluno_id } = req.query;
    let list = db.getAulas();

    if (professor_id) {
      list = list.filter(a => a.professor_id === professor_id);
    }
    if (aluno_id) {
      list = list.filter(a => a.aluno_id === aluno_id);
    }

    // Enrich with student name
    const enriched = list.map(aula => {
      const student = db.getAlunos().find(a => a.id === aula.aluno_id);
      return {
        ...aula,
        aluno_nome: student ? student.nome : 'Desconhecido'
      };
    }).sort((a,b) => a.data_hora.localeCompare(b.data_hora));

    res.json(enriched);
  });

  app.post('/api/aulas', (req, res) => {
    const { professor_id, aluno_id, data_hora, link_video } = req.body;
    if (!professor_id || !aluno_id || !data_hora) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    // Find active package
    const pacotes = db.getPacotes().filter(p => p.aluno_id === aluno_id);
    const activePacote = pacotes.find(p => p.status === 'ativo');

    if (!activePacote) {
      return res.status(400).json({ error: 'Este aluno não possui nenhum pacote de aulas ativo. Crie um pacote primeiro!' });
    }

    const newAula: Aula = {
      id: `aula-${Date.now()}`,
      professor_id,
      aluno_id,
      pacote_id: activePacote.id,
      data_hora,
      status: 'agendada',
      link_video: link_video || 'https://meet.google.com/'
    };

    db.addAula(newAula);

    // Email notification
    const student = db.getAlunos().find(a => a.id === aluno_id);
    if (student) {
      const dateStr = new Date(data_hora).toLocaleDateString('pt-BR');
      const timeStr = data_hora.substring(11, 16);
      logEmail(
        student.email,
        `📅 Nova aula agendada!`,
        `Olá ${student.nome},\n\nSua próxima aula de idioma foi agendada para o dia ${dateStr} às ${timeStr}.\n\nLink do vídeo: ${newAula.link_video}\n\nTe vemos lá!`
      );
    }

    res.status(201).json(newAula);
  });

  app.put('/api/aulas/:id', (req, res) => {
    const { id } = req.params;
    const { status, data_hora, link_video } = req.body;
    
    const updated = db.updateAula(id, { status, data_hora, link_video });
    if (!updated) {
      return res.status(404).json({ error: 'Aula não encontrada' });
    }
    res.json(updated);
  });

  app.delete('/api/aulas/:id', (req, res) => {
    const { id } = req.params;
    db.deleteAula(id);
    res.json({ success: true });
  });

  // Package & Billing Endpoints
  app.get('/api/pacotes/:alunoId', (req, res) => {
    const { alunoId } = req.params;
    const studentPacotes = db.getPacotes().filter(p => p.aluno_id === alunoId);
    res.json(studentPacotes);
  });

  app.post('/api/pacotes', (req, res) => {
    const { aluno_id, quantidade_aulas, valor, vencimento } = req.body;
    if (!aluno_id || !quantidade_aulas || !valor) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando.' });
    }

    const newPacId = `pac-${Date.now()}`;
    const newPac: Pacote = {
      id: newPacId,
      aluno_id,
      quantidade_aulas: Number(quantidade_aulas),
      aulas_consumidas: 0,
      valor: Number(valor),
      vencimento: vencimento || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
      status: 'ativo'
    };

    db.addPacote(newPac);

    // Create a pending invoice
    db.addPagamento({
      id: `pag-${Date.now()}`,
      aluno_id,
      pacote_id: newPacId,
      valor: Number(valor),
      data: new Date().toISOString().substring(0, 10),
      status: 'pendente'
    });

    res.status(201).json(newPac);
  });

  // Mark invoice/payment status manually (control de pagamento)
  app.get('/api/pagamentos', (req, res) => {
    const { professor_id } = req.query;
    if (!professor_id) {
      return res.status(400).json({ error: 'ID do professor é obrigatório.' });
    }

    // Filter payments belonging to teacher's students
    const teacherStudentIds = db.getAlunos()
      .filter(a => a.professor_id === professor_id)
      .map(a => a.id);

    const payments = db.getPagamentos()
      .filter(p => teacherStudentIds.includes(p.aluno_id))
      .map(p => {
        const student = db.getAlunos().find(a => a.id === p.aluno_id);
        const pac = db.getPacotes().find(pac => pac.id === p.pacote_id);
        return {
          ...p,
          aluno_nome: student ? student.nome : 'Desconhecido',
          pacote_detalhes: pac ? `${pac.quantidade_aulas} aulas` : 'Pacote de Aulas'
        };
      })
      .sort((a,b) => b.data.localeCompare(a.data));

    res.json(payments);
  });

  app.put('/api/pagamentos/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    const updated = db.updatePagamento(id, { status });
    if (!updated) {
      return res.status(404).json({ error: 'Fatura não encontrada' });
    }

    // Se marcou como em dia, enviar simulação de recibo
    if (status === 'em_dia') {
      const student = db.getAlunos().find(a => a.id === updated.aluno_id);
      if (student) {
        logEmail(
          student.email,
          `🧾 Recibo de Pagamento Confirmado`,
          `Olá ${student.nome},\n\nConfirmamos o recebimento do seu pagamento no valor de R$ ${updated.valor.toFixed(2)} referente ao seu pacote de aulas.\n\nAgradecemos a parceria!\n\nProfa. Helena Santos`
        );
      }
    }

    res.json(updated);
  });

  // Base64 Simple PDF Upload Simulator
  app.post('/api/upload', (req, res) => {
    const { filename, fileData } = req.body;
    if (!filename) {
      return res.status(400).json({ error: 'Nome do arquivo é obrigatório.' });
    }

    const fileExt = path.extname(filename).toLowerCase() || '.pdf';
    const cleanName = `${path.basename(filename, fileExt).replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}${fileExt}`;
    const destinationPath = path.join(uploadsDir, cleanName);

    try {
      if (fileData) {
        // base64 content
        const base64Data = fileData.replace(/^data:application\/pdf;base64,/, "");
        fs.writeFileSync(destinationPath, base64Data, 'base64');
      } else {
        // dummy PDF file content if no data provided
        fs.writeFileSync(destinationPath, '%PDF-1.4 [Simulated Language PDF Material]');
      }

      res.json({
        success: true,
        arquivo_url: `/uploads/${cleanName}`,
        filename: cleanName
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao salvar o arquivo.' });
    }
  });

  // Email inspecting API
  app.get('/api/emails', (req, res) => {
    const { to } = req.query;
    let list = db.getEmails();
    if (to) {
      list = list.filter(e => e.to.toLowerCase() === (to as string).toLowerCase());
    }
    res.json(list.sort((a,b) => b.sent_at.localeCompare(a.sent_at)));
  });

  // Cron triggering endpoint (Force trigger of pg_cron 24h lesson reminder)
  app.post('/api/cron/reminder', (req, res) => {
    const sent = runCronReminders();
    res.json({
      success: true,
      message: `pg_cron verificado com sucesso. Foram disparados ${sent.length} lembrete(s) de aula para as próximas 24h.`,
      emails: sent
    });
  });

  // ----------------- VITE MIDDLEWARE SETUP -----------------

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Periodic simulated check (every 5 minutes we check pg_cron)
  setInterval(() => {
    try {
      runCronReminders();
    } catch (err) {
      console.error('Error running automated pg_cron cycle:', err);
    }
  }, 5 * 60 * 1000);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    // Run reminder immediately on start
    try {
      runCronReminders();
    } catch (_) {}
  });
}

startServer();
