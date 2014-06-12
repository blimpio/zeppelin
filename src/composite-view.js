Zeppelin.CompositeView = Zeppelin.View.extend({
  _configure: function() {
    this._views = {};
    this.addViews();
  },

  unplug: function(deep) {
    deep = deep || false;
    if (deep) this.unplugViews(deep);
    Zeppelin.View.prototype.unplug.apply(this, arguments);
    return this;
  },

  remove: function() {
    this.removeViews();
    Zeppelin.View.prototype.remove.apply(this, arguments);
    return this;
  }
});

_.extend(Zeppelin.CompositeView.prototype, Zeppelin.Mixin.hasViews);
