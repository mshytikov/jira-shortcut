var Options = function() {

  this.template = document.getElementById('rule_template')

  this.buttons = {
    add_rule: document.getElementById('add_rule'),
    delete_all_rules: document.getElementById('delete_all_rules')
  };

  this.init = function() {
    this.template.id = '';
    this.template.remove();

    this.init_listeners();
    this.init_rules();
  };

  this.init_listeners = function() {
    this.buttons.add_rule.addEventListener(
      'click', this.add_rule.bind(this, null));

    this.buttons.delete_all_rules.addEventListener(
      'click', this.delete_all_rules);
  };

  this.add_rule = function(id) {
    var ruleNode = this.template.cloneNode(true);

    document.body.insertBefore(ruleNode, this.buttons.add_rule);
    new Rule(ruleNode, new RuleConfig(id));
  };

  this.delete_all_rules = function() {
    var confirmed = confirm('Delete all rules?');
    if (confirmed) {
      Config.remove_all();
      location.reload();
    }
  };

  this.init_rules = function() {
    Config.get_all(this.init_rules_callback.bind(this));
  };

  this.init_rules_callback = function(err, items) {
    if (err) { console.log(err); return; };
    Object.keys(items).sort().forEach(this.add_rule.bind(this));
  };

  this.init();
}
document.addEventListener('DOMContentLoaded', function() { new Options() });
