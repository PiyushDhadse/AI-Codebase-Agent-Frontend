import { useState, useEffect } from "react";
import { FolderGit2, ChevronDown, CheckCircle, Database } from "lucide-react";

export const RepoSelector = ({ selectedRepo, onSelect, apiHost = "http://127.0.0.1:8000" }) => {
  const [repos, setRepos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchRepos = async () => {
    try {
      const res = await fetch(`${apiHost}/api/repos`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repos || []);
      }
    } catch (err) {
      console.error("Failed to fetch repos", err);
    }
  };

  useEffect(() => {
    fetchRepos();
    const interval = setInterval(fetchRepos, 5000);
    return () => clearInterval(interval);
  }, []); // Only runs on mount

  // Handle auto-selection only when repos are loaded and NO repo is currently selected
  useEffect(() => {
    if (repos.length > 0 && !selectedRepo) {
      const firstIngested = repos.find(r => r.ingested);
      if (firstIngested) {
        onSelect(firstIngested.name);
      } else {
        // If none ingested, pick first literal one
        onSelect(repos[0].name);
      }
    }
  }, [repos, selectedRepo, onSelect]);

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-11 px-4 bg-[#2c2c2e] hover:bg-[#323235] border border-[#38383a] rounded-xl flex items-center justify-between transition-colors shadow-sm"
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <FolderGit2 size={16} className="text-[#0a84ff] shrink-0" />
          <span className="text-[14px] font-medium text-white truncate">
            {selectedRepo || "Select Repository..."}
          </span>
        </div>
        <ChevronDown size={14} className={`text-[#8e8e93] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-[#1c1c1e] border border-[#38383a] rounded-xl shadow-2xl z-50 max-h-[300px] overflow-y-auto custom-scrollbar overflow-hidden py-1">
            {repos.length === 0 ? (
              <div className="p-3 text-center text-[13px] text-[#8e8e93]">
                No repositories found.
              </div>
            ) : (
              repos.map((repo) => (
                <div 
                  key={repo.name}
                  onClick={() => {
                    onSelect(repo.name);
                    setIsOpen(false);
                  }}
                  className={`px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#2c2c2e] transition-colors ${selectedRepo === repo.name ? "bg-[#2c2c2e]" : ""}`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <span className={`text-[14px] font-medium truncate ${selectedRepo === repo.name ? "text-[#0a84ff]" : "text-white"}`}>
                      {repo.name}
                    </span>
                  </div>
                  {repo.ingested ? (
                    <CheckCircle size={14} className="text-[#30d158] shrink-0" />
                  ) : (
                    <Database size={14} className="text-[#8e8e93] shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};
