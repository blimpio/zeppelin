Zeppelin.Model = Backbone.Model.extend({
  constructor: function(attributes, options) {
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

  toString: function() {
    return '[object Model]';
  },

  isPopulated: function() {
    return _.size(this.attributes) > 0;
  },

  localAttributes: [],

  getLocalAttributes: function() {
    return this.pick(_.result(this, 'localAttributes'));
  },

  toJSON: function() {
    return this.omit(_.result(this, 'localAttributes'));
  },

  validations: {},

  hasValidations: function() {
    return _.size(this.validations) > 0;
  },

  hasValidation: function(attributeName) {
    return this.validations[attributeName] !== undefined;
  },

  addValidation: function(attributeName, validation) {
    if (attributeName && validation) {
      if (_.isArray(validation) || _.isPlainObject(validation) || _.isFunction(validation)) {
        this.validations[attributeName] = _.isArray(validation) ? validation : [validation];
      }
    }

    return this;
  },

  validate: function(attributes) {
    var errors = {},
        validAttributes = {};

    attributes = attributes || this.attributes;

    if (_.size(attributes) && _.size(this.validations)) {
      _.forOwn(this.validations, function(validations, attributeName) {
        var attributeValue = attributes[attributeName];

        if (!_.isArray(validations)) validations = [validations];

        _.forEach(validations, function(validation) {
          var validationResult, isRequired;

          isRequired = _.find(validations, function(item) {
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
            _.forOwn(validation, function(value, key) {
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

  createCache: function(id, type) {
    id = id || this.cacheId;
    type = type || this.cacheType || 'localStorage';

    if (id) this.cache = new Zeppelin.Storage({
      type: type,
      namespace: id
    });

    return this;
  },

  fetchCache: function() {
    if (this.cache) this.set(this.cache.getAll());
    return this;
  },

  saveCache: function() {
    if (this.cache) this.cache.setAll(this.attributes);
    return this;
  },

  destroyCache: function() {
    if (this.cache) this.cache.clearAll();
    return this;
  }
});

_.extend(Zeppelin.Model.prototype, Zeppelin.Subscriptions);
