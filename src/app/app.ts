import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  proposalState = signal<'intro' | 'proposal' | 'accepted'>('intro');
  //noButtonPosition = signal({ x: 0, y: 0 });

  proceed() {
    if (this.proposalState() === 'intro') {
      this.proposalState.set('proposal');
    } else if (this.proposalState() === 'proposal') {
      this.proposalState.set('accepted');
    } else {
      this.proposalState.set('intro');
    }
  }

  moveNoButton() {
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 50);
    //this.noButtonPosition.set({ x, y });
  }
}
