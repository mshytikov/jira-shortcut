function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

Config = {
  storage: chrome.storage.sync;

  get: function(key, callback){
    storage.get(key, storage_callback(callback));
  },

  set: function(key, value, callback){
    storage.set({key: value}, storage_callback(callback) );
  },

  remove: function(key, callback){
    storage.remove(key, storage_callback(callback));
  },

  storage_callback: function(callback) {
   return function(items) { callback(chrome.runtime.lastError, items) };
  }

  get_all: function(callback) {
    get(null, callback);
  }

  remove_all: function(){
    storage.clear()
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
    this.fields = this.defaults;
  }

  this.set = function(field, value){
    this.fields[field] = value;
  },

  this.save = function (){
    Config.set(this.id, this.fields, this.save_callback);
  },

  this.save_callback = function(err){
    if(err) { console.log(err); return null };
    BgConfig.force_reload();
  },

  this.load = function (){
    Config.get(this.id, this.load_callback.bind(this));
  }

  this.load_callback = function (err, items){
    if(err) { console.log(err); return null };
    var value = items[this.id]
    if (!value) { value = this.defaults; };
    this.fields = value;
  }

  this.remove = function() {
    Config.remove(this.id, this.remove_callback);
  }

  this.remove_callback(err) {
    if(err) { console.log(err); return null };
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
