function doCopy(data) {
  document.getElementById('copy-clip').style.display = 'none';
  document.getElementById('copy-clip-div').style.display = 'none';
  var obj =  null;

  if(data.indexOf("$html:") == 0) {
    obj = document.getElementById('copy-clip-div');
    obj.style.display = '';
    obj.contentEditable = true;
    obj.innerHTML = data.replace("$html:", "");
    obj.unselectable = false;
    obj.focus();
    document.execCommand('SelectAll');
  } else {
    obj = document.getElementById('copy-clip');
    obj.style.display = '';
    obj.value = data;
    obj.focus();
    obj.select();
  }
  document.execCommand('Copy', false, null);
  obj.style.display = 'none'
}

var bkg = chrome.extension.getBackgroundPage()
chrome.tabs.getSelected(null, function(tab) {
  doCopy(bkg.prepareCopyContent(tab));
})
