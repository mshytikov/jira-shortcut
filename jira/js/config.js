DEFAULT_CONFIG = {
  'url_pattern' : '(jira|tickets)*/browse/',
  'pattern' :     '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
  'replacement' :  '$html:<a href="$url">$1:$2</a>',
  'example_title' : '[HADOOP-3629] Document the metrics produced by hadoop - ASF JIRA'
};

function config(key){
  if (!localStorage[key]) {
    localStorage[key] = DEFAULT_CONFIG[key];
  }
  return localStorage[key];
};

function set_config(key, value){
  localStorage[key] = value;
  return value;
};

function regexp_config(key){
  return new RegExp(config(key));
}

