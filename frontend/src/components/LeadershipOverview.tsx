import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, Activity, TrendingUp, MapPin, Users, CheckCircle, Clock, AlertTriangle 
} from 'lucide-react';

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [started, target, duration]);

  return { count, ref };
}

const KpiCard = ({ 
  icon: Icon, 
  label, 
  value, 
  formattedValue,
  sub, 
  subColor = 'text-[#8d90a0]',
  delay 
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  formattedValue?: string;
  sub: string;
  subColor?: string;
  delay: number;
}) => {
  const { count, ref } = useCountUp(value);
  return (
    <div 
      ref={ref}
      className="bg-[#171f33] border border-[#434655]/60 p-4 rounded-xl space-y-2 fade-up hover:border-[#434655] transition-colors duration-300"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex justify-between items-center text-[11px] text-[#8d90a0]">
        <span className="font-medium">{label}</span>
        <Icon className="w-3.5 h-3.5 text-[#c3c6d7]" />
      </div>
      <p className="text-2xl font-bold text-[#dae2fd] font-mono tabular-nums">
        {formattedValue ?? count.toLocaleString()}
      </p>
      <p className={`text-[10px] font-medium ${subColor}`}>{sub}</p>
    </div>
  );
};

export const LeadershipOverview: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0b1326] text-[#dae2fd] p-4 sm:p-6 space-y-5 max-w-7xl mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#434655]/60 pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#dae2fd]">
            State-wide Crime Analytics
          </h1>
          <p className="text-[11px] text-[#8d90a0] mt-0.5">
            Karnataka State Police — Executive Dashboard
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 pulse-soft"></span>
          <span className="text-[10px] font-medium text-[#c3c6d7]">Live</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Activity} label="Active Field Queries" value={1482} sub="+12% from last shift" subColor="text-green-400" delay={0} />
        <KpiCard icon={AlertTriangle} label="Pending Verifications" value={3} sub="Requires SHO review" subColor="text-[#ffb77d]" delay={0.05} />
        <KpiCard icon={TrendingUp} label="Vector Match Rate" value={91} formattedValue="91.4%" sub="Cosine accuracy" subColor="text-green-400" delay={0.1} />
        <KpiCard icon={CheckCircle} label="Dossiers Exported" value={248} sub="Courtroom verified" delay={0.15} />
      </div>

      {/* Map + Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* District Map */}
        <div className="lg:col-span-2 bg-[#171f33] border border-[#434655]/60 p-4 rounded-xl space-y-3 fade-up">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#c3c6d7]" />
              Karnataka District Heatmap
            </h2>
            <span className="text-[10px] text-[#8d90a0]">Bengaluru & Mysuru priority</span>
          </div>

          <div className="h-64 bg-[#060e20] border border-[#434655]/40 rounded-lg p-3 relative overflow-hidden flex items-center justify-center">
            
            {/* Subtle grid */}
            <div 
              className="absolute inset-0 opacity-8 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #8d90a0 0.5px, transparent 0.5px)',
                backgroundSize: '16px 16px'
              }}
            />

            <div className="relative w-full h-full flex items-center justify-center">
              
              {/* Bengaluru */}
              <div className="absolute top-1/2 left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center spring-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center pulse-soft">
                    <span className="text-xs font-bold text-red-400">94%</span>
                  </div>
                  <div className="absolute inset-0 rounded-full bg-red-500/5 animate-ping" style={{ animationDuration: '3s' }}></div>
                </div>
                <span className="text-[10px] font-medium text-[#dae2fd] mt-1.5 bg-[#0b1326]/80 px-2 py-0.5 rounded border border-[#434655]/40">
                  Bengaluru Urban
                </span>
                <span className="text-[9px] text-[#8d90a0]">88 cases</span>
              </div>

              {/* Mysuru */}
              <div className="absolute top-[30%] left-[30%] flex flex-col items-center spring-in" style={{ animationDelay: '0.35s' }}>
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-amber-400">87%</span>
                </div>
                <span className="text-[9px] font-medium text-[#c3c6d7] mt-1">Mysuru</span>
                <span className="text-[8px] text-[#8d90a0]">34 cases</span>
              </div>

              {/* Hubballi */}
              <div className="absolute bottom-[25%] right-[28%] flex flex-col items-center spring-in" style={{ animationDelay: '0.5s' }}>
                <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-blue-400">82%</span>
                </div>
                <span className="text-[9px] font-medium text-[#c3c6d7] mt-1">Hubballi</span>
                <span className="text-[8px] text-[#8d90a0]">19 cases</span>
              </div>

              {/* Connection lines between zones */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="55%" y1="50%" x2="30%" y2="30%" stroke="#434655" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
                <line x1="55%" y1="50%" x2="72%" y2="75%" stroke="#434655" strokeWidth="1" strokeDasharray="3,3" opacity="0.3" />
              </svg>

            </div>
          </div>
        </div>

        {/* Priority Dispatches */}
        <div className="bg-[#171f33] border border-[#434655]/60 p-4 rounded-xl space-y-3 fade-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-sm font-semibold text-[#dae2fd] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#c3c6d7]" />
            Priority Dispatches
          </h2>

          <div className="space-y-2">
            {[
              { location: 'Malleshwaram 8th Cross', level: 'CRITICAL', levelColor: 'text-red-400', borderColor: 'border-red-500/60', desc: 'Suspect Karthik S. near Majestic transit.' },
              { location: 'Warehouse Sector 4', level: 'HIGH', levelColor: 'text-amber-400', borderColor: 'border-amber-500/60', desc: 'Signal jammer activity at cell tower 44-B.' },
              { location: 'Central Ledger Sync', level: 'ROUTINE', levelColor: 'text-[#b4c5ff]', borderColor: 'border-[#2563eb]/60', desc: '4 secondary hits verified across database.' },
            ].map((item, i) => (
              <div 
                key={i}
                className={`p-2.5 bg-[#131b2e] border-l-2 ${item.borderColor} rounded-r-md space-y-0.5 fade-up`}
                style={{ animationDelay: `${0.2 + i * 0.08}s` }}
              >
                <div className="flex justify-between items-center text-[11px] font-medium text-[#dae2fd]">
                  <span>{item.location}</span>
                  <span className={`text-[9px] font-mono ${item.levelColor}`}>{item.level}</span>
                </div>
                <p className="text-[10px] text-[#8d90a0]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
