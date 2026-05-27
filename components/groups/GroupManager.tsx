import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface GroupManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GroupManager: React.FC<GroupManagerProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Vælg automatisk URL baseret på om der testes lokalt eller køres i produktion
  const widgetUrl = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:5173/?embed=true'
      : 'https://grupper.kongskole.dk/?embed=true';

  // Lyt efter 'KONG_WIDGET_CLOSE' besked sendt indefra i-framen (når der trykkes på luk)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'KONG_WIDGET_CLOSE') {
        onClose();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClose]);

  // Nulstil loading-hjulet når panelet genåbnes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Mørk baggrunds-sløring (Overlay) */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[140] transition-opacity duration-300 animate-fade-in"
      />
      {/* Slide-over panel fra højre */}
      <div 
        className="fixed right-0 top-0 h-full w-full max-w-[460px] bg-slate-900 border-l border-white/10 text-white z-[150] shadow-2xl flex flex-col transform transition-transform duration-300 animate-slide-in font-sans overflow-hidden"
      >
        {/* Header med uafhængig lukkeknap */}
        <div className="px-6 pt-5 pb-3 flex justify-between items-center border-b border-white/10 bg-slate-950/80 backdrop-blur-md select-none shrink-0">
          <h1 className="text-xl font-black text-sky-400 tracking-tight flex items-center gap-2">
            KlasseGrupper 👥
          </h1>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/5"
            title="Luk"
          >
            <X size={16} />
          </button>
        </div>
        {/* Iframe Viewport */}
        <div className="flex-1 relative bg-slate-950">
          {/* Indlæsnings-hjul mens iframe hentes */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-400 z-10 space-y-3">
              <Loader2 className="animate-spin text-sky-400" size={36} />
              <span className="text-xs font-bold uppercase tracking-wider animate-pulse">Henter holddelingsværktøj...</span>
            </div>
          )}
          <iframe
            src={widgetUrl}
            title="KlasseGrupper Widget"
            className="w-full h-full border-none bg-transparent"
            onLoad={() => setIsLoading(false)}
            allow="clipboard-read; clipboard-write; fullscreen"
          />
        </div>
      </div>
    </>
  );
};
