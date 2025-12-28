// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { Header, Footer } from './components/Layout';
import { ProjectListPage } from './pages/ProjectListPage';
import { ProjectPage } from './pages/ProjectPage';
import { PROJECT_TYPE_PATHS } from './constants';

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

export default App;
