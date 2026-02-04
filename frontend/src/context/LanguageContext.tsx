import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        dashboard: 'Dashboard',
        roadmap: 'Roadmap',
        syllabus: 'Syllabus Analysis',
        analysis: 'Skill Analysis',
        history: 'History',
        interview: 'Mock Interview',
        profile: 'Profile',
        resume: 'Resume Builder',
        paper: 'Paper Generator',
        feedback: 'Feedback',
        select_lang: 'Select Language'
    },
    hi: {
        dashboard: 'डैशबोर्ड',
        roadmap: 'रोडमैप',
        syllabus: 'पाठ्यक्रम विश्लेषण',
        analysis: 'कौशल विश्लेषण',
        history: 'इतिहास',
        interview: 'मॉक इंटरव्यू',
        profile: 'प्रोफ़ाइल',
        resume: 'रेज़्यूमे बिल्डर',
        paper: 'पेपर जेनरेटर',
        feedback: 'प्रतिक्रिया',
        select_lang: 'भाषा चुनें'
    },
    te: {
        dashboard: 'డ్యాష్‌బోర్డ్',
        roadmap: 'రోడ్‌మ్యాప్',
        syllabus: 'సిలబస్ విశ్లేషణ',
        analysis: 'నైపుణ్య విశ్లేషణ',
        history: 'చరిత్ర',
        interview: 'మాక్ ఇంటర్వ్యూ',
        profile: 'ప్రొఫైల్',
        resume: 'రెజ్యూమె బిల్డర్',
        paper: 'పేపర్ జనరేటర్',
        feedback: 'అభిప్రాయం',
        select_lang: 'భాషను ఎంచుకోండి'
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(
        (localStorage.getItem('edu_lang') as Language) || 'en'
    );

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('edu_lang', lang);
    };

    const t = (key: string) => {
        return (translations[language] as any)[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
