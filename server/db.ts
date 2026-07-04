import fs from 'fs';
import path from 'path';
import { Professor, Aluno, Curso, Modulo, Matricula, Progresso, Pacote, Aula, Pagamento, EmailLog } from '../src/types';

const DB_FILE = path.join(process.cwd(), 'db.json');

export interface DatabaseSchema {
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

const defaultDb: DatabaseSchema = {
  professores: [
    { id: 'prof-helena', nome: 'Profa. Helena Santos', email: 'helena@idiomas.com', criado_em: '2026-06-01T10:00:00Z' },
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
    // Inglês
    { id: 'mod-ing1', curso_id: 'curso-ingles', ordem: 1, titulo: 'Present Perfect in Executive Chats', descricao: 'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.', arquivo_url: '/uploads/ingles_modulo1.pdf' },
    { id: 'mod-ing2', curso_id: 'curso-ingles', ordem: 2, titulo: 'Business Negotiation Tactics', descricao: 'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.', arquivo_url: '/uploads/ingles_modulo2.pdf' },
    { id: 'mod-ing3', curso_id: 'curso-ingles', ordem: 3, titulo: 'Advanced Report Writing', descricao: 'Como estruturar relatórios executivos formais com conectores lógicos avançados.', arquivo_url: '/uploads/ingles_modulo3.pdf' },
    // Espanhol
    { id: 'mod-esp1', curso_id: 'curso-espanhol', ordem: 1, titulo: 'Saludos y Presentaciones de Negocios', descricao: 'Primeiros contatos, saudações formais e apresentações no ambiente profissional.', arquivo_url: '/uploads/espanhol_modulo1.pdf' },
    { id: 'mod-esp2', curso_id: 'curso-espanhol', ordem: 2, titulo: 'La Gramática del Éxito', descricao: 'Expressando opiniões com o subjuntivo de forma polida e estruturada.', arquivo_url: '/uploads/espanhol_modulo2.pdf' },
    // Italiano
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
    // Schedule one class exactly 24 hours in the future based on: 2026-07-04T07:51:42-07:00
    // 2026-07-05T15:00:00 is ideal
    { id: 'aula-carlos-2', professor_id: 'prof-helena', aluno_id: 'aluno-carlos', pacote_id: 'pac-carlos', data_hora: '2026-07-05T15:00:00', status: 'agendada', link_video: 'https://meet.google.com/abc-defg-hij' },
    { id: 'aula-mariana-1', professor_id: 'prof-helena', aluno_id: 'aluno-mariana', pacote_id: 'pac-mariana', data_hora: '2026-07-06T10:00:00', status: 'agendada', link_video: 'https://meet.google.com/xyz-uvwx-yza' }
  ],
  pagamentos: [
    { id: 'pag-carlos-1', aluno_id: 'aluno-carlos', pacote_id: 'pac-carlos', valor: 800, data: '2026-06-10', status: 'em_dia' },
    { id: 'pag-mariana-1', aluno_id: 'aluno-mariana', pacote_id: 'pac-mariana', valor: 450, data: '2026-06-12', status: 'pendente' },
    { id: 'pag-giulia-1', aluno_id: 'aluno-giulia', pacote_id: 'pac-giulia', valor: 960, data: '2026-05-30', status: 'em_dia' }
  ],
  emails: [
    { id: 'email-1', to: 'carlos@aluno.com', subject: 'Matrícula Ativada - Inglês Avançado', body: 'Olá Carlos, sua matrícula no curso Inglês Avançado para Negócios foi ativada pela Profa. Helena Santos. Bons estudos!', sent_at: '2026-06-10T10:05:00Z' }
  ],
  auth_credentials: {
    'helena@idiomas.com': { role: 'professor', userId: 'prof-helena', passwordHash: 'admin' },
    'marcus@idiomas.com': { role: 'professor', userId: 'prof-marcus', passwordHash: 'admin' },
    'carlos@aluno.com': { role: 'aluno', userId: 'aluno-carlos', passwordHash: 'aluno' },
    'mariana@aluno.com': { role: 'aluno', userId: 'aluno-mariana', passwordHash: 'aluno' },
    'giulia@aluno.com': { role: 'aluno', userId: 'aluno-giulia', passwordHash: 'aluno' }
  }
};

export class JSONDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = { ...defaultDb };
    this.load();
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error reading database file:', err);
      this.data = { ...defaultDb };
    }
  }

  public save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  // Getters
  public getProfessores() { return this.data.professores; }
  public getAlunos() { return this.data.alunos; }
  public getCursos() { return this.data.cursos; }
  public getModulos() { return this.data.modulos; }
  public getMatriculas() { return this.data.matriculas; }
  public getProgresso() { return this.data.progresso; }
  public getPacotes() { return this.data.pacotes; }
  public getAulas() { return this.data.aulas; }
  public getPagamentos() { return this.data.pagamentos; }
  public getEmails() { return this.data.emails; }
  public getCredentials() { return this.data.auth_credentials; }

  // Setters/pushers
  public addProfessor(prof: Professor) {
    this.data.professores.push(prof);
    this.save();
  }

  public addAluno(aluno: Aluno) {
    this.data.alunos.push(aluno);
    this.save();
  }

  public updateAluno(id: string, updated: Partial<Aluno>) {
    const idx = this.data.alunos.findIndex(a => a.id === id);
    if (idx !== -1) {
      this.data.alunos[idx] = { ...this.data.alunos[idx], ...updated };
      this.save();
      return this.data.alunos[idx];
    }
    return null;
  }

  public deleteAluno(id: string) {
    this.data.alunos = this.data.alunos.filter(a => a.id !== id);
    this.data.matriculas = this.data.matriculas.filter(m => m.aluno_id !== id);
    this.data.pacotes = this.data.pacotes.filter(p => p.aluno_id !== id);
    this.data.aulas = this.data.aulas.filter(au => au.aluno_id !== id);
    this.data.pagamentos = this.data.pagamentos.filter(pa => pa.aluno_id !== id);
    this.save();
  }

  public addCurso(curso: Curso) {
    this.data.cursos.push(curso);
    this.save();
  }

  public updateCurso(id: string, nome: string) {
    const idx = this.data.cursos.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.cursos[idx].nome = nome;
      this.save();
      return this.data.cursos[idx];
    }
    return null;
  }

  public deleteCurso(id: string) {
    this.data.cursos = this.data.cursos.filter(c => c.id !== id);
    this.data.modulos = this.data.modulos.filter(m => m.curso_id !== id);
    this.data.matriculas = this.data.matriculas.filter(mat => mat.curso_id !== id);
    this.save();
  }

  public addModulo(mod: Modulo) {
    this.data.modulos.push(mod);
    this.save();
  }

  public updateModulo(id: string, updated: Partial<Modulo>) {
    const idx = this.data.modulos.findIndex(m => m.id === id);
    if (idx !== -1) {
      this.data.modulos[idx] = { ...this.data.modulos[idx], ...updated };
      this.save();
      return this.data.modulos[idx];
    }
    return null;
  }

  public deleteModulo(id: string) {
    this.data.modulos = this.data.modulos.filter(m => m.id !== id);
    this.save();
  }

  public addMatricula(mat: Matricula) {
    this.data.matriculas.push(mat);
    this.save();
  }

  public deleteMatricula(id: string) {
    this.data.matriculas = this.data.matriculas.filter(m => m.id !== id);
    this.save();
  }

  public addProgresso(prog: Progresso) {
    // Evita duplicados
    const exists = this.data.progresso.some(p => p.matricula_id === prog.matricula_id && p.modulo_id === prog.modulo_id);
    if (!exists) {
      this.data.progresso.push(prog);
      this.save();
    }
  }

  public removeProgresso(matricula_id: string, modulo_id: string) {
    this.data.progresso = this.data.progresso.filter(p => !(p.matricula_id === matricula_id && p.modulo_id === modulo_id));
    this.save();
  }

  public addPacote(pac: Pacote) {
    this.data.pacotes.push(pac);
    this.save();
  }

  public updatePacote(id: string, updated: Partial<Pacote>) {
    const idx = this.data.pacotes.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.pacotes[idx] = { ...this.data.pacotes[idx], ...updated };
      this.save();
      return this.data.pacotes[idx];
    }
    return null;
  }

  public addAula(aula: Aula) {
    this.data.aulas.push(aula);
    this.save();
  }

  public updateAula(id: string, updated: Partial<Aula>) {
    const idx = this.data.aulas.findIndex(a => a.id === id);
    if (idx !== -1) {
      const oldAula = this.data.aulas[idx];
      this.data.aulas[idx] = { ...oldAula, ...updated };

      // Se passou de 'agendada' para 'realizada', decrementa aulas_consumidas do pacote
      if (oldAula.status === 'agendada' && updated.status === 'realizada') {
        const pacId = oldAula.pacote_id;
        const pacIdx = this.data.pacotes.findIndex(p => p.id === pacId);
        if (pacIdx !== -1) {
          this.data.pacotes[pacIdx].aulas_consumidas += 1;
          if (this.data.pacotes[pacIdx].aulas_consumidas >= this.data.pacotes[pacIdx].quantidade_aulas) {
            this.data.pacotes[pacIdx].status = 'expirado';
          }
        }
      }
      
      this.save();
      return this.data.aulas[idx];
    }
    return null;
  }

  public deleteAula(id: string) {
    this.data.aulas = this.data.aulas.filter(a => a.id !== id);
    this.save();
  }

  public addPagamento(pag: Pagamento) {
    this.data.pagamentos.push(pag);
    this.save();
  }

  public updatePagamento(id: string, updated: Partial<Pagamento>) {
    const idx = this.data.pagamentos.findIndex(p => p.id === id);
    if (idx !== -1) {
      this.data.pagamentos[idx] = { ...this.data.pagamentos[idx], ...updated };
      this.save();
      return this.data.pagamentos[idx];
    }
    return null;
  }

  public addEmailLog(email: EmailLog) {
    this.data.emails.push(email);
    this.save();
  }

  public registerCredential(email: string, info: { role: 'professor' | 'aluno'; userId: string; passwordHash: string }) {
    this.data.auth_credentials[email.toLowerCase()] = info;
    this.save();
  }
}

export const db = new JSONDatabase();
export default db;
