function save_options() {
  set_config('url_pattern', document.getElementById('url_pattern').value);
  set_config('pattern', document.getElementById('pattern').value);
  set_config('replacement', document.getElementById('replacement').value);

  //Update status to let user know options were saved.
  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
};

function reset_to_defaults() {
  document.getElementById('url_pattern').value = DEFAULT_CONFIG['url_pattern'];
  document.getElementById('pattern').value = DEFAULT_CONFIG['pattern'];
  document.getElementById('replacement').value = DEFAULT_CONFIG['replacement'];
  update_examples();
};

function init_listeners(){
  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('reset').addEventListener('click', reset_to_defaults);

  document.getElementById('pattern').addEventListener('change', update_title_example, false);
  document.getElementById('replacement').addEventListener('change', update_title_example, false);
  document.getElementById('example_title').addEventListener('change', update_title_example, false);

  document.getElementById('url_pattern').addEventListener('change', update_url_example, false);
  document.getElementById('example_url').addEventListener('change', update_url_example, false);
}
function update_examples(){
  update_title_example();
  update_url_example();
}

function update_url_example(){
  var pattern = new RegExp(document.getElementById('url_pattern').value);
  var url = document.getElementById('example_url').value;
  var out = url.match(pattern);
  document.getElementById('example_url_out').innerHTML = out ? "OK": "DOES NOT MATCH";
};

function update_title_example(){
  var pattern = new RegExp(document.getElementById('pattern').value);
  var replacement = document.getElementById('replacement').value;
  var pattern = new RegExp(document.getElementById('pattern').value);
  var url = document.getElementById('example_url').value;
  replacement= replacement.replace("$url", url);

  var title = document.getElementById('example_title').value;
  var out = title.replace(pattern, replacement);
  out = (out.indexOf("$html:") == 0) ? out.replace("$html:", "") :  escape_html(out);
  document.getElementById('example_out').innerHTML = out;
};

function escape_html(html){
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

function init() {
  init_listeners();

  document.getElementById('url_pattern').value =  config('url_pattern');
  document.getElementById('pattern').value =  config('pattern');
  document.getElementById('replacement').value = config('replacement');

  update_examples();
};

document.addEventListener('DOMContentLoaded', init);
