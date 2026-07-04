import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'id';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  pt: {
    // General
    appName: 'Portal de Idiomas',
    appDesc: 'Gestão simplificada de aulas, materiais e pagamentos.',
    loadingSession: 'Carregando Sessão...',
    loadingData: 'Carregando dados...',
    loadingPortal: 'Carregando portal...',
    logout: 'Sair',
    cancel: 'Cancelar',
    save: 'Salvar',
    notScheduled: 'Não agendada',
    statusPaid: 'Em dia',
    statusPending: 'Pendente',
    statusExpired: 'Expirado',
    student: 'Aluno',
    professor: 'Professora',
    teacher: 'Professor',

    // Login Screen
    loginTitle: 'Portal de Idiomas',
    loginSub: 'Gestão simplificada de aulas, materiais e pagamentos.',
    loginErrorFields: 'Por favor, preencha todos os campos.',
    emailLabel: 'E-mail',
    passwordLabel: 'Senha',
    btnEnter: 'Entrar na plataforma',
    demoAccessTitle: 'Acesso Rápido de Demonstração',
    demoHelena: 'Meella (Profa)',
    demoCarlos: 'Carlos (Aluno)',
    demoMarcus: 'Marcus (Prof)',
    demoMariana: 'Mariana (Aluna)',

    // Professor Dashboard - General
    forceCron: 'Forçar pg_cron (Lembretes)',
    executingCron: 'Simulação de pg_cron executada:',
    navDashboard: 'Painel',
    navStudents: 'Alunos',
    navCourses: 'Cursos & Módulos',
    navSchedule: 'Agenda de Aulas',
    navBilling: 'Faturamento',

    // Professor Dashboard - Stats
    statPortfolio: 'ALUNOS',
    statStudentsDesc: 'Alunos ativos matriculados',
    statPending: 'PENDÊNCIAS',
    statInvoicesDesc: 'faturas de pacotes em aberto',
    statSchedule: 'AGENDA',
    statClassesDesc: 'Aulas agendadas para os próximos 7 dias',

    // Professor Dashboard - Immediate Schedule
    immediateSchedule: 'AGENDA IMEDIATA',
    scheduledClasses: 'Aulas Agendadas',
    viewFullSchedule: 'Ver agenda completa →',
    noClassesScheduled: 'Nenhuma aula agendada no momento.',
    classCompletedBtn: 'Realizada',
    classCancelBtn: 'Cancelar',

    // Professor Dashboard - Email log
    emailLogsTitle: 'NOTIFICAÇÕES DE EMAIL (RESEND)',
    serverDispatches: 'Envios do Servidor',
    noEmailsSent: 'Nenhum e-mail disparado recentemente.',
    emailTo: 'Para:',

    // Professor Dashboard - Students management
    academicManagement: 'GESTÃO ACADÊMICA',
    studentList: 'Lista de Alunos',
    registerStudentBtn: 'Cadastrar Aluno',
    registerNewStudentTitle: 'Cadastrar Novo Aluno',
    fullNameLabel: 'Nome Completo',
    accessEmailLabel: 'E-mail de Acesso',
    initialPasswordLabel: 'Senha Inicial',
    linkToCourseLabel: 'Vincular ao Curso',
    initialPackageClassesLabel: 'Aulas do Pacote Inicial',
    packagePriceLabel: 'Valor do Pacote (R$)',
    btnSaveStudent: 'Salvar Aluno & Enviar E-mail',
    noStudentsRegistered: 'Nenhum aluno cadastrado. Cadastre o primeiro aluno acima!',

    // Students table columns
    colNameCourse: 'Nome e Curso',
    colPackRemaining: 'Pacote & Aulas Restantes',
    colNextClass: 'Próxima Aula',
    colPayment: 'Pagamento',
    colMaterialsManual: 'Materiais (Manual)',
    colActions: 'Ações',
    remainingClassesLabel: 'aulas restantes',
    btnManageUnlocked: 'Gerenciar Liberados',
    btnRemoveStudent: 'Excluir',
    confirmRemoveStudent: 'Deseja realmente remover este aluno? Toda a sua matrícula, pacotes e histórico serão apagados permanentemente.',

    // Student Matrix Content Drawer
    matrixIndividualTitle: 'MATRIZ DE CONTEÚDO INDIVIDUAL',
    unlockModulesFor: 'Liberar Módulos para:',
    studentNotEnrolled: 'Este aluno não está matriculado em nenhum curso ainda.',
    noModulesAddedCourse: 'Nenhum módulo adicionado ao curso ainda.',
    statusUnlockedSees: 'Liberado (Aluno vê)',
    statusLockedHidden: 'Bloqueado (Oculto)',
    btnBlock: 'Bloquear',
    btnUnlockMaterial: 'Liberar Material',

    // Courses & Modules Tab
    createdCoursesTitle: 'Cursos Criados',
    btnNewCourse: 'Novo',
    courseNamePlaceholder: 'Nome do curso (ex: Francês Intermediário)',
    noCoursesCreated: 'Nenhum curso cadastrado ainda.',
    modulesOfCourse: 'Módulos do Curso:',
    btnAddModule: 'Adicionar Módulo',
    moduleTitleLabel: 'Título do Módulo',
    moduleTitlePlaceholder: 'Ex: Aula 01 - Les Salutations',
    moduleDescLabel: 'Descrição do Material',
    moduleDescPlaceholder: 'Descreva os objetivos, gramática e vocabulário...',
    moduleOrderLabel: 'Ordem Sequencial',
    simulatingPdfUpload: 'Simulando envio de arquivo PDF...',
    btnCreateModule: 'Criar Módulo & Upload PDF',
    btnRemoveCourse: 'Excluir Curso',
    confirmRemoveCourse: 'Deseja remover este curso? Todos os módulos vinculados serão excluídos.',
    noModulesInThisCourse: 'Este curso não possui módulos criados ainda.',
    pdfMaterialLabel: 'Material Didático (PDF)',
    btnDeleteModule: 'Excluir Módulo',
    confirmDeleteModule: 'Deseja excluir este módulo?',

    // Class Schedule Tab
    scheduleManagement: 'GESTÃO DE HORÁRIOS',
    classScheduleTitle: 'Agenda de Aulas',
    btnScheduleLesson: 'Agendar Nova Aula',
    btnViewCalendar: 'Ver Calendário',
    btnViewList: 'Ver Lista',
    scheduleLessonTitle: 'Agendar Nova Aula de Idioma',
    selectStudentLabel: 'Selecione o Aluno',
    dateTimeLabel: 'Data e Hora da Aula',
    videoLinkPlaceholder: 'Link da videochamada (Google Meet, Teams, Zoom...)',
    btnSaveSchedule: 'Salvar Agendamento & Avisar Aluno',
    noLessonsScheduled: 'Nenhum agendamento futuro encontrado.',
    colClassDate: 'Data e Hora',
    colStudent: 'Aluno',
    colClassStatus: 'Status do Agendamento',
    statusScheduled: 'Agendada',
    statusCompleted: 'Realizada',
    statusCancelled: 'Cancelada',
    confirmCancelSchedule: 'Deseja cancelar e excluir este agendamento?',

    // Billing Tab
    financialBilling: 'FINANCEIRO & CRÉDITOS',
    billingControl: 'Faturamento de Alunos',
    noInvoicesFound: 'Nenhum faturamento registrado.',
    colPackInvoice: 'Pacote contratado',
    colInvoiceDate: 'Data de Faturamento',
    colInvoiceValue: 'Valor Total',
    colInvoiceStatus: 'Status do Recebimento',
    btnMarkReceived: 'Baixa Manual',
    colBillingInvoices: 'Mensalidades / Faturas de Pacotes',
    last30Days: 'Últimos 30 dias',
    last60Days: 'Últimos 60 dias',
    last90Days: 'Últimos 90 dias',
    clearFilter: 'Limpar filtro',
    viewChart: 'Ver Gráfico',
    january: 'Janeiro',
    february: 'Fevereiro',
    march: 'Março',
    april: 'Abril',
    may: 'Maio',
    june: 'Junho',
    july: 'Julho',
    august: 'Agosto',
    september: 'Setembro',
    october: 'Outubro',
    november: 'Novembro',
    december: 'Dezembro',
    activeStudents: 'Alunos Ativos',
    invoicesIssued: 'Faturas Emitidas',
    totalBilled: 'Total Faturado',

    // Student Portal
    studyProgram: 'PROGRAMA DE ESTUDO',
    learningModules: 'Módulos de Aprendizado',
    sequentialOrder: 'Em ordem sequencial',
    noCourseEnrolled: 'Nenhum curso matriculado no momento.',
    teachersUpdateSoon: 'Sua professora atualizará seu curso em breve.',
    learningRecord: 'REGISTRO DE APRENDIZADO',
    pastClasses: 'Aulas Anteriores',
    noPastClasses: 'Nenhuma aula realizada no histórico ainda.',
    colDateHour: 'Data e Hora',
    colTeacher: 'Professor',
    colStatus: 'Status',
    nextClassLabel: 'PRÓXIMA AULA',
    btnEnterVideo: 'Entrar na Videochamada',
    videoPlatform: 'Plataforma de Video',
    noLessonsScheduledStudent: 'Nenhuma aula agendada.',
    teacherWillScheduleSoon: 'Sua professora agendará o próximo horário em breve.',
    myContract: 'MEU CONTRATO',
    creditsFinancial: 'Créditos & Financeiro',
    consumedClasses: 'Aulas Consumidas',
    classesRemaining: 'aulas restantes',
    dueDate: 'VENCIMENTO',
    packageValue: 'VALOR DO PACOTE',
    monthlyFee: 'Mensalidade',
    noPackageContracted: 'Nenhum pacote de aulas contratado.',
    footerBranding: 'PLATA-IDIOMAS • PORTAL DO ALUNO • EST. 2026',
    teacherHelenaSantos: 'Meella Abdullah',
    studentPortalTitle: 'Portal do Aluno',
    // Database and dynamic strings
    'Inglês Avançado para Negócios': 'Inglês Avançado para Negócios',
    'Espanhol Fluente': 'Espanhol Fluente',
    'Italiano Prático': 'Italiano Prático',
    'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.': 'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.',
    'Business Negotiation Tactics': 'Business Negotiation Tactics',
    'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.': 'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.',
    'Advanced Report Writing': 'Advanced Report Writing',
    'Como estruturar relatórios executivos formais com conectores lógicos avançados.': 'Como estruturar relatórios executivos formais com conectores lógicos avançados.',
    'Saludos y Presentaciones de Negocios': 'Saludos y Presentaciones de Negocios',
    'Primeiros contatos, saudações formais e apresentações no ambiente profissional.': 'Primeiros contatos, saudações formais e apresentações no ambiente profissional.',
    'La Gramática del Éxito': 'La Gramática del Éxito',
    'Expressando opiniões com o subjuntivo de forma polida e estruturada.': 'Expressando opiniões com o subjuntivo de forma polida e estruturada.',
    'Introduzione alla Lingua': 'Introduzione alla Lingua',
    'Pronúncia básica, cumprimentos e situações cotidianas simples.': 'Pronúncia básica, cumprimentos e situações cotidianas simples.',
    'Aula 1 ': 'Aula 1 ',
    'Aula 1': 'Aula 1',
    'começando no inlges': 'começando no inglês',
    'Inglês Avançado - Pacote Inicial': 'Inglês Avançado - Pacote Inicial',
    'Espanhol Fluente - Pacote Inicial': 'Espanhol Fluente - Pacote Inicial',
    'Italiano Prático - Pacote Inicial': 'Italiano Prático - Pacote Inicial',
    // Custom labels
    modulesInProgram: 'módulos no programa',
    selectCoursePlaceholder: '-- Selecione o Curso --',
    moduleOrderPlaceholder: 'Próxima sequencial',
    selectStudyPdf: 'Selecione o arquivo PDF de Estudos',
    pdfSimulatorDesc: 'Simulador de Storage do Supabase integrado (PDF será criado automaticamente na pasta local uploads/)',
    selectCourseToEditModules: 'Crie ou selecione um curso na barra lateral para editar os módulos.',
    alertRegisterStudentFirst: 'Por favor, cadastre um aluno antes de agendar uma aula.',
    colVideoLink: 'Link do Vídeo',
    billingControlDesc: 'Monitore os vencimentos e marque os pagamentos recebidos manualmente no painel abaixo.',
    unlockAfterModule: 'Liberar após o Módulo',
  },
  en: {
    // General
    appName: 'Language Portal',
    appDesc: 'Simplified management of classes, materials, and payments.',
    loadingSession: 'Loading Session...',
    loadingData: 'Loading data...',
    loadingPortal: 'Loading portal...',
    logout: 'Logout',
    cancel: 'Cancel',
    save: 'Save',
    notScheduled: 'Not scheduled',
    statusPaid: 'Paid',
    statusPending: 'Pending',
    statusExpired: 'Expired',
    student: 'Student',
    professor: 'Professor',
    teacher: 'Teacher',

    // Login Screen
    loginTitle: 'Language Portal',
    loginSub: 'Simplified management of classes, materials, and payments.',
    loginErrorFields: 'Please fill in all fields.',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    btnEnter: 'Enter platform',
    demoAccessTitle: 'Demo Fast Access',
    demoHelena: 'Meella (Prof)',
    demoCarlos: 'Carlos (Student)',
    demoMarcus: 'Marcus (Prof)',
    demoMariana: 'Mariana (Student)',

    // Professor Dashboard - General
    forceCron: 'Force pg_cron (Reminders)',
    executingCron: 'pg_cron simulation executed:',
    navDashboard: 'Dashboard',
    navStudents: 'Students',
    navCourses: 'Courses & Modules',
    navSchedule: 'Class Schedule',
    navBilling: 'Billing',

    // Professor Dashboard - Stats
    statPortfolio: 'STUDENTS',
    statStudentsDesc: 'Active enrolled students',
    statPending: 'PENDING',
    statInvoicesDesc: 'unpaid package invoices',
    statSchedule: 'AGENDA',
    statClassesDesc: 'Classes scheduled for the next 7 days',

    // Professor Dashboard - Immediate Schedule
    immediateSchedule: 'IMMEDIATE SCHEDULE',
    scheduledClasses: 'Scheduled Classes',
    viewFullSchedule: 'View full schedule →',
    noClassesScheduled: 'No classes scheduled at the moment.',
    classCompletedBtn: 'Completed',
    classCancelBtn: 'Cancel',

    // Professor Dashboard - Email log
    emailLogsTitle: 'EMAIL NOTIFICATIONS (RESEND)',
    serverDispatches: 'Server Dispatches',
    noEmailsSent: 'No emails sent recently.',
    emailTo: 'To:',

    // Professor Dashboard - Students management
    academicManagement: 'ACADEMIC MANAGEMENT',
    studentList: 'Student List',
    registerStudentBtn: 'Register Student',
    registerNewStudentTitle: 'Register New Student',
    fullNameLabel: 'Full Name',
    accessEmailLabel: 'Access Email',
    initialPasswordLabel: 'Initial Password',
    linkToCourseLabel: 'Link to Course',
    initialPackageClassesLabel: 'Initial Package Classes',
    packagePriceLabel: 'Package Price (R$)',
    btnSaveStudent: 'Save Student & Send Email',
    noStudentsRegistered: 'No students registered. Register the first student above!',

    // Students table columns
    colNameCourse: 'Name and Course',
    colPackRemaining: 'Package & Remaining Classes',
    colNextClass: 'Next Class',
    colPayment: 'Payment',
    colMaterialsManual: 'Materials (Manual)',
    colActions: 'Actions',
    remainingClassesLabel: 'remaining classes',
    btnManageUnlocked: 'Manage Unlocked',
    btnRemoveStudent: 'Remove',
    confirmRemoveStudent: 'Do you really want to remove this student? All their enrollment, packages, and history will be permanently deleted.',

    // Student Matrix Drawer
    matrixIndividualTitle: 'INDIVIDUAL CONTENT MATRIX',
    unlockModulesFor: 'Unlock Modules for:',
    studentNotEnrolled: 'This student is not enrolled in any course yet.',
    noModulesAddedCourse: 'No modules added to this course yet.',
    statusUnlockedSees: 'Unlocked (Student sees)',
    statusLockedHidden: 'Locked (Hidden)',
    btnBlock: 'Block',
    btnUnlockMaterial: 'Unlock Material',

    // Courses & Modules Tab
    createdCoursesTitle: 'Created Courses',
    btnNewCourse: 'New',
    courseNamePlaceholder: 'Course name (e.g. Intermediate French)',
    noCoursesCreated: 'No courses registered yet.',
    modulesOfCourse: 'Course Modules:',
    btnAddModule: 'Add Module',
    moduleTitleLabel: 'Module Title',
    moduleTitlePlaceholder: 'E.g. Lesson 01 - Les Salutations',
    moduleDescLabel: 'Material Description',
    moduleDescPlaceholder: 'Describe learning goals, grammar, and vocabulary...',
    moduleOrderLabel: 'Sequential Order',
    simulatingPdfUpload: 'Simulating PDF file upload...',
    btnCreateModule: 'Create Module & Upload PDF',
    btnRemoveCourse: 'Delete Course',
    confirmRemoveCourse: 'Do you want to delete this course? All linked modules will be deleted.',
    noModulesInThisCourse: 'This course has no modules created yet.',
    pdfMaterialLabel: 'Educational Material (PDF)',
    btnDeleteModule: 'Delete Module',
    confirmDeleteModule: 'Do you want to delete this module?',

    // Class Schedule Tab
    scheduleManagement: 'SCHEDULE MANAGEMENT',
    classScheduleTitle: 'Class Schedule',
    btnScheduleLesson: 'Schedule New Lesson',
    btnViewCalendar: 'View Calendar',
    btnViewList: 'View List',
    scheduleLessonTitle: 'Schedule New Language Class',
    selectStudentLabel: 'Select Student',
    dateTimeLabel: 'Class Date & Time',
    videoLinkPlaceholder: 'Video call link (Google Meet, Teams, Zoom...)',
    btnSaveSchedule: 'Save Schedule & Notify Student',
    noLessonsScheduled: 'No future classes scheduled.',
    colClassDate: 'Date and Time',
    colStudent: 'Student',
    colClassStatus: 'Schedule Status',
    statusScheduled: 'Scheduled',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    confirmCancelSchedule: 'Do you want to cancel and delete this schedule?',

    // Billing Tab
    financialBilling: 'FINANCIAL & CREDITS',
    billingControl: 'Student Billing',
    noInvoicesFound: 'No billing records found.',
    colPackInvoice: 'Contracted Package',
    colInvoiceDate: 'Billing Date',
    colInvoiceValue: 'Total Price',
    colInvoiceStatus: 'Receipt Status',
    btnMarkReceived: 'Manual Log',
    colBillingInvoices: 'Monthly Invoices / Package Billing',
    last30Days: 'Last 30 days',
    last60Days: 'Last 60 days',
    last90Days: 'Last 90 days',
    clearFilter: 'Clear filter',
    viewChart: 'View Chart',
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
    activeStudents: 'Active Students',
    invoicesIssued: 'Invoices Issued',
    totalBilled: 'Total Billed',

    // Student Portal
    studyProgram: 'STUDY PROGRAM',
    learningModules: 'Learning Modules',
    sequentialOrder: 'In sequential order',
    noCourseEnrolled: 'No courses enrolled at the moment.',
    teachersUpdateSoon: 'Your teacher will update your course soon.',
    learningRecord: 'LEARNING RECORD',
    pastClasses: 'Past Classes',
    noPastClasses: 'No completed classes in the history yet.',
    colDateHour: 'Date and Time',
    colTeacher: 'Teacher',
    colStatus: 'Status',
    nextClassLabel: 'NEXT CLASS',
    btnEnterVideo: 'Join Video Call',
    videoPlatform: 'Video Platform',
    noLessonsScheduledStudent: 'No classes scheduled.',
    teacherWillScheduleSoon: 'Your teacher will schedule your next session soon.',
    myContract: 'MY CONTRACT',
    creditsFinancial: 'Credits & Finance',
    consumedClasses: 'Consumed Classes',
    classesRemaining: 'classes remaining',
    dueDate: 'DUE DATE',
    packageValue: 'PACKAGE PRICE',
    monthlyFee: 'Monthly Fee',
    noPackageContracted: 'No package contracted yet.',
    footerBranding: 'LANG-PORTAL • STUDENT PORTAL • EST. 2026',
    teacherHelenaSantos: 'Meella Abdullah',
    studentPortalTitle: 'Student Portal',
    // Database and dynamic strings
    'Inglês Avançado para Negócios': 'Advanced Business English',
    'Espanhol Fluente': 'Fluent Spanish',
    'Italiano Prático': 'Practical Italian',
    'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.': 'Learn to report project achievements using the Present Perfect tense.',
    'Business Negotiation Tactics': 'Business Negotiation Tactics',
    'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.': 'Essential vocabulary for negotiations, closing deals, and handling objections.',
    'Advanced Report Writing': 'Advanced Report Writing',
    'Como estruturar relatórios executivos formais com conectores lógicos avançados.': 'How to structure formal executive reports with advanced logical connectors.',
    'Saludos y Presentaciones de Negocios': 'Business Greetings and Presentations',
    'Primeiros contatos, saudações formais e apresentações no ambiente profissional.': 'First contacts, formal greetings, and presentations in the professional environment.',
    'La Gramática del Éxito': 'The Grammar of Success',
    'Expressando opiniões com o subjuntivo de forma polida e estruturada.': 'Expressing opinions with the subjunctive in a polite and structured way.',
    'Introduzione alla Lingua': 'Introduction to the Language',
    'Pronúncia básica, cumprimentos e situações cotidianas simples.': 'Basic pronunciation, greetings, and simple everyday situations.',
    'Aula 1 ': 'Lesson 1 ',
    'Aula 1': 'Lesson 1',
    'começando no inlges': 'starting in English',
    'Inglês Avançado - Pacote Inicial': 'Advanced English - Initial Package',
    'Espanhol Fluente - Pacote Inicial': 'Fluent Spanish - Initial Package',
    'Italiano Prático - Pacote Inicial': 'Practical Italian - Initial Package',
    // Custom labels
    modulesInProgram: 'modules in program',
    selectCoursePlaceholder: '-- Select Course --',
    moduleOrderPlaceholder: 'Next sequential',
    selectStudyPdf: 'Select the Study PDF file',
    pdfSimulatorDesc: 'Integrated Supabase Storage Simulator (PDF will be automatically created in local folder uploads/)',
    selectCourseToEditModules: 'Create or select a course in the sidebar to edit modules.',
    alertRegisterStudentFirst: 'Please register a student before scheduling a lesson.',
    colVideoLink: 'Video Link',
    billingControlDesc: 'Monitor due dates and manually mark received payments in the ledger below.',
    unlockAfterModule: 'Unlock after Module',
  },
  id: {
    // General
    appName: 'Portal Bahasa',
    appDesc: 'Manajemen sederhana untuk kelas, materi, dan pembayaran.',
    loadingSession: 'Memuat Sesi...',
    loadingData: 'Memuat data...',
    loadingPortal: 'Memuat portal...',
    logout: 'Keluar',
    cancel: 'Batal',
    save: 'Simpan',
    notScheduled: 'Belum dijadwalkan',
    statusPaid: 'Lunas',
    statusPending: 'Tertunda',
    statusExpired: 'Kedaluwarsa',
    student: 'Siswa',
    professor: 'Guru',
    teacher: 'Guru',

    // Login Screen
    loginTitle: 'Portal Bahasa',
    loginSub: 'Manajemen sederhana untuk kelas, materi, dan pembayaran.',
    loginErrorFields: 'Silakan isi semua kolom.',
    emailLabel: 'Email',
    passwordLabel: 'Kata Sandi',
    btnEnter: 'Masuk ke Platform',
    demoAccessTitle: 'Akses Cepat Demo',
    demoHelena: 'Meella (Guru)',
    demoCarlos: 'Carlos (Siswa)',
    demoMarcus: 'Marcus (Guru)',
    demoMariana: 'Mariana (Siswi)',

    // Professor Dashboard - General
    forceCron: 'Paksa pg_cron (Pengingat)',
    executingCron: 'Simulasi pg_cron dijalankan:',
    navDashboard: 'Dasbor',
    navStudents: 'Siswa',
    navCourses: 'Kursus & Modul',
    navSchedule: 'Jadwal Kelas',
    navBilling: 'Penagihan',

    // Professor Dashboard - Stats
    statPortfolio: 'SISWA',
    statStudentsDesc: 'Siswa aktif terdaftar',
    statPending: 'PENDING',
    statInvoicesDesc: 'tagihan paket belum dibayar',
    statSchedule: 'AGENDA',
    statClassesDesc: 'Kelas dijadwalkan untuk 7 hari ke depan',

    // Professor Dashboard - Immediate Schedule
    immediateSchedule: 'JADWAL SEGERA',
    scheduledClasses: 'Kelas Terjadwal',
    viewFullSchedule: 'Lihat jadwal lengkap →',
    noClassesScheduled: 'Belum ada kelas yang dijadwalkan.',
    classCompletedBtn: 'Selesai',
    classCancelBtn: 'Batal',

    // Professor Dashboard - Email log
    emailLogsTitle: 'NOTIFIKASI EMAIL (RESEND)',
    serverDispatches: 'Pengiriman Server',
    noEmailsSent: 'Tidak ada email yang dikirim baru-baru ini.',
    emailTo: 'Kepada:',

    // Professor Dashboard - Students management
    academicManagement: 'MANAJEMEN AKADEMIK',
    studentList: 'Daftar Siswa',
    registerStudentBtn: 'Daftar Siswa',
    registerNewStudentTitle: 'Daftar Siswa Baru',
    fullNameLabel: 'Nama Lengkap',
    accessEmailLabel: 'Email Akses',
    initialPasswordLabel: 'Kata Sandi Awal',
    linkToCourseLabel: 'Hubungkan ke Kursus',
    initialPackageClassesLabel: 'Kelas Paket Awal',
    packagePriceLabel: 'Harga Paket (R$)',
    btnSaveStudent: 'Simpan Siswa & Kirim Email',
    noStudentsRegistered: 'Belum ada siswa terdaftar. Daftarkan siswa pertama di atas!',

    // Students table columns
    colNameCourse: 'Nama dan Kursus',
    colPackRemaining: 'Paket & Sisa Kelas',
    colNextClass: 'Kelas Berikutnya',
    colPayment: 'Pembayaran',
    colMaterialsManual: 'Materi (Manual)',
    colActions: 'Tindakan',
    remainingClassesLabel: 'sisa kelas',
    btnManageUnlocked: 'Kelola yang Dibuka',
    btnRemoveStudent: 'Hapus',
    confirmRemoveStudent: 'Apakah Anda yakin ingin menghapus siswa ini? Semua pendaftaran, paket, dan riwayat mereka akan dihapus secara permanen.',

    // Student Matrix Drawer
    matrixIndividualTitle: 'MATRIKS KONTEN INDIVIDU',
    unlockModulesFor: 'Buka Modul untuk:',
    studentNotEnrolled: 'Siswa ini belum terdaftar dalam kursus apa pun.',
    noModulesAddedCourse: 'Belum ada modul yang ditambahkan ke kursus ini.',
    statusUnlockedSees: 'Dibuka (Siswa melihat)',
    statusLockedHidden: 'Terkunci (Tersembunyi)',
    btnBlock: 'Kunci',
    btnUnlockMaterial: 'Buka Materi',

    // Courses & Modules Tab
    createdCoursesTitle: 'Kursus yang Dibuat',
    btnNewCourse: 'Baru',
    courseNamePlaceholder: 'Nama kursus (mis. Bahasa Prancis Menengah)',
    noCoursesCreated: 'Belum ada kursus terdaftar.',
    modulesOfCourse: 'Modul Kursus:',
    btnAddModule: 'Tambah Modul',
    moduleTitleLabel: 'Judul Modul',
    moduleTitlePlaceholder: 'Mis. Pelajaran 01 - Les Salutations',
    moduleDescLabel: 'Deskripsi Materi',
    moduleDescPlaceholder: 'Jelaskan tujuan pembelajaran, tata bahasa, dan kosakata...',
    moduleOrderLabel: 'Urutan Sekuensial',
    simulatingPdfUpload: 'Simulasi unggah file PDF...',
    btnCreateModule: 'Buat Modul & Unggah PDF',
    btnRemoveCourse: 'Hapus Kursus',
    confirmRemoveCourse: 'Apakah Anda ingin menghapus kursus ini? Semua modul terkait akan dihapus.',
    noModulesInThisCourse: 'Kursus ini belum memiliki modul.',
    pdfMaterialLabel: 'Materi Pendidikan (PDF)',
    btnDeleteModule: 'Hapus Modul',
    confirmDeleteModule: 'Apakah Anda ingin menghapus modul ini?',

    // Class Schedule Tab
    scheduleManagement: 'MANAJEMEN JADWAL',
    classScheduleTitle: 'Jadwal Kelas',
    btnScheduleLesson: 'Jadwalkan Kelas Baru',
    btnViewCalendar: 'Lihat Kalender',
    btnViewList: 'Lihat Daftar',
    scheduleLessonTitle: 'Jadwalkan Kelas Bahasa Baru',
    selectStudentLabel: 'Pilih Siswa',
    dateTimeLabel: 'Tanggal & Waktu Kelas',
    videoLinkPlaceholder: 'Tautan panggilan video (Google Meet, Teams, Zoom...)',
    btnSaveSchedule: 'Simpan Jadwal & Beritahu Siswa',
    noLessonsScheduled: 'Tidak ada kelas terjadwal di masa depan.',
    colClassDate: 'Tanggal dan Waktu',
    colStudent: 'Siswa',
    colClassStatus: 'Status Jadwal',
    statusScheduled: 'Dijadwalkan',
    statusCompleted: 'Selesai',
    statusCancelled: 'Dibatalkan',
    confirmCancelSchedule: 'Apakah Anda ingin membatalkan dan menghapus jadwal ini?',

    // Billing Tab
    financialBilling: 'KEUANGAN & KREDIT',
    billingControl: 'Penagihan Siswa',
    noInvoicesFound: 'Tidak ada catatan tagihan.',
    colPackInvoice: 'Paket yang Dikontrak',
    colInvoiceDate: 'Tanggal Penagihan',
    colInvoiceValue: 'Total Harga',
    colInvoiceStatus: 'Status Pembayaran',
    btnMarkReceived: 'Catatan Manual',
    colBillingInvoices: 'Tagihan Bulanan / Penagihan Paket',
    last30Days: '30 hari terakhir',
    last60Days: '60 hari terakhir',
    last90Days: '90 hari terakhir',
    clearFilter: 'Hapus filter',
    viewChart: 'Lihat Grafik',
    january: 'Januari',
    february: 'Februari',
    march: 'Maret',
    april: 'April',
    may: 'Mei',
    june: 'Juni',
    july: 'Juli',
    august: 'Agustus',
    september: 'September',
    october: 'Oktober',
    november: 'November',
    december: 'Desember',
    activeStudents: 'Siswa Aktif',
    invoicesIssued: 'Tagihan Diterbitkan',
    totalBilled: 'Total Ditagih',

    // Student Portal
    studyProgram: 'PROGRAM STUDI',
    learningModules: 'Modul Pembelajaran',
    sequentialOrder: 'Dalam urutan sekuensial',
    noCourseEnrolled: 'Tidak ada kursus yang diikuti saat ini.',
    teachersUpdateSoon: 'Guru Anda akan segera memperbarui kursus Anda.',
    learningRecord: 'REKAMAN BELAJAR',
    pastClasses: 'Kelas Sebelumnya',
    noPastClasses: 'Belum ada kelas selesai dalam riwayat.',
    colDateHour: 'Tanggal dan Waktu',
    colTeacher: 'Guru',
    colStatus: 'Status',
    nextClassLabel: 'KELAS BERIKUTNYA',
    btnEnterVideo: 'Masuk ke Panggilan Video',
    videoPlatform: 'Platform Video',
    noLessonsScheduledStudent: 'Tidak ada kelas terjadwal.',
    teacherWillScheduleSoon: 'Guru Anda akan segera menjadwalkan sesi berikutnya.',
    myContract: 'KONTRAK SAYA',
    creditsFinancial: 'Kredit & Keuangan',
    consumedClasses: 'Kelas Dikonsumsi',
    classesRemaining: 'sisa kelas',
    dueDate: 'JATUH TEMPO',
    packageValue: 'HARGA PAKET',
    monthlyFee: 'Biaya Bulanan',
    noPackageContracted: 'Belum ada paket yang dikontrak.',
    footerBranding: 'LANG-PORTAL • STUDENT PORTAL • EST. 2026',
    teacherHelenaSantos: 'Guru Meella Abdullah',
    studentPortalTitle: 'Portal Siswa',
    // Database and dynamic strings
    'Inglês Avançado para Negócios': 'Bahasa Inggris Bisnis Lanjutan',
    'Espanhol Fluente': 'Bahasa Spanyol Lancar',
    'Italiano Prático': 'Bahasa Italia Praktis',
    'Aprenda a reportar conquistas de projetos usando o tempo verbal Present Perfect.': 'Pelajari cara melaporkan pencapaian proyek menggunakan tenses Present Perfect.',
    'Business Negotiation Tactics': 'Taktik Negosiasi Bisnis',
    'Vocabulário essencial para negociações, fechamento de acordos e gestão de objeções.': 'Kosakata penting untuk negosiasi, kesepakatan penutupan, dan menangani keberatan.',
    'Advanced Report Writing': 'Penulisan Laporan Lanjutan',
    'Como estruturar relatórios executivos formais com conectores lógicos avançados.': 'Cara menyusun laporan eksekutif formal dengan konektor logis lanjutan.',
    'Saludos y Presentaciones de Negocios': 'Salam dan Presentasi Bisnis',
    'Primeiros contatos, saudações formais e apresentações no ambiente profissional.': 'Kontak pertama, salam formal, dan presentasi di lingkungan profesional.',
    'La Gramática del Éxito': 'Tata Bahasa Kesuksesan',
    'Expressando opiniões com o subjuntivo de forma polida e estruturada.': 'Mengekspresikan pendapat dengan subjungtif dengan cara yang sopan dan terstruktur.',
    'Introduzione alla Lingua': 'Pengantar Bahasa',
    'Pronúncia básica, cumprimentos e situações cotidianas simples.': 'Pelafalan dasar, salam, dan situasi sehari-hari yang sederhana.',
    'Aula 1 ': 'Pelajaran 1 ',
    'Aula 1': 'Pelajaran 1',
    'começando no inlges': 'mulai dalam bahasa Inggris',
    'Inglês Avançado - Pacote Inicial': 'Bahasa Inggris Lanjutan - Paket Awal',
    'Espanhol Fluente - Pacote Inicial': 'Bahasa Spanyol Lancar - Paket Awal',
    'Italiano Prático - Pacote Inicial': 'Bahasa Italia Praktis - Paket Awal',
    // Custom labels
    modulesInProgram: 'modul dalam program',
    selectCoursePlaceholder: '-- Pilih Kursus --',
    moduleOrderPlaceholder: 'Urutan berikutnya',
    selectStudyPdf: 'Pilih file PDF Studi',
    pdfSimulatorDesc: 'Simulator Penyimpanan Supabase Terintegrasi (PDF akan dibuat secara otomatis di folder lokal uploads/)',
    selectCourseToEditModules: 'Buat atau pilih kursus di bilah samping untuk mengedit modul.',
    alertRegisterStudentFirst: 'Silakan daftarkan siswa sebelum menjadwalkan pelajaran.',
    colVideoLink: 'Tautan Video',
    billingControlDesc: 'Pantau tanggal jatuh tempo dan tandai pembayaran yang diterima secara manual di buku besar di bawah ini.',
    unlockAfterModule: 'Buka setelah Modul',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('idiomas_language');
      if (stored === 'pt' || stored === 'en' || stored === 'id') {
        return stored as Language;
      }
    } catch (e) {
      console.error('Error recovering language during init:', e);
    }
    return 'pt';
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem('idiomas_language');
      if (stored === 'pt' || stored === 'en' || stored === 'id') {
        setLanguageState(stored as Language);
      }
    } catch (e) {
      console.error('Error recovering language:', e);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('idiomas_language', lang);
    } catch (e) {
      console.error('Error saving language:', e);
    }
  };

  const t = (key: string): string => {
    const dict = translations[language];
    return dict[key] || translations['pt'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
