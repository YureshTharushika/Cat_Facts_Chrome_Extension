import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, FormsModule, CommonModule]
})
export class AppComponent {
  title = 'Cat Facts';
  intervalRate = 5000; // Default interval rate
  catFactsRunning = false; // Track if cat facts fetching is running

  constructor(private http: HttpClient) {
    // Initialize by checking current state from background.js
    chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
      if (response && response.catFactsRunning) {
        this.catFactsRunning = true;
      }
    });
  }

  toggleCatFacts(): void {
    // Toggle cat facts fetching state
    this.catFactsRunning = !this.catFactsRunning;

    // Send message to background.js to start or stop fetching
    chrome.runtime.sendMessage({
      action: 'toggleCatFacts',
      catFactsRunning: this.catFactsRunning
    });
  }

 

  adjustInterval(newRate: number): void {
    // Adjust the interval rate
    this.intervalRate = newRate;

    // If cat facts fetching is running, restart with the new interval
    if (this.catFactsRunning) {
      chrome.runtime.sendMessage({
        action: 'updateIntervalRate',
        intervalRate: this.intervalRate
      });
    }
  }
}
