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
    const noButton = document.getElementById('no');
    if (noButton) {
      const buttonWidth = noButton.offsetWidth;
      const buttonHeight = noButton.offsetHeight;
      const x = Math.random() * Math.max(0, window.innerWidth - buttonWidth);
      const y = Math.random() * Math.max(0, window.innerHeight - buttonHeight);
      noButton.style.position = 'fixed';
      noButton.style.left = `${x}px`;
      noButton.style.top = `${y}px`;
    }
  }
}
