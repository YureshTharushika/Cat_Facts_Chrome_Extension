import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent implements OnInit {

  catFact: string = "";


  ngOnInit(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'showCatFactPopup' && message.catFact) {
        this.catFact = message.catFact;
      }
    });
  }

}
