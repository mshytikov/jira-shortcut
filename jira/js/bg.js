// Called when the url of a tab changes.
function showAction(details) {
  chrome.pageAction.show(details.tabId);
};

function prepareCopyContent(tab){
  var data = BgConfig.apply(tab.url, tab.title);
  return data.join('<br>');
}

function init(){
  BgConfig.init();

  if (BgConfig.url_filters.length > 0 ) {
    chrome.webNavigation.onDOMContentLoaded.addListener(
      showAction, { url: BgConfig.url_filters } );
  }
}

init();
