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

  diff: function() {
    var changes = {};

    _.forOwn(this.getAttributeValues(), function(value, key) {
      if (value !== this.model.get(key)) changes[key] = value
    }, this);

    return changes;
  }
});
