Zeppelin.Bindings = {
  bindings: {},

  addBinding: function(type, events) {
    if (!_.isPlainObject(events)) return this;

    if (type === 'self') {
      this.addSelfBinding(events);
    } else if (type === 'model') {
      this.addModelBinding(events);
    } else if (type === 'collection') {
      this.addCollectionBinding(events);
    } else if (type === 'views') {
      _.forOwn(events, function(_events, name) {
        this.addViewBinding(name, _events);
      }, this);
    } else if (type === 'regions') {
      _.forOwn(events, function(_events, name) {
        this.addRegionBinding(name, _events);
      }, this);
    }

    return this;
  },

  addSelfBinding: function(events) {
    _.forOwn(events, function(callback, event) {
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

  addModelBinding: function(events) {
    _.forOwn(events, function(callback, event) {
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

  addCollectionBinding: function(events) {
    _.forOwn(events, function(callback, event) {
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

  addViewBinding: function(name, events) {
    var view = this.getView ? this.getView(name): undefined;

    if (!Z.Util.isView(view)) return this;

    _.forOwn(events, function(callback, event) {
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

  addRegionBinding: function(name, events) {
    var region = this.getRegion ? this.getRegion(name): undefined;

    if (!Z.Util.isRegion(region)) return this;

    _.forOwn(events, function(callback, event) {
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

  addBindings: function(bindings) {
    bindings = bindings || _.result(this, 'bindings');

    _.forOwn(bindings, function(events, type) {
      this.addBinding(type, events);
    }, this);

    return this;
  }
};
