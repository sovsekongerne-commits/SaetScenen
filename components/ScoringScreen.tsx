import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Star, ThumbsUp, LogOut, Zap } from 'lucide-react';
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

  // Determine layout density based on team count
  const teamCount = teams.length;
  const showDetails = teamCount <= 8;
  const isCrowded = teamCount > 6;

  // Dynamic Grid Layout Generator
  const getGridClass = () => {
    const mobile = teamCount <= 3 ? "grid-cols-1" : "grid-cols-2";
    if (teamCount <= 2) return `${mobile} md:grid-cols-2 md:grid-rows-1`;
    if (teamCount === 3) return `${mobile} md:grid-cols-3 md:grid-rows-1`;
    if (teamCount === 4) return "grid-cols-2 grid-rows-2";
    if (teamCount <= 6) return "grid-cols-2 md:grid-cols-3 md:grid-rows-2";
    if (teamCount <= 8) return "grid-cols-2 md:grid-cols-4 md:grid-rows-2";
    return "grid-cols-2 md:grid-cols-4 md:grid-rows-3";
  };

  // Dynamic Styling based on density
  const cardPadding = isCrowded ? "p-2 md:p-3" : "p-4 md:p-5";
  const buttonHeightClass = teamCount <= 4 ? "h-24 md:h-32" : teamCount <= 6 ? "h-20 md:h-24" : "h-14 md:h-16";
  const buttonTextSize = teamCount <= 4 ? "text-3xl" : "text-xl";

  // Calculate Ranks dynamically
  // We create a sorted copy to find out where each team stands
  const sortedScores = [...teams].sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col h-screen max-h-screen w-full max-w-[1800px] mx-auto px-4 py-2 font-sans relative overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex-shrink-0 w-full flex justify-between items-center mb-2 z-20">
        <button 
          onClick={onBack}
          className="bg-white border-2 border-black rounded-full px-3 py-1 font-bold shadow-pop hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all flex items-center gap-2 text-xs md:text-sm"
        >
          <LogOut className="w-3 h-3 md:w-4 md:h-4" />
          Afslut
        </button>

         <div className="bg-white border-2 border-black px-6 py-2 rounded-xl shadow-pop -rotate-1 hidden md:block">
          <span className="font-bold text-sm uppercase tracking-widest text-slate-500 mr-2">Runde {roundNumber}</span>
          <span className="font-black text-xl text-black">Giv Point 🏆</span>
        </div>
        
        <div className="w-20 hidden md:block"></div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-grow flex flex-col w-full min-h-0 relative z-10 py-1">
        <div className={`grid gap-3 md:gap-6 w-full h-full ${getGridClass()}`}>
          {teams.map((team, index) => {
            // Find rank
            const rank = sortedScores.findIndex(t => t.id === team.id) + 1;

            return (
              <motion.div
                layout
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-3xl border-4 border-black ${cardPadding} shadow-pop flex flex-col relative overflow-hidden h-full`}
              >
                 {/* Top Row: Rank (Left) and Name (Right) */}
                 <div className="w-full flex items-start justify-between mb-1 relative z-10">
                    {/* Rank Badge - Top Left */}
                    <div className="flex flex-col items-center bg-yellow-400 border-2 border-black rounded-xl px-2 py-1 shadow-sm transform -rotate-3 origin-top-left flex-shrink-0 z-20">
                       <span className="text-[10px] md:text-xs font-black uppercase leading-none tracking-widest">Rank</span>
                       <span className="text-xl md:text-2xl font-black leading-none">#{rank}</span>
                    </div>

                    {/* Team Name - Right Aligned - INCREASED SIZE */}
                    <div className="flex-1 pl-3 text-right">
                       <h3 className="text-3xl md:text-5xl font-black font-hand leading-none tracking-wide line-clamp-2 drop-shadow-sm">
                         {team.name}
                       </h3>
                    </div>
                 </div>
                 
                 {/* Center: BIG SCORE */}
                 <div className="flex-grow flex flex-col items-center justify-center relative z-0 -mt-2">
                    <div className="relative">
                        <Star className="w-16 h-16 md:w-24 md:h-24 text-yellow-300 fill-yellow-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-50" />
                        <span className="text-6xl md:text-8xl font-black text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,1)] relative z-10 font-display">
                          {team.score}
                        </span>
                    </div>
                    <span className="text-xs md:text-sm font-bold uppercase text-slate-400 tracking-[0.2em] bg-white/80 px-2 rounded-full">Point</span>
                 </div>
                 
                 {/* Bottom: Scoring Buttons */}
                 <div className={`grid grid-cols-3 gap-2 md:gap-3 w-full mt-auto flex-shrink-0 pt-2`}>
                    
                    {/* +1 Button */}
                    <button 
                      onClick={() => handleScore(team.id, 1)}
                      className={`group bg-green-100 hover:bg-green-300 border-b-4 border-r-4 border-black active:border-b-0 active:border-r-0 border-t-2 border-l-2 rounded-2xl transition-all active:translate-y-1 active:translate-x-1 flex flex-col items-center justify-center ${buttonHeightClass}`}
                    >
                      <span className={`${buttonTextSize} font-black text-black leading-none mb-1 group-hover:scale-110 transition-transform`}>+1</span>
                      {showDetails && (
                          <div className="flex flex-col items-center">
                              <ThumbsUp className={`${isCrowded ? 'w-3 h-3' : 'w-5 h-5'} mb-0.5 text-green-700`} />
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-green-800 hidden md:block">God</span>
                          </div>
                      )}
                    </button>

                    {/* +3 Button */}
                    <button 
                      onClick={() => handleScore(team.id, 3)}
                      className={`group bg-blue-100 hover:bg-blue-300 border-b-4 border-r-4 border-black active:border-b-0 active:border-r-0 border-t-2 border-l-2 rounded-2xl transition-all active:translate-y-1 active:translate-x-1 flex flex-col items-center justify-center ${buttonHeightClass}`}
                    >
                       <span className={`${buttonTextSize} font-black text-black leading-none mb-1 group-hover:scale-110 transition-transform`}>+3</span>
                       {showDetails && (
                          <div className="flex flex-col items-center">
                              <Zap className={`${isCrowded ? 'w-3 h-3' : 'w-5 h-5'} mb-0.5 text-blue-700 fill-current`} />
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-blue-800 hidden md:block">Super</span>
                          </div>
                      )}
                    </button>

                    {/* +5 Button */}
                    <button 
                      onClick={() => handleScore(team.id, 5)}
                      className={`group bg-purple-100 hover:bg-purple-300 border-b-4 border-r-4 border-black active:border-b-0 active:border-r-0 border-t-2 border-l-2 rounded-2xl transition-all active:translate-y-1 active:translate-x-1 flex flex-col items-center justify-center ${buttonHeightClass}`}
                    >
                       <span className={`${buttonTextSize} font-black text-black leading-none mb-1 group-hover:scale-110 transition-transform`}>+5</span>
                       {showDetails && (
                          <div className="flex flex-col items-center">
                              <Trophy className={`${isCrowded ? 'w-3 h-3' : 'w-5 h-5'} mb-0.5 text-purple-700 fill-current`} />
                              <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-purple-800 hidden md:block">Episk</span>
                          </div>
                      )}
                    </button>
                 </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex-shrink-0 mt-2 mb-2 flex flex-row justify-center gap-4 items-center z-20">
        <Button onClick={handleEnd} variant="ghost" size="md" className="bg-transparent border-transparent shadow-none hover:bg-slate-200/50 text-sm hidden sm:flex opacity-50 hover:opacity-100">
          Afslut Spil
        </Button>
        <Button onClick={handleNext} variant="primary" size="lg" wiggle className="shadow-pop text-xl py-4 px-16 md:text-3xl md:px-24 border-[5px]">
          Næste Runde
          <ArrowRight className="w-8 h-8 md:w-10 md:h-10 ml-3" />
        </Button>
      </div>
    </div>
  );
};