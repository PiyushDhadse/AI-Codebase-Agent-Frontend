export const SystemMetrics = ({ engine, model }) => {
  return (
    <div className="bg-[#1c1c1e] rounded-2xl border border-[#38383a] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#38383a]">
        <h3 className="text-[13px] font-semibold text-[#8e8e93] tracking-tight">
          System Metrics
        </h3>
      </div>
      
      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-[#8e8e93]">Vector Engine</span>
          <span className="text-[15px] font-medium text-[#ffffff]">{engine}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-[#8e8e93]">Model</span>
          <span className="text-[15px] font-medium text-[#ffffff]">{model}</span>
        </div>
      </div>
    </div>
  );
};