DEFAULT_CONFIG = {
  'url_pattern' : '(jira|tickets)*/browse/',
  'pattern' :     '^\\[#([^\\]]+)\\](.*)( -[^-]+)$',
  'replacement' :  '$1:$2'
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

