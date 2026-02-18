import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle, Pause, Play, Plus, LogOut } from 'lucide-react';
import { Button } from './Button';
import { generateScenario } from '../services/geminiService';

interface GameScreenProps {
  scenario: string | null;
  setScenario: (scenario: string) => void;
  onFinished: () => void;
  roundNumber: number;
  totalRounds: number;
  roundDuration: number;
  onTriggerConfetti: () => void;
  onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  scenario, 
  setScenario, 
  onFinished, 
  roundNumber,
  totalRounds,
  roundDuration,
  onTriggerConfetti,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const fetchScenario = async () => {
    onTriggerConfetti();
    setLoading(true);
    const newScenario = await generateScenario();
    setScenario(newScenario);
    setLoading(false);
    setTimeLeft(roundDuration); // Auto start timer based on config
    setIsPaused(false);
  };

  useEffect(() => {
    // Initial load logic
    if (!scenario) {
      const initLoad = async () => {
          setLoading(true);
          const newScenario = await generateScenario();
          setScenario(newScenario);
          setLoading(false);
          setTimeLeft(roundDuration); 
          setIsPaused(false);
      }
      initLoad();
    } else if (timeLeft === null) {
      // If returning to screen with scenario but no timer (rare case), restart it
      setTimeLeft(roundDuration);
      setIsPaused(false);
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isPaused]);

  const handleFinish = () => {
    onTriggerConfetti();
    onFinished();
  }

  const togglePause = () => {
    if (timeLeft !== null && timeLeft > 0) {
      setIsPaused(!isPaused);
    }
  }

  const addTime = () => {
    setTimeLeft(prev => (prev !== null ? prev + 30 : 30));
    setIsPaused(false);
  };

  // Helper to format time as MM:SS if > 60, otherwise just SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) {
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return s;
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full max-w-7xl mx-auto px-4 py-4 font-sans relative min-h-screen">
      
      {/* Top Navigation Bar - Added pr-16 to avoid fullscreen button overlap */}
      <div className="w-full flex flex-wrap justify-between items-center mb-2 gap-4 flex-shrink-0 pr-16 sm:pr-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="bg-white border-2 border-black rounded-full px-4 py-2 font-bold shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Afslut
          </button>

          <div className="bg-white border-4 border-black px-4 py-2 rounded-xl shadow-pop -rotate-2">
            <span className="font-black text-lg">🎬 Runde {roundNumber}/{totalRounds}</span>
          </div>
        </div>

        <div className="flex space-x-2 hidden sm:flex">
           {[...Array(3)].map((_, i) => (
             <div key={i} className={`w-4 h-4 rounded-full border-2 border-black ${i < (roundNumber % 3) + 1 ? 'bg-yellow-400' : 'bg-white'}`}></div>
           ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col items-center justify-center w-full relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 border-8 border-black border-t-yellow-400 rounded-full animate-spin mb-8"></div>
              <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-pop">
                 <h2 className="text-4xl font-black text-black animate-pulse">
                   Tænker så det knager... 🤔
                 </h2>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="scenario"
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="w-full text-center relative max-w-6xl px-2"
            >
               {/* "Action" Starburst behind text */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] aspect-square max-w-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0 pointer-events-none"></div>

              <div className="relative z-10 mb-8 inline-block w-full">
                <div className="flex justify-center mb-2">
                    <div className="bg-black text-white px-8 py-3 rounded-full font-bold text-2xl uppercase tracking-widest inline-block -rotate-2 border-2 border-white shadow-lg">
                    Opgave:
                    </div>
                </div>
                
                {/* Comic Speech Bubble - Increased min-height and padding */}
                <div className="bg-white border-[6px] border-black p-10 md:p-16 pb-20 md:pb-24 rounded-[40px] md:rounded-[60px] shadow-pop relative min-h-[400px] flex items-center justify-center">
                   {/* Increased Font Size */}
                   <h1 className="text-5xl md:text-7xl font-black text-black leading-tight drop-shadow-sm font-display break-words w-full">
                    "{scenario}"
                   </h1>
                   
                   {/* Little triangle for speech bubble */}
                   <div className="absolute -bottom-8 left-1/4 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[30px] border-t-black"></div>
                   <div className="absolute -bottom-[26px] left-1/4 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[24px] border-t-white"></div>

                    {/* Timer Display - ABSOLUTE POSITIONED ON CARD - REDUCED SIZE */}
                    <AnimatePresence>
                    {timeLeft !== null && timeLeft > 0 && (
                        <motion.div 
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0 }}
                            className="absolute -bottom-6 -right-2 md:-bottom-8 md:-right-4 z-30 flex items-end gap-2"
                        >
                            {/* Add Time Button (Smaller) */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); addTime(); }}
                                className="bg-blue-400 text-white w-12 h-12 rounded-full border-4 border-black flex items-center justify-center shadow-pop hover:bg-blue-500 mb-4"
                                title="Læg 30 sekunder til"
                                >
                                <span className="font-black text-xs flex flex-col items-center leading-none">
                                    <Plus className="w-4 h-4" />
                                    30s
                                </span>
                            </motion.button>

                            {/* Main Timer Clock - REDUCED SIZE */}
                            <motion.button 
                                onClick={togglePause}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`text-white font-black rounded-full border-8 border-black flex flex-col items-center justify-center shadow-pop cursor-pointer hover:shadow-pop-hover transition-all w-24 h-24 md:w-36 md:h-36 ${isPaused ? 'bg-slate-400' : timeLeft <= 10 ? 'bg-red-600 animate-pulse' : 'bg-red-500'}`}
                            >
                                <span className="text-3xl md:text-5xl">{formatTime(timeLeft)}</span>
                                <span className="text-xs md:text-sm uppercase tracking-widest opacity-80 flex items-center gap-1">
                                    {isPaused ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                                    {isPaused ? "Start" : "Pause"}
                                </span>
                            </motion.button>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
              </div>
              
              {/* Frozen Overlay */}
              <AnimatePresence>
              {timeLeft === 0 && (
                 <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: 1, rotate: [-5, 5, -5, 5, 0] }}
                 exit={{ scale: 0, opacity: 0 }}
                 className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/80 backdrop-blur-sm"
               >
                 <div className="bg-yellow-400 border-8 border-black p-12 transform -rotate-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] mb-12">
                    <h1 className="text-9xl font-black text-black uppercase tracking-tighter">FRYS! 🥶</h1>
                 </div>
                 
                 <div className="flex flex-col gap-6 w-full max-w-md px-4">
                    {/* Main Finish Button on Overlay */}
                    <Button 
                        variant="success" 
                        size="xl"
                        wiggle
                        onClick={(e) => { e.stopPropagation(); handleFinish(); }}
                        className="w-full text-2xl animate-bounce-slow shadow-pop-hover border-4"
                    >
                        <CheckCircle className="w-8 h-8 mr-2" />
                        Afslut Runde & Giv Point
                    </Button>

                    {/* Add Time Button */}
                    <Button 
                        variant="secondary"
                        onClick={(e) => { e.stopPropagation(); addTime(); }}
                        className="w-full shadow-pop"
                    >
                        <Plus className="w-6 h-6 mr-2" />
                        Vi mangler tid! (+30s)
                    </Button>
                 </div>
               </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl z-20 flex-shrink-0 mt-4">
        <Button 
          variant="ghost" 
          onClick={fetchScenario} 
          disabled={loading}
          className="w-full bg-white"
        >
          <RefreshCw className="w-6 h-6" />
          Nyt Scenarie
        </Button>
        
        <Button 
          variant="success" 
          size="xl"
          onClick={handleFinish} 
          disabled={loading}
          className="w-full"
        >
          <CheckCircle className="w-8 h-8" />
          Afslut Runde
        </Button>
      </div>
    </div>
  );
};