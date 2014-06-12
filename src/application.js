Zeppelin.Application = Zeppelin.Router.extend({
  constructor: function(options) {
    options = options || {};
    this.options = _.extend({}, this.options, options);
    this.controller = null;
    Z.Router.prototype.constructor.apply(this, arguments);
  },

  toString: function() {
    return '[object Application]';
  },

  setController: function(controller, options) {
    if (!Z.Util.isController(controller)) return this;
    this.unsetController();
    this.controller = Z.Util.getInstance(controller, options);
    return this;
  },

  unsetController: function() {
    if (this.controller) this.controller.unplug();
    this.controller = null;
    return this;
  },

  isCurrentController: function(name) {
    return this.controller.name === name;
  },

  start: function(options) {
    this.broadcast('app:before:start');
    if (!Backbone.History.started) Backbone.history.start(options);
    this.broadcast('app:after:start');
    this.onStart();
    return this;
  },

  onStart: function() {
    return this;
  },

  reload: function() {
    this.broadcast('app:before:reload');
    Backbone.history.loadUrl(Backbone.history.fragment);
  },

  stop: function() {
    this.broadcast('app:before:stop');
    if (Backbone.History.started) Backbone.history.stop();
    this.broadcast('app:after:stop');
    this.onStop();
    return this;
  },

  onStop: function() {
    return this;
  }
});
