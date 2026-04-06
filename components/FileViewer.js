"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File, Folder, ChevronRight, ChevronDown, LoaderCircle, Code, Copy, Check, PanelLeftOpen, WrapText } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const TreeNode = ({ node, padding = 12, onFileClick, selectedPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";
  const isSelected = selectedPath === node.path;

  return (
    <div>
      <div 
        className={`flex items-center py-1.5 px-2 hover:bg-white/5 cursor-pointer rounded-md transition-colors ${isSelected ? "bg-[#0a84ff]/20 text-[#0a84ff]" : isFolder ? "text-white/90" : "text-white/60"}`}
        style={{ paddingLeft: `${padding}px` }}
        onClick={() => {
          if (isFolder) {
            setIsOpen(!isOpen);
          } else {
            onFileClick(node);
          }
        }}
      >
        <span className="w-4 h-4 flex items-center justify-center mr-1 shrink-0">
          {isFolder && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </span>
        <span className="w-4 h-4 flex items-center justify-center mr-2 shrink-0">
          {isFolder ? <Folder size={14} className="text-[#0a84ff]" /> : <File size={14} />}
        </span>
        <span className="text-[13px] truncate font-medium">
          {node.name}
        </span>
      </div>
      
      {isFolder && isOpen && node.children && (
        <div className="flex flex-col">
          {node.children.map((child, idx) => (
            <TreeNode 
              key={`${child.path}-${idx}`} 
              node={child} 
              padding={padding + 16} 
              onFileClick={onFileClick}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileViewer = ({ repoName }) => {
  const [treeData, setTreeData] = useState([]);
  const [loadingTree, setLoadingTree] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExplorer, setShowExplorer] = useState(true);
  const [wordWrap, setWordWrap] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchTree = async () => {
      if (!repoName) return;
      setLoadingTree(true);
      try {
        const res = await fetch(`${API_URL}/api/tree?repo_name=${encodeURIComponent(repoName)}`);
        const data = await res.json();
        setTreeData(data.tree || []);
      } catch (err) {
        console.error("Failed to load file tree", err);
      } finally {
        setLoadingTree(false);
      }
    };
    
    fetchTree();
    setSelectedFile(null);
    setFileContent("");
  }, [repoName, API_URL]);

  const handleFileClick = async (node) => {
    setSelectedFile(node);
    setLoadingContent(true);
    try {
      const res = await fetch(`${API_URL}/api/file?repo_name=${encodeURIComponent(repoName)}&file_path=${encodeURIComponent(node.path)}`);
      const data = await res.json();
      setFileContent(data.content || "");
    } catch (err) {
      console.error("Failed to load file content", err);
      setFileContent("Error loading file content.");
    } finally {
      setLoadingContent(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguage = (filename) => {
    if (!filename) return "text";
    const ext = filename.split(".").pop();
    const map = {
      js: "javascript",
      jsx: "jsx",
      ts: "typescript",
      tsx: "tsx",
      py: "python",
      md: "markdown",
      cpp: "cpp",
      h: "cpp",
      java: "java",
      go: "go",
      rs: "rust",
      json: "json",
      css: "css",
      html: "html",
      sh: "bash",
      yaml: "yaml",
      yml: "yaml"
    };
    return map[ext] || "text";
  };

  return (
    <div className="flex h-full w-full bg-[#1c1c1e] rounded-2xl border border-[#38383a] overflow-hidden shadow-2xl relative">
      {/* Left Pane: File Tree */}
      <AnimatePresence initial={false}>
        {showExplorer && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="border-r border-[#38383a] flex flex-col pt-4 overflow-hidden shrink-0"
          >
            <div className="px-4 mb-3 shrink-0 flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-[#8e8e93] uppercase tracking-wider">Explorer</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-2 pb-4">
              {loadingTree ? (
                <div className="flex items-center justify-center h-20">
                  <LoaderCircle size={18} className="animate-spin text-[#0a84ff]" />
                </div>
              ) : treeData.length > 0 ? (
                treeData.map((node, idx) => (
                  <TreeNode 
                    key={`${node.path}-${idx}`} 
                    node={node} 
                    onFileClick={handleFileClick}
                    selectedPath={selectedFile?.path}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-[12px] text-[#8e8e93]">
                  No files found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Right Pane: Code Viewer */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d0e]">
        {/* Code Header */}
        <div className="h-12 border-b border-[#38383a] flex items-center justify-between px-4 shrink-0 bg-[#1c1c1e]">
          <div className="flex items-center gap-3 overflow-hidden mr-4">
            <button 
              onClick={() => setShowExplorer(!showExplorer)}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${!showExplorer ? "text-[#0a84ff] bg-[#0a84ff]/10" : "text-[#8e8e93]"}`}
              title={showExplorer ? "Hide Explorer" : "Show Explorer"}
            >
              <PanelLeftOpen size={18} />
            </button>
            {selectedFile && (
              <div className="flex items-center gap-2 overflow-hidden">
                <Code size={14} className="text-[#0a84ff]" />
                <span className="text-[13px] font-medium text-white truncate max-w-[400px]">
                  {selectedFile.path}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {selectedFile && (
              <>
                <button 
                  onClick={() => setWordWrap(!wordWrap)}
                  className={`p-2 rounded-lg hover:bg-white/5 transition-all active:scale-95 flex items-center gap-2 ${wordWrap ? "text-[#0a84ff] bg-[#0a84ff]/10" : "text-[#8e8e93]"}`}
                  title={wordWrap ? "Disable Word Wrap" : "Enable Word Wrap"}
                >
                  <WrapText size={14} />
                  <span className="text-[11px] font-medium">Wrap</span>
                </button>

                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-lg hover:bg-white/5 text-[#8e8e93] hover:text-white transition-all active:scale-95 flex items-center gap-2"
                  title="Copy code"
                >
                  {copied ? <Check size={14} className="text-[#30d158]" /> : <Copy size={14} />}
                  <span className="text-[11px] font-medium">{copied ? "Copied" : "Copy"}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {selectedFile ? (
            <div className="h-full overflow-auto custom-scrollbar">
              {loadingContent ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-10">
                  <LoaderCircle size={24} className="animate-spin text-[#0a84ff]" />
                </div>
              ) : (
                <SyntaxHighlighter
                  language={getLanguage(selectedFile.name)}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    padding: "20px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    background: "transparent",
                    minWidth: "100%",
                    whiteSpace: wordWrap ? "pre-wrap" : "pre",
                    wordBreak: wordWrap ? "break-all" : "normal",
                  }}
                  showLineNumbers={true}
                  wrapLines={wordWrap}
                  lineProps={{ style: { whiteSpace: wordWrap ? "pre-wrap" : "pre", wordBreak: wordWrap ? "break-all" : "normal" }}}
                  lineNumberStyle={{ minWidth: "3em", paddingRight: "1em", color: "#4b4b4d", textAlign: "right" }}
                >
                  {fileContent}
                </SyntaxHighlighter>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 bg-[#1c1c1e] rounded-2xl flex items-center justify-center mb-4 border border-[#38383a]">
                <Code size={28} className="text-[#38383a]" />
              </div>
              <h3 className="text-white font-medium mb-2">No File Selected</h3>
              <p className="text-[#8e8e93] text-[13px] max-w-[240px]">
                {showExplorer ? "Select a file from the explorer on the left." : "Open the explorer to select a file."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
