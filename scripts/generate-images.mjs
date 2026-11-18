/**
 * Generates the project-specific CONCEPT thumbnails (WebP) in /public/images/projects
 * plus the Open Graph image. These are illustrations, NOT application screenshots.
 * Replace any of them with a real screenshot (same filename) whenever you have one.
 *
 *   npm run generate:images
 */
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const out = join(root, 'images', 'projects');
mkdirSync(out, { recursive: true });

const W = 1280;
const H = 800;

const frame = (accent, accent2, body, label) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0f26"/><stop offset="1" stop-color="#050816"/></linearGradient>
    <radialGradient id="g1" cx="0.78" cy="0.22" r="0.6"><stop offset="0" stop-color="${accent}" stop-opacity="0.38"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="0.15" cy="0.9" r="0.55"><stop offset="0" stop-color="${accent2}" stop-opacity="0.3"/><stop offset="1" stop-color="${accent2}" stop-opacity="0"/></radialGradient>
    <linearGradient id="ac" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${accent2}"/></linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.045" stroke-width="1"/></pattern>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#g1)"/>
  <rect width="${W}" height="${H}" fill="url(#g2)"/>
  ${Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 197 + 53) % W}" cy="${(i * 331 + 17) % H}" r="${0.6 + (i % 3) * 0.5}" fill="#fff" opacity="${0.15 + (i % 5) * 0.1}"/>`).join('')}
  ${body}
  <g font-family="ui-monospace, Menlo, monospace" font-size="19" fill="#94a3b8" letter-spacing="3">
    <rect x="40" y="${H - 74}" width="${label.length * 13.4 + 36}" height="38" rx="19" fill="#050816" fill-opacity="0.7" stroke="#ffffff" stroke-opacity="0.16"/>
    <text x="58" y="${H - 49}">${label}</text>
  </g>
</svg>`;

const bars = (x, y, n, accent, seed, maxH = 150, w = 26, gap = 14) =>
  Array.from({ length: n }, (_, i) => {
    const h = 30 + ((i * seed * 37) % maxH);
    return `<rect x="${x + i * (w + gap)}" y="${y - h}" width="${w}" height="${h}" rx="6" fill="${accent}" opacity="${0.35 + (i % 4) * 0.15}"/>`;
  }).join('');

const designs = {
  'cybershield-x': () =>
    frame(
      '#06B6D4',
      '#7C3AED',
      `
      <g transform="translate(640 380)">
        ${[300, 230, 160, 90].map((r, i) => `<circle r="${r}" fill="none" stroke="#06B6D4" stroke-opacity="${0.14 + i * 0.07}" stroke-width="2"/>`).join('')}
        <path d="M0 -200 L150 -140 V20 C150 120 70 180 0 215 C-70 180 -150 120 -150 20 V-140 Z" fill="#06B6D4" fill-opacity="0.1" stroke="url(#ac)" stroke-width="6" filter="url(#glow)"/>
        <path d="M-58 8 L-14 54 L66 -42" fill="none" stroke="#e0fbff" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
        <path d="M0 0 L290 -160" stroke="#06B6D4" stroke-width="3" opacity="0.7"/>
      </g>
      <g opacity="0.9">
        <rect x="70" y="80" width="300" height="150" rx="18" fill="#0b1230" stroke="#fff" stroke-opacity="0.1"/>
        <polyline points="90,200 140,160 190,178 240,120 290,140 350,100" fill="none" stroke="#06B6D4" stroke-width="4" stroke-linejoin="round"/>
        <rect x="910" y="90" width="300" height="150" rx="18" fill="#0b1230" stroke="#fff" stroke-opacity="0.1"/>
        ${bars(930, 220, 8, '#7C3AED', 7, 100, 20, 12)}
        <circle cx="1140" cy="560" r="8" fill="#ef4444" filter="url(#glow)"/><circle cx="1010" cy="620" r="6" fill="#f59e0b" filter="url(#glow)"/><circle cx="1180" cy="660" r="6" fill="#ef4444" filter="url(#glow)"/>
        ${[0, 1, 2, 3].map((i) => `<rect x="70" y="${520 + i * 50}" width="${280 - i * 38}" height="14" rx="7" fill="#fff" opacity="${0.1 + i * 0.02}"/>`).join('')}
      </g>`,
      'CONCEPT VISUAL · CYBERSHIELD X',
    ),
  'battlezone-x': () =>
    frame(
      '#EC4899',
      '#7C3AED',
      `
      <g opacity="0.55">${Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 9 }, (_, c) => {
          const x = 90 + c * 135 + (r % 2) * 67;
          const y = 130 + r * 118;
          return `<path d="M${x} ${y - 52} l45 26 v52 l-45 26 l-45 -26 v-52 z" fill="none" stroke="#EC4899" stroke-opacity="${0.12 + ((r + c) % 3) * 0.1}" stroke-width="2"/>`;
        }).join(''),
      ).join('')}</g>
      <g transform="translate(640 390)" filter="url(#glow)">
        <circle r="150" fill="none" stroke="url(#ac)" stroke-width="7"/>
        <circle r="62" fill="none" stroke="#fff" stroke-opacity="0.8" stroke-width="3"/>
        <path d="M-230 0H-90M90 0H230M0 -230V-90M0 90V230" stroke="url(#ac)" stroke-width="7" stroke-linecap="round"/>
        <circle r="8" fill="#fff"/>
      </g>
      <path d="M980 120 L1100 300 L1040 300 L1130 520 L930 290 L990 290 Z" fill="#EC4899" opacity="0.25" stroke="#EC4899" stroke-width="3" filter="url(#glow)"/>
      <g>
        ${[0, 1, 2, 3].map((i) => `<rect x="70" y="${540 + i * 40}" width="${300 - i * 50}" height="18" rx="9" fill="url(#ac)" opacity="${0.8 - i * 0.15}"/>`).join('')}
        <text x="70" y="520" font-family="ui-monospace, monospace" font-size="18" fill="#cbd5e1" letter-spacing="4">LEADERBOARD</text>
      </g>`,
      'CONCEPT VISUAL · BATTLEZONE X',
    ),
  votehub: () =>
    frame(
      '#22C55E',
      '#2563EB',
      `
      <g transform="translate(640 420)">
        <circle r="300" fill="none" stroke="#2563EB" stroke-opacity="0.18" stroke-width="2"/><circle r="220" fill="none" stroke="#22C55E" stroke-opacity="0.2" stroke-width="2"/>
        <rect x="-170" y="-20" width="340" height="230" rx="26" fill="#0b1230" stroke="url(#ac)" stroke-width="6" filter="url(#glow)"/>
        <rect x="-95" y="-6" width="190" height="20" rx="10" fill="#050816" stroke="url(#ac)" stroke-width="3"/>
        <g transform="translate(0 -135) rotate(-8)"><rect x="-86" y="-70" width="172" height="150" rx="14" fill="#f8fafc"/><path d="M-44 6 L-10 40 L48 -26" fill="none" stroke="#16a34a" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></g>
        <path d="M-90 100 h180 M-90 140 h120" stroke="#22C55E" stroke-opacity="0.5" stroke-width="8" stroke-linecap="round"/>
      </g>
      <g opacity="0.85">${bars(880, 700, 6, '#2563EB', 5, 170, 28, 14)}</g>
      <g font-family="ui-monospace, monospace" font-size="19" fill="#86efac" letter-spacing="4"><text x="70" y="120">EMAIL OTP · VERIFIED</text><text x="70" y="156" fill="#93c5fd">ONE VOTE · ONE VOTER</text></g>`,
      'CONCEPT VISUAL · VOTEHUB',
    ),
  'online-car-connect': () =>
    frame(
      '#F59E0B',
      '#EF4444',
      `
      <g stroke="#fff" stroke-opacity="0.16" stroke-width="3" stroke-dasharray="40 30"><path d="M0 640 H${W}"/></g>
      <rect x="0" y="650" width="${W}" height="150" fill="#04060f" opacity="0.7"/>
      <g transform="translate(640 470)" filter="url(#glow)">
        <path d="M-330 110 C-330 60 -300 40 -240 30 L-150 -70 C-120 -105 -90 -115 -40 -115 H120 C170 -115 200 -100 230 -60 L270 20 C320 30 340 60 340 110 Z" fill="url(#ac)" fill-opacity="0.25" stroke="url(#ac)" stroke-width="6" stroke-linejoin="round"/>
        <path d="M-130 20 L-70 -70 H60 V20 Z M85 20 V-70 H130 C150 -70 165 -60 180 -40 L215 20 Z" fill="#050816" stroke="url(#ac)" stroke-width="4" stroke-linejoin="round"/>
        <circle cx="-190" cy="120" r="62" fill="#050816" stroke="url(#ac)" stroke-width="8"/><circle cx="-190" cy="120" r="24" fill="url(#ac)"/>
        <circle cx="210" cy="120" r="62" fill="#050816" stroke="url(#ac)" stroke-width="8"/><circle cx="210" cy="120" r="24" fill="url(#ac)"/>
      </g>
      <g transform="translate(900 150) rotate(8)"><rect width="260" height="100" rx="18" fill="#0b1230" stroke="#F59E0B" stroke-opacity="0.6" stroke-width="3"/><circle cx="40" cy="50" r="14" fill="#F59E0B"/><rect x="72" y="32" width="150" height="14" rx="7" fill="#fff" opacity="0.5"/><rect x="72" y="58" width="100" height="14" rx="7" fill="#fff" opacity="0.25"/></g>
      <g transform="translate(90 120)"><rect width="220" height="86" rx="16" fill="#0b1230" stroke="#fff" stroke-opacity="0.12"/><path d="M42 58 c-18 -14 -22 -26 -12 -34 c7 -6 14 -2 12 4 c-2 -6 5 -10 12 -4 c10 8 6 20 -12 34z" fill="#EF4444"/><rect x="82" y="28" width="110" height="12" rx="6" fill="#fff" opacity="0.4"/><rect x="82" y="50" width="70" height="12" rx="6" fill="#fff" opacity="0.2"/></g>`,
      'CONCEPT VISUAL · ONLINE CAR CONNECT',
    ),
  cineverse: () =>
    frame(
      '#A855F7',
      '#EC4899',
      `
      ${[0, 1].map((row) => `<g transform="translate(0 ${row ? 640 : 40})"><rect width="${W}" height="120" fill="#04060f" opacity="0.7"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${24 + i * 106}" y="20" width="82" height="80" rx="8" fill="url(#ac)" opacity="${0.12 + (i % 4) * 0.08}"/>`).join('')}${Array.from({ length: 36 }, (_, i) => `<rect x="${10 + i * 36}" y="${row ? 108 : 4}" width="14" height="8" rx="2" fill="#fff" opacity="0.18"/>`).join('')}</g>`).join('')}
      <g transform="translate(640 400)" filter="url(#glow)">
        <circle r="190" fill="#0b1230" fill-opacity="0.8" stroke="url(#ac)" stroke-width="8"/>
        <circle r="250" fill="none" stroke="#A855F7" stroke-opacity="0.25" stroke-width="2"/>
        <path d="M-60 -92 L110 0 L-60 92 Z" fill="url(#ac)"/>
      </g>
      <g transform="translate(80 260) rotate(-6)"><rect width="200" height="290" rx="16" fill="#0b1230" stroke="#fff" stroke-opacity="0.14"/><rect x="14" y="14" width="172" height="190" rx="10" fill="#A855F7" opacity="0.3"/><rect x="14" y="222" width="120" height="14" rx="7" fill="#fff" opacity="0.45"/><rect x="14" y="248" width="80" height="12" rx="6" fill="#fff" opacity="0.2"/></g>
      <g transform="translate(1000 240) rotate(6)"><rect width="200" height="290" rx="16" fill="#0b1230" stroke="#fff" stroke-opacity="0.14"/><rect x="14" y="14" width="172" height="190" rx="10" fill="#EC4899" opacity="0.3"/><rect x="14" y="222" width="120" height="14" rx="7" fill="#fff" opacity="0.45"/><rect x="14" y="248" width="80" height="12" rx="6" fill="#fff" opacity="0.2"/></g>`,
      'CONCEPT VISUAL · CINEVERSE',
    ),
  spendwise: () =>
    frame(
      '#10B981',
      '#06B6D4',
      `
      <g transform="translate(330 420)">
        <circle r="170" fill="none" stroke="#fff" stroke-opacity="0.08" stroke-width="44"/>
        <circle r="170" fill="none" stroke="#10B981" stroke-width="44" stroke-dasharray="${170 * 6.283 * 0.46} 2000" transform="rotate(-90)" stroke-linecap="round" filter="url(#glow)"/>
        <circle r="170" fill="none" stroke="#06B6D4" stroke-width="44" stroke-dasharray="${170 * 6.283 * 0.27} 2000" transform="rotate(75)" stroke-linecap="round"/>
        <circle r="170" fill="none" stroke="#f59e0b" stroke-width="44" stroke-dasharray="${170 * 6.283 * 0.14} 2000" transform="rotate(172)" stroke-linecap="round"/>
        <text text-anchor="middle" y="14" font-family="ui-monospace, monospace" font-size="38" font-weight="700" fill="#e2e8f0">BUDGET</text>
      </g>
      <g>${bars(640, 600, 8, '#10B981', 9, 280, 40, 18)}<polyline points="660,300 740,260 820,320 900,220 980,260 1060,170 1140,200" fill="none" stroke="#06B6D4" stroke-width="5" stroke-linejoin="round" filter="url(#glow)"/></g>
      ${[0, 1, 2].map((i) => `<g transform="translate(${960 + i * 70} ${660 - i * 14})"><circle r="30" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="4"/><text text-anchor="middle" y="9" font-family="ui-monospace, monospace" font-size="26" font-weight="700" fill="#fbbf24">₹</text></g>`).join('')}`,
      'CONCEPT VISUAL · SPENDWISE',
    ),
};

for (const [name, make] of Object.entries(designs)) {
  await sharp(Buffer.from(make())).webp({ quality: 84 }).toFile(join(out, `${name}.webp`));
  console.log('✓ images/projects/' + name + '.webp');
}

// Open Graph image (1200×630)
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff6d8"/><stop offset="0.35" stop-color="#ffb347"/><stop offset="0.7" stop-color="#ff6a13" stop-opacity="0.45"/><stop offset="1" stop-color="#ff6a13" stop-opacity="0"/></radialGradient>
    <linearGradient id="t" x1="0" x2="1"><stop offset="0" stop-color="#f8fafc"/><stop offset="0.5" stop-color="#22d3ee"/><stop offset="1" stop-color="#f472b6"/></linearGradient>
    <radialGradient id="v" cx="0.2" cy="0.1" r="0.8"><stop offset="0" stop-color="#7c3aed" stop-opacity="0.35"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#050816"/><rect width="1200" height="630" fill="url(#v)"/>
  ${Array.from({ length: 120 }, (_, i) => `<circle cx="${(i * 211 + 31) % 1200}" cy="${(i * 137 + 11) % 630}" r="${0.6 + (i % 3) * 0.5}" fill="#fff" opacity="${0.2 + (i % 5) * 0.12}"/>`).join('')}
  <g transform="translate(930 315)">
    ${[90, 150, 215, 285, 360].map((r, i) => `<circle r="${r}" fill="none" stroke="#8da2ff" stroke-opacity="0.18"/>`).join('')}
    <circle r="120" fill="url(#sun)"/>
    <circle cx="150" cy="0" r="9" fill="#a8a29e"/><circle cx="-100" cy="-120" r="13" fill="#4aa3ff"/><circle cx="210" cy="150" r="12" fill="#ef6a45"/><circle cx="-250" cy="60" r="24" fill="#d6a56a"/><circle cx="270" cy="-190" r="20" fill="#e8c77a"/>
  </g>
  <g font-family="Helvetica, Arial, sans-serif">
    <text x="70" y="200" font-size="22" letter-spacing="9" fill="#67e8f9">NEXUS COSMOS</text>
    <text x="70" y="318" font-size="120" font-weight="700" fill="url(#t)">ABHISHEK</text>
    <text x="70" y="388" font-size="34" fill="#e2e8f0">Full-Stack Developer · MERN</text>
    <text x="70" y="440" font-size="26" fill="#94a3b8">Explore My Developer Universe.</text>
    <text x="70" y="560" font-size="22" letter-spacing="3" fill="#64748b">Mangalore, Karnataka, India</text>
  </g>
</svg>`;
await sharp(Buffer.from(og)).png().toFile(join(root, 'og-image.png'));
console.log('✓ og-image.png');

// Profile folder note
writeFileSync(
  join(root, 'images', 'profile', 'README.txt'),
  'Drop a photo here (e.g. photo.webp) and set `profileImage: "/images/profile/photo.webp"` in src/data/personal.ts.\n',
);
