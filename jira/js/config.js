function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

Config = {
  migrate_old_config: function() {
    if (localStorage.getItem('pattern')){
      var rule = new RuleConfig();
      rule.set('test_url', "Please specify the Url"); // was not stored in 4.5.0
      rule.set('test_title', localStorage['example_title']);
      rule.set('url_pattern', localStorage['url_pattern']);
      rule.set('title_pattern', localStorage['pattern']);
      rule.set('out_pattern', localStorage['replacement']);
      localStorage.clear();
      rule.save();
    }
  },

  get: function(key){
    return localStorage.getItem(key);
  },

  set: function(key, value){
    localStorage.setItem(key, value);
  },

  remove: function(key){
    localStorage.removeItem(key);
  },

  keys: function() {
    var keys = [];
    for(var key in localStorage) {
      keys.push(key)
    }
    return keys.sort();
  },

  removeAll: function(){
    localStorage.clear();
  }
};

BgConfig = {
  rules: [],
  init : function() {
    BgConfig.load_rules();
  },

  force_reload: function() {
    chrome.runtime.getBackgroundPage(function(bg){ bg.init(); });
  },

  match: function(url){
    for(var i in BgConfig.rules) {
      if (BgConfig.rules[i].match(url)){
        return true;
      }
    }
    return false;
  },

  load_rules: function(){
    var rules = []
    Config.keys().forEach(function(rule_id){
      rules.push(new RuleConfig(rule_id))
    })
    BgConfig.rules = rules;
  },

  apply: function(url, title) {
    var result = [];
    for(var i in BgConfig.rules) {
      var rule = BgConfig.rules[i];
      if (rule.match(url)){
        result.push(rule.apply(url, title))
      }
    }
    return result;
  }
};

RuleConfig = function(id){
  this.id = id;
  this.defaults = {
    test_url : 'https://issues.apache.org/jira/browse/HADOOP-3629',
    test_title : '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
    url_pattern : '(jira|tickets)*/browse/',
    title_pattern : '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
    out_pattern : '$html:<a href="$url">$1:$2</a>'
  }
  this.fields = {};

  this.init = function () {
    if(!this.id) {
      this.id = 'rule_' + Date.now();
    }
    this.load();
  }

  this.get =  function(field){
    return this.fields[field];
  },

  this.reset = function() {
    this.fields = JSON.parse(JSON.stringify(this.defaults));
  }

  this.set = function(field, value){
    this.fields[field] = value;
  },

  this.save = function (){
    Config.set(this.id, JSON.stringify(this.fields));
    BgConfig.force_reload();
  },

  this.load = function (){
    var value = Config.get(this.id);
    if(!value) {
      value = JSON.stringify(this.defaults);
    }
    this.fields = JSON.parse(value);
  }

  this.remove = function() {
    Config.remove(this.id);
    BgConfig.force_reload();
  }

  this.match = function(url) {
    return url.match(new RegExp(this.get('url_pattern')));
  }

  this.apply = function(url, title) {
    var title_pattern = new RegExp(this.fields.title_pattern);
    var out_pattern = this.fields.out_pattern;
    out_pattern = out_pattern.replace(/\$url/g, url);
    var result = title.replace(title_pattern, out_pattern);
    result =(
      result.indexOf("$html:") == 0 ?
      result.replace("$html:", "") :
      escape_html(result)
    );
    return result;
  }

  this.init();
}
