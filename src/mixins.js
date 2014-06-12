Zeppelin.Mixin = {};

Zeppelin.Mixin.hasLayouts = {
  layouts: {},

  hasLayouts: function() {
    return _.size(this._layouts) > 0;
  },

  hasLayout: function(name) {
    return this._layouts[name] !== undefined;
  },

  getLayout: function(name) {
    return this._layouts[name];
  },

  getLayoutName: function(layout) {
    var name;

    if (!Z.Util.isLayout(layout)) return undefined;

    _.forOwn(this._layouts, function(_layouts, name) {
      if (_layout.cid === layout.cid) {
        name = name;
        return false;
      }
    });

    return name;
  },

  addLayout: function(name, layout, options) {
    if (!Z.Util.isLayout(layout)) return this;
    if (this.hasLayout(name)) this.unplugLayout(name, true);
    this._layouts[name] = Z.Util.getInstance(layout, options);
    this._layouts[name].on('after:remove', this._onViewRemoved, this);
    return this;
  },

  addLayouts: function(layouts) {
    layouts = layouts || _.result(this, 'layouts');

    _.forOwn(layouts, function(layout, name) {
      this.addLayout(name, layout);
    }, this);

    return this;
  },

  showLayout: function(name) {
    if (this.hasLayout(name)) this.getLayout(name).show();
    return this;
  },

  showLayouts: function(layouts) {
    layouts = layouts || _.keys(this._layouts);
    _.forEach(layouts, this.showLayout, this);
    return this;
  },

  closeLayout: function(name) {
    if (this.hasLayout(name)) this.getLayout(name).close();
    return this;
  },

  closeLayouts: function(layouts) {
    layouts = layouts || _.keys(this._layouts);
    _.forEach(layouts, this.closeLayout, this);
    return this;
  },

  unplugLayout: function(name, deep) {
    deep = deep || false;
    if (this.hasLayout(name)) this.getLayout(name).unplug(deep);
    return this;
  },

  unplugLayouts: function(layouts, deep) {
    deep = deep || false;
    layouts = layouts || _.keys(this._layouts);

    _.forEach(layouts, function(name) {
      this.unplugLayout(name, deep);
    }, this);

    return this;
  },

  removeLayout: function(name) {
    if (this.hasLayout(name)) {
      this.getLayout(name).off('after:remove', this._onLayoutRemoved, this).remove();
      delete this._layouts[name];
    }

    return this;
  },

  removeLayouts: function(layouts) {
    layouts = layouts || _.keys(this._layouts);
    _.forEach(layouts, this.removeLayout, this);
    return this;
  },

  forEachLayout: function(callback) {
    if (!_.isFunction(callback)) callback = this[callback];
    if (callback) _.forOwn(this._layouts, callback, this);
    return this;
  },

  _onLayoutRemoved: function(removed) {
    var name = this.getLayoutName(removed);
    if (name) this.removeLayout(name);
    return this;
  }
};

Zeppelin.Mixin.hasRegions = {
  regions: {},

  hasRegions: function() {
    return _.size(this._regions) > 0;
  },

  hasRegion: function(name) {
    return this._regions[name] !== undefined;
  },

  getRegion: function(name) {
    return this._regions[name];
  },

  getRegionName: function(region) {
    var name;

    if (!Z.Util.isRegion(region)) return undefined;

    _.forOwn(this._regions, function(_regions, name) {
      if (_region.cid === region.cid) {
        name = name;
        return false;
      }
    });

    return name;
  },

  addRegion: function(name, region, options) {
    if (!Z.Util.isRegion(region)) return this;
    if (this.hasRegion(name)) this.unplugRegion(name, true);
    this._regions[name] = Z.Util.getInstance(region, options);
    this._regions[name].on('after:remove', this._onRegionRemoved, this);
    return this;
  },

  addRegions: function(regions) {
    regions = regions || _.result(this, 'regions');

    _.forOwn(regions, function(region, name) {
      this.addRegion(name, region);
    }, this);

    return this;
  },

  showRegion: function(name) {
    if (this.hasRegion(name)) this.getRegion(name).show();
    return this;
  },

  showRegions: function(regions) {
    regions = regions || _.keys(this._regions);
    _.forEach(regions, this.showRegion, this);
    return this;
  },

  closeRegion: function(name) {
    if (this.hasRegion(name)) this.getRegion(name).close();
    return this;
  },

  closeRegions: function(regions) {
    regions = regions || _.keys(this._regions);
    _.forEach(regions, this.closeRegion, this);
    return this;
  },

  unplugRegion: function(name, deep) {
    deep = deep || false;
    if (this.hasRegion(name)) this.getRegion(name).unplug(deep);
    return this;
  },

  unplugRegions: function(regions, deep) {
    deep = deep || false;
    regions = regions || _.keys(this._regions);

    _.forEach(regions, function(name) {
      this.unplugRegion(name, deep);
    }, this);

    return this;
  },

  removeRegion: function(name) {
    if (this.hasRegion(name)) {
      this.getRegion(name).off('after:remove', this._onRegionRemoved, this).remove();
      delete this._regions[name];
    }

    return this;
  },

  removeRegions: function(layouts) {
    layouts = layouts || _.keys(this._regions);
    _.forEach(layouts, this.removeRegion, this);
    return this;
  },

  forEachRegion: function(callback) {
    if (!_.isFunction(callback)) callback = this[callback];
    if (callback) _.forOwn(this._regions, callback, this);
    return this;
  },

  _onRegionRemoved: function(removed) {
    var name = this.getRegionName(removed);
    if (name) this.removeRegion(name);
    return this;
  }
};

Zeppelin.Mixin.hasViews = {
  views: {},

  hasViews: function() {
    return _.size(this._views) > 0;
  },

  hasView: function(name) {
    return this._views[name] !== undefined;
  },

  getView: function(name) {
    return this._views[name];
  },

  getViewByCid: function(cid) {
    return _.find(this._views, function(view) {
      return view.cid === cid;
    });
  },

  getViews: function(comparator) {
    if (!_.isFunction(comparator)) comparator = function() {
      return true;
    };

    return _.filter(this._views, function(view) {
      return comparator(view) === true;
    });
  },

  getViewName: function(view) {
    var name;

    if (!Z.Util.isView(view)) return undefined;

    _.forOwn(this._views, function(_view, name) {
      if (_view.cid === view.cid) {
        name = name;
        return false;
      }
    });

    return name;
  },

  addView: function(name, options) {
    var view = Z.Util.getInstance(options);

    if (!Z.Util.isView(options) && _.isPlainObject(options)) {
      view = Z.Util.getInstance(options.view, options.options);
    }

    if (!Z.Util.isView(view)) return this;

    this._views[name] = view;
    view.on('after:remove', this._onViewRemoved, this);
    return this;
  },

  addViews: function(views) {
    views = views || _.result(this, 'views');

    _.forOwn(views, function(options, name) {
      this.addView(name, options);
    }, this);

    return this;
  },

  unplugView: function(name, deep) {
    deep = deep || false;
    if (this.hasView(name)) this.getView(name).unplug(deep);
    return this;
  },

  unplugViews: function(views, deep) {
    deep = deep || false;
    views = views || _.keys(this._views);

    _.forEach(views, function(name) {
      this.unplugView(name, deep);
    }, this);

    return this;
  },

  removeView: function(name) {
    if (this.hasView(name)) {
      this.getView(name).off('after:remove', this._onViewRemoved, this).remove();
      delete this._views[name];
    }

    return this;
  },

  removeViews: function(views) {
    views = views || _.keys(this._views);
    _.forEach(views, this.removeView, this);
    return this;
  },

  forEachView: function(callback) {
    if (!_.isFunction(callback)) callback = this[callback];
    if (callback) _.forOwn(this._views, callback, this);
    return this;
  },

  _onViewRemoved: function(removed) {
    var name = this.getViewName(removed);
    if (name) this.removeView(name);
    return this;
  }
};

Zeppelin.Mixin.hasElements = {
  elements: {},

  delegateEvent: function(selector, event, callback) {
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

  delegateEvents: function() {
    return Backbone.View.prototype.delegateEvents.apply(this, arguments);
  },

  undelegateEvent: function(selector, event) {
    if (arguments.length === 2) {
      this.$el.off(event + '.delegateEvents' + this.cid, selector);
    } else {
      event = selector;
      this.$el.off(event + '.delegateEvents' + this.cid);
    }

    return this;
  },

  undelegateEvents: function() {
    return Backbone.View.prototype.undelegateEvents.apply(this, arguments);
  },

  hasElements: function() {
    return _.size(this._elements) > 0;
  },

  hasElement: function(name) {
    return this._elements[name] !== undefined;
  },

  getElement: function(name) {
    return this._elements[name];
  },

  getSelector: function(name) {
    return this.elements[name];
  },

  addElement: function(name, selector) {
    this._elements[name] = this.$(selector);
    return this;
  },

  addElements: function(elements) {
    elements = elements || _.result(this, 'elements');

    _.forOwn(elements, function(selector, name) {
      this.addElement(name, selector);
    }, this);

    return this;
  },

  removeElement: function(name) {
    var $el = this.getElement(name);

    if (!$el) return this;
    $el.off();
    delete this._elements[name];
    return this;
  },

  removeElements: function(elements) {
    elements = elements || _.keys(this._elements);
    _.forEach(elements, this.removeElement, this);
    return this;
  }
};

Zeppelin.Mixin.hasPartials = {
  partials: {},

  hasPartials: function() {
    return _.size(this.partials) > 0;
  },

  hasPartial: function(selector) {
    return this.partials[selector] !== undefined;
  },

  getPartial: function(selector) {
    return this.partials[selector];
  },

  addPartial: function(selector, template) {
    this.partials[selector] = template;
    return this;
  },

  addPartials: function(partials) {
    partials = partials || {};

    _.forOwn(partials, function(template, selector) {
      this.addPartial(selector, template);
    }, this);

    return this;
  },

  renderPartial: function(selector, context) {
    if (this.hasPartial(selector)) {
      context = _.isPlainObject(context) ? context : _.result(this, 'context');
      this.$(selector).html(this.getPartial(selector)(context));
    }

    return this;
  }
};
