import React, { useState, useEffect } from 'react';
import { AppState, UserProfile, DrugIdentity, SafetyAnalysis } from './types';
import { DEFAULT_PROFILE } from './constants';
import UserProfileForm from './components/UserProfileForm';
import Scanner from './components/Scanner';
import ResultCard from './components/ResultCard';
import { identifyDrugFromImage, analyzeDrugSafety } from './services/geminiService';
import { fetchDrugData } from './services/fdaService';
import { Activity, ShieldCheck, User, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.PROFILE);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [drugIdentity, setDrugIdentity] = useState<DrugIdentity | null>(null);
  const [safetyAnalysis, setSafetyAnalysis] = useState<SafetyAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('safeMedsProfile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
        setAppState(AppState.SCAN); 
      } catch (e) {
        console.error("Failed to parse profile", e);
      }
    }
  }, []);

  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('safeMedsProfile', JSON.stringify(newProfile));
    setAppState(AppState.SCAN);
  };

  const handleImageCaptured = async (base64: string) => {
    setScannedImage(base64);
    setAppState(AppState.ANALYZING);
    setErrorMsg(null);

    try {
      setLoadingStep('Reading medication label...');
      const identity = await identifyDrugFromImage(base64);
      setDrugIdentity(identity);
      
      if (!identity.brandName && !identity.genericName) {
        throw new Error("Could not read the medication label. Please try scanning again.");
      }

      const drugName = identity.genericName || identity.brandName || "";
      
      setLoadingStep('Consulting FDA database...');
      const fdaData = await fetchDrugData(drugName);
      
      setLoadingStep('Checking your health compatibility...');
      const analysis = await analyzeDrugSafety(identity, profile, fdaData);
      setSafetyAnalysis(analysis);

      setAppState(AppState.RESULT);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  };

  const resetScan = () => {
    setScannedImage(null);
    setDrugIdentity(null);
    setSafetyAnalysis(null);
    setErrorMsg(null);
    setAppState(AppState.SCAN);
  };

  const navigateToProfile = () => {
    setAppState(AppState.PROFILE);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-medical-100 selection:text-medical-800 relative overflow-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0 bg-mesh opacity-60 pointer-events-none"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob"></div>
      <div className="fixed top-[10%] right-[-10%] w-[400px] h-[400px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-2000"></div>
      <div className="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[80px] opacity-40 animate-blob animation-delay-4000"></div>

      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass transition-all duration-300">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => appState !== AppState.ANALYZING && setAppState(AppState.SCAN)}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-medical-400 blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div className="bg-gradient-to-tr from-medical-600 to-medical-500 p-2.5 rounded-xl text-white shadow-lg relative z-10">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                Safe<span className="text-medical-600">Meds</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">AI Drug Safety</p>
            </div>
          </div>
          
          {appState !== AppState.PROFILE && (
            <button 
              onClick={navigateToProfile}
              className="group flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-all bg-white/50 hover:bg-white px-4 py-2 rounded-full border border-slate-200/60 hover:border-slate-300 shadow-sm hover:shadow-md"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 group-hover:bg-medical-100 group-hover:text-medical-600 transition-colors">
                <User className="w-3.5 h-3.5" />
              </div>
              My Profile
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-32 pb-16 relative z-10">
        
        {/* VIEW: Profile Form */}
        {appState === AppState.PROFILE && (
          <div className="animate-slide-up">
            <UserProfileForm initialProfile={profile} onSave={handleSaveProfile} />
          </div>
        )}

        {/* VIEW: Scanner */}
        {appState === AppState.SCAN && (
          <div className="animate-slide-up">
            <Scanner onImageCaptured={handleImageCaptured} />
          </div>
        )}

        {/* VIEW: Analyzing */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in text-center px-4 max-w-lg mx-auto">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-medical-500 rounded-full opacity-10 animate-ping"></div>
              <div className="absolute inset-0 bg-medical-400 rounded-full opacity-20 animate-pulse delay-75"></div>
              <div className="w-24 h-24 bg-white rounded-full shadow-float flex items-center justify-center relative z-10 border-4 border-white">
                <Sparkles className="w-10 h-10 text-medical-500 animate-spin-slow" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">{loadingStep}</h3>
            <p className="text-slate-500 text-base font-medium mb-10 leading-relaxed">
              Our AI is analyzing the label text, matching it with FDA data, and cross-referencing your health profile.
            </p>
            
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-medical-500 to-transparent w-1/2 h-full animate-scan"></div>
            </div>
          </div>
        )}

        {/* VIEW: Result */}
        {appState === AppState.RESULT && drugIdentity && safetyAnalysis && (
          <ResultCard 
            identity={drugIdentity} 
            analysis={safetyAnalysis} 
            onReset={resetScan}
          />
        )}

        {/* VIEW: Error */}
        {appState === AppState.ERROR && (
          <div className="max-w-md mx-auto mt-10 text-center bg-white p-12 rounded-[2rem] shadow-card border border-slate-100 animate-slide-up">
            <div className="bg-red-50 p-6 rounded-3xl w-24 h-24 mx-auto flex items-center justify-center mb-8 border border-red-100">
              <Activity className="w-10 h-10 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Analysis Failed</h3>
            <p className="text-slate-500 mb-10 leading-relaxed">
              {errorMsg || "We couldn't process this image. Please ensure the medication label is clearly visible and well-lit."}
            </p>
            <button 
              onClick={resetScan}
              className="w-full btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;