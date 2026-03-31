"use client";

import { AnimatePresence } from "framer-motion";
import { MessageSquare, Code, LoaderCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

export const ChatTerminal = ({
  chatHistory,
  loading,
  query,
  setQuery,
  handleAsk,
  scrollRef,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxHeight: "calc(85vh - 80px)",
        overflow: "hidden",
      }}
      className="bg-[#1c1c1e] rounded-2xl border border-[#38383a] shadow-2xl"
    >
      {/* Chat Header */}
      <div className="px-5 py-3 border-b border-[#38383a] flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 bg-[#0a84ff] rounded-lg flex items-center justify-center">
          <MessageSquare size={16} className="text-white" />
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-white">Assistant</h3>
          <p className="text-[11px] text-[#8e8e93] font-medium">RAG Context Enabled</p>
        </div>
      </div>

      {/* Messages Area - THE SCROLLABLE PART */}
      <div
        ref={scrollRef}
        style={{
          flex: "1 1 0%",
          overflowY: "auto",
          minHeight: 0,
        }}
        className="px-5 py-5 space-y-4 scroll-smooth custom-scrollbar"
      >
        {chatHistory.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <Code size={32} className="mb-3 text-[#8e8e93]" />
            <p className="text-[13px] font-medium text-[#8e8e93]">
              Ask anything about the ingested codebase.
              <br />
              I&apos;ll use semantically relevant snippets to answer.
            </p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {chatHistory.map((msg, i) => (
            <ChatMessage key={i} msg={msg} />
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-[#2c2c2e] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2.5 border border-[#38383a]">
                <LoaderCircle className="animate-spin text-[#0a84ff]" size={14} />
                <span className="text-[13px] font-medium text-[#8e8e93]">Thinking...</span>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area - ALWAYS AT THE BOTTOM */}
      <div className="shrink-0">
        <ChatInput
          query={query}
          setQuery={setQuery}
          handleAsk={handleAsk}
          loading={loading}
        />
      </div>
    </div>
  );
};