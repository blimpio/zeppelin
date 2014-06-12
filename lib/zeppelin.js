(function (root, Backbone) {
  'use strict';

  var Zeppelin, Z;

  if (typeof exports !== 'undefined') {
    Zeppelin = exports;
  } else {
    root.Zeppelin = root.Z = Zeppelin = Z = {};
  }

  Zeppelin.$ = Backbone.$;
  Zeppelin.extend = Backbone.View.extend;
  Zeppelin.VERSION = '0.0.1';

  Zeppelin.Util = {
    Error: function (message) {
      throw new Error(message);
    },

    isView: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object View]';
    },

    isModel: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Model]';
    },

    isCollection: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Collection]';
    },

    isRegion: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Region]';
    },

    isLayout: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Layout]';
    },

    isController: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Controller]';
    },

    isRouter: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Router]';
    },

    isApplication: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Application]';
    },

    isStorage: function (value) {
      var toString;

      if (!value) return false;

      toString = _.isFunction(value) ? value.prototype.toString() : value.toString();

      return toString === '[object Storage]';
    },

    isJqueryObject: function (value) {
      return value instanceof jQuery;
    },

    isInDOM: function (element) {
      if (!_.isElement(element)) {
        element = Z.Util.isJqueryObject(element) ? element[0] : Z.$(element)[0];
      }

      return Z.$.contains(document, element);
    },

    getElementEvents: function (element) {
      if (!_.isElement(element)) {
        element = Z.Util.isJqueryObject(element) ? element[0] : Z.$(element)[0];
      }

      return Z.$._data(element, 'events');
    },

    getInstance: function (module, options) {
      return _.isFunction(module) ? new module(options) : module;
    }
  };

  Zeppelin.Subscriptions = _.extend({
    subscriptions: {},

    hasSubscriptions: function () {
      return _.size(this._subscriptions) > 0;
    },

    hasSubscription: function (event) {
      return this._subscriptions[event] !== undefined;
    },

    subscribe: function (event, callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      this.listenTo(Backbone.Events, event, callback);
      this._subscriptions[event] = callback;
      return this;
    },

    subscribeToOnce: function (event, callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      this.listenToOnce(Backbone.Events, event, callback);
      this._subscriptions[event] = callback;
      return this;
    },

    addSubscriptions: function (subscriptions) {
      subscriptions = subscriptions || _.result(this, 'subscriptions');

      _.forOwn(subscriptions, function (callback, event) {
        this.subscribe(event, callback);
      }, this);

      return this;
    },

    broadcast: function () {
      Backbone.Events.trigger.apply(this, arguments);
      Backbone.Events.trigger.apply(Backbone.Events, arguments);
      return this;
    },

    unsubscribe: function (event) {
      if (event) {
        this.stopListening(Backbone.Events, event);
        delete this._subscriptions[event];
      } else if (!event) {
        this.stopListening(Backbone.Events);
        this._subscriptions = {};
      }

      return this;
    },

    request: function (request, data, callback) {
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

  Zeppelin.Storage = function (options) {
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
    toString: function () {
      return '[object Storage]';
    },

    has: function (key) {
      if (this.get(key)) {
        return true;
      } else {
        return false;
      }
    },

    length: function () {
      return _.size(this.getAll());
    },

    isEmpty: function () {
      return this.length() === 0;
    },

    set: function (key, value) {
      var data = this.getAll();

      if (_.isPlainObject(key)) {
        this.setAll(_.extend(data, key));
      } else if (_.isString(key)) {
        data[key] = value;
        this.setAll(data);
      }

      return this;
    },

    setAll: function (data) {
      this.store.setItem(this.namespace, JSON.stringify(data));
      return this;
    },

    get: function (key) {
      return this.getAll()[key];
    },

    getAll: function () {
      return JSON.parse(this.store.getItem(this.namespace)) || {};
    },

    clear: function (key) {
      var data = this.getAll();

      if (_.isString(key)) {
        delete data[key];
        this.setAll(data);
      }

      return this;
    },

    clearAll: function () {
      this.store.removeItem(this.namespace);
      return this;
    },

    unplug: function () {
      this.trigger('before:unplug', this);
      this.off();
      this.stopListening();
      this._isUnplugged = true;
      this.trigger('after:unplug', this);
      this.onUnplug(this);
      return this;
    },

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    }
  });

  _.extend(Zeppelin.Storage.prototype, Zeppelin.Subscriptions);

  Zeppelin.Storage.extend = Zeppelin.extend;

  Zeppelin.Validations = {
    exists: function (value) {
      if (value === undefined) {
        return false;
      } else if (value === null) {
        return false;
      } else if (_.isNaN(value)) {
        return false;
      } else if (value === Infinity) {
        return false;
      } else {
        return true;
      }
    },

    matchesRegExp: function (value, regexp) {
      if (this.isString(value) && this.isRegExp(regexp)) {
        return regexp.test(value);
      } else {
        return false;
      }
    },

    isEmpty: function (value) {
      if (this.exists(value)) {
        return _.isEmpty(value);
      } else {
        return true;
      }
    },

    isEqual: function (a, b) {
      if (this.exists(a)) {
        return _.isEqual(a, b);
      } else {
        return false;
      }
    },

    isRegExp: function (value) {
      if (this.exists(value)) {
        return _.isRegExp(value);
      } else {
        return false;
      }
    },

    isBoolean: function (value) {
      if (this.exists(value)) {
        return _.isBoolean(value);
      } else {
        return false;
      }
    },

    isObject: function (value) {
      if (this.exists(value)) {
        return _.isObject(value);
      } else {
        return false;
      }
    },

    isPlainObject: function (value) {
      if (this.exists(value)) {
        return _.isPlainObject(value);
      } else {
        return false;
      }
    },

    isArray: function (value) {
      if (this.exists(value)) {
        return _.isArray(value);
      } else {
        return false;
      }
    },

    isString: function (value) {
      if (this.exists(value)) {
        return _.isString(value);
      } else {
        return false;
      }
    },

    isNumber: function (value) {
      if (this.exists(value)) {
        return _.isNumber(value);
      } else {
        return false;
      }
    },

    isOneOf: function (value, types) {
      if (this.exists(value) && this.isArray(types)) {
        return _.indexOf(types, value) !== -1;
      } else {
        return false;
      }
    },

    isDate: function (value) {
      var date;

      if (this.exists(value)) {
        date = new Date(value);
        return date.toString() !== 'Invalid Date' && _.isDate(date);
      } else {
        return false;
      }
    },

    isDateISO: function (value) {
      if (this.isString(value)) {
        return /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/.test(value);
      } else {
        return false;
      }
    },

    isDigit: function (value) {
      if (this.isString(value)) {
        return /^-?\d+\.?\d*$/.test(value);
      } else {
        return false;
      }
    },

    isEmail: function (value) {
      if (this.isString(value)) {
        return /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
      } else {
        return false;
      }
    },

    isUrl: function (value) {
      if (this.isString(value)) {
        return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
      } else {
        return false;
      }
    },

    isDomainName: function (value) {
      if (this.isString(value)) {
        return /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/.test(value);
      } else {
        return false;
      }
    },

    isAlphanumeric: function (value) {
      if (this.isString(value)) {
        return /^\w+$/.test(value);
      } else {
        return false;
      }
    },

    isPhone: function (value) {
      if (this.isString(value)) {
        return /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
      } else {
        return false;
      }
    },

    isMinimum: function (value, minimum) {
      if (this.isNumber(value) && this.isNumber(minimum)) {
        return value >= minimum;
      } else {
        return false;
      }
    },

    isMaximum: function (value, maximum) {
      if (this.isNumber(value) && this.isNumber(maximum)) {
        return value <= maximum;
      } else {
        return false;
      }
    },

    isInRange: function (value, range) {
      var minimum, maximum;

      if (this.isNumber(value) && this.isArray(range)) {
        minimum = range[0];
        maximum = _.last(range);

        if (this.isNumber(minimum) && this.isNumber(maximum)) {
          return value >= minimum && value <= maximum;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    isOfLength: function (value, length) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(length)) {
        return value.length === length;
      } else {
        return false;
      }
    },

    isOfMinimumLength: function (value, minimum) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(minimum)) {
        return value.length >= minimum;
      } else {
        return false;
      }
    },

    isOfMaximumLength: function (value, maximum) {
      if (this.exists(value) && value.length !== undefined && this.isNumber(maximum)) {
        return value.length <= maximum;
      } else {
        return false;
      }
    },

    isLengthInRange: function (value, range) {
      var minimum, maximum;

      if (this.exists(value) && value.length !== undefined && this.isArray(range)) {
        minimum = range[0];
        maximum = _.last(range);

        if (this.isNumber(minimum) && this.isNumber(maximum)) {
          return value.length >= minimum && value.length <= maximum;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  Zeppelin.Bindings = {
    bindings: {},

    addBinding: function (type, events) {
      if (!_.isPlainObject(events)) return this;

      if (type === 'self') {
        this.addSelfBinding(events);
      } else if (type === 'model') {
        this.addModelBinding(events);
      } else if (type === 'collection') {
        this.addCollectionBinding(events);
      } else if (type === 'views') {
        _.forOwn(events, function (_events, name) {
          this.addViewBinding(name, _events);
        }, this);
      } else if (type === 'regions') {
        _.forOwn(events, function (_events, name) {
          this.addRegionBinding(name, _events);
        }, this);
      }

      return this;
    },

    addSelfBinding: function (events) {
      _.forOwn(events, function (callback, event) {
        var once = false;

        if (_.isPlainObject(callback)) {
          once = callback.once || false;
          callback = callback.callback;
        }

        if (!_.isFunction(callback)) callback = this[callback];

        if (event && callback) {
          if (once) {
            this.once(event, callback);
          } else {
            this.on(event, callback);
          }
        }
      }, this);

      return this;
    },

    addModelBinding: function (events) {
      _.forOwn(events, function (callback, event) {
        var once = false;

        if (_.isPlainObject(callback)) {
          once = callback.once || false;
          callback = callback.callback;
        }

        if (!_.isFunction(callback)) callback = this[callback];

        if (event && callback && _.result(this, 'hasModel')) {
          if (once) {
            this.listenToOnce(this.model, event, callback);
          } else {
            this.listenTo(this.model, event, callback);
          }
        }
      }, this);

      return this;
    },

    addCollectionBinding: function (events) {
      _.forOwn(events, function (callback, event) {
        var once = false;

        if (_.isPlainObject(callback)) {
          once = callback.once || false;
          callback = callback.callback;
        }

        if (!_.isFunction(callback)) callback = this[callback];

        if (event && callback && _.result(this, 'hasCollection')) {
          if (once) {
            this.listenToOnce(this.collection, event, callback);
          } else {
            this.listenTo(this.collection, event, callback);
          }
        }
      }, this);

      return this;
    },

    addViewBinding: function (name, events) {
      var view = this.getView ? this.getView(name) : undefined;

      if (!Z.Util.isView(view)) return this;

      _.forOwn(events, function (callback, event) {
        var once = false;

        if (_.isPlainObject(callback)) {
          once = callback.once || false;
          callback = callback.callback;
        }

        if (!_.isFunction(callback)) callback = this[callback];

        if (event && callback) {
          if (once) {
            this.listenToOnce(view, event, callback);
          } else {
            this.listenTo(view, event, callback);
          }
        }
      }, this);

      return this;
    },

    addRegionBinding: function (name, events) {
      var region = this.getRegion ? this.getRegion(name) : undefined;

      if (!Z.Util.isRegion(region)) return this;

      _.forOwn(events, function (callback, event) {
        var once = false;

        if (_.isPlainObject(callback)) {
          once = callback.once || false;
          callback = callback.callback;
        }

        if (!_.isFunction(callback)) callback = this[callback];

        if (event && callback) {
          if (once) {
            this.listenToOnce(region, event, callback);
          } else {
            this.listenTo(region, event, callback);
          }
        }
      }, this);

      return this;
    },

    addBindings: function (bindings) {
      bindings = bindings || _.result(this, 'bindings');

      _.forOwn(bindings, function (events, type) {
        this.addBinding(type, events);
      }, this);

      return this;
    }
  };

  Zeppelin.Mixin = {};

  Zeppelin.Mixin.hasLayouts = {
    layouts: {},

    hasLayouts: function () {
      return _.size(this._layouts) > 0;
    },

    hasLayout: function (name) {
      return this._layouts[name] !== undefined;
    },

    getLayout: function (name) {
      return this._layouts[name];
    },

    getLayoutName: function (layout) {
      var name;

      if (!Z.Util.isLayout(layout)) return undefined;

      _.forOwn(this._layouts, function (_layouts, name) {
        if (_layout.cid === layout.cid) {
          name = name;
          return false;
        }
      });

      return name;
    },

    addLayout: function (name, layout, options) {
      if (!Z.Util.isLayout(layout)) return this;
      if (this.hasLayout(name)) this.unplugLayout(name, true);
      this._layouts[name] = Z.Util.getInstance(layout, options);
      this._layouts[name].on('after:remove', this._onViewRemoved, this);
      return this;
    },

    addLayouts: function (layouts) {
      layouts = layouts || _.result(this, 'layouts');

      _.forOwn(layouts, function (layout, name) {
        this.addLayout(name, layout);
      }, this);

      return this;
    },

    showLayout: function (name) {
      if (this.hasLayout(name)) this.getLayout(name).show();
      return this;
    },

    showLayouts: function (layouts) {
      layouts = layouts || _.keys(this._layouts);
      _.forEach(layouts, this.showLayout, this);
      return this;
    },

    closeLayout: function (name) {
      if (this.hasLayout(name)) this.getLayout(name).close();
      return this;
    },

    closeLayouts: function (layouts) {
      layouts = layouts || _.keys(this._layouts);
      _.forEach(layouts, this.closeLayout, this);
      return this;
    },

    unplugLayout: function (name, deep) {
      deep = deep || false;
      if (this.hasLayout(name)) this.getLayout(name).unplug(deep);
      return this;
    },

    unplugLayouts: function (layouts, deep) {
      deep = deep || false;
      layouts = layouts || _.keys(this._layouts);

      _.forEach(layouts, function (name) {
        this.unplugLayout(name, deep);
      }, this);

      return this;
    },

    removeLayout: function (name) {
      if (this.hasLayout(name)) {
        this.getLayout(name).off('after:remove', this._onLayoutRemoved, this).remove();
        delete this._layouts[name];
      }

      return this;
    },

    removeLayouts: function (layouts) {
      layouts = layouts || _.keys(this._layouts);
      _.forEach(layouts, this.removeLayout, this);
      return this;
    },

    forEachLayout: function (callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      if (callback) _.forOwn(this._layouts, callback, this);
      return this;
    },

    _onLayoutRemoved: function (removed) {
      var name = this.getLayoutName(removed);
      if (name) this.removeLayout(name);
      return this;
    }
  };

  Zeppelin.Mixin.hasRegions = {
    regions: {},

    hasRegions: function () {
      return _.size(this._regions) > 0;
    },

    hasRegion: function (name) {
      return this._regions[name] !== undefined;
    },

    getRegion: function (name) {
      return this._regions[name];
    },

    getRegionName: function (region) {
      var name;

      if (!Z.Util.isRegion(region)) return undefined;

      _.forOwn(this._regions, function (_regions, name) {
        if (_region.cid === region.cid) {
          name = name;
          return false;
        }
      });

      return name;
    },

    addRegion: function (name, region, options) {
      if (!Z.Util.isRegion(region)) return this;
      if (this.hasRegion(name)) this.unplugRegion(name, true);
      this._regions[name] = Z.Util.getInstance(region, options);
      this._regions[name].on('after:remove', this._onRegionRemoved, this);
      return this;
    },

    addRegions: function (regions) {
      regions = regions || _.result(this, 'regions');

      _.forOwn(regions, function (region, name) {
        this.addRegion(name, region);
      }, this);

      return this;
    },

    showRegion: function (name) {
      if (this.hasRegion(name)) this.getRegion(name).show();
      return this;
    },

    showRegions: function (regions) {
      regions = regions || _.keys(this._regions);
      _.forEach(regions, this.showRegion, this);
      return this;
    },

    closeRegion: function (name) {
      if (this.hasRegion(name)) this.getRegion(name).close();
      return this;
    },

    closeRegions: function (regions) {
      regions = regions || _.keys(this._regions);
      _.forEach(regions, this.closeRegion, this);
      return this;
    },

    unplugRegion: function (name, deep) {
      deep = deep || false;
      if (this.hasRegion(name)) this.getRegion(name).unplug(deep);
      return this;
    },

    unplugRegions: function (regions, deep) {
      deep = deep || false;
      regions = regions || _.keys(this._regions);

      _.forEach(regions, function (name) {
        this.unplugRegion(name, deep);
      }, this);

      return this;
    },

    removeRegion: function (name) {
      if (this.hasRegion(name)) {
        this.getRegion(name).off('after:remove', this._onRegionRemoved, this).remove();
        delete this._regions[name];
      }

      return this;
    },

    removeRegions: function (layouts) {
      layouts = layouts || _.keys(this._regions);
      _.forEach(layouts, this.removeRegion, this);
      return this;
    },

    forEachRegion: function (callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      if (callback) _.forOwn(this._regions, callback, this);
      return this;
    },

    _onRegionRemoved: function (removed) {
      var name = this.getRegionName(removed);
      if (name) this.removeRegion(name);
      return this;
    }
  };

  Zeppelin.Mixin.hasViews = {
    views: {},

    hasViews: function () {
      return _.size(this._views) > 0;
    },

    hasView: function (name) {
      return this._views[name] !== undefined;
    },

    getView: function (name) {
      return this._views[name];
    },

    getViewByCid: function (cid) {
      return _.find(this._views, function (view) {
        return view.cid === cid;
      });
    },

    getViews: function (comparator) {
      if (!_.isFunction(comparator)) comparator = function () {
        return true;
      };

      return _.filter(this._views, function (view) {
        return comparator(view) === true;
      });
    },

    getViewName: function (view) {
      var name;

      if (!Z.Util.isView(view)) return undefined;

      _.forOwn(this._views, function (_view, name) {
        if (_view.cid === view.cid) {
          name = name;
          return false;
        }
      });

      return name;
    },

    addView: function (name, options) {
      var view = Z.Util.getInstance(options);

      if (!Z.Util.isView(options) && _.isPlainObject(options)) {
        view = Z.Util.getInstance(options.view, options.options);
      }

      if (!Z.Util.isView(view)) return this;

      this._views[name] = view;
      view.on('after:remove', this._onViewRemoved, this);
      return this;
    },

    addViews: function (views) {
      views = views || _.result(this, 'views');

      _.forOwn(views, function (options, name) {
        this.addView(name, options);
      }, this);

      return this;
    },

    unplugView: function (name, deep) {
      deep = deep || false;
      if (this.hasView(name)) this.getView(name).unplug(deep);
      return this;
    },

    unplugViews: function (views, deep) {
      deep = deep || false;
      views = views || _.keys(this._views);

      _.forEach(views, function (name) {
        this.unplugView(name, deep);
      }, this);

      return this;
    },

    removeView: function (name) {
      if (this.hasView(name)) {
        this.getView(name).off('after:remove', this._onViewRemoved, this).remove();
        delete this._views[name];
      }

      return this;
    },

    removeViews: function (views) {
      views = views || _.keys(this._views);
      _.forEach(views, this.removeView, this);
      return this;
    },

    forEachView: function (callback) {
      if (!_.isFunction(callback)) callback = this[callback];
      if (callback) _.forOwn(this._views, callback, this);
      return this;
    },

    _onViewRemoved: function (removed) {
      var name = this.getViewName(removed);
      if (name) this.removeView(name);
      return this;
    }
  };

  Zeppelin.Mixin.hasElements = {
    elements: {},

    delegateEvent: function (selector, event, callback) {
      if (arguments.length === 2) {
        callback = event;
        event = selector;
        selector = undefined;
      }

      if (!event || !callback) return this;
      event += '.delegateEvents' + this.cid;
      callback = _.isFunction(callback) ? callback : this[callback];

      if (selector) {
        this.$el.on(event, selector, _.bind(callback, this));
      } else {
        this.$el.on(event, _.bind(callback, this));
      }

      return this;
    },

    delegateEvents: function () {
      return Backbone.View.prototype.delegateEvents.apply(this, arguments);
    },

    undelegateEvent: function (selector, event) {
      if (arguments.length === 2) {
        this.$el.off(event + '.delegateEvents' + this.cid, selector);
      } else {
        event = selector;
        this.$el.off(event + '.delegateEvents' + this.cid);
      }

      return this;
    },

    undelegateEvents: function () {
      return Backbone.View.prototype.undelegateEvents.apply(this, arguments);
    },

    hasElements: function () {
      return _.size(this._elements) > 0;
    },

    hasElement: function (name) {
      return this._elements[name] !== undefined;
    },

    getElement: function (name) {
      return this._elements[name];
    },

    getSelector: function (name) {
      return this.elements[name];
    },

    addElement: function (name, selector) {
      this._elements[name] = this.$(selector);
      return this;
    },

    addElements: function (elements) {
      elements = elements || _.result(this, 'elements');

      _.forOwn(elements, function (selector, name) {
        this.addElement(name, selector);
      }, this);

      return this;
    },

    removeElement: function (name) {
      var $el = this.getElement(name);

      if (!$el) return this;
      $el.off();
      delete this._elements[name];
      return this;
    },

    removeElements: function (elements) {
      elements = elements || _.keys(this._elements);
      _.forEach(elements, this.removeElement, this);
      return this;
    }
  };

  Zeppelin.Mixin.hasPartials = {
    partials: {},

    hasPartials: function () {
      return _.size(this.partials) > 0;
    },

    hasPartial: function (selector) {
      return this.partials[selector] !== undefined;
    },

    getPartial: function (selector) {
      return this.partials[selector];
    },

    addPartial: function (selector, template) {
      this.partials[selector] = template;
      return this;
    },

    addPartials: function (partials) {
      partials = partials || {};

      _.forOwn(partials, function (template, selector) {
        this.addPartial(selector, template);
      }, this);

      return this;
    },

    renderPartial: function (selector, context) {
      if (this.hasPartial(selector)) {
        context = _.isPlainObject(context) ? context : _.result(this, 'context');
        this.$(selector).html(this.getPartial(selector)(context));
      }

      return this;
    }
  };

  Zeppelin.Model = Backbone.Model.extend({
    constructor: function (attributes, options) {
      options = options || {};
      this.cacheId = options.cacheId || this.cacheId;
      this.cacheType = options.cacheType || this.cacheType;
      this._views = [];
      this._subscriptions = {};
      this.createCache();
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.addSubscriptions();
    },

    cacheId: null,

    cacheType: 'localStorage',

    toString: function () {
      return '[object Model]';
    },

    isPopulated: function () {
      return _.size(this.attributes) > 0;
    },

    localAttributes: [],

    getLocalAttributes: function () {
      return this.pick(_.result(this, 'localAttributes'));
    },

    toJSON: function () {
      return this.omit(_.result(this, 'localAttributes'));
    },

    validations: {},

    hasValidations: function () {
      return _.size(this.validations) > 0;
    },

    hasValidation: function (attributeName) {
      return this.validations[attributeName] !== undefined;
    },

    addValidation: function (attributeName, validation) {
      if (attributeName && validation) {
        if (_.isArray(validation) || _.isPlainObject(validation) || _.isFunction(validation)) {
          this.validations[attributeName] = _.isArray(validation) ? validation : [validation];
        }
      }

      return this;
    },

    validate: function (attributes) {
      var errors = {},
          validAttributes = {};

      attributes = attributes || this.attributes;

      if (_.size(attributes) && _.size(this.validations)) {
        _.forOwn(this.validations, function (validations, attributeName) {
          var attributeValue = attributes[attributeName];

          if (!_.isArray(validations)) validations = [validations];

          _.forEach(validations, function (validation) {
            var validationResult, isRequired;

            isRequired = _.find(validations, function (item) {
              return _.isPlainObject(item) && item.isRequired === true;
            });

            if ((!isRequired && !Z.Validations.exists(attributeValue)) || errors[attributeName]) {
              return false;
            }

            if (_.isFunction(validation)) {
              validation = _.bind(validation, this);
              validationResult = validation(attributeValue);

              if (validationResult) {
                errors[attributeName] = validationResult;
              } else {
                validAttributes[attributeName] = attributeValue;
                this.trigger('valid', this, validAttributes);
                this.trigger('valid:' + attributeName, this, attributeValue);
              }
            } else if (_.isPlainObject(validation)) {
              _.forOwn(validation, function (value, key) {
                var isValid;

                key = key === 'isRequired' ? 'exists' : key;

                if (Zeppelin.Validations[key]) {
                  if (_.isBoolean(value)) {
                    isValid = Zeppelin.Validations[key](attributeValue) === value;
                  } else {
                    isValid = Zeppelin.Validations[key](attributeValue, value);
                  }

                  if (isValid) {
                    validAttributes[attributeName] = attributeValue;
                    this.trigger('valid', this, validAttributes);
                    this.trigger('valid:' + attributeName, this, attributeValue);
                  } else {
                    errors[attributeName] = validation.message || attributeName + ' is not valid.';
                  }
                }
              }, this);
            }
          }, this);
        }, this);

        if (_.size(errors)) return errors;
      }
    },

    createCache: function (id, type) {
      id = id || this.cacheId;
      type = type || this.cacheType || 'localStorage';

      if (id) this.cache = new Zeppelin.Storage({
        type: type,
        namespace: id
      });

      return this;
    },

    fetchCache: function () {
      if (this.cache) this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (this.cache) this.cache.setAll(this.attributes);
      return this;
    },

    destroyCache: function () {
      if (this.cache) this.cache.clearAll();
      return this;
    }
  });

  _.extend(Zeppelin.Model.prototype, Zeppelin.Subscriptions);

  Zeppelin.Collection = Backbone.Collection.extend({
    constructor: function (models, options) {
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

    toString: function () {
      return '[object Collection]';
    },

    getAttributes: function () {
      return this.map(function (model) {
        return model.attributes;
      });
    },

    getLocalAttributes: function () {
      return this.map(function (model) {
        return model.getLocalAttributes();
      });
    },

    createCache: function (id, type) {
      id = id || this.cacheId;
      type = type || this.cacheType || 'localStorage';

      if (id) this.cache = new Zeppelin.Storage({
        type: type,
        namespace: id
      });

      return this;
    },

    fetchCache: function () {
      if (this.cache) this.set(this.cache.getAll());
      return this;
    },

    saveCache: function () {
      if (this.cache) this.cache.setAll(this.getAttributes());
      return this;
    },

    destroyCache: function () {
      if (this.cache) this.cache.clearAll();
      return this;
    }
  });

  _.extend(Zeppelin.Collection.prototype, Zeppelin.Subscriptions);

  Zeppelin.View = Backbone.View.extend({
    constructor: function (options) {
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

    _configure: function () {
      return this;
    },

    toString: function () {
      return '[object View]';
    },

    template: null,

    context: function () {
      return {};
    },

    renderTemplate: function (template, context) {
      var output = '';

      if (template && context) {
        context = _.isPlainObject(context) ? context : _.result(this, 'context');

        template = _.isFunction(template) ? template : this.template;
      } else {
        context = _.isPlainObject(template) ? template : _.result(this, 'context');

        template = _.isFunction(template) ? template : this.template;
      }

      if (template) output = template.call(this, context);

      return output;
    },

    render: function (template, context) {
      this.trigger('before:render', this);
      this.$el.html(this.renderTemplate(template, context));
      this._isRendered = true;
      this.addElements();
      this.trigger('after:render', this);
      this.onRender(this);
      this._isFisrtRender = false;
      return this;
    },

    onRender: function () {
      return this;
    },

    isFirstRender: function () {
      return this._isFisrtRender;
    },

    isRendered: function () {
      return this._isRendered;
    },

    unplug: function () {
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

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    },

    remove: function () {
      this.unplug(true);
      this.trigger('before:remove', this);
      this.$el.remove();
      this._isRemoved = true;
      this.trigger('after:remove', this);
      this.onRemove(this);
      return this;
    },

    onRemove: function () {
      return this;
    }
  });

  _.extend(Zeppelin.View.prototype, Zeppelin.Bindings);
  _.extend(Zeppelin.View.prototype, Zeppelin.Subscriptions);
  _.extend(Zeppelin.View.prototype, Zeppelin.Mixin.hasPartials);
  _.extend(Zeppelin.View.prototype, Zeppelin.Mixin.hasElements);

  Zeppelin.ModelView = Zeppelin.View.extend({
    _configure: function (options) {
      this.model = options.model || this.model, this._isFirstModel = true;
      this.setModel(this.model);
    },

    model: Z.Model,

    hasModel: function () {
      return Z.Util.isModel(this.model) && this.model.cid ? true : false;
    },

    getModel: function () {
      if (Z.Util.isModel(this.model)) {
        return this.model;
      } else if (_.isFunction(this.model)) {
        return this.model();
      } else {
        return Z.Model;
      }
    },

    setModel: function (model, options) {
      if (this.hasModel() && !this._isFirstModel) this.unsetModel();
      model = Z.Util.getInstance(model || this.getModel(), options);
      this.trigger('before:setModel', model);
      if (!Z.Util.isModel(model)) return this;
      this.model = model;
      this.model._views.push(this.cid);
      this.trigger('after:setModel', model);
      this.onSetModel(model);
      this._isFirstModel = false;
      return this;
    },

    onSetModel: function (model) {
      return this;
    },

    unsetModel: function () {
      var model;

      if (!this.hasModel()) return this;
      model = this.model;
      this.trigger('before:unsetModel', model);
      this.model._views.splice(_.indexOf(this.model._views, this.cid), 1);
      this.stopListening(model);
      this.model = null;
      this.trigger('after:unsetModel', model);
      this.onUnsetModel(model);
      return this;
    },

    onUnsetModel: function (model) {
      return this;
    },

    context: function () {
      return this.model.attributes;
    },

    unplug: function () {
      Zeppelin.View.prototype.unplug.apply(this, arguments);
      this.unsetModel();
      return this;
    }
  });

  Zeppelin.FormView = Zeppelin.ModelView.extend({
    saveOnSubmit: true,

    formSelector: '',

    setForm: function (element) {
      element = element || _.result(this, 'formSelector');
      if (this.$form) this.$form.off('submit');
      this.$form = Z.Util.isJqueryObject(element) ? element : this.$(element);
      if (!this.$form.length) this.$form = this.$el;
      this.form = this.$form[0];

      if (this.$form.length) this.$form.on('submit', _.bind(function (event) {
        event.preventDefault();
        this.submit(event);
      }, this));

      return this;
    },

    setModel: function (model, options) {
      if (this.hasModel()) this.unsetModel();
      model = Z.Util.getInstance(model || this.getModel(), options);
      this.trigger('before:setModel', model);
      if (!Z.Util.isModel(model)) return this;
      this.model = model;
      this.model._views.push(this.cid);
      this.listenTo(this.model, 'valid', this.onValid);
      this.listenTo(this.model, 'invalid', this.onInvalid);
      this.trigger('after:setModel', model);
      this.onSetModel(model);
      return this;
    },

    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);
      this.setForm();
      return this;
    },

    submit: function () {
      this.trigger('before:submit');
      this.setAttributes();

      if (!this.model.validationError) {
        this.clean();
        this.onValidationSuccess(this);
        if (this.saveOnSubmit) this.model.save();
      } else {
        this.onValidationError(this.model.validationError);
      }

      this.trigger('after:submit');
      this.onSubmit(this);
      return this;
    },

    onValidationError: function (error) {
      return this;
    },

    onValidationSuccess: function () {
      return this;
    },

    onSubmit: function () {
      return this;
    },

    getAttributeElement: function (attributeName) {
      return this.$form.find('[name=' + attributeName + ']');
    },

    getAttributeErrorElement: function (attributeName) {
      return this.$form.find('[data-error=' + attributeName + ']');
    },

    getAttributeValue: function (attributeName) {
      var $attribute, $checked, $selected, checkedValue;

      $attribute = this.getAttributeElement(attributeName);

      if ($attribute) {
        if ($attribute.is(':radio, :checkbox')) {
          $checked = $attribute.filter(':checked');
          checkedValue = $checked.val();

          if ($checked.length) {
            if ($checked.length > 1 && $attribute.is(':checkbox')) {
              return _.compact(_.map($checked, function (check) {
                return checkedValue;
              }));
            } else {
              if ($checked.attr('value')) {
                if (checkedValue === 'true') checkedValue = true;
                if (checkedValue === 'false') checkedValue = false;
                return checkedValue;
              } else {
                return true;
              }
            }
          } else {
            return false;
          }
        } else if ($attribute.is('input, textarea')) {
          if ($attribute.length > 1) {
            return _.map($attribute, function (attr) {
              return $(attr).val();
            });
          } else {
            return $attribute.val();
          }
        } else if ($attribute.is('select')) {
          $selected = $attribute.find('option').filter(':selected');

          if ($selected.length) {
            if ($selected.length > 1) {
              return _.map($selected, function (option) {
                return $(option).val();
              });
            } else {
              return $selected.attr('value') ? $selected.val() : true;
            }
          } else {
            return false;
          }
        }
      }

      return null;
    },

    getAttributeValues: function () {
      var attributes = {},
          attributeName;

      _.forEach(this.$form.find('[name]'), function (element) {
        attributeName = $(element).attr('name');
        attributes[attributeName] = this.getAttributeValue(attributeName);
      }, this);

      return _.size(attributes) ? attributes : null;
    },

    setAttribute: function (attributeName) {
      this.model.set(attributeName, this.getAttributeValue(attributeName), {
        validate: true
      });

      return this;
    },

    setAttributes: function () {
      var attributes = {};

      _.forEach(this.$form.find('[name]'), function (element) {
        var attributeName = $(element).attr('name');
        attributes[attributeName] = this.getAttributeValue(attributeName);
      }, this);

      if (_.size(attributes)) {
        this.model.set(attributes, {
          validate: true
        });
      }

      return this;
    },

    errorClass: 'error',

    onInvalid: function (model, error) {
      _.forOwn(error, function (message, attributeName) {
        this.getAttributeElement(attributeName).addClass(this.errorClass);
        this.getAttributeErrorElement(attributeName).show().text(message);
      }, this);

      return this;
    },

    onValid: function (model, attributes) {
      _.forOwn(attributes, function (value, attributeName) {
        this.getAttributeElement(attributeName).removeClass(this.errorClass);
        this.getAttributeErrorElement(attributeName).hide().text('');
      }, this);

      return this;
    },

    clean: function () {
      this.$form.find('[name]').removeClass(this.errorClass);
      this.$form.find('[data-error]').hide().text('');
      return this;
    },

    reset: function () {
      this.clean();

      _.forEach(this.$form.find('[name]'), function (element) {
        element = $(element);
        element.val(this.model.get(element.attr('name')) || '');
      }, this);

      return this;
    },

    focus: function (attribute) {
      var $element = this.getAttributeElement(attribute);

      if ($element && $element.length) {
        $element.focus();
      } else {
        this.$form.find('[name]').first().focus();
      }

      return this;
    },

    diff: function () {
      var changes = {};

      _.forOwn(this.getAttributeValues(), function (value, key) {
        if (value !== this.model.get(key)) changes[key] = value
      }, this);

      return changes;
    }
  });

  Zeppelin.CompositeView = Zeppelin.View.extend({
    _configure: function () {
      this._views = {};
      this.addViews();
    },

    unplug: function (deep) {
      deep = deep || false;
      if (deep) this.unplugViews(deep);
      Zeppelin.View.prototype.unplug.apply(this, arguments);
      return this;
    },

    remove: function () {
      this.removeViews();
      Zeppelin.View.prototype.remove.apply(this, arguments);
      return this;
    }
  });

  _.extend(Zeppelin.CompositeView.prototype, Zeppelin.Mixin.hasViews);

  Zeppelin.CollectionView = Zeppelin.CompositeView.extend({
    _configure: function (options) {
      Zeppelin.CompositeView.prototype._configure.apply(this, arguments);
      this.collection = options.collection || this.collection, this._isFirstCollection = true;
      this._isFirstCollectionRender = true;
      this.setCollection(this.collection);
    },

    collection: Z.Collection,

    listSelector: '',

    addMethod: 'append',

    itemView: Zeppelin.ModelView,

    manageItems: true,

    emptyTemplate: null,

    hasCollection: function () {
      return Z.Util.isCollection(this.collection) && this.collection.cid ? true : false;
    },

    getCollection: function () {
      if (Z.Util.isCollection(this.collection)) {
        return this.collection;
      } else if (_.isFunction(this.collection)) {
        return this.collection();
      } else {
        return Z.Collection;
      }
    },

    setCollection: function (collection, options) {
      if (this.hasCollection() && !this._isFirstCollection) this.unsetCollection();
      this.trigger('before:setCollection', collection);
      collection = Z.Util.getInstance(collection || this.getCollection(), options);
      if (!Z.Util.isCollection(collection)) return this;
      this.collection = collection;
      this.collection._views.push(this.cid);
      this.trigger('after:setCollection', collection);
      this.onSetCollection(collection);

      if (this.manageItems) {
        this.listenTo(this.collection, 'add', this._onAdd);
        this.listenTo(this.collection, 'reset', this._onReset);
        this.listenTo(this.collection, 'remove', this._onRemove);
      }

      this._isFirstCollection = false;
      return this;
    },

    onSetCollection: function (collection) {
      return this;
    },

    unsetCollection: function () {
      var collection;

      if (!this.hasCollection()) return this;
      collection = this.collection;
      this.trigger('before:unsetCollection', collection);
      this.collection._views.splice(_.indexOf(this.collection._views, this.cid), 1);
      this.stopListening(collection);
      this.collection = null;
      this.trigger('after:unsetCollection', collection);
      this.onUnsetCollection(collection);
      return this;
    },

    onUnsetCollection: function (collection) {
      return this;
    },

    setList: function (element) {
      element = element || _.result(this, 'listSelector');
      this.$list = Z.Util.isJqueryObject(element) ? element : this.$(element);
      if (!this.$list.length) this.$list = this.$el;
      this.list = this.$list[0];
      return this;
    },

    render: function () {
      Zeppelin.View.prototype.render.apply(this, arguments);
      this.setList();
      if (!this.hasViews() && !this.collection.isEmpty()) this.addItems();
      this.renderItems();
      return this;
    },

    renderWithFilter: function (comparator) {
      Zeppelin.View.prototype.render.apply(this);
      this.setList();
      this.filter(_.bind(comparator, this));
      return this;
    },

    renderItems: function (views) {
      var fragment = document.createDocumentFragment();

      views = views || this.getViews();
      this.trigger('before:renderItems', this);

      _.forEach(views, function (view) {
        fragment.appendChild(view.render().el);
      }, this);

      if (fragment.childNodes.length) {
        this.$list.html(fragment);
      } else if (this.emptyTemplate) {
        this.$list.html(this.emptyTemplate());
      }

      this.trigger('after:renderItems', this);
      this.onRenderItems(views);
      this._isFirstCollectionRender = false;
      return this;
    },

    isFirstCollectionRender: function () {
      return this._isFirstCollectionRender;
    },

    onRenderItems: function (views) {
      return this;
    },

    filter: function (comparator) {
      var models;

      if (!_.isFunction(comparator)) return this;
      this.trigger('before:filter');
      this.removeItems();

      models = this.collection.filter(function (model) {
        return comparator(model) === true;
      });

      if (models.length) {
        this.removeItems();
        this.addItems(models);
        this.renderItems();
      } else {
        this.$list.empty();
      }

      this.trigger('after:filter');
      this.onFilter(models);
      return this;
    },

    onFilter: function (models) {
      return this;
    },

    appendItem: function (view) {
      if (!Z.Util.isView(view)) return this;
      this.trigger('before:appendItem', this);
      if (this.collection.length === 1) this.$list.empty();
      this.$list.append(view.render().el);
      this.trigger('after:appendItem', this);
      this.onAppendItem(view);
      return this;
    },

    onAppendItem: function (view) {
      return this;
    },

    prependItem: function (view) {
      if (!Z.Util.isView(view)) return this;
      this.trigger('before:prependItem', this);
      if (this.collection.length === 1) this.$list.empty();
      this.$list.prepend(view.render().el);
      this.trigger('after:prependItem', this);
      this.onPrependItem(view);
      return this;
    },

    onPrependItem: function (view) {
      return this;
    },

    getItemView: function (model) {
      if (Z.Util.isView(this.itemView)) {
        return this.itemView;
      } else if (_.isFunction(this.itemView)) {
        return this.itemView(model);
      } else {
        return Z.ModelView;
      }
    },

    addItem: function (model) {
      var view;

      if (!Z.Util.isModel(model)) return this;
      this.trigger('before:addItem', this);

      view = Z.Util.getInstance(this.getItemView(model), {
        model: model
      });

      this.addView(model.cid, view);

      this.trigger('after:addItem', this);
      this.onAddItem(view);
      return this;
    },

    onAddItem: function (view) {
      return this;
    },

    addItems: function (models) {
      models = models || this.collection.models;

      _.forEach(models, function (model) {
        this.addItem(model);
      }, this);

      return this;
    },

    removeItem: function (model) {
      var view;

      if (!Z.Util.isModel(model) || !this.hasView(model.cid)) return this;
      view = this.getView(model.cid);
      this.trigger('before:removeItem', this);
      view.unplug(true);
      this.removeView(model.cid);
      this.trigger('after:removeItem', this);
      this.onRemoveItem(view);
      return this;
    },

    onRemoveItem: function (view) {
      return this;
    },

    removeItems: function (models) {
      models = models || this.collection.models;

      _.forEach(models, function (model) {
        this.removeItem(model);
      }, this);

      return this;
    },

    unplug: function () {
      this.unsetCollection();
      Zeppelin.View.prototype.unplug.apply(this, arguments);
      return this;
    },

    _onAdd: function (model) {
      this.addItem(model);

      if (this.isRendered()) {
        if (this.addMethod === 'append') {
          this.appendItem(this.getView(model.cid));
        } else {
          this.prependItem(this.getView(model.cid));
        }
      }

      return this;
    },

    _onReset: function () {
      this.removeViews();

      _.forEach(this.collection.models, function (model) {
        this.addItem(model);
      }, this);

      if (this.isRendered()) this.renderItems();
      return this;
    },

    _onRemove: function (model) {
      this.removeItem(model);
      return this;
    }
  });

  Zeppelin.Region = function (options) {
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
    initialize: function () {
      return this;
    },

    keepEl: false,

    toString: function () {
      return '[object Region]';
    },

    view: Z.View,

    hasView: function () {
      return Z.Util.isView(this.view);
    },

    setElement: function (element) {
      element = element || _.result(this, 'el');
      this.$el = Z.Util.isJqueryObject(element) ? element : Z.$(element);
      if (this.$el.length) this.el = this.$el[0];
      this.delegateEvents();
      return this;
    },

    $: function (selector) {
      return this.$el.find(selector);
    },

    setView: function (view, options) {
      view = view || this._view;

      if (!Z.Util.isView(view)) return this;
      if (this.hasView() && this.isShown()) this.close();
      this.view = Z.Util.getInstance(view, options);
      return this;
    },

    renderView: function (view) {
      this.$el.html(this.view.render().el);
      return this;
    },

    show: function (view) {
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

    onShow: function (view) {
      return this;
    },

    isShown: function () {
      return this._isShown;
    },

    close: function () {
      this.trigger('before:close', this.view);
      if (this.hasView()) this.view.remove();
      this.view = null;
      this._isShown = false;
      this.trigger('after:close', this.view);
      this.onClose(this.view);
      return this;
    },

    onClose: function (view) {
      return this;
    },

    unplug: function (deep) {
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

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    },

    remove: function () {
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

    onRemove: function () {
      return this;
    },

    isRemoved: function () {
      return this._isRemoved;
    }
  });

  _.extend(Zeppelin.Region.prototype, Zeppelin.Subscriptions);
  _.extend(Zeppelin.Region.prototype, Zeppelin.Mixin.hasElements);

  Zeppelin.Region.extend = Zeppelin.extend;

  Zeppelin.Layout = function (options) {
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

    initialize: function () {
      return this;
    },

    toString: function () {
      return '[object Layout]';
    },

    setElement: function (element) {
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

    $: function (selector) {
      return this.$el.find(selector);
    },

    template: null,

    context: function () {
      return {};
    },

    renderTemplate: function () {
      return Z.View.prototype.renderTemplate.apply(this, arguments);
    },

    render: function (template, context) {
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

    onRender: function () {
      return this;
    },

    isFirstRender: function () {
      return this._isFisrtRender;
    },

    isRendered: function () {
      return this._isRendered;
    },

    unplug: function (deep) {
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

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    },

    empty: function () {
      this.trigger('before:empty', this);
      this.$el.empty();
      this._isEmpty = true;
      this.trigger('after:empty', this);
      this.onEmpty(this);
      return this;
    },

    onEmpty: function () {
      return this;
    },

    isEmpty: function () {
      return this._isEmpty;
    },

    remove: function () {
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

    onRemove: function () {
      return this;
    },

    isRemoved: function () {
      return this._isRemoved;
    }
  });

  _.extend(Zeppelin.Layout.prototype, Zeppelin.Subscriptions);
  _.extend(Zeppelin.Layout.prototype, Zeppelin.Mixin.hasRegions);
  _.extend(Zeppelin.Layout.prototype, Zeppelin.Mixin.hasElements);

  Zeppelin.Layout.extend = Zeppelin.extend;

  Zeppelin.Controller = function (options) {
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
    toString: function () {
      return '[object Controller]';
    },

    initialize: function () {
      return this;
    },

    name: null,

    title: null,

    setTitle: function (title) {
      document.title = title || this.title;
      return this;
    },

    hasFocus: function () {
      return document.hasFocus();
    },

    scrollTo: function (x, y) {
      window.scrollTo(x, y);
      return this;
    },

    scrollToTop: function () {
      window.scrollTo(0, 0);
      return this;
    },

    scrollToBottom: function () {
      window.scrollTo(0, $(document).height());
      return this;
    },

    unplug: function () {
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

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    }
  });

  _.extend(Zeppelin.Controller.prototype, Zeppelin.Subscriptions);
  _.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasViews);
  _.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasRegions);
  _.extend(Zeppelin.Controller.prototype, Zeppelin.Mixin.hasLayouts);

  Zeppelin.Controller.extend = Zeppelin.extend;

  Zeppelin.Router = Backbone.Router.extend({
    constructor: function (options) {
      this.cid = _.uniqueId('router');
      this._isUnplugged = false;
      this._subscriptions = {};
      Backbone.Router.prototype.constructor.apply(this, arguments);
      this.addSubscriptions();
    },

    toString: function () {
      return '[object Router]';
    },

    getFragment: function () {
      return Backbone.history.getFragment();
    },

    getRoute: function () {
      var route = null,
          params = null,
          fragment = Backbone.history.getFragment(),
          matched;

      matched = _.find(Backbone.history.handlers, function (handler) {
        return handler.route.test(fragment);
      });

      if (matched) {
        route = matched.route;
        params = this._extractParameters(route, fragment);
      }

      return {
        route: route,
        params: params,
        fragment: fragment
      };
    },

    execute: function () {
      this.trigger('before:route', this);
      this.beforeRoute.apply(this, arguments);
      Backbone.Router.prototype.execute.apply(this, arguments);
      this.trigger('after:route', this);
      this.afterRoute.apply(this, arguments);
    },

    beforeRoute: function (callback, args) {
      return this;
    },

    afterRoute: function (callback, args) {
      return this;
    },

    unplug: function () {
      this.trigger('before:unplug', this);
      this.off();
      this.stopListening();
      this._isUnplugged = true;
      this.trigger('after:unplug', this);
      this.onUnplug(this);
      return this;
    },

    onUnplug: function () {
      return this;
    },

    isUnplugged: function () {
      return this._isUnplugged;
    }
  });

  _.extend(Zeppelin.Router.prototype, Zeppelin.Subscriptions);

  Zeppelin.Application = Zeppelin.Router.extend({
    constructor: function (options) {
      options = options || {};
      this.options = _.extend({}, this.options, options);
      this.controller = null;
      Z.Router.prototype.constructor.apply(this, arguments);
    },

    toString: function () {
      return '[object Application]';
    },

    setController: function (controller, options) {
      if (!Z.Util.isController(controller)) return this;
      this.unsetController();
      this.controller = Z.Util.getInstance(controller, options);
      return this;
    },

    unsetController: function () {
      if (this.controller) this.controller.unplug();
      this.controller = null;
      return this;
    },

    isCurrentController: function (name) {
      return this.controller.name === name;
    },

    start: function (options) {
      this.broadcast('app:before:start');
      if (!Backbone.History.started) Backbone.history.start(options);
      this.broadcast('app:after:start');
      this.onStart();
      return this;
    },

    onStart: function () {
      return this;
    },

    reload: function () {
      this.broadcast('app:before:reload');
      Backbone.history.loadUrl(Backbone.history.fragment);
    },

    stop: function () {
      this.broadcast('app:before:stop');
      if (Backbone.History.started) Backbone.history.stop();
      this.broadcast('app:after:stop');
      this.onStop();
      return this;
    },

    onStop: function () {
      return this;
    }
  });

  return Zeppelin;
})(this, Backbone);