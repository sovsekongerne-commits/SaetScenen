import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, RefreshCcw, Crown, Medal } from 'lucide-react';
import { Team } from '../types';
import { Button } from './Button';
import ReactConfetti from 'react-confetti';

interface WinnerScreenProps {
  teams: Team[];
  onRestart: () => void;
  onTriggerConfetti: () => void;
}

export const WinnerScreen: React.FC<WinnerScreenProps> = ({ teams, onRestart, onTriggerConfetti }) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];
  const isDraw = sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score;

  const handleRestart = () => {
    onTriggerConfetti();
    onRestart();
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden font-sans">
      <ReactConfetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false}
        numberOfPieces={800}
        gravity={0.15}
        colors={['#8b5cf6', '#f472b6', '#fbbf24', '#38bdf8', '#000000']}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.5, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
        className="text-center z-10 w-full max-w-2xl"
      >
        <div className="relative inline-block mb-12">
            <div className="absolute inset-0 bg-yellow-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-white p-10 rounded-full border-8 border-black shadow-pop rotate-3">
               <Trophy className="w-32 h-32 text-yellow-500 fill-yellow-500 animate-bounce-slow" />
            </div>
            <div className="absolute -top-6 -right-6 bg-red-500 text-white font-black px-6 py-2 rounded-xl border-4 border-black rotate-12 shadow-sm">
                VINDER!
            </div>
        </div>
        
        <h2 className="text-3xl font-black text-slate-500 mb-4 uppercase tracking-widest bg-white inline-block px-4 py-1 rounded-lg border-2 border-black">
          {isDraw ? "Det står helt lige!" : "Og vinderen er..."}
        </h2>
        
        <div className="bg-white border-8 border-black p-8 rounded-[40px] shadow-pop mb-12 transform -rotate-2 hover:rotate-0 transition-transform">
            <h1 className="text-6xl md:text-8xl font-black text-primary mb-4 drop-shadow-sm font-display">
            {isDraw ? "UAFGJORT!" : winner.name}
            </h1>
            <div className="text-4xl font-black text-black inline-block bg-yellow-300 px-8 py-2 rounded-2xl border-4 border-black">
            {winner.score} Point
            </div>
        </div>
      </motion.div>

      {/* Leaderboard for others */}
      <div className="w-full max-w-lg bg-white border-4 border-black rounded-3xl p-6 shadow-pop mb-12 z-10">
        <h3 className="text-black font-black uppercase text-lg mb-4 tracking-wider flex items-center gap-2">
            <Crown className="w-6 h-6" /> Stillingen
        </h3>
        <div className="space-y-3">
          {sortedTeams.slice(0, 5).map((team, index) => (
            <div key={team.id} className="flex items-center justify-between p-3 border-b-2 border-slate-100 last:border-0">
               <div className="flex items-center gap-4">
                 <div className={`font-black w-8 h-8 flex items-center justify-center rounded-lg border-2 border-black ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-slate-300' : index === 2 ? 'bg-amber-600' : 'bg-slate-100'}`}>
                   {index + 1}
                 </div>
                 <span className="font-bold text-xl text-black font-hand">{team.name}</span>
               </div>
               <span className="font-black text-xl text-primary">{team.score} p</span>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={handleRestart} size="xl" variant="success" wiggle className="shadow-pop z-10 text-2xl">
        <RefreshCcw className="w-8 h-8 mr-3" />
        Spil Igen!
      </Button>
    </div>
  );
};