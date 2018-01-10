function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

Config = {
  storage: chrome.storage.sync,

  get: function(key, callback){
    Config.storage.get(key, Config.storage_callback(callback));
  },

  set: function(key, value, callback){
    var items = {};
    items[key] = value;
    Config.storage.set(items, Config.storage_callback(callback) );
  },

  remove: function(key, callback){
    Config.storage.remove(key, Config.storage_callback(callback));
  },

  storage_callback: function(callback) {
   return function(items) { callback(chrome.runtime.lastError, items) };
  },

  get_all: function(callback) {
    Config.get(null, callback);
  },

  remove_all: function(){
    Config.storage.clear();
  },
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
    Config.get_all(BgConfig.load_rules_callback);
  },

  load_rules_callback: function(err, items) {
    if(err) { console.log(err) ; return; };
    var rules = []
    for (rule_id  in items) {
      rules.push(new RuleConfig(rule_id, items[rule_id]))
    }
    BgConfig.rules = rules;
  },

  apply: function(url, title) {
    var result = [];
    for(var i in BgConfig.rules) {
      var rule = BgConfig.rules[i];
      if (rule.match(url)){
        result.push({ name: rule.getName(), content: rule.apply(url, title)})
      }
    }
    return result;
  }
};

RuleConfig = function(id, fields){
  this.id = (id ? id : ('rule_' + Date.now())) ;
  this.defaults = {
    name: "default",
    test_url : 'https://issues.apache.org/jira/browse/HADOOP-3629',
    test_title : '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
    url_pattern : '(jira|tickets)*/browse/',
    title_pattern : '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
    out_pattern : '$html:<a href="$url">$1:$2</a>'
  };

  this.default_fields= function() {
    return JSON.parse(JSON.stringify(this.defaults));
  }

  this.fields = (fields ? fields : this.default_fields() );

  this.getName = function() {
    return this.get("name") || "rule";
  };
  this.get =  function(field){
    return this.fields[field];
  };

  this.reset = function() {
    this.fields = this.default_fields();
  };

  this.set = function(field, value){
    this.fields[field] = value;
  };

  this.save = function (status){
    Config.set(
      this.id,
      this.fields,
      this.save_callback.bind(this, status)
    );
  };

  this.save_callback = function(status, err){
    if(err) { status(err); return null };
    BgConfig.force_reload();
    status();
  };

  this.load = function (status){
    Config.get(this.id, this.load_callback.bind(this, status));
  };

  this.load_callback = function (status, err, items){
    if(err) { status(err); return null };
    var fields = items[this.id]
    if (fields) { this.fields = fields; }
    status();
  };

  this.remove = function(status) {
    Config.remove(this.id, this.remove_callback.bind(this, status));
  };

  this.remove_callback = function(status, err) {
    if(err) { status(err); return null };
    BgConfig.force_reload();
    status();
  };

  this.match = function(url) {
    return url.match(new RegExp(this.get('url_pattern')));
  };

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
  };
}
