Zeppelin.CollectionView = Zeppelin.CompositeView.extend({
  _configure: function(options) {
    Zeppelin.CompositeView.prototype._configure.apply(this, arguments);
    this.collection = options.collection || this.collection,
    this._isFirstCollection = true;
    this._isFirstCollectionRender = true;
    this.setCollection(this.collection);
  },

  collection: Z.Collection,

  listSelector: '',

  addMethod: 'append',

  itemView: Zeppelin.ModelView,

  manageItems: true,

  emptyTemplate: null,

  hasCollection: function() {
    return Z.Util.isCollection(this.collection) && this.collection.cid
      ? true
      : false;
  },

  getCollection: function() {
    if (Z.Util.isCollection(this.collection)) {
      return this.collection;
    } else if (_.isFunction(this.collection)) {
      return this.collection();
    } else {
      return Z.Collection;
    }
  },

  setCollection: function(collection, options) {
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

  onSetCollection: function(collection) {
    return this;
  },

  unsetCollection: function() {
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

  onUnsetCollection: function(collection) {
    return this;
  },

  setList: function(element) {
    element = element || _.result(this, 'listSelector');
    this.$list = Z.Util.isJqueryObject(element) ? element : this.$(element);
    if (!this.$list.length) this.$list = this.$el;
    this.list = this.$list[0];
    return this;
  },

  render: function() {
    Zeppelin.View.prototype.render.apply(this, arguments);
    this.setList();
    if (!this.hasViews() && !this.collection.isEmpty()) this.addItems();
    this.renderItems();
    return this;
  },

  renderWithFilter: function(comparator) {
    Zeppelin.View.prototype.render.apply(this);
    this.setList();
    this.filter(_.bind(comparator, this));
    return this;
  },

  renderItems: function(views) {
    var fragment = document.createDocumentFragment();

    views = views || this.getViews();
    this.trigger('before:renderItems', this);

    _.forEach(views, function(view) {
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

  isFirstCollectionRender: function() {
    return this._isFirstCollectionRender;
  },

  onRenderItems: function(views) {
    return this;
  },

  filter: function(comparator) {
    var models;

    if (!_.isFunction(comparator)) return this;
    this.trigger('before:filter');
    this.removeItems();

    models = this.collection.filter(function(model) {
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

  onFilter: function(models) {
    return this;
  },

  appendItem: function(view) {
    if (!Z.Util.isView(view)) return this;
    this.trigger('before:appendItem', this);
    if (this.collection.length === 1) this.$list.empty();
    this.$list.append(view.render().el);
    this.trigger('after:appendItem', this);
    this.onAppendItem(view);
    return this;
  },

  onAppendItem: function(view) {
    return this;
  },

  prependItem: function(view) {
    if (!Z.Util.isView(view)) return this;
    this.trigger('before:prependItem', this);
    if (this.collection.length === 1) this.$list.empty();
    this.$list.prepend(view.render().el);
    this.trigger('after:prependItem', this);
    this.onPrependItem(view);
    return this;
  },

  onPrependItem: function(view) {
    return this;
  },

  getItemView: function(model) {
    if (Z.Util.isView(this.itemView)) {
      return this.itemView;
    } else if (_.isFunction(this.itemView)) {
      return this.itemView(model);
    } else {
      return Z.ModelView;
    }
  },

  addItem: function(model) {
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

  onAddItem: function(view) {
    return this;
  },

  addItems: function(models) {
    models = models || this.collection.models;

    _.forEach(models, function(model) {
      this.addItem(model);
    }, this);

    return this;
  },

  removeItem: function(model) {
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

  onRemoveItem: function(view) {
    return this;
  },

  removeItems: function(models) {
    models = models || this.collection.models;

    _.forEach(models, function(model) {
      this.removeItem(model);
    }, this);

    return this;
  },

  unplug: function() {
    this.unsetCollection();
    Zeppelin.View.prototype.unplug.apply(this, arguments);
    return this;
  },

  _onAdd: function(model) {
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

  _onReset: function() {
    this.removeViews();

    _.forEach(this.collection.models, function(model) {
      this.addItem(model);
    }, this);

    if (this.isRendered()) this.renderItems();
    return this;
  },

  _onRemove: function(model) {
    this.removeItem(model);
    return this;
  }
});
