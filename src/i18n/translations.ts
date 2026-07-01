export const es = {
  // Header
  "header.kicker": "La plataforma inteligente para bibliotecas",
  "header.subtitle":
    "Cataloga, busca y analiza tu colección con inteligencia artificial.",
  "header.booksOne": "{n} libro",
  "header.booksMany": "{n} libros",

  // Toolbar
  "toolbar.addBook": "Añadir libro",
  "toolbar.excel": "Excel",
  "toolbar.exportJson": "Exportar JSON",
  "toolbar.importJson": "Importar JSON",
  "toolbar.aiAssistant": "Asistente IA",
  "toolbar.resultsOne": "{n} resultado",
  "toolbar.resultsMany": "{n} resultados",

  // Modes / account
  "mode.offline": "Offline",
  "mode.cloud": "Nube",
  "account.signOut": "Salir",
  "account.fallback": "Cuenta",
  "status.checkingSession": "Comprobando tu sesión…",
  "status.loadingLibrary": "Cargando tu biblioteca…",

  // Filters
  "filters.title": "Buscar",
  "filters.clear": "Limpiar filtros",
  "filters.bookTitle": "Título",
  "filters.author": "Autor",
  "filters.year": "Año",
  "filters.publisher": "Editorial",
  "filters.bookTitlePlaceholder": "Buscar por título",
  "filters.authorPlaceholder": "Buscar por autor",
  "filters.yearPlaceholder": "Buscar por año",
  "filters.publisherPlaceholder": "Buscar por editorial",

  // Book card
  "book.publisher": "Editorial",
  "book.delete": "Eliminar",
  "book.analyze": "Analizar",
  "book.coverAlt": "Carátula de {titulo}",

  // Empty states
  "empty.noBooks.title": "Tu biblioteca está vacía",
  "empty.noBooks.body": "Añade tu primer libro con el botón «Añadir libro».",
  "empty.noResults.title": "Sin resultados",
  "empty.noResults.body":
    "Ningún libro coincide con tu búsqueda. Prueba a ajustar o limpiar los filtros.",

  // Add-book form
  "form.title": "Añadir libro",
  "form.subtitle": "Completa los datos del ejemplar.",
  "form.bookTitle": "Título *",
  "form.author": "Autor *",
  "form.year": "Año *",
  "form.publisher": "Editorial *",
  "form.bookTitlePlaceholder": "Ej. Cien años de soledad",
  "form.authorPlaceholder": "Ej. Gabriel García Márquez",
  "form.publisherPlaceholder": "Sudamericana",
  "form.addCover": "Añadir carátula (opcional)",
  "form.changeCover": "Cambiar carátula",
  "form.selectedFile": "Seleccionado:",
  "form.errorRequired": "Por favor, rellena todos los campos.",
  "form.errorYear": "Por favor, introduce un año válido.",
  "form.errorSave": "No se pudo guardar el libro. Inténtalo de nuevo.",
  "form.submit": "Añadir libro",
  "form.saving": "Guardando…",

  // Auth
  "auth.signIn": "Iniciar sesión",
  "auth.signUp": "Registrarse",
  "auth.title.signIn": "Iniciar sesión",
  "auth.title.signUp": "Crear cuenta",
  "auth.subtitle": "Accede para sincronizar tu biblioteca en la nube.",
  "auth.email": "Correo electrónico",
  "auth.password": "Contraseña",
  "auth.emailPlaceholder": "tu@correo.com",
  "auth.errorMissing": "Introduce tu correo y contraseña.",
  "auth.errorGeneric": "No se pudo completar la acción.",
  "auth.submit.signIn": "Entrar",
  "auth.submit.signUp": "Crear cuenta",
  "auth.processing": "Procesando…",

  // Import
  "import.invalid": "El archivo no contiene una lista de libros válida.",
  "import.readError":
    "No se pudo leer el archivo. Asegúrate de que sea un JSON válido.",

  // AI assistant
  "ai.title": "Asistente IA",
  "ai.subtitle": "Pregunta a tu biblioteca o busca por significado.",
  "ai.tab.ask": "Preguntar",
  "ai.tab.search": "Búsqueda semántica",
  "ai.askPlaceholder":
    "Ej. ¿Qué libros de mi colección tratan sobre la memoria?",
  "ai.askButton": "Preguntar",
  "ai.thinking": "Pensando…",
  "ai.sources": "Fuentes",
  "ai.searchPlaceholder": "Ej. novelas sobre viajes en el tiempo",
  "ai.searchButton": "Buscar",
  "ai.searching": "Buscando…",
  "ai.noMatches":
    "No hay coincidencias. Analiza tus libros primero para incluirlos en la búsqueda.",
  "ai.onlyAnalyzed":
    "La IA solo considera los libros que ya han sido analizados.",
  "ai.match": "coincidencia",

  // AI analysis
  "analysis.title": "Análisis IA",
  "analysis.loading": "Analizando el libro…",
  "analysis.summary": "Resumen",
  "analysis.genre": "Género",
  "analysis.audience": "Público",
  "analysis.themes": "Temas",
  "analysis.significance": "Relevancia",
  "analysis.similarWorks": "Obras similares",
  "analysis.regenerate": "Regenerar análisis",
  "analysis.error": "No se pudo completar la operación de IA. Inténtalo de nuevo.",

  // Plans
  "plans.link": "Planes y precios",
  "plans.title": "Planes",
  "plans.subtitle": "Elige cómo quieres usar Biblioteca Cloud.",
  "plans.current": "Tu plan actual",
  "plans.free.name": "Gratis",
  "plans.free.price": "0 €",
  "plans.free.f1": "Catálogo ilimitado en tu navegador",
  "plans.free.f2": "Exportación a Excel y JSON",
  "plans.free.f3": "Sin cuenta ni conexión",
  "plans.pro.name": "Pro",
  "plans.pro.price": "9 €/mes",
  "plans.pro.f1": "Sincronización en la nube (Neon)",
  "plans.pro.f2": "Análisis de libros con IA",
  "plans.pro.f3": "Búsqueda semántica y asistente RAG",
  "plans.enterprise.name": "Bibliotecas",
  "plans.enterprise.price": "A medida",
  "plans.enterprise.f1": "Multi-usuario y catálogos compartidos",
  "plans.enterprise.f2": "Integración con sistemas existentes",
  "plans.enterprise.f3": "Soporte dedicado y SLA",
  "plans.contact": "Contactar",

  // Misc
  "modal.close": "Cerrar",
  "footer.text": "Biblioteca Cloud · Gestión inteligente de bibliotecas",
  "fab.addBook": "Añadir libro",
} as const;

export type TranslationKey = keyof typeof es;

export const en: Record<TranslationKey, string> = {
  // Header
  "header.kicker": "The intelligent platform for libraries",
  "header.subtitle":
    "Catalog, search and analyze your collection with artificial intelligence.",
  "header.booksOne": "{n} book",
  "header.booksMany": "{n} books",

  // Toolbar
  "toolbar.addBook": "Add book",
  "toolbar.excel": "Excel",
  "toolbar.exportJson": "Export JSON",
  "toolbar.importJson": "Import JSON",
  "toolbar.aiAssistant": "AI Assistant",
  "toolbar.resultsOne": "{n} result",
  "toolbar.resultsMany": "{n} results",

  // Modes / account
  "mode.offline": "Offline",
  "mode.cloud": "Cloud",
  "account.signOut": "Sign out",
  "account.fallback": "Account",
  "status.checkingSession": "Checking your session…",
  "status.loadingLibrary": "Loading your library…",

  // Filters
  "filters.title": "Search",
  "filters.clear": "Clear filters",
  "filters.bookTitle": "Title",
  "filters.author": "Author",
  "filters.year": "Year",
  "filters.publisher": "Publisher",
  "filters.bookTitlePlaceholder": "Search by title",
  "filters.authorPlaceholder": "Search by author",
  "filters.yearPlaceholder": "Search by year",
  "filters.publisherPlaceholder": "Search by publisher",

  // Book card
  "book.publisher": "Publisher",
  "book.delete": "Delete",
  "book.analyze": "Analyze",
  "book.coverAlt": "Cover of {titulo}",

  // Empty states
  "empty.noBooks.title": "Your library is empty",
  "empty.noBooks.body": "Add your first book with the “Add book” button.",
  "empty.noResults.title": "No results",
  "empty.noResults.body":
    "No books match your search. Try adjusting or clearing the filters.",

  // Add-book form
  "form.title": "Add book",
  "form.subtitle": "Fill in the details of this copy.",
  "form.bookTitle": "Title *",
  "form.author": "Author *",
  "form.year": "Year *",
  "form.publisher": "Publisher *",
  "form.bookTitlePlaceholder": "E.g. One Hundred Years of Solitude",
  "form.authorPlaceholder": "E.g. Gabriel García Márquez",
  "form.publisherPlaceholder": "Sudamericana",
  "form.addCover": "Add cover (optional)",
  "form.changeCover": "Change cover",
  "form.selectedFile": "Selected:",
  "form.errorRequired": "Please fill in all the fields.",
  "form.errorYear": "Please enter a valid year.",
  "form.errorSave": "The book could not be saved. Please try again.",
  "form.submit": "Add book",
  "form.saving": "Saving…",

  // Auth
  "auth.signIn": "Sign in",
  "auth.signUp": "Register",
  "auth.title.signIn": "Sign in",
  "auth.title.signUp": "Create account",
  "auth.subtitle": "Sign in to sync your library in the cloud.",
  "auth.email": "Email",
  "auth.password": "Password",
  "auth.emailPlaceholder": "you@email.com",
  "auth.errorMissing": "Enter your email and password.",
  "auth.errorGeneric": "The action could not be completed.",
  "auth.submit.signIn": "Sign in",
  "auth.submit.signUp": "Create account",
  "auth.processing": "Processing…",

  // Import
  "import.invalid": "The file does not contain a valid list of books.",
  "import.readError": "The file could not be read. Make sure it is valid JSON.",

  // AI assistant
  "ai.title": "AI Assistant",
  "ai.subtitle": "Ask your library or search by meaning.",
  "ai.tab.ask": "Ask",
  "ai.tab.search": "Semantic search",
  "ai.askPlaceholder": "E.g. Which books in my collection deal with memory?",
  "ai.askButton": "Ask",
  "ai.thinking": "Thinking…",
  "ai.sources": "Sources",
  "ai.searchPlaceholder": "E.g. novels about time travel",
  "ai.searchButton": "Search",
  "ai.searching": "Searching…",
  "ai.noMatches":
    "No matches. Analyze your books first to include them in the search.",
  "ai.onlyAnalyzed": "AI only considers books that have already been analyzed.",
  "ai.match": "match",

  // AI analysis
  "analysis.title": "AI Analysis",
  "analysis.loading": "Analyzing the book…",
  "analysis.summary": "Summary",
  "analysis.genre": "Genre",
  "analysis.audience": "Audience",
  "analysis.themes": "Themes",
  "analysis.significance": "Significance",
  "analysis.similarWorks": "Similar works",
  "analysis.regenerate": "Regenerate analysis",
  "analysis.error": "The AI operation could not be completed. Please try again.",

  // Plans
  "plans.link": "Plans & pricing",
  "plans.title": "Plans",
  "plans.subtitle": "Choose how you want to use Biblioteca Cloud.",
  "plans.current": "Your current plan",
  "plans.free.name": "Free",
  "plans.free.price": "$0",
  "plans.free.f1": "Unlimited catalog in your browser",
  "plans.free.f2": "Excel and JSON export",
  "plans.free.f3": "No account or connection needed",
  "plans.pro.name": "Pro",
  "plans.pro.price": "$9/mo",
  "plans.pro.f1": "Cloud sync (Neon)",
  "plans.pro.f2": "AI book analysis",
  "plans.pro.f3": "Semantic search and RAG assistant",
  "plans.enterprise.name": "Libraries",
  "plans.enterprise.price": "Custom",
  "plans.enterprise.f1": "Multi-user and shared catalogs",
  "plans.enterprise.f2": "Integration with existing systems",
  "plans.enterprise.f3": "Dedicated support and SLA",
  "plans.contact": "Contact us",

  // Misc
  "modal.close": "Close",
  "footer.text": "Biblioteca Cloud · Intelligent library management",
  "fab.addBook": "Add book",
};

export const translations = { es, en };
export type Lang = keyof typeof translations;
