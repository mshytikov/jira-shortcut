function save_options() {
  set_config('url_pattern', document.getElementById('url_pattern').value);
  set_config('pattern', document.getElementById('pattern').value);
  set_config('replacment', document.getElementById('replacment').value);

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
  document.getElementById('replacment').value = DEFAULT_CONFIG['replacment'];
  update_examples();
};

function init_listeners(){
  document.getElementById('save').addEventListener('click', save_options);
  document.getElementById('reset').addEventListener('click', reset_to_defaults);

  document.getElementById('pattern').addEventListener('change', update_title_example, false);
  document.getElementById('replacment').addEventListener('change', update_title_example, false);
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
  var replacment = document.getElementById('replacment').value;

  var title = document.getElementById('example_title').value;
  var out = title.replace(pattern, replacment);
  document.getElementById('example_out').innerHTML = out;
};

function init() {
  init_listeners();

  document.getElementById('url_pattern').value =  config('url_pattern');
  document.getElementById('pattern').value =  config('pattern');
  document.getElementById('replacment').value = config('replacment');

  update_examples();
};

document.addEventListener('DOMContentLoaded', init);
