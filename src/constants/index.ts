import { LANG, PRIORITY } from "./enums";

export const InstaLink = "https://www.instagram.com/mouhamedaminelz/"
export const FacebookLink = "https://www.facebook.com/mouhamed.amine.lazreg/"
export const GitLink = "https://github.com/MedAmine2221"
export const LinkedInLink = "https://www.linkedin.com/in/mohamed-amine-lazreg-831b1817a/"
export const STATIC_KNOWLEDGE = {
  app: {
    name: "Gestionnaire de tâches IA",
    lastUpdate: "23-11-2025",
    description: "Application de gestion des tâches qui utilise l'IA pour proposer une fragmentation des objectifs en tâches prioritaires, suivre l’avancement, notifier les deadlines et générer des statistiques.",
    features: [
      "Fragmentation automatique des objectifs en tâches selon la priorité",
      "Notification des deadlines et rappels pour les tâches non terminées",
      "Page de statistiques affichant le pourcentage d’avancement des objectifs",
      "Support multilingue : français et anglais"
    ],
    purpose: "Aider l’utilisateur à organiser efficacement ses objectifs et tâches."
  },
  developer: {
    name: "Mohamed Amine LAZREG",
    role: "Ingénieur informatique – Enseignant vacataire",
    contact: {
      email: "lazregamine258@gmail.com",
      phone: "+216 53 739 484",
      linkedin: LinkedInLink,
      github: GitLink,
      facebook: FacebookLink,
      instagram: InstaLink
    },
    cv_summary: `Ingénieur en informatique et enseignant vacataire spécialisé dans les technologies web et mobiles. Expé-
                rience dans le développement d’applications réelles en entreprise et dans l’accompagnement d’étudiants
                sur les concepts fondamentaux : programmation orientée objet, développement frontend, méthodologies
                agiles et bonnes pratiques. Particulier intérêt pour la pédagogie active, la clarté de transmission et la
                création de supports structurés.`,
    skills: [
      "React.js, Next.js, Nest.js, Spring Boot, Flask, Laravel",
      "React Native, Flutter",
      "Java, JavaScript, TypeScript, Python, PHP",
      "MySQL, PostgreSQL",
      "Scrum, UML",
      "Git, Linux"
    ],
    experience: [
      `07/2024 – 07/2025 Développeur FullStack JS – Waialys DEV
        Participation au développement d’applications web et mobiles : Next.js, Nest.js,
        React Native.
        Collaboration avec des équipes pluridisciplinaires (Scrum).`,
      `02/2024 – 06/2024 Stage de fin d’études d’ingénieur – Waialys DEV
        Développement d’un outil interne de gestion (NestJS / NextJS).
        Initiation à la planification de sprints et aux revues de code.`,
      `08/2023 – 08/2023Stage d’été – Relead
        Développement mobile pour la gestion des employés et projets (Flutter / Flask).`,
      `08/2022 – 08/2022Stage d’été – Educanet Tunisie
        Application de gestion et formation des employés (Spring Boot MVC).`,
        `02/2021 – 05/2021Projet de fin d’études Licence – Enova Robotics
            Développement mobile (React Native) et backend (Flask).`
    ],
    formation:[
        "2021 – 2024 Diplôme National d’Ingénieur en Informatique – ISSAT Sousse",
        "2018 – 2021 Licence en Informatique Industrielle – ISSAT Sousse",
        "2018 Baccalauréat en Sciences Expérimentales"
    ],
    projet: [
        {
            name:"Machine Learning",
            description: "détection d’objets avec TensorFlow, prédiction de prix immobiliers.",
        },
        {
            name:"Plateforme web/mobile de quiz et certification",
            description: "accessibilité pour utilisateurs malvoyants, certifications vérifiables, forum intégré. Web : React.js — Mobile : React Native — Backend : Laravel.",
        },
        {
            name:"to do mobile app",
            description: "Application de gestion des tâches qui utilise l'IA pour proposer une fragmentation des objectifs en tâches prioritaires",
        },
    ],
    langues:[
        "Français",
        "Anglais",
        "Arabe"
    ],
    cv_file: "https://drive.google.com/file/d/1XM__X3RcQ_k4cKmvBIFjuTpTmu0AzD4Q/view?usp=drive_link"
  }
};

export const priorities =[
  {value: PRIORITY.HIGH, label:PRIORITY.HIGH},
  {value: PRIORITY.MEDIUM, label:PRIORITY.MEDIUM},
  {value: PRIORITY.LOW, label:PRIORITY.LOW},
  {value: PRIORITY.CRITICAL, label:PRIORITY.CRITICAL},
];

export const flags = [
  { lang: LANG.FR, name: LANG.FR+" 🇫🇷" },
  { lang: LANG.ENG, name: LANG.ENG+" 🇺🇸" },
];

export const routes = [
  { key: 'first', title: 'To Do List' },
  { key: 'second', title: 'In Progress List' },
  { key: 'third', title: 'Done List' },
];
