Zeppelin.Layout = function(options) {
  options = options || {};
  this.options = _.extend({}, this.options, options);
  this.el = options.el || this.el;
  this.regions = options.regions || this.regions;
  if (!this.el) Z.Util.Error('Layout must have an "el" property.');
  this.cid = _.uniqueId('layout');
  this._isRemoved = false;
  this._isRendered = true;
  this._isUnplugged = false;
  this._isFisrtRendered = true;
  this._regions = {};
  this._elements = {};
  this._subscriptions = {};
  this.setElement(_.result(this, 'el'));
  this.initialize.apply(this, arguments);
  this.addSubscriptions();
};

_.extend(Zeppelin.Layout.prototype, {
  keepEl: false,

  initialize: function() {
    return this;
  },

  toString: function() {
    return '[object Layout]';
  },

  setElement: function(element) {
    element = element || _.result(this, 'el');
    this.$el = Z.Util.isJqueryObject(element) ? element : Z.$(element);
    if (this.$el.length) this.el = this.$el[0];
    this.delegateEvents();

    if (!this.isFirstRender()) {
      this.addRegions();
      this.addElements();
    }

    return this;
  },

  $: function(selector) {
    return this.$el.find(selector);
  },

  template: null,

  context: function() {
    return {};
  },

  renderTemplate: function() {
    return Z.View.prototype.renderTemplate.apply(this, arguments);
  },

  render: function(template, context) {
    this.trigger('before:render', this);
    if (!this.$el) this.setElement();
    this.$el.html(this.renderTemplate(template, context));
    this._isRendered = true;
    this._isFisrtRendered = false;
    this.addRegions();
    this.addElements();
    this.trigger('after:render', this);
    this.onRender(this);
    return this;
  },

  onRender: function() {
    return this;
  },

  isFirstRender: function() {
    return this._isFisrtRender;
  },

  isRendered: function() {
    return this._isRendered;
  },

  unplug: function(deep) {
    deep = deep || false;

    if (deep) this.unplugRegions(true);
    this.trigger('before:unplug', this);
    this.off();
    this.stopListening();
    this.$el.off();
    this.undelegateEvents();
    this._isUnplugged = true;
    this.trigger('after:unplug', this);
    this.onUnplug(this);
  },

  onUnplug: function() {
    return this;
  },

  isUnplugged: function() {
    return this._isUnplugged;
  },

  empty: function() {
    this.trigger('before:empty', this);
    this.$el.empty();
    this._isEmpty = true;
    this.trigger('after:empty', this);
    this.onEmpty(this);
    return this;
  },

  onEmpty: function() {
    return this;
  },

  isEmpty: function() {
    return this._isEmpty;
  },

  remove: function() {
    this.unplug(true);
    this.removeRegions();
    this.removeElements();
    this.trigger('before:remove', this);
    if (!this.keepEl) this.$el.remove();
    this._isRemoved = true;
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

_.extend(Zeppelin.Layout.prototype, Zeppelin.Subscriptions);
_.extend(Zeppelin.Layout.prototype, Zeppelin.Mixin.hasRegions);
_.extend(Zeppelin.Layout.prototype, Zeppelin.Mixin.hasElements);

Zeppelin.Layout.extend = Zeppelin.extend;
