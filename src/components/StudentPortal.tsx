import React, { useState, useEffect } from 'react';
import { AuthUser, Aula, Modulo, Pacote, Pagamento } from '../types';
import { LogOut, Calendar, Play, Download, Lock, CheckCircle, Clock, ShieldAlert, BookOpen } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';
import LanguageSelector from './LanguageSelector';
import ThemeSelector from './ThemeSelector';

interface StudentPortalProps {
  user: AuthUser;
  onLogout: () => void;
}

export default function StudentPortal({ user, onLogout }: StudentPortalProps) {
  const [curso, setCurso] = useState<any>(null);
  const [modulos, setModulos] = useState<any[]>([]);
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [pacotes, setPacotes] = useState<Pacote[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      // Fetch modules and course
      const resContent = await fetch(`/api/aluno-conteudo/${user.id}`);
      const dataContent = await resContent.json();
      setCurso(dataContent.curso);
      setModulos(dataContent.modulos || []);

      // Fetch lessons
      const resAulas = await fetch(`/api/aulas?aluno_id=${user.id}`);
      const dataAulas = await resAulas.json();
      setAulas(dataAulas);

      // Fetch packages
      const resPacotes = await fetch(`/api/pacotes/${user.id}`);
      const dataPacotes = await resPacotes.json();
      setPacotes(dataPacotes);
    } catch (err) {
      console.error('Error fetching student data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [user.id]);

  // Separate upcoming and past lessons
  const proximaAula = aulas.filter(a => a.status === 'agendada')[0];
  const historicoAulas = aulas.filter(a => a.status === 'realizada' || a.status === 'cancelada')
    .sort((a,b) => b.data_hora.localeCompare(a.data_hora));

  // Active package
  const activePacote = pacotes.find(p => p.status === 'ativo') || pacotes[0];

  // Simulated PDF download helper
  const handleDownloadPDF = (modulo: Modulo) => {
    const title = modulo.titulo;
    const desc = modulo.descricao;
    const content = `
%PDF-1.4
% ${title}
% ${desc}
% ${t('appName')} - ${t('teacherHelenaSantos')}

Study Material:
------------------------------------------
1. Lesson Introduction & Objectives.
2. Grammar structure and practice drills.
3. Common vocabulary and dialog simulation.
------------------------------------------
Congratulations on advancing your linguistic journey!
    `;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_material.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Helper to format date nicely based on active locale
  const formatDate = (isoStr: string) => {
    const d = new Date(isoStr);
    const locale = language === 'pt' ? 'pt-BR' : language === 'id' ? 'id-ID' : 'en-US';
    return d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatTime = (isoStr: string) => {
    return isoStr.substring(11, 16);
  };

  return (
    <div className="min-h-screen bg-sand-light text-ink-navy flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="bg-card-bg border-b border-[rgba(28,37,65,0.12)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo Circular Stamp */}
            <div className="w-10 h-10 rounded-full border border-ink-navy border-dashed flex items-center justify-center rotate-[-4deg]">
              <div className="w-8 h-8 rounded-full bg-ink-navy flex items-center justify-center text-sand text-xs font-serif font-bold">
                L
              </div>
            </div>
            <div>
              <span className="font-mono-plex text-[10px] uppercase tracking-widest text-coral font-bold block">
                {t('student')}
              </span>
              <h2 className="font-serif text-lg leading-tight">
                {user.nome}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center">
            {/* Selector Options */}
            <LanguageSelector />
            <ThemeSelector />

            <span className="hidden md:inline text-xs text-ink-navy/60 font-mono-plex bg-sand px-3 py-1.5 rounded-full uppercase tracking-wider">
              {curso ? t(curso.nome) : t('noCourseEnrolled')}
            </span>
            <button
              onClick={onLogout}
              className="bg-sand hover:bg-coral hover:text-white text-ink-navy text-xs font-medium py-2 px-3 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-[rgba(28,37,65,0.08)]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-coral border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-mono-plex uppercase tracking-wider text-ink-navy/60 mt-4">{t('loadingPortal')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Columns (Content & History) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Modules List */}
              <section className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-ink-navy/5">
                  <div>
                    <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1">{t('studyProgram')}</span>
                    <h3 className="font-serif text-2xl text-ink-navy">{t('learningModules')}</h3>
                  </div>
                  <div className="flex items-center gap-1.5 bg-sage-light text-sage text-xs font-medium px-3 py-1 rounded-full border border-sage/10">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{t('sequentialOrder')}</span>
                  </div>
                </div>

                {!curso ? (
                  <div className="text-center py-12 bg-sand-light/50 rounded-lg border border-dashed border-ink-navy/10">
                    <BookOpen className="w-8 h-8 mx-auto text-ink-navy/30 mb-2" />
                    <p className="text-sm font-serif text-ink-navy/70">{t('noCourseEnrolled')}</p>
                    <p className="text-xs text-ink-navy/50 mt-1">{t('teachersUpdateSoon')}</p>
                  </div>
                ) : modulos.length === 0 ? (
                  <div className="text-center py-12 bg-sand-light/50 rounded-lg border border-dashed border-ink-navy/10">
                    <p className="text-sm font-serif text-ink-navy/70">{t('noModulesInThisCourse')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {modulos.map((modulo, idx) => {
                      const isUnlocked = modulo.liberado;
                      const prevModulo = idx > 0 ? modulos[idx - 1] : null;

                      return (
                        <div
                          key={modulo.id}
                          className={`border rounded-[14px] p-5 transition-all relative flex flex-col justify-between h-48 ${
                            isUnlocked
                              ? 'bg-card-bg border-[rgba(28,37,65,0.12)] hover:border-coral/30 hover:scale-[1.01]'
                              : 'bg-sand-light/40 border-dashed border-ink-navy/10 opacity-70 select-none'
                          }`}
                        >
                          {/* Circular Stamp Badge for Modulo Number */}
                          <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full border flex items-center justify-center font-mono-plex text-xs font-bold rotate-[-6deg] ${
                            isUnlocked 
                              ? 'bg-ink-navy text-sand border-ink-navy' 
                              : 'bg-sand text-ink-navy/40 border-ink-navy/10'
                          }`}>
                            {String(modulo.ordem).padStart(2, '0')}
                          </div>

                          <div className="mt-2 space-y-1.5">
                            <h4 className={`font-serif text-base leading-snug ${isUnlocked ? 'text-ink-navy' : 'text-ink-navy/40 line-through'}`}>
                              {t(modulo.titulo)}
                            </h4>
                            <p className="text-xs text-ink-navy/60 font-sans line-clamp-2 leading-relaxed">
                              {t(modulo.descricao)}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-ink-navy/5 mt-auto flex items-center justify-between">
                            {isUnlocked ? (
                              <>
                                <span className="text-[10px] font-mono-plex bg-sage-light text-sage px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                                  {t('statusUnlockedSees').split(' ')[0]}
                                </span>
                                <button
                                  onClick={() => handleDownloadPDF(modulo)}
                                  className="text-coral hover:text-coral/85 transition-all flex items-center gap-1.5 font-mono-plex text-xs uppercase tracking-wider font-semibold cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  <span>{t('pdfMaterialLabel').replace(' (PDF)', '')} (PDF)</span>
                                </button>
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-ink-navy/40 w-full">
                                <Lock className="w-3.5 h-3.5 text-coral/60" />
                                <span className="text-[10px] font-mono-plex uppercase tracking-wider">
                                  {prevModulo 
                                    ? `${t('statusLockedHidden').split(' ')[0]} • ${t('unlockAfterModule')} ${prevModulo.ordem}`
                                    : t('statusLockedHidden')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Lesson History */}
              <section className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6">
                <div className="mb-4">
                  <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1">{t('learningRecord')}</span>
                  <h3 className="font-serif text-xl text-ink-navy">{t('pastClasses')}</h3>
                </div>

                {historicoAulas.length === 0 ? (
                  <div className="text-center py-8 text-sm font-sans text-ink-navy/40 bg-sand-light/30 rounded-lg">
                    {t('noPastClasses')}
                  </div>
                ) : (
                  <div className="overflow-hidden border border-[rgba(28,37,65,0.08)] rounded-[14px]">
                    <div className="hidden sm:block">
                      <table className="w-full text-left text-sm font-sans border-collapse">
                        <thead>
                          <tr className="bg-sand-light/50 border-b border-[rgba(28,37,65,0.08)]">
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colDateHour')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colTeacher')}</th>
                            <th className="p-4 font-mono-plex text-[10px] uppercase tracking-wider text-ink-navy/60">{t('colStatus')}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[rgba(28,37,65,0.08)]">
                          {historicoAulas.map(aula => (
                            <tr key={aula.id} className="hover:bg-sand-light/20 transition-all">
                              <td className="p-4 font-sans font-medium text-ink-navy">
                                {formatDate(aula.data_hora)} {t('emailTo').replace(':', '')} {formatTime(aula.data_hora)}
                              </td>
                              <td className="p-4 text-ink-navy/80">{t('teacherHelenaSantos')}</td>
                              <td className="p-4">
                                <span className={`inline-block text-[10px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  aula.status === 'realizada'
                                    ? 'bg-sage-light text-sage font-semibold'
                                    : 'bg-coral/10 text-coral font-semibold'
                                }`}>
                                  {aula.status === 'realizada' ? t('statusCompleted') : t('statusCancelled')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="block sm:hidden divide-y divide-[rgba(28,37,65,0.08)]">
                      {historicoAulas.map(aula => (
                        <div key={aula.id} className="p-4 space-y-2 bg-card-bg">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-ink-navy">
                              {formatDate(aula.data_hora).split(',')[1] || formatDate(aula.data_hora)} - {formatTime(aula.data_hora)}
                            </span>
                            <span className={`inline-block text-[9px] font-mono-plex uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              aula.status === 'realizada'
                                ? 'bg-sage-light text-sage font-semibold'
                                : 'bg-coral/10 text-coral font-semibold'
                            }`}>
                              {aula.status === 'realizada' ? t('statusCompleted') : t('statusCancelled')}
                            </span>
                          </div>
                          <div className="text-xs text-ink-navy/60">
                            {t('colTeacher')}: {t('teacherHelenaSantos')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

            </div>

            {/* Right Side Panel (Next Lesson & Pack status) */}
            <div className="space-y-6">
              
              {/* Highlighted Next Lesson */}
              <section className="bg-ink-navy text-sand rounded-[14px] p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-coral rounded-bl-full opacity-10 pointer-events-none"></div>

                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-coral" />
                    <span className="text-[10px] font-mono-plex uppercase tracking-widest font-bold text-coral">{t('nextClassLabel')}</span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-coral animate-ping"></span>
                </div>

                {proximaAula ? (
                  <div className="space-y-5">
                    <div>
                      <h4 className="font-serif text-2xl text-white tracking-tight leading-tight mb-1">
                        {formatTime(proximaAula.data_hora)}
                      </h4>
                      <p className="text-xs text-sand/80 capitalize font-medium">
                        {formatDate(proximaAula.data_hora)}
                      </p>
                    </div>

                    <div className="space-y-1 bg-white/5 border border-white/10 rounded-xl p-3.5">
                      <div className="text-[10px] font-mono-plex uppercase tracking-wider text-sand/50">{t('videoPlatform')}</div>
                      <div className="text-xs font-semibold truncate text-white">{proximaAula.link_video}</div>
                    </div>

                    <a
                      href={proximaAula.link_video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-coral hover:bg-coral/90 text-white font-sans font-medium text-xs uppercase tracking-wider py-3 px-4 rounded-[14px] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-coral/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{t('btnEnterVideo')}</span>
                    </a>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Clock className="w-10 h-10 mx-auto text-sand/30 mb-3" />
                    <p className="text-sm font-serif text-sand/80">{t('noLessonsScheduledStudent')}</p>
                    <p className="text-xs text-sand/50 mt-1">{t('teacherWillScheduleSoon')}</p>
                  </div>
                )}
              </section>

              {/* My Package & Billing Details */}
              <section className="bg-card-bg rounded-[14px] border border-[rgba(28,37,65,0.12)] p-6 space-y-5">
                <div>
                  <span className="text-[10px] font-mono-plex text-coral uppercase tracking-widest block mb-1 font-bold">{t('myContract')}</span>
                  <h3 className="font-serif text-lg text-ink-navy">{t('creditsFinancial')}</h3>
                </div>

                {activePacote ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-end text-xs font-sans">
                        <span className="text-ink-navy/70">{t('consumedClasses')}</span>
                        <span className="font-mono-plex font-bold text-ink-navy">
                          {activePacote.aulas_consumidas} / {activePacote.quantidade_aulas}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-sand-light rounded-full overflow-hidden border border-ink-navy/5">
                        <div 
                          className="h-full bg-sage transition-all duration-500 rounded-full" 
                          style={{ width: `${(activePacote.aulas_consumidas / activePacote.quantidade_aulas) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-[10px] text-right text-ink-navy/50 font-mono-plex uppercase tracking-wider">
                        {activePacote.quantidade_aulas - activePacote.aulas_consumidas} {t('classesRemaining')}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-ink-navy/5">
                      <div className="bg-sand-light/40 border border-[rgba(28,37,65,0.06)] rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-mono-plex uppercase tracking-wider text-ink-navy/50 block mb-0.5">{t('dueDate')}</span>
                        <span className="text-xs font-bold text-ink-navy">
                          {new Date(activePacote.vencimento + 'T12:00:00').toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'id' ? 'id-ID' : 'en-US')}
                        </span>
                      </div>
                      <div className="bg-sand-light/40 border border-[rgba(28,37,65,0.06)] rounded-xl p-2.5 text-center">
                        <span className="text-[9px] font-mono-plex uppercase tracking-wider text-ink-navy/50 block mb-0.5">{t('packageValue')}</span>
                        <span className="text-xs font-bold text-ink-navy">R$ {activePacote.valor}</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center justify-between bg-sand-light/60 border border-[rgba(28,37,65,0.08)] rounded-[14px] p-3">
                        <span className="text-xs text-ink-navy/70 font-sans">{t('monthlyFee')}</span>
                        
                        {activePacote.status === 'expirado' ? (
                          <span className="flex items-center gap-1 text-[10px] font-mono-plex uppercase tracking-wider bg-coral/10 text-coral font-bold px-2.5 py-1 rounded-full border border-coral/10">
                            <ShieldAlert className="w-3 h-3" />
                            <span>{t('statusExpired')}</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-mono-plex uppercase tracking-wider bg-sage-light text-sage font-bold px-2.5 py-1 rounded-full border border-sage/10">
                            <CheckCircle className="w-3 h-3" />
                            <span>{t('statusPaid')}</span>
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-4 text-xs font-sans text-ink-navy/40">
                    {t('noPackageContracted')}
                  </div>
                )}
              </section>

            </div>

          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="bg-card-bg border-t border-[rgba(28,37,65,0.08)] py-4 px-6 text-center mt-auto">
        <p className="text-[10px] font-mono-plex uppercase tracking-widest text-ink-navy/40">
          {t('footerBranding')}
        </p>
      </footer>

    </div>
  );
}
