import { useState, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { FaSyncAlt, FaChevronUp, FaChevronDown, FaSearch, FaCheck, FaDesktop, FaServer } from 'react-icons/fa';

const FilterBlock = ({ title, children, isLoading = false }: { title: string, children: ReactNode, isLoading?: boolean }) => {
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

export function FilterMenu({
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
        fetch(`${API_BASE_URL}/tag/game_version`),
        fetch(`${API_BASE_URL}/tag/loader`),
        fetch(`${API_BASE_URL}/tag/category`)
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
