import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCw, CheckCircle, Camera, Sparkles, LogOut } from 'lucide-react';
import { Button } from './Button';
import { generateScenario } from '../services/geminiService';

interface GameScreenProps {
  scenario: string | null;
  setScenario: (scenario: string) => void;
  onFinished: () => void;
  roundNumber: number;
  totalRounds: number;
  onTriggerConfetti: () => void;
  onBack: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  scenario, 
  setScenario, 
  onFinished, 
  roundNumber,
  totalRounds,
  onTriggerConfetti,
  onBack
}) => {
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const fetchScenario = async () => {
    onTriggerConfetti();
    setLoading(true);
    const newScenario = await generateScenario();
    setScenario(newScenario);
    setLoading(false);
    setTimeLeft(null); 
  };

  useEffect(() => {
    if (!scenario) {
      // Intentionally not triggering confetti on initial load to avoid double burst from previous screen
      const initLoad = async () => {
          setLoading(true);
          const newScenario = await generateScenario();
          setScenario(newScenario);
          setLoading(false);
      }
      initLoad();
    }
  }, []);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const startTimer = (seconds: number) => {
    onTriggerConfetti();
    setTimeLeft(seconds);
  };

  const handleFinish = () => {
    onTriggerConfetti();
    onFinished();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-6xl mx-auto px-4 py-6 font-sans relative">
      
      {/* Top Navigation Bar */}
      <div className="w-full flex flex-wrap justify-between items-center mb-4 gap-4">
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
      <div className="flex-grow flex flex-col items-center justify-center w-full mb-8 relative min-h-[400px]">
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
              className="w-full text-center relative max-w-4xl"
            >
               {/* "Action" Starburst behind text */}
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>

              <div className="relative z-10 mb-8 inline-block">
                <div className="bg-black text-white px-6 py-2 rounded-full font-bold text-xl uppercase tracking-widest mb-4 inline-block -rotate-2 border-2 border-white shadow-lg">
                  Opgave:
                </div>
                
                {/* Comic Speech Bubble */}
                <div className="bg-white border-[6px] border-black p-10 md:p-16 rounded-[60px] shadow-pop relative">
                   <h1 className="text-5xl md:text-7xl font-black text-black leading-tight drop-shadow-sm font-display">
                    "{scenario}"
                   </h1>
                   {/* Little triangle for speech bubble */}
                   <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[30px] border-t-black"></div>
                   <div className="absolute -bottom-[26px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-t-[24px] border-t-white"></div>
                </div>
              </div>
              
              {/* Timer Display */}
              <AnimatePresence>
              {timeLeft !== null && timeLeft > 0 && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  className="mt-8 inline-block"
                >
                  <div className="bg-red-500 text-white font-black text-9xl w-64 h-64 rounded-full border-8 border-black flex items-center justify-center shadow-pop animate-pulse">
                    {timeLeft}
                  </div>
                </motion.div>
              )}

              {timeLeft === 0 && (
                 <motion.div 
                 initial={{ scale: 0.5, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: 1, rotate: [-5, 5, -5, 5, 0] }}
                 exit={{ scale: 0, opacity: 0 }}
                 onClick={() => setTimeLeft(null)}
                 className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm cursor-pointer"
               >
                 <div className="bg-yellow-400 border-8 border-black p-12 transform -rotate-6 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] mb-8">
                    <h1 className="text-9xl font-black text-black uppercase tracking-tighter">FRYS! 🥶</h1>
                 </div>
                 <p className="text-white font-black text-3xl animate-bounce drop-shadow-md bg-black/50 px-6 py-2 rounded-full border-2 border-white">
                   Tryk her for at fortsætte
                 </p>
               </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl z-20">
        <Button 
          variant="ghost" 
          onClick={fetchScenario} 
          disabled={loading || (timeLeft !== null && timeLeft > 0)}
          className="w-full bg-white"
        >
          <RefreshCw className="w-6 h-6" />
          Nyt Scenarie
        </Button>
        
        <Button 
          variant="secondary" 
          size="xl"
          onClick={() => startTimer(10)} 
          disabled={loading || (timeLeft !== null && timeLeft > 0)}
          className="w-full"
        >
          <Clock className="w-8 h-8" />
          10 Sekunder
        </Button>

        <Button 
          variant="success" 
          size="xl"
          onClick={handleFinish} 
          disabled={loading}
          className="w-full"
        >
          <Camera className="w-8 h-8" />
          Se Resultat
        </Button>
      </div>
    </div>
  );
};