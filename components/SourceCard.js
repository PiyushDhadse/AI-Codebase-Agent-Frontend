import { Database, LoaderCircle, CheckCircle, AlertCircle } from "lucide-react";
import { GitHubIcon } from "./icons";

export const SourceCard = ({ 
  repoUrl, 
  setRepoUrl, 
  handleIngest, 
  ingesting, 
  status,
  error 
}) => {
  const getStatusText = () => {
    switch(status) {
      case 'Success': return 'Ready';
      case 'Processing': return 'Processing';
      case 'Error': return 'Failed';
      default: return 'Idle';
    }
  };

  const getStatusColor = () => {
    switch(status) {
      case 'Success': return 'text-[#30d158]';
      case 'Processing': return 'text-[#0a84ff]';
      case 'Error': return 'text-[#ff453a]';
      default: return 'text-[#8e8e93]';
    }
  };

  const StatusIcon = status === 'Processing' ? LoaderCircle : status === 'Success' ? CheckCircle : Database;

  return (
    <div className="bg-[#1c1c1e] rounded-2xl border border-[#38383a] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#38383a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[#0a84ff]" />
            <h2 className="text-[17px] font-semibold text-[#ffffff] tracking-tight">Source</h2>
          </div>
          <div className="flex items-center gap-1.5">
            <StatusIcon size={12} className={`${getStatusColor()} ${status === 'Processing' ? 'animate-spin' : ''}`} />
            <span className={`text-[13px] font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>
      
      <div className="px-5 py-5 space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <GitHubIcon size={18} className="text-[#8e8e93]" />
          </div>
          <input
            className="w-full h-11 pl-10 pr-4 bg-[#2c2c2e] border border-[#38383a] rounded-xl text-[15px] text-[#ffffff] placeholder:text-[#8e8e93] focus:outline-none focus:border-[#0a84ff] transition-colors"
            placeholder="github.com/username/repo"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
          />
        </div>

        <button
          onClick={handleIngest}
          disabled={ingesting}
          className={`
            w-full h-11 rounded-xl font-medium text-[15px] transition-all
            flex items-center justify-center gap-2
            ${ingesting 
              ? 'bg-[#0a84ff]/50 cursor-not-allowed' 
              : 'bg-[#0a84ff] hover:bg-[#0066d9] active:scale-[0.98]'
            }
          `}
        >
          {ingesting ? (
            <>
              <LoaderCircle size={16} className="animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle size={16} />
              <span>Ingest Repository</span>
            </>
          )}
        </button>

        <p className="text-[11px] text-[#8e8e93] text-center">
          Supports public GitHub repositories
        </p>

        {error && (
          <div className="pt-2 flex items-start gap-2">
            <AlertCircle size={14} className="text-[#ff453a] shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#ff453a]">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};