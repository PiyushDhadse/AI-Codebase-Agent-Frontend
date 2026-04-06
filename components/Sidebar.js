"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Database, MessageSquare, Cpu, X } from "lucide-react";
import { SourceCard } from "./SourceCard";
import { LocalRepoList } from "./LocalRepoList";
import { SystemMetrics } from "./SystemMetrics";

export const Sidebar = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  
  // State for slide-out panels
  const [activePanel, setActivePanel] = useState(null); // 'ingest' | 'system' | null

  const navItems = [
    {
      id: "home",
      icon: Terminal,
      path: "/",
      label: "Dashboard",
      onClick: () => {
        router.push("/");
        setActivePanel(null);
      }
    },
    {
      id: "ingest",
      icon: Database,
      label: "Repository Data",
      onClick: () => setActivePanel(activePanel === "ingest" ? null : "ingest")
    },
    {
      id: "chat",
      icon: MessageSquare,
      path: "/chat",
      label: "Chat Workspace",
      onClick: () => {
        router.push("/chat");
        setActivePanel(null);
      }
    },
  ];

  const bottomItems = [
    {
      id: "system",
      icon: Cpu,
      label: "System Status",
      onClick: () => setActivePanel(activePanel === "system" ? null : "system")
    }
  ];

  // Placeholder state for SourceCard since we moved it here
  const [repoUrl, setRepoUrl] = useState("");
  const [ingesting, setIngesting] = useState(false);
  const [status, setStatus] = useState("Idle");
  const [error, setError] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  const handleIngestRemote = async () => {
    if (!repoUrl) return;
    setIngesting(true);
    setError(null);
    setStatus("Processing");

    try {
      const res = await fetch(`${API_URL}/api/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl }),
      });
      
      if (res.ok) {
        setStatus("Success");
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to ingest repository");
        setStatus("Error");
      }
    } catch (err) {
      setError("Connection error.");
      setStatus("Error");
    } finally {
      setIngesting(false);
    }
  };

  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-black">
      {/* Background Image behind everything */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/background.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/70" />

      {/* Main Content Area (pushes right when panel opens if we want to) */}
      <div className="flex-1 flex flex-col z-10 w-full relative transition-all duration-300">
        
        {/* Navigation Sidebar (Vertical, Icon only) */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-[#1c1c1e]/90 backdrop-blur-xl border-r border-[#38383a] z-50 flex flex-col items-center py-6 shadow-2xl">
          {/* Logo */}
          <div className="w-10 h-10 bg-[#0a84ff]/10 rounded-xl mb-8 flex items-center justify-center border border-[#0a84ff]/20">
            <Terminal size={20} className="text-[#0a84ff]" />
          </div>

          {/* Top Nav */}
          <div className="flex-1 flex flex-col gap-4 w-full px-2 items-center">
            {navItems.map((item) => {
              const isActive = (item.path && pathname === item.path) || activePanel === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  title={item.label}
                  className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group hover:bg-white/5 active:scale-95 ${isActive ? "bg-white/10" : ""}`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-[#0a84ff] rounded-r-full"
                    />
                  )}
                  <Icon size={22} className={isActive ? "text-[#0a84ff]" : "text-[#8e8e93] group-hover:text-white"} />
                </button>
              );
            })}
          </div>

          {/* Bottom Nav */}
          <div className="flex flex-col gap-4 w-full px-2 items-center">
            {bottomItems.map((item) => {
              const isActive = activePanel === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  title={item.label}
                  className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all group hover:bg-white/5 active:scale-95 ${isActive ? "bg-white/10" : ""}`}
                >
                  {isActive && (
                    <div className="absolute left-0 w-1 h-6 bg-[#0a84ff] rounded-r-full" />
                  )}
                  <Icon size={22} className={isActive ? "text-[#0a84ff]" : "text-[#8e8e93] group-hover:text-white"} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Slide-out Panels (Overlay style) */}
        <AnimatePresence>
          {activePanel && (
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 bottom-0 left-16 w-[380px] bg-[#1c1c1e]/95 backdrop-blur-2xl border-r border-[#38383a] z-40 p-5 overflow-y-auto custom-scrollbar shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[17px] font-semibold text-white tracking-tight">
                  {activePanel === "ingest" ? "Data Management" : "System Status"}
                </h2>
                <button 
                  onClick={() => setActivePanel(null)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-[#8e8e93] hover:text-white transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {activePanel === "ingest" && (
                <div className="space-y-6">
                  <SourceCard 
                    repoUrl={repoUrl}
                    setRepoUrl={setRepoUrl}
                    handleIngest={handleIngestRemote}
                    ingesting={ingesting}
                    status={status}
                    error={error}
                  />
                  <LocalRepoList apiHost={API_URL} />
                </div>
              )}

              {activePanel === "system" && (
                <div className="space-y-6">
                  <SystemMetrics engine="SQLite Vector V3" model="Ollama / phi3" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Content Rendered Here. Offset by pl-16 so it's not hidden by sidebar */}
        <div className="flex-1 w-full h-full pl-16">
           {children}
        </div>

      </div>
    </div>
  );
};
