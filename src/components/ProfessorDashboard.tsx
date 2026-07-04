import React, { useState, useEffect } from 'react';
import { AuthUser, Aluno, Curso, Modulo, Aula, Pagamento, EmailLog } from '../types';
import { 
  Users, BookOpen, Calendar, DollarSign, Plus, Trash2, Edit2, 
  Check, X, FileText, Upload, Send, RefreshCw, Eye, Sparkles, AlertCircle,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

interface ProfessorDashboardProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function ProfessorDashboard({ user, onLogout }: ProfessorDashboardProps) {
  const { t, language } = useLanguage();
  // Database States
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [emails, setEmails] = useState<EmailLog[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'alunos' | 'cursos' | 'agenda' | 'pagamentos'>('dashboard');
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [showAddAluno, setShowAddAluno] = useState(false);
  const [newAluno, setNewAluno] = useState({
    nome: '', email: '', curso_id: '', senha: 'aluno', quantidade_aulas: '10', valor: '800'
  });
  const [showAddCurso, setShowAddCurso] = useState(false);
  const [newCursoNome, setNewCursoNome] = useState('');

  const [selectedCursoId, setSelectedCursoId] = useState<string>('');
  const [modulosList, setModulosList] = useState<Modulo[]>([]);
  const [showAddModulo, setShowAddModulo] = useState(false);
  const [newModulo, setNewModulo] = useState({
    titulo: '', descricao: '', arquivo_url: '', ordem: ''
  });

  const [editingModulo, setEditingModulo] = useState<Modulo | null>(null);
  const [editModuloTitulo, setEditModuloTitulo] = useState('');
  const [editModuloDescricao, setEditModuloDescricao] = useState('');
  const [editModuloOrdem, setEditModuloOrdem] = useState('');

  const [showAddAula, setShowAddAula] = useState(false);
  const [newAula, setNewAula] = useState({
    aluno_id: '', data_hora: '', link_video: 'https://meet.google.com/abc-defg-hij'
  });

  const [uploadLoading, setUploadLoading] = useState(false);
  const [cronMessage, setCronMessage] = useState('');
  const [cronLoading, setCronLoading] = useState(false);

  // Student manual unlock grid state
  const [unlockStudent, setUnlockStudent] = useState<Aluno | null>(null);
  const [studentContent, setStudentContent] = useState<any>(null);

  // Calendar states
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarDate, setCalendarDate] = useState(new Date());

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const [selectedDateStr, setSelectedDateStr] = useState<string>(getTodayStr());

  const getCalendarDays = (year: number, month: number) => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // Sunday=0, Saturday=6
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();
    
    const days: { day: number; monthOffset: number; dateStr: string }[] = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDay = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDay).padStart(2, '0')}`;
      days.push({ day: prevDay, monthOffset: -1, dateStr });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, monthOffset: 0, dateStr });
    }
    
    // Next month days to fill up to a multiple of 7 or 42 cells
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, monthOffset: 1, dateStr });
    }
    
    return days;
  };

  const getAulasForDate = (dateStr: string) => {
    return aulas.filter(aula => {
      if (!aula.data_hora || typeof aula.data_hora !== 'string') return false;
      return aula.data_hora.substring(0, 10) === dateStr;
    });
  };

  const handlePrevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCalendarDate(new Date());
    setSelectedDateStr(getTodayStr());
  };

  const getMonthName = (monthIdx: number) => {
    const monthsPt = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthsEn = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthsId = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    if (language === 'pt') return monthsPt[monthIdx];
    if (language === 'id') return monthsId[monthIdx];
    return monthsEn[monthIdx];
  };

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'T12:00:00');
    const locale = language === 'pt' ? 'pt-BR' : language === 'id' ? 'id-ID' : 'en-US';
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Fetch all dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      const resAlunos = await fetch(`/api/alunos?professor_id=${user.id}`);
      const dataAlunos = await resAlunos.json();
      setAlunos(dataAlunos);

      const resCursos = await fetch(`/api/cursos?professor_id=${user.id}`);
      const dataCursos = await resCursos.json();
      setCursos(dataCursos);
      if (dataCursos.length > 0 && !selectedCursoId) {
        setSelectedCursoId(dataCursos[0].id);
      }

      const resAulas = await fetch(`/api/aulas?professor_id=${user.id}`);
      const dataAulas = await resAulas.json();
      setAulas(dataAulas);

      const resPagamentos = await fetch(`/api/pagamentos?professor_id=${user.id}`);
      const dataPagamentos = await resPagamentos.json();
      setPagamentos(dataPagamentos);

      const resEmails = await fetch('/api/emails');
      const dataEmails = await resEmails.json();
      setEmails(dataEmails);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  // Fetch modules when selected curso changes
  useEffect(() => {
    if (selectedCursoId) {
      fetch(`/api/cursos/${selectedCursoId}/modulos`)
        .then(res => res.json())
        .then(data => setModulosList(data))
        .catch(err => console.error(err));
    }
  }, [selectedCursoId]);

  // Handle student module matrix drawer loading
  const handleLoadUnlockGrid = async (student: Aluno) => {
    setUnlockStudent(student);
    try {
      const res = await fetch(`/api/aluno-conteudo/${student.id}`);
      const data = await res.json();
      setStudentContent(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleModuleUnlock = async (moduloId: string, isCurrentlyUnlocked: boolean, matriculaId: string) => {
    const url = isCurrentlyUnlocked ? '/api/progresso/bloquear' : '/api/progresso/liberar';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matricula_id: matriculaId, modulo_id: moduloId })
      });

      if (response.ok) {
        // Reload grid
        if (unlockStudent) {
          handleLoadUnlockGrid(unlockStudent);
          fetchData(); // Reload emails
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Student
  const handleCreateAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/alunos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAluno, professor_id: user.id })
      });

      if (response.ok) {
        setShowAddAluno(false);
        setNewAluno({ nome: '', email: '', curso_id: '', senha: 'aluno', quantidade_aulas: '10', valor: '800' });
        fetchData();
      } else {
        const err = await response.json();
        alert(err.error || 'Erro ao criar aluno');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Student
  const handleDeleteAluno = async (id: string) => {
    if (confirm('Deseja realmente remover este aluno? Toda a sua matrícula, pacotes e histórico serão apagados permanentemente.')) {
      try {
        await fetch(`/api/alunos/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Create Course
  const handleCreateCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/cursos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ professor_id: user.id, nome: newCursoNome })
      });

      if (response.ok) {
        setShowAddCurso(false);
        setNewCursoNome('');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Course
  const handleDeleteCurso = async (id: string) => {
    if (confirm('Deseja remover este curso? Todos os módulos vinculados serão excluídos.')) {
      try {
        await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
        setSelectedCursoId('');
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Add Module with Simulated File Upload
  const handleCreateModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    try {
      // Simulate PDF file creation in Backend upload directory
      const responseUpload = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: `${newModulo.titulo.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf` })
      });
      const uploadResult = await responseUpload.json();

      const response = await fetch(`/api/cursos/${selectedCursoId}/modulos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newModulo,
          arquivo_url: uploadResult.arquivo_url
        })
      });

      if (response.ok) {
        setShowAddModulo(false);
        setNewModulo({ titulo: '', descricao: '', arquivo_url: '', ordem: '' });
        // Reload modules
        const res = await fetch(`/api/cursos/${selectedCursoId}/modulos`);
        const data = await res.json();
        setModulosList(data);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete Module
  const handleDeleteModulo = async (id: string) => {
    if (confirm('Deseja excluir este módulo?')) {
      try {
        await fetch(`/api/modulos/${id}`, { method: 'DELETE' });
        // Reload modules
        const res = await fetch(`/api/cursos/${selectedCursoId}/modulos`);
        const data = await res.json();
        setModulosList(data);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Update Module
  const handleUpdateModulo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModulo) return;
    try {
      const response = await fetch(`/api/modulos/${editingModulo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: editModuloTitulo,
          descricao: editModuloDescricao,
          ordem: Number(editModuloOrdem)
        })
      });

      if (response.ok) {
        setEditingModulo(null);
        // Reload modules
        const res = await fetch(`/api/cursos/${selectedCursoId}/modulos`);
        const data = await res.json();
        setModulosList(data);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule Lesson
  const handleCreateAula = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/aulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newAula,
          professor_id: user.id
        })
      });

      if (response.ok) {
        setShowAddAula(false);
        setNewAula({ aluno_id: '', data_hora: '', link_video: 'https://meet.google.com/abc-defg-hij' });
        fetchData();
      } else {
        const err = await response.json();
        alert(err.error || 'Erro ao agendar aula');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update Lesson Status (Realizada / Cancelada)
  const handleUpdateAulaStatus = async (aulaId: string, status: 'realizada' | 'cancelada') => {
    try {
      await fetch(`/api/aulas/${aulaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Lesson
  const handleDeleteAula = async (id: string) => {
    if (confirm('Deseja cancelar e excluir este agendamento?')) {
      try {
        await fetch(`/api/aulas/${id}`, { method: 'DELETE' });
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Mark invoice payment received (Controle manual de pagamento)
  const handleMarkPaymentReceived = async (paymentId: string) => {
    try {
      await fetch(`/api/pagamentos/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'em_dia' })
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Manual cron trigger for 24h reminders (pg_cron)
  const handleTriggerCron = async () => {
    setCronLoading(true);
    setCronMessage('');
    try {
      const res = await fetch('/api/cron/reminder', { method: 'POST' });
      const data = await res.json();
      setCronMessage(data.message);
      fetchData(); // Reload email logs list
    } catch (err) {
      setCronMessage('Erro ao disparar pg_cron no servidor.');
    } finally {
      setCronLoading(false);
    }
  };

  // Helpers
  const formatDateTime = (isoStr: string) => {
    if (!isoStr || typeof isoStr !== 'string') return '';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '';
    const locale = language === 'pt' ? 'pt-BR' : language === 'id' ? 'id-ID' : 'en-US';
    const separator = language === 'pt' ? ' às ' : language === 'id' ? ' pada ' : ' at ';
    return d.toLocaleDateString(locale) + separator + isoStr.substring(11, 16);
  };

  // Stats computation
  const activeAlunosCount = alunos.length;
  const pendingPayments = pagamentos.filter(p => p.status === 'pendente');
  const pendingCount = pendingPayments.length;
  const pendingValue = pendingPayments.reduce((acc, curr) => acc + curr.valor, 0);
  const scheduledThisWeek = aulas.filter(a => {
    if (a.status !== 'agendada') return false;
    const aDate = new Date(a.data_hora);
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return aDate >= now && aDate <= oneWeekFromNow;
  }).length;

  return (
    <div className="min-h-screen bg-sand-light text-ink-navy flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-card-bg border-b border-[rgba(28,37,65,0.12)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo Circular Stamp */}
            <div className="w-12 h-12 rounded-full border border-ink-navy border-dashed flex items-center justify-center rotate-[-4deg]">
              <div className="w-9 h-9 rounded-full bg-ink-navy flex items-center justify-center text-sand text-sm font-serif font-bold">
                P
              </div>
            </div>
            <div>
              <span className="font-mono-plex text-[10px] uppercase tracking-widest text-coral font-bold block">
                {t('professor')}
              </span>
              <h1 className="font-serif text-xl leading-tight">
                {user.nome}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Global Language & Theme Selectors */}
            <LanguageSelector />
            <ThemeSelector />

            <button
              onClick={handleTriggerCron}
              className="bg-sand hover:bg-ink-navy hover:text-sand text-ink-navy text-xs font-medium py-2 px-3 rounded-lg transition-all flex items-center gap-1.5 border border-ink-navy/10 cursor-pointer"
              disabled={cronLoading}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cronLoading ? 'animate-spin' : ''}`} />
              <span>{t('forceCron')}</span>
            </button>
            <button
              onClick={onLogout}
              className="bg-coral text-white hover:bg-coral/90 text-xs font-medium py-2 px-4 rounded-lg transition-all cursor-pointer border border-coral/10"
            >
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Subbar */}
      <div className="bg-card-bg border-b border-[rgba(28,37,65,0.08)]">
        <div className="max-w-7xl mx-auto px-4 flex space-x-1 md:space-x-4 overflow-x-auto py-2">
          {[
            { id: 'dashboard', label: t('navDashboard'), icon: Sparkles },
            { id: 'alunos', label: t('navStudents'), icon: Users },
            { id: 'cursos', label: t('navCourses'), icon: BookOpen },
            { id: 'agenda', label: t('navSchedule'), icon: Calendar },
            { id: 'pagamentos', label: t('navBilling'), icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-ink-navy text-sand font-semibold'
                    : 'text-ink-navy/70 hover:bg-sand-light'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {cronMessage && (
          <div className="p-4 bg-sage-light/60 border border-sage/20 text-ink-navy text-xs rounded-[14px] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sage">{t('executingCron')}</p>
              <p className="mt-0.5">{cronMessage}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono-plex uppercase tracking-wider text-ink-navy/60 mt-4">{t('loadingData')}</p>
          </div>
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                
                {/* Stats Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-sand rounded-full p-2 text-ink-navy">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono-plex uppercase tracking-widest text-coral font-bold block mb-1">{t('statPortfolio')}</span>
                    <h3 className="text-4xl font-serif text-ink-navy mb-1">{activeAlunosCount}</h3>
                    <p className="text-xs text-ink-navy/60">{t('statStudentsDesc')}</p>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-coral/10 rounded-full p-2 text-coral">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono-plex uppercase tracking-widest text-coral font-bold block mb-1">{t('statPending')}</span>
                    <h3 className="text-4xl font-serif text-ink-navy mb-1">R$ {pendingValue}</h3>
                    <p className="text-xs text-ink-navy/60">{pendingCount} {t('statInvoicesDesc')}</p>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-sage-light text-sage rounded-full p-2">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-mono-plex uppercase tracking-widest text-coral font-bold block mb-1">{t('statSchedule')}</span>
                    <h3 className="text-4xl font-serif text-ink-navy mb-1">{scheduledThisWeek}</h3>
                    <p className="text-xs text-ink-navy/60">{t('statClassesDesc')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column - Upcoming lessons list */}
                  <div className="lg:col-span-2 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('immediateSchedule')}</span>
                        <h3 className="font-serif text-xl text-ink-navy">{t('scheduledClasses')}</h3>
                      </div>
                      <button 
                        onClick={() => setActiveTab('agenda')}
                        className="text-xs font-mono-plex uppercase text-coral tracking-wider font-semibold hover:opacity-85 cursor-pointer"
                      >
                        {t('viewFullSchedule')}
                      </button>
                    </div>

                    {aulas.filter(a => a.status === 'agendada').length === 0 ? (
                      <div className="text-center py-12 text-sm text-ink-navy/40">
                        {t('noClassesScheduled')}
                      </div>
                    ) : (
                      <div className="divide-y divide-[rgba(28,37,65,0.06)]">
                        {aulas.filter(a => a.status === 'agendada').slice(0, 5).map(aula => (
                          <div key={aula.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="space-y-1">
                              <h4 className="font-serif text-base text-ink-navy font-semibold">{aula.aluno_nome}</h4>
                              <p className="text-xs text-ink-navy/60 font-medium">
                                {formatDateTime(aula.data_hora)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateAulaStatus(aula.id, 'realizada')}
                                className="bg-sage-light hover:bg-sage hover:text-white text-sage text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-sage/10 flex items-center gap-1"
                                title={t('classCompletedBtn')}
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>{t('classCompletedBtn')}</span>
                              </button>
                              <button
                                onClick={() => handleUpdateAulaStatus(aula.id, 'cancelada')}
                                className="bg-coral/10 hover:bg-coral hover:text-white text-coral text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer border border-coral/10 flex items-center gap-1"
                                title={t('classCancelBtn')}
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>{t('classCancelBtn')}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Simulated Resend Mailer Log */}
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 flex flex-col h-[400px]">
                    <div className="mb-4">
                      <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('emailLogsTitle')}</span>
                      <h3 className="font-serif text-lg text-ink-navy">{t('serverDispatches')}</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 text-xs">
                      {emails.length === 0 ? (
                        <p className="text-center py-12 text-ink-navy/40">{t('noEmailsSent')}</p>
                      ) : (
                        emails.map(email => (
                          <div key={email.id} className="bg-sand-light/50 border border-[rgba(28,37,65,0.06)] rounded-xl p-3 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono-plex text-ink-navy/50">
                              <span>{t('emailTo')} {email.to}</span>
                              <span>{new Date(email.sent_at).toLocaleTimeString('pt-BR')}</span>
                            </div>
                            <div className="font-serif text-xs font-semibold text-ink-navy">{email.subject}</div>
                            <p className="text-[11px] text-ink-navy/70 whitespace-pre-line leading-relaxed border-t border-ink-navy/5 pt-1.5">
                              {(email.body || '').substring(0, 140)}...
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: ALUNOS (CRUD & PROGRESS MODULE SEALS) */}
            {activeTab === 'alunos' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('academicManagement')}</span>
                    <h3 className="font-serif text-2xl text-ink-navy">{t('studentList')}</h3>
                  </div>
                  <button
                    onClick={() => setShowAddAluno(true)}
                    className="bg-coral hover:bg-coral/90 text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('registerStudentBtn')}</span>
                  </button>
                </div>

                {/* Form Add Student Overlay */}
                {showAddAluno && (
                  <form onSubmit={handleCreateAluno} className="bg-card-bg rounded-[14px] border border-coral/30 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-ink-navy/5 pb-2">
                      <h4 className="font-serif text-lg text-ink-navy">{t('registerNewStudentTitle')}</h4>
                      <button type="button" onClick={() => setShowAddAluno(false)} className="text-ink-navy/40 hover:text-coral cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('fullNameLabel')}</label>
                        <input
                          type="text"
                          required
                          value={newAluno.nome}
                          onChange={e => setNewAluno({ ...newAluno, nome: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                          placeholder="Ex: Carlos Silva"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('accessEmailLabel')}</label>
                        <input
                          type="email"
                          required
                          value={newAluno.email}
                          onChange={e => setNewAluno({ ...newAluno, email: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                          placeholder="Ex: carlos@aluno.com"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('initialPasswordLabel')}</label>
                        <input
                          type="text"
                          value={newAluno.senha}
                          onChange={e => setNewAluno({ ...newAluno, senha: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                          placeholder="Default: aluno"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('linkToCourseLabel')}</label>
                        <select
                          value={newAluno.curso_id}
                          onChange={e => setNewAluno({ ...newAluno, curso_id: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                        >
                          <option value="">{t('selectCoursePlaceholder')}</option>
                          {cursos.map(c => (
                            <option key={c.id} value={c.id}>{t(c.nome)}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('initialPackageClassesLabel')}</label>
                        <input
                          type="number"
                          value={newAluno.quantidade_aulas}
                          onChange={e => setNewAluno({ ...newAluno, quantidade_aulas: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono-plex uppercase tracking-wider text-ink-navy/70 mb-1">{t('packagePriceLabel')}</label>
                        <input
                          type="number"
                          value={newAluno.valor}
                          onChange={e => setNewAluno({ ...newAluno, valor: e.target.value })}
                          className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAluno(false)}
                        className="bg-sand text-ink-navy text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer"
                      >
                        {t('cancel')}
                      </button>
                      <button
                        type="submit"
                        className="bg-coral text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-coral/95"
                      >
                        {t('btnSaveStudent')}
                      </button>
                    </div>
                  </form>
                )}

                {/* Students Table / Grid */}
                {alunos.length === 0 ? (
                  <div className="text-center py-12 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] text-sm text-ink-navy/40">
                    {t('noStudentsRegistered')}
                  </div>
                ) : (
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] overflow-hidden">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-sand-light/60 border-b border-[rgba(28,37,65,0.08)]">
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colNameCourse')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colPackRemaining')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colNextClass')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colPayment')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colMaterialsManual')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60 text-right">{t('colActions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(28,37,65,0.06)]">
                          {alunos.map(aluno => (
                            <tr key={aluno.id} className="hover:bg-sand-light/10 transition-all">
                              <td className="p-4">
                                <div className="font-serif text-sm font-bold text-ink-navy">{aluno.nome}</div>
                                <div className="text-[10px] text-ink-navy/50">{aluno.email}</div>
                                <div className="mt-1 inline-block text-[9px] font-mono-plex bg-sand text-ink-navy px-2 py-0.5 rounded uppercase tracking-wider">
                                  {t(aluno.curso_nome)}
                                </div>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-1">
                                  <span className="font-mono-plex font-bold text-sm text-ink-navy">{aluno.aulas_restantes}</span>
                                  <span className="text-[10px] text-ink-navy/40">{t('remainingClassesLabel')}</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {aluno.proxima_aula ? (
                                  <span className="font-mono-plex text-[11px] text-ink-navy/80">
                                    {formatDateTime(aluno.proxima_aula)}
                                  </span>
                                ) : (
                                  <span className="text-ink-navy/40 italic">{t('notScheduled')}</span>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                  aluno.pagamento_status === 'em_dia'
                                    ? 'bg-sage-light text-sage'
                                    : 'bg-coral/10 text-coral'
                                }`}>
                                  {aluno.pagamento_status === 'em_dia' ? t('statusPaid') : t('statusPending')}
                                </span>
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleLoadUnlockGrid(aluno)}
                                  className="text-xs bg-sand hover:bg-ink-navy hover:text-sand text-ink-navy border border-ink-navy/10 px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-medium"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{t('btnManageUnlocked')}</span>
                                </button>
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleDeleteAluno(aluno.id)}
                                  className="text-coral/70 hover:text-coral p-1.5 rounded-lg cursor-pointer"
                                  title={t('btnRemoveStudent')}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Responsive Mobile Layout (< 720px) */}
                    <div className="block md:hidden divide-y divide-[rgba(28,37,65,0.06)]">
                      {alunos.map(aluno => (
                        <div key={aluno.id} className="p-5 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-serif text-base font-bold text-ink-navy">{aluno.nome}</div>
                              <div className="text-xs text-ink-navy/50">{aluno.email}</div>
                              <div className="text-[10px] text-coral font-medium mt-0.5">{t(aluno.curso_nome)}</div>
                            </div>
                            <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                              aluno.pagamento_status === 'em_dia' ? 'bg-sage-light text-sage' : 'bg-coral/10 text-coral'
                            }`}>
                              {aluno.pagamento_status === 'em_dia' ? t('statusPaid') : t('statusPending')}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3 bg-sand-light/40 rounded-xl p-3 border border-ink-navy/5 text-xs">
                            <div>
                              <span className="text-[9px] font-mono-plex uppercase text-ink-navy/50 block">{t('colPackRemaining').toUpperCase()}</span>
                              <span className="font-bold text-ink-navy">{aluno.aulas_restantes} {t('classesRemaining')}</span>
                            </div>
                            <div>
                              <span className="text-[9px] font-mono-plex uppercase text-ink-navy/50 block">{t('colNextClass').toUpperCase()}</span>
                              <span className="text-ink-navy font-semibold">
                                {aluno.proxima_aula && typeof aluno.proxima_aula === 'string' && aluno.proxima_aula.length >= 10 ? (
                                  (aluno.proxima_aula.substring(11, 16) || '00:00') + ' - ' + aluno.proxima_aula.substring(8, 10) + '/' + aluno.proxima_aula.substring(5, 7)
                                ) : t('notScheduled')}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2">
                            <button
                              onClick={() => handleLoadUnlockGrid(aluno)}
                              className="text-xs bg-ink-navy text-sand px-3 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer font-medium"
                            >
                              <Eye className="w-3.5 h-3.5 text-coral" />
                              <span>{t('btnManageUnlocked')}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAluno(aluno.id)}
                              className="text-coral/75 hover:text-coral border border-coral/10 px-2.5 py-1.5 rounded-lg cursor-pointer text-xs flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>{t('btnRemoveStudent')}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grid Drawer for Manual Module Unlock by Student */}
                {unlockStudent && studentContent && (
                  <div className="bg-card-bg rounded-[14px] border border-coral/30 p-6 space-y-5">
                    <div className="flex justify-between items-center border-b border-ink-navy/5 pb-2">
                      <div>
                        <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block font-bold">{t('matrixIndividualTitle')}</span>
                        <h4 className="font-serif text-lg text-ink-navy">{t('unlockModulesFor')} {unlockStudent.nome}</h4>
                      </div>
                      <button type="button" onClick={() => setUnlockStudent(null)} className="text-ink-navy/40 hover:text-coral cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {!studentContent.curso ? (
                      <p className="text-sm text-ink-navy/50 italic py-4">{t('studentNotEnrolled')}</p>
                    ) : studentContent.modulos.length === 0 ? (
                      <p className="text-sm text-ink-navy/50 italic py-4">{t('noModulesAddedCourse')} ({t(studentContent.curso.nome)})</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {studentContent.modulos.map((mod: any) => {
                          const isUnlocked = mod.liberado;
                          return (
                            <div 
                              key={mod.id} 
                              className={`border rounded-[14px] p-4 flex items-start gap-3 transition-all ${
                                isUnlocked 
                                  ? 'bg-sage-light/10 border-sage/30' 
                                  : 'bg-sand-light/20 border-ink-navy/10'
                              }`}
                            >
                              {/* Sequence Stamp Circle */}
                              <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-mono-plex text-xs font-bold rotate-[-4deg] flex-shrink-0 ${
                                isUnlocked 
                                  ? 'bg-sage text-white border-sage' 
                                  : 'bg-sand border-ink-navy/10 text-ink-navy/40'
                              }`}>
                                {String(mod.ordem).padStart(2, '0')}
                              </div>

                              <div className="space-y-2 flex-1 min-w-0">
                                <h5 className="font-serif text-sm font-bold text-ink-navy truncate">{t(mod.titulo)}</h5>
                                <p className="text-[11px] text-ink-navy/60 line-clamp-2 leading-relaxed">{t(mod.descricao)}</p>
                                
                                <div className="pt-2 flex items-center justify-between">
                                  <span className={`text-[9px] font-mono-plex uppercase tracking-wider font-semibold ${
                                    isUnlocked ? 'text-sage' : 'text-ink-navy/40'
                                  }`}>
                                    {isUnlocked ? t('statusUnlockedSees') : t('statusLockedHidden')}
                                  </span>

                                  <button
                                    onClick={() => handleToggleModuleUnlock(mod.id, isUnlocked, studentContent.matricula.id)}
                                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer font-sans border ${
                                      isUnlocked
                                        ? 'bg-coral/10 hover:bg-coral hover:text-white text-coral border-coral/15'
                                        : 'bg-sage-light/60 hover:bg-sage hover:text-white text-sage border-sage/15'
                                    }`}
                                  >
                                    {isUnlocked ? t('btnBlock') : t('btnUnlockMaterial')}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>
            )}

            {/* TAB: CURSOS (CRUD & MODULE ORDERING) */}
            {activeTab === 'cursos' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Courses Selection Sidebar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg text-ink-navy">{t('createdCoursesTitle')}</h3>
                    <button
                      onClick={() => setShowAddCurso(true)}
                      className="text-coral hover:opacity-85 text-xs font-semibold font-mono-plex uppercase tracking-wider flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t('btnNewCourse')}</span>
                    </button>
                  </div>

                  {showAddCurso && (
                    <form onSubmit={handleCreateCurso} className="bg-card-bg rounded-xl border border-coral/20 p-4 space-y-3">
                      <input
                        type="text"
                        required
                        placeholder={t('courseNamePlaceholder')}
                        value={newCursoNome}
                        onChange={e => setNewCursoNome(e.target.value)}
                        className="w-full bg-sand-light/50 text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                      />
                      <div className="flex justify-end gap-1 text-xs">
                        <button type="button" onClick={() => setShowAddCurso(false)} className="px-2 py-1 bg-sand rounded">{t('cancel')}</button>
                        <button type="submit" className="px-2 py-1 bg-coral text-white rounded">{t('save')}</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-2">
                    {cursos.map(c => (
                      <div
                        key={c.id}
                        onClick={() => setSelectedCursoId(c.id)}
                        className={`p-4 rounded-[14px] border transition-all cursor-pointer flex justify-between items-center ${
                          selectedCursoId === c.id
                            ? 'bg-card-bg border-coral'
                            : 'bg-card-bg border-[rgba(28,37,65,0.08)] hover:bg-sand-light/20'
                        }`}
                      >
                        <div>
                          <h4 className="font-serif text-sm font-bold text-ink-navy">{t(c.nome)}</h4>
                          <span className="text-[10px] font-mono-plex text-ink-navy/50 block mt-0.5">
                            {c.modulos_count || 0} {t('modulesInProgram')}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCurso(c.id);
                          }}
                          className="text-ink-navy/40 hover:text-coral p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modules of the selected Course */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedCursoId ? (
                    <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-navy/5">
                        <div>
                          <span className="text-[9px] font-mono-plex text-coral uppercase tracking-widest block mb-0.5 font-bold">{t('studyProgram')}</span>
                          <h3 className="font-serif text-xl text-ink-navy">
                            {t(cursos.find(c => c.id === selectedCursoId)?.nome || '')}
                          </h3>
                        </div>
                        <button
                          onClick={() => setShowAddModulo(true)}
                          className="bg-coral text-white text-xs font-semibold py-2 px-3.5 rounded-xl flex items-center gap-1 hover:bg-coral/95 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{t('btnAddModule')}</span>
                        </button>
                      </div>

                      {showAddModulo && (
                        <form onSubmit={handleCreateModulo} className="bg-sand-light/30 border border-coral/20 rounded-xl p-4 space-y-4">
                          <h4 className="font-serif text-sm font-semibold text-ink-navy">{t('btnAddModule')}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('moduleTitleLabel')}</label>
                              <input
                                type="text"
                                required
                                value={newModulo.titulo}
                                onChange={e => setNewModulo({ ...newModulo, titulo: e.target.value })}
                                className="w-full bg-card-bg text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                                placeholder={t('moduleTitlePlaceholder')}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('moduleOrderLabel')}</label>
                              <input
                                type="number"
                                value={newModulo.ordem}
                                onChange={e => setNewModulo({ ...newModulo, ordem: e.target.value })}
                                className="w-full bg-card-bg text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                                placeholder={t('moduleOrderPlaceholder')}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('moduleDescLabel')}</label>
                            <textarea
                              required
                              value={newModulo.descricao}
                              onChange={e => setNewModulo({ ...newModulo, descricao: e.target.value })}
                              className="w-full bg-card-bg text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs h-16"
                              placeholder={t('moduleDescPlaceholder')}
                            />
                          </div>

                          {/* Upload Area */}
                          <div className="border-2 border-dashed border-[rgba(28,37,65,0.15)] rounded-xl p-4 text-center space-y-1">
                            <Upload className="w-6 h-6 mx-auto text-ink-navy/40" />
                            <p className="text-xs font-semibold text-ink-navy">{t('selectStudyPdf')}</p>
                            <p className="text-[10px] text-ink-navy/50">{t('pdfSimulatorDesc')}</p>
                          </div>

                          <div className="flex justify-end gap-2 text-xs">
                            <button type="button" onClick={() => setShowAddModulo(false)} className="px-3 py-1.5 bg-sand rounded-lg">{t('cancel')}</button>
                            <button type="submit" className="px-3 py-1.5 bg-coral text-white rounded-lg flex items-center gap-1" disabled={uploadLoading}>
                              {uploadLoading ? (t('loadingData') || 'Salvando...') : t('btnCreateModule')}
                            </button>
                          </div>
                        </form>
                      )}

                      {modulosList.length === 0 ? (
                        <p className="text-sm text-ink-navy/40 text-center py-12">{t('noModulesInThisCourse')}</p>
                      ) : (
                        <div className="space-y-4">
                          {modulosList.map((mod, index) => (
                            <div key={mod.id} className="border border-[rgba(28,37,65,0.08)] rounded-[14px] p-4 flex items-start justify-between gap-4 hover:border-coral/20 transition-all bg-card-bg relative">
                              {/* Stamp Order Icon */}
                              <div className="w-9 h-9 rounded-full border border-ink-navy border-dashed flex items-center justify-center font-mono-plex text-xs font-bold rotate-[-4deg] bg-sand-light text-ink-navy flex-shrink-0">
                                {String(mod.ordem).padStart(2, '0')}
                              </div>

                              {editingModulo?.id === mod.id ? (
                                <form onSubmit={handleUpdateModulo} className="flex-1 space-y-3">
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    <div className="sm:col-span-2">
                                      <input
                                        type="text"
                                        required
                                        value={editModuloTitulo}
                                        onChange={e => setEditModuloTitulo(e.target.value)}
                                        className="w-full bg-sand-light text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                                        placeholder={t('moduleTitlePlaceholder')}
                                      />
                                    </div>
                                    <div>
                                      <input
                                        type="number"
                                        required
                                        value={editModuloOrdem}
                                        onChange={e => setEditModuloOrdem(e.target.value)}
                                        className="w-full bg-sand-light text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                                        placeholder="Ordem"
                                      />
                                    </div>
                                  </div>
                                  <textarea
                                    required
                                    value={editModuloDescricao}
                                    onChange={e => setEditModuloDescricao(e.target.value)}
                                    className="w-full bg-sand-light text-ink-navy border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs h-16"
                                    placeholder={t('moduleDescPlaceholder')}
                                  />
                                  <div className="flex justify-end gap-1.5 text-xs">
                                    <button type="button" onClick={() => setEditingModulo(null)} className="px-2.5 py-1 bg-sand text-ink-navy rounded-lg">{t('cancel')}</button>
                                    <button type="submit" className="px-2.5 py-1 bg-coral text-white rounded-lg">{t('save')}</button>
                                  </div>
                                </form>
                              ) : (
                                <>
                                  <div className="flex-1 space-y-1">
                                    <h4 className="font-serif text-base text-ink-navy font-semibold">{t(mod.titulo)}</h4>
                                    <p className="text-xs text-ink-navy/60 leading-relaxed font-sans">{t(mod.descricao)}</p>
                                    <div className="pt-2 text-[10px] font-mono-plex text-coral flex items-center gap-1">
                                      <FileText className="w-3.5 h-3.5" />
                                      <span className="truncate max-w-[200px]">{mod.arquivo_url}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 self-start flex-shrink-0">
                                    <button
                                      onClick={() => {
                                        setEditingModulo(mod);
                                        setEditModuloTitulo(mod.titulo);
                                        setEditModuloDescricao(mod.descricao);
                                        setEditModuloOrdem(String(mod.ordem));
                                      }}
                                      className="text-ink-navy/30 hover:text-sage p-1.5 rounded cursor-pointer"
                                      title={t('btnEditModule') || 'Editar Módulo'}
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteModulo(mod.id)}
                                      className="text-ink-navy/30 hover:text-coral p-1.5 rounded cursor-pointer"
                                      title={t('btnDeleteModule')}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="text-center py-20 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] text-sm text-ink-navy/40">
                      {t('selectCourseToEditModules')}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: AGENDA (AULAS SCHEDULING & VIDEO LINKS) */}
            {activeTab === 'agenda' && (
              <div className="space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-ink-navy/5">
                  <div>
                    <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('scheduleManagement')}</span>
                    <h3 className="font-serif text-2xl text-ink-navy">{t('classScheduleTitle')}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
                      className="bg-sand hover:bg-sand/80 text-ink-navy text-xs font-medium py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-[rgba(28,37,65,0.12)] font-semibold"
                    >
                      <Calendar className="w-4 h-4 text-coral" />
                      <span>{viewMode === 'list' ? 'Ver Calendário' : 'Ver Lista'}</span>
                    </button>
                    <button
                      onClick={() => {
                        if (alunos.length === 0) {
                          alert(t('alertRegisterStudentFirst'));
                          return;
                        }
                        setShowAddAula(true);
                      }}
                      className="bg-coral hover:bg-coral/95 text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t('btnScheduleLesson')}</span>
                    </button>
                  </div>
                </div>

                {showAddAula && (
                  <form onSubmit={handleCreateAula} className="bg-card-bg rounded-[14px] border border-coral/30 p-6 space-y-4">
                    <div className="flex justify-between items-center border-b border-ink-navy/5 pb-2">
                      <h4 className="font-serif text-base font-bold text-ink-navy">{t('scheduleLessonTitle')}</h4>
                      <button type="button" onClick={() => setShowAddAula(false)} className="text-ink-navy/40 hover:text-coral cursor-pointer">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('selectStudentLabel')}</label>
                        <select
                          required
                          value={newAula.aluno_id}
                          onChange={e => setNewAula({ ...newAula, aluno_id: e.target.value })}
                          className="w-full bg-sand-light/50 border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs"
                        >
                          <option value="">-- {t('selectStudentLabel')} --</option>
                          {alunos.map(a => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('dateTimeLabel')}</label>
                        <input
                          type="datetime-local"
                          required
                          value={newAula.data_hora}
                          onChange={e => setNewAula({ ...newAula, data_hora: e.target.value })}
                          className="w-full bg-sand-light/50 border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs text-ink-navy font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-mono-plex text-ink-navy/70 mb-1">{t('colVideoLink')}</label>
                        <input
                          type="url"
                          required
                          value={newAula.link_video}
                          onChange={e => setNewAula({ ...newAula, link_video: e.target.value })}
                          className="w-full bg-sand-light/50 border border-[rgba(28,37,65,0.12)] rounded-lg p-2 text-xs font-mono"
                          placeholder="https://meet.google.com/abc-defg-hij"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-2 text-xs">
                      <button type="button" onClick={() => setShowAddAula(false)} className="px-3 py-1.5 bg-sand rounded-lg">{t('cancel')}</button>
                      <button type="submit" className="px-3 py-1.5 bg-coral text-white rounded-lg">{t('btnSaveSchedule')}</button>
                    </div>
                  </form>
                )}

                {viewMode === 'calendar' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: The Monthly Calendar Grid */}
                    <div className="lg:col-span-2 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-4 space-y-4">
                      {/* Calendar Navigation Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-ink-navy/5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-bold text-ink-navy capitalize">
                            {getMonthName(calendarDate.getMonth())} {calendarDate.getFullYear()}
                          </h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1.5 hover:bg-sand-light rounded-lg border border-[rgba(28,37,65,0.1)] text-ink-navy cursor-pointer transition-all"
                            title="Mês Anterior"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleToday}
                            className="text-xs px-2.5 py-1.5 hover:bg-sand-light rounded-lg border border-[rgba(28,37,65,0.1)] text-ink-navy cursor-pointer font-semibold transition-all"
                          >
                            {language === 'pt' ? 'Hoje' : language === 'id' ? 'Hari Ini' : 'Today'}
                          </button>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1.5 hover:bg-sand-light rounded-lg border border-[rgba(28,37,65,0.1)] text-ink-navy cursor-pointer transition-all"
                            title="Próximo Mês"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Weekdays Header */}
                      <div className="grid grid-cols-7 text-center font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/50 font-bold border-b border-ink-navy/5 pb-2">
                        {(language === 'pt' 
                          ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] 
                          : language === 'id'
                          ? ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
                          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                        ).map((wd, idx) => (
                          <div key={idx}>{wd}</div>
                        ))}
                      </div>

                      {/* Days Grid */}
                      <div className="grid grid-cols-7 border-r border-b border-ink-navy/5">
                        {getCalendarDays(calendarDate.getFullYear(), calendarDate.getMonth()).map((cell, idx) => {
                          const dayAulas = getAulasForDate(cell.dateStr);
                          const isSelected = cell.dateStr === selectedDateStr;
                          const isToday = cell.dateStr === getTodayStr();
                          const isCurrentMonth = cell.monthOffset === 0;

                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setSelectedDateStr(cell.dateStr)}
                              className={`text-left p-2 border-t border-l border-ink-navy/5 min-h-[70px] sm:min-h-[100px] flex flex-col justify-between transition-all select-none hover:bg-sand-light/20 relative cursor-pointer ${
                                isSelected ? 'bg-coral/5 ring-1 ring-coral/30 z-10' : ''
                              } ${!isCurrentMonth ? 'bg-sand-light/5 text-ink-navy/30' : 'text-ink-navy bg-card-bg'}`}
                            >
                              {/* Day Number Row */}
                              <div className="flex justify-between items-start w-full">
                                <span className={`text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full ${
                                  isToday ? 'bg-coral text-white font-bold' : isSelected ? 'text-coral font-bold' : ''
                                }`}>
                                  {cell.day}
                                </span>
                                
                                {/* Count Indicator badge for mobile */}
                                {dayAulas.length > 0 && (
                                  <span className="sm:hidden w-1.5 h-1.5 rounded-full bg-coral inline-block"></span>
                                )}
                              </div>

                              {/* Aulas List in Cell (Desktop only) */}
                              <div className="hidden sm:block w-full space-y-1 mt-1 overflow-hidden flex-1">
                                {dayAulas.slice(0, 3).map(aula => (
                                  <div
                                    key={aula.id}
                                    className={`text-[9px] px-1.5 py-0.5 rounded truncate font-semibold border ${
                                      aula.status === 'agendada'
                                        ? 'bg-sand text-ink-navy border-ink-navy/10'
                                        : aula.status === 'realizada'
                                        ? 'bg-sage-light text-sage border-sage/10'
                                        : 'bg-coral/10 text-coral border-coral/10'
                                    }`}
                                    title={`${(aula.data_hora || '').substring(11, 16)} - ${aula.aluno_nome}`}
                                  >
                                    {(aula.data_hora || '').substring(11, 16)} {aula.aluno_nome}
                                  </div>
                                ))}
                                {dayAulas.length > 3 && (
                                  <div className="text-[8px] font-mono-plex text-ink-navy/40 pl-1">
                                    +{dayAulas.length - 3} {language === 'pt' ? 'mais' : 'more'}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Selected Day Details Panel */}
                    <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-5 space-y-4 flex flex-col justify-start">
                      <div className="border-b border-ink-navy/5 pb-2">
                        <span className="text-[9px] font-mono-plex text-coral uppercase tracking-wider block font-bold">
                          {language === 'pt' ? 'Detalhes do Dia' : language === 'id' ? 'Detail Hari' : 'Day Details'}
                        </span>
                        <h4 className="font-serif text-base font-bold text-ink-navy">
                          {formatSelectedDate(selectedDateStr)}
                        </h4>
                      </div>

                      {getAulasForDate(selectedDateStr).length === 0 ? (
                        <div className="text-center py-10 bg-sand-light/20 rounded-xl border border-dashed border-ink-navy/10 flex-1 flex flex-col justify-center items-center">
                          <Calendar className="w-8 h-8 mx-auto text-ink-navy/20 mb-2" />
                          <p className="text-xs text-ink-navy/50 max-w-[180px] mx-auto">
                            {language === 'pt' ? 'Nenhuma aula agendada para este dia.' : language === 'id' ? 'Tidak ada kelas terjadwal untuk hari ini.' : 'No classes scheduled for this day.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                          {getAulasForDate(selectedDateStr).map(aula => (
                            <div key={aula.id} className="p-3 bg-sand-light/30 rounded-xl border border-ink-navy/5 space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-xs font-mono font-bold text-coral bg-coral/5 px-2 py-0.5 rounded-md">
                                    {(aula.data_hora || '').substring(11, 16)}
                                  </span>
                                  <h5 className="font-serif text-sm font-bold text-ink-navy mt-1">
                                    {aula.aluno_nome}
                                  </h5>
                                </div>
                                <span className={`text-[8px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                  aula.status === 'agendada'
                                    ? 'bg-sand text-ink-navy'
                                    : aula.status === 'realizada'
                                    ? 'bg-sage-light text-sage'
                                    : 'bg-coral/10 text-coral'
                                }`}>
                                  {aula.status === 'agendada' ? t('statusScheduled') : aula.status === 'realizada' ? t('statusCompleted') : t('statusCancelled')}
                                </span>
                              </div>

                              <div className="text-[11px] text-ink-navy/70 space-y-1">
                                <div>
                                  <strong className="font-semibold">{language === 'pt' ? 'Professor: ' : 'Teacher: '}</strong>
                                  {user.nome}
                                </div>
                                <div className="truncate">
                                  <strong className="font-semibold">Meet: </strong>
                                  <a href={aula.link_video} target="_blank" rel="noreferrer" className="text-coral underline font-mono text-[10px]">
                                    {aula.link_video}
                                  </a>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 border-t border-ink-navy/5 mt-1">
                                <div className="flex gap-1">
                                  {aula.status === 'agendada' && (
                                    <>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateAulaStatus(aula.id, 'realizada')}
                                        className="text-[10px] bg-sage-light hover:bg-sage hover:text-white text-sage px-2 py-1 rounded border border-sage/10 cursor-pointer font-semibold transition-all"
                                      >
                                        {t('statusCompleted')}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateAulaStatus(aula.id, 'cancelada')}
                                        className="text-[10px] bg-coral/10 hover:bg-coral hover:text-white text-coral px-2 py-1 rounded border border-coral/10 cursor-pointer font-semibold transition-all"
                                      >
                                        {t('cancel')}
                                      </button>
                                    </>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAula(aula.id)}
                                  className="text-ink-navy/30 hover:text-coral p-1 rounded cursor-pointer transition-all"
                                  title={t('cancel')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : aulas.length === 0 ? (
                  <div className="text-center py-12 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] text-sm text-ink-navy/40">
                    {t('noLessonsScheduled')}
                  </div>
                ) : (
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] overflow-hidden">
                    {/* Desktop View */}
                    <div className="hidden md:block">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-sand-light/60 border-b border-[rgba(28,37,65,0.08)]">
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colStudent')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colClassDate')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colVideoLink')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colClassStatus')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60 text-right">{t('colActions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(28,37,65,0.06)]">
                          {aulas.map(aula => (
                            <tr key={aula.id} className="hover:bg-sand-light/10 transition-all">
                              <td className="p-4 font-serif text-sm font-bold text-ink-navy">{aula.aluno_nome}</td>
                              <td className="p-4 font-sans font-medium text-ink-navy">{formatDateTime(aula.data_hora)}</td>
                              <td className="p-4 font-mono text-[10px] text-coral truncate max-w-[220px]">
                                <a href={aula.link_video} target="_blank" rel="noreferrer" className="underline hover:opacity-80">
                                  {aula.link_video}
                                </a>
                              </td>
                              <td className="p-4">
                                <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                  aula.status === 'agendada'
                                    ? 'bg-sand text-ink-navy'
                                    : aula.status === 'realizada'
                                    ? 'bg-sage-light text-sage'
                                    : 'bg-coral/10 text-coral'
                                }`}>
                                  {aula.status === 'agendada' ? t('statusScheduled') : aula.status === 'realizada' ? t('statusCompleted') : t('statusCancelled')}
                                </span>
                              </td>
                              <td className="p-4 text-right flex items-center justify-end gap-1">
                                {aula.status === 'agendada' && (
                                  <>
                                    <button
                                      onClick={() => handleUpdateAulaStatus(aula.id, 'realizada')}
                                      className="text-xs bg-sage-light hover:bg-sage hover:text-white text-sage px-2.5 py-1.5 rounded-lg border border-sage/10 cursor-pointer font-semibold"
                                      title="Marcar como realizada"
                                    >
                                      {t('statusCompleted')}
                                    </button>
                                    <button
                                      onClick={() => handleUpdateAulaStatus(aula.id, 'cancelada')}
                                      className="text-xs bg-coral/10 hover:bg-coral hover:text-white text-coral px-2.5 py-1.5 rounded-lg border border-coral/10 cursor-pointer font-semibold"
                                      title={t('cancel')}
                                    >
                                      {t('cancel')}
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDeleteAula(aula.id)}
                                  className="text-ink-navy/30 hover:text-coral p-1.5 rounded cursor-pointer"
                                  title={t('cancel')}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="block md:hidden divide-y divide-[rgba(28,37,65,0.06)]">
                      {aulas.map(aula => (
                        <div key={aula.id} className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-serif text-sm font-bold text-ink-navy">{aula.aluno_nome}</h4>
                            <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                              aula.status === 'agendada' ? 'bg-sand text-ink-navy' : aula.status === 'realizada' ? 'bg-sage-light text-sage' : 'bg-coral/10 text-coral'
                            }`}>
                              {aula.status === 'agendada' ? t('statusScheduled') : aula.status === 'realizada' ? t('statusCompleted') : t('statusCancelled')}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-ink-navy/70">
                            <div>{t('colClassDate')}: <span className="font-medium">{formatDateTime(aula.data_hora)}</span></div>
                            <div className="truncate">{t('colVideoLink')}: <a href={aula.link_video} target="_blank" rel="noreferrer" className="text-coral underline font-mono text-[10px]">{aula.link_video}</a></div>
                          </div>

                          {aula.status === 'agendada' && (
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleUpdateAulaStatus(aula.id, 'realizada')}
                                className="w-full text-center text-xs bg-sage-light text-sage font-bold py-2 rounded-lg border border-sage/10 cursor-pointer"
                              >
                                {t('statusCompleted')}
                              </button>
                              <button
                                onClick={() => handleUpdateAulaStatus(aula.id, 'cancelada')}
                                className="w-full text-center text-xs bg-coral/10 text-coral font-bold py-2 rounded-lg border border-coral/10 cursor-pointer"
                              >
                                {t('cancel')}
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'pagamentos' && (
              <div className="space-y-6">
                
                <div>
                  <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('financialBilling')}</span>
                  <h3 className="font-serif text-2xl text-ink-navy">{t('billingControl')}</h3>
                  <p className="text-xs text-ink-navy/60 mt-0.5">{t('billingControlDesc')}</p>
                </div>

                {pagamentos.length === 0 ? (
                  <div className="text-center py-12 bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] text-sm text-ink-navy/40">
                    {t('noInvoicesFound')}
                  </div>
                ) : (
                  <div className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] overflow-hidden">
                    {/* Desktop Ledger View */}
                    <div className="hidden md:block">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-sand-light/60 border-b border-[rgba(28,37,65,0.08)]">
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colStudent')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colPackInvoice')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colInvoiceValue')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colInvoiceDate')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colInvoiceStatus')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60 text-right">{t('colActions')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(28,37,65,0.06)]">
                          {pagamentos.map(p => (
                            <tr key={p.id} className="hover:bg-sand-light/10 transition-all">
                              <td className="p-4 font-serif text-sm font-bold text-ink-navy">{p.aluno_nome}</td>
                              <td className="p-4 font-sans text-ink-navy/80">{p.pacote_detalhes}</td>
                              <td className="p-4 font-mono-plex font-bold text-ink-navy">R$ {p.valor.toFixed(2)}</td>
                              <td className="p-4 font-mono text-[11px] text-ink-navy/70">
                                {new Date(p.data + 'T12:00:00').toLocaleDateString(language === 'en' ? 'en-US' : language === 'id' ? 'id-ID' : 'pt-BR')}
                              </td>
                              <td className="p-4">
                                <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                                  p.status === 'em_dia'
                                    ? 'bg-sage-light text-sage'
                                    : 'bg-coral/10 text-coral'
                                }`}>
                                  {p.status === 'em_dia' ? t('statusPaid') : t('statusPending')}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                {p.status === 'pendente' ? (
                                  <button
                                    onClick={() => handleMarkPaymentReceived(p.id)}
                                    className="bg-sage text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-sage/90 transition-all cursor-pointer shadow-sm shadow-sage/10"
                                  >
                                    {t('btnMarkReceived')}
                                  </button>
                                ) : (
                                  <span className="text-sage text-xs font-semibold flex items-center justify-end gap-1">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{t('statusPaid')}</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Ledger Card list */}
                    <div className="block md:hidden divide-y divide-[rgba(28,37,65,0.06)]">
                      {pagamentos.map(p => (
                        <div key={p.id} className="p-5 space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-serif text-sm font-bold text-ink-navy">{p.aluno_nome}</h4>
                            <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                              p.status === 'em_dia' ? 'bg-sage-light text-sage' : 'bg-coral/10 text-coral'
                            }`}>
                              {p.status === 'em_dia' ? t('statusPaid') : t('statusPending')}
                            </span>
                          </div>

                          <div className="space-y-1 text-xs text-ink-navy/70">
                            <div>{t('colPackInvoice')}: <span className="font-medium text-ink-navy">{p.pacote_detalhes}</span></div>
                            <div>{t('colInvoiceValue')}: <span className="font-bold text-ink-navy">R$ {p.valor.toFixed(2)}</span></div>
                            <div>{t('colInvoiceDate')}: <span className="font-mono">{new Date(p.data + 'T12:00:00').toLocaleDateString(language === 'en' ? 'en-US' : language === 'id' ? 'id-ID' : 'pt-BR')}</span></div>
                          </div>

                          {p.status === 'pendente' && (
                            <button
                              onClick={() => handleMarkPaymentReceived(p.id)}
                              className="w-full bg-sage text-white font-bold py-2 rounded-lg text-center cursor-pointer text-xs"
                            >
                              {t('btnMarkReceived')}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            )}

          </>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-card-bg border-t border-[rgba(28,37,65,0.08)] py-4 px-6 text-center mt-auto">
        <p className="text-[10px] font-mono-plex uppercase tracking-widest text-ink-navy/40">
          {t('appName').toUpperCase()} • {t('professor').toUpperCase()} PORTAL • EST. 2026
        </p>
      </footer>

    </div>
  );
}
