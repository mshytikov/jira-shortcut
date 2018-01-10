function checkForValidUrl(tabId, changeInfo, tab) {
  if (BgConfig.match(tab.url)) {
    chrome.pageAction.show(tabId);
  }
}

function rulesData(tab){
  return BgConfig.apply(tab.url, tab.title);
}

function init(){
 BgConfig.init();
}

init();
chrome.tabs.onUpdated.addListener(checkForValidUrl);
