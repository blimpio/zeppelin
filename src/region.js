Zeppelin.Region = function(options) {
  options = options || {};
  this.options = _.extend({}, this.options, options);
  this.el = options.el || this.el;
  this.view = options.view || this.view;
  if (!this.el) Z.Util.Error('Region must have an "el" property.');
  this.cid = _.uniqueId('region');
  this._view = this.view;
  this._isShown = false;
  this._isUnplugged = false;
  this._isRemoved = false;
  this._elements = {};
  this._subscriptions = {};
  this.setElement();
  if (this.view) this.setView(this._view);
  this.initialize.apply(this, arguments);
  this.addSubscriptions();
};

_.extend(Zeppelin.Region.prototype, {
  initialize: function() {
    return this;
  },

  keepEl: false,

  toString: function() {
    return '[object Region]';
  },

  view: Z.View,

  hasView: function() {
    return Z.Util.isView(this.view);
  },

  setElement: function(element) {
    element = element || _.result(this, 'el');
    this.$el = Z.Util.isJqueryObject(element) ? element : Z.$(element);
    if (this.$el.length) this.el = this.$el[0];
    this.delegateEvents();
    return this;
  },

  $: function(selector) {
    return this.$el.find(selector);
  },

  setView: function(view, options) {
    view = view || this._view;

    if (!Z.Util.isView(view)) return this;
    if (this.hasView() && this.isShown()) this.close();
    this.view = Z.Util.getInstance(view, options);
    return this;
  },

  renderView: function(view) {
    this.$el.html(this.view.render().el);
    return this;
  },

  show: function(view) {
    if (view) this.setView(view);
    if (!this.hasView()) this.setView(this._view);
    this.trigger('before:show', this.view);
    if (!this.$el) this.setElement();
    if (this.hasView()) this.renderView(this.view);
    this._isShown = true;
    this.addElements();
    this.trigger('after:show', this.view);
    this.onShow(this.view);
    return this;
  },

  onShow: function(view) {
    return this;
  },

  isShown: function() {
    return this._isShown;
  },

  close: function() {
    this.trigger('before:close', this.view);
    if (this.hasView()) this.view.remove();
    this.view = null;
    this._isShown = false;
    this.trigger('after:close', this.view);
    this.onClose(this.view);
    return this;
  },

  onClose: function(view) {
    return this;
  },

  unplug: function(deep) {
    deep = deep || false;
    if (deep && this.hasView()) this.view.unplug(true);
    this.trigger('before:unplug', this);
    this.off();
    this.stopListening();
    this.$el.off();
    this.undelegateEvents();
    this.removeElements();
    this._isUnplugged = false;
    this.trigger('after:unplug', this);
    this.onUnplug(this);
  },

  onUnplug: function() {
    return this;
  },

  isUnplugged: function() {
    return this._isUnplugged;
  },

  remove: function() {
    if (!this.keepEl) this.close();
    this.unplug(true);
    this.trigger('before:remove', this);
    if (!this.keepEl) this.$el.remove();
    this.view = null;
    this._isRemoved = false;
    this.trigger('after:remove', this);
    this.onRemove();
    return this;
  },

  onRemove: function() {
    return this;
  },

  isRemoved: function() {
    return this._isRemoved;
  }
});

_.extend(Zeppelin.Region.prototype, Zeppelin.Subscriptions);
_.extend(Zeppelin.Region.prototype, Zeppelin.Mixin.hasElements);

Zeppelin.Region.extend = Zeppelin.extend;
