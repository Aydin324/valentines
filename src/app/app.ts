import { Component, signal, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  proposalState = signal<'intro' | 'proposal' | 'accepted'>('intro');
  noClicked: number = 0;
  yesButtonBlocked = signal(false);

  constructor() {
    // Watch for state changes and attach animation-end listeners to new .screen-fade elements
    effect(() => {
      this.proposalState(); // track state changes
      // Schedule the listener attachment after Angular renders
      setTimeout(() => {
        const screenFadeElements = document.querySelectorAll('.screen-fade');
        screenFadeElements.forEach((el) => {
          // Only add listener if not already added (check for data attribute)
          if (!(el as any).__animationListenerAdded) {
            el.addEventListener('animationend', () => {
              (el as HTMLElement).style.animation = 'none';
            });
            (el as any).__animationListenerAdded = true;
          }
        });
      });
    });
  }

  proceed() {
    if (this.proposalState() === 'intro') {
      this.proposalState.set('proposal');
      this.yesButtonBlocked.set(true);
      setTimeout(() => this.yesButtonBlocked.set(false), 500);
    } else if (this.proposalState() === 'proposal') {
      this.proposalState.set('accepted');
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 30, 100, 30, 100]);
      }
      confetti({
        particleCount: 250,
        spread: 90,
        origin: { y: 0.8 },
        colors: ['#ff4d6d', '#ff758f', '#ffb3c1'],
      });
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
      const footer = document.querySelector('footer');
      const footerBounds = footer?.getBoundingClientRect();
      const margin = 20;

      while (!validPosition && attempts < maxAttempts) {
        x = Math.random() * Math.max(0, window.innerWidth - buttonWidth);
        y = Math.random() * Math.max(0, window.innerHeight - buttonHeight);

        const buttonLeft = x;
        const buttonRight = x + buttonWidth;
        const buttonTop = y;
        const buttonBottom = y + buttonHeight;

        const overlaps = (rect: DOMRect | undefined) => {
          if (!rect) return false;
          return !(
            buttonRight < rect.left - margin ||
            buttonLeft > rect.right + margin ||
            buttonBottom < rect.top - margin ||
            buttonTop > rect.bottom + margin
          );
        };

        if (
          !(questionBounds && overlaps(questionBounds)) &&
          !(footerBounds && overlaps(footerBounds))
        ) {
          validPosition = true;
        }

        attempts++;
      }

      noButton.style.position = 'fixed';
      noButton.style.left = `${x!}px`;
      noButton.style.top = `${y!}px`;
    }
  }

  handleNoButtonClick(): void {
    this.yesButtonBlocked.set(true);
    setTimeout(() => this.yesButtonBlocked.set(false), 500);
    this.noClicked++;
    console.log('No button clicked', this.noClicked, 'times');
    this.moveNoButton();
  }
}
