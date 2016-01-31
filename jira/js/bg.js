// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (BgConfig.has_rule(tab.url)) {
    chrome.pageAction.show(tabId);
  }
};

function prepareCopyContent(tab){
  var rule = BgConfig.rules[0]
  return rule.apply(tab.url, tab.title);
}

BgConfig.init();
console.log(BgConfig.rules);
chrome.tabs.onUpdated.addListener(checkForValidUrl);
