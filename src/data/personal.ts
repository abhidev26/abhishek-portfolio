export interface SectionDef {
  id: string;
  label: string;
  /** Planet the camera visits for this section. */
  planet: string;
  code: string;
}

export const SECTIONS: readonly SectionDef[] = [
  { id: 'home', label: 'Home', planet: 'Solar System', code: '01' },
  { id: 'about', label: 'About', planet: 'Earth', code: '02' },
  { id: 'skills', label: 'Skills', planet: 'Mercury', code: '03' },
  { id: 'projects', label: 'Projects', planet: 'Mars', code: '04' },
  { id: 'education', label: 'Education', planet: 'Jupiter', code: '05' },
  { id: 'certifications', label: 'Certifications', planet: 'Saturn', code: '06' },
  { id: 'contact', label: 'Contact', planet: 'Neptune', code: '07' },
] as const;

/**
 * ✏️ EDIT ME: replace the LinkedIn placeholder with your real profile URL.
 * While it still contains "your-linkedin-profile" the site treats it as not configured.
 */
export const LINKEDIN_URL = 'https://www.linkedin.com/in/your-linkedin-profile';

export const PERSONAL = {
  name: 'ABHISHEK',
  brand: 'NEXUS COSMOS',
  tagline: 'Explore My Developer Universe.',
  signature: 'Beyond Code. Beyond Limits. Into the Universe.',
  title: 'BCA Graduate | Aspiring Full-Stack Developer (MERN)',
  location: 'Mangalore, Karnataka, India',
  heroTagline: 'I build secure, responsive and user-friendly web applications.',
  roles: [
    'Full-Stack Developer',
    'React & TypeScript Developer',
    'MERN Stack Developer',
    'UI/UX Enthusiast',
    'Creative Problem Solver',
    'Web Application Developer',
  ],
  summary:
    'Motivated and detail-oriented BCA graduate with a strong foundation in software development, analytical thinking and problem-solving. Experienced in building academic and portfolio projects, with a focus on efficient, user-friendly applications. Currently pursuing Full-Stack Web Development (MERN) at Zephyr Technologies & Solutions Pvt. Ltd. Eager to learn new technologies and contribute through teamwork and continuous learning.',
  languages: ['English', 'Hindi', 'Kannada', 'Tulu'],
  interests: ['Poster Design', 'UI/UX', 'Reels & Video Editing', 'Photography'],
  email: 'abhhhiii2611@gmail.com',
  phone: '+91 7411320714',
  phoneHref: 'tel:+917411320714',
  github: 'https://github.com/abhidev26',
  linkedin: LINKEDIN_URL,
  linkedinConfigured: !LINKEDIN_URL.includes('your-linkedin-profile'),
  resumeUrl: '/resume.pdf',
} as const;
