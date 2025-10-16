// App.tsx
import { BrowserRouter, Routes, Route, Link, useParams, NavLink, Navigate, useNavigate } from 'react-router-dom';
import React, { useEffect, useState, useMemo } from 'react';
import showdown from 'showdown';
import './App.css';

// Импорт всех иконок, чтобы TypeScript их распознавал
import * as FaIcons from 'react-icons/fa';

// Иконки
import { 
  FaDownload, FaHeart, FaSyncAlt, FaChevronDown, FaBoxOpen, FaServer, FaTimes, FaGamepad, FaWrench, FaSearch, FaCheck, FaExclamationTriangle, FaCode, FaBook, FaUserFriends, FaDesktop, FaUser, FaChevronLeft, FaChevronRight, FaCalendarAlt, FaGlobe, FaCogs, FaChevronUp
} from 'react-icons/fa';

// --- ГЛОБАЛЬНЫЕ КОНСТАНТЫ И ТИПЫ ---

const PROJECT_TYPES: { [key: string]: string } = {
  mods: 'mod',
  resourcepacks: 'resourcepack',
  datapacks: 'datapack',
  shaders: 'shader',
  modpacks: 'modpack',
  plugins: 'plugin',
};

const PROJECT_TYPE_LABELS: { [key: string]: string } = {
  mods: 'Mods',
  resourcepacks: 'Resource Packs',
  datapacks: 'Data Packs',
  shaders: 'Shaders',
  modpacks: 'Modpacks',
  plugins: 'Plugins',
};

const PROJECT_TYPE_PATHS: { [key: string]: string } = {
  mods: 'mod',
  resourcepacks: 'resourcepack',
  datapacks: 'datapack',
  shaders: 'shader',
  modpacks: 'modpack',
  plugins: 'plugin',
};

const LATEST_PATCHES: { [key: string]: number } = {
  '1.21': 10, '1.20': 6, '1.19': 4, '1.18': 2, '1.17': 1, 
  '1.16': 5, '1.15': 2, '1.14': 4, '1.12': 2, '1.8': 9, '1.7': 10, 
  '1.6': 4, '1.5': 2, '1.4': 7, '1.3': 2, '1.2': 5, '1.1': 0, '1.0': 0
};

const BANNED_KEYWORDS = ['lgbtq', 'pride', 'lgbtq+', 'lgbt+', 'LGBT+', 'p/ride', 'gay', 'furry', 'trans'];

function censorText(text: string | null | undefined): string {
    if (!text) return '';

    const regex = new RegExp(BANNED_KEYWORDS.join('|'), 'gi');
    
    return text.replace(regex, 'РКН не одобряет');
}

const BANNED_IMAGE_URLS = [
    'https://cdn.modrinth.com/data/AANobbMI/images/af966be7e960742619014059147cad1cdc4e2f2d.png',
    'https://cdn.modrinth.com/data/qANg5Jrr/40269a95e1e4237e9204e0f8b2172cbf4658c9c1_96.webp',
    'https://cdn.modrinth.com/data/74aTv108/images/071b0da4b0956d18fe61c0d1c37f3a92dc3a3f0a.webp',
    'https://cdn.modrinth.com/data/cached_images/071b0da4b0956d18fe61c0d1c37f3a92dc3a3f0a.webp'
];

const BANNED_EXACT_SLUGS: string[] = [
    'pride!',
    'p-ride',
    'joy',
    "lgbt-slime",
    "lgbtnt",
    "lgbtq+-flags",
    "lgbtq+happy-ghast",
    "pridepack",
    "pridegui",
    "pridegui-legacy",
    "pridebones",
    "pridegui-legacy-light",
    "pridegui-light",
    "prideful",
    "pridepack-legacy",
    "lgbeet",
    "os-pride-bookshelves",
    "gaytopia-server-pack",
    "lesbian-gui-texture-pack+",
    "os-lgbtq+-pride-cats",
    "pride-cb",
    "pride-title",
    "pridemclogo",
    "pride-harnesses",
    "pride-ghast",
    "pridestone-pride",
    "pridesniffer",
    "pridestone-transgender",
    "pridestone-gay",
    "pridestone-bisexual",
    "pridestone-lesbian",
    "pridestone-nonbinary",
    "pridestone-aroace",
    "pridestone-pansexual",
    "pridestone-genderfluid",
    "pridestone-asexual",
    "pridestone-aromantic",
    "pridestone-agender",
    "pridestone-intersex",
    "pridestone-genderqueer",
    "pridestone-demisexual",
    "vivillon-pride-patterns",
    "undopia-pride-bees",
    "undopia-pride-logo",
    "poetic-pride",
    "minimalist-pride-trans",
    "tooltip_transgender+5clr-frame-altbg",
    "rts-pride-bees",
    "minimalist-pride-rainbow",
    "tooltip_lesbian+7clr-full",
    "tooltip_transgender+5clr-full",
    "rainbow-pride-logo",
    "minimalist-pride-nonbinary",
    "tooltip_bisexual+3clr-full",
    "tooltip_pansexual+3clr-full",
    "tooltip_transgender+5clr-frame",
    "tooltip_genderfluid+5clr-full",
    "tooltip_transgender+3clr-full",
    "tooltip_bisexual+3clr-frame-altbg",
    "tooltip_genderfluid+5clr-frame-altbg",
    "tooltip_lesbian+7clr-frame-altbg",
    "tooltip_agender+7clr-frame-altbg",
    "tooltip_asexual+4clr-full",
    "tooltip_lesbian+5clr-full",
    "tooltip_transgender+3clr-frame-altbg",
    "tooltip_pansexual+3clr-frame",
    "tooltip_bigender+7clr-frame-altbg",
    "tooltip_genderqueer+3clr-frame",
    "tooltip_bisexual+3clr-frame",
    "tooltip_lesbian+5clr-frame",
    "tooltip_polysexual+3clr-full",
    "tooltip_transgender+3clr-frame",
    "tooltip_intersex+split-mono-bg-frame",
    "tooltip_agender+7clr-full",
    "tooltip_intersex+mono-frame",
    "tooltip_polyamory+5clr-frame",
    "tooltip_polyamory+5clr-full",
    "tooltip_bigender+7clr-frame",
    "tooltip_genderfluid+5clr-frame",
    "tooltip_genderqueer+3clr-frame-altbg",
    "tooltip_intersex+mono-frame-altbg",
    "tooltip_lesbian+7clr-frame",
    "tooltip_pansexual+3clr-frame-altbg",
    "tooltip_polyamory+5clr-frame-altbg",
    "tooltip_polysexual+3clr-frame",
    "tooltip_polysexual+3clr-frame-altbg",
    "tooltip_genderqueer+3clr-full",
    "tooltip_bigender+7clr-full",
    "tooltip_miaspec+5clr-full",
    "tooltip_lesbian+5clr-frame-altbg",
    "tooltip_fiaspec+5clr-frame",
    "tooltip_aromantic+5clr-full",
    "tooltip_miaspec+5clr-frame-altbg",
    "tooltip_asexual+4clr-frame",
    "tooltip_fiaspec+5clr-full",
    "tooltip_aromantic+5clr-frame-altbg",
    "tooltip_agender+7clr-frame",
    "tooltip_transgender+5clr-full-turned",
    "tooltip_fiaspec+5clr-frame-altbg",
    "tooltip_miaspec+5clr-frame",
    "tooltip_bisexual+3clr-full-turned",
    "tooltip_aromantic+5clr-frame",
    "tooltip_asexual+4clr-frame-altbg",
    "tooltip_lesbian+5clr-frame-altbg-turned",
    "tooltip_lesbian+7clr-full-turned",
    "tooltip_lesbian+7clr-frame-altbg-turned",
    "tooltip_lesbian+7clr-frame-turned",
    "tooltip_agender+7clr-frame-turned",
    "tooltip_transgender+5clr-frame-turned",
    "tooltip_pansexual+3clr-frame-altbg-turned",
    "tooltip_transgender+3clr-frame-turned",
    "tooltip_bisexual+3clr-frame-turned",
    "tooltip_lesbian+5clr-full-turned",
    "tooltip_aromantic+5clr-frame-altbg-turned",
    "tooltip_bisexual+3clr-frame-altbg-turned",
    "tooltip_pansexual+3clr-full-turned",
    "tooltip_genderfluid+5clr-frame-turned",
    "tooltip_bigender+7clr-frame-turned",
    "tooltip_genderqueer+3clr-full-turned",
    "tooltip_aromantic+5clr-frame-turned",
    "tooltip_transgender+3clr-full-turned",
    "tooltip_transgender+5clr-frame-altbg-turned",
    "tooltip_transgender+3clr-frame-altbg-turned",
    "tooltip_polysexual+3clr-frame-altbg-turned",
    "tooltip_bigender+7clr-full-turned",
    "tooltip_polyamory+5clr-frame-altbg-turned",
    "tooltip_miaspec+5clr-frame-altbg-turned",
    "tooltip_asexual+4clr-frame-turned",
    "tooltip_genderqueer+3clr-frame-altbg-turned",
    "tooltip_polysexual+3clr-frame-turned",
    "tooltip_pansexual+3clr-frame-turned",
    "tooltip_miaspec+5clr-frame-turned",
    "tooltip_agender+7clr-frame-altbg-turned",
    "tooltip_polysexual+3clr-full-turned",
    "tooltip_asexual+4clr-full-turned",
    "tooltip_lesbian+5clr-frame-turned",
    "tooltip_polyamory+5clr-frame-turned",
    "tooltip_asexual+4clr-frame-altbg-turned",
    "tooltip_miaspec+5clr-full-turned",
    "tooltip_fiaspec+5clr-frame-turned",
    "tooltip_bigender+7clr-frame-altbg-turned",
    "tooltip_genderfluid+5clr-full-turned",
    "tooltip_genderfluid+5clr-frame-altbg-turned",
    "tooltip_polyamory+5clr-full-turned",
    "tooltip_aromantic+5clr-full-turned",
    "tooltip_fiaspec+5clr-frame-altbg-turned",
    "tooltip_genderqueer+3clr-frame-turned",
    "tooltip_agender+7clr-full-turned",
    "tooltip_fiaspec+5clr-full-turned",
    "cpft",
    "ashen-bumblezone-pride-bees",
    "trans-jian",
    "lesbian-xiphos",
    "blades-of-pride-03-nonbinary-hand-and-a-half",
    "tooltip_gay-mlm+7clr-full",
    "tooltip_gay-mlm+7clr-frame",
    "tooltip_aroace+5clr-frame-altbg",
    "tooltip_aroace+5clr-full",
    "tooltip_aromantic-spectrum+5clr-frame-altbg-turned",
    "tooltip_aromantic-spectrum+5clr-frame",
    "tooltip_asexual-spectrum+4clr-frame-altbg",
    "tooltip_gay-mlm+5clr-frame",
    "tooltip_gay-mlm+7clr-frame-altbg",
    "tooltip_gay-mlm+5clr-frame-altbg",
    "tooltip_gay-mlm+5clr-full",
    "tooltip_aroace+5clr-frame",
    "tooltip_aromantic-spectrum+5clr-frame-altbg",
    "tooltip_asexual-spectrum+4clr-frame",
    "tooltip_asexual-spectrum+4clr-full",
    "tooltip_aromantic-spectrum+5clr-full",
    "tooltip_gay-mlm+7clr-frame-turned",
    "tooltip_gay-mlm+5clr-full-turned",
    "tooltip_gay-mlm+5clr-frame-turned",
    "tooltip_aromantic-spectrum+5clr-full-turned",
    "tooltip_aroace+5clr-full-turned",
    "tooltip_gay-mlm+7clr-frame-altbg-turned",
    "tooltip_gay-mlm+5clr-frame-altbg-turned",
    "tooltip_gay-mlm+7clr-full-turned",
    "tooltip_aroace+5clr-frame-turned",
    "tooltip_asexual-spectrum+4clr-frame-altbg-turned",
    "tooltip_asexual-spectrum+4clr-frame-turned",
    "tooltip_aroace+5clr-frame-altbg-turned",
    "tooltip_aromantic-spectrum+5clr-frame-turned",
    "tooltip_asexual-spectrum+4clr-full-turned",
    "intersex-glow-berries",
    "rainbow-shields",
    "asexual_hearts",
    "trans-hotbar-and-xp-bar",
    "bi-hotbar-and-xp-bar",
    "mlm-hotbar-and-xp-bar",
    "ace-hotbar-and-xp-bar",
    "tooltip_rainbow+7clr-full",
    "tooltip_rainbow+7clr-frame",
    "tooltip_rainbow+7clr-frame-turned",
    "tooltip_rainbow+7clr-full-turned",
    "winters-banner-tweaks",
    "lesbian-pride-logo",
    "gay-pack",
    "gay-flowering-hotbar",
    "gay-logo",
    "gay-plaza-resource-pack",
    "begaydocrime",
    "lesbian-xp-bar",
    "lesbian-hearts"
];

const BANNED_SLUG_KEYWORDS: string[] = [
    'pride',
    'lgbt',
    'lgbtq',
    'gay',
    'furry',
];

function ModeratedImage({ src, alt, className, ...rest }: { src: string | undefined, alt: string | undefined, className?: string, [key: string]: any }) {
    if (!src || BANNED_IMAGE_URLS.includes(src)) {
        const domain = src ? new URL(src).hostname : 'cdn.modrinth.com';
        return (
            <div className={`moderated-image-placeholder ${className || ''}`}>
                <p>Изображение с {domain} заблокировано по требованию РКН</p>
            </div>
        );
    }

    return <img src={src} alt={alt} className={className} {...rest} />;
}

function moderateHtmlString(html: string): string {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const images = doc.querySelectorAll('img');

    images.forEach(img => {
        if (img.src && BANNED_IMAGE_URLS.includes(img.src)) {
            const domain = new URL(img.src).hostname;

            const placeholder = doc.createElement('div');
            placeholder.className = 'moderated-image-placeholder';
            placeholder.innerHTML = `<p>Изображение с ${domain} заблокировано по требованию РКН</p>`;

            img.parentNode?.replaceChild(placeholder, img);
        }
    });

    return doc.body.innerHTML;
}

// --- ГЛОБАЛЬНЫЕ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function groupGameVersions(versions: string[], options: { useXNotation?: boolean } = {}): string[] {
  const { useXNotation = false } = options;
  if (!versions || versions.length === 0) return [];
  const stableVersions = versions
    .filter((v: string) => /^\d+\.\d+(\.\d+)?$/.test(v))
    .sort((a: string, b: string) => b.localeCompare(a, undefined, { numeric: true }));
  const groups: { [prefix: string]: number[] } = {};
  for (const version of stableVersions) {
    const parts = version.split('.');
    const prefix = `${parts[0]}.${parts[1]}`;
    const patch = parts.length > 2 ? parseInt(parts[2], 10) : 0;
    if (!groups[prefix]) groups[prefix] = [];
    groups[prefix].push(patch);
  }
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
    .flatMap(prefix => {
      const patches: number[] = [...new Set(groups[prefix])].sort((a, b) => a - b);
      if (patches.length === 0) return [];
      const latestKnownPatch = LATEST_PATCHES[prefix];
      const ranges: string[] = [];
      let start = patches[0];
      for (let i = 1; i <= patches.length; i++) {
        if (i === patches.length || patches[i] > patches[i-1] + 1) {
          const end = patches[i-1];
          const isFullRange = useXNotation && start === 0 && latestKnownPatch !== undefined && end >= latestKnownPatch;
          if (isFullRange) {
            ranges.push(`${prefix}.x`);
          } else {
            const startLabel = (start === 0) ? prefix : `${prefix}.${start}`;
            const endLabel = `${prefix}.${end}`;
            if (startLabel === endLabel) {
              ranges.push(startLabel);
            } else {
              ranges.push(`${startLabel} - ${endLabel}`);
            }
          }
          if (i < patches.length) {
            start = patches[i];
          }
        }
      }
      return ranges;
    });
}

const formatNumber = (num: number): string => {
  if (!num) return '0';
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}k`;
  return num.toString();
};

const timeAgo = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} year${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} month${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} day${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hour${Math.floor(interval) > 1 ? 's' : ''} ago`;
  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minute${Math.floor(interval) > 1 ? 's' : ''} ago`;
  return `${Math.floor(seconds)} second${Math.floor(seconds) !== 1 ? 's' : ''} ago`;
};

function ProjectIcon({ projectType }: { projectType: string }) {
  switch (projectType) {
    case 'mods':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16" />
          <path d="M3.29 7 12 12l8.71-5M12 22V12" />
        </svg>
      );
    case 'resourcepacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3" />
          <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7M14.5 17.5 4.5 15" />
        </svg>
      );
    case 'datapacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"> 
          <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
        </svg>
      );
    case 'shaders':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2M2.5 13 5 7c.7-1.3 1.4-2 3-2M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />
          <circle cx="18" cy="15" r="4"></circle>
          <circle cx="6" cy="15" r="4"></circle>
        </svg>
      );
    case 'modpacks':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 22v-9M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.66 1.66 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" />
          <path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" />
          <path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.64 1.64 0 0 0 1.63 0z" />
        </svg>
      );
    case 'plugins':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
          <path d="M12 22v-5M9 8V2M15 8V2M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
        </svg>
      );
    default:
      return null;
  }
}

// --- ОСНОВНЫЕ КОМПОНЕНТЫ ПРИЛОЖЕНИЯ ---

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate replace to="/mods" />} />
          <Route path="/:projectType" element={<ProjectListPage />} />
          
          {Object.keys(PROJECT_TYPE_PATHS).map(typeKey => (
            <Route 
              key={typeKey}
              path={`/${PROJECT_TYPE_PATHS[typeKey]}/:projectSlug`} 
              element={<ProjectPage />} 
            />
          ))}
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

const NAVIGATION_LINKS = [
  { key: 'mods',          label: 'Mods' },
  { key: 'resourcepacks', label: 'Resource Packs' },
  { key: 'datapacks',     label: 'Data Packs' },
  { key: 'shaders',       label: 'Shaders' },
  { key: 'modpacks',      label: 'Modpacks' },
  { key: 'plugins',       label: 'Plugins' },
];

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img 
            src="src/assets/RuModrinth_logo_full.png" 
            alt="RuModrinth" 
            className="logo-full-image"
          />
        </Link>
        <nav className="header-nav">
          {NAVIGATION_LINKS.map(link => (
            <NavLink 
              key={link.key}
              to={`/${link.key}`} 
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              {/* Вызываем наш новый компонент с иконками */}
              <ProjectIcon projectType={link.key} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

function MainLayout({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <aside className="sidebar">
        {sidebar}
      </aside>
      <section className="main-content">
        {children}
      </section>
    </div>
  );
}

function ProjectListPage() {
    const { projectType = 'mods' } = useParams<{ projectType: string }>();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [selectedLoaders, setSelectedLoaders] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedEnvironments, setSelectedEnvironments] = useState<string[]>([]);

    const [allLoaders, setAllLoaders] = useState<any[]>([]);

    useEffect(() => {
        fetch('https://api.modrinth.com/v2/tag/loader')
            .then(r => r.json())
            .then(data => Array.isArray(data) && setAllLoaders(data))
            .catch(e => console.error("Failed to fetch all loaders:", e));
    }, []);

    const riftIconSvg = useMemo(() => {
        const riftLoader = allLoaders.find(loader => loader.name === 'rift');
        return riftLoader ? riftLoader.icon : null;
    }, [allLoaders]);

    useEffect(() => {
        setPage(0);
        setTotalPages(0);
        setSearch('');
        setSelectedVersions([]);
        setSelectedLoaders([]);
        setSelectedCategories([]);
        setSelectedEnvironments([]);
    }, [projectType]);

    useEffect(() => {
        setLoading(true);
        
        const apiProjectType = PROJECT_TYPES[projectType] || 'mod';
        const allFacets: string[][] = [[`project_type:${apiProjectType}`]];
        if (selectedVersions.length > 0) allFacets.push(selectedVersions.map(v => `versions:${v}`));
        if (selectedLoaders.length > 0) allFacets.push(selectedLoaders.map(l => `categories:${l}`));
        if (selectedCategories.length > 0) allFacets.push(selectedCategories.map(c => `categories:${c}`));
        if (selectedEnvironments.length > 0) {
            const envFacets = selectedEnvironments.map(e => (e === 'client' ? `client_side:required` : `server_side:required`));
            allFacets.push(envFacets);
        }
    
        const params = new URLSearchParams({
            facets: JSON.stringify(allFacets),
            index: 'relevance',
            limit: '20',
            offset: String(page * 20),
            query: search
        });

        fetch(`https://api.modrinth.com/v2/search?${params}`)
            .then(r => r.json())
            .then(d => {
                const hits = d.hits || [];

                const filteredProjects = hits.filter((project: any) => {
                    const title = project.title.toLowerCase();
                    const description = project.description.toLowerCase();
                    
                    const hasBannedKeyword = BANNED_KEYWORDS.some(keyword => 
                        title.includes(keyword) || description.includes(keyword)
                    );
                    
                    return !hasBannedKeyword;
                });

                setProjects(filteredProjects);
                setTotalPages(Math.ceil(d.total_hits / 20));
                setLoading(false);
            })
            .catch(e => {
                setError(e.toString());
                setLoading(false);
            });
    }, [page, search, selectedVersions, selectedLoaders, selectedCategories, selectedEnvironments, projectType]);

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(0);
    };
  
    const handleFilterToggle = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
        setPage(0);
    };

    const getClientServerText = (client: string, server: string) => {
        if (client !== 'unsupported' && server !== 'unsupported') return 'Client & Server';
        if (client !== 'unsupported') return 'Client';
        if (server !== 'unsupported') return 'Server';
        return '';
    };

    const currentLabel = PROJECT_TYPE_LABELS[projectType] || 'Projects';

    return (
        <MainLayout sidebar={
            <FilterMenu 
                projectType={PROJECT_TYPES[projectType] || 'mod'}
                selectedVersions={selectedVersions}
                onVersionToggle={(v: string) => handleFilterToggle(setSelectedVersions, v)}
                selectedLoaders={selectedLoaders}
                onLoaderToggle={(l: string) => handleFilterToggle(setSelectedLoaders, l)}
                selectedCategories={selectedCategories}
                onCategoryToggle={(c: string) => handleFilterToggle(setSelectedCategories, c)}
                selectedEnvironments={selectedEnvironments}
                onEnvironmentToggle={(e: string) => handleFilterToggle(setSelectedEnvironments, e)}
            />
        }>
            <div className="mods-header-row">
                <input className="search-bar" type="text" placeholder={`Search ${currentLabel}...`} value={search} onChange={onSearchChange} />
                <select className="sort-select">
                    <option>Sort by: Relevance</option>
                    <option>Downloads</option>
                    <option>Updated</option>
                </select>
                <div className="pagination-top">
                    {totalPages > 1 && (
                        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    )}
                </div>
            </div>

            {error && <div style={{ color: 'red' }}>{error}</div>}
      
            <div className="mods-list-wrapper">
                {loading && projects.length > 0 && (
                    <div className="loading-overlay">
                        <FaSyncAlt className="spinner" />
                    </div>
                )}
                {loading && projects.length === 0 && (
                    <div className="initial-loading-container">
                        <FaSyncAlt className="spinner" />
                    </div>
                )}

                <div className={`mods-list ${loading && projects.length > 0 ? 'loading-transition' : ''}`}>
                    {projects.map((project) => {
                        const singularProjectType = PROJECT_TYPE_PATHS[projectType] || 'mod';
                        const projectPath = `/${singularProjectType}/${project.slug}`;

                        return (
                            <Link className="mod-card-compact" to={projectPath} key={project.project_id}>
                                {project.icon_url ? (
                                    <ModeratedImage src={project.icon_url} alt={project.title} className="mod-card-icon-compact"/>
                                ) : (
                                    <span 
                                        className="mod-card-icon-compact fallback-icon" 
                                        dangerouslySetInnerHTML={{ __html: riftIconSvg || '' }}
                                    />
                                )}
                                
                                <div className="mod-card-body-compact">
                                    <div className="mod-card-main-info">
                                        <div className="mod-card-title-compact">{project.title}</div>
                                        <div className="mod-card-author-compact">by <span>{project.author}</span></div>
                                    </div>
                                    <p className="mod-card-desc-compact">{project.description}</p>
                                    <div className="mod-card-tags-compact">
                                        <span className="tag"><FaGlobe /> {getClientServerText(project.client_side, project.server_side)}</span>
                                        {project.categories?.slice(0, 1).map((cat: string) => <span key={cat} className="tag"><FaBook /> {cat}</span>)}
                                        {project.loaders?.slice(0, 3).map((loader: string) => <span key={loader} className="tag"><FaCogs /> {loader}</span>)}
                                    </div>
                                </div>
                                <div className="mod-card-stats-compact">
                                    <div className="stat-item"><FaDownload /> {formatNumber(project.downloads)}</div>
                                    <div className="stat-item"><FaHeart /> {formatNumber(project.follows)}</div>
                                    <div className="stat-item"><FaSyncAlt /> {timeAgo(project.date_modified)}</div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="pagination-bottom">
                {totalPages > 1 && (
                    <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                )}
            </div>
        </MainLayout>
    );
}

// --- КОМПОНЕНТЫ ФИЛЬТРАЦИИ ---

const FilterBlock = ({ title, children, isLoading = false }: { title: string, children: React.ReactNode, isLoading?: boolean }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="sidebar-block">
      <button className="sidebar-title" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        {isLoading ? <FaSyncAlt className="spinner-inline" /> : (isOpen ? <FaChevronUp /> : <FaChevronDown />)}
      </button>
      {isOpen && <div className="sidebar-content">{children}</div>}
    </div>
  );
};

function FilterMenu({
  projectType,
  selectedVersions, onVersionToggle,
  selectedLoaders, onLoaderToggle,
  selectedCategories, onCategoryToggle,
  selectedEnvironments, onEnvironmentToggle
}: {
    projectType: string;
    selectedVersions: string[]; onVersionToggle: (v: string) => void;
    selectedLoaders: string[]; onLoaderToggle: (l: string) => void;
    selectedCategories: string[]; onCategoryToggle: (c: string) => void;
    selectedEnvironments: string[]; onEnvironmentToggle: (e: string) => void;
}) {
  const MOD_LOADERS_ORDER = ['fabric', 'forge', 'neoforge', 'quilt', 'babric', 'bta-babric', 'java-agent', 'legacy-fabric', 'liteloader', 'modloader', 'nillaloader', 'ornithe', 'rift'];
  const SHADER_LOADERS_ORDER = ['canvas', 'iris', 'optifine', 'vanilla'];
  const MODPACK_LOADERS_ORDER = ['fabric', 'forge', 'neoforge', 'quilt'];
  const PLUGIN_LOADERS_ORDER = ['bukkit', 'folia', 'paper', 'purpur', 'spigot', 'sponge'];

  const RP_CATEGORIES_ORDER = ['combat', 'cursed', 'decoration', 'modded', 'realistic', 'simplistic', 'themed', 'tweaks', 'utility', 'vanilla-like'];
  const RP_FEATURES_ORDER = ['audio', 'blocks', 'core-shaders', 'entities', 'environment', 'equipment', 'fonts', 'gui', 'items', 'locale', 'models'];
  const RP_RESOLUTIONS_ORDER = ['8x-or-lower', '16x', '32x', '48x', '64x', '128x', '256x', '512x-or-higher'];
  
  const DATAPACK_CATEGORIES_ORDER = ['adventure', 'cursed', 'decoration', 'economy', 'equipment', 'food', 'game-mechanics', 'library', 'magic', 'management', 'minigame', 'mobs', 'optimization', 'social', 'storage', 'technology', 'transportation', 'utility', 'world-generation'];

  const SHADER_CATEGORIES_ORDER = ['cartoon', 'cursed', 'fantasy', 'realistic', 'semi-realistic', 'vanilla-like'];
  const SHADER_FEATURES_ORDER = ['atmosphere', 'bloom', 'colored-lighting', 'foliage', 'path-tracing', 'pbr', 'reflections', 'shadows'];
  const SHADER_PERFORMANCE_ORDER = ['high', 'low', 'medium', 'potato', 'screenshot'];

  const [allGameVersions, setAllGameVersions] = useState<any[]>([]);
  const [loaders, setLoaders] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [resourcePackCategories, setResourcePackCategories] = useState<any[]>([]);
  const [resourcePackFeatures, setResourcePackFeatures] = useState<any[]>([]);
  const [resourcePackResolutions, setResourcePackResolutions] = useState<any[]>([]);
  const [shaderCategories, setShaderCategories] = useState<any[]>([]);
  const [shaderFeatures, setShaderFeatures] = useState<any[]>([]);
  const [shaderPerformance, setShaderPerformance] = useState<any[]>([]);

  const [filtersLoading, setFiltersLoading] = useState(true);
  const [filtersError, setFiltersError] = useState<string | null>(null);
  const [versionSearch, setVersionSearch] = useState('');
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [showAllLoaders, setShowAllLoaders] = useState(false);

  useEffect(() => {
    setFiltersLoading(true);
    setFiltersError(null);

    Promise.all([
        fetch('https://api.modrinth.com/v2/tag/game_version'),
        fetch('https://api.modrinth.com/v2/tag/loader'),
        fetch('https://api.modrinth.com/v2/tag/category')
    ])
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(([gameVersionsData, loadersData, categoriesData]) => {
        setAllGameVersions(gameVersionsData.sort((a: any, b: any) => b.version.localeCompare(a.version, undefined, { numeric: true })));
        
        let loaderWhitelist: string[] = [];
        switch (projectType) {
          case 'mod': loaderWhitelist = MOD_LOADERS_ORDER; break;
          case 'shader': loaderWhitelist = SHADER_LOADERS_ORDER; break;
          case 'modpack': loaderWhitelist = MODPACK_LOADERS_ORDER; break;
          case 'plugin': loaderWhitelist = PLUGIN_LOADERS_ORDER; break;
          default: loaderWhitelist = []; break;
        }
        if (loaderWhitelist.length > 0) {
          const relevantLoaders = loadersData.filter((loader: any) => loaderWhitelist.includes(loader.name));
          relevantLoaders.sort((a: any, b: any) => loaderWhitelist.indexOf(a.name) - loaderWhitelist.indexOf(b.name));
          setLoaders(relevantLoaders);
        } else { setLoaders([]); }

        const uniqueCategoriesMap = new Map();
        categoriesData.forEach((cat: any) => { uniqueCategoriesMap.set(cat.name, cat); });
        const uniqueCategoriesData = Array.from(uniqueCategoriesMap.values());
        
        const filterAndSort = (whitelist: string[], data: any[]) => {
            const filtered = data.filter((cat: any) => whitelist.includes(cat.name));
            filtered.sort((a: any, b: any) => whitelist.indexOf(a.name) - whitelist.indexOf(b.name));
            return filtered;
        };
        
        setCategories([]);
        setResourcePackCategories([]); setResourcePackFeatures([]); setResourcePackResolutions([]);
        setShaderCategories([]); setShaderFeatures([]); setShaderPerformance([]);

        if (projectType === 'resourcepack') {
            setResourcePackCategories(filterAndSort(RP_CATEGORIES_ORDER, uniqueCategoriesData));
            setResourcePackFeatures(filterAndSort(RP_FEATURES_ORDER, uniqueCategoriesData));
            setResourcePackResolutions(filterAndSort(RP_RESOLUTIONS_ORDER, uniqueCategoriesData));
        } else if (projectType === 'datapack') {
            setCategories(filterAndSort(DATAPACK_CATEGORIES_ORDER, uniqueCategoriesData));
        } else if (projectType === 'shader') {
            setShaderCategories(filterAndSort(SHADER_CATEGORIES_ORDER, uniqueCategoriesData));
            setShaderFeatures(filterAndSort(SHADER_FEATURES_ORDER, uniqueCategoriesData));
            setShaderPerformance(filterAndSort(SHADER_PERFORMANCE_ORDER, uniqueCategoriesData));
        } else {
            setCategories(uniqueCategoriesData.filter((cat: any) => cat.project_type === projectType));
        }
        
        setFiltersLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch filter data:", error);
        setFiltersError("Could not load filters.");
        setFiltersLoading(false);
      });
  }, [projectType]);

  const displayedVersions = useMemo(() => {
    let versions = allGameVersions;
    if (!showAllVersions) versions = versions.filter(v => v.version_type === 'release');
    if (versionSearch) versions = versions.filter(v => v.version.toLowerCase().includes(versionSearch.toLowerCase()));
    return versions;
  }, [allGameVersions, showAllVersions, versionSearch]);

  const formatResolutionName = (name: string) => {
    if (name.includes('-or-lower')) return name.replace('-or-lower', ' or lower');
    if (name.includes('-or-higher')) return name.replace('-or-higher', ' or higher');
    return name;
  };

  if (filtersError) { return <div className="sidebar-block" style={{ color: '#ff8080', padding: '15px' }}>{filtersError}</div>; }
  
  return (
    <>
      <FilterBlock title="Game version" isLoading={filtersLoading}>
        {!filtersLoading && (
          <>
            <div className="filter-search-wrapper">
                <FaSearch />
                <input type="search" placeholder="Search..." className="sidebar-search" value={versionSearch} onChange={e => setVersionSearch(e.target.value)} />
            </div>
            <div className="filter-list scrollable">
              {displayedVersions.map(v => (
                <button key={v.version} className={`filter-item ${selectedVersions.includes(v.version) ? 'active' : ''}`} onClick={() => onVersionToggle(v.version)}>
                    <span className="filter-item-text">{v.version}</span>
                    {selectedVersions.includes(v.version) && <FaCheck className="filter-item-check" />}
                </button>
              ))}
            </div>
            <label className="show-all-toggle">
                <input type="checkbox" className="custom-checkbox-input" checked={showAllVersions} onChange={() => setShowAllVersions(!showAllVersions)} />
                <span className="custom-checkbox-visual"><FaCheck /></span>
                <span className="checkbox-label-text">Show all versions</span>
            </label>
          </>
        )}
      </FilterBlock>

      {!filtersLoading && loaders.length > 0 && (
        <FilterBlock title="Loader">
          <div className="filter-list">
              {(showAllLoaders ? loaders : loaders.slice(0, 4)).map(loader => (
                  <button key={loader.name} className={`filter-item ${selectedLoaders.includes(loader.name) ? 'active' : ''}`} onClick={() => onLoaderToggle(loader.name)}>
                      {loader.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: loader.icon }} />}
                      <span className="filter-item-text">{loader.name.charAt(0).toUpperCase() + loader.name.slice(1)}</span>
                      {selectedLoaders.includes(loader.name) && <FaCheck className="filter-item-check" />}
                  </button>
              ))}
              {loaders.length > 4 && (
                  <button className="show-more-button" onClick={() => setShowAllLoaders(!showAllLoaders)}>
                      {showAllLoaders ? <FaChevronUp /> : <FaChevronDown />}
                      {showAllLoaders ? 'Show less' : 'Show fewer'}
                  </button>
              )}
          </div>
        </FilterBlock>
      )}
      
      {!filtersLoading && projectType === 'resourcepack' ? (
        <>
          <FilterBlock title="Categories"><div className="filter-list">{resourcePackCategories.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
          <FilterBlock title="Features"><div className="filter-list">{resourcePackFeatures.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
          <FilterBlock title="Resolutions"><div className="filter-list">{resourcePackResolutions.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}><span className="filter-item-text">{formatResolutionName(cat.name)}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
        </>
      ) : !filtersLoading && projectType === 'shader' ? (
        <>
          <FilterBlock title="Categories"><div className="filter-list">{shaderCategories.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
          <FilterBlock title="Features"><div className="filter-list">{shaderFeatures.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
          <FilterBlock title="Performance impact"><div className="filter-list">{shaderPerformance.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
        </>
      ) : (
        !filtersLoading && categories.length > 0 && (
          <FilterBlock title="Categories"><div className="filter-list">{categories.map(cat => (<button key={cat.name} className={`filter-item ${selectedCategories.includes(cat.name) ? 'active' : ''}`} onClick={() => onCategoryToggle(cat.name)}>{cat.icon && <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: cat.icon }} />}<span className="filter-item-text">{cat.name}</span>{selectedCategories.includes(cat.name) && <FaCheck className="filter-item-check" />}</button>))}</div></FilterBlock>
        )
      )}
      
      <FilterBlock title="Environment">
         <div className="filter-list">
             <button className={`filter-item ${selectedEnvironments.includes('client') ? 'active' : ''}`} onClick={() => onEnvironmentToggle('client')}>
                <FaDesktop /> <span className="filter-item-text">Client</span>
                {selectedEnvironments.includes('client') && <FaCheck className="filter-item-check" />}
            </button>
             <button className={`filter-item ${selectedEnvironments.includes('server') ? 'active' : ''}`} onClick={() => onEnvironmentToggle('server')}>
                <FaServer /> <span className="filter-item-text">Server</span>
                {selectedEnvironments.includes('server') && <FaCheck className="filter-item-check" />}
            </button>
        </div>
      </FilterBlock>
    </>
  );
}

// --- СТРАНИЦА ДЕТАЛЬНОГО ПРОСМОТРА ПРОЕКТА ---

function ProjectPage() {
  const navigate = useNavigate();
  const { projectSlug } = useParams<{ projectSlug: string }>();
  
  const [project, setProject] = useState<any>(null);
  const [bodyHtml, setBodyHtml] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [allLoaders, setAllLoaders] = useState<any[]>([]);

  const { FaCrown } = FaIcons;

  useEffect(() => {
    fetch('https://api.modrinth.com/v2/tag/loader')
      .then(r => r.json())
      .then(data => Array.isArray(data) && setAllLoaders(data))
      .catch(e => console.error("Failed to fetch all loaders:", e));
  }, []);

  // --- НОВЫЙ КОД: Находим иконку Rift с помощью useMemo ---
  const riftIconSvg = useMemo(() => {
      const riftLoader = allLoaders.find(loader => loader.name === 'rift');
      return riftLoader ? riftLoader.icon : null;
  }, [allLoaders]);

  useEffect(() => {
    if (projectSlug) {
        const isBannedByExactMatch = BANNED_EXACT_SLUGS.includes(projectSlug);
        const isBannedByKeyword = BANNED_SLUG_KEYWORDS.some(keyword => projectSlug.includes(keyword));

        if (isBannedByExactMatch || isBannedByKeyword) {
            navigate('/mods', { replace: true });
            return;
        }
    }

    setLoading(true);
    setError(undefined);
    setProject(null);
    setVersions([]);
    setTeamMembers([]);
    setActiveTab('description'); 
    
    Promise.all([
        fetch(`https://api.modrinth.com/v2/project/${projectSlug}`),
        fetch(`https://api.modrinth.com/v2/project/${projectSlug}/version`)
    ])
    .then(async ([projectRes, versionsRes]) => {
        if (!projectRes.ok) {
            throw new Error('Project not found');
        }
        const projectData = await projectRes.json();
        const versionData = versionsRes.ok ? await versionsRes.json() : [];

        let teamMembersData: any[] = [];
        if (projectData.team) {
            try {
                const teamRes = await fetch(`https://api.modrinth.com/v2/team/${projectData.team}/members`);
                if (teamRes.ok) {
                    teamMembersData = await teamRes.json();
                }
            } catch (teamError) {
                console.error("Failed to fetch team members:", teamError);
            }
        }
        
        return { projectData, versionData, teamMembersData };
    })
    .then(({ projectData, versionData, teamMembersData }) => {
        setProject(projectData);
        setTeamMembers(teamMembersData);
        
        const sortedVersions = versionData.sort((a: any, b: any) => 
            new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
        );
        setVersions(sortedVersions);

        const converter = new showdown.Converter();
        const rawHtml = converter.makeHtml(projectData.body);
        
        const moderatedHtml = moderateHtmlString(rawHtml);
        setBodyHtml(moderatedHtml);
        
        setLoading(false);
    })
    .catch(e => {
        setError(`Ошибка: ${e.message}`);
        setLoading(false);
    });
  }, [projectSlug, navigate]);

  const processedGameVersions = useMemo(() => {
    if (!project?.game_versions) return [];
    return groupGameVersions(project.game_versions, { useXNotation: true });
  }, [project?.game_versions]);
  
  const getLoaderIcon = (loaderName: string) => {
    if (allLoaders.length === 0) return null;
    const loader = allLoaders.find(l => l.name.toLowerCase() === loaderName.toLowerCase());
    return loader ? loader.icon : null;
  };

  const sortedTeamMembers = useMemo(() => {
    if (!teamMembers || teamMembers.length === 0) return [];
    return [...teamMembers].sort((a, b) => {
      const isAOwner = a.role.toLowerCase() === 'owner';
      const isBOwner = b.role.toLowerCase() === 'owner';
      if (isAOwner && !isBOwner) return -1;
      if (!isAOwner && isBOwner) return 1;
      return a.role.localeCompare(b.role);
    });
  }, [teamMembers]);

  if (loading) return <div className="mod-page-container">Загрузка…</div>;
  if (error || !project) return <div className="mod-page-container" style={{color:'red'}}>{error ?? 'Проект не найден'}</div>;

  const isClientSupported = project.client_side !== 'unsupported';
  const isServerSupported = project.server_side !== 'unsupported';

  return (
    <>
      <div className="mod-page-container">
        <header className="mod-page-main-header">
            {/* --- ИЗМЕНЕНИЕ: Логика для запасной иконки --- */}
            {project.icon_url ? (
                <ModeratedImage src={project.icon_url} alt="" className="mod-header-icon" />
            ) : (
                <span 
                    className="mod-header-icon fallback-icon" 
                    dangerouslySetInnerHTML={{ __html: riftIconSvg || '' }}
                />
            )}
            {/* --- КОНЕЦ ИЗМЕНЕНИЯ --- */}

          <div className="mod-header-info">
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>
          <div className="mod-actions">
            <button onClick={() => setIsModalOpen(true)} className="action-button primary"><FaDownload /> Download</button>
          </div>
          <div className="mod-stats">
            <span><FaDownload /> {formatNumber(project.downloads)}</span>
            <span className="divider">|</span>
            <span><FaHeart /> {formatNumber(project.followers)}</span>
          </div>
        </header>

        <div className="mod-page-layout">
          <main className="mod-page-content">
            <nav className="mod-page-nav">
              <button className={`nav-tab ${activeTab === 'description' ? 'active' : ''}`} onClick={() => setActiveTab('description')}>Description</button>
              {project.gallery && project.gallery.length > 0 && (
                <button className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`} onClick={() => setActiveTab('gallery')}>Gallery</button>
              )}
              <button className={`nav-tab ${activeTab === 'changelog' ? 'active' : ''}`} onClick={() => setActiveTab('changelog')}>Changelog</button>
              <button className={`nav-tab ${activeTab === 'versions' ? 'active' : ''}`} onClick={() => setActiveTab('versions')}>Versions</button>
            </nav>
            {activeTab === 'description' && (
              <div className="mod-body-container">
                <div className="mod-body-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
              </div>
            )}
            {activeTab === 'gallery' && <GalleryTab gallery={project.gallery} onImageClick={url => setSelectedImageUrl(url)} />}
            {activeTab === 'changelog' && <ChangelogTab versions={versions} />}
            {activeTab === 'versions' && <VersionsTab versions={versions} />}
          </main>
          <aside className="mod-page-sidebar">
            <div className="info-card">
              <h3 className="info-card-title">Compatibility</h3>
              <h4>Minecraft: Java Edition</h4>
              <div className="info-tag-list">
                {processedGameVersions.map((v:string) => <span key={v} className="info-tag">{v}</span>)}
              </div>
              
              <h4>Platforms</h4>
              <div className="info-tag-list">
                {project.loaders?.map((loaderName:string) => {
                  const iconSvg = getLoaderIcon(loaderName);
                  return (
                    <span key={loaderName} className="info-tag platform" data-loader={loaderName}>
                      {iconSvg ? (
                        <span className="filter-item-icon" dangerouslySetInnerHTML={{ __html: iconSvg }} />
                      ) : (
                        <FaWrench />
                      )}
                      {loaderName.charAt(0).toUpperCase() + loaderName.slice(1)}
                    </span>
                  );
                })}
              </div>
              
              <h4>Supported environments</h4>
              <div className="info-tag-list">
                {isClientSupported && isServerSupported ? (
                  <span className="info-tag">
                    <FaGlobe /> Client & Server
                  </span>
                ) : isClientSupported ? (
                  <span className="info-tag">
                    <FaDesktop /> Client-side
                  </span>
                ) : isServerSupported ? (
                  <span className="info-tag">
                    <FaServer /> Server-side
                  </span>
                ) : null}
              </div>
            </div>

            <div className="info-card">
                <h3 className="info-card-title">Links</h3>
                <ul className="links-list">
                    {project.issues_url && <li><a href={project.issues_url}><FaExclamationTriangle /> Report issues</a></li>}
                    {project.source_url && <li><a href={project.source_url}><FaCode /> View source</a></li>}
                    {project.wiki_url && <li><a href={project.wiki_url}><FaBook /> Visit wiki</a></li>}
                    {project.discord_url && <li><a href={project.discord_url}><FaUserFriends /> Join Discord</a></li>}
                </ul>
            </div>
            
            <div className="info-card">
                <h3 className="info-card-title">Creators</h3>
                <ul className="creators-list">
                    {sortedTeamMembers.length > 0 ? (
                      sortedTeamMembers.map((member:any) => (
                          <li key={member.user.id}>
                              <ModeratedImage src={member.user.avatar_url} alt={member.user.username} />
                              <div>
                                  <div className="creator-name">
                                    <span>{member.user.username}</span>
                                    {member.role.toLowerCase() === 'owner' && <FaCrown className="owner-crown" />}
                                  </div>
                                  <small>{member.role}</small>
                              </div>
                          </li>
                      ))
                    ) : (
                        <li>
                            <div className="avatar-placeholder"><FaUser /></div>
                            <div>
                                <div className="creator-name">
                                    <span>{project.author}</span>
                                    <FaCrown className="owner-crown" />
                                </div>
                                <small>Owner</small>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
          </aside>
        </div>
      </div>
      <DownloadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        project={project}
        files={versions}
      />
      <ImageModal 
        isOpen={!!selectedImageUrl}
        imageUrl={selectedImageUrl}
        onClose={() => setSelectedImageUrl(null)}
      />
    </>
  );
}
// --- КОМПОНЕНТЫ-ВКЛАДКИ ДЛЯ СТРАНИЦЫ ПРОЕКТА ---

function GalleryTab({ gallery, onImageClick }: { gallery: any[], onImageClick: (url: string) => void }) {
  if (!gallery || gallery.length === 0) {
    return <div className="tab-content gallery-tab-empty">No images to display.</div>;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="gallery-grid">
      {gallery.map(image => (
        <div key={image.url} className="gallery-card">
          <ModeratedImage 
            src={image.url} 
            alt={censorText(image.title)} 
            className="gallery-card-image"
            onClick={() => !BANNED_IMAGE_URLS.includes(image.url) && onImageClick(image.url)}
          />
          <div className="gallery-card-body">
            <h3>{censorText(image.title)}</h3>
            <p>{censorText(image.description)}</p>
            <div className="gallery-card-meta">
              <FaCalendarAlt />
              <span>{formatDate(image.created)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChangelogTab({ versions }: { versions: any[] }) {
  const converter = new showdown.Converter();
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedVersionId, setExpandedVersionId] = useState<string | null>(null);
  const VERSIONS_PER_PAGE = 10;

  useEffect(() => {
    if (versions.length > 0 && !expandedVersionId) {
      setExpandedVersionId(versions[0].id);
    }
  }, [versions, expandedVersionId]);

  const totalPages = Math.ceil(versions.length / VERSIONS_PER_PAGE);
  const currentVersions = versions.slice(
    currentPage * VERSIONS_PER_PAGE,
    (currentPage + 1) * VERSIONS_PER_PAGE
  );
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  if (versions.length === 0) return <div className="tab-content changelog-empty">Loading versions...</div>;

  return (
    <div className="tab-content changelog-container">
      <div className="changelog-list">
        {currentVersions.map((version, index) => {
          const versionType = version.version_type?.[0].toUpperCase();
          return (
            <div 
              key={version.id} 
              className={`changelog-item ${version.id === expandedVersionId ? 'expanded' : ''}`}
              onClick={() => setExpandedVersionId(version.id === expandedVersionId ? null : version.id)}
            >
              <div className="timeline">
                <div className="timeline-dot" data-type={versionType}></div>
                {index < currentVersions.length - 1 && (
                  <div className="timeline-line" data-type={versionType}></div>
                )}
              </div>
              <div className="changelog-content">
                <div className="changelog-header">
                  <h3>{version.name}</h3>
                  <span className="meta-text">on {formatDate(version.date_published)}</span>
                </div>
                <div className="changelog-body" dangerouslySetInnerHTML={{ __html: converter.makeHtml(version.changelog) }} />
              </div>
              <a href={version.files[0]?.url} className="changelog-download-button" onClick={e => e.stopPropagation()} download>
                <FaDownload />
                <span>Download</span>
              </a>
            </div>
          )
        })}
      </div>
      {totalPages > 1 && (
        <div className="changelog-tab-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

function VersionsTab({ versions }: { versions: any[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const VERSIONS_PER_PAGE = 20;

  const totalPages = Math.ceil(versions.length / VERSIONS_PER_PAGE);
  const currentVersions = versions.slice(
    currentPage * VERSIONS_PER_PAGE,
    (currentPage + 1) * VERSIONS_PER_PAGE
  );
  
  useEffect(() => {
    setCurrentPage(0);
  }, [versions]);

  if (versions.length === 0) return <div className="tab-content versions-container">Loading versions...</div>;

  return (
    <div className="tab-content versions-tab">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Game version</th>
            <th>Platforms</th>
            <th>Published</th>
            <th>Downloads</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentVersions.map(version => {

            const stableVersions = version.game_versions.filter((v: string) => /^\d+\.\d+(\.\d+)?$/.test(v));
            const snapshotVersions = version.game_versions.filter((v: string) => !/^\d+\.\d+(\.\d+)?$/.test(v));

            const groupedStable = groupGameVersions(stableVersions, { useXNotation: true });

            const allDisplayVersions = [...snapshotVersions, ...groupedStable];

            return (
              <tr key={version.id}>
                <td>
                  <div className="file-info">
                    <span className="file-status-indicator" data-type={version.version_type?.[0].toUpperCase()}>
                      {version.version_type?.[0].toUpperCase()}
                    </span>
                    <div className="file-text-content">
                      <div className="file-name">{version.name}</div>
                      <small>{version.version_number}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="info-tag-list">
                    {allDisplayVersions.map(v_group => (
                      <span key={v_group} className="info-tag">{v_group}</span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="info-tag-list">
                    {version.loaders.map((l: string) => <span key={l} className="info-tag">{l}</span>)}
                  </div>
                </td>
                <td>{timeAgo(version.date_published)}</td>
                <td>{formatNumber(version.downloads)}</td>
                <td>
                  <div className="file-actions">
                    <a href={version.files[0]?.url} className="icon-button" download><FaDownload /></a>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="versions-tab-footer">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

// --- УНИВЕРСАЛЬНЫЙ КОМПОНЕНТ ПАГИНАЦИИ ---

function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  const pages = useMemo(() => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5; 
    
    if (totalPages <= maxVisiblePages + 2) { 
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        let startPage = Math.max(2, currentPage + 1 - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages - 1, currentPage + 1 + Math.floor(maxVisiblePages / 2));
        if (currentPage + 1 < maxVisiblePages) {
            startPage = 2;
            endPage = maxVisiblePages;
        } else if (currentPage + 1 > totalPages - maxVisiblePages + 1) {
            startPage = totalPages - maxVisiblePages + 1;
            endPage = totalPages - 1;
        }
        if (startPage > 2) pageNumbers.push('...');
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }
    return pageNumbers;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button 
        className="page-number control"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        <FaChevronLeft />
      </button>
      {pages.map((page, index) => 
        typeof page === 'number' ? (
          <button
            key={`${page}-${index}`}
            className={`page-number ${currentPage + 1 === page ? 'active' : ''}`}
            onClick={() => onPageChange(page - 1)}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${index}`} className="page-number ellipsis">...</span>
        )
      )}
      <button 
        className="page-number control"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage + 1 === totalPages}
      >
        <FaChevronRight />
      </button>
    </div>
  );
}

// --- КОМПОНЕНТЫ МОДАЛЬНЫХ ОКОН ---

const CustomSelector = ({ label, icon, options, selected, onChange, searchable = false, searchPlaceholder = 'Search...', disabled = false, showAllToggle }: { label: string, icon: React.ReactNode, options: string[], selected: string, onChange: (v: string) => void, searchable?: boolean, searchPlaceholder?: string, disabled?: boolean, showAllToggle?: { checked: boolean, onChange: (c: boolean) => void } }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOptions = searchable ? options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())) : options;

    // Открываем селектор версий по умолчанию
    useEffect(() => {
        if (label === "Game version") {
            setIsOpen(true);
        }
    }, [label]);

    return (
        <div className="custom-select-container">
            <button className={`custom-select-button ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`} onClick={() => !disabled && setIsOpen(!isOpen)}>
                <span>{icon} {label}: {selected || 'Select...'}</span>
                {!disabled && <FaChevronUp className={`chevron ${isOpen ? 'open' : ''}`} />}
            </button>
            <div className={`custom-select-dropdown ${isOpen && !disabled ? 'open' : ''}`}>
                <div className="dropdown-content-wrapper">
                    {searchable && (
                        <div className="dropdown-search-box">
                            <FaSearch />
                            <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                    )}
                    <div className="options-list">
                        {filteredOptions.map(opt => (
                            <button key={opt} className={`option-button ${selected === opt ? 'selected' : ''}`}
                                onClick={() => {
                                    onChange(opt);
                                    if (label === "Game version") setIsOpen(false); // Сворачиваем только селектор версий
                                }}>
                                {opt} {selected === opt && <FaCheck />}
                            </button>
                        ))}
                    </div>
                    {showAllToggle && (
                        <div className="dropdown-footer">
                            <label className="show-all-toggle">
                                <input 
                                    type="checkbox" 
                                    className="custom-checkbox-input" 
                                    checked={showAllToggle.checked} 
                                    onChange={e => showAllToggle.onChange(e.target.checked)} 
                                />
                                <span className="custom-checkbox-visual"><FaCheck /></span>
                                <span className="checkbox-label-text">Show all versions</span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function DownloadModal({ isOpen, onClose, project, files }: { isOpen: boolean, onClose: () => void, project: any, files: any[] }) {
  const [selectedLoader, setSelectedLoader] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const allUniqueVersions = useMemo(() => Array.from(new Set(files.flatMap(f => f.game_versions)))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true })), [files]);
      
  const versionsToShow = useMemo(() => showAllVersions ? allUniqueVersions : allUniqueVersions.filter(v => /^\d+\.\d+(\.\d+)?$/.test(v)), [allUniqueVersions, showAllVersions]);
    
  const allLoaders = useMemo(() => Array.from(new Set(files.flatMap(f => f.loaders))), [files]);

  useEffect(() => {
    if (isOpen && files.length > 0) {
      if (allLoaders.length > 0) setSelectedLoader(prev => allLoaders.includes(prev) ? prev : allLoaders[0]);
      if (versionsToShow.length > 0) setSelectedVersion(prev => versionsToShow.includes(prev) ? prev : versionsToShow[0]);
    }
  }, [isOpen, files, allLoaders, versionsToShow]);

  const matchingFiles = useMemo(() => files.filter(file => 
    file.loaders.includes(selectedLoader) && file.game_versions.includes(selectedVersion)
  ), [files, selectedLoader, selectedVersion]);
  
  const targetFile = matchingFiles.length > 0 ? matchingFiles[0] : null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen && !isClosing) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          {project.icon_url ? (
            <div className="modal-header-icon">
              <ModeratedImage src={project.icon_url} alt="" />
            </div>
          ) : (
            <div className="modal-header-icon placeholder" style={{ backgroundColor: '#2c2c2c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FaBoxOpen /> {/* Placeholder Icon */}
            </div>
          )}
          <h2>Download {project.title}</h2>
          <button className="modal-close-button" onClick={handleClose}><FaTimes /></button>
        </div>
        <div className="modal-body">
            <CustomSelector 
                label="Game version" 
                icon={<FaGamepad />}
                options={versionsToShow}
                selected={selectedVersion}
                onChange={setSelectedVersion}
                searchable={true}
                searchPlaceholder="Search game versions..."
                showAllToggle={{ checked: showAllVersions, onChange: setShowAllVersions }}
            />
            <CustomSelector 
                label="Platform"
                icon={<FaWrench />}
                options={allLoaders}
                selected={selectedLoader}
                onChange={setSelectedLoader}
                disabled={allLoaders.length <= 1}
            />
            {targetFile ? (
                <div className="file-result-row">
                    <div className="file-info">
                        <span className="file-status-indicator" data-type={targetFile.version_type?.[0].toUpperCase()}>{targetFile.version_type?.[0].toUpperCase()}</span>
                        <div className="file-text-content">
                            <div className="file-name">{targetFile.name}</div>
                            <div className="file-meta">
                                [{targetFile.game_versions.join(', ')}] {targetFile.loaders.join(', ')}
                            </div>
                        </div>
                    </div>
                    <div className="file-actions">
                        <a href={targetFile.files[0].url} className="file-download-button" download>
                            <FaDownload /> Download
                        </a>
                    </div>
                </div>
            ) : (
                <div className="file-result-row not-found">
                <span>No file found for the selected criteria.</span>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

function ImageModal({ isOpen, imageUrl, onClose }: { isOpen: boolean, imageUrl: string | null, onClose: () => void }) {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };
  
  if (!isOpen && !isClosing) return null;

  return (
    <div className={`image-modal-overlay ${isOpen ? 'open' : ''} ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
        <button className="image-modal-close-button" onClick={handleClose}><FaTimes /></button>
        <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            {imageUrl && <ModeratedImage src={imageUrl} alt="Gallery view" className="image-modal-image" />}
        </div>
    </div>
  );
}

// --- FOOTER ---

import { FaLock } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        
        <img 
          src="src/assets/RuModrinth_logo_full.png" 
          alt="RuModrinth Logo" 
          className="footer-logo-main"
        />
        <p className="footer-description">
          Удобный интерфейс для взаимодействия с API Modrinth.<br/>
          RuModrinth - не сервис и не прокси.
        </p>

        <div className="footer-meta">
          <div className="footer-meta-links">
            <a><FaLock /> Все права на Minecraft принадлежат Mojang Studios</a>
          </div>
        </div>

        <div className="footer-disclaimer">
          <p>NOT AN OFFICIAL MINECRAFT SERVICE. NOT APPROVED BY OR ASSOCIATED WITH MOJANG OR MICROSOFT.</p>
        </div>

      </div>
    </footer>
  );
}

export default App;