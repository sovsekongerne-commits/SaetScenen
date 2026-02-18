
export interface Team {
  id: string;
  name: string;
  score: number;
}

export enum GameStage {
  SETUP = 'SETUP',
  SCENARIO = 'SCENARIO',
  JUDGING = 'JUDGING',
  WINNER = 'WINNER'
}

export interface GameState {
  stage: GameStage;
  teams: Team[];
  currentScenario: string | null;
  history: string[]; // Keep track of past scenarios to avoid dupes if we wanted complexity
  roundNumber: number;
  totalRounds: number;
  roundDuration: number; // Added duration in seconds
}

export interface ScenarioResponse {
  scenario: string;
  category?: string;
}
