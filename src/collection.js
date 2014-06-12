Zeppelin.Collection = Backbone.Collection.extend({
  constructor: function(models, options) {
    options = options || {};
    this.cid = _.uniqueId('collection');
    this.cacheId = options.cacheId || this.cacheId;
    this.cacheType = options.cacheType || this.cacheType;
    this._views = [];
    this._subscriptions = {};
    this.createCache();
    Backbone.Collection.prototype.constructor.apply(this, arguments);
    this.addSubscriptions();
  },

  model: Z.Model,

  cacheId: null,

  cacheType: 'localStorage',

  toString: function() {
    return '[object Collection]';
  },

  getAttributes: function() {
    return this.map(function(model) {
      return model.attributes;
    });
  },

  getLocalAttributes: function() {
    return this.map(function(model) {
      return model.getLocalAttributes();
    });
  },

  createCache: function(id, type) {
    id = id || this.cacheId;
    type = type || this.cacheType || 'localStorage';

    if (id) this.cache = new Zeppelin.Storage({
      type: type,
      namespace: id
    });

    return this;
  },

  fetchCache: function() {
    if (this.cache) this.set(this.cache.getAll());
    return this;
  },

  saveCache: function() {
    if (this.cache) this.cache.setAll(this.getAttributes());
    return this;
  },

  destroyCache: function() {
    if (this.cache) this.cache.clearAll();
    return this;
  }
});

_.extend(Zeppelin.Collection.prototype, Zeppelin.Subscriptions);
