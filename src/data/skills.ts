import type { ComponentType } from 'react';
import type { IconType } from 'react-icons';
import {
  SiHtml5, SiJavascript, SiReact, SiTailwindcss, SiBootstrap, SiVite, SiNodedotjs, SiExpress, SiPhp, SiPython,
  SiFlask, SiJsonwebtokens, SiMongodb, SiMongoose, SiMysql, SiGit, SiGithub, SiPostman, SiNpm, SiXampp,
} from 'react-icons/si';
import { DiCss3 } from 'react-icons/di';
import { VscVscode } from 'react-icons/vsc';
import {
  Workflow, Webhook, ShieldCheck, Sparkles, BrainCircuit, MessageSquareText, Plug, PenTool, LayoutDashboard,
  Clapperboard, Camera, Puzzle, LineChart, MessagesSquare, Users, Shuffle, Zap,
} from 'lucide-react';
import { PROJECTS } from './projects';

export type SkillCategory = 'Languages' | 'Frontend' | 'Backend' | 'Databases' | 'Tools' | 'AI' | 'Creative' | 'Soft Skills';
export type SkillFilter = 'All' | SkillCategory;

export const SKILL_FILTERS: readonly SkillFilter[] = ['All', 'Languages', 'Frontend', 'Backend', 'Databases', 'Tools', 'AI', 'Creative', 'Soft Skills'];

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  icon: IconType | ComponentType<{ className?: string; size?: number | string; color?: string }>;
  /** true = official brand logo (Simple Icons / Devicon / VS Code), false = generic concept icon. */
  official: boolean;
  color: string;
  /** Honest, configurable proficiency / experience description. */
  level: string;
  /** What the technology is used for. */
  usage: string;
  /** Lower-case keywords matched against project technologies to find related projects. */
  match: string[];
}

const S = (s: Omit<Skill, 'id'>): Skill => ({ ...s, id: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') });

export const SKILLS: readonly Skill[] = [
  // Languages
  S({ name: 'HTML5', category: 'Languages', icon: SiHtml5, official: true, color: '#E34F26', level: 'Used across academic and portfolio projects', usage: 'Semantic page structure, forms and accessible markup for every web interface.', match: ['html5'] }),
  S({ name: 'CSS3', category: 'Languages', icon: DiCss3, official: true, color: '#1572B6', level: 'Used across academic and portfolio projects', usage: 'Layouts, responsive design, transitions and cinematic CSS animations.', match: ['css3'] }),
  S({ name: 'JavaScript', category: 'Languages', icon: SiJavascript, official: true, color: '#F7DF1E', level: 'Core language for frontend and MERN work', usage: 'Interactive UIs, DOM scripting, client-side logic and Node.js back ends.', match: ['javascript'] }),
  S({ name: 'PHP', category: 'Languages', icon: SiPhp, official: true, color: '#777BB4', level: 'Used in two portfolio projects', usage: 'Server-side rendering, CRUD workflows and MySQL-backed applications.', match: ['php', 'core php'] }),
  S({ name: 'Python (Basic)', category: 'Languages', icon: SiPython, official: true, color: '#3776AB', level: 'Basic — used with Flask in VoteHub', usage: 'Scripting and back-end logic with the Flask micro-framework.', match: ['python'] }),
  // Frontend
  S({ name: 'React.js', category: 'Frontend', icon: SiReact, official: true, color: '#61DAFB', level: 'Primary frontend library for current projects', usage: 'Component-driven user interfaces, hooks and state-driven views.', match: ['react', 'react 19'] }),
  S({ name: 'Tailwind CSS', category: 'Frontend', icon: SiTailwindcss, official: true, color: '#38BDF8', level: 'Used in React projects', usage: 'Utility-first styling for fast, consistent and responsive interfaces.', match: ['tailwind css', 'tailwind css v4'] }),
  S({ name: 'Bootstrap', category: 'Frontend', icon: SiBootstrap, official: true, color: '#8B5CF6', level: 'Used in VoteHub (Bootstrap 5)', usage: 'Responsive grids and prebuilt components for quick, tidy layouts.', match: ['bootstrap 5', 'bootstrap'] }),
  S({ name: 'Vite', category: 'Frontend', icon: SiVite, official: true, color: '#A78BFA', level: 'Build tool for React projects', usage: 'Fast dev server and optimised production builds.', match: ['vite'] }),
  S({ name: 'State Management', category: 'Frontend', icon: Workflow, official: false, color: '#06B6D4', level: 'Applied in React projects', usage: 'Organising application state so UI stays predictable as features grow.', match: [] }),
  // Backend
  S({ name: 'Node.js', category: 'Backend', icon: SiNodedotjs, official: true, color: '#5FA04E', level: 'Learning through MERN training; planned for BattleZone X', usage: 'JavaScript runtime for REST APIs and server-side applications.', match: ['node.js'] }),
  S({ name: 'Express.js', category: 'Backend', icon: SiExpress, official: true, color: '#E2E8F0', level: 'Learning through MERN training; planned for BattleZone X', usage: 'Routing and middleware for RESTful back-end services.', match: ['express.js'] }),
  S({ name: 'Flask', category: 'Backend', icon: SiFlask, official: true, color: '#E2E8F0', level: 'Used in VoteHub', usage: 'Python web framework for authentication, OTP flows and admin features.', match: ['flask'] }),
  S({ name: 'RESTful APIs', category: 'Backend', icon: Webhook, official: false, color: '#22D3EE', level: 'Working knowledge; service layers prepared in CyberShield X', usage: 'Designing resource-based endpoints that the frontend can consume.', match: [] }),
  S({ name: 'JWT Authentication', category: 'Backend', icon: SiJsonwebtokens, official: true, color: '#D63AFF', level: 'Planned in BattleZone X', usage: 'Stateless token-based authentication for secure sessions.', match: ['jwt'] }),
  S({ name: 'Role-Based Access Control', category: 'Backend', icon: ShieldCheck, official: false, color: '#34D399', level: 'Applied in VoteHub and Online Car Connect', usage: 'Separating admin and user capabilities with role-based modules.', match: [] }),
  // Databases
  S({ name: 'MongoDB', category: 'Databases', icon: SiMongodb, official: true, color: '#47A248', level: 'Learning through MERN training; planned for BattleZone X', usage: 'Document database for flexible, JSON-like application data.', match: ['mongodb'] }),
  S({ name: 'Mongoose', category: 'Databases', icon: SiMongoose, official: true, color: '#F87171', level: 'Learning through MERN training; planned for BattleZone X', usage: 'Schema modelling and validation for MongoDB in Node.js.', match: ['mongoose'] }),
  S({ name: 'MySQL', category: 'Databases', icon: SiMysql, official: true, color: '#4479A1', level: 'Used in VoteHub, Online Car Connect and SpendWise', usage: 'Relational data, constraints and queries for PHP and Flask applications.', match: ['mysql'] }),
  // Tools
  S({ name: 'Git', category: 'Tools', icon: SiGit, official: true, color: '#F05032', level: 'Everyday version control', usage: 'Tracking changes and managing project history.', match: ['git'] }),
  S({ name: 'GitHub', category: 'Tools', icon: SiGithub, official: true, color: '#F8FAFC', level: 'Everyday code hosting', usage: 'Hosting repositories and sharing portfolio work.', match: ['github'] }),
  S({ name: 'VS Code', category: 'Tools', icon: VscVscode, official: true, color: '#3B9EFF', level: 'Primary editor', usage: 'Writing, debugging and refactoring code.', match: [] }),
  S({ name: 'Postman', category: 'Tools', icon: SiPostman, official: true, color: '#FF6C37', level: 'Used to test APIs', usage: 'Sending requests and verifying REST API responses.', match: [] }),
  S({ name: 'npm', category: 'Tools', icon: SiNpm, official: true, color: '#CB3837', level: 'Everyday package manager', usage: 'Installing dependencies and running project scripts.', match: [] }),
  S({ name: 'XAMPP', category: 'Tools', icon: SiXampp, official: true, color: '#FB7A24', level: 'Local PHP / MySQL environment', usage: 'Running Apache, PHP and MySQL locally for PHP projects.', match: ['xampp', 'phpmyadmin'] }),
  // AI
  S({ name: 'Generative AI', category: 'AI', icon: Sparkles, official: false, color: '#A78BFA', level: 'Foundational — IBM AI course', usage: 'Understanding what generative models can and cannot do.', match: [] }),
  S({ name: 'LLM Fundamentals', category: 'AI', icon: BrainCircuit, official: false, color: '#8B5CF6', level: 'Foundational', usage: 'How large language models work, their strengths and limits.', match: [] }),
  S({ name: 'Prompt Engineering', category: 'AI', icon: MessageSquareText, official: false, color: '#EC4899', level: 'Practical working knowledge', usage: 'Writing clear prompts to get reliable results from AI tools.', match: [] }),
  S({ name: 'AI API Integration', category: 'AI', icon: Plug, official: false, color: '#06B6D4', level: 'Foundational', usage: 'Connecting AI services to web applications through APIs.', match: [] }),
  // Creative
  S({ name: 'Poster Design', category: 'Creative', icon: PenTool, official: false, color: '#F472B6', level: 'Personal interest and event work', usage: 'Visual layouts and typography for posters and digital design.', match: [] }),
  S({ name: 'UI/UX Basics', category: 'Creative', icon: LayoutDashboard, official: false, color: '#38BDF8', level: 'Basics — applied in every project UI', usage: 'Layout, hierarchy and usability decisions for interfaces.', match: [] }),
  S({ name: 'Video Editing', category: 'Creative', icon: Clapperboard, official: false, color: '#FB7185', level: 'Personal interest — reels and short videos', usage: 'Cutting and pacing short-form video content.', match: [] }),
  S({ name: 'Photography', category: 'Creative', icon: Camera, official: false, color: '#FBBF24', level: 'Personal interest', usage: 'Composition and lighting; informs visual design sense.', match: [] }),
  // Soft skills
  S({ name: 'Problem-Solving', category: 'Soft Skills', icon: Puzzle, official: false, color: '#34D399', level: 'Core strength', usage: 'Breaking down problems and debugging methodically.', match: [] }),
  S({ name: 'Analytical Thinking', category: 'Soft Skills', icon: LineChart, official: false, color: '#22D3EE', level: 'Core strength', usage: 'Reading requirements and data to find the clearest solution.', match: [] }),
  S({ name: 'Communication', category: 'Soft Skills', icon: MessagesSquare, official: false, color: '#A78BFA', level: 'Languages: English, Hindi, Kannada, Tulu', usage: 'Explaining ideas clearly with teammates and stakeholders.', match: [] }),
  S({ name: 'Teamwork', category: 'Soft Skills', icon: Users, official: false, color: '#F472B6', level: 'College events and activities', usage: 'Collaborating and coordinating with others toward shared goals.', match: [] }),
  S({ name: 'Adaptability', category: 'Soft Skills', icon: Shuffle, official: false, color: '#FBBF24', level: 'Core strength', usage: 'Picking up new stacks and adjusting to changing requirements.', match: [] }),
  S({ name: 'Quick Learning', category: 'Soft Skills', icon: Zap, official: false, color: '#FACC15', level: 'Core strength', usage: 'Getting productive with new technologies quickly.', match: [] }),
];

/** Portfolio projects that use a skill, derived from the project technology lists (defensible, not invented). */
export function relatedProjects(skill: Skill) {
  if (skill.match.length === 0) return [];
  return PROJECTS.filter((p) => p.tech.some((t) => skill.match.includes(t.toLowerCase())));
}
