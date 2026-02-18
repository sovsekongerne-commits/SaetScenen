import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Star, ThumbsUp, LogOut } from 'lucide-react';
import { Team } from '../types';
import { Button } from './Button';
import ReactConfetti from 'react-confetti';

interface ScoringScreenProps {
  teams: Team[];
  onUpdateScore: (teamId: string, points: number) => void;
  onNextRound: () => void;
  onEndGame: () => void;
  roundNumber: number;
  onTriggerConfetti: () => void;
  onBack: () => void;
}

export const ScoringScreen: React.FC<ScoringScreenProps> = ({ 
  teams, 
  onUpdateScore, 
  onNextRound, 
  onEndGame,
  roundNumber,
  onTriggerConfetti,
  onBack
}) => {
  
  const handleScore = (teamId: string, points: number) => {
    onTriggerConfetti();
    onUpdateScore(teamId, points);
  }

  const handleNext = () => {
    onTriggerConfetti();
    onNextRound();
  }

  const handleEnd = () => {
    onTriggerConfetti();
    onEndGame();
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-4 py-8 flex flex-col h-full font-sans relative">
      
      {/* Top Bar with Back Button */}
      <div className="w-full flex justify-start mb-4">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-black rounded-full px-4 py-2 font-bold shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2 text-sm"
        >
          <LogOut className="w-4 h-4" />
          Afslut Spil
        </button>
      </div>

      <div className="text-center mb-10 relative mt-2">
        <div className="inline-block bg-white border-4 border-black px-8 py-4 rounded-full shadow-pop rotate-1">
          <h2 className="text-xl font-bold uppercase tracking-widest text-slate-500">Runde {roundNumber}</h2>
          <h1 className="text-5xl font-black text-black mt-1">Hvem var bedst? 🏆</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 overflow-y-auto pb-4 px-2">
        {teams.map((team, index) => (
          <motion.div
            layout
            key={team.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-3xl border-4 border-black p-6 shadow-pop flex flex-col items-center relative overflow-hidden ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}
          >
             {/* Header */}
             <div className="w-full flex items-center justify-between mb-4 border-b-4 border-slate-100 pb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400 border-2 border-black flex items-center justify-center font-black text-xl">
                   {index + 1}
                </div>
                <div className="flex items-center gap-2 bg-black text-white px-3 py-1 rounded-lg">
                   <Star className="w-4 h-4 fill-current" />
                   <span className="font-bold">{team.score}</span>
                </div>
             </div>
             
             <h3 className="text-3xl font-black text-center mb-6 break-words w-full font-hand">{team.name}</h3>
             
             <div className="grid grid-cols-3 gap-3 w-full mt-auto">
                <button 
                  onClick={() => handleScore(team.id, 1)}
                  className="bg-green-100 hover:bg-green-200 border-2 border-black text-black font-black py-4 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none flex flex-col items-center"
                >
                  <span className="text-xl">+1</span>
                  <span className="text-[10px] uppercase">God</span>
                </button>
                <button 
                  onClick={() => handleScore(team.id, 3)}
                  className="bg-blue-100 hover:bg-blue-200 border-2 border-black text-black font-black py-4 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none flex flex-col items-center"
                >
                   <span className="text-xl">+3</span>
                   <span className="text-[10px] uppercase">Super</span>
                </button>
                <button 
                  onClick={() => handleScore(team.id, 5)}
                  className="bg-purple-100 hover:bg-purple-200 border-2 border-black text-black font-black py-4 rounded-xl transition-all hover:-translate-y-1 active:translate-y-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none flex flex-col items-center"
                >
                   <span className="text-xl">+5</span>
                   <span className="text-[10px] uppercase">Episk!</span>
                </button>
             </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-auto flex flex-col md:flex-row justify-center gap-6 items-center">
        <Button onClick={handleEnd} variant="ghost" size="lg" className="bg-transparent border-transparent shadow-none hover:bg-slate-200/50">
          Afslut Spil
        </Button>
        <Button onClick={handleNext} variant="primary" size="xl" wiggle className="shadow-pop">
          Næste Runde
          <ArrowRight className="w-8 h-8 ml-2" />
        </Button>
      </div>
    </div>
  );
};