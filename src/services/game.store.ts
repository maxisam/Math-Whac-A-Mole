
import { Injectable, signal, computed, effect } from '@angular/core';

export interface Mole {
  id: number;
  index: number;
  value: number;
  isUp: boolean;
  isCorrect: boolean;
  isHit: boolean; // Visual feedback state
  isHinted: boolean; // For new hint feature
}

export type GameStatus = 'idle' | 'playing' | 'gameover';

@Injectable({
  providedIn: 'root'
})
export class GameStore {
  // State Signals
  readonly status = signal<GameStatus>('idle');
  readonly score = signal<number>(0);
  readonly timeLeft = signal<number>(60);
  readonly currentProblem = signal<{ a: number, b: number }>({ a: 2, b: 2 });
  
  // The Grid of 9 holes
  readonly moles = signal<Mole[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i,
      index: i,
      value: 0,
      isUp: false,
      isCorrect: false,
      isHit: false,
      isHinted: false
    }))
  );

  readonly highScore = signal<number>(0);

  // Computed
  readonly displayProblem = computed(() => {
    const p = this.currentProblem();
    return `${p.a} × ${p.b}`;
  });

  readonly correctAnswer = computed(() => {
    const p = this.currentProblem();
    return p.a * p.b;
  });

  private gameLoopId: any;
  private timerId: any;
  private spawnRate = 800; // ms
  private moleDuration = 1500; // ms

  constructor() {
    // Load high score if available
  }

  startGame() {
    this.status.set('playing');
    this.score.set(0);
    this.timeLeft.set(60);
    this.resetMoles();
    this.generateProblem();
    
    this.gameLoopId = setInterval(() => this.tick(), 100);
    this.timerId = setInterval(() => {
      this.timeLeft.update(t => {
        if (t <= 1) {
          this.endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  endGame() {
    clearInterval(this.gameLoopId);
    clearInterval(this.timerId);
    this.status.set('gameover');
    if (this.score() > this.highScore()) {
      this.highScore.set(this.score());
    }
  }

  // Called when user clicks a mole
  whack(index: number) {
    if (this.status() !== 'playing') return;

    this.moles.update(currentMoles => {
      const mole = currentMoles[index];
      if (!mole.isUp || mole.isHit) return currentMoles;

      const newMoles = [...currentMoles];
      
      if (mole.isCorrect) {
        // Correct Hit!
        this.score.update(s => s + 10);
        newMoles[index] = { ...mole, isHit: true, isUp: false, isHinted: false };
        setTimeout(() => this.generateProblem(), 200); 
      } else {
        // Wrong Hit!
        this.score.update(s => Math.max(0, s - 5));
        newMoles[index] = { ...mole, isUp: false, isHinted: false }; 
      }
      return newMoles;
    });
  }

  private generateProblem() {
    // Generate numbers between 2 and 9
    const a = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * 8) + 2;
    this.currentProblem.set({ a, b });
    this.highlightCorrectMoles();
  }

  private highlightCorrectMoles() {
    const correctAnswer = this.correctAnswer();
    
    // Set hints for the current correct answer
    this.moles.update(moles => moles.map(mole => 
      (mole.isUp && mole.value === correctAnswer) ? { ...mole, isHinted: true } : mole
    ));

    // Schedule the removal of hints for THIS specific correct answer
    setTimeout(() => {
        this.moles.update(moles => moles.map(mole => {
            if (mole.isHinted && mole.value === correctAnswer) {
                return { ...mole, isHinted: false };
            }
            return mole;
        }));
    }, 700); // Must match animation duration
  }

  private resetMoles() {
    this.moles.set(this.moles().map(m => ({ ...m, isUp: false, isHit: false, isHinted: false })));
  }

  // Main Game Loop Tick
  private lastSpawn = 0;
  private tick() {
    const now = Date.now();
    if (now - this.lastSpawn > this.spawnRate) {
      this.spawnMole();
      this.lastSpawn = now;
    }
  }

  private spawnMole() {
    this.moles.update(currentMoles => {
      const downIndices = currentMoles
        .filter(m => !m.isUp)
        .map(m => m.index);

      if (downIndices.length === 0) return currentMoles;

      const randomIndex = downIndices[Math.floor(Math.random() * downIndices.length)];
      
      const correctAnswer = this.correctAnswer();
      const activeCorrect = currentMoles.some(m => m.isUp && m.value === correctAnswer);
      
      let val: number;
      let isCorrect = false;

      if (!activeCorrect && Math.random() < 0.4) {
        val = correctAnswer;
        isCorrect = true;
      } else {
        do {
           val = (Math.floor(Math.random() * 8) + 2) * (Math.floor(Math.random() * 8) + 2);
        } while (val === correctAnswer);
        isCorrect = false;
      }

      const newMoles = [...currentMoles];
      newMoles[randomIndex] = {
        ...newMoles[randomIndex],
        value: val,
        isCorrect: isCorrect,
        isUp: true,
        isHit: false,
        isHinted: false
      };

      setTimeout(() => {
        this.hideMole(randomIndex);
      }, this.moleDuration);

      return newMoles;
    });
  }

  private hideMole(index: number) {
    if (this.status() !== 'playing') return;
    this.moles.update(moles => {
       const m = moles[index];
       if (!m.isUp) return moles;
       const newMoles = [...moles];
       newMoles[index] = { ...m, isUp: false, isHinted: false };
       return newMoles;
    });
  }
}
