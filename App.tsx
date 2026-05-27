import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactConfetti from 'react-confetti';
import { Maximize, Minimize, Volume2, VolumeX, Users } from 'lucide-react'; // Import icons
import { Team, GameState, GameStage } from './types';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ScoringScreen } from './components/ScoringScreen';
import { WinnerScreen } from './components/WinnerScreen';
import { useAudio } from './contexts/AudioContext';
import { GroupManager } from './components/groups/GroupManager';

const App: React.FC = () => {
  const { volume, setVolume, playClick } = useAudio();
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(1);

  // KlasseGrupper integration state
  const [isGroupManagerOpen, setIsGroupManagerOpen] = useState(false);
  const [setupStep, setSetupStep] = useState(0);

  const toggleMute = () => {
    playClick();
    if (isMuted || volume === 0) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 1);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.SETUP,
    teams: [],
    currentScenario: null,
    history: [],
    roundNumber: 1,
    totalRounds: 5,
    roundDuration: 120 // Default 2 minutes
  });

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Global Burst State
  const [burstKey, setBurstKey] = useState(0);

  // Listen for fullscreen changes (in case user uses Esc or F11)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const triggerConfetti = () => {
    setBurstKey(prev => prev + 1);
  };

  const handleSetupComplete = (teams: Team[], rounds: number, duration: number) => {
    setGameState(prev => ({
      ...prev,
      teams: teams,
      totalRounds: rounds,
      roundDuration: duration,
      stage: GameStage.SCENARIO,
      roundNumber: 1,
      currentScenario: null
    }));
  };

  const setScenario = (scenario: string) => {
    setGameState(prev => ({
      ...prev,
      currentScenario: scenario,
      history: [...prev.history, scenario]
    }));
  };

  const finishRound = () => {
    setGameState(prev => ({
      ...prev,
      stage: GameStage.JUDGING
    }));
  };

  const updateScore = (teamId: string, points: number) => {
    setGameState(prev => ({
      ...prev,
      teams: prev.teams.map(t => 
        t.id === teamId ? { ...t, score: t.score + points } : t
      )
    }));
  };

  const nextRound = () => {
    if (gameState.roundNumber >= gameState.totalRounds) {
      endGame();
    } else {
      setGameState(prev => ({
        ...prev,
        stage: GameStage.SCENARIO,
        currentScenario: null,
        roundNumber: prev.roundNumber + 1
      }));
    }
  };

  const endGame = () => {
    setGameState(prev => ({
      ...prev,
      stage: GameStage.WINNER
    }));
  };

  const restartGame = () => {
    setSetupStep(0);
    setGameState({
      stage: GameStage.SETUP,
      teams: [],
      currentScenario: null,
      history: [],
      roundNumber: 1,
      totalRounds: 5,
      roundDuration: 120
    });
  };

  // Simple render switch
  const renderStage = () => {
    switch (gameState.stage) {
      case GameStage.SETUP:
        return (
          <SetupScreen 
            onSetupComplete={handleSetupComplete}
            onTriggerConfetti={triggerConfetti}
            onStepChange={setSetupStep}
          />
        );
      case GameStage.SCENARIO:
        return (
          <GameScreen 
            scenario={gameState.currentScenario}
            setScenario={setScenario}
            onFinished={finishRound}
            roundNumber={gameState.roundNumber}
            totalRounds={gameState.totalRounds}
            roundDuration={gameState.roundDuration}
            onTriggerConfetti={triggerConfetti}
            onBack={restartGame}
          />
        );
      case GameStage.JUDGING:
        return (
          <ScoringScreen 
            teams={gameState.teams}
            onUpdateScore={updateScore}
            onNextRound={nextRound}
            onEndGame={endGame}
            roundNumber={gameState.roundNumber}
            onTriggerConfetti={triggerConfetti}
            onBack={restartGame}
          />
        );
      case GameStage.WINNER:
        return (
          <WinnerScreen 
            teams={gameState.teams}
            onRestart={restartGame}
            onTriggerConfetti={triggerConfetti}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans relative">
      
      {/* Volume Control */}
      <div className="fixed top-4 right-20 z-50 flex items-center gap-2 bg-white border-4 border-black p-2 rounded-xl shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
        <button onClick={toggleMute} className="text-black" title={isMuted || volume === 0 ? "Slå lyd til" : "Slå lyd fra"}>
          {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            setVolume(val);
            if (val > 0) setIsMuted(false);
          }} 
          className="w-20 md:w-24 accent-primary"
        />
      </div>

      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className="fixed top-4 right-4 z-50 bg-white text-black border-4 border-black p-3 rounded-xl shadow-pop hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        title={isFullscreen ? "Afslut fuld skærm" : "Fuld skærm"}
      >
        {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
      </button>

      {/* Global Burst Confetti */}
      {burstKey > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          <ReactConfetti
            key={burstKey}
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={300}
            gravity={0.3}
            initialVelocityY={20}
            colors={['#8b5cf6', '#f472b6', '#fbbf24', '#38bdf8', '#000000']}
          />
        </div>
      )}

      {/* Cartoon Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        {/* Big Yellow Blob */}
        <div className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-[#fbbf24] rounded-full border-4 border-black mix-blend-multiply filter blur-sm opacity-50 animate-float"></div>
        {/* Pink Blob */}
        <div className="absolute top-1/2 -left-20 w-[400px] h-[400px] bg-[#f472b6] rounded-full border-4 border-black mix-blend-multiply filter blur-sm opacity-50 animate-float" style={{animationDelay: '1s'}}></div>
        {/* Blue Square */}
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#38bdf8] rotate-12 border-4 border-black mix-blend-multiply filter blur-sm opacity-50 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col">
        {renderStage()}
      </main>

      {/* KlasseGrupper Integration */}
      <GroupManager isOpen={isGroupManagerOpen} onClose={() => setIsGroupManagerOpen(false)} />

      {/* KlasseGrupper Dual-Scale Triggers */}
      {gameState.stage === GameStage.SETUP && setupStep === 0 ? (
        <>
          {/* Playful Pointer Arrow and Text */}
          <div 
            className="fixed bottom-24 right-8 z-[80] select-none pointer-events-none flex flex-col items-end animate-wiggle"
            style={{ animationDuration: '3s' }}
          >
            <div className="bg-[#fbbf24] text-slate-900 font-black text-sm px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white rotate-[-4deg] tracking-wide flex items-center gap-1">
              <span>✨ Lav grupper her!</span>
            </div>
            <svg 
              width="40" 
              height="40" 
              viewBox="0 0 40 40" 
              fill="none" 
              className="text-[#fbbf24] stroke-current stroke-[3] drop-shadow-md mt-1 mr-10 translate-x-4"
            >
              <path 
                d="M10 5 Q 22 8, 25 25" 
                strokeLinecap="round" 
              />
              <path 
                d="M18 20 L 25 25 L 28 17" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
          </div>
          {/* Stor, legende lilla 3D-knap */}
          <button
            onClick={() => {
              playClick();
              setIsGroupManagerOpen(true);
            }}
            className="fixed bottom-6 right-6 z-[90] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-4 px-6 rounded-2xl shadow-[0_6px_0_#6d28d9] active:translate-y-[4px] active:shadow-[0_2px_0_#6d28d9] border-4 border-[#f5f3ff] font-black flex items-center gap-2 group cursor-pointer transition-all animate-float text-base sm:text-lg select-none"
          >
            <Users className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" />
            <span>Grupper 👥</span>
          </button>
        </>
      ) : (
        /* Lille diskret cirkelknap */
        <button
          onClick={() => {
            playClick();
            setIsGroupManagerOpen(true);
          }}
          className="fixed bottom-6 right-6 z-[90] bg-[#8b5cf6] hover:bg-[#7c3aed] text-white w-12 h-12 rounded-full shadow-[0_4px_0_#6d28d9] active:translate-y-[2px] active:shadow-[0_1px_0_#6d28d9] border-2 border-white/80 flex items-center justify-center group cursor-pointer transition-all hover:scale-105 select-none"
          title="Vis Grupper 👥"
        >
          <Users size={20} fill="currentColor" />
        </button>
      )}
    </div>
  );
};

export default App;