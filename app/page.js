"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { SourceCard } from "../components/SourceCard";
import { SystemMetrics } from "../components/SystemMetrics";
import { FileTree } from "../components/FileTree";
import { ChatTerminal } from "../components/ChatTerminal";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [status, setStatus] = useState("Idle");
  const [loading, setLoading] = useState(false);
  const [ingesting, setIngesting] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  const handleIngest = async () => {
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
      setError("Connection error. Make sure the backend is running.");
      setStatus("Error");
    } finally {
      setIngesting(false);
    }
  };

  const handleAsk = async () => {
    if (!query.trim() || loading) return;
    
    const userQuery = query;
    setQuery("");
    setLoading(true);
    setChatHistory(prev => [...prev, { role: "user", text: userQuery }]);

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userQuery }),
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-2 md:p-6 lg:p-8 overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('/background.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Dark Overlay */}
      <div className="fixed inset-0 z-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative z-10 w-full h-[85vh] max-w-[1800px] flex flex-col mx-auto min-h-0">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-4 px-2 shrink-0"
        >
          <div className="inline-flex items-center justify-center w-10 h-10 bg-[#0a84ff]/10 rounded-2xl backdrop-blur-sm border border-[#0a84ff]/20">
            <Terminal size={20} className="text-[#0a84ff]" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white m-0 leading-tight">
              Codebase AI
            </h1>
            <p className="text-[13px] text-white/50 m-0">
              Professional-grade repository analysis
            </p>
          </div>
        </motion.div>

        {/* Main Layout (3 Columns) */}
        <div 
          className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5"
          style={{ minHeight: 0, height: "100%" }}
        >
          
          {/* Left Panel (Controls) */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto pr-1"
          >
            <SourceCard 
              repoUrl={repoUrl}
              setRepoUrl={setRepoUrl}
              handleIngest={handleIngest}
              ingesting={ingesting}
              status={status}
              error={error}
            />
            <SystemMetrics engine="SQLite Vector V2" model="phi3 / LLMService" />
          </motion.div>

          {/* Middle Panel (File Tree) */}
          <div
            className="lg:col-span-3"
            style={{ height: "100%", minHeight: 0 }}
          >
            <FileTree repoUrl={repoUrl} />
          </div>

          {/* Right Panel (Chat Section) */}
          <div
            className="lg:col-span-6"
            style={{ height: "100%", minHeight: 0 }}
          >
            <ChatTerminal 
              chatHistory={chatHistory}
              loading={loading}
              query={query}
              setQuery={setQuery}
              handleAsk={handleAsk}
              scrollRef={scrollRef}
            />
          </div>

        </div>
      </div>
    </div>
  );
}