// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.match(regexp_config('url_pattern'))) {
    chrome.pageAction.show(tabId);
  }
};

function prepareCopyContent(tab){
  var replacement = config('replacement').replace("$url", tab.url)
  var result = tab.title.replace(regexp_config('pattern'), replacement);
  return result;
}

chrome.tabs.onUpdated.addListener(checkForValidUrl);
