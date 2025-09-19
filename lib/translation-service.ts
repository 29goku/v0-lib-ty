// Enhanced translation service for German citizenship test content
export const translateText = async (text: string, targetLanguage: string): Promise<string> => {
  // Simulate realistic API delay
  await new Promise((resolve) => setTimeout(resolve, 200))

  console.log(`🔍 Translating: "${text}" to ${targetLanguage}`)

  // Comprehensive translation dictionary covering German citizenship test patterns
  const translations: Record<string, Record<string, string>> = {
    // Complete common questions
    "Wie heißt die deutsche Verfassung?": {
      en: "What is the German constitution called?",
      es: "¿Cómo se llama la constitución alemana?",
      fr: "Comment s'appelle la constitution allemande?",
      it: "Come si chiama la costituzione tedesca?",
      tr: "Alman anayasasının adı nedir?",
      ar: "ما اسم الدستور الألماني؟",
      ru: "Как называется немецкая конституция?",
      zh: "德国宪法叫什么名字？",
      hi: "जर्मन संविधान का नाम क्या है?",
    },
    "Was ist die Hauptstadt von Deutschland?": {
      en: "What is the capital of Germany?",
      es: "¿Cuál es la capital de Alemania?",
      fr: "Quelle est la capitale de l'Allemagne?",
      it: "Qual è la capitale della Germania?",
      tr: "Almanya'nın başkenti nedir?",
      ar: "ما هي عاصمة ألمانيا؟",
      ru: "Какая столица Германии?",
      zh: "德国的首都是什么？",
      hi: "जर्मनी की राजधानी क्या है?",
    },
    "Welche Farben hat die deutsche Flagge?": {
      en: "What colors does the German flag have?",
      es: "¿Qué colores tiene la bandera alemana?",
      fr: "Quelles couleurs a le drapeau allemand?",
      it: "Quali colori ha la bandiera tedesca?",
      tr: "Alman bayrağının renkleri nelerdir?",
      ar: "ما هي ألوان العلم الألماني؟",
      ru: "Какие цвета у немецкого флага?",
      zh: "德国国旗有什么颜色？",
      hi: "जर्मन झंडे के रंग क्या हैं?",
    },
    "Wann wurde die Bundesrepublik Deutschland gegründet?": {
      en: "When was the Federal Republic of Germany founded?",
      es: "¿Cuándo se fundó la República Federal de Alemania?",
      fr: "Quand la République fédérale d'Allemagne a-t-elle été fondée?",
      it: "Quando è stata fondata la Repubblica Federale di Germania?",
      tr: "Almanya Federal Cumhuriyeti ne zaman kuruldu?",
      ar: "متى تأسست جمهورية ألمانيا الاتحادية؟",
      ru: "Когда была основана Федеративная Республика Германия?",
      zh: "德意志联邦共和国是什么时候成立的？",
      hi: "जर्मनी का संघीय गणराज्य कब स्थापित हुआ था?",
    },
    "Was bedeutet Demokratie?": {
      en: "What does democracy mean?",
      es: "¿Qué significa democracia?",
      fr: "Que signifie démocratie?",
      it: "Cosa significa democrazia?",
      tr: "Demokrasi ne demektir?",
      ar: "ما معنى الديمقراطية؟",
      ru: "Что означает демократия?",
      zh: "民主是什么意思？",
      hi: "लोकतंत्र का क्या अर्थ है?",
    },
    "Wer wählt den Bundeskanzler / die Bundeskanzlerin?": {
      en: "Who elects the Federal Chancellor?",
      es: "¿Quién elige al Canciller Federal?",
      fr: "Qui élit le Chancelier fédéral?",
      it: "Chi elegge il Cancelliere federale?",
      tr: "Federal Şansölyeyi kim seçer?",
      ar: "من ينتخب المستشار الاتحادي؟",
      ru: "Кто избирает федерального канцлера?",
      zh: "谁选举联邦总理？",
      hi: "संघीय चांसलर को कौन चुनता है?",
    },

    // Question starters and patterns
    "Wie heißt": {
      en: "What is called",
      es: "¿Cómo se llama",
      fr: "Comment s'appelle",
      it: "Come si chiama",
      tr: "Nasıl adlandırılır",
      ar: "ما اسم",
      ru: "Как называется",
      zh: "什么叫做",
      hi: "क्या कहलाता है",
    },
    "Was ist": {
      en: "What is",
      es: "¿Qué es",
      fr: "Qu'est-ce que",
      it: "Cos'è",
      tr: "Nedir",
      ar: "ما هو",
      ru: "Что такое",
      zh: "什么是",
      hi: "क्या है",
    },
    "Was bedeutet": {
      en: "What does ... mean",
      es: "¿Qué significa",
      fr: "Que signifie",
      it: "Cosa significa",
      tr: "Ne demektir",
      ar: "ما معنى",
      ru: "Что означает",
      zh: "什么意思",
      hi: "का क्या अर्थ है",
    },
    "Wann wurde": {
      en: "When was",
      es: "¿Cuándo fue",
      fr: "Quand a été",
      it: "Quando è stato",
      tr: "Ne zaman",
      ar: "متى تم",
      ru: "Когда был",
      zh: "什么时候",
      hi: "कब था",
    },
    "Wann war": {
      en: "When was",
      es: "¿Cuándo fue",
      fr: "Quand était",
      it: "Quando era",
      tr: "Ne zaman idi",
      ar: "متى كان",
      ru: "Когда был",
      zh: "什么时候是",
      hi: "कब था",
    },
    Welche: {
      en: "Which",
      es: "¿Cuáles",
      fr: "Quelles",
      it: "Quali",
      tr: "Hangi",
      ar: "أي",
      ru: "Какие",
      zh: "哪些",
      hi: "कौन से",
    },
    Welches: {
      en: "Which",
      es: "¿Cuál",
      fr: "Quel",
      it: "Quale",
      tr: "Hangi",
      ar: "أي",
      ru: "Какой",
      zh: "哪个",
      hi: "कौन सा",
    },
    Welcher: {
      en: "Which",
      es: "¿Cuál",
      fr: "Quel",
      it: "Quale",
      tr: "Hangi",
      ar: "أي",
      ru: "Какой",
      zh: "哪个",
      hi: "कौन सा",
    },
    Wer: {
      en: "Who",
      es: "¿Quién",
      fr: "Qui",
      it: "Chi",
      tr: "Kim",
      ar: "من",
      ru: "Кто",
      zh: "谁",
      hi: "कौन",
    },
    Wo: {
      en: "Where",
      es: "¿Dónde",
      fr: "Où",
      it: "Dove",
      tr: "Nerede",
      ar: "أين",
      ru: "Где",
      zh: "哪里",
      hi: "कहाँ",
    },
    Warum: {
      en: "Why",
      es: "¿Por qué",
      fr: "Pourquoi",
      it: "Perché",
      tr: "Neden",
      ar: "لماذا",
      ru: "Почему",
      zh: "为什么",
      hi: "क्यों",
    },
    "Wie viele": {
      en: "How many",
      es: "¿Cuántos",
      fr: "Combien",
      it: "Quanti",
      tr: "Kaç tane",
      ar: "كم عدد",
      ru: "Сколько",
      zh: "多少",
      hi: "कितने",
    },
    wählt: {
      en: "elects",
      es: "elige",
      fr: "élit",
      it: "elegge",
      tr: "seçer",
      ar: "ينتخب",
      ru: "избирает",
      zh: "选举",
      hi: "चुनता है",
    },

    // Key German political/legal terms
    "die deutsche Verfassung": {
      en: "the German constitution",
      es: "la constitución alemana",
      fr: "la constitution allemande",
      it: "la costituzione tedesca",
      tr: "Alman anayasası",
      ar: "الدستور الألماني",
      ru: "немецкая конституция",
      zh: "德国宪法",
      hi: "जर्मन संविधान",
    },
    Grundgesetz: {
      en: "Basic Law",
      es: "Ley Fundamental",
      fr: "Loi fondamentale",
      it: "Legge fondamentale",
      tr: "Temel Kanun",
      ar: "القانون الأساسي",
      ru: "Основной закон",
      zh: "基本法",
      hi: "मूल कानून",
    },
    "Bundesrepublik Deutschland": {
      en: "Federal Republic of Germany",
      es: "República Federal de Alemania",
      fr: "République fédérale d'Allemagne",
      it: "Repubblica Federale di Germania",
      tr: "Almanya Federal Cumhuriyeti",
      ar: "جمهورية ألمانيا الاتحادية",
      ru: "Федеративная Республика Германия",
      zh: "德意志联邦共和国",
      hi: "जर्मनी का संघीय गणराज्य",
    },
    Bundestag: {
      en: "Federal Parliament",
      es: "Parlamento Federal",
      fr: "Parlement fédéral",
      it: "Parlamento federale",
      tr: "Federal Parlamento",
      ar: "البرلمان الاتحادي",
      ru: "Федеральный парламент",
      zh: "联邦议会",
      hi: "संघीय संसद",
    },
    Bundesrat: {
      en: "Federal Council",
      es: "Consejo Federal",
      fr: "Conseil fédéral",
      it: "Consiglio federale",
      tr: "Federal Konsey",
      ar: "المجلس الاتحادي",
      ru: "Федеральный совет",
      zh: "联邦参议院",
      hi: "संघीय परिषद",
    },
    Bundeskanzler: {
      en: "Federal Chancellor",
      es: "Canciller Federal",
      fr: "Chancelier fédéral",
      it: "Cancelliere federale",
      tr: "Federal Şansölye",
      ar: "المستشار الاتحادي",
      ru: "Федеральный канцлер",
      zh: "联邦总理",
      hi: "संघीय चांसलर",
    },
    Bundeskanzlerin: {
      en: "Federal Chancellor (female)",
      es: "Canciller Federal",
      fr: "Chancelière fédérale",
      it: "Cancelliera federale",
      tr: "Federal Şansölye",
      ar: "المستشارة الاتحادية",
      ru: "Федеральный канцлер",
      zh: "联邦总理",
      hi: "संघीय चांसलर",
    },
    Bundespräsident: {
      en: "Federal President",
      es: "Presidente Federal",
      fr: "Président fédéral",
      it: "Presidente federale",
      tr: "Federal Başkan",
      ar: "الرئيس الاتحادي",
      ru: "Федеральный президент",
      zh: "联邦总统",
      hi: "संघीय राष्ट्रपति",
    },
    Demokratie: {
      en: "democracy",
      es: "democracia",
      fr: "démocratie",
      it: "democrazia",
      tr: "demokrasi",
      ar: "الديمقراطية",
      ru: "демократия",
      zh: "民主",
      hi: "लोकतंत्र",
    },
    Rechtsstaat: {
      en: "constitutional state",
      es: "estado de derecho",
      fr: "état de droit",
      it: "stato di diritto",
      tr: "hukuk devleti",
      ar: "دولة القانون",
      ru: "правовое государство",
      zh: "法治国家",
      hi: "कानूनी राज्य",
    },

    // German cities
    Berlin: {
      en: "Berlin",
      es: "Berlín",
      fr: "Berlin",
      it: "Berlino",
      tr: "Berlin",
      ar: "برلين",
      ru: "Берлин",
      zh: "柏林",
      hi: "बर्लिन",
    },
    München: {
      en: "Munich",
      es: "Múnich",
      fr: "Munich",
      it: "Monaco di Baviera",
      tr: "Münih",
      ar: "ميونيخ",
      ru: "Мюнхен",
      zh: "慕尼黑",
      hi: "म्यूनिख",
    },
    Hamburg: {
      en: "Hamburg",
      es: "Hamburgo",
      fr: "Hambourg",
      it: "Amburgo",
      tr: "Hamburg",
      ar: "هامبورغ",
      ru: "Гамбург",
      zh: "汉堡",
      hi: "हैम्बर्ग",
    },

    // Colors
    "schwarz, rot, gold": {
      en: "black, red, gold",
      es: "negro, rojo, dorado",
      fr: "noir, rouge, or",
      it: "nero, rosso, oro",
      tr: "siyah, kırmızı, altın",
      ar: "أسود، أحمر، ذهبي",
      ru: "черный, красный, золотой",
      zh: "黑色、红色、金色",
      hi: "काला, लाल, सुनहरा",
    },
    schwarz: {
      en: "black",
      es: "negro",
      fr: "noir",
      it: "nero",
      tr: "siyah",
      ar: "أسود",
      ru: "черный",
      zh: "黑色",
      hi: "काला",
    },
    rot: {
      en: "red",
      es: "rojo",
      fr: "rouge",
      it: "rosso",
      tr: "kırmızı",
      ar: "أحمر",
      ru: "красный",
      zh: "红色",
      hi: "लाल",
    },
    gold: {
      en: "gold",
      es: "dorado",
      fr: "or",
      it: "oro",
      tr: "altın",
      ar: "ذهبي",
      ru: "золотой",
      zh: "金色",
      hi: "सुनहरा",
    },

    // Common words
    Hauptstadt: {
      en: "capital",
      es: "capital",
      fr: "capitale",
      it: "capitale",
      tr: "başkent",
      ar: "عاصمة",
      ru: "столица",
      zh: "首都",
      hi: "राजधानी",
    },
    Flagge: {
      en: "flag",
      es: "bandera",
      fr: "drapeau",
      it: "bandiera",
      tr: "bayrak",
      ar: "علم",
      ru: "флаг",
      zh: "国旗",
      hi: "झंडा",
    },
    Farben: {
      en: "colors",
      es: "colores",
      fr: "couleurs",
      it: "colori",
      tr: "renkler",
      ar: "ألوان",
      ru: "цвета",
      zh: "颜色",
      hi: "रंग",
    },
    Deutschland: {
      en: "Germany",
      es: "Alemania",
      fr: "Allemagne",
      it: "Germania",
      tr: "Almanya",
      ar: "ألمانيا",
      ru: "Германия",
      zh: "德国",
      hi: "जर्मनी",
    },
    gegründet: {
      en: "founded",
      es: "fundada",
      fr: "fondée",
      it: "fondata",
      tr: "kuruldu",
      ar: "تأسست",
      ru: "основана",
      zh: "成立",
      hi: "स्थापित",
    },
    hat: {
      en: "has",
      es: "tiene",
      fr: "a",
      it: "ha",
      tr: "var",
      ar: "لديه",
      ru: "имеет",
      zh: "有",
      hi: "है",
    },
    von: {
      en: "of",
      es: "de",
      fr: "de",
      it: "di",
      tr: "nin",
      ar: "من",
      ru: "из",
      zh: "的",
      hi: "का",
    },

    // Years
    "1949": {
      en: "1949",
      es: "1949",
      fr: "1949",
      it: "1949",
      tr: "1949",
      ar: "1949",
      ru: "1949",
      zh: "1949",
      hi: "1949",
    },
    "1945": {
      en: "1945",
      es: "1945",
      fr: "1945",
      it: "1945",
      tr: "1945",
      ar: "1945",
      ru: "1945",
      zh: "1945",
      hi: "1945",
    },
    "1989": {
      en: "1989",
      es: "1989",
      fr: "1989",
      it: "1989",
      tr: "1989",
      ar: "1989",
      ru: "1989",
      zh: "1989",
      hi: "1989",
    },
    "1990": {
      en: "1990",
      es: "1990",
      fr: "1990",
      it: "1990",
      tr: "1990",
      ar: "1990",
      ru: "1990",
      zh: "1990",
      hi: "1990",
    },
  }

  // First, try exact match
  if (translations[text] && translations[text][targetLanguage]) {
    console.log(`✅ Found exact translation for "${text}":`, translations[text][targetLanguage])
    return translations[text][targetLanguage]
  }

  // Second, try to translate by replacing multiple terms
  let translatedText = text
  let hasTranslations = false

  // Sort by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length)

  for (const germanTerm of sortedKeys) {
    if (translatedText.includes(germanTerm) && translations[germanTerm][targetLanguage]) {
      const replacement = translations[germanTerm][targetLanguage]
      translatedText = translatedText.replace(new RegExp(germanTerm, "gi"), replacement)
      hasTranslations = true
      console.log(`🔄 Replaced "${germanTerm}" with "${replacement}"`)
    }
  }

  // If we made any replacements, return the result
  if (hasTranslations) {
    console.log(`✅ Partial translation result: "${translatedText}"`)
    return translatedText
  }

  // Third, try basic pattern matching for common German question structures
  if (targetLanguage === "en") {
    if (text.includes("?")) {
      // Handle question patterns
      if (text.startsWith("Was ist")) {
        const result = text.replace("Was ist", "What is").replace("?", "?")
        console.log(`🔄 Pattern match (Was ist): "${result}"`)
        return result
      }
      if (text.startsWith("Wie heißt")) {
        const result = text.replace("Wie heißt", "What is called").replace("?", "?")
        console.log(`🔄 Pattern match (Wie heißt): "${result}"`)
        return result
      }
      if (text.startsWith("Wann wurde")) {
        const result = text.replace("Wann wurde", "When was").replace("?", "?")
        console.log(`🔄 Pattern match (Wann wurde): "${result}"`)
        return result
      }
      if (text.startsWith("Welche")) {
        const result = text.replace("Welche", "Which").replace("?", "?")
        console.log(`🔄 Pattern match (Welche): "${result}"`)
        return result
      }
      if (text.startsWith("Wer")) {
        const result = text.replace("Wer", "Who").replace("?", "?")
        console.log(`🔄 Pattern match (Wer): "${result}"`)
        return result
      }
    }
  }

  // Final fallback - return with language tag and original text
  const languageNames: Record<string, string> = {
    en: "EN",
    es: "ES",
    fr: "FR",
    it: "IT",
    tr: "TR",
    ar: "AR",
    ru: "RU",
    zh: "ZH",
    hi: "HI",
  }

  const fallbackResult = `[${languageNames[targetLanguage] || targetLanguage.toUpperCase()}] ${text}`
  console.log(`❌ No translation found for "${text}", using fallback: "${fallbackResult}"`)
  return fallbackResult
}
