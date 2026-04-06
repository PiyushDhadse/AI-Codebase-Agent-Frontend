import { useState, useEffect } from "react";
import { Folder, Database, LoaderCircle, CheckCircle } from "lucide-react";

export const LocalRepoList = ({ onRepoSelect, apiHost = "http://127.0.0.1:8000" }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ingestingRepo, setIngestingRepo] = useState(null);

  const fetchRepos = async () => {
    try {
      const res = await fetch(`${apiHost}/api/repos`);
      if (res.ok) {
        const data = await res.json();
        setRepos(data.repos || []);
      }
    } catch (err) {
      console.error("Failed to fetch repos", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
    const interval = setInterval(fetchRepos, 5000); // Polling for updates
    return () => clearInterval(interval);
  }, []);

  const handleIngestLocal = async (repoName) => {
    setIngestingRepo(repoName);
    try {
      const res = await fetch(`${apiHost}/api/ingest-local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_name: repoName }),
      });
      if (res.ok) {
        // Will be updated on the next polling cycle
        setTimeout(fetchRepos, 1000);
      }
    } catch (err) {
      console.error("Failed to ingest local repo", err);
    } finally {
      setTimeout(() => setIngestingRepo(null), 1000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 bg-[#1c1c1e] rounded-2xl border border-[#38383a]">
        <LoaderCircle size={24} className="animate-spin text-[#0a84ff]" />
      </div>
    );
  }

  return (
    <div className="bg-[#1c1c1e] rounded-2xl border border-[#38383a] overflow-hidden flex flex-col max-h-[400px]">
      <div className="px-5 py-4 border-b border-[#38383a] shrink-0">
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-[#0a84ff]" />
          <h2 className="text-[15px] font-semibold text-[#ffffff] tracking-tight">Available Repositories</h2>
        </div>
        <p className="text-[12px] text-[#8e8e93] mt-1">Found in repos/ folder</p>
      </div>

      <div className="overflow-y-auto custom-scrollbar flex-1 p-2">
        {repos.length === 0 ? (
          <div className="p-4 text-center text-[13px] text-[#8e8e93]">
            No repositories found.
          </div>
        ) : (
          <div className="space-y-1">
            {repos.map((repo) => (
              <div 
                key={repo.name}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[#2c2c2e] transition-colors group cursor-pointer"
                onClick={() => onRepoSelect && onRepoSelect(repo.name)}
              >
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-white group-hover:text-[#0a84ff] transition-colors">{repo.name}</span>
                  <span className="text-[11px] text-[#8e8e93]">
                    {repo.on_disk ? "On Disk" : "Indexed Only"}
                  </span>
                </div>

                <div className="flex items-center">
                  {!repo.ingested ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleIngestLocal(repo.name);
                      }}
                      disabled={ingestingRepo === repo.name || !repo.on_disk}
                      className="text-[11px] font-medium bg-[#0a84ff]/10 text-[#0a84ff] px-3 py-1.5 rounded-lg hover:bg-[#0a84ff]/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {ingestingRepo === repo.name ? (
                        <LoaderCircle size={12} className="animate-spin" />
                      ) : (
                        <Database size={12} />
                      )}
                      Index
                    </button>
                  ) : (
                    <span className="text-[11px] font-medium text-[#30d158] flex items-center gap-1 bg-[#30d158]/10 px-3 py-1.5 rounded-lg">
                      <CheckCircle size={12} />
                      Indexed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
