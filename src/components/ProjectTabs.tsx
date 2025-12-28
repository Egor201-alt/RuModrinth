// src/components/ProjectTabs.tsx
import React, { useState, useEffect, useMemo } from 'react';
import showdown from 'showdown';
import { FaDownload, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ModeratedImage, Pagination } from './Common';
import { censorText, timeAgo, groupGameVersions, formatNumber, BANNED_IMAGE_URLS } from '../utils'; // Импортируем утилиты

export function GalleryTab({ gallery, onImageClick }: { gallery: any[], onImageClick: (url: string) => void }) {
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
                <svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2" />
                </svg>
              <span>{formatDate(image.created)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChangelogTab({ versions }: { versions: any[] }) {
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

export function VersionsTab({ versions }: { versions: any[] }) {
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
