function escape_html(html) {
  var escapeEl = document.createElement('textarea');
  escapeEl.textContent = html;
  return escapeEl.innerHTML;
};

Config = {
  storage: chrome.storage.sync,

  get: function(key, callback) {
    Config.storage.get(key, Config.storage_callback(callback));
  },

  set: function(key, value, callback) {
    var items = {};
    items[key] = value;
    Config.storage.set(items, Config.storage_callback(callback));
  },

  remove: function(key, callback) {
    Config.storage.remove(key, Config.storage_callback(callback));
  },

  storage_callback: function(callback) {
    return function(items) { callback(chrome.runtime.lastError, items) };
  },

  get_all: function(callback) {
    Config.get(null, callback);
  },

  remove_all: function() {
    Config.storage.clear();
  },
};

BgConfig = {
  rules: [],
  init: function(callback) {
    if (!callback) { callback = function() { } }
    BgConfig.init_complete_callback = callback;
    BgConfig.load_rules();
  },


  match: function(url) {
    for (var i in BgConfig.rules) {
      if (BgConfig.rules[i].match(url)) {
        return true;
      }
    }
    return false;
  },

  load_rules: function() {
    Config.get_all(BgConfig.load_rules_callback);
  },

  load_rules_callback: function(err, items) {
    if (err) { console.log(err); return; };
    var rules = []
    for (rule_id in items) {
      rules.push(new RuleConfig(rule_id, items[rule_id]))
    }
    BgConfig.rules = rules;

    BgConfig.init_complete_callback(BgConfig);
  },

  apply: function(url, title) {
    var result = [];
    for (var i in BgConfig.rules) {
      var rule = BgConfig.rules[i];
      if (rule.match(url)) {
        result.push({ name: rule.getName(), content: rule.apply(url, title) })
      }
    }
    return result;
  }
};

RuleConfig = function(id, fields) {
  this.id = (id ? id : ('rule_' + Date.now()));
  this.defaults = {
    email: {
      name: "Email",
      test_url: 'https://issues.apache.org/jira/browse/HADOOP-3629',
      test_title: '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
      url_pattern: '(jira|tickets)*/browse/',
      title_pattern: '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
      out_pattern: '$html:<a href="$url">$1:$2</a>'
    },
    email_short: {
      name: "Email short",
      test_url: 'https://issues.apache.org/jira/browse/HADOOP-3629',
      test_title: '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
      url_pattern: '(jira|tickets)*/browse/',
      title_pattern: '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
      out_pattern: '$html:<a href="$url">$1</a>'
    },
    markdown: {
      name: "Markdown",
      test_url: 'https://issues.apache.org/jira/browse/HADOOP-3629',
      test_title: '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
      url_pattern: '(jira|tickets)*/browse/',
      title_pattern: '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
      out_pattern: '[$1: $2]($url)'
    },
    markdown_short: {
      name: "Markdown short",
      test_url: 'https://issues.apache.org/jira/browse/HADOOP-3629',
      test_title: '[HADOOP-3629] Document the metrics produced by hadoop - JIRA',
      url_pattern: '(jira|tickets)*/browse/',
      title_pattern: '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
      out_pattern: '[$1]($url)'
    },

    custom_v1_jira_slack: {
      name: "Slack (v1)",
      test_url: 'https://issues.apache.org/jira/browse/HADOOP-19092',
      test_title: '[HADOOP-19092] ABFS phase 4: post Hadoop 3.4.0 features - Enterprise JIRA',
      url_pattern: '(jira|tickets)*/browse/',
      title_pattern: '^\\[#?([^\\]]+)\\](.*)( -[^-]+)$',
      out_pattern: '`$1`: [$2]($url)'
    },

    custom_v1_github_slack: {
      name: "Slack (v1)",
      test_url: 'https://github.com/mshytikov/jira-shortcut/pull/10',
      test_title: 'Migrated to Manifest v3 by mshytikov · Pull Request #10 · mshytikov/jira-shortcut · GitHub',
      url_pattern: 'github.*\\.com/.*/pull/',
      title_pattern: '(.*) by .* · Pull Request .*/([^\\s]+).*',
      out_pattern: '*$2 PR:* [$1]($url)'
    },
  };

  this.default_fields = function(type) {
    return JSON.parse(JSON.stringify(this.defaults[type]));
  }

  this.fields = (fields ? fields : this.default_fields("email"));

  this.getName = function() {
    return this.get("name") || "rule";
  };
  this.get = function(field) {
    return this.fields[field];
  };

  this.reset = function(type) {
    this.fields = this.default_fields(type);
  };

  this.set = function(field, value) {
    this.fields[field] = value;
  };

  this.save = function(status) {
    Config.set(
      this.id,
      this.fields,
      this.save_callback.bind(this, status)
    );
  };

  this.save_callback = function(status, err) {
    if (err) { status(err); return null };
    status();
  };

  this.load = function(status) {
    Config.get(this.id, this.load_callback.bind(this, status));
  };

  this.load_callback = function(status, err, items) {
    if (err) { status(err); return null };
    var fields = items[this.id]
    if (fields) { this.fields = fields; }
    status();
  };

  this.remove = function(status) {
    Config.remove(this.id, this.remove_callback.bind(this, status));
  };

  this.remove_callback = function(status, err) {
    if (err) { status(err); return null };
    status();
  };

  this.match = function(url) {
    return url.match(new RegExp(this.get('url_pattern')));
  };

  this.apply = function(url, title) {
    var title_pattern = new RegExp(this.fields.title_pattern);
    var out_pattern = this.fields.out_pattern;
    var url_base = url.split("?")[0]; // url part before '?'
    out_pattern = out_pattern.replace(/\$url_base/g, url_base);
    out_pattern = out_pattern.replace(/\$url/g, url);
    var result = title.replace(title_pattern, out_pattern);
    result = (
      result.indexOf("$html:") == 0 ?
        result.replace("$html:", "") :
        escape_html(result)
    );
    return result;
  };
}
