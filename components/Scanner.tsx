import React, { useRef, useState } from 'react';
import { Camera, Upload, ImageIcon, ScanLine, Smartphone, CheckCircle2, Zap, Sun, Type, Scan, FileImage } from 'lucide-react';

interface Props {
  onImageCaptured: (base64: string) => void;
}

const Scanner: React.FC<Props> = ({ onImageCaptured }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<'idle' | 'success'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      
      setUploadState('success');
      setTimeout(() => {
        onImageCaptured(base64Data);
      }, 1200); 
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in">
      
      {/* Hero Header */}
      <div className="text-center mb-12 space-y-4">
        <h2 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Scan Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-600 to-medical-400">Medication</span>
        </h2>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Upload a clear photo of any pill bottle, blister pack, or box. 
          Our AI instantly identifies the drug and checks for risks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        
        {/* Main Viewfinder Scanner */}
        <div 
          className={`lg:col-span-2 relative group cursor-pointer overflow-hidden rounded-[2.5rem] transition-all duration-500 min-h-[420px] flex flex-col items-center justify-center border-2 ${
            dragActive 
              ? 'bg-medical-50/50 border-medical-500 shadow-glow scale-[1.01]' 
              : 'bg-white border-slate-100 shadow-card hover:shadow-2xl hover:border-medical-200'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => uploadState === 'idle' && fileInputRef.current?.click()}
        >
           {/* Success State Overlay */}
           {uploadState === 'success' ? (
             <div className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-30"></div>
                  <div className="bg-green-100 p-6 rounded-full mb-6 relative z-10 animate-float">
                    <CheckCircle2 className="w-20 h-20 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">Upload Successful</h3>
                <p className="text-slate-500">Analysing image data...</p>
             </div>
           ) : (
             <>
               {/* Viewfinder Corners */}
               <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-slate-200 rounded-tl-3xl group-hover:border-medical-400 transition-colors duration-500"></div>
               <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-slate-200 rounded-tr-3xl group-hover:border-medical-400 transition-colors duration-500"></div>
               <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-slate-200 rounded-bl-3xl group-hover:border-medical-400 transition-colors duration-500"></div>
               <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-slate-200 rounded-br-3xl group-hover:border-medical-400 transition-colors duration-500"></div>

               {/* Background Effects */}
               <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

               <div className="relative z-10 text-center p-8 transition-transform duration-300 group-hover:-translate-y-2">
                 <div className="relative inline-block mb-10">
                   {/* Central Icon */}
                   <div className="relative w-32 h-32 flex items-center justify-center">
                     <div className="absolute inset-0 bg-medical-50 rounded-full border border-medical-100 group-hover:scale-110 transition-transform duration-500"></div>
                     <div className="absolute inset-0 bg-medical-100 rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                     <Camera className="w-14 h-14 text-medical-600 relative z-10" />
                     
                     {/* Scanning Animation Ring */}
                     <svg className="absolute inset-0 w-full h-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-700" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeDasharray="20 10" />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                          </linearGradient>
                        </defs>
                     </svg>
                   </div>
                 </div>

                 <h3 className="text-3xl font-bold text-slate-900 mb-3">Tap to Capture</h3>
                 <p className="text-slate-400 font-medium mb-8">or drag and drop image file</p>
                 
                 <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 rounded-full text-slate-600 text-sm font-semibold group-hover:bg-medical-50 group-hover:text-medical-700 transition-colors">
                   <FileImage className="w-4 h-4" />
                   <span>Supports JPG, PNG, HEIC</span>
                 </div>
               </div>
             </>
           )}

           <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*"
            capture="environment" 
            onChange={handleFileChange}
          />
        </div>

        {/* Side Panel: Instructions */}
        <div className="flex flex-col gap-6">
          
          {/* Quick Tips Box */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-card border border-slate-100 flex-1 flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full -mr-10 -mt-10 blur-3xl opacity-60 pointer-events-none"></div>
             
             <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-lg relative z-10">
               <div className="bg-amber-100 p-1.5 rounded-lg text-amber-600">
                 <Zap className="w-4 h-4 fill-current" />
               </div>
               Best Practices
             </h4>
             
             <div className="space-y-6 relative z-10">
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100 shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Use Bright Light</h5>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Avoid dark rooms or shadows covering the text.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100 shrink-0">
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">Focus on Text</h5>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Ensure the Brand Name and Dosage (e.g., 500mg) are clear.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4 items-start">
                  <div className="bg-slate-50 p-3 rounded-2xl text-slate-400 border border-slate-100 shrink-0">
                    <Scan className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-sm">One at a time</h5>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                      Scan one medication package per image for accuracy.
                    </p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
