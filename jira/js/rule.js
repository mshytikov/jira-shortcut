function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

var Rule = function (rootNode, config) {
  this.config = config;
  this.rootNode = rootNode;

  this.element = function(name) {
    return this.rootNode.querySelector('[data-id="'+ name +'"]');
  };

  this.fields = {
    url_pattern : this.element("url_pattern"),
    pattern : this.element("pattern"),
    replacement : this.element("replacement"),
    example_title : this.element("example_title"),
    example_url : this.element("example_url")
  };

  this.buttons = {
    save : this.element("save"),
    load : this.element("load"),
    reset : this.element("reset"),
    remove : this.element("remove")
  };

  this.outputs = {
    status : this.element("status"),
    example_out : this.element("example_out"),
    example_url_out : this.element("example_url_out")
  };

  this.init = function() {
    this.init_listeners();
    this.load();
  };

  this.reset = function() {
    this.config.reset();
    for (var field in this.fields) {
      this.fields[field].value = this.config.get(field)
    }
    this.update_examples();
  }

  this.save = function() {
    for (var field in this.fields) {
      this.config.set(field, this.fields[field].value)
    }
    this.config.save();
    this.update_status("Rule saved");
  }

  this.load = function() {
    this.config.load();
    for (var field in this.fields) {
      this.fields[field].value = this.config.get(field)
    }
    this.update_examples();
  }

  this.update_status = function(value) {
    this.outputs.status.innerHTML = value;
    setTimeout(this.clear_status.bind(this), 750);
  };

  this.clear_status = function() {
    this.outputs.status.innerHTML = ""
  };

  this.init_listeners = function(){
    this.buttons.save.addEventListener(
      'click', this.save.bind(this));
    this.buttons.load.addEventListener(
      'click', this.load.bind(this));
    this.buttons.reset.addEventListener(
      'click', this.reset.bind(this));
    this.buttons.remove.addEventListener(
      'click', this.remove.bind(this));


    this.fields.pattern.addEventListener(
      'change', this.update_examples.bind(this), false);
    this.fields.replacement.addEventListener(
      'change', this.update_examples.bind(this), false);
    this.fields.example_title.addEventListener(
      'change', this.update_examples.bind(this), false);

    this.fields.url_pattern.addEventListener(
      'change', this.update_examples.bind(this), false);
    this.fields.example_url.addEventListener(
      'change', this.update_examples.bind(this), false);
  };

  this.update_examples = function(){
    this.update_title_example();
    this.update_url_example();
  };

  this.update_url_example = function(){
    var pattern = new RegExp(this.fields.url_pattern.value);
    var url = this.fields.example_url.value;
    var out = url.match(pattern);
    this.outputs.example_url_out.className = out ? 'valid' : 'invalid' ;
  };

  this.update_title_example = function(){
    var pattern = new RegExp(this.fields.pattern.value);
    var replacement = this.fields.replacement.value;
    var pattern = new RegExp(this.fields.pattern.value);
    var url = this.fields.example_url.value;
    replacement= replacement.replace(/\$url/g, url);

    var title = this.fields.example_title.value;
    var out = title.replace(pattern, replacement);
    out =(
      out.indexOf("$html:") == 0 ?
      out.replace("$html:", "") :
      escape_html(out)
    );
    this.outputs.example_out.innerHTML = out;
  };

  this.remove = function(){
    var confirmed =  confirm('Delete the rule?');
    if (confirmed) {
      this.config.remove();
      this.rootNode.remove();
    }
  }

  this.init();
};
