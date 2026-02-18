import React, { useState } from 'react';
import { Play, ArrowRight, ArrowLeft, Star, Smile, Zap, Crown } from 'lucide-react';
import { Team } from '../types';
import { Button } from './Button';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import ReactConfetti from 'react-confetti';

interface SetupScreenProps {
  onSetupComplete: (teams: Team[], rounds: number) => void;
  onTriggerConfetti: () => void;
}

enum SetupStep {
  WELCOME = 0,
  TEAM_COUNT = 1,
  TEAM_NAMES = 2,
  ROUND_COUNT = 3
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onSetupComplete, onTriggerConfetti }) => {
  const [step, setStep] = useState<SetupStep>(SetupStep.WELCOME);
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['', '']);
  const [roundCount, setRoundCount] = useState<number>(5);

  const handleStartClick = () => {
    onTriggerConfetti();
    setStep(SetupStep.TEAM_COUNT);
  };

  const handleTeamCountSelect = (count: number) => {
    onTriggerConfetti();
    setTeamCount(count);
    const newNames = Array(count).fill('').map((_, i) => teamNames[i] || '');
    setTeamNames(newNames);
    setStep(SetupStep.TEAM_NAMES);
  };

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...teamNames];
    newNames[index] = value;
    setTeamNames(newNames);
  };

  const handleNamesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerConfetti();
    const finalNames = teamNames.map((name, i) => name.trim() || `Hold ${i + 1}`);
    setTeamNames(finalNames);
    setStep(SetupStep.ROUND_COUNT);
  };

  const handleRoundCountSelect = (rounds: number) => {
    onTriggerConfetti();
    setRoundCount(rounds);
    finishSetup(rounds);
  };

  const finishSetup = (rounds: number) => {
    const teams: Team[] = teamNames.map(name => ({
      id: uuidv4(),
      name: name.trim() || "Navnløst Hold",
      score: 0
    }));
    onSetupComplete(teams, rounds);
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const variants = {
    enter: { opacity: 0, scale: 0.8, rotate: -5 },
    center: { opacity: 1, scale: 1, rotate: 0 },
    exit: { opacity: 0, scale: 1.1, rotate: 5 }
  };

  // Fun helper to give random rotation
  const randRot = () => Math.random() * 6 - 3;

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 flex flex-col h-full justify-center min-h-screen relative font-sans">
      {/* Constant Confetti for Welcome Screen */}
      {step === SetupStep.WELCOME && (
         <div className="fixed inset-0 pointer-events-none">
           <ReactConfetti
             width={window.innerWidth}
             height={window.innerHeight}
             recycle={true} // Constant looping
             numberOfPieces={150}
             gravity={0.1}
             colors={['#8b5cf6', '#f472b6', '#fbbf24', '#38bdf8', '#000000']}
           />
         </div>
      )}

      {step > 0 && (
        <button 
          onClick={goBack}
          className="absolute top-8 left-4 md:left-8 flex items-center bg-white border-2 border-black rounded-full px-4 py-2 font-bold shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Tilbage
        </button>
      )}

      <AnimatePresence mode="wait">
        
        {/* STEP 0: WELCOME */}
        {step === SetupStep.WELCOME && (
          <motion.div
            key="welcome"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="text-center flex flex-col items-center"
          >
            <div className="relative mb-8">
               <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-20"></div>
               <div className="relative bg-white border-4 border-black p-8 rounded-full shadow-pop rotate-3">
                 <Smile className="w-24 h-24 text-purple-600" strokeWidth={2.5} />
               </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black text-black mb-12 drop-shadow-md tracking-tighter"
                style={{ WebkitTextStroke: '2px white' }}>
              Sæt Scenen!
            </h1>
            
            <Button 
              onClick={handleStartClick} 
              size="xl" 
              variant="success"
              wiggle={true}
              className="min-w-[300px] text-3xl"
            >
              Start Spillet!
              <Play className="w-8 h-8 ml-2 fill-current" />
            </Button>
          </motion.div>
        )}

        {/* STEP 1: TEAM COUNT */}
        {step === SetupStep.TEAM_COUNT && (
          <motion.div
            key="count"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-3xl mx-auto text-center"
          >
            <div className="bg-white border-4 border-black rounded-3xl p-8 shadow-pop mb-12 inline-block -rotate-1">
               <h2 className="text-4xl font-black text-black mb-2">Hvor mange hold er I? 🔢</h2>
               <p className="text-xl font-hand font-bold text-slate-500">I skal være ca. 4-6 elever på hvert hold.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[2, 3, 4, 5, 6, 7].map((num) => (
                <motion.button
                  key={num}
                  whileHover={{ scale: 1.05, rotate: randRot() }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTeamCountSelect(num)}
                  className="bg-white border-4 border-black rounded-3xl p-6 shadow-pop hover:bg-sky-100 flex flex-col items-center justify-center min-h-[160px]"
                >
                  <span className="text-7xl font-black text-primary mb-2 drop-shadow-sm">{num}</span>
                  <span className="text-black font-bold uppercase tracking-wider text-lg bg-yellow-300 px-3 py-1 rounded-full border-2 border-black">Hold</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* STEP 2: TEAM NAMES */}
        {step === SetupStep.TEAM_NAMES && (
          <motion.div
            key="names"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full max-w-3xl mx-auto"
          >
             <div className="text-center mb-8">
                <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-pop inline-block rotate-2">
                   <h2 className="text-4xl font-black text-black">Navngiv Holdene! 🏷️</h2>
                </div>
             </div>

            <form onSubmit={handleNamesSubmit} className="space-y-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamNames.map((name, index) => (
                  <motion.div 
                    key={index} 
                    className="relative"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="absolute -left-3 -top-3 w-10 h-10 rounded-full bg-yellow-400 border-4 border-black flex items-center justify-center font-black text-lg z-10 shadow-sm">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      placeholder={`Holdnavn ${index + 1}...`}
                      autoFocus={index === 0}
                      className="w-full pl-10 pr-4 py-5 text-2xl font-bold font-hand bg-white border-4 border-black rounded-2xl focus:bg-yellow-50 focus:shadow-pop-hover outline-none transition-all placeholder:text-slate-300 text-black shadow-pop"
                    />
                  </motion.div>
                ))}
              </div>
              
              <div className="flex justify-center mt-12">
                <Button type="submit" size="xl" variant="accent" wiggle className="shadow-pop">
                  Så kører vi!
                  <ArrowRight className="w-8 h-8 ml-2" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: ROUND COUNT */}
        {step === SetupStep.ROUND_COUNT && (
          <motion.div
             key="rounds"
             variants={variants}
             initial="enter"
             animate="center"
             exit="exit"
             className="w-full max-w-3xl mx-auto text-center"
           >
             <div className="mb-10">
                <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-pop inline-block -rotate-1">
                   <h2 className="text-4xl font-black text-black">Hvor længe skal vi lege? ⏱️</h2>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
               {[
                 { count: 3, label: "Lyn-runde", desc: "⚡ Hurtig pause", color: "bg-green-100", icon: <Zap className="w-8 h-8" /> },
                 { count: 5, label: "Standard", desc: "👍 Helt perfekt", color: "bg-blue-100", icon: <Smile className="w-8 h-8" /> },
                 { count: 8, label: "Lang leg", desc: "⭐ God tid", color: "bg-purple-100", icon: <Star className="w-8 h-8" /> },
                 { count: 12, label: "Marathon", desc: "👑 Det store show", color: "bg-orange-100", icon: <Crown className="w-8 h-8" /> }
               ].map((opt) => (
                 <motion.button
                   key={opt.count}
                   whileHover={{ scale: 1.05, rotate: randRot() }}
                   whileTap={{ scale: 0.95 }}
                   onClick={() => handleRoundCountSelect(opt.count)}
                   className={`relative border-4 border-black rounded-3xl p-6 shadow-pop hover:shadow-pop-hover flex flex-col items-center justify-center text-left ${opt.color}`}
                 >
                   <div className="absolute top-4 right-4 text-black opacity-50">{opt.icon}</div>
                   <span className="text-6xl font-black mb-2 text-black">{opt.count}</span>
                   <span className="font-black text-xl uppercase tracking-tight">{opt.label}</span>
                   <span className="text-sm font-hand font-bold mt-1 text-slate-700">{opt.desc}</span>
                 </motion.button>
               ))}
             </div>
           </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};