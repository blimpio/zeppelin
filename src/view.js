Zeppelin.View = Backbone.View.extend({
  constructor: function(options) {
    options = options || {};
    this.options = _.extend({}, this.options, options);
    this.cid = _.uniqueId('view');
    this._elements = {};
    this._bindings = {};
    this._subscriptions = {};
    this._isFisrtRender = true;
    this._isRendered = false;
    this._isUnplugged = false;
    this._isRemoved = false;
    this._configure.call(this, options);
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
    this.addBindings();
    this.addSubscriptions();
  },

  _configure: function() {
    return this;
  },

  toString: function() {
    return '[object View]';
  },

  template: null,

  context: function() {
    return {};
  },

  renderTemplate: function(template, context) {
    var output = '';

    if (template && context) {
      context = _.isPlainObject(context)
        ? context
        : _.result(this, 'context');

      template = _.isFunction(template)
        ? template
        : this.template;
    } else {
      context = _.isPlainObject(template)
        ? template
        : _.result(this, 'context');

      template = _.isFunction(template)
        ? template
        : this.template;
    }

    if (template) output = template.call(this, context);

    return output;
  },

  render: function(template, context) {
    this.trigger('before:render', this);
    this.$el.html(this.renderTemplate(template, context));
    this._isRendered = true;
    this.addElements();
    this.trigger('after:render', this);
    this.onRender(this);
    this._isFisrtRender = false;
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

  unplug: function() {
    this.trigger('before:unplug', this);
    this.off();
    this.stopListening();
    this.$el.off();
    this.undelegateEvents();
    this.removeElements();
    this.options = null;
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
  },

  remove: function() {
    this.unplug(true);
    this.trigger('before:remove', this);
    this.$el.remove();
    this._isRemoved = true;
    this.trigger('after:remove', this);
    this.onRemove(this);
    return this;
  },

  onRemove: function() {
    return this;
  }
});

_.extend(Zeppelin.View.prototype, Zeppelin.Bindings);
_.extend(Zeppelin.View.prototype, Zeppelin.Subscriptions);
_.extend(Zeppelin.View.prototype, Zeppelin.Mixin.hasPartials);
_.extend(Zeppelin.View.prototype, Zeppelin.Mixin.hasElements);
