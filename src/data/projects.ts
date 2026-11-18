export type ProjectFilter = 'All' | 'React' | 'Full-Stack' | 'PHP' | 'Python';
export const PROJECT_FILTERS: readonly ProjectFilter[] = ['All', 'React', 'Full-Stack', 'PHP', 'Python'];

export interface Project {
  id: string;
  index: string;
  name: string;
  title: string;
  category: string;
  /** Filter tags this project belongs to (besides "All"). */
  tags: ProjectFilter[];
  status: string;
  badge?: string;
  image: string;
  imageAlt: string;
  accent: string;
  tech: string[];
  description: string;
  features: string[];
  /**
   * ✏️ EDIT ME: add the real deployment / repository URLs here when they exist.
   * Left empty on purpose - no URLs are invented. Empty values show a friendly "not added yet" message.
   */
  demoUrl: string;
  repoUrl: string;
}

export const PROJECTS: readonly Project[] = [
  {
    id: 'cybershield-x',
    index: '01',
    name: 'CYBERSHIELD X',
    title: 'Security Operations & Threat Monitoring Platform',
    category: 'React · Frontend Platform',
    tags: ['React'],
    status: 'Portfolio project',
    image: '/images/projects/cybershield-x.webp',
    imageAlt: 'Preview artwork for CyberShield X, a SOC dashboard with alert charts and an incident table',
    accent: '#06B6D4',
    tech: ['React 19', 'TypeScript', 'TanStack Router', 'Vite', 'Tailwind CSS v4', 'Recharts', 'Lucide React', 'Motion'],
    description:
      'Responsive SOC dashboard for simulated security events, alerts and incidents; log exploration, alert triage, incident investigation, threat analytics; modular components, audit-trail views, admin settings; service-layer architecture prepared for REST API, authentication, RBAC and real-time events.',
    features: [
      'Responsive SOC dashboard for simulated security events, alerts and incidents',
      'Log exploration and alert triage workflows',
      'Incident investigation and threat analytics views',
      'Modular components with audit-trail views and admin settings',
      'Service-layer architecture prepared for REST API, authentication, RBAC and real-time events',
    ],
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: 'battlezone-x',
    index: '02',
    name: 'BATTLEZONE X',
    title: 'Esports Battle Platform',
    category: 'MERN · Full-Stack Platform',
    tags: ['React', 'Full-Stack'],
    status: 'In progress',
    badge: 'IN PROGRESS',
    image: '/images/projects/battlezone-x.webp',
    imageAlt: 'Preview artwork for BattleZone X, an esports platform with a leaderboard and player profile cards',
    accent: '#EC4899',
    tech: ['React', 'JavaScript', 'Tailwind CSS', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Socket.IO', 'Redis', 'Phaser.js', 'Docker'],
    description:
      'Esports interface with player profiles, dashboards, inventories, achievements and leaderboards; planned backend APIs, JWT authentication and secure passwords; roadmap for real-time matchmaking, multiplayer rooms, live notifications and Phaser.js combat; Docker, automated testing and CI/CD planned.',
    features: [
      'Esports interface with player profiles, dashboards, inventories, achievements and leaderboards',
      'Planned backend APIs, JWT authentication and secure password handling',
      'Roadmap: real-time matchmaking, multiplayer rooms and live notifications',
      'Roadmap: Phaser.js combat',
      'Planned: Docker, automated testing and CI/CD',
    ],
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: 'votehub',
    index: '03',
    name: 'VoteHub',
    title: 'Secure Online Voting System',
    category: 'Python · Flask Full-Stack',
    tags: ['Full-Stack', 'Python'],
    status: 'Portfolio project',
    image: '/images/projects/votehub.webp',
    imageAlt: 'Preview artwork for VoteHub, an online voting system with ballot cards and a results chart',
    accent: '#7C3AED',
    tech: ['Python', 'Flask', 'MySQL', 'HTML5', 'CSS3', 'JavaScript', 'Bootstrap 5', 'Git'],
    description:
      'Voting and election management for institutions; voter registration, email OTP verification, authentication, RBAC; election scheduling, candidate management, duplicate-vote prevention via MySQL constraints; admin dashboards, vote receipts, activity logs, PDF/Excel reports.',
    features: [
      'Voter registration with email OTP verification and authentication',
      'Role-based access control (RBAC)',
      'Election scheduling and candidate management',
      'Duplicate-vote prevention enforced through MySQL constraints',
      'Admin dashboards, vote receipts, activity logs and PDF/Excel reports',
    ],
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: 'online-car-connect',
    index: '04',
    name: 'Online Car Connect',
    title: 'Used-Car Marketplace',
    category: 'PHP · Full-Stack Marketplace',
    tags: ['Full-Stack', 'PHP'],
    status: 'Portfolio project',
    image: '/images/projects/online-car-connect.webp',
    imageAlt: 'Preview artwork for Online Car Connect, a used-car marketplace with listing cards',
    accent: '#F97316',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Core PHP', 'MySQL', 'XAMPP', 'phpMyAdmin'],
    description:
      'Buy and sell used cars with listings and image uploads; wishlist, buyer-seller messaging, admin listing approval; role-based modules; simulated checkout workflow.',
    features: [
      'Buy and sell used cars with listings and image uploads',
      'Wishlist and buyer-seller messaging',
      'Admin listing approval',
      'Role-based modules',
      'Simulated checkout workflow',
    ],
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: 'cineverse',
    index: '05',
    name: 'CineVerse',
    title: 'OTT Streaming Website',
    category: 'JavaScript · Frontend',
    tags: [],
    status: 'Portfolio project',
    image: '/images/projects/cineverse.webp',
    imageAlt: 'Preview artwork for CineVerse, an OTT streaming interface with movie poster cards',
    accent: '#EF4444',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'DOM', 'Local Storage', 'Git', 'GitHub'],
    description:
      'Responsive OTT-style interface; movie cards, search, category filtering; watchlist with Local Storage; cinematic UI with CSS animations.',
    features: [
      'Responsive OTT-style interface',
      'Movie cards with search and category filtering',
      'Watchlist persisted with Local Storage',
      'Cinematic UI with CSS animations',
    ],
    demoUrl: '',
    repoUrl: '',
  },
  {
    id: 'spendwise',
    index: '06',
    name: 'SpendWise',
    title: 'Expense Management System',
    category: 'PHP · Full-Stack Tracker',
    tags: ['Full-Stack', 'PHP'],
    status: 'Portfolio project',
    image: '/images/projects/spendwise.webp',
    imageAlt: 'Preview artwork for SpendWise, an expense tracker with budget gauges and a transactions list',
    accent: '#10B981',
    tech: ['PHP', 'HTML5', 'CSS3', 'MySQL'],
    description:
      'Track income, expenses, transactions and budgets; categorization, CRUD, input validation; budget monitoring and spending reports.',
    features: [
      'Track income, expenses, transactions and budgets',
      'Categorization with full CRUD operations',
      'Input validation',
      'Budget monitoring and spending reports',
    ],
    demoUrl: '',
    repoUrl: '',
  },
] as const;

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
