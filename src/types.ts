export interface Professor {
  id: string;
  nome: string;
  email: string;
  criado_em: string;
}

export interface Aluno {
  id: string;
  nome: string;
  email: string;
  professor_id: string;
  criado_em: string;
  // Extra properties computed or loaded
  curso_nome?: string;
  proxima_aula?: string;
  aulas_restantes?: number;
  pagamento_status?: 'em_dia' | 'pendente' | 'atrasado';
}

export interface Curso {
  id: string;
  professor_id: string;
  nome: string;
  criado_em: string;
  modulos_count?: number;
}

export interface Modulo {
  id: string;
  curso_id: string;
  ordem: number;
  titulo: string;
  descricao: string;
  arquivo_url: string; // URL for the PDF
}

export interface Matricula {
  id: string;
  aluno_id: string;
  curso_id: string;
  criado_em: string;
}

export interface Progresso {
  id: string;
  matricula_id: string;
  modulo_id: string;
  liberado_em: string;
  liberado_por: 'manual';
}

export interface Pacote {
  id: string;
  aluno_id: string;
  quantidade_aulas: number;
  aulas_consumidas: number;
  valor: number;
  vencimento: string;
  status: 'ativo' | 'expirado';
}

export interface Aula {
  id: string;
  professor_id: string;
  aluno_id: string;
  pacote_id: string;
  data_hora: string;
  status: 'agendada' | 'realizada' | 'cancelada';
  link_video: string;
  // Join property
  aluno_nome?: string;
}

export interface Pagamento {
  id: string;
  aluno_id: string;
  pacote_id: string;
  valor: number;
  data: string;
  status: 'em_dia' | 'pendente' | 'atrasado';
}

// Session representation
export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  role: 'professor' | 'aluno';
  professor_id?: string; // For Aluno, reference their teacher
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sent_at: string;
}
