function doCopy(data) {
  var obj =  document.getElementById('copy-clip-div');

  obj.contentEditable = true;
  obj.innerHTML = data;
  obj.focus();
  document.execCommand('SelectAll');
  document.execCommand('Copy', false, null);

  obj.style.display = 'none';
}

function addRuleButton(name, value) {
  var rules = document.getElementById('rules');
  var ruleNode = document.createElement("BUTTON");
  ruleNode.className = 'rule-button';
  rules.appendChild(ruleNode);

  ruleNode.appendChild(document.createTextNode(name));
  ruleNode.addEventListener('click', function() { doCopy(value) })
}

function addRules(data){
  data.forEach(function(rule) { addRuleButton(rule.name, rule.content) });
}

function allRulesContent(rules_data){
  var content = rules_data.map(function(rule) { return rule.content })
  return content.join('<br>');
}


var bg = chrome.extension.getBackgroundPage();

chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var tab = tabs[0];
  var rules_data = bg.rulesData(tab);
  doCopy(allRulesContent(rules_data));
  addRules(rules_data);
})
