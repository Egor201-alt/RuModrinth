import { useState, useEffect, useMemo } from 'react';
import { FaDownload, FaTimes, FaBoxOpen, FaGamepad, FaWrench } from 'react-icons/fa';
import { ModeratedImage, CustomSelector } from './Common';

export function DownloadModal({ isOpen, onClose, project, files }: { isOpen: boolean, onClose: () => void, project: any, files: any[] }) {
  const [selectedLoader, setSelectedLoader] = useState<string>('');
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const allUniqueVersions = useMemo(() => Array.from(new Set(files.flatMap(f => f.game_versions)))
      .sort((a: any, b: any) => b.localeCompare(a, undefined, { numeric: true })), [files]);
      
  const versionsToShow = useMemo(() => showAllVersions ? allUniqueVersions : allUniqueVersions.filter((v: any) => /^\d+\.\d+(\.\d+)?$/.test(v)), [allUniqueVersions, showAllVersions]);
    
  const allLoaders = useMemo(() => Array.from(new Set(files.flatMap(f => f.loaders))), [files]);

  useEffect(() => {
    if (isOpen && files.length > 0) {
      if (allLoaders.length > 0) setSelectedLoader(prev => allLoaders.includes(prev as string) ? prev as string : allLoaders[0] as string);
      if (versionsToShow.length > 0) setSelectedVersion(prev => versionsToShow.includes(prev as string) ? prev as string : versionsToShow[0] as string);
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
                options={versionsToShow as string[]}
                selected={selectedVersion}
                onChange={setSelectedVersion}
                searchable={true}
                searchPlaceholder="Search game versions..."
                showAllToggle={{ checked: showAllVersions, onChange: setShowAllVersions }}
            />
            <CustomSelector 
                label="Platform"
                icon={<FaWrench />}
                options={allLoaders as string[]}
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

export function ImageModal({ isOpen, imageUrl, onClose }: { isOpen: boolean, imageUrl: string | null, onClose: () => void }) {
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
