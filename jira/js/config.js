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
}

RuleConfig = function(id){
  this.id = id;
  this.defaults = {
    url_pattern : '(jira|tickets)*/browse/',
    example_url : 'https://issues.apache.org/jira/browse/HADOOP-3629',
    pattern : '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
    replacement : '$html:<a href="$url">$1:$2</a>',
    example_title : '[HADOOP-3629] Document the metrics produced by hadoop - ASF JIRA'
  }
  this.fields = {};

  this.init = function () {
    console.log(this.id);
    if(!this.id) {
      this.id = 'rule_' + Date.now();
    }
    console.log(this.id);
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
    this.save();
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

  this.init();
}
