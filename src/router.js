Zeppelin.Router = Backbone.Router.extend({
  constructor: function(options) {
    this.cid = _.uniqueId('router');
    this._isUnplugged = false;
    this._subscriptions = {};
    Backbone.Router.prototype.constructor.apply(this, arguments);
    this.addSubscriptions();
  },

  toString: function() {
    return '[object Router]';
  },

  getFragment: function() {
    return Backbone.history.getFragment();
  },

  getRoute: function() {
    var route = null,
        params = null,
        fragment = Backbone.history.getFragment(),
        matched;

    matched = _.find(Backbone.history.handlers, function(handler) {
      return handler.route.test(fragment);
    });

    if(matched) {
      route = matched.route;
      params = this._extractParameters(route, fragment);
    }

    return {
      route: route,
      params: params,
      fragment: fragment
    };
  },

  execute: function() {
    this.trigger('before:route', this);
    this.beforeRoute.apply(this, arguments);
    Backbone.Router.prototype.execute.apply(this, arguments);
    this.trigger('after:route', this);
    this.afterRoute.apply(this, arguments);
  },

  beforeRoute: function(callback, args) {
    return this;
  },

  afterRoute: function(callback, args) {
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

_.extend(Zeppelin.Router.prototype, Zeppelin.Subscriptions);
