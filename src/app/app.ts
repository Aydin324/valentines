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
  noClicked: number = 0;

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
      const questionSection = document.querySelector('.question-section');

      let x: number;
      let y: number;
      let validPosition = false;
      let attempts = 0;
      const maxAttempts = 10;

      const questionBounds = questionSection?.getBoundingClientRect();

      while (!validPosition && attempts < maxAttempts) {
        x = Math.random() * Math.max(0, window.innerWidth - buttonWidth);
        y = Math.random() * Math.max(0, window.innerHeight - buttonHeight);

        const buttonBottom = y + buttonHeight;
        const buttonTop = y;

        if (questionBounds) {
          if (buttonBottom < questionBounds.top - 20 || buttonTop > questionBounds.bottom + 20) {
            validPosition = true;
          }
        } else validPosition = true;

        attempts++;
      }

      noButton.style.position = 'fixed';
      noButton.style.left = `${x!}px`;
      noButton.style.top = `${y!}px`;
    }
  }

  handleNoButtonClick(): void {
    this.noClicked++;
    console.log('No button clicked', this.noClicked, 'times');
    this.moveNoButton();
  }
}
