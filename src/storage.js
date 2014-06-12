Zeppelin.Storage = function(options) {
  options = options || {};
  _.merge(this, options);
  this.cid = _.uniqueId('storage');
  this.type = 'localStorage';
  this.store = localStorage;

  if (options.type) {
    if (options.type === 'localStorage') {
      this.type = 'localStorage';
      this.store = localStorage;
    } else if (options.type === 'sessionStorage') {
      this.type = 'sessionStorage';
      this.store = sessionStorage;
    }
  }

  this.namespace = options.namespace || this.cid;
  this._subscriptions = {};
  this.addSubscriptions();
};

_.extend(Zeppelin.Storage.prototype, {
  toString: function() {
    return '[object Storage]';
  },

  has: function(key) {
    if (this.get(key)) {
      return true;
    } else {
      return false;
    }
  },

  length: function() {
    return _.size(this.getAll());
  },

  isEmpty: function() {
    return this.length() === 0;
  },

  set: function(key, value) {
    var data = this.getAll();

    if (_.isPlainObject(key)) {
      this.setAll(_.extend(data, key));
    } else if (_.isString(key)) {
      data[key] = value;
      this.setAll(data);
    }

    return this;
  },

  setAll: function(data) {
    this.store.setItem(this.namespace, JSON.stringify(data));
    return this;
  },

  get: function(key) {
    return this.getAll()[key];
  },

  getAll: function() {
    return JSON.parse(this.store.getItem(this.namespace)) || {};
  },

  clear: function(key) {
    var data = this.getAll();

    if (_.isString(key)) {
      delete data[key];
      this.setAll(data);
    }

    return this;
  },

  clearAll: function() {
    this.store.removeItem(this.namespace);
    return this;
  },

  unplug: function() {
    this.trigger('before:unplug', this);
    this.off();
    this.stopListening();
    this._isUnplugged = true;
    this.trigger('after:unplug', this);
    this.onUnplug(this);
    return this;
  },

  onUnplug: function() {
    return this;
  },

  isUnplugged: function() {
    return this._isUnplugged;
  }
});

_.extend(Zeppelin.Storage.prototype, Zeppelin.Subscriptions);

Zeppelin.Storage.extend = Zeppelin.extend;
