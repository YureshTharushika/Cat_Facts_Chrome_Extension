import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PopupComponent } from "./popup/popup.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, PopupComponent, FormsModule, CommonModule]
})
export class AppComponent implements OnInit {
  title = 'cat-facts-extension';
  intervalRate = 10000;

  ngOnInit(): void {
    this.startCatFacts();
  }

  startCatFacts(): void {
    setInterval(() => {
      fetch('https://cat-fact.herokuapp.com/facts/random')
        .then(response => response.json())
        .then(data => {
          chrome.runtime.sendMessage({
            action: 'showCatFactPopup',
            catFact: data.text
          });
        })
        .catch(error => console.error('Error fetching cat fact:', error));
    }, this.intervalRate);
  }

  adjustInterval(newRate: number): void {
    this.intervalRate = newRate;
    this.startCatFacts(); // Restart the script with the new interval
  }
}
