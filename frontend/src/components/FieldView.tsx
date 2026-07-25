import React, { useState } from 'react';
import { 
  AlertTriangle, Play, Pause, Volume2, Mic, Languages, CheckCircle, 
  RefreshCw, Edit3, History, Shield, Users, Share2, Search, Map
} from 'lucide-react';
import { Suspect, VoiceQuery, ViewMode } from '../types';
import { ASSET_IMAGES } from '../data/mockData';
import { api, type QueryResponse } from '../lib/api';

interface FieldViewProps {
  suspects: Suspect[];
  pendingQueries: VoiceQuery[];
  onConfirmQuery: (queryId: string) => void;
  onViewDossier: (suspectId: string) => void;
  onSwitchView: (view: ViewMode) => void;
}

export const FieldView: React.FC<FieldViewProps> = ({
  suspects,
  pendingQueries,
  onConfirmQuery,
  onViewDossier,
  onSwitchView
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [isRecording, setIsRecording] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(true);
  const [activeQuery, setActiveQuery] = useState<VoiceQuery>(
    pendingQueries[0] || {
      id: 'VQ-1092',
      timestamp: '14:05',
      rawKannada: 'ಮಲ್ಲೇಶ್ವರಂ 8ನೇ ಕ್ರಾಸ್‌ನಲ್ಲಿ ಶಂಕಿತ ವ್ಯಕ್ತಿಯನ್ನು ಪತ್ತೆ ಹಚ್ಚಿ',
      englishInterpretation: 'Locate suspect at Malleshwaram 8th cross',
      confidence: 64,
      status: 'pending'
    }
  );
  const [textInput, setTextInput] = useState('');
  const [isQuerying, setIsQuerying] = useState(false);
  const [apiResponse, setApiResponse] = useState<QueryResponse | null>(null);

  const primarySuspect = suspects[1] || suspects[0];

  const handleSimulateVoiceInput = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setShowVerifyModal(true);
      }, 3000);
    }
  };

  const handleConfirmCurrentQuery = () => {
    onConfirmQuery(activeQuery.id);
    setShowVerifyModal(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] pb-28">
      
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-2.5 bg-[#0b1326] border-b border-[#434655]/60">
        <div className="flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-[#b4c5ff]" />
          <div>
            <h1 className="font-bold text-base text-[#b4c5ff] leading-none">KSP-Chanakya</h1>
            <p className="text-[10px] text-[#8d90a0]">Field Officer</p>
          </div>
        </div>
        <div className="w-7 h-7 rounded-full overflow-hidden border border-[#434655]">
          <img src={ASSET_IMAGES.policeOfficer} alt="Officer" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Main */}
      <div className={`max-w-2xl mx-auto p-4 transition-all duration-300 ${showVerifyModal ? 'blur-sm pointer-events-none select-none' : ''}`}>
        
        {/* Alert banner */}
        <div className="mb-4 bg-[#93000a]/15 border border-[#93000a]/40 p-2.5 rounded-lg flex items-center gap-2.5 fade-up">
          <AlertTriangle className="w-4 h-4 text-[#ffb4ab] shrink-0" />
          <p className="text-[11px] font-medium text-[#ffb4ab]">
            {pendingQueries.length} queries pending analyst verification
          </p>
        </div>

        {/* Chat feed */}
        <div className="space-y-5">
          
          {/* System response */}
          <div className="flex flex-col gap-1.5 fade-up">
            <div className="bg-[#131b2e] border-l-3 border-l-[#2563eb] p-4 rounded-r-lg space-y-3">
              
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[#ffb77d] w-fit">
                <Shield className="w-3 h-3" />
                <span>Analyst verification required</span>
              </div>

              <p className="text-sm text-[#dae2fd] leading-relaxed">
                Results found for <span className="font-semibold text-[#b4c5ff]">"Karthik S"</span> near Majestic area. Suspect linked to multiple incidents under BNS 303.
              </p>

              {/* Suspect card */}
              <div className="bg-[#171f33] border border-[#434655]/50 rounded-lg overflow-hidden">
                <div className="flex gap-3 p-3 border-b border-[#434655]/30">
                  <div className="w-16 h-20 bg-[#0b1326] border border-[#434655]/50 rounded overflow-hidden shrink-0">
                    <img 
                      src={primarySuspect.mugshotUrl} 
                      alt={primarySuspect.name} 
                      className="w-full h-full object-cover grayscale brightness-90"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-mono text-[#8d90a0]">
                      {primarySuspect.personId}
                    </span>
                    <h3 className="text-base font-bold text-[#b4c5ff] leading-tight">
                      {primarySuspect.name}
                    </h3>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      <span className="bg-[#93000a]/15 text-[#ffb4ab] px-1.5 py-0.5 rounded text-[9px] font-medium">
                        FIR {primarySuspect.firNumber}
                      </span>
                      <span className="bg-[#d97707]/15 text-[#ffb77d] px-1.5 py-0.5 rounded text-[9px] font-medium">
                        {primarySuspect.bnsSection}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2.5 flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8d90a0]">
                    <History className="w-3 h-3" />
                    <span>Last activity: {primarySuspect.lastActivity}</span>
                  </div>
                  <button 
                    onClick={() => onViewDossier(primarySuspect.id)}
                    className="text-[10px] font-medium text-[#b4c5ff] hover:underline"
                  >
                    View Dossier
                  </button>
                </div>
              </div>

              {/* TTS player */}
              <div className="mt-2 bg-[#222a3d] rounded-full px-3 py-1.5 flex items-center gap-2 border border-[#434655]/50">
                <button 
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="text-[#b4c5ff] hover:scale-110 transition-transform"
                >
                  {isPlayingAudio ? (
                    <Pause className="w-5 h-5 fill-[#b4c5ff]" />
                  ) : (
                    <Play className="w-5 h-5 fill-[#b4c5ff]" />
                  )}
                </button>
                <div className="flex-grow">
                  <div className="h-1 w-full bg-[#434655]/60 rounded-full relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 bg-[#2563eb]/70 rounded-full transition-all duration-500 ${isPlayingAudio ? 'w-2/3' : 'w-1/3'}`}></div>
                  </div>
                </div>
                <select 
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(e.target.value)}
                  className="bg-transparent text-[#8d90a0] text-[10px] font-medium border-none focus:ring-0 cursor-pointer p-0"
                >
                  <option value="1.0x" className="bg-[#171f33]">1.0x</option>
                  <option value="1.25x" className="bg-[#171f33]">1.25x</option>
                  <option value="1.5x" className="bg-[#171f33]">1.5x</option>
                </select>
                <Volume2 className="w-3.5 h-3.5 text-[#8d90a0]" />
              </div>

            </div>
            <span className="text-[10px] text-[#8d90a0] ml-2 font-mono">Chanakya AI · 14:02</span>
          </div>

          {/* User query */}
          <div className="flex flex-col items-end gap-1.5 fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-[#2563eb] text-white p-3.5 rounded-l-lg rounded-tr-lg max-w-[85%] space-y-1.5">
              <p className="text-sm font-medium leading-snug">
                {activeQuery.rawKannada}
              </p>
              <p className="text-xs opacity-80">
                {activeQuery.englishInterpretation}
              </p>
              <div className="pt-1.5 border-t border-white/15 flex items-center gap-1.5 text-[10px] opacity-75">
                <Languages className="w-3 h-3" />
                <span>{activeQuery.confidence}% confidence</span>
              </div>
            </div>
            <button 
              onClick={() => setShowVerifyModal(true)}
              className="bg-[#222a3d] border border-[#434655]/60 hover:border-[#b4c5ff]/50 px-2.5 py-1 rounded-md text-[10px] font-medium text-[#c3c6d7] transition-colors"
            >
              Confirm transcription
            </button>
            <span className="text-[10px] text-[#8d90a0] font-mono">You · {activeQuery.timestamp}</span>
          </div>

        </div>
      </div>

      {/* Floating input */}
      <div className="fixed bottom-16 sm:bottom-20 left-0 w-full px-4 py-3 z-30 pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto relative flex items-center gap-2.5 bg-[#171f33] border border-[#434655] rounded-xl px-3.5 py-2">
          
          <button className="text-[#8d90a0] hover:text-[#b4c5ff] transition-colors">
            <Languages className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && textInput && !isQuerying) {
                setIsQuerying(true);
                api.interpretQuery(textInput)
                  .then((response) => {
                    setApiResponse(response);
                    setActiveQuery({
                      id: `VQ-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      rawKannada: textInput,
                      englishInterpretation: response.synthesized_text,
                      confidence: 92,
                      status: 'confirmed'
                    });
                  })
                  .catch(() => {
                    setActiveQuery({
                      id: `VQ-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      rawKannada: textInput,
                      englishInterpretation: textInput,
                      confidence: 75,
                      status: 'confirmed'
                    });
                  })
                  .finally(() => {
                    setIsQuerying(false);
                    setTextInput('');
                  });
              }
            }}
            placeholder="Type in English or ಕನ್ನಡ..."
            className="bg-transparent border-none focus:ring-0 w-full text-sm text-[#dae2fd] placeholder-[#8d90a0]/60"
          />

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleSimulateVoiceInput}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                isRecording 
                  ? 'bg-[#d52022] text-white' 
                  : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Verify modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1326]/70 backdrop-blur-sm">
          <div className="bg-[#222a3d] border border-[#434655] p-5 rounded-xl w-full max-w-sm shadow-xl space-y-4 spring-in">
            
            <div className="flex items-center gap-2.5 border-b border-[#434655]/60 pb-3">
              <div className="bg-[#2563eb]/15 p-2 rounded-lg">
                <Mic className="w-5 h-5 text-[#b4c5ff]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#dae2fd]">Verify Query</h2>
                <span className="text-[10px] font-medium text-[#ffb77d]">
                  {activeQuery.confidence}% confidence
                </span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="bg-[#0b1326] p-3 rounded-lg border border-[#434655]/40">
                <span className="block text-[9px] font-medium text-[#8d90a0] mb-1">
                  Raw transcription
                </span>
                <p className="text-sm text-[#dae2fd] leading-relaxed">
                  "{activeQuery.rawKannada}"
                </p>
              </div>

              <div className="bg-[#2563eb]/8 p-3 rounded-lg border border-[#2563eb]/20">
                <span className="block text-[9px] font-medium text-[#b4c5ff] mb-1">
                  English interpretation
                </span>
                <p className="text-sm text-[#dae2fd] leading-relaxed">
                  "{activeQuery.englishInterpretation}"
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-0.5">
              <button
                onClick={handleConfirmCurrentQuery}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98]"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Confirm</span>
              </button>

              <button
                onClick={() => {
                  const edited = prompt('Edit interpretation:', activeQuery.englishInterpretation);
                  if (edited) {
                    setActiveQuery({ ...activeQuery, englishInterpretation: edited });
                  }
                }}
                className="w-full bg-[#171f33] border border-[#434655]/60 hover:border-[#dae2fd]/30 text-[#dae2fd] py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit text</span>
              </button>

              <button
                onClick={handleSimulateVoiceInput}
                className="w-full text-[#ffb4ab] hover:bg-[#93000a]/15 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Mobile nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 bg-[#171f33] border-t border-[#434655]/60">
        {([
          { view: 'field' as ViewMode, icon: Users, label: 'Field', active: true },
          { view: 'graph' as ViewMode, icon: Share2, label: 'Graph' },
          { view: 'semantic' as ViewMode, icon: Search, label: 'Search' },
          { view: 'leadership' as ViewMode, icon: Map, label: 'Heatmap' },
        ]).map(({ view, icon: Icon, label, active }) => (
          <button 
            key={view}
            onClick={() => onSwitchView(view)}
            className={`flex flex-col items-center justify-center transition-colors ${
              active ? 'text-[#b4c5ff]' : 'text-[#8d90a0] hover:text-[#c3c6d7]'
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
            <span className="text-[9px] font-medium mt-0.5">{label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
};
