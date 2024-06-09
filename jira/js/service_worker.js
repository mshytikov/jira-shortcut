importScripts('config.js');

function checkForValidUrl(tabId, changeInfo, tab) {
  if (BgConfig.match(tab.url)) {
    chrome.action.enable(tabId=tabId);
  } else {
    chrome.action.disable(tabId=tabId);
  }
}

BgConfig.init(function() {});
chrome.tabs.onUpdated.addListener(checkForValidUrl);
