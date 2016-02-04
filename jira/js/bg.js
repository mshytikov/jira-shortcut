function checkForValidUrl(tabId, changeInfo, tab) {
  if (BgConfig.match(tab.url)) {
    chrome.pageAction.show(tabId);
  }
}

function prepareCopyContent(tab){
  var data = BgConfig.apply(tab.url, tab.title);
  return data.join('<br>');
}

function init(){
 BgConfig.init();
}

init();
chrome.tabs.onUpdated.addListener(checkForValidUrl);
