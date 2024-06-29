

let intervalId = null;
let catFactsRunning = false;
let intervalRate = 5000; // Default interval rate in milliseconds

// Listener for messages from the extension popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleCatFacts') {
    toggleCatFacts(message.catFactsRunning);
    sendResponse({ received: true });
  } else if (message.action === 'updateIntervalRate') {
    updateIntervalRate(message.intervalRate);
    sendResponse({ received: true });
  } else if (message.action === 'getState') {
    sendResponse({ catFactsRunning });
  }
});

function toggleCatFacts(run) {
  catFactsRunning = run;

  if (catFactsRunning) {
    startCatFacts();
  } else {
    stopCatFacts();
  }
}

function startCatFacts() {
  if (intervalId === null) {
    intervalId = setInterval(fetchCatFact, intervalRate);
  }
}

function stopCatFacts() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

function updateIntervalRate(rate) {
  intervalRate = rate;

  if (catFactsRunning) {
    stopCatFacts();
    startCatFacts();
  }
}

async function fetchCatFact() {
  try {
    const response = await fetch('https://cat-fact.herokuapp.com/facts/random');
    if (!response.ok) {
      throw new Error('Failed to fetch cat fact');
    }
    const data = await response.json();
    showCatFactPopup(data.text);
  } catch (error) {
    console.error('Error fetching cat fact:', error);
  }
}

function showCatFactPopup(catFact) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length > 0 && tabs[0].id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (catFact) => {
          const popupElement = document.createElement('div');
          popupElement.setAttribute('id', 'catFactPopup');
          popupElement.style.position = 'fixed';
          popupElement.style.bottom = '20px';
          popupElement.style.left = '20px';
          popupElement.style.backgroundColor = 'white';
          popupElement.style.padding = '10px';
          popupElement.style.border = '1px solid black';
          popupElement.textContent = catFact;
  
          document.body.appendChild(popupElement);
  
          setTimeout(() => {
            popupElement.remove();
          }, 3000);
        },
        args: [catFact],
      });
    } else {
      console.error('No active tab found.');
    }
  });
}
