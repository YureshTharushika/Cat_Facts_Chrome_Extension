
function showCatFactPopup(catFact) {
  chrome.runtime.sendMessage({
    action: 'showCatFactPopup',
    catFact: catFact
  });
}
