import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

export const ChatMessage = ({ msg }) => {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-[#0a84ff] text-white rounded-tr-none"
            : "bg-[#2c2c2e] text-white rounded-tl-none border border-[#38383a]"
        }`}
      >
        <div className="text-[14px] leading-relaxed whitespace-pre-wrap prose prose-invert max-w-none prose-sm prose-p:my-1 prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl">
          <ReactMarkdown>{msg.text}</ReactMarkdown>
        </div>

        {msg.sources && msg.sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-[#8e8e93] mb-2">
              Sources
            </p>
            <div className="flex flex-wrap gap-1.5">
              {msg.sources.map((source, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-[#1c1c1e] px-2 py-1 rounded-md font-mono text-[#8e8e93] border border-[#38383a]"
                >
                  {source.split(/[\\/]/).pop()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};