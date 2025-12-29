import React, { useEffect, useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaGlobe, FaBook, FaCogs, FaDownload, FaHeart, FaSyncAlt } from 'react-icons/fa';

import { MainLayout } from '../components/Layout';
import { FilterMenu } from '../components/FilterMenu';
import { Pagination, ModeratedImage } from '../components/Common';
import { PROJECT_TYPES, PROJECT_TYPE_PATHS, PROJECT_TYPE_LABELS, BANNED_KEYWORDS } from '../constants';
import { formatNumber, timeAgo } from '../utils';
import { API_BASE_URL } from '../constants';
import { ModernLoader, ErrorDisplay } from '../components/StatusMessages';

export function ProjectListPage() {
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
        setError(undefined);
        
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

        fetch(`${API_BASE_URL}/search?${params}`)
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

    const handleRetry = () => {
        setLoading(true);
        setError(undefined);

        setPage(prev => (prev === 0 ? 0 : 0)); 

        window.location.reload();
    };

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

            {/* ОТОБРАЖЕНИЕ ОШИБКИ */}
            {error && (
                <ErrorDisplay 
                    message={error} 
                    onRetry={handleRetry}
                />
            )}
      
            <div className="mods-list-wrapper">
                {/* ОТОБРАЖЕНИЕ ЗАГРУЗКИ */}
                {loading && (
                    <div className={projects.length > 0 ? "loading-overlay" : "initial-loading-container"}>
                        {/* Если это первая загрузка, показываем полный лоадер с текстом */}
                        {projects.length === 0 ? (
                            <ModernLoader />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                                <FaSyncAlt className="spinner" />
                            </div>
                        )}
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
