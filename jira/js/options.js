function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

var Rule = function (id) {
  this.id = id;

  this.element = function(name) {
      var element_id = name + this.id;
      console.log(name);
      return document.getElementById(element_id);
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
    reset : this.element("reset")
  };

  this.outputs = {
    status : this.element("status"),
    example_out : this.element("example_out"),
    example_url_out : this.element("example_url_out")
  };

  this.each_field = function(fn) {
    for (var key in this.fields) {
      fn(this.fields[key]);
    }
  };


  this.init = function() {
    this.init_listeners();
    this.each_field(this.load_field);
    this.update_examples();
  };

  this.reset_field = function(field) {
    field.value = Config.default_config(field.id);
  };

  this.load_field = function(field) {
    field.value = Config.config(field.id);
  };

  this.save_field = function(field) {
    Config.set_config(field.id, field.value);
  };

  this.save_options = function() {
    this.each_field(this.save_field);

    //Update status to let user know options were saved.
    this.update_status("Options Saved");
  };

  this.update_status = function(value) {
    this.outputs.status.innerHTML = value;
    setTimeout(this.clear_status.bind(this), 750);
  };

  this.clear_status = function() {
    this.outputs.status.innerHTML = ""
  };

  this.reset_to_defaults = function() {
    this.each_field(this.reset_field);
    this.update_examples();
  };

  this.init_listeners = function(){
    console.log(this.buttons.save);
    this.buttons.save.addEventListener(
      'click', this.save_options.bind(this));
    this.buttons.reset.addEventListener(
      'click', this.reset_to_defaults.bind(this));

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
    this.outputs.example_url_out.innerHTML = out ? "OK": "DOES NOT MATCH";
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

};

document.addEventListener('DOMContentLoaded', function(){ new Rule('').init() });
