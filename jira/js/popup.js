function doCopy(data) {
  var obj =  document.getElementById('copy-clip-div');

  obj.style.display = '';

  obj.contentEditable = true;
  obj.innerHTML = data;
  obj.unselectable = false;
  obj.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy', false, null);

  obj.style.display = 'none'
}

function addRuleButton(name, data) {
  var rules = document.getElementById('rules');
  var ruleNode = document.createElement("BUTTON");
  rules.appendChild(ruleNode);

  ruleNode.appendChild(document.createTextNode("test"));
  ruleNode.addEventListener('click', function() { doCopy(data) })
}

function addRules(data){
  data.forEach(function(value) { addRuleButton("test", value) });
}


var bg = chrome.extension.getBackgroundPage();

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0];
  doCopy(bg.prepareCopyContent(tab));
  addRules(bg.rulesData(tab))
})
