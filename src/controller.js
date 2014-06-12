Zeppelin.Controller = function(options) {
  options = options || {};
  this.options = _.extend({}, this.options, options);
  this.cid = _.uniqueId('controller');
  this._isUnplugged = false;
  this._views = {}
  this._regions = {}
  this._layouts = {}
  this._subscriptions = {};
  this.setTitle();
  this.addViews();
  this.addRegions();
  this.addLayouts();
  this.initialize.apply(this, arguments);
  this.addSubscriptions();
};

_.extend(Zeppelin.Controller.prototype, {
  toString: function() {
    return '[object Controller]';
  },

  initialize: function() {
    return this;
  },

  name: null,

  title: null,

  setTitle: function(title) {
    document.title = title || this.title;
    return this;
  },

  hasFocus: function() {
    return document.hasFocus();
  },

  scrollTo: function(x, y) {
    window.scrollTo(x, y);
    return this;
  },

  scrollToTop: function() {
    window.scrollTo(0, 0);
    return this;
  },

  scrollToBottom: function() {
    window.scrollTo(0, $(document).height());
    return this;
  },

  unplug: function() {
    this.trigger('before:unplug', this);
    this.off();
    this.stopListening();
    this.removeViews();
    this.removeRegions();
    this.removeLayouts();
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

_.extend(Zeppelin.Controller.prototype, Zeppelin.Subscriptions);
_.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasViews);
_.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasRegions);
_.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasLayouts);

Zeppelin.Controller.extend = Zeppelin.extend;
