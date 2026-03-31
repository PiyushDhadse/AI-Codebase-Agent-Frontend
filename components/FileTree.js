import { useState, useEffect } from "react";
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react";

const TreeNode = ({ node, padding = 4 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div>
      <div 
        className={`flex items-center py-1.5 px-2 hover:bg-white/5 cursor-pointer rounded-md ${isFolder ? "text-white/90" : "text-white/60"}`}
        style={{ paddingLeft: `${padding}px` }}
        onClick={() => isFolder && setIsOpen(!isOpen)}
      >
        <span className="w-4 h-4 flex items-center justify-center mr-1 shrink-0">
          {isFolder && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </span>
        <span className="w-4 h-4 flex items-center justify-center mr-2 shrink-0">
          {isFolder ? <Folder size={14} className="text-[#0a84ff]" /> : <File size={14} />}
        </span>
        <span className={`text-[13px] truncate ${isFolder ? "font-medium" : "font-normal"}`}>
          {node.name}
        </span>
      </div>
      
      {isFolder && isOpen && node.children && (
        <div className="flex flex-col">
          {node.children.map((child, idx) => (
            <TreeNode key={`${child.name}-${idx}`} node={child} padding={padding + 16} />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileTree = ({ repoUrl }) => {
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const fetchTree = async () => {
      if (!repoUrl) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/tree?repo_url=${encodeURIComponent(repoUrl)}`);
        const data = await res.json();
        setTreeData(data.tree || []);
      } catch (err) {
        console.error("Failed to load file tree", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTree();
    const interval = setInterval(fetchTree, 10000);
    return () => clearInterval(interval);
  }, [repoUrl, API_URL]);

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
      <div className="px-5 py-3 border-b border-[#38383a] shrink-0">
        <h3 className="text-[15px] font-semibold text-white tracking-tight">Repository Structure</h3>
      </div>
      
      <div
        style={{
          flex: "1 1 0%",
          overflowY: "auto",
          minHeight: 0,
        }}
        className="p-2 custom-scrollbar"
      >
        {loading && treeData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[13px] text-[#8e8e93]">
            Loading structure...
          </div>
        ) : treeData.length > 0 ? (
          treeData.map((node, idx) => (
            <TreeNode key={`${node.name}-${idx}`} node={node} />
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-[13px] text-[#8e8e93]">
            No repository loaded yet.
          </div>
        )}
      </div>
    </div>
  );
};
