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

//chrome.tabs.onUpdated.addListener(checkForValidUrl);

if (chrome.webNavigation && chrome.webNavigation.onDOMContentLoaded){
  chrome.webNavigationtion.onDOMContentLoaded.addListener(
    prepareCopyContent, { url: BgConfig.url_filters } );
} else {
//    chrome.tabs.onUpdated.addListener(checkForValidUrl);
}
