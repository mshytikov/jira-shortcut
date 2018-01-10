var Rule = function (rootNode, config) {
  this.config = config;
  this.rootNode = rootNode;

  this.element = function(name) {
    return this.rootNode.querySelector('[data-id="'+ name +'"]');
  };

  this.fields = {
    name : this.element("name"),
    test_url : this.element("test_url"),
    test_title : this.element("test_title"),
    url_pattern : this.element("url_pattern"),
    title_pattern : this.element("title_pattern"),
    out_pattern : this.element("out_pattern")
  };

  this.buttons = {
    save : this.element("save"),
    load : this.element("load"),
    remove : this.element("remove"),
    reset_email : this.element("reset-email"),
    reset_markdown : this.element("reset-markdown"),
    reset_email_short : this.element("reset-email_short"),
    reset_markdown_short : this.element("reset-markdown_short"),
  };

  this.outputs = {
    status : this.element("status"),
    result : this.element("result"),
    test_url_validation : this.element("test_url_validation")
  };

  this.init = function() {
    this.init_listeners();
    this.load();
  };

  this.reset = function(e) {
    var defaults_type = e.dataset.id.replace("reset-","");
    this.config.reset(defaults_type);
    for (var field in this.fields) {
      this.fields[field].value = this.config.get(field)
    }
    this.update_outputs();
    this.update_status("Rule Defaults");
  };

  this.save = function() {
    for (var field in this.fields) {
      this.config.set(field, this.fields[field].value)
    }
    this.config.save(this.save_callback.bind(this));
  };

  this.save_callback = function(error) {
    var msg = (error ? error : "Rule Saved" );
    this.update_status(msg);
  };

  this.load = function() {
    this.config.load(this.load_callback.bind(this));
 };

  this.load_callback= function(error) {
    if (error) { this.update_status(error); return; }
    for (var field in this.fields) {
      this.fields[field].value = this.config.get(field)
    }
    this.update_outputs();
    this.update_status("Rule Loaded");
  }

  this.update_status = function(value) {
    this.outputs.status.innerHTML = value;
    setTimeout(this.clear_status.bind(this), 750);
  };

  this.clear_status = function() {
    this.outputs.status.innerHTML = ""
  };

  this.init_listeners = function(){

    for(var action in this.buttons) {
      var target = this.buttons[action];
      if (action.startsWith("reset")) { action = "reset" };
      target.addEventListener('click', this[action].bind(this, target));
    }

    for(var field in this.fields) {
      var target = this.fields[field];
      target.addEventListener('change', this.update_outputs.bind(this));
    }
  };

  this.update_outputs = function(){
    this.validate_test_url();
    this.update_result();
  };

  this.validate_test_url = function(){
    var pattern = new RegExp(this.fields.url_pattern.value);
    var url = this.fields.test_url.value;
    var out = url.match(pattern);
    this.outputs.test_url_validation.className = out ? 'valid' : 'invalid' ;
  };

  // returns new config which is based on the values which are not saved yet.
  this.current_config = function() {
    var config = new RuleConfig();
    for (var field in this.fields) {
      config.set(field, this.fields[field].value);
    }
    return config;
  };

  this.update_result = function(){
    var config = this.current_config();
    var url = this.fields.test_url.value;
    var title = this.fields.test_title.value;
    this.outputs.result.innerHTML = config.apply(url, title);
  };

  this.remove = function(){
    var confirmed =  confirm('Delete the rule?');
    if (confirmed) {
      this.config.remove(this.remove_callback.bind(this));
    }
  };

  this.remove_callback = function (err) {
    if (err) { this.update_status(err); return; }
    this.rootNode.remove();
  };

  this.init();
};
