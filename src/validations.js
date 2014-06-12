Zeppelin.Validations = {
  exists: function(value) {
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

  matchesRegExp: function(value, regexp) {
    if (this.isString(value) && this.isRegExp(regexp)) {
      return regexp.test(value);
    } else {
      return false;
    }
  },

  isEmpty: function(value) {
    if (this.exists(value)) {
      return _.isEmpty(value);
    } else {
      return true;
    }
  },

  isEqual: function(a, b) {
    if (this.exists(a)) {
      return _.isEqual(a, b);
    } else {
      return false;
    }
  },

  isRegExp: function(value) {
    if (this.exists(value)) {
      return _.isRegExp(value);
    } else {
      return false;
    }
  },

  isBoolean: function(value) {
    if (this.exists(value)) {
      return _.isBoolean(value);
    } else {
      return false;
    }
  },

  isObject: function(value) {
    if (this.exists(value)) {
      return _.isObject(value);
    } else {
      return false;
    }
  },

  isPlainObject: function(value) {
    if (this.exists(value)) {
      return _.isPlainObject(value);
    } else {
      return false;
    }
  },

  isArray: function(value) {
    if (this.exists(value)) {
      return _.isArray(value);
    } else {
      return false;
    }
  },

  isString: function(value) {
    if (this.exists(value)) {
      return _.isString(value);
    } else {
      return false;
    }
  },

  isNumber: function(value) {
    if (this.exists(value)) {
      return _.isNumber(value);
    } else {
      return false;
    }
  },

  isOneOf: function(value, types) {
    if (this.exists(value) && this.isArray(types)) {
      return _.indexOf(types, value) !== -1;
    } else {
      return false;
    }
  },

  isDate: function(value) {
    var date;

    if (this.exists(value)) {
      date = new Date(value);
      return date.toString() !== 'Invalid Date' && _.isDate(date);
    } else {
      return false;
    }
  },

  isDateISO: function(value) {
    if (this.isString(value)) {
      return /^(\d{4})\D?(0[1-9]|1[0-2])\D?([12]\d|0[1-9]|3[01])$/.test(value);
    } else {
      return false;
    }
  },

  isDigit: function(value) {
    if (this.isString(value)) {
      return /^-?\d+\.?\d*$/.test(value);
    } else {
      return false;
    }
  },

  isEmail: function(value) {
    if (this.isString(value)) {
      return /^[\+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value);
    } else {
      return false;
    }
  },

  isUrl: function(value) {
    if (this.isString(value)) {
      return /^(ftp|http|https):\/\/[^ "]+$/.test(value);
    } else {
      return false;
    }
  },

  isDomainName: function(value) {
    if (this.isString(value)) {
      return /^(?!:\/\/)([a-zA-Z0-9]+\.)?[a-zA-Z0-9][a-zA-Z0-9-]+\.[a-zA-Z]{2,6}?$/.test(value);
    } else {
      return false;
    }
  },

  isAlphanumeric: function(value) {
    if (this.isString(value)) {
      return /^\w+$/.test(value);
    } else {
      return false;
    }
  },

  isPhone: function(value) {
    if (this.isString(value)) {
      return /^(?:\+?1[-. ]?)?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value);
    } else {
      return false;
    }
  },

  isMinimum: function(value, minimum) {
    if (this.isNumber(value) && this.isNumber(minimum)) {
      return value >= minimum;
    } else {
      return false;
    }
  },

  isMaximum: function(value, maximum) {
    if (this.isNumber(value) && this.isNumber(maximum)) {
      return value <= maximum;
    } else {
      return false;
    }
  },

  isInRange: function(value, range) {
    var minimum, maximum;

    if (this.isNumber(value) && this.isArray(range)) {
      minimum = range[0];
      maximum = _.last(range);

      if(this.isNumber(minimum) && this.isNumber(maximum)) {
        return value >= minimum && value <= maximum;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },

  isOfLength: function(value, length) {
    if (this.exists(value) && value.length !== undefined && this.isNumber(length)) {
      return value.length === length;
    } else {
      return false;
    }
  },

  isOfMinimumLength: function(value, minimum) {
    if (this.exists(value) && value.length !== undefined && this.isNumber(minimum)) {
      return value.length >= minimum;
    } else {
      return false;
    }
  },

  isOfMaximumLength: function(value, maximum) {
    if (this.exists(value) && value.length !== undefined && this.isNumber(maximum)) {
      return value.length <= maximum;
    } else {
      return false;
    }
  },

  isLengthInRange: function(value, range) {
    var minimum, maximum;

    if (this.exists(value) && value.length !== undefined && this.isArray(range)) {
      minimum = range[0];
      maximum = _.last(range);

      if(this.isNumber(minimum) && this.isNumber(maximum)) {
        return value.length >= minimum && value.length <= maximum;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
};
