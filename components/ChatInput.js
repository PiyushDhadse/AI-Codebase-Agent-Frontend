import { Search, Send } from "lucide-react";

export const ChatInput = ({ query, setQuery, handleAsk, loading }) => {
  return (
    <div className="px-5 py-4 border-t border-[#38383a] bg-[#1c1c1e]">
      <div className="relative flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#8e8e93]"
          />
          <input
            className="w-full h-11 pl-10 pr-4 bg-[#2c2c2e] border border-[#38383a] rounded-xl text-[15px] text-white placeholder:text-[#8e8e93] focus:outline-none focus:border-[#0a84ff] transition-colors"
            placeholder="Ask about the codebase..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          />
        </div>
        <button
          onClick={handleAsk}
          disabled={loading || !query.trim()}
          className="w-11 h-11 bg-[#0a84ff] text-white rounded-xl flex items-center justify-center hover:bg-[#0066d9] disabled:opacity-50 transition-all active:scale-[0.97]"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};