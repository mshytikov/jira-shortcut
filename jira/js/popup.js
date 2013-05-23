function doCopy(data) {
  var obj = document.getElementById('copy-clip');
  obj.style.display = '';
  obj.value = data;
  obj.focus();
  obj.select();
  document.execCommand('copy');
  obj.style.display = 'none'
}

var bkg = chrome.extension.getBackgroundPage()
chrome.tabs.getSelected(null, function(tab) {
  doCopy(bkg.prepareCopyContent(tab));
})
