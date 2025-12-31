import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import showdown from 'showdown';
import { 
    FaDownload, FaHeart, FaExclamationTriangle, FaCode, FaBook, 
    FaUserFriends, FaGlobe, FaDesktop, FaServer, FaWrench, FaCrown, FaUser 
} from 'react-icons/fa';

import { ModeratedImage } from '../components/Common';
import { DownloadModal, ImageModal } from '../components/Modals';
import { GalleryTab, ChangelogTab, VersionsTab } from '../components/ProjectTabs';
import { BANNED_EXACT_SLUGS, BANNED_SLUG_KEYWORDS } from '../constants';
import { moderateHtmlString, groupGameVersions, formatNumber } from '../utils';
import { API_BASE_URL } from '../constants';
import { ModernLoader, ErrorDisplay } from '../components/StatusMessages';

export function ProjectPage() {
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

  useEffect(() => {
    fetch(`${API_BASE_URL}/tag/loader`)
      .then(r => r.json())
      .then(data => Array.isArray(data) && setAllLoaders(data))
      .catch(e => console.error("Failed to fetch all loaders:", e));
  }, []);

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
        fetch(`${API_BASE_URL}/project/${projectSlug}`),
        fetch(`${API_BASE_URL}/project/${projectSlug}/version`)
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
                const teamRes = await fetch(`${API_BASE_URL}/team/${projectData.team}/members`);
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

        const converter = new showdown.Converter({
          tables: true,
          strikethrough: true,
          tasklists: true,
          simpleLineBreaks: true,
          ghCompatibleHeaderId: true
        });
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

  if (loading) {
      return (
          <div className="mod-page-container" style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
              <ModernLoader />
          </div>
      );
  }

  if (error || !project) {
      return (
          <div className="mod-page-container">
              <ErrorDisplay message={error || 'Проект не найден'} onRetry={() => window.location.reload()} />
          </div>
      );
  }

  const isClientSupported = project.client_side !== 'unsupported';
  const isServerSupported = project.server_side !== 'unsupported';

  return (
    <>
      <div className="mod-page-container">
        <header className="mod-page-main-header">
            {project.icon_url ? (
                <ModeratedImage src={project.icon_url} alt="" className="mod-header-icon" />
            ) : (
                <span 
                    className="mod-header-icon fallback-icon" 
                    dangerouslySetInnerHTML={{ __html: riftIconSvg || '' }}
                />
            )}

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
