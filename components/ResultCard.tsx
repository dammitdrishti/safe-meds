import React from 'react';
import { SafetyAnalysis, DrugIdentity } from '../types';
import { ShieldCheck, ShieldAlert, AlertOctagon, Info, RotateCcw, Thermometer, AlertTriangle, Pill, BrainCircuit, Activity } from 'lucide-react';

interface Props {
  identity: DrugIdentity;
  analysis: SafetyAnalysis;
  onReset: () => void;
}

const ResultCard: React.FC<Props> = ({ identity, analysis, onReset }) => {
  
  const config = {
    LOW: { 
      color: 'text-safe-600', 
      bg: 'bg-safe-50', 
      border: 'border-safe-200', 
      icon: ShieldCheck, 
      banner: 'bg-safe-500',
      title: 'Safe to Use',
      desc: 'No significant interactions found.'
    },
    MODERATE: { 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200', 
      icon: ShieldAlert, 
      banner: 'bg-amber-500',
      title: 'Use with Caution',
      desc: 'Potential interactions detected.'
    },
    HIGH: { 
      color: 'text-orange-600', 
      bg: 'bg-orange-50', 
      border: 'border-orange-200', 
      icon: AlertOctagon, 
      banner: 'bg-orange-500',
      title: 'High Risk Warning',
      desc: 'Significant health risks detected.'
    },
    CRITICAL: { 
      color: 'text-red-700', 
      bg: 'bg-red-50', 
      border: 'border-red-200', 
      icon: AlertOctagon, 
      banner: 'bg-red-600',
      title: 'Do Not Take',
      desc: 'Dangerous contraindications found.'
    },
  }[analysis.riskLevel] || { 
    color: 'text-gray-600', 
    bg: 'bg-gray-50', 
    border: 'border-gray-200', 
    icon: Info, 
    banner: 'bg-gray-500',
    title: 'Unknown Risk',
    desc: 'Consult a professional.'
  };

  const RiskIcon = config.icon;

  return (
    <div className="max-w-5xl mx-auto pb-16 animate-fade-in">
      
      {/* 1. Header & Identity */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 items-stretch">
        <div className="flex-1 bg-white rounded-[2rem] shadow-card border border-slate-100 p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-60 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
               <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">Detected Medication</span>
               {identity.confidence < 0.8 && (
                 <span className="text-amber-500 text-xs font-medium flex items-center gap-1">
                   <AlertTriangle className="w-3 h-3" /> Low Confidence
                 </span>
               )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              {identity.brandName || identity.genericName || "Unknown Drug"}
            </h1>
            <div className="text-lg font-medium text-slate-500 mt-2 flex items-center gap-2">
              <Pill className="w-4 h-4" />
              {identity.genericName && identity.genericName !== identity.brandName && (
                <span>{identity.genericName}</span>
              )}
              {identity.strength && (
                <span className="bg-slate-100 px-2 py-0.5 rounded text-sm text-slate-600">{identity.strength}</span>
              )}
            </div>
          </div>
        </div>

        {/* Risk Score */}
        <div className={`md:w-1/3 rounded-[2rem] shadow-lg overflow-hidden flex flex-col text-white ${config.banner} relative group`}>
           <div className="absolute inset-0 bg-black/10"></div>
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
           
           <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="bg-white/20 p-4 rounded-full mb-3 backdrop-blur-sm shadow-inner">
                <RiskIcon className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold">{config.title}</h2>
              <p className="text-white/80 text-sm mt-1 font-medium">{config.desc}</p>
           </div>
        </div>
      </div>

      {/* 2. Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Recommendation & Reasoning (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Recommendation Box */}
          <div className="bg-white rounded-[2rem] shadow-card border border-slate-100 p-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
             <div className="flex items-start gap-4">
               <div className="bg-gradient-to-br from-medical-50 to-white p-3 rounded-2xl border border-medical-100 shadow-sm shrink-0">
                 <BrainCircuit className="w-6 h-6 text-medical-600" />
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-900 mb-2">AI Analysis</h3>
                 <p className="text-slate-600 text-lg leading-relaxed">{analysis.summary}</p>
                 <div className="mt-4 pt-4 border-t border-slate-100">
                   <p className="font-bold text-slate-800 text-xl">"{analysis.recommendation}"</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Contraindications (If High Risk) */}
          {analysis.contraindications.length > 0 && (
            <div className={`rounded-[2rem] p-8 border ${analysis.riskLevel === 'LOW' ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
               <div className="flex items-center gap-3 mb-6">
                 <div className={`p-2 rounded-xl ${analysis.riskLevel === 'LOW' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                   <AlertOctagon className="w-6 h-6" />
                 </div>
                 <h3 className={`text-xl font-bold ${analysis.riskLevel === 'LOW' ? 'text-amber-900' : 'text-red-900'}`}>Risk Factors</h3>
               </div>
               <div className="space-y-3">
                 {analysis.contraindications.map((c, i) => (
                   <div key={i} className="flex gap-4 bg-white/60 p-4 rounded-xl items-start">
                     <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${analysis.riskLevel === 'LOW' ? 'bg-amber-500' : 'bg-red-500'}`}></span>
                     <p className={`font-medium ${analysis.riskLevel === 'LOW' ? 'text-amber-800' : 'text-red-800'}`}>{c}</p>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </div>

        {/* Right Column: Medical Facts (Span 1) */}
        <div className="space-y-6">
          
          {/* Purpose */}
          <div className="bg-white rounded-[2rem] shadow-card border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                  <Activity className="w-5 h-5" />
               </div>
               <h4 className="font-bold text-slate-800">Used For</h4>
             </div>
             <p className="text-slate-600 font-medium text-sm leading-relaxed">{analysis.purpose}</p>
          </div>

          {/* Side Effects */}
          <div className="bg-white rounded-[2rem] shadow-card border border-slate-100 p-6">
             <div className="flex items-center gap-3 mb-4">
               <div className="bg-slate-50 p-2 rounded-xl text-slate-600">
                  <Thermometer className="w-5 h-5" />
               </div>
               <h4 className="font-bold text-slate-800">Side Effects</h4>
             </div>
             <div className="flex flex-wrap gap-2">
               {analysis.sideEffects.map((effect, i) => (
                 <span key={i} className="text-xs bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg font-semibold">
                   {effect}
                 </span>
               ))}
             </div>
          </div>

          <button 
            onClick={onReset}
            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-200 transition-all flex items-center justify-center gap-2 group hover:-translate-y-1"
          >
            <RotateCcw className="w-5 h-5 group-hover:-rotate-180 transition-transform duration-700" />
            Scan New Item
          </button>

        </div>
      </div>
    </div>
  );
};

export default ResultCard;
