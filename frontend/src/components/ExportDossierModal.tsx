import React, { useState } from 'react';
import { 
  FileDown, X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, 
  ShieldAlert, CheckSquare, Square, FileText, Check
} from 'lucide-react';
import { DossierConfig, Suspect } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { api } from '../lib/api';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSuspect?: Suspect;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  selectedSuspect
}) => {
  if (!isOpen) return null;

  const [dossierConfig, setDossierConfig] = useState<DossierConfig>({
    includeChatHistory: true,
    includeGraphSnapshot: true,
    includeMoMatches: false,
    includeXaiTrail: true,
    caseReference: 'KSP/B-DIV/2023/8892-A',
    analystNotes: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomScale, setZoomScale] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSuccess, setGeneratedSuccess] = useState(false);

  const handleToggle = (key: keyof DossierConfig) => {
    setDossierConfig(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleGeneratePdf = () => {
    setIsGenerating(true);
    const sessionId = `KSP-${Date.now()}`;
    api.exportDossier(sessionId, [], 'Investigative Analyst')
      .then((response) => {
        console.log('Dossier generated:', response);
        setIsGenerating(false);
        setGeneratedSuccess(true);
        window.print();
        setTimeout(() => setGeneratedSuccess(false), 3000);
      })
      .catch((err) => {
        console.error('Dossier API error:', err);
        setIsGenerating(false);
        setGeneratedSuccess(true);
        window.print();
        setTimeout(() => setGeneratedSuccess(false), 3000);
      });
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#060e20]/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto fade-in">
      
      {/* Modal */}
      <div className="w-full max-w-5xl bg-[#171f33] border border-[#434655] shadow-xl flex flex-col md:flex-row h-[90vh] max-h-[880px] rounded-xl overflow-hidden spring-in">
        
        {/* Left Side: Parameters & Form */}
        <div className="w-full md:w-1/2 p-5 flex flex-col border-b md:border-b-0 md:border-r border-[#434655]/60 overflow-y-auto custom-scrollbar">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#2563eb]/15 p-2 rounded-lg text-[#b4c5ff]">
                <FileDown className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold text-[#dae2fd]">
                Export PDF Dossier
              </h1>
            </div>
            <button 
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8d90a0] hover:text-white hover:bg-[#222a3d] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Options */}
          <div className="space-y-5 flex-1">
            
            {/* Checklist */}
            <div className="space-y-2">
              <label className="text-[11px] font-medium text-[#8d90a0] block">
                Include in export
              </label>

              <div className="grid grid-cols-1 gap-1.5">
                
                <label 
                  onClick={() => handleToggle('includeChatHistory')}
                  className={`flex items-center gap-2.5 p-2.5 bg-[#222a3d] border rounded-lg cursor-pointer transition-colors ${
                    dossierConfig.includeChatHistory ? 'border-[#2563eb]/50' : 'border-[#434655]/40'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dossierConfig.includeChatHistory}
                    onChange={() => {}}
                    className="rounded bg-[#171f33] border-[#8d90a0] text-[#2563eb] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-[#dae2fd]">Chat & Query History</span>
                </label>

                <label 
                  onClick={() => handleToggle('includeGraphSnapshot')}
                  className={`flex items-center gap-3 p-3 bg-[#222a3d] border-2 rounded-xl cursor-pointer transition-all ${
                    dossierConfig.includeGraphSnapshot ? 'border-[#2563eb]' : 'border-[#434655]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dossierConfig.includeGraphSnapshot}
                    onChange={() => {}}
                    className="rounded bg-[#171f33] border-[#8d90a0] text-[#2563eb] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-[#dae2fd]">Graph Visualization Snapshot</span>
                </label>

                <label 
                  onClick={() => handleToggle('includeMoMatches')}
                  className={`flex items-center gap-3 p-3 bg-[#222a3d] border-2 rounded-xl cursor-pointer transition-all ${
                    dossierConfig.includeMoMatches ? 'border-[#2563eb]' : 'border-[#434655]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dossierConfig.includeMoMatches}
                    onChange={() => {}}
                    className="rounded bg-[#171f33] border-[#8d90a0] text-[#2563eb] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-[#dae2fd]">MO Similarity Matches</span>
                </label>

                <label 
                  onClick={() => handleToggle('includeXaiTrail')}
                  className={`flex items-center gap-3 p-3 bg-[#222a3d] border-2 rounded-xl cursor-pointer transition-all ${
                    dossierConfig.includeXaiTrail ? 'border-[#2563eb]' : 'border-[#434655]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={dossierConfig.includeXaiTrail}
                    onChange={() => {}}
                    className="rounded bg-[#171f33] border-[#8d90a0] text-[#2563eb] w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-[#dae2fd]">XAI Citation & Evidence Trail</span>
                </label>

              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#8d90a0] block">
                  Case reference
                </label>
                <input
                  type="text"
                  value={dossierConfig.caseReference}
                  onChange={(e) => setDossierConfig({ ...dossierConfig, caseReference: e.target.value })}
                  className="w-full bg-[#060e20] border border-[#434655]/50 text-[#dae2fd] px-3 py-2 rounded-lg font-mono text-xs focus:border-[#2563eb]/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#8d90a0] block">
                  Analyst notes
                </label>
                <textarea
                  rows={3}
                  value={dossierConfig.analystNotes}
                  onChange={(e) => setDossierConfig({ ...dossierConfig, analystNotes: e.target.value })}
                  placeholder="Investigative context or legal citations..."
                  className="w-full bg-[#060e20] border border-[#434655]/50 text-[#dae2fd] px-3 py-2 rounded-lg text-xs focus:border-[#2563eb]/60 focus:outline-none resize-none transition-colors"
                />
              </div>
            </div>

            {/* Security banner */}
            <div className="p-2.5 bg-[#d52022]/8 border-l-3 border-[#d52022] rounded-r flex gap-2 items-start">
              <ShieldAlert className="w-4 h-4 text-[#d52022] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#8d90a0] leading-relaxed">
                <strong className="text-[#ffb4ab]">Notice:</strong> Exports are cryptographically signed with your Analyst ID.
              </p>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-[#434655]/40 flex gap-2">
            <button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 active:scale-[0.98]"
            >
              {generatedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <FileDown className={`w-3.5 h-3.5 ${isGenerating ? 'animate-pulse' : ''}`} />
                  <span>{isGenerating ? 'Signing...' : 'Generate PDF'}</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="px-4 border border-[#434655]/60 text-[#8d90a0] hover:text-white hover:border-[#dae2fd]/40 py-2.5 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
          </div>

        </div>

        {/* Right Side: Preview */}
        <div className="w-full md:w-1/2 bg-[#060e20] p-5 flex flex-col gap-3 overflow-hidden">
          
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-medium text-[#8d90a0]">
              Live preview
            </label>
            <div className="flex gap-0.5 bg-[#171f33] p-0.5 rounded border border-[#434655]/40">
              <button 
                onClick={() => setZoomScale(prev => Math.min(prev + 0.1, 1.3))}
                className="p-1 text-[#8d90a0] hover:text-white transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setZoomScale(prev => Math.max(prev - 0.1, 0.7))}
                className="p-1 text-[#8d90a0] hover:text-white transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Virtual Document */}
          <div className="flex-1 bg-white text-slate-900 relative shadow-lg rounded overflow-y-auto custom-scrollbar p-5 flex flex-col justify-between font-serif select-text">
            
            {/* Header Red Confidential Bar */}
            <div className="bg-red-50 border-b border-red-200 p-2 text-center -mx-6 -mt-6 mb-4">
              <p className="text-[10px] font-bold text-red-800 tracking-widest uppercase font-sans">
                CONFIDENTIAL - COURTROOM DRAFT / ANALYST VERIFICATION REQUIRED
              </p>
            </div>

            {/* Watermark Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 rotate-[-45deg] select-none">
              <span className="text-5xl font-black font-sans uppercase text-slate-900 tracking-widest whitespace-nowrap">
                KSP CLASSIFIED DO NOT COPY
              </span>
            </div>

            {/* Document Body */}
            <div 
              className="space-y-4 text-xs leading-relaxed transition-transform duration-200"
              style={{ transform: `scale(${zoomScale})`, transformOrigin: 'top center' }}
            >
              
              {/* Police Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-300 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-slate-100 flex items-center justify-center rounded overflow-hidden">
                    <img 
                      src={ASSET_IMAGES.policeEmblem} 
                      alt="Karnataka Police Emblem" 
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div>
                    <h2 className="text-base font-bold uppercase leading-tight text-slate-900 font-sans">
                      Karnataka State Police
                    </h2>
                    <p className="text-[10px] font-sans font-semibold text-slate-600">
                      DIGITAL INTELLIGENCE DIVISION (CHANAKYA)
                    </p>
                  </div>
                </div>

                <div className="text-right text-[10px] font-sans text-slate-700">
                  <p className="font-bold">REF: {dossierConfig.caseReference}</p>
                  <p>DATE: OCT 24, 2023</p>
                  <p className="text-red-700 font-bold">SECURITY: TOP SECRET</p>
                </div>
              </div>

              {/* Section I: Executive Summary Table */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold font-sans uppercase bg-slate-100 p-1 border-l-2 border-slate-800">
                  I. Executive Investigative Summary
                </h3>
                <div className="grid grid-cols-3 gap-2 text-[10px] font-sans">
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[8px] text-slate-500 uppercase">Primary Subject</span>
                    <span className="font-bold text-slate-900">{selectedSuspect?.name || 'KARAN SINGH (NODE-722)'}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[8px] text-slate-500 uppercase">Risk Level</span>
                    <span className="font-bold text-red-700">{selectedSuspect?.riskLevel || 'CRITICAL / EXTREME'}</span>
                  </div>
                  <div className="bg-slate-50 p-2 border border-slate-200">
                    <span className="block text-[8px] text-slate-500 uppercase">Network Density</span>
                    <span className="font-bold text-slate-900">{selectedSuspect?.networkDensity || 42} CONNECTIONS</span>
                  </div>
                </div>
              </div>

              {/* Section II: Link Analysis Snapshot */}
              {dossierConfig.includeGraphSnapshot && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold font-sans uppercase bg-slate-100 p-1 border-l-2 border-slate-800">
                    II. Link Analysis Visualization
                  </h3>
                  <div className="h-28 w-full bg-slate-100 border border-slate-300 relative overflow-hidden flex items-center justify-center">
                    <img 
                      src={ASSET_IMAGES.graphSnapshot} 
                      alt="Link Analysis" 
                      className="w-full h-full object-cover opacity-85"
                    />
                    <span className="absolute bottom-1 right-1 text-[8px] font-sans text-slate-500 bg-white/80 px-1 rounded">
                      Snapshot Generated: 14:22:10 UTC
                    </span>
                  </div>
                </div>
              )}

              {/* Section III: XAI Provenance Logs */}
              {dossierConfig.includeXaiTrail && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold font-sans uppercase bg-slate-100 p-1 border-l-2 border-slate-800">
                    III. XAI Provenance Logs
                  </h3>
                  <div className="space-y-1 font-sans text-[9px] text-slate-700">
                    <div className="flex gap-2 border-b border-slate-100 pb-1">
                      <span className="w-14 font-bold text-slate-400">01.24.23</span>
                      <span className="flex-1">Semantic match identified via Pattern MO-991: Signal analysis confirms high correlation.</span>
                    </div>
                    <div className="flex gap-2 border-b border-slate-100 pb-1">
                      <span className="w-14 font-bold text-slate-400">01.25.23</span>
                      <span className="flex-1">Cross-reference with central ledger complete. 4 secondary hits verified.</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyst Notes */}
              {dossierConfig.analystNotes && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold font-sans uppercase bg-slate-100 p-1 border-l-2 border-slate-800">
                    IV. Analyst Context Notes
                  </h3>
                  <p className="text-[10px] font-sans text-slate-800 italic bg-slate-50 p-2 border border-slate-200">
                    "{dossierConfig.analystNotes}"
                  </p>
                </div>
              )}

            </div>

            {/* Document Footer Sign-off */}
            <div className="pt-4 border-t border-slate-300 flex justify-between items-end mt-4">
              <div className="text-[8px] font-sans italic text-slate-500">
                Digital Signature: KSP_ANAL_7721_AABB_CC
              </div>
              <div className="text-right font-sans">
                <div className="w-28 h-6 border-b border-slate-400 mb-1"></div>
                <p className="text-[9px] font-bold text-slate-900">Authorized Intelligence Analyst</p>
              </div>
            </div>

          </div>

          {/* Page Controls */}
          <div className="flex justify-center items-center gap-4 pt-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#171f33] border border-[#434655] text-xs font-bold text-[#dae2fd] rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev Page</span>
            </button>

            <span className="text-xs font-mono font-bold text-[#dae2fd]">
              Page {currentPage} of 4
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, 4))}
              disabled={currentPage === 4}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#171f33] border border-[#434655] text-xs font-bold text-[#dae2fd] rounded-lg disabled:opacity-40"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
