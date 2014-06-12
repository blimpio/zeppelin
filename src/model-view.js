Zeppelin.ModelView = Zeppelin.View.extend({
  _configure: function(options) {
    this.model = options.model || this.model,
    this._isFirstModel = true;
    this.setModel(this.model);
  },

  model: Z.Model,

  hasModel: function() {
    return Z.Util.isModel(this.model) && this.model.cid ? true : false;
  },

  getModel: function() {
    if (Z.Util.isModel(this.model)) {
      return this.model;
    } else if (_.isFunction(this.model)) {
      return this.model();
    } else {
      return Z.Model;
    }
  },

  setModel: function(model, options) {
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

  onSetModel: function(model) {
    return this;
  },

  unsetModel: function() {
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

  onUnsetModel: function(model) {
    return this;
  },

  context: function() {
    return this.model.attributes;
  },

  unplug: function() {
    Zeppelin.View.prototype.unplug.apply(this, arguments);
    this.unsetModel();
    return this;
  }
});
