import React, { useState } from 'react';
import { 
  Search, Sliders, Sparkles, Filter, FileUp, Cpu, Compass, Layers, AlertCircle
} from 'lucide-react';
import { MatchingCase } from '../types';
import { api, type SearchMatch } from '../lib/api';

interface SemanticSearchProps {
  cases: MatchingCase[];
  onOpenExportModal: () => void;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({ cases: initialCases, onOpenExportModal }) => {
  const [moQuery, setMoQuery] = useState(
    'Describe the criminal patterns, point of entry, method of restraint, specific language used, or toolmarks observed...'
  );
  const [cosineSimilarity, setCosineSimilarity] = useState(0.88);
  const [districtScope, setDistrictScope] = useState('State-wide');
  const [crimeCategory, setCrimeCategory] = useState('Organized Burglary');
  const [isExecutingSearch, setIsExecutingSearch] = useState(false);
  const [displayCases, setDisplayCases] = useState<MatchingCase[]>(initialCases);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleExecuteSearch = () => {
    setIsExecutingSearch(true);
    setSearchError(null);
    api.searchMo(moQuery, cosineSimilarity, districtScope === 'State-wide' ? undefined : districtScope)
      .then((response) => {
        setDisplayCases(response.matches as MatchingCase[]);
      })
      .catch(() => {
        setSearchError('Backend unavailable. Showing cached results.');
      })
      .finally(() => {
        setIsExecutingSearch(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#434655]/60 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#dae2fd] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#8d90a0]" />
            <span>Semantic MO Search</span>
          </h1>
          <p className="text-[11px] text-[#8d90a0] mt-0.5">
            Vector embeddings engine — cosine distance matching
          </p>
        </div>
        <button
          onClick={onOpenExportModal}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-lg text-[11px] font-medium flex items-center gap-1.5 transition-colors"
        >
          <FileUp className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Input + Results */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Query form */}
          <div className="bg-[#171f33] border border-[#434655]/60 p-4 rounded-xl space-y-3 fade-up">
            
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#b4c5ff]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MO Narrative & Behavioral Fingerprint</span>
            </div>

            <textarea
              rows={3}
              value={moQuery}
              onChange={(e) => setMoQuery(e.target.value)}
              className="w-full bg-[#060e20] border border-[#434655]/50 focus:border-[#2563eb]/60 rounded-lg p-3 text-sm text-[#dae2fd] placeholder-[#8d90a0]/50 resize-none focus:outline-none transition-colors"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-[#434655]/30">
              
              {/* Slider */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-[#8d90a0]">Similarity</span>
                  <span className="font-mono font-medium text-[#b4c5ff]">{cosineSimilarity.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.50"
                  max="1.00"
                  step="0.01"
                  value={cosineSimilarity}
                  onChange={(e) => setCosineSimilarity(parseFloat(e.target.value))}
                  className="w-full accent-[#2563eb] cursor-pointer h-1"
                />
              </div>

              {/* District */}
              <div className="space-y-1">
                <label className="block text-[10px] text-[#8d90a0]">District</label>
                <select
                  value={districtScope}
                  onChange={(e) => setDistrictScope(e.target.value)}
                  className="w-full bg-[#060e20] border border-[#434655]/50 rounded-md p-1.5 text-[11px] text-[#dae2fd] focus:border-[#2563eb]/60 focus:outline-none transition-colors"
                >
                  <option value="State-wide">State-wide</option>
                  <option value="Bengaluru Urban">Bengaluru Urban</option>
                  <option value="Mysuru">Mysuru</option>
                  <option value="Hubballi">Hubballi</option>
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1">
                <label className="block text-[10px] text-[#8d90a0]">Category</label>
                <select
                  value={crimeCategory}
                  onChange={(e) => setCrimeCategory(e.target.value)}
                  className="w-full bg-[#060e20] border border-[#434655]/50 rounded-md p-1.5 text-[11px] text-[#dae2fd] focus:border-[#2563eb]/60 focus:outline-none transition-colors"
                >
                  <option value="Organized Burglary">Organized Burglary</option>
                  <option value="Warehouse Breach">Warehouse Breach</option>
                  <option value="Commercial Heist">Commercial Heist</option>
                  <option value="Cyber Theft">Cyber Theft</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExecuteSearch}
              disabled={isExecutingSearch}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              <Search className={`w-3.5 h-3.5 ${isExecutingSearch ? 'animate-spin' : ''}`} />
              <span>{isExecutingSearch ? 'Searching...' : 'Execute Vector Search'}</span>
            </button>

            {searchError && (
              <p className="text-[10px] text-[#ffb77d] text-center">{searchError}</p>
            )}
          </div>

          {/* Results */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold text-[#dae2fd]">Ranked Matches</h2>
              <span className="text-[10px] text-[#8d90a0] font-mono">
                {displayCases.length} results
              </span>
            </div>

            {displayCases.map((caseItem, idx) => (
              <div
                key={caseItem.id}
                className="bg-[#171f33] border border-[#434655]/60 hover:border-[#2563eb]/40 p-4 rounded-xl space-y-2.5 transition-all duration-300 fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-[#b4c5ff] font-mono">{caseItem.firNumber}</span>
                      <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                        caseItem.isCrossDistrict 
                          ? 'bg-[#d97707]/15 text-[#ffb77d] border border-[#d97707]/30' 
                          : 'bg-[#2563eb]/15 text-[#b4c5ff] border border-[#2563eb]/30'
                      }`}>
                        {caseItem.districtTag}
                      </span>
                    </div>
                    <p className="text-xs text-[#8d90a0] mt-1 leading-relaxed">
                      {caseItem.summaryText}
                    </p>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-xl font-bold text-[#b4c5ff] leading-none block">
                      {caseItem.matchScore}%
                    </span>
                    <span className="text-[8px] text-[#8d90a0]">
                      match
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-[#060e20] p-2.5 rounded-lg border border-[#434655]/30 text-[11px] text-[#c3c6d7] leading-relaxed">
                  Used a{' '}
                  <span className="bg-[#2563eb]/15 text-[#b4c5ff] px-1 py-0.5 rounded font-medium">
                    {caseItem.highlights[0] || 'specific tool'}
                  </span>{' '}
                  and methods where{' '}
                  {caseItem.highlights[1] ? (
                    <span className="bg-[#2563eb]/15 text-[#b4c5ff] px-1 py-0.5 rounded font-medium">
                      {caseItem.highlights[1]}
                    </span>
                  ) : 'standard bypass'} was observed.
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {caseItem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-[#222a3d] text-[9px] font-medium px-2 py-0.5 rounded text-[#8d90a0]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Right: XAI panel */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-[#171f33] border border-[#434655]/60 p-4 rounded-xl space-y-3 fade-up" style={{ animationDelay: '0.1s' }}>
            
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#b4c5ff]">
              <Cpu className="w-3.5 h-3.5" />
              <span>XAI Evidence & Clustering</span>
            </div>

            {/* Scatter canvas */}
            <div className="bg-[#060e20] border border-[#434655]/40 rounded-lg p-3 h-52 relative overflow-hidden flex flex-col justify-end">
              
              <span className="text-[9px] text-[#8d90a0] mb-auto">
                Semantic Proximity Map
              </span>

              {/* Vector dots */}
              <div className="absolute inset-0 p-5 pointer-events-none">
                {[
                  { top: 12, left: 16, color: '#2563eb', size: 'w-2 h-2' },
                  { top: 20, left: 32, color: '#ffb77d', size: 'w-1.5 h-1.5' },
                  { top: 28, left: 24, color: '#b4c5ff', size: 'w-1.5 h-1.5' },
                  { top: 36, left: 48, color: '#b4c5ff', size: 'w-1 h-1' },
                  { top: 16, left: 60, color: '#ffb4ab', size: 'w-1.5 h-1.5' },
                  { top: 40, left: 64, color: '#b4c5ff', size: 'w-1 h-1' },
                ].map((dot, i) => (
                  <div 
                    key={i}
                    className={`absolute rounded-full ${dot.size} pulse-soft`}
                    style={{ 
                      top: `${dot.top}%`, 
                      left: `${dot.left}%`, 
                      backgroundColor: dot.color,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </div>

              <div className="bg-[#131b2e]/90 border border-[#434655]/40 p-1.5 rounded text-center z-10">
                <span className="text-[9px] font-medium text-[#dae2fd]">
                  Cluster 04: "Structural Breach Unit"
                </span>
              </div>
            </div>

            {/* Reasoning */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-medium text-[#8d90a0] block">
                Reasoning tokens
              </span>

              <ul className="space-y-1.5 text-[10px] text-[#8d90a0] leading-relaxed">
                {[
                  { color: 'bg-[#ffb77d]', title: 'Spatial pattern', text: 'Breach locations follow NH-48 corridor.' },
                  { color: 'bg-[#2563eb]', title: 'Linguistic alignment (92%)', text: 'Scene note matches "Silent Cobra" syntax.' },
                  { color: 'bg-[#ffb4ab]', title: 'Anomaly flag', text: 'Gen-3 biometric bypass detected.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 bg-[#131b2e] p-2 rounded border border-[#434655]/30 fade-up" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                    <span className={`w-1.5 h-1.5 rounded-full ${item.color} mt-1 shrink-0`}></span>
                    <div>
                      <strong className="text-[#dae2fd] block text-[10px]">{item.title}</strong>
                      {item.text}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={onOpenExportModal}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Export Case File</span>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};
