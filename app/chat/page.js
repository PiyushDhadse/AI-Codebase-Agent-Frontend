"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Code, FolderGit2 } from "lucide-react";
import { ChatTerminal } from "../../components/ChatTerminal";
import { RepoSelector } from "../../components/RepoSelector";
import { FileViewer } from "../../components/FileViewer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ChatPage() {
  const [repoName, setRepoName] = useState("");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleAsk = async () => {
    if (!query.trim() || loading || !repoName) return;
    
    const userQuery = query;
    setQuery("");
    setLoading(true);
    setChatHistory(prev => [...prev, { role: "user", text: userQuery }]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery, repo_name: repoName }),
      });
      
      const data = await res.json();
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        text: data.answer,
        sources: data.sources 
      }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        text: "Sorry, I encountered an error communicating with the backend." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6 lg:p-8 bg-black/40 backdrop-blur-sm shadow-inner rounded-l-3xl border-l border-white/5 overflow-hidden">
      
      {/* Top Action Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6 shrink-0 pt-2"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#0a84ff] rounded-xl flex items-center justify-center shadow-lg shadow-[#0a84ff]/20">
            <MessageSquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-white m-0 leading-tight">
              Chat Workspace
            </h1>
            <p className="text-[12px] text-[#8e8e93] font-medium m-0 mt-0.5">
              Deep research & code analysis
            </p>
          </div>
        </div>
        
        <div className="w-[320px]">
          <RepoSelector 
            selectedRepo={repoName}
            onSelect={(name) => {
               if(name !== repoName) {
                 setRepoName(name);
                 setChatHistory([]); // Clear history when repo changes
               }
            }}
            apiHost={API_URL}
          />
        </div>
      </motion.div>

      {/* Main Workspace: Split View */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Chat (Fills available space) */}
        <div className="w-[500px] xl:w-[600px] shrink-0 h-full">
          <ChatTerminal 
            chatHistory={chatHistory}
            loading={loading}
            query={query}
            setQuery={setQuery}
            handleAsk={handleAsk}
            scrollRef={scrollRef}
          />
        </div>

        {/* Right Side: File Viewer (Fills rest) */}
        <div className="flex-1 min-w-0 h-full">
          <FileViewer repoName={repoName} />
        </div>

      </div>
    </div>
  );
}
