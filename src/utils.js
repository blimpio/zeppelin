Zeppelin.Util = {
  Error: function(message) {
    throw new Error(message);
  },

  isView: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object View]';
  },

  isModel: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Model]';
  },

  isCollection: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Collection]';
  },

  isRegion: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Region]';
  },

  isLayout: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Layout]';
  },

  isController: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Controller]';
  },

  isRouter: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Router]';
  },

  isApplication: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Application]';
  },

  isStorage: function(value) {
    var toString;

    if (!value) return false;

    toString = _.isFunction(value)
      ? value.prototype.toString()
      : value.toString();

    return toString === '[object Storage]';
  },

  isJqueryObject: function(value) {
    return value instanceof jQuery;
  },

  isInDOM: function(element) {
    if (!_.isElement(element)) {
      element = Z.Util.isJqueryObject(element) ? element[0] : Z.$(element)[0];
    }

    return Z.$.contains(document, element);
  },

  getElementEvents: function(element) {
    if (!_.isElement(element)) {
      element = Z.Util.isJqueryObject(element) ? element[0] : Z.$(element)[0];
    }

    return Z.$._data(element, 'events');
  },

  getInstance: function(module, options) {
    return _.isFunction(module) ? new module(options) : module;
  }
};
