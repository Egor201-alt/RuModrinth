// src/components/Layout.tsx
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ProjectIcon } from './Common';
import { FaLock } from 'react-icons/fa';

const NAVIGATION_LINKS = [
  { key: 'mods',          label: 'Mods' },
  { key: 'resourcepacks', label: 'Resource Packs' },
  { key: 'datapacks',     label: 'Data Packs' },
  { key: 'shaders',       label: 'Shaders' },
  { key: 'modpacks',      label: 'Modpacks' },
  { key: 'plugins',       label: 'Plugins' },
];

export function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo-link">
          <img src="src/assets/RuModrinth_logo_full.png" alt="RuModrinth" className="logo-full-image" />
        </Link>
        <nav className="header-nav">
          {NAVIGATION_LINKS.map(link => (
            <NavLink key={link.key} to={`/${link.key}`} className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}>
              <ProjectIcon projectType={link.key} />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function function Footer() {
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

export function MainLayout({ sidebar, children }: { sidebar: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <aside className="sidebar">{sidebar}</aside>
      <section className="main-content">{children}</section>
    </div>
  );
}
