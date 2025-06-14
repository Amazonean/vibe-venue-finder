import React from 'react';

export class RecordingTimer {
  private timerId: NodeJS.Timeout | null = null;
  private onTimeUpdate: React.Dispatch<React.SetStateAction<number>>;
  private onComplete: () => void;
  private maxDuration: number;

  constructor(
    onTimeUpdate: React.Dispatch<React.SetStateAction<number>>,
    onComplete: () => void,
    maxDuration: number = 10
  ) {
    this.onTimeUpdate = onTimeUpdate;
    this.onComplete = onComplete;
    this.maxDuration = maxDuration;
  }

  start(): void {
    this.onTimeUpdate(0);
    
    this.timerId = setInterval(() => {
      this.onTimeUpdate(prev => {
        if (prev >= this.maxDuration - 1) {
          this.onComplete();
          return this.maxDuration;
        }
        return prev + 1;
      });
    }, 1000);

    // Auto-stop after max duration
    setTimeout(() => {
      this.onComplete();
    }, this.maxDuration * 1000);
  }

  stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  cleanup(): void {
    this.stop();
  }
}