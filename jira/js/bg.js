function checkForValidUrl(tabId, changeInfo, tab) {
  if (BgConfig.match(tab.url)) {
    chrome.pageAction.show(tabId);
  }
}

function prepareCopyContent(tab){
  return rulesData(tab).join('<br>');
}

function rulesData(tab){
  var data = BgConfig.apply(tab.url, tab.title);
  return data;
}

function init(){
 BgConfig.init();
}

init();
chrome.tabs.onUpdated.addListener(checkForValidUrl);
