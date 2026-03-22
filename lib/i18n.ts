export type Language = "en" | "de" | "es" | "fr" | "it" | "tr" | "ar" | "ru" | "zh" | "hi"

export interface Translation {
  // Navigation
  home: string
  practice: string
  test: string
  review: string
  settings: string
  back: string

  // Common actions
  start: string
  continue: string
  reset: string
  submit: string
  cancel: string
  save: string
  export: string
  import: string

  // Practice mode
  practiceMode: string
  practiceSubtitle: string
  swipeInstructions: string
  selectAnswer: string
  swipeRight: string
  swipeLeft: string
  keyboardShortcuts: string

  // Test mode
  testMode: string
  testSubtitle: string
  timeRemaining: string
  question: string
  of: string
  submitTest: string
  testResults: string

  // Results
  correct: string
  incorrect: string
  passed: string
  failed: string
  score: string
  accuracy: string
  keepLearning: string
  crushing: string
  xpEarned: string

  // Stats
  progress: string
  xp: string
  streak: string
  totalQuestions: string
  correctAnswers: string
  flaggedQuestions: string
  completedQuestions: string

  // Categories
  allCategories: string
  politics: string
  history: string
  law: string
  culture: string
  geography: string

  // Settings
  appearance: string
  darkMode: string
  lightMode: string
  language: string
  dataManagement: string
  exportProgress: string
  importProgress: string
  resetProgress: string

  // Badges
  achievements: string
  firstCorrect: string
  streak5: string
  streak10: string
  xp100: string
  xp500: string
  testMaster: string
  speedDemon: string

  // Home page
  heroTitle: string
  heroSubtitle: string
  officialPrep: string
  studentsCount: string
  passRate: string
  starRating: string
  chooseWeapon: string
  gamePlan: string
  swipeLearn: string
  practiceTests: string
  passCelebrate: string

  // Instructions
  howToPractice: string
  howToTest: string
  explanation: string

  // Loading states
  loading: string
  loadingQuestions: string
  preparingTest: string

  // Errors
  error: string
  failedToLoad: string
  tryAgain: string

  // Additional practice mode
  getReady: string
  crushingIt: string
  keepGrinding: string
  learnFromMistakes: string
  letsDominate: string
  filterByCategory: string
  selectState: string
  allGermany: string

  // Translation
  translate: string
  translating: string
  translated: string

  // Media
  imageNotAvailable: string

  // Home page features
  reviewDescribe: string
  reviewButton: string
  settingsDescribe: string
  settingsButton: string
  faqTitle: string
  faqDescribe: string
  faqButton: string
}

export const translations: Record<Language, Translation> = {
  en: {
    // Navigation
    home: "Home",
    practice: "Practice",
    test: "Test",
    review: "Review",
    settings: "Settings",
    back: "Back",

    // Common actions
    start: "Start",
    continue: "Continue",
    reset: "Reset",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save",
    export: "Export",
    import: "Import",

    // Practice mode
    practiceMode: "Practice Mode",
    practiceSubtitle: "Master the German citizenship test",
    swipeInstructions: "Select an answer, then swipe or drag the card",
    selectAnswer: "Select an answer",
    swipeRight: "Swipe RIGHT for next question",
    swipeLeft: "Swipe LEFT for previous question",
    keyboardShortcuts: "Use arrow keys or A/D for keyboard shortcuts",

    // Test mode
    testMode: "Test Mode",
    testSubtitle: "Real exam simulation",
    timeRemaining: "Time Remaining",
    question: "Question",
    of: "of",
    submitTest: "Submit Test",
    testResults: "Test Results",

    // Results
    correct: "Correct",
    incorrect: "Incorrect",
    passed: "Passed",
    failed: "Failed",
    score: "Score",
    accuracy: "Accuracy",
    keepLearning: "Keep Learning!",
    crushing: "Crushing It!",
    xpEarned: "XP earned!",

    // Stats
    progress: "Progress",
    xp: "XP",
    streak: "Streak",
    totalQuestions: "Total Questions",
    correctAnswers: "Correct Answers",
    flaggedQuestions: "Flagged Questions",
    completedQuestions: "Completed Questions",

    // Categories
    allCategories: "All Categories",
    politics: "Politics",
    history: "History",
    law: "Law",
    culture: "Culture",
    geography: "Geography",

    // Settings
    appearance: "Appearance",
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    language: "Language",
    dataManagement: "Data Management",
    exportProgress: "Export Progress",
    importProgress: "Import Progress",
    resetProgress: "Reset Progress",

    // Badges
    achievements: "Achievements",
    firstCorrect: "First Correct",
    streak5: "5 Streak",
    streak10: "10 Streak",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Test Master",
    speedDemon: "Speed Demon",

    // Home page
    heroTitle: "LEBEN IN DEUTSCHLAND",
    heroSubtitle: "Swipe Your Way to CITIZENSHIP",
    officialPrep: "OFFICIAL GERMAN CITIZENSHIP PREP",
    studentsCount: "STUDENTS CRUSHING IT",
    passRate: "PASS RATE",
    starRating: "STAR RATING",
    chooseWeapon: "CHOOSE YOUR WEAPON",
    gamePlan: "GAME PLAN",
    swipeLearn: "SWIPE & LEARN",
    practiceTests: "PRACTICE TESTS",
    passCelebrate: "PASS & CELEBRATE",

    // Instructions
    howToPractice: "How to Practice",
    howToTest: "How to Test",
    explanation: "Explanation",

    // Loading states
    loading: "Loading...",
    loadingQuestions: "Loading Questions...",
    preparingTest: "Preparing Test...",

    // Errors
    error: "Error",
    failedToLoad: "Failed to load",
    tryAgain: "Try again",

    // Additional practice mode
    getReady: "Get Ready!",
    crushingIt: "Crushing It!",
    keepGrinding: "Keep Grinding!",
    learnFromMistakes: "Learn from mistakes!",
    letsDominate: "Let's Dominate!",
    filterByCategory: "Filter by Category",
    selectState: "Select State",
    allGermany: "All Germany",

    // Translation
    translate: "Translate",
    translating: "Translating...",
    translated: "Translated",

    // Media
    imageNotAvailable: "Image not available",

    // Home page features
    reviewDescribe: "Review all questions with explanations",
    reviewButton: "Review",
    settingsDescribe: "Dark mode, language, stats",
    settingsButton: "Customize",
    faqTitle: "FAQ",
    faqDescribe: "How to use this app, tips & tricks",
    faqButton: "Learn More",
  },

  de: {
    // Navigation
    home: "Startseite",
    practice: "Üben",
    test: "Test",
    review: "Überprüfung",
    settings: "Einstellungen",
    back: "Zurück",

    // Common actions
    start: "Starten",
    continue: "Weiter",
    reset: "Zurücksetzen",
    submit: "Absenden",
    cancel: "Abbrechen",
    save: "Speichern",
    export: "Exportieren",
    import: "Importieren",

    // Practice mode
    practiceMode: "Übungsmodus",
    practiceSubtitle: "Meistere den deutschen Einbürgerungstest",
    swipeInstructions: "Wähle eine Antwort und wische die Karte",
    selectAnswer: "Wähle eine Antwort",
    swipeRight: "Wische RECHTS für die nächste Frage",
    swipeLeft: "Wische LINKS für die vorherige Frage",
    keyboardShortcuts: "Nutze Pfeiltasten oder A/D für Tastaturkürzel",

    // Test mode
    testMode: "Testmodus",
    testSubtitle: "Echte Prüfungssimulation",
    timeRemaining: "Verbleibende Zeit",
    question: "Frage",
    of: "von",
    submitTest: "Test Absenden",
    testResults: "Testergebnisse",

    // Results
    correct: "Richtig",
    incorrect: "Falsch",
    passed: "Bestanden",
    failed: "Nicht bestanden",
    score: "Punktzahl",
    accuracy: "Genauigkeit",
    keepLearning: "Weiter lernen!",
    crushing: "Großartig!",
    xpEarned: "XP erhalten!",

    // Stats
    progress: "Fortschritt",
    xp: "XP",
    streak: "Serie",
    totalQuestions: "Gesamte Fragen",
    correctAnswers: "Richtige Antworten",
    flaggedQuestions: "Markierte Fragen",
    completedQuestions: "Abgeschlossene Fragen",

    // Categories
    allCategories: "Alle Kategorien",
    politics: "Politik",
    history: "Geschichte",
    law: "Recht",
    culture: "Kultur",
    geography: "Geographie",

    // Settings
    appearance: "Erscheinungsbild",
    darkMode: "Dunkler Modus",
    lightMode: "Heller Modus",
    language: "Sprache",
    dataManagement: "Datenverwaltung",
    exportProgress: "Fortschritt Exportieren",
    importProgress: "Fortschritt Importieren",
    resetProgress: "Fortschritt Zurücksetzen",

    // Badges
    achievements: "Erfolge",
    firstCorrect: "Erste Richtige",
    streak5: "5er Serie",
    streak10: "10er Serie",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Test Meister",
    speedDemon: "Geschwindigkeitsdämon",

    // Home page
    heroTitle: "LEBEN IN DEUTSCHLAND",
    heroSubtitle: "Wische dich zur STAATSBÜRGERSCHAFT",
    officialPrep: "OFFIZIELLE DEUTSCHE STAATSBÜRGERSCHAFTSVORBEREITUNG",
    studentsCount: "STUDENTEN SCHAFFEN ES",
    passRate: "BESTEHENSQUOTE",
    starRating: "STERNE BEWERTUNG",
    chooseWeapon: "WÄHLE DEINE WAFFE",
    gamePlan: "SPIELPLAN",
    swipeLearn: "WISCHEN & LERNEN",
    practiceTests: "ÜBUNGSTESTS",
    passCelebrate: "BESTEHEN & FEIERN",

    // Instructions
    howToPractice: "Wie man übt",
    howToTest: "Wie man testet",
    explanation: "Erklärung",

    // Loading states
    loading: "Lädt...",
    loadingQuestions: "Lade Fragen...",
    preparingTest: "Bereite Test vor...",

    // Errors
    error: "Fehler",
    failedToLoad: "Laden fehlgeschlagen",
    tryAgain: "Erneut versuchen",

    // Additional practice mode
    getReady: "Mach dich bereit!",
    crushingIt: "Großartig!",
    keepGrinding: "Weiter üben!",
    learnFromMistakes: "Aus Fehlern lernen!",
    letsDominate: "Lass uns dominieren!",
    filterByCategory: "Nach Kategorie filtern",
    selectState: "Bundesland wählen",
    allGermany: "Ganz Deutschland",

    // Translation
    translate: "Übersetzen",
    translating: "Übersetze...",
    translated: "Übersetzt",

    // Media
    imageNotAvailable: "Bild nicht verfügbar",

    // Home page features
    reviewDescribe: "Alle Fragen mit Erklärungen überprüfen",
    reviewButton: "Überprüfen",
    settingsDescribe: "Dunkelmodus, Sprache, Statistiken",
    settingsButton: "Anpassen",
    faqTitle: "Häufig gestellte Fragen",
    faqDescribe: "Wie man diese App nutzt, Tipps & Tricks",
    faqButton: "Mehr erfahren",
  },

  es: {
    // Navigation
    home: "Inicio",
    practice: "Práctica",
    test: "Examen",
    review: "Revisar",
    settings: "Configuración",
    back: "Atrás",

    // Common actions
    start: "Comenzar",
    continue: "Continuar",
    reset: "Reiniciar",
    submit: "Enviar",
    cancel: "Cancelar",
    save: "Guardar",
    export: "Exportar",
    import: "Importar",

    // Practice mode
    practiceMode: "Modo Práctica",
    practiceSubtitle: "Domina el examen de ciudadanía alemana",
    swipeInstructions: "Selecciona una respuesta, luego desliza la tarjeta",
    selectAnswer: "Selecciona una respuesta",
    swipeRight: "Desliza a la DERECHA para la siguiente pregunta",
    swipeLeft: "Desliza a la IZQUIERDA para la pregunta anterior",
    keyboardShortcuts: "Usa las flechas del teclado o A/D para atajos",

    // Test mode
    testMode: "Modo Examen",
    testSubtitle: "Simulación de examen real",
    timeRemaining: "Tiempo Restante",
    question: "Pregunta",
    of: "de",
    submitTest: "Enviar Examen",
    testResults: "Resultados del Examen",

    // Results
    correct: "Correcto",
    incorrect: "Incorrecto",
    passed: "Aprobado",
    failed: "Reprobado",
    score: "Puntuación",
    accuracy: "Precisión",
    keepLearning: "¡Sigue Aprendiendo!",
    crushing: "¡Excelente!",
    xpEarned: "¡XP ganado!",

    // Stats
    progress: "Progreso",
    xp: "XP",
    streak: "Racha",
    totalQuestions: "Preguntas Totales",
    correctAnswers: "Respuestas Correctas",
    flaggedQuestions: "Preguntas Marcadas",
    completedQuestions: "Preguntas Completadas",

    // Categories
    allCategories: "Todas las Categorías",
    politics: "Política",
    history: "Historia",
    law: "Derecho",
    culture: "Cultura",
    geography: "Geografía",

    // Settings
    appearance: "Apariencia",
    darkMode: "Modo Oscuro",
    lightMode: "Modo Claro",
    language: "Idioma",
    dataManagement: "Gestión de Datos",
    exportProgress: "Exportar Progreso",
    importProgress: "Importar Progreso",
    resetProgress: "Reiniciar Progreso",

    // Badges
    achievements: "Logros",
    firstCorrect: "Primera Correcta",
    streak5: "Racha de 5",
    streak10: "Racha de 10",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Maestro del Examen",
    speedDemon: "Demonio de Velocidad",

    // Home page
    heroTitle: "VIDA EN ALEMANIA",
    heroSubtitle: "Desliza hacia la CIUDADANÍA",
    officialPrep: "PREPARACIÓN OFICIAL PARA CIUDADANÍA ALEMANA",
    studentsCount: "ESTUDIANTES TRIUNFANDO",
    passRate: "TASA DE APROBACIÓN",
    starRating: "CALIFICACIÓN DE ESTRELLAS",
    chooseWeapon: "ELIGE TU ARMA",
    gamePlan: "PLAN DE JUEGO",
    swipeLearn: "DESLIZAR Y APRENDER",
    practiceTests: "EXÁMENES DE PRÁCTICA",
    passCelebrate: "APROBAR Y CELEBRAR",

    // Instructions
    howToPractice: "Cómo Practicar",
    howToTest: "Cómo Hacer el Examen",
    explanation: "Explicación",

    // Loading states
    loading: "Cargando...",
    loadingQuestions: "Cargando Preguntas...",
    preparingTest: "Preparando Examen...",

    // Errors
    error: "Error",
    failedToLoad: "Error al cargar",
    tryAgain: "Intentar de nuevo",

    // Additional practice mode
    getReady: "¡Prepárate!",
    crushingIt: "¡Excelente!",
    keepGrinding: "¡Sigue practicando!",
    learnFromMistakes: "¡Aprende de los errores!",
    letsDominate: "¡Vamos a dominar!",
    filterByCategory: "Filtrar por categoría",
    selectState: "Seleccionar estado",
    allGermany: "Toda Alemania",

    // Translation
    translate: "Traducir",
    translating: "Traduciendo...",
    translated: "Traducido",

    // Media
    imageNotAvailable: "Imagen no disponible",

    // Home page features
    reviewDescribe: "Revisar todas las preguntas con explicaciones",
    reviewButton: "Revisar",
    settingsDescribe: "Modo oscuro, idioma, estadísticas",
    settingsButton: "Personalizar",
    faqTitle: "Preguntas frecuentes",
    faqDescribe: "Cómo usar esta aplicación, consejos y trucos",
    faqButton: "Más información",
  },

  fr: {
    // Navigation
    home: "Accueil",
    practice: "Pratique",
    test: "Test",
    review: "Révision",
    settings: "Paramètres",
    back: "Retour",

    // Common actions
    start: "Commencer",
    continue: "Continuer",
    reset: "Réinitialiser",
    submit: "Soumettre",
    cancel: "Annuler",
    save: "Sauvegarder",
    export: "Exporter",
    import: "Importer",

    // Practice mode
    practiceMode: "Mode Pratique",
    practiceSubtitle: "Maîtrisez le test de citoyenneté allemande",
    swipeInstructions: "Sélectionnez une réponse, puis glissez la carte",
    selectAnswer: "Sélectionnez une réponse",
    swipeRight: "Glissez à DROITE pour la question suivante",
    swipeLeft: "Glissez à GAUCHE pour la question précédente",
    keyboardShortcuts: "Utilisez les flèches ou A/D pour les raccourcis clavier",

    // Test mode
    testMode: "Mode Test",
    testSubtitle: "Simulation d'examen réel",
    timeRemaining: "Temps Restant",
    question: "Question",
    of: "de",
    submitTest: "Soumettre le Test",
    testResults: "Résultats du Test",

    // Results
    correct: "Correct",
    incorrect: "Incorrect",
    passed: "Réussi",
    failed: "Échoué",
    score: "Score",
    accuracy: "Précision",
    keepLearning: "Continuez à Apprendre!",
    crushing: "Excellent!",
    xpEarned: "XP gagné!",

    // Stats
    progress: "Progrès",
    xp: "XP",
    streak: "Série",
    totalQuestions: "Questions Totales",
    correctAnswers: "Réponses Correctes",
    flaggedQuestions: "Questions Marquées",
    completedQuestions: "Questions Terminées",

    // Categories
    allCategories: "Toutes les Catégories",
    politics: "Politique",
    history: "Histoire",
    law: "Droit",
    culture: "Culture",
    geography: "Géographie",

    // Settings
    appearance: "Apparence",
    darkMode: "Mode Sombre",
    lightMode: "Mode Clair",
    language: "Langue",
    dataManagement: "Gestion des Données",
    exportProgress: "Exporter les Progrès",
    importProgress: "Importer les Progrès",
    resetProgress: "Réinitialiser les Progrès",

    // Badges
    achievements: "Réalisations",
    firstCorrect: "Première Correcte",
    streak5: "Série de 5",
    streak10: "Série de 10",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Maître du Test",
    speedDemon: "Démon de Vitesse",

    // Home page
    heroTitle: "VIE EN ALLEMAGNE",
    heroSubtitle: "Glissez vers la CITOYENNETÉ",
    officialPrep: "PRÉPARATION OFFICIELLE À LA CITOYENNETÉ ALLEMANDE",
    studentsCount: "ÉTUDIANTS QUI RÉUSSISSENT",
    passRate: "TAUX DE RÉUSSITE",
    starRating: "NOTE ÉTOILÉE",
    chooseWeapon: "CHOISISSEZ VOTRE ARME",
    gamePlan: "PLAN DE JEU",
    swipeLearn: "GLISSER ET APPRENDRE",
    practiceTests: "TESTS DE PRATIQUE",
    passCelebrate: "RÉUSSIR ET CÉLÉBRER",

    // Instructions
    howToPractice: "Comment Pratiquer",
    howToTest: "Comment Tester",
    explanation: "Explication",

    // Loading states
    loading: "Chargement...",
    loadingQuestions: "Chargement des Questions...",
    preparingTest: "Préparation du Test...",

    // Errors
    error: "Erreur",
    failedToLoad: "Échec du chargement",
    tryAgain: "Réessayer",

    // Additional practice mode
    getReady: "Préparez-vous!",
    crushingIt: "Excellent!",
    keepGrinding: "Continuez à pratiquer!",
    learnFromMistakes: "Apprenez de vos erreurs!",
    letsDominate: "Dominons!",
    filterByCategory: "Filtrer par catégorie",
    selectState: "Sélectionner l'état",
    allGermany: "Toute l'Allemagne",

    // Translation
    translate: "Traduire",
    translating: "Traduction...",
    translated: "Traduit",

    // Media
    imageNotAvailable: "Image non disponible",

    // Home page features
    reviewDescribe: "Passez en revue toutes les questions avec des explications",
    reviewButton: "Examiner",
    settingsDescribe: "Mode sombre, langue, statistiques",
    settingsButton: "Personnaliser",
    faqTitle: "FAQ",
    faqDescribe: "Comment utiliser cette application, conseils et astuces",
    faqButton: "En savoir plus",
  },

  it: {
    // Navigation
    home: "Home",
    practice: "Pratica",
    test: "Test",
    review: "Revisione",
    settings: "Impostazioni",
    back: "Indietro",

    // Common actions
    start: "Inizia",
    continue: "Continua",
    reset: "Reimposta",
    submit: "Invia",
    cancel: "Annulla",
    save: "Salva",
    export: "Esporta",
    import: "Importa",

    // Practice mode
    practiceMode: "Modalità Pratica",
    practiceSubtitle: "Padroneggia il test di cittadinanza tedesca",
    swipeInstructions: "Seleziona una risposta, poi scorri la carta",
    selectAnswer: "Seleziona una risposta",
    swipeRight: "Scorri a DESTRA per la prossima domanda",
    swipeLeft: "Scorri a SINISTRA per la domanda precedente",
    keyboardShortcuts: "Usa le frecce o A/D per le scorciatoie da tastiera",

    // Test mode
    testMode: "Modalità Test",
    testSubtitle: "Simulazione esame reale",
    timeRemaining: "Tempo Rimanente",
    question: "Domanda",
    of: "di",
    submitTest: "Invia Test",
    testResults: "Risultati del Test",

    // Results
    correct: "Corretto",
    incorrect: "Sbagliato",
    passed: "Superato",
    failed: "Fallito",
    score: "Punteggio",
    accuracy: "Precisione",
    keepLearning: "Continua ad Imparare!",
    crushing: "Eccellente!",
    xpEarned: "XP guadagnato!",

    // Stats
    progress: "Progresso",
    xp: "XP",
    streak: "Serie",
    totalQuestions: "Domande Totali",
    correctAnswers: "Risposte Corrette",
    flaggedQuestions: "Domande Segnalate",
    completedQuestions: "Domande Completate",

    // Categories
    allCategories: "Tutte le Categorie",
    politics: "Politica",
    history: "Storia",
    law: "Diritto",
    culture: "Cultura",
    geography: "Geografia",

    // Settings
    appearance: "Aspetto",
    darkMode: "Modalità Scura",
    lightMode: "Modalità Chiara",
    language: "Lingua",
    dataManagement: "Gestione Dati",
    exportProgress: "Esporta Progresso",
    importProgress: "Importa Progresso",
    resetProgress: "Reimposta Progresso",

    // Badges
    achievements: "Risultati",
    firstCorrect: "Prima Corretta",
    streak5: "Serie di 5",
    streak10: "Serie di 10",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Maestro del Test",
    speedDemon: "Demone della Velocità",

    // Home page
    heroTitle: "VITA IN GERMANIA",
    heroSubtitle: "Scorri verso la CITTADINANZA",
    officialPrep: "PREPARAZIONE UFFICIALE CITTADINANZA TEDESCA",
    studentsCount: "STUDENTI CHE CE LA FANNO",
    passRate: "TASSO DI SUCCESSO",
    starRating: "VALUTAZIONE STELLE",
    chooseWeapon: "SCEGLI LA TUA ARMA",
    gamePlan: "PIANO DI GIOCO",
    swipeLearn: "SCORRI E IMPARA",
    practiceTests: "TEST DI PRATICA",
    passCelebrate: "SUPERA E CELEBRA",

    // Instructions
    howToPractice: "Come Praticare",
    howToTest: "Come Testare",
    explanation: "Spiegazione",

    // Loading states
    loading: "Caricamento...",
    loadingQuestions: "Caricamento Domande...",
    preparingTest: "Preparazione Test...",

    // Errors
    error: "Errore",
    failedToLoad: "Caricamento fallito",
    tryAgain: "Riprova",

    // Additional practice mode
    getReady: "Preparati!",
    crushingIt: "Eccellente!",
    keepGrinding: "Continua a praticare!",
    learnFromMistakes: "Impara dai tuoi errori!",
    letsDominate: "Dominiamo!",
    filterByCategory: "Filtra per categoria",
    selectState: "Seleziona stato",
    allGermany: "Tutta la Germania",

    // Translation
    translate: "Traduci",
    translating: "Traducendo...",
    translated: "Tradotto",

    // Media
    imageNotAvailable: "Immagine non disponibile",

    // Home page features
    reviewDescribe: "Rivedi tutte le domande con spiegazioni",
    reviewButton: "Rivedi",
    settingsDescribe: "Modalità scura, lingua, statistiche",
    settingsButton: "Personalizza",
    faqTitle: "Domande frequenti",
    faqDescribe: "Come usare questa app, suggerimenti e trucchi",
    faqButton: "Scopri di più",
  },

  tr: {
    // Navigation
    home: "Ana Sayfa",
    practice: "Pratik",
    test: "Test",
    review: "İnceleme",
    settings: "Ayarlar",
    back: "Geri",

    // Common actions
    start: "Başla",
    continue: "Devam Et",
    reset: "Sıfırla",
    submit: "Gönder",
    cancel: "İptal",
    save: "Kaydet",
    export: "Dışa Aktar",
    import: "İçe Aktar",

    // Practice mode
    practiceMode: "Pratik Modu",
    practiceSubtitle: "Alman vatandaşlık testinde ustalaş",
    swipeInstructions: "Bir cevap seç, sonra kartı kaydır",
    selectAnswer: "Bir cevap seç",
    swipeRight: "Sonraki soru için SAĞA kaydır",
    swipeLeft: "Önceki soru için SOLA kaydır",
    keyboardShortcuts: "Klavye kısayolları için ok tuşları veya A/D kullan",

    // Test mode
    testMode: "Test Modu",
    testSubtitle: "Gerçek sınav simülasyonu",
    timeRemaining: "Kalan Süre",
    question: "Soru",
    of: "/",
    submitTest: "Testi Gönder",
    testResults: "Test Sonuçları",

    // Results
    correct: "Doğru",
    incorrect: "Yanlış",
    passed: "Geçti",
    failed: "Kaldı",
    score: "Puan",
    accuracy: "Doğruluk",
    keepLearning: "Öğrenmeye Devam!",
    crushing: "Harika!",
    xpEarned: "XP kazandın!",

    // Stats
    progress: "İlerleme",
    xp: "XP",
    streak: "Seri",
    totalQuestions: "Toplam Sorular",
    correctAnswers: "Doğru Cevaplar",
    flaggedQuestions: "İşaretli Sorular",
    completedQuestions: "Tamamlanan Sorular",

    // Categories
    allCategories: "Tüm Kategoriler",
    politics: "Politika",
    history: "Tarih",
    law: "Hukuk",
    culture: "Kültür",
    geography: "Coğrafya",

    // Settings
    appearance: "Görünüm",
    darkMode: "Karanlık Mod",
    lightMode: "Aydınlık Mod",
    language: "Dil",
    dataManagement: "Veri Yönetimi",
    exportProgress: "İlerlemeyi Dışa Aktar",
    importProgress: "İlerlemeyi İçe Aktar",
    resetProgress: "İlerlemeyi Sıfırla",

    // Badges
    achievements: "Başarılar",
    firstCorrect: "İlk Doğru",
    streak5: "5 Seri",
    streak10: "10 Seri",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Test Ustası",
    speedDemon: "Hız Şeytanı",

    // Home page
    heroTitle: "ALMANYA'DA YAŞAM",
    heroSubtitle: "VATANDAŞLIĞA Kaydır",
    officialPrep: "RESMİ ALMAN VATANDAŞLIK HAZIRLIĞI",
    studentsCount: "BAŞARILI ÖĞRENCİLER",
    passRate: "BAŞARI ORANI",
    starRating: "YILDIZ DEĞERLENDİRMESİ",
    chooseWeapon: "SİLAHINI SEÇ",
    gamePlan: "OYUN PLANI",
    swipeLearn: "KAYDIR VE ÖĞREN",
    practiceTests: "PRATİK TESTLERİ",
    passCelebrate: "GEÇ VE KUTLA",

    // Instructions
    howToPractice: "Nasıl Pratik Yapılır",
    howToTest: "Nasıl Test Yapılır",
    explanation: "Açıklama",

    // Loading states
    loading: "Yükleniyor...",
    loadingQuestions: "Sorular Yükleniyor...",
    preparingTest: "Test Hazırlanıyor...",

    // Errors
    error: "Hata",
    failedToLoad: "Yükleme başarısız",
    tryAgain: "Tekrar dene",

    // Additional practice mode
    getReady: "Hazırlan!",
    crushingIt: "Harika!",
    keepGrinding: "Çalışmaya devam!",
    learnFromMistakes: "Hatalardan öğren!",
    letsDominate: "Hadi dominasyon kuralım!",
    filterByCategory: "Kategoriye göre filtrele",
    selectState: "Eyalet seç",
    allGermany: "Tüm Almanya",

    // Translation
    translate: "Çevir",
    translating: "Çevriliyor...",
    translated: "Çevrildi",

    // Media
    imageNotAvailable: "Görüntü mevcut değil",

    // Home page features
    reviewDescribe: "Tüm soruları açıklamalarla gözden geçirin",
    reviewButton: "Gözden Geçir",
    settingsDescribe: "Koyu mod, dil, istatistikler",
    settingsButton: "Özelleştir",
    faqTitle: "SSS",
    faqDescribe: "Bu uygulamayı nasıl kullanacağınız, ipuçları ve püf noktaları",
    faqButton: "Daha Fazla Bilgi",
  },

  ar: {
    // Navigation
    home: "الرئيسية",
    practice: "التدريب",
    test: "الاختبار",
    review: "المراجعة",
    settings: "الإعدادات",
    back: "رجوع",

    // Common actions
    start: "ابدأ",
    continue: "متابعة",
    reset: "إعادة تعيين",
    submit: "إرسال",
    cancel: "إلغاء",
    save: "حفظ",
    export: "تصدير",
    import: "استيراد",

    // Practice mode
    practiceMode: "وضع التدريب",
    practiceSubtitle: "أتقن اختبار الجنسية الألمانية",
    swipeInstructions: "اختر إجابة، ثم اسحب البطاقة",
    selectAnswer: "اختر إجابة",
    swipeRight: "اسحب يميناً للسؤال التالي",
    swipeLeft: "اسحب يساراً للسؤال السابق",
    keyboardShortcuts: "استخدم أسهم لوحة المفاتيح أو A/D للاختصارات",

    // Test mode
    testMode: "وضع الاختبار",
    testSubtitle: "محاكاة الامتحان الحقيقي",
    timeRemaining: "الوقت المتبقي",
    question: "سؤال",
    of: "من",
    submitTest: "إرسال الاختبار",
    testResults: "نتائج الاختبار",

    // Results
    correct: "صحيح",
    incorrect: "خاطئ",
    passed: "نجح",
    failed: "فشل",
    score: "النتيجة",
    accuracy: "الدقة",
    keepLearning: "استمر في التعلم!",
    crushing: "ممتاز!",
    xpEarned: "حصلت على XP!",

    // Stats
    progress: "التقدم",
    xp: "XP",
    streak: "السلسلة",
    totalQuestions: "إجمالي الأسئلة",
    correctAnswers: "الإجابات الصحيحة",
    flaggedQuestions: "الأسئلة المعلمة",
    completedQuestions: "الأسئلة المكتملة",

    // Categories
    allCategories: "جميع الفئات",
    politics: "السياسة",
    history: "التاريخ",
    law: "القانون",
    culture: "الثقافة",
    geography: "الجغرافيا",

    // Settings
    appearance: "المظهر",
    darkMode: "الوضع المظلم",
    lightMode: "الوضع المضيء",
    language: "اللغة",
    dataManagement: "إدارة البيانات",
    exportProgress: "تصدير التقدم",
    importProgress: "استيراد التقدم",
    resetProgress: "إعادة تعيين التقدم",

    // Badges
    achievements: "الإنجازات",
    firstCorrect: "أول إجابة صحيحة",
    streak5: "سلسلة 5",
    streak10: "سلسلة 10",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "سيد الاختبار",
    speedDemon: "شيطان السرعة",

    // Home page
    heroTitle: "الحياة في ألمانيا",
    heroSubtitle: "اسحب طريقك إلى الجنسية",
    officialPrep: "التحضير الرسمي للجنسية الألمانية",
    studentsCount: "الطلاب الناجحون",
    passRate: "معدل النجاح",
    starRating: "تقييم النجوم",
    chooseWeapon: "اختر سلاحك",
    gamePlan: "خطة اللعبة",
    swipeLearn: "اسحب وتعلم",
    practiceTests: "اختبارات التدريب",
    passCelebrate: "انجح واحتفل",

    // Instructions
    howToPractice: "كيفية التدريب",
    howToTest: "كيفية الاختبار",
    explanation: "الشرح",

    // Loading states
    loading: "جاري التحميل...",
    loadingQuestions: "جاري تحميل الأسئلة...",
    preparingTest: "جاري تحضير الاختبار...",

    // Errors
    error: "خطأ",
    failedToLoad: "فشل في التحميل",
    tryAgain: "حاول مرة أخرى",

    // Additional practice mode
    getReady: "استعد!",
    crushingIt: "ممتاز!",
    keepGrinding: "استمر في الممارسة!",
    learnFromMistakes: "تعلم من الأخطاء!",
    letsDominate: "دعنا نهيمن!",
    filterByCategory: "تصفية حسب الفئة",
    selectState: "اختر الولاية",
    allGermany: "كل ألمانيا",

    // Translation
    translate: "ترجم",
    translating: "جاري الترجمة...",
    translated: "مترجم",

    // Media
    imageNotAvailable: "الصورة غير متاحة",

    // Home page features
    reviewDescribe: "راجع جميع الأسئلة مع الشروحات",
    reviewButton: "مراجعة",
    settingsDescribe: "الوضع المظلم، اللغة، الإحصائيات",
    settingsButton: "تخصيص",
    faqTitle: "الأسئلة الشائعة",
    faqDescribe: "كيفية استخدام هذا التطبيق، نصائح وحيل",
    faqButton: "اعرف أكثر",
  },

  ru: {
    // Navigation
    home: "Главная",
    practice: "Практика",
    test: "Тест",
    review: "Обзор",
    settings: "Настройки",
    back: "Назад",

    // Common actions
    start: "Начать",
    continue: "Продолжить",
    reset: "Сбросить",
    submit: "Отправить",
    cancel: "Отмена",
    save: "Сохранить",
    export: "Экспорт",
    import: "Импорт",

    // Practice mode
    practiceMode: "Режим Практики",
    practiceSubtitle: "Освойте тест на немецкое гражданство",
    swipeInstructions: "Выберите ответ, затем проведите карточку",
    selectAnswer: "Выберите ответ",
    swipeRight: "Проведите ВПРАВО для следующего вопроса",
    swipeLeft: "Проведите ВЛЕВО для предыдущего вопроса",
    keyboardShortcuts: "Используйте стрелки или A/D для горячих клавиш",

    // Test mode
    testMode: "Режим Теста",
    testSubtitle: "Симуляция реального экзамена",
    timeRemaining: "Оставшееся Время",
    question: "Вопрос",
    of: "из",
    submitTest: "Отправить Тест",
    testResults: "Результаты Теста",

    // Results
    correct: "Правильно",
    incorrect: "Неправильно",
    passed: "Сдан",
    failed: "Не сдан",
    score: "Счет",
    accuracy: "Точность",
    keepLearning: "Продолжайте Учиться!",
    crushing: "Отлично!",
    xpEarned: "XP получено!",

    // Stats
    progress: "Прогресс",
    xp: "XP",
    streak: "Серия",
    totalQuestions: "Всего Вопросов",
    correctAnswers: "Правильные Ответы",
    flaggedQuestions: "Отмеченные Вопросы",
    completedQuestions: "Завершенные Вопросы",

    // Categories
    allCategories: "Все Категории",
    politics: "Политика",
    history: "История",
    law: "Право",
    culture: "Культура",
    geography: "География",

    // Settings
    appearance: "Внешний Вид",
    darkMode: "Темный Режим",
    lightMode: "Светлый Режим",
    language: "Язык",
    dataManagement: "Управление Данными",
    exportProgress: "Экспорт Прогресса",
    importProgress: "Импорт Прогресса",
    resetProgress: "Сброс Прогресса",

    // Badges
    achievements: "Достижения",
    firstCorrect: "Первый Правильный",
    streak5: "Серия 5",
    streak10: "Серия 10",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "Мастер Теста",
    speedDemon: "Демон Скорости",

    // Home page
    heroTitle: "ЖИЗНЬ В ГЕРМАНИИ",
    heroSubtitle: "Проведите к ГРАЖДАНСТВУ",
    officialPrep: "ОФИЦИАЛЬНАЯ ПОДГОТОВКА К НЕМЕЦКОМУ ГРАЖДАНСТВУ",
    studentsCount: "УСПЕШНЫЕ СТУДЕНТЫ",
    passRate: "ПРОЦЕНТ СДАЧИ",
    starRating: "ЗВЕЗДНЫЙ РЕЙТИНГ",
    chooseWeapon: "ВЫБЕРИТЕ ОРУЖИЕ",
    gamePlan: "ПЛАН ИГРЫ",
    swipeLearn: "ПРОВОДИТЕ И УЧИТЕСЬ",
    practiceTests: "ПРАКТИЧЕСКИЕ ТЕСТЫ",
    passCelebrate: "СДАЙТЕ И ПРАЗДНУЙТЕ",

    // Instructions
    howToPractice: "Как Практиковаться",
    howToTest: "Как Тестировать",
    explanation: "Объяснение",

    // Loading states
    loading: "Загрузка...",
    loadingQuestions: "Загрузка Вопросов...",
    preparingTest: "Подготовка Теста...",

    // Errors
    error: "Ошибка",
    failedToLoad: "Не удалось загрузить",
    tryAgain: "Попробовать снова",

    // Additional practice mode
    getReady: "Приготовься!",
    crushingIt: "Отлично!",
    keepGrinding: "Продолжай практиковаться!",
    learnFromMistakes: "Учись на ошибках!",
    letsDominate: "Давайте доминировать!",
    filterByCategory: "Фильтр по категории",
    selectState: "Выбрать штат",
    allGermany: "Вся Германия",

    // Translation
    translate: "Перевести",
    translating: "Переводится...",
    translated: "Переведено",

    // Media
    imageNotAvailable: "Изображение недоступно",

    // Home page features
    reviewDescribe: "Проверьте все вопросы с объяснениями",
    reviewButton: "Проверить",
    settingsDescribe: "Темный режим, язык, статистика",
    settingsButton: "Настроить",
    faqTitle: "Часто задаваемые вопросы",
    faqDescribe: "Как использовать это приложение, советы и хитрости",
    faqButton: "Узнать больше",
  },

  zh: {
    // Navigation
    home: "首页",
    practice: "练习",
    test: "测试",
    review: "复习",
    settings: "设置",
    back: "返回",

    // Common actions
    start: "开始",
    continue: "继续",
    reset: "重置",
    submit: "提交",
    cancel: "取消",
    save: "保存",
    export: "导出",
    import: "导入",

    // Practice mode
    practiceMode: "练习模式",
    practiceSubtitle: "掌握德国入籍考试",
    swipeInstructions: "选择答案，然后滑动卡片",
    selectAnswer: "选择答案",
    swipeRight: "向右滑动查看下一个问题",
    swipeLeft: "向左滑动查看上一个问题",
    keyboardShortcuts: "使用方向键或A/D进行键盘快捷操作",

    // Test mode
    testMode: "测试模式",
    testSubtitle: "真实考试模拟",
    timeRemaining: "剩余时间",
    question: "问题",
    of: "/",
    submitTest: "提交测试",
    testResults: "测试结果",

    // Results
    correct: "正确",
    incorrect: "错误",
    passed: "通过",
    failed: "失败",
    score: "分数",
    accuracy: "准确率",
    keepLearning: "继续学习！",
    crushing: "太棒了！",
    xpEarned: "获得XP！",

    // Stats
    progress: "进度",
    xp: "XP",
    streak: "连击",
    totalQuestions: "总问题数",
    correctAnswers: "正确答案",
    flaggedQuestions: "标记问题",
    completedQuestions: "完成问题",

    // Categories
    allCategories: "所有类别",
    politics: "政治",
    history: "历史",
    law: "法律",
    culture: "文化",
    geography: "地理",

    // Settings
    appearance: "外观",
    darkMode: "深色模式",
    lightMode: "浅色模式",
    language: "语言",
    dataManagement: "数据管理",
    exportProgress: "导出进度",
    importProgress: "导入进度",
    resetProgress: "重置进度",

    // Badges
    achievements: "成就",
    firstCorrect: "首次正确",
    streak5: "5连击",
    streak10: "10连击",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "测试大师",
    speedDemon: "速度恶魔",

    // Home page
    heroTitle: "德国生活",
    heroSubtitle: "滑向公民身份",
    officialPrep: "德国公民身份官方准备",
    studentsCount: "成功学生",
    passRate: "通过率",
    starRating: "星级评分",
    chooseWeapon: "选择你的武器",
    gamePlan: "游戏计划",
    swipeLearn: "滑动学习",
    practiceTests: "练习测试",
    passCelebrate: "通过并庆祝",

    // Instructions
    howToPractice: "如何练习",
    howToTest: "如何测试",
    explanation: "解释",

    // Loading states
    loading: "加载中...",
    loadingQuestions: "加载问题中...",
    preparingTest: "准备测试中...",

    // Errors
    error: "错误",
    failedToLoad: "加载失败",
    tryAgain: "重试",

    // Additional practice mode
    getReady: "准备好了!",
    crushingIt: "太棒了!",
    keepGrinding: "继续练习!",
    learnFromMistakes: "从错误中学习!",
    letsDominate: "让我们主导!",
    filterByCategory: "按类别筛选",
    selectState: "选择州",
    allGermany: "整个德国",

    // Translation
    translate: "翻译",
    translating: "翻译中...",
    translated: "已翻译",

    // Media
    imageNotAvailable: "图像不可用",

    // Home page features
    reviewDescribe: "使用解释复习所有问题",
    reviewButton: "复习",
    settingsDescribe: "深色模式、语言、统计数据",
    settingsButton: "自定义",
    faqTitle: "常见问题",
    faqDescribe: "如何使用此应用、提示和技巧",
    faqButton: "了解更多",
  },

  hi: {
    // Navigation
    home: "होम",
    practice: "अभ्यास",
    test: "परीक्षा",
    review: "समीक्षा",
    settings: "सेटिंग्स",
    back: "वापस",

    // Common actions
    start: "शुरू करें",
    continue: "जारी रखें",
    reset: "रीसेट",
    submit: "जमा करें",
    cancel: "रद्द करें",
    save: "सेव करें",
    export: "निर्यात",
    import: "आयात",

    // Practice mode
    practiceMode: "अभ्यास मोड",
    practiceSubtitle: "जर्मन नागरिकता परीक्षा में महारत हासिल करें",
    swipeInstructions: "एक उत्तर चुनें, फिर कार्ड को स्वाइप करें",
    selectAnswer: "एक उत्तर चुनें",
    swipeRight: "अगले प्रश्न के लिए दाईं ओर स्वाइप करें",
    swipeLeft: "पिछले प्रश्न के लिए बाईं ओर स्वाइप करें",
    keyboardShortcuts: "कीबोर्ड शॉर्टकट के लिए एरो कीज़ या A/D का उपयोग करें",

    // Test mode
    testMode: "परीक्षा मोड",
    testSubtitle: "वास्तविक परीक्षा सिमुलेशन",
    timeRemaining: "शेष समय",
    question: "प्रश्न",
    of: "का",
    submitTest: "परीक्षा जमा करें",
    testResults: "परीक्षा परिणाम",

    // Results
    correct: "सही",
    incorrect: "गलत",
    passed: "पास",
    failed: "फेल",
    score: "स्कोर",
    accuracy: "सटीकता",
    keepLearning: "सीखते रहें!",
    crushing: "शानदार!",
    xpEarned: "XP अर्जित!",

    // Stats
    progress: "प्रगति",
    xp: "XP",
    streak: "स्ट्रीक",
    totalQuestions: "कुल प्रश्न",
    correctAnswers: "सही उत्तर",
    flaggedQuestions: "फ्लैग किए गए प्रश्न",
    completedQuestions: "पूर्ण प्रश्न",

    // Categories
    allCategories: "सभी श्रेणियां",
    politics: "राजनीति",
    history: "इतिहास",
    law: "कानून",
    culture: "संस्कृति",
    geography: "भूगोल",

    // Settings
    appearance: "दिखावट",
    darkMode: "डार्क मोड",
    lightMode: "लाइट मोड",
    language: "भाषा",
    dataManagement: "डेटा प्रबंधन",
    exportProgress: "प्रगति निर्यात करें",
    importProgress: "प्रगति आयात करें",
    resetProgress: "प्रगति रीसेट करें",

    // Badges
    achievements: "उपलब्धियां",
    firstCorrect: "पहला सही",
    streak5: "5 स्ट्रीक",
    streak10: "10 स्ट्रीक",
    xp100: "100 XP",
    xp500: "500 XP",
    testMaster: "परीक्षा मास्टर",
    speedDemon: "स्पीड डेमन",

    // Home page
    heroTitle: "जर्मनी में जीवन",
    heroSubtitle: "नागरिकता की ओर स्वाइप करें",
    officialPrep: "आधिकारिक जर्मन नागरिकता तैयारी",
    studentsCount: "सफल छात्र",
    passRate: "पास दर",
    starRating: "स्टार रेटिंग",
    chooseWeapon: "अपना हथियार चुनें",
    gamePlan: "गेम प्लान",
    swipeLearn: "स्वाइप और सीखें",
    practiceTests: "अभ्यास परीक्षा",
    passCelebrate: "पास करें और जश्न मनाएं",

    // Instructions
    howToPractice: "अभ्यास कैसे करें",
    howToTest: "परीक्षा कैसे दें",
    explanation: "व्याख्या",

    // Loading states
    loading: "लोड हो रहा है...",
    loadingQuestions: "प्रश्न लोड हो रहे हैं...",
    preparingTest: "परीक्षा तैयार की जा रही है...",

    // Errors
    error: "त्रुटि",
    failedToLoad: "लोड करने में विफल",
    tryAgain: "फिर से कोशिश करें",

    // Additional practice mode
    getReady: "तैयार हो जाओ!",
    crushingIt: "शानदार!",
    keepGrinding: "अभ्यास जारी रखें!",
    learnFromMistakes: "गलतियों से सीखें!",
    letsDominate: "चलो जीतते हैं!",
    filterByCategory: "श्रेणी के अनुसार फ़िल्टर करें",
    selectState: "राज्य चुनें",
    allGermany: "पूरा जर्मनी",

    // Translation
    translate: "अनुवाद करें",
    translating: "अनुवाद हो रहा है...",
    translated: "अनुवादित",

    // Media
    imageNotAvailable: "छवि उपलब्ध नहीं",

    // Home page features
    reviewDescribe: "व्याख्या के साथ सभी प्रश्नों की समीक्षा करें",
    reviewButton: "समीक्षा करें",
    settingsDescribe: "डार्क मोड, भाषा, आंकड़े",
    settingsButton: "कस्टमाइज़ करें",
    faqTitle: "अक्सर पूछे जाने वाले प्रश्न",
    faqDescribe: "इस ऐप को कैसे उपयोग करें, सुझाव और तरकीबें",
    faqButton: "और जानें",
  },
}

export const getTranslation = (language: Language): Translation => {
  return translations[language] || translations.en
}

export const languageNames: Record<Language, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  it: "Italiano",
  tr: "Türkçe",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  hi: "हिंदी",
}

export const languageFlags: Record<Language, string> = {
  en: "🇺🇸",
  de: "🇩🇪",
  es: "🇪🇸",
  fr: "🇫🇷",
  it: "🇮🇹",
  tr: "🇹🇷",
  ar: "🇸🇦",
  ru: "🇷🇺",
  zh: "🇨🇳",
  hi: "🇮🇳",
}
