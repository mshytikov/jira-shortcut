var Options = function(){

  this.template = document.getElementById('rule_template')

  this.buttons = {
    add_rule : document.getElementById('add_rule')
  };

  this.init = function(){
    this.template.id = '';
    this.template.remove();

    this.init_listeners();
    this.init_rules();
  }

  this.init_listeners = function(){
    this.buttons.add_rule.addEventListener(
      'click', this.add_rule.bind(this, null));
  }

  this.add_rule = function(id){
    var ruleNode = this.template.cloneNode(true);

    document.body.insertBefore(ruleNode, this.buttons.add_rule);
    new Rule(ruleNode, new RuleConfig(id));
  }

  this.init_rules = function(){
    Config.keys().forEach(this.add_rule.bind(this))
  }

  this.init();
}
document.addEventListener('DOMContentLoaded', function(){ new Options() });
