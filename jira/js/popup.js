function doCopy(data, close=true) {
  var obj =  document.getElementById('copy-clip-div');
  obj.style.display = 'block';

  obj.contentEditable = true;
  obj.innerHTML = data;
  obj.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy', false, null);

  obj.style.display = 'none';
  document.getElementById("extension-wrapper").focus();
  if (close) { window.close() }
}

function addRuleButton(name, value) {
  var rules = document.getElementById('rules');
  var ruleNode = document.createElement("BUTTON");
  ruleNode.type="submit";
  ruleNode.className = 'rule-button';
  rules.appendChild(ruleNode);

  ruleNode.appendChild(document.createTextNode(name));
  ruleNode.addEventListener('click', function() { doCopy(value) })
}

function addRules(data){
  data.forEach(function(rule) { addRuleButton(rule.name, rule.content) });
}


var bg = chrome.extension.getBackgroundPage();

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0];
  var rules_data = bg.rulesData(tab);
  doCopy(rules_data[0].content, false);
  addRules(rules_data);
})
