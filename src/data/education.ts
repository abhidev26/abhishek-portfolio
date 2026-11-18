export interface EducationItem {
  id: string;
  title: string;
  institution?: string;
  period: string;
  result?: { label: string; value: string };
  current?: boolean;
  note?: string;
}

export const EDUCATION: readonly EducationItem[] = [
  {
    id: 'mern',
    title: 'Full-Stack Web Development (MERN)',
    institution: 'Zephyr Technologies & Solutions Pvt. Ltd.',
    period: 'Currently Pursuing',
    current: true,
  },
  {
    id: 'bca',
    title: 'Bachelor of Computer Applications (BCA)',
    period: '2023 – 2026',
    result: { label: 'CGPA', value: '7.19' },
  },
  {
    id: 'puc',
    title: 'Pre-University Course (PUC)',
    period: '2022 – 2023',
    result: { label: 'Score', value: '71%' },
  },
  {
    id: 'sslc',
    title: 'SSLC',
    period: '2020 – 2021',
    result: { label: 'Score', value: '69.12%' },
  },
] as const;
