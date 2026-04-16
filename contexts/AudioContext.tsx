import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface AudioContextType {
  playClick: () => void;
  volume: number;
  setVolume: (v: number) => void;
  setMusicState: (state: 'menu' | 'frozen') => void;
}

export const AudioContext = createContext<AudioContextType>({
  playClick: () => {},
  volume: 1,
  setVolume: () => {},
  setMusicState: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [volume, setVolume] = useState(1); // 0 to 1
  const [musicState, setMusicState] = useState<'menu' | 'frozen'>('menu');
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const audio = new Audio('/sounds/music/background.mp3');
    audio.loop = true;
    bgMusicRef.current = audio;
    
    // Attempt to play (might be blocked by browser until interaction)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log("Autoplay prevented. Will play on first interaction.");
        // Add one-time click listener to document to start music
        const startAudio = () => {
          audio.play().catch(e => console.log("Still blocked", e));
          document.removeEventListener('click', startAudio);
        };
        document.addEventListener('click', startAudio);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      const targetMultiplier = musicState === 'frozen' ? 0.5 : 0.25;
      bgMusicRef.current.volume = volume * targetMultiplier;
    }
  }, [volume, musicState]);

  const playClick = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Cartoonish "pop" sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio play failed", e);
    }
  };

  return (
    <AudioContext.Provider value={{ playClick, volume, setVolume, setMusicState }}>
      {children}
    </AudioContext.Provider>
  );
};
