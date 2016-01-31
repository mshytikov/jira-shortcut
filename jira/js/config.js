function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};


Config = {
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
  url_filters: {},
  init : function() {
    BgConfig.load_rules();
    BgConfig.load_url_filters();
  },

  load_url_filters: function(){
    var filters = [];
    for(var i in BgConfig.rules) {
      var pattern = BgConfig.rules[i].get('url_pattern');
      filters.push({ urlMatches: pattern });
    }
    this.url_filters =  filters;
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
    test_title : '[HADOOP-3629] Document the metrics produced by hadoop - ASF JIRA',
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
  }

  this.load = function (){
    var value = Config.get(this.id);
    if(!value) {
      value = JSON.stringify(this.defaults);
    }
    this.fields = JSON.parse(value);
  }

  this.remove = function() {
    Config.remove(this.id);
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
