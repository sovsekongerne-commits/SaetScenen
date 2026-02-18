import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReactConfetti from 'react-confetti';
import { Team, GameState, GameStage } from './types';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { ScoringScreen } from './components/ScoringScreen';
import { WinnerScreen } from './components/WinnerScreen';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    stage: GameStage.SETUP,
    teams: [],
    currentScenario: null,
    history: [],
    roundNumber: 1,
    totalRounds: 5
  });

  // Global Burst State
  const [burstKey, setBurstKey] = useState(0);

  const triggerConfetti = () => {
    setBurstKey(prev => prev + 1);
  };

  const handleSetupComplete = (teams: Team[], rounds: number) => {
    setGameState(prev => ({
      ...prev,
      teams: teams,
      totalRounds: rounds,
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
    setGameState({
      stage: GameStage.SETUP,
      teams: [],
      currentScenario: null,
      history: [],
      roundNumber: 1,
      totalRounds: 5
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
    </div>
  );
};

export default App;