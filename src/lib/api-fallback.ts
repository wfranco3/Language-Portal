import { Professor, Aluno, Curso, Modulo, Matricula, Progresso, Pacote, Aula, Pagamento, EmailLog } from '../types';

// Client-side representation of the Database Schema
interface DatabaseSchema {
  professores: Professor[];
  alunos: Aluno[];
  cursos: Curso[];
  modulos: Modulo[];
  matriculas: Matricula[];
  progresso: Progresso[];
  pacotes: Pacote[];
  aulas: Aula[];
  pagamentos: Pagamento[];
  emails: EmailLog[];
  auth_credentials: Record<string, { role: 'professor' | 'aluno'; userId: string; passwordHash: string }>;
}

const SEED_DB: DatabaseSchema = {
  professores: [
    { id: 'prof-helena', nome: 'Meella Abdullah', email: 'meella@idiomas.com', criado_em: '2026-06-01T10:00:00Z' },
    { id: 'prof-marcus', nome: 'Prof. Marcus Aurelius', email: 'marcus@idiomas.com', criado_em: '2026-06-05T12:00:00Z' }
  ],
  alunos: [
    { id: 'aluno-carlos', nome: 'Carlos Silva', email: 'carlos@aluno.com', professor_id: 'prof-helena', criado_em: '2026-06-10T09:00:00Z' },
    { id: 'aluno-mariana', nome: 'Mariana Souza', email: 'mariana@aluno.com', professor_id: 'prof-helena', criado_em: '2026-06-11T14:30:00Z' },
    { id: 'aluno-giulia', nome: 'Giulia Costa', email: 'giulia@aluno.com', professor_id: 'prof-marcus', criado_em: '2026-06-12T11:00:00Z' }
  ],
  cursos: [
    { id: 'curso-ingles', professor_id: 'prof-helena', nome: 'Inglês Avançado para Negócios', criado_em: '2026-06-02T10:00:00Z' },
    { id: 'curso-espanhol', professor_id: 'prof-helena', nome: 'Espanhol Fluente', criado_em: '2026-06-03T11:00:00Z' },
    { id: 'curso-italiano', professor_id: 'prof-marcus', nome: 'Italiano Prático', criado_em: '2026-06-06T15:00:00Z' }
  ],
  modulos: [
    { id: 'mod-ing1', curso_id: 'curso-ingles', ordem: 1, titulo: 'Present Perfect in Executive Chats', descricao: 'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.', arquivo_url: '/uploads/ingles_modulo1.pdf' },
    { id: 'mod-ing2', curso_id: 'curso-ingles', ordem: 2, titulo: 'Business Negotiation Tactics', descricao: 'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.', arquivo_url: '/uploads/ingles_modulo2.pdf' },
    { id: 'mod-ing3', curso_id: 'curso-ingles', ordem: 3, titulo: 'Advanced Report Writing', descricao: 'Como estruturar relatórios executivos formais com conectores lógicos avançados.', arquivo_url: '/uploads/ingles_modulo3.pdf' },
    { id: 'mod-esp1', curso_id: 'curso-espanhol', ordem: 1, titulo: 'Saludos y Presentaciones de Negocios', descricao: 'Primeiros contatos, saudações formais e apresentações no ambiente profissional.', arquivo_url: '/uploads/espanhol_modulo1.pdf' },
    { id: 'mod-esp2', curso_id: 'curso-espanhol', ordem: 2, titulo: 'La Gramática del Éxito', descricao: 'Expressando opiniões com o subjuntivo de forma polida e estruturada.', arquivo_url: '/uploads/espanhol_modulo2.pdf' },
    { id: 'mod-ita1', curso_id: 'curso-italiano', ordem: 1, titulo: 'Introduzione alla Lingua', descricao: 'Pronúncia básica, cumprimentos e situações cotidianas simples.', arquivo_url: '/uploads/italiano_modulo1.pdf' }
  ],
  matriculas: [
    { id: 'mat-carlos', aluno_id: 'aluno-carlos', curso_id: 'curso-ingles', criado_em: '2026-06-10T10:00:00Z' },
    { id: 'mat-mariana', aluno_id: 'aluno-mariana', curso_id: 'curso-espanhol', criado_em: '2026-06-12T15:00:00Z' },
    { id: 'mat-giulia', aluno_id: 'aluno-giulia', curso_id: 'curso-italiano', criado_em: '2026-06-13T12:00:00Z' }
  ],
  progresso: [
    { id: 'prog-c1', matricula_id: 'mat-carlos', modulo_id: 'mod-ing1', liberado_em: '2026-06-10T10:05:00Z', liberado_por: 'manual' },
    { id: 'prog-c2', matricula_id: 'mat-carlos', modulo_id: 'mod-ing2', liberado_em: '2026-06-15T16:00:00Z', liberado_por: 'manual' },
    { id: 'prog-m1', matricula_id: 'mat-mariana', modulo_id: 'mod-esp1', liberado_em: '2026-06-12T15:05:00Z', liberado_por: 'manual' },
    { id: 'prog-g1', matricula_id: 'mat-giulia', modulo_id: 'mod-ita1', liberado_em: '2026-06-13T12:05:00Z', liberado_por: 'manual' }
  ],
  pacotes: [
    { id: 'pac-carlos', aluno_id: 'aluno-carlos', quantidade_aulas: 10, aulas_consumidas: 6, valor: 800, vencimento: '2026-08-10', status: 'ativo' },
    { id: 'pac-mariana', aluno_id: 'aluno-mariana', quantidade_aulas: 5, aulas_consumidas: 1, valor: 450, vencimento: '2026-07-25', status: 'ativo' },
    { id: 'pac-giulia', aluno_id: 'aluno-giulia', quantidade_aulas: 12, aulas_consumidas: 12, valor: 960, vencimento: '2026-06-30', status: 'expirado' }
  ],
  aulas: [
    { id: 'aula-carlos-1', professor_id: 'prof-helena', aluno_id: 'aluno-carlos', pacote_id: 'pac-carlos', data_hora: '2026-07-02T14:00:00', status: 'realizada', link_video: 'https://meet.google.com/abc-defg-hij' },
    { id: 'aula-carlos-2', professor_id: 'prof-helena', aluno_id: 'aluno-carlos', pacote_id: 'pac-carlos', data_hora: '2026-07-05T15:00:00', status: 'agendada', link_video: 'https://meet.google.com/abc-defg-hij' },
    { id: 'aula-mariana-1', professor_id: 'prof-helena', aluno_id: 'aluno-mariana', pacote_id: 'pac-mariana', data_hora: '2026-07-06T10:00:00', status: 'agendada', link_video: 'https://meet.google.com/xyz-uvwx-yza' }
  ],
  pagamentos: [
    { id: 'pag-carlos-1', aluno_id: 'aluno-carlos', pacote_id: 'pac-carlos', valor: 800, data: '2026-06-10', status: 'em_dia' },
    { id: 'pag-mariana-1', aluno_id: 'aluno-mariana', pacote_id: 'pac-mariana', valor: 450, data: '2026-06-12', status: 'pendente' },
    { id: 'pag-giulia-1', aluno_id: 'aluno-giulia', pacote_id: 'pac-giulia', valor: 960, data: '2026-05-30', status: 'em_dia' }
  ],
  emails: [
    { id: 'email-1', to: 'carlos@aluno.com', subject: 'Matrícula Ativada - Inglês Avançado', body: 'Olá Carlos, sua matrícula no curso Inglês Avançado para Negócios foi ativada por Meella Abdullah. Bons estudos!', sent_at: '2026-06-10T10:05:00Z' }
  ],
  auth_credentials: {
    'helena@idiomas.com': { role: 'professor', userId: 'prof-helena', passwordHash: 'admin' },
    'meella@idiomas.com': { role: 'professor', userId: 'prof-helena', passwordHash: 'admin' },
    'marcus@idiomas.com': { role: 'professor', userId: 'prof-marcus', passwordHash: 'admin' },
    'carlos@aluno.com': { role: 'aluno', userId: 'aluno-carlos', passwordHash: 'aluno' },
    'mariana@aluno.com': { role: 'aluno', userId: 'aluno-mariana', passwordHash: 'aluno' },
    'giulia@aluno.com': { role: 'aluno', userId: 'aluno-giulia', passwordHash: 'aluno' }
  }
};

const STORAGE_KEY = 'plat_idiomas_db';

function getLocalData(): DatabaseSchema {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data) as DatabaseSchema;
      let modified = false;

      // Migrate existing local storage to the new teacher details
      const profHelena = parsed.professores.find(p => p.id === 'prof-helena');
      if (profHelena && (profHelena.nome !== 'Meella Abdullah' || profHelena.email !== 'meella@idiomas.com')) {
        profHelena.nome = 'Meella Abdullah';
        profHelena.email = 'meella@idiomas.com';
        modified = true;
      }

      if (!parsed.auth_credentials['meella@idiomas.com']) {
        parsed.auth_credentials['meella@idiomas.com'] = { role: 'professor', userId: 'prof-helena', passwordHash: 'admin' };
        modified = true;
      }

      if (!parsed.auth_credentials['helena@idiomas.com']) {
        parsed.auth_credentials['helena@idiomas.com'] = { role: 'professor', userId: 'prof-helena', passwordHash: 'admin' };
        modified = true;
      }

      if (modified) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }

      return parsed;
    }
  } catch (e) {
    console.error('Failed to load local DB, falling back to seed data:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DB));
  return SEED_DB;
}

function saveLocalData(data: DatabaseSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save local DB:', e);
  }
}

// Transparently handle local API mock calls
async function handleLocalApiRequest(urlString: string, init?: RequestInit): Promise<Response> {
  const dbData = getLocalData();
  const url = new URL(urlString, window.location.origin);
  const path = url.pathname;
  const searchParams = url.searchParams;
  const method = init?.method?.toUpperCase() || 'GET';
  const body = init?.body ? JSON.parse(init.body as string) : null;

  console.log(`[API Fallback - Local Simulation] ${method} ${path}`, { body });

  // Response factory helpers
  const jsonResponse = (data: any, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const errorResponse = (message: string, status = 400) => {
    return jsonResponse({ error: message }, status);
  };

  try {
    // 1. POST /api/auth/login
    if (path === '/api/auth/login' && method === 'POST') {
      const { email, password } = body || {};
      if (!email || !password) {
        return errorResponse('E-mail e senha são obrigatórios.', 400);
      }
      const userCreds = dbData.auth_credentials[email.toLowerCase()];
      if (!userCreds || userCreds.passwordHash !== password) {
        return errorResponse('Credenciais inválidas.', 401);
      }

      let userDetails = null;
      if (userCreds.role === 'professor') {
        userDetails = dbData.professores.find(p => p.id === userCreds.userId);
      } else {
        userDetails = dbData.alunos.find(a => a.id === userCreds.userId);
      }

      if (!userDetails) {
        return errorResponse('Detalhes do usuário não encontrados.', 404);
      }

      return jsonResponse({
        id: userCreds.userId,
        nome: userDetails.nome,
        email: userDetails.email,
        role: userCreds.role,
        professor_id: userCreds.role === 'aluno' ? (userDetails as Aluno).professor_id : undefined
      });
    }

    // 2. GET /api/alunos
    if (path === '/api/alunos' && method === 'GET') {
      const professor_id = searchParams.get('professor_id');
      if (!professor_id) {
        return errorResponse('ID do professor é obrigatório.', 400);
      }

      const teacherAlunos = dbData.alunos.filter(a => a.professor_id === professor_id);
      const enriched = teacherAlunos.map(student => {
        const matricula = dbData.matriculas.find(m => m.aluno_id === student.id);
        const curso = matricula ? dbData.cursos.find(c => c.id === matricula.curso_id) : null;
        const studentPacotes = dbData.pacotes.filter(p => p.aluno_id === student.id);
        const activePacote = studentPacotes.find(p => p.status === 'ativo') || studentPacotes[0];
        
        const aulas = dbData.aulas.filter(au => au.aluno_id === student.id && au.status === 'agendada');
        const proxima = aulas.length > 0 ? aulas.sort((a,b) => a.data_hora.localeCompare(b.data_hora))[0].data_hora : undefined;

        const pagamentos = dbData.pagamentos.filter(pa => pa.aluno_id === student.id);
        const currentPagamento = pagamentos.length > 0 ? pagamentos.sort((a,b) => b.data.localeCompare(a.data))[0] : null;

        return {
          ...student,
          curso_nome: curso ? curso.nome : 'Não matriculado',
          aulas_restantes: activePacote ? (activePacote.quantidade_aulas - activePacote.aulas_consumidas) : 0,
          proxima_aula: proxima,
          pagamento_status: currentPagamento ? currentPagamento.status : 'em_dia'
        };
      });

      return jsonResponse(enriched);
    }

    // 3. POST /api/alunos
    if (path === '/api/alunos' && method === 'POST') {
      const { nome, email, professor_id, curso_id, senha, quantidade_aulas, valor } = body || {};
      if (!nome || !email || !professor_id) {
        return errorResponse('Campos obrigatórios faltando.', 400);
      }

      if (dbData.auth_credentials[email.toLowerCase()]) {
        return errorResponse('Este e-mail já está em uso.', 400);
      }

      const newStudentId = `aluno-${Date.now()}`;
      const newStudent: Aluno = {
        id: newStudentId,
        nome,
        email: email.toLowerCase(),
        professor_id,
        criado_em: new Date().toISOString()
      };

      dbData.alunos.push(newStudent);
      dbData.auth_credentials[email.toLowerCase()] = {
        role: 'aluno',
        userId: newStudentId,
        passwordHash: senha || 'aluno'
      };

      if (curso_id) {
        dbData.matriculas.push({
          id: `mat-${Date.now()}`,
          aluno_id: newStudentId,
          curso_id,
          criado_em: new Date().toISOString()
        });
      }

      if (quantidade_aulas) {
        const newPacId = `pac-${Date.now()}`;
        dbData.pacotes.push({
          id: newPacId,
          aluno_id: newStudentId,
          quantidade_aulas: Number(quantidade_aulas),
          aulas_consumidas: 0,
          valor: Number(valor || 0),
          vencimento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
          status: 'ativo'
        });

        dbData.pagamentos.push({
          id: `pag-${Date.now()}`,
          aluno_id: newStudentId,
          pacote_id: newPacId,
          valor: Number(valor || 0),
          data: new Date().toISOString().substring(0, 10),
          status: 'pendente'
        });
      }

      // Add email log simulation
      dbData.emails.push({
        id: `email-${Date.now()}`,
        to: email.toLowerCase(),
        subject: 'Bem-vindo(a) à Plataforma de Idiomas!',
        body: `Olá ${nome},\n\nSeu cadastro foi realizado com sucesso.\n\nSenha: ${senha || 'aluno'}\n\nBons estudos!`,
        sent_at: new Date().toISOString()
      });

      saveLocalData(dbData);
      return jsonResponse(newStudent, 201);
    }

    // 4. PUT /api/alunos/:id
    if (path.startsWith('/api/alunos/') && method === 'PUT') {
      const studentId = path.split('/').pop();
      const { nome, email } = body || {};
      const idx = dbData.alunos.findIndex(a => a.id === studentId);
      if (idx === -1) {
        return errorResponse('Aluno não encontrado.', 404);
      }
      dbData.alunos[idx] = { ...dbData.alunos[idx], nome, email: email?.toLowerCase() };
      saveLocalData(dbData);
      return jsonResponse(dbData.alunos[idx]);
    }

    // 5. DELETE /api/alunos/:id
    if (path.startsWith('/api/alunos/') && method === 'DELETE') {
      const studentId = path.split('/').pop();
      dbData.alunos = dbData.alunos.filter(a => a.id !== studentId);
      dbData.matriculas = dbData.matriculas.filter(m => m.aluno_id !== studentId);
      dbData.pacotes = dbData.pacotes.filter(p => p.aluno_id !== studentId);
      dbData.aulas = dbData.aulas.filter(a => a.aluno_id !== studentId);
      dbData.pagamentos = dbData.pagamentos.filter(p => p.aluno_id !== studentId);
      saveLocalData(dbData);
      return jsonResponse({ success: true });
    }

    // 6. GET /api/cursos
    if (path === '/api/cursos' && method === 'GET') {
      const professor_id = searchParams.get('professor_id');
      if (!professor_id) {
        return errorResponse('ID do professor é obrigatório.', 400);
      }
      const teacherCursos = dbData.cursos.filter(c => c.professor_id === professor_id);
      const enriched = teacherCursos.map(c => ({
        ...c,
        modulos_count: dbData.modulos.filter(m => m.curso_id === c.id).length
      }));
      return jsonResponse(enriched);
    }

    // 7. POST /api/cursos
    if (path === '/api/cursos' && method === 'POST') {
      const { professor_id, nome } = body || {};
      if (!professor_id || !nome) {
        return errorResponse('Campos obrigatórios faltando.', 400);
      }
      const newCurso: Curso = {
        id: `curso-${Date.now()}`,
        professor_id,
        nome,
        criado_em: new Date().toISOString()
      };
      dbData.cursos.push(newCurso);
      saveLocalData(dbData);
      return jsonResponse(newCurso, 201);
    }

    // 8. DELETE /api/cursos/:id
    if (path.startsWith('/api/cursos/') && method === 'DELETE') {
      const courseId = path.split('/').pop();
      dbData.cursos = dbData.cursos.filter(c => c.id !== courseId);
      dbData.modulos = dbData.modulos.filter(m => m.curso_id !== courseId);
      dbData.matriculas = dbData.matriculas.filter(m => m.curso_id !== courseId);
      saveLocalData(dbData);
      return jsonResponse({ success: true });
    }

    // 9. GET /api/cursos/:cursoId/modulos
    if (path.startsWith('/api/cursos/') && path.endsWith('/modulos') && method === 'GET') {
      const segments = path.split('/');
      const cursoId = segments[segments.indexOf('cursos') + 1];
      const courseModulos = dbData.modulos
        .filter(m => m.curso_id === cursoId)
        .sort((a,b) => a.ordem - b.ordem);
      return jsonResponse(courseModulos);
    }

    // 10. POST /api/cursos/:cursoId/modulos
    if (path.startsWith('/api/cursos/') && path.endsWith('/modulos') && method === 'POST') {
      const segments = path.split('/');
      const cursoId = segments[segments.indexOf('cursos') + 1];
      const { titulo, descricao, arquivo_url, ordem } = body || {};

      if (!titulo || !descricao) {
        return errorResponse('Título e descrição são obrigatórios.', 400);
      }

      let nextOrdem = Number(ordem);
      if (!nextOrdem) {
        const existing = dbData.modulos.filter(m => m.curso_id === cursoId);
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

      dbData.modulos.push(newMod);
      saveLocalData(dbData);
      return jsonResponse(newMod, 201);
    }

    // 11. DELETE /api/modulos/:id
    if (path.startsWith('/api/modulos/') && method === 'DELETE') {
      const id = path.split('/').pop();
      dbData.modulos = dbData.modulos.filter(m => m.id !== id);
      saveLocalData(dbData);
      return jsonResponse({ success: true });
    }

    // 12. GET /api/aluno-conteudo/:alunoId
    if (path.startsWith('/api/aluno-conteudo/') && method === 'GET') {
      const alunoId = path.split('/').pop();
      const student = dbData.alunos.find(a => a.id === alunoId);
      if (!student) {
        return errorResponse('Aluno não encontrado.', 404);
      }

      const matricula = dbData.matriculas.find(m => m.aluno_id === alunoId);
      if (!matricula) {
        return jsonResponse({ curso: null, modulos: [] });
      }

      const curso = dbData.cursos.find(c => c.id === matricula.curso_id);
      if (!curso) {
        return jsonResponse({ curso: null, modulos: [] });
      }

      const modulos = dbData.modulos
        .filter(m => m.curso_id === curso.id)
        .sort((a,b) => a.ordem - b.ordem);

      const progressoes = dbData.progresso.filter(p => p.matricula_id === matricula.id);
      const modulosEnriched = modulos.map(m => {
        const prog = progressoes.find(p => p.modulo_id === m.id);
        return {
          ...m,
          liberado: !!prog,
          liberado_em: prog ? prog.liberado_em : null
        };
      });

      return jsonResponse({
        curso,
        matricula,
        modulos: modulosEnriched
      });
    }

    // 13. POST /api/progresso/liberar
    if (path === '/api/progresso/liberar' && method === 'POST') {
      const { matricula_id, modulo_id } = body || {};
      if (!matricula_id || !modulo_id) {
        return errorResponse('Campos obrigatórios faltando.', 400);
      }

      const exists = dbData.progresso.some(p => p.matricula_id === matricula_id && p.modulo_id === modulo_id);
      const newProg = {
        id: `prog-${Date.now()}`,
        matricula_id,
        modulo_id,
        liberado_em: new Date().toISOString(),
        liberado_por: 'manual' as const
      };

      if (!exists) {
        dbData.progresso.push(newProg);
      }

      // Simulate Email Log
      const mat = dbData.matriculas.find(m => m.id === matricula_id);
      const mod = dbData.modulos.find(m => m.id === modulo_id);
      if (mat && mod) {
        const student = dbData.alunos.find(a => a.id === mat.aluno_id);
        if (student) {
          dbData.emails.push({
            id: `email-${Date.now()}`,
            to: student.email,
            subject: `📚 Novo material liberado: ${mod.titulo}`,
            body: `Olá ${student.nome},\n\nSua professora liberou um novo material de estudo: "${mod.titulo}".\n\nBons estudos!`,
            sent_at: new Date().toISOString()
          });
        }
      }

      saveLocalData(dbData);
      return jsonResponse({ success: true, progresso: newProg });
    }

    // 14. POST /api/progresso/bloquear
    if (path === '/api/progresso/bloquear' && method === 'POST') {
      const { matricula_id, modulo_id } = body || {};
      if (!matricula_id || !modulo_id) {
        return errorResponse('Campos obrigatórios faltando.', 400);
      }
      dbData.progresso = dbData.progresso.filter(p => !(p.matricula_id === matricula_id && p.modulo_id === modulo_id));
      saveLocalData(dbData);
      return jsonResponse({ success: true });
    }

    // 15. GET /api/aulas
    if (path === '/api/aulas' && method === 'GET') {
      const professor_id = searchParams.get('professor_id');
      const aluno_id = searchParams.get('aluno_id');
      let list = dbData.aulas;

      if (professor_id) {
        list = list.filter(a => a.professor_id === professor_id);
      }
      if (aluno_id) {
        list = list.filter(a => a.aluno_id === aluno_id);
      }

      const enriched = list.map(aula => {
        const student = dbData.alunos.find(a => a.id === aula.aluno_id);
        return {
          ...aula,
          aluno_nome: student ? student.nome : 'Desconhecido'
        };
      }).sort((a,b) => a.data_hora.localeCompare(b.data_hora));

      return jsonResponse(enriched);
    }

    // 16. POST /api/aulas
    if (path === '/api/aulas' && method === 'POST') {
      const { professor_id, aluno_id, data_hora, link_video } = body || {};
      if (!professor_id || !aluno_id || !data_hora) {
        return errorResponse('Campos obrigatórios faltando.', 400);
      }

      const pacotes = dbData.pacotes.filter(p => p.aluno_id === aluno_id);
      const activePacote = pacotes.find(p => p.status === 'ativo');

      if (!activePacote) {
        return errorResponse('Este aluno não possui nenhum pacote de aulas ativo. Crie um pacote primeiro!', 400);
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

      dbData.aulas.push(newAula);

      // Simulated Email
      const student = dbData.alunos.find(a => a.id === aluno_id);
      if (student) {
        dbData.emails.push({
          id: `email-${Date.now()}`,
          to: student.email,
          subject: '📅 Nova aula agendada!',
          body: `Olá ${student.nome},\n\nSua próxima aula foi agendada para o dia ${new Date(data_hora).toLocaleDateString('pt-BR')} às ${data_hora.substring(11, 16)}.\n\nLink do vídeo: ${newAula.link_video}`,
          sent_at: new Date().toISOString()
        });
      }

      saveLocalData(dbData);
      return jsonResponse(newAula, 201);
    }

    // 17. PUT /api/aulas/:id
    if (path.startsWith('/api/aulas/') && method === 'PUT') {
      const aulaId = path.split('/').pop();
      const { status, data_hora, link_video } = body || {};
      const idx = dbData.aulas.findIndex(a => a.id === aulaId);
      if (idx === -1) {
        return errorResponse('Aula não encontrada.', 404);
      }

      const oldAula = dbData.aulas[idx];
      dbData.aulas[idx] = { ...oldAula, status, data_hora, link_video };

      if (oldAula.status === 'agendada' && status === 'realizada') {
        const pacId = oldAula.pacote_id;
        const pacIdx = dbData.pacotes.findIndex(p => p.id === pacId);
        if (pacIdx !== -1) {
          dbData.pacotes[pacIdx].aulas_consumidas += 1;
          if (dbData.pacotes[pacIdx].aulas_consumidas >= dbData.pacotes[pacIdx].quantidade_aulas) {
            dbData.pacotes[pacIdx].status = 'expirado';
          }
        }
      }

      saveLocalData(dbData);
      return jsonResponse(dbData.aulas[idx]);
    }

    // 18. DELETE /api/aulas/:id
    if (path.startsWith('/api/aulas/') && method === 'DELETE') {
      const aulaId = path.split('/').pop();
      dbData.aulas = dbData.aulas.filter(a => a.id !== aulaId);
      saveLocalData(dbData);
      return jsonResponse({ success: true });
    }

    // 19. GET /api/pacotes/:alunoId
    if (path.startsWith('/api/pacotes/') && method === 'GET') {
      const alunoId = path.split('/').pop();
      const studentPacotes = dbData.pacotes.filter(p => p.aluno_id === alunoId);
      return jsonResponse(studentPacotes);
    }

    // 20. POST /api/pacotes
    if (path === '/api/pacotes' && method === 'POST') {
      const { aluno_id, quantidade_aulas, valor, vencimento } = body || {};
      if (!aluno_id || !quantidade_aulas || !valor) {
        return errorResponse('Campos obrigatórios faltando.', 400);
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

      dbData.pacotes.push(newPac);
      dbData.pagamentos.push({
        id: `pag-${Date.now()}`,
        aluno_id,
        pacote_id: newPacId,
        valor: Number(valor),
        data: new Date().toISOString().substring(0, 10),
        status: 'pendente'
      });

      saveLocalData(dbData);
      return jsonResponse(newPac, 201);
    }

    // 21. GET /api/pagamentos
    if (path === '/api/pagamentos' && method === 'GET') {
      const professor_id = searchParams.get('professor_id');
      if (!professor_id) {
        return errorResponse('ID do professor é obrigatório.', 400);
      }

      const teacherStudentIds = dbData.alunos
        .filter(a => a.professor_id === professor_id)
        .map(a => a.id);

      const payments = dbData.pagamentos
        .filter(p => teacherStudentIds.includes(p.aluno_id))
        .map(p => {
          const student = dbData.alunos.find(a => a.id === p.aluno_id);
          const pac = dbData.pacotes.find(pac => pac.id === p.pacote_id);
          return {
            ...p,
            aluno_nome: student ? student.nome : 'Desconhecido',
            pacote_detalhes: pac ? `${pac.quantidade_aulas} aulas` : 'Pacote de Aulas'
          };
        })
        .sort((a,b) => b.data.localeCompare(a.data));

      return jsonResponse(payments);
    }

    // 22. PUT /api/pagamentos/:id
    if (path.startsWith('/api/pagamentos/') && method === 'PUT') {
      const paymentId = path.split('/').pop();
      const { status } = body || {};
      const idx = dbData.pagamentos.findIndex(p => p.id === paymentId);
      if (idx === -1) {
        return errorResponse('Fatura não encontrada.', 404);
      }

      dbData.pagamentos[idx] = { ...dbData.pagamentos[idx], status };

      if (status === 'em_dia') {
        const student = dbData.alunos.find(a => a.id === dbData.pagamentos[idx].aluno_id);
        if (student) {
          dbData.emails.push({
            id: `email-${Date.now()}`,
            to: student.email,
            subject: '🧾 Recibo de Pagamento Confirmado',
            body: `Olá ${student.nome},\n\nConfirmamos o recebimento do seu pagamento no valor de R$ ${dbData.pagamentos[idx].valor.toFixed(2)} referente ao seu pacote de aulas.`,
            sent_at: new Date().toISOString()
          });
        }
      }

      saveLocalData(dbData);
      return jsonResponse(dbData.pagamentos[idx]);
    }

    // 23. GET /api/emails
    if (path === '/api/emails' && method === 'GET') {
      const to = searchParams.get('to');
      let list = dbData.emails;
      if (to) {
        list = list.filter(e => e.to.toLowerCase() === to.toLowerCase());
      }
      return jsonResponse(list.sort((a,b) => b.sent_at.localeCompare(a.sent_at)));
    }

    // 24. POST /api/upload
    if (path === '/api/upload' && method === 'POST') {
      const { filename } = body || {};
      const cleanName = filename ? `${filename.replace(/[^a-zA-Z0-9.]/g, '_')}` : `modulo_material_${Date.now()}.pdf`;
      return jsonResponse({
        success: true,
        arquivo_url: `/uploads/${cleanName}`,
        filename: cleanName
      });
    }

    // 25. POST /api/cron/reminder
    if (path === '/api/cron/reminder' && method === 'POST') {
      return jsonResponse({
        success: true,
        message: 'pg_cron verificado com sucesso. Sem aulas próximas nas próximas 24h.',
        emails: []
      });
    }

    // Unhandled API route
    return errorResponse(`Method ${method} on path ${path} is not implemented client-side.`, 501);

  } catch (err: any) {
    console.error('Error in local API handler:', err);
    return errorResponse(err.message || 'Error executing request client-side.', 500);
  }
}

// REDEFINE window.fetch ONLY if it doesn't exist yet, to avoid duplicate patching
const originalFetch = window.fetch;

export function initializeApiFallback() {
  if ((window as any).__api_fallback_initialized) return;
  (window as any).__api_fallback_initialized = true;

  console.log('[API Fallback] Initializing transparent offline/client-only fallback...');

  // Pre-seed local database
  getLocalData();

  const customFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const urlString = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    // We only intercept requests directed at '/api/'
    if (urlString.includes('/api/')) {
      try {
        const response = await originalFetch(input, init);

        // We check if the response is an HTML page (like from Vercel static routing) instead of JSON
        const contentType = response.headers.get('content-type') || '';
        
        if (!response.ok || contentType.includes('text/html')) {
          console.warn(`[API Fallback] Request to ${urlString} returned non-JSON/Error. Redirecting to client-side database.`);
          return await handleLocalApiRequest(urlString, init);
        }

        // Try parsing JSON to ensure it is valid, otherwise fallback
        const cloned = response.clone();
        try {
          await cloned.json();
          return response; // Valid JSON! Use real server.
        } catch (_) {
          console.warn(`[API Fallback] Request to ${urlString} returned invalid JSON. Redirecting to client-side database.`);
          return await handleLocalApiRequest(urlString, init);
        }

      } catch (err) {
        console.warn(`[API Fallback] Network failed on ${urlString}. Redirecting to client-side database.`, err);
        return await handleLocalApiRequest(urlString, init);
      }
    }

    // Non-api assets / pages go through the standard fetch route
    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, 'fetch', {
      value: customFetch,
      configurable: true,
      writable: true
    });
  } catch (err) {
    console.error('[API Fallback] Failed to redefine window.fetch via Object.defineProperty. Fallback might not work.', err);
    try {
      (window as any).fetch = customFetch;
    } catch (assignErr) {
      console.error('[API Fallback] Direct assignment of window.fetch failed too.', assignErr);
    }
  }
}
