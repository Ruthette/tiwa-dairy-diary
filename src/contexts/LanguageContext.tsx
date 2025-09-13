
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'sw';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    diary: 'Animal Diary',
    tasks: 'Tasks',
    finances: 'Finances',
    
    // Dashboard
    welcome: 'Welcome to TIWA Kilimo – Dairy Diary',
    tagline: 'Record. Reflect. Grow.',
    animalDiary: 'Animal Diary',
    tasksCalendar: 'Tasks',
    financesOverview: 'Finances',
    calendarOverview: 'Calendar Overview',
    
    // Summary sections
    farmFinancialSnapshot: 'Financial Summary',
    totalIncome: 'Total Income',
    totalExpenses: 'Total Expenses',
    balance: 'Balance',
    upcomingTasksWeek: 'Upcoming Tasks This Week',
    noUpcomingTasks: 'No upcoming tasks',
    
    // Auth
    login: 'Login',
    logout: 'Sign Out',
    email: 'Email',
    password: 'Password',
    loginWithGoogle: 'Login with Google',
    continueAsGuest: 'Continue as Guest',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    loading: 'Loading...',
    
    // Tasks
    addTask: 'Add Task',
    editTask: 'Edit Task',
    taskTitle: 'Task Title',
    assignTo: 'Assign To',
    dueDate: 'Due Date',
    priority: 'Priority',
    description: 'Description',
    
    // Finances
    addRecord: 'Add Record',
    income: 'Income',
    expense: 'Expense',
    amount: 'Amount',
    category: 'Category',
    transactionDate: 'Transaction Date',
    
    // Animal Diary
    registerCow: 'Register Cow',
    milkProduction: 'Milk Production',
    feeding: 'Feeding',
    health: 'Health',
    breeding: 'Breeding',
    fullHistory: 'Full History',
  },
  sw: {
    // Navigation
    home: 'Nyumbani',
    diary: 'Kitabu cha Ng\'ombe',
    tasks: 'Kazi',
    finances: 'Fedha',
    
    // Dashboard
    welcome: 'Karibu TIWA Kilimo – Dairy Diary',
    tagline: 'Rekodi. Tafakari. Kua.',
    animalDiary: 'Kitabu cha Ng\'ombe',
    tasksCalendar: 'Kazi',
    financesOverview: 'Fedha',
    calendarOverview: 'Kalenda',
    
    // Summary sections
    farmFinancialSnapshot: 'Muhtasari wa Fedha',
    totalIncome: 'Mapato Yote',
    totalExpenses: 'Matumizi Yote',
    balance: 'Salio',
    upcomingTasksWeek: 'Kazi za Wiki Hii',
    noUpcomingTasks: 'Hakuna kazi za karibu',
    
    // Auth
    login: 'Ingia',
    logout: 'Toka',
    email: 'Barua Pepe',
    password: 'Nenosiri',
    loginWithGoogle: 'Ingia na Google',
    continueAsGuest: 'Endelea kama Mgeni',
    
    // Common
    save: 'Hifadhi',
    cancel: 'Ghairi',
    delete: 'Futa',
    edit: 'Hariri',
    add: 'Ongeza',
    loading: 'Inapakia...',
    
    // Tasks
    addTask: 'Ongeza Kazi',
    editTask: 'Hariri Kazi',
    taskTitle: 'Jina la Kazi',
    assignTo: 'Kabidhi kwa',
    dueDate: 'Tarehe ya Mwisho',
    priority: 'Kipaumbele',
    description: 'Maelezo',
    
    // Finances
    addRecord: 'Ongeza Rekodi',
    income: 'Mapato',
    expense: 'Matumizi',
    amount: 'Kiasi',
    category: 'Aina',
    transactionDate: 'Tarehe ya Muamala',
    
    // Animal Diary
    registerCow: 'Sajili Ng\'ombe',
    milkProduction: 'Uzalishaji wa Maziwa',
    feeding: 'Kulisha',
    health: 'Afya',
    breeding: 'Uzazi',
    fullHistory: 'Historia Kamili',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};


// use lib instead of this context directly