Zeppelin.Subscriptions = _.extend({
  subscriptions: {},

  hasSubscriptions: function() {
    return _.size(this._subscriptions) > 0;
  },

  hasSubscription: function(event) {
    return this._subscriptions[event] !== undefined;
  },

  subscribe: function(event, callback) {
    if (!_.isFunction(callback)) callback = this[callback];
    this.listenTo(Backbone.Events, event, callback);
    this._subscriptions[event] = callback;
    return this;
  },

  subscribeToOnce: function(event, callback) {
    if (!_.isFunction(callback)) callback = this[callback];
    this.listenToOnce(Backbone.Events, event, callback);
    this._subscriptions[event] = callback;
    return this;
  },

  addSubscriptions: function(subscriptions) {
    subscriptions = subscriptions || _.result(this, 'subscriptions');

    _.forOwn(subscriptions, function(callback, event) {
      this.subscribe(event, callback);
    }, this);

    return this;
  },

  broadcast: function() {
    Backbone.Events.trigger.apply(this, arguments);
    Backbone.Events.trigger.apply(Backbone.Events, arguments);
    return this;
  },

  unsubscribe: function(event) {
    if (event) {
      this.stopListening(Backbone.Events, event);
      delete this._subscriptions[event];
    } else if (!event) {
      this.stopListening(Backbone.Events);
      this._subscriptions = {};
    }

    return this;
  },

  request: function(request, data, callback) {
    var responseChannel = _.uniqueId('resp:' + request);

    if (arguments.length === 2) callback = data;
    if (!_.isFunction(callback)) callback = this[callback];
    if (!callback) return this;

    this.subscribeToOnce(responseChannel, callback);

    if (arguments.length === 3 && data !== undefined) {
      this.broadcast(request, responseChannel, data);
    } else {
      this.broadcast(request, responseChannel);
    }

    return this;
  }
}, Backbone.Events);
