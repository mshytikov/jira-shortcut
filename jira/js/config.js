Config = {
  defaults: {
    url_pattern : '(jira|tickets)*/browse/',
    example_url : 'https://issues.apache.org/jira/browse/HADOOP-3629',
    pattern : '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
    replacement : '$html:<a href="$url">$1:$2</a>',
    example_title : '[HADOOP-3629] Document the metrics produced by hadoop - ASF JIRA'
  },

  default_config: function(key){
     return Config.defaults[key];
  },

  config: function(key){
    if (!localStorage[key]) {
      localStorage[key] = Config.default_config(key);
    }
    return localStorage[key];
  },

  set_config: function(key, value){
    localStorage[key] = value;
    return value;
  },

  regexp_config: function(key){
    return new RegExp(config(key));
  }
}

