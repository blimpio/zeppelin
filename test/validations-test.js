describe('Zeppelin.Validations', function() {
  describe('exists()', function() {
    it('should return true if the value is not null, undefined, NaN or Infinity.', function() {
      expect(Z.Validations.exists(0)).to.be.true;
      expect(Z.Validations.exists(-1)).to.be.true;
      expect(Z.Validations.exists('')).to.be.true;
      expect(Z.Validations.exists({})).to.be.true;
      expect(Z.Validations.exists([])).to.be.true;
    });

    it('should return false if the value is null, undefined, NaN or Infinity.', function() {
      expect(Z.Validations.exists(null)).to.be.false;
      expect(Z.Validations.exists(undefined)).to.be.false;
      expect(Z.Validations.exists(NaN)).to.be.false;
      expect(Z.Validations.exists(Infinity)).to.be.false;
    });
  });

  describe('matchesRegExp()', function() {
    it('should return true if the value matches the passed regexp.', function() {
      expect(Z.Validations.matchesRegExp('4', /[0-9]/)).to.be.true;
      expect(Z.Validations.matchesRegExp('g', /[a-z]/)).to.be.true;
    });

    it('should return false if the value does not matches the passed regexp.', function() {
      expect(Z.Validations.matchesRegExp('g', /[0-9]/)).to.be.false;
      expect(Z.Validations.matchesRegExp('5', /[a-z]/)).to.be.false;
    });
  });

  describe('isEmpty()', function() {
    it('should return true if the value is an empty string, array, object or value has no enumerable properties.', function() {
      expect(Z.Validations.isEmpty(0)).to.be.true;
      expect(Z.Validations.isEmpty(-1)).to.be.true;
      expect(Z.Validations.isEmpty('')).to.be.true;
      expect(Z.Validations.isEmpty({})).to.be.true;
      expect(Z.Validations.isEmpty([])).to.be.true;
      expect(Z.Validations.isEmpty(null)).to.be.true;
      expect(Z.Validations.isEmpty(NaN)).to.be.true;
      expect(Z.Validations.isEmpty(Infinity)).to.be.true;
      expect(Z.Validations.isEmpty(undefined)).to.be.true;
    });

    it('should return false if the value is not empty.', function() {
      expect(Z.Validations.isEmpty(' ')).to.be.false;
      expect(Z.Validations.isEmpty([1, 2, 3])).to.be.false;
      expect(Z.Validations.isEmpty({a: 1, b: 2, c: 3})).to.be.false;
    });
  });

  describe('isEqual()', function() {
    it('should return true if the values passed are equal.', function() {
      expect(Z.Validations.isEqual(0, 0)).to.be.true;
      expect(Z.Validations.isEqual(-1, -1)).to.be.true;
      expect(Z.Validations.isEqual('a', 'a')).to.be.true;
      expect(Z.Validations.isEqual({a:1}, {a:1})).to.be.true;
      expect(Z.Validations.isEqual(['a', 'b'], ['a', 'b'])).to.be.true;
    });

    it('should return false if the values passed are not equal.', function() {
      expect(Z.Validations.isEqual('a')).to.be.false;
      expect(Z.Validations.isEqual(0, 3)).to.be.false;
      expect(Z.Validations.isEqual(-1, -5)).to.be.false;
      expect(Z.Validations.isEqual('a', 'A')).to.be.false;
      expect(Z.Validations.isEqual({a:1}, {a:4})).to.be.false;
      expect(Z.Validations.isEqual(['a', 'c'], ['a', 'b'])).to.be.false;
    });
  });

  describe('isRegExp()', function() {
    it('should return true if the value passed is a regular expression.', function() {
      expect(Z.Validations.isRegExp(/[0-9]/)).to.be.true;
      expect(Z.Validations.isRegExp(new RegExp('[0-9]'))).to.be.true;
    });

    it('should return false if the value passed is not a regular expression.', function() {
      expect(Z.Validations.isRegExp(100)).to.be.false;
      expect(Z.Validations.isRegExp('/[0-9]/')).to.be.false;
    });
  });

  describe('isBoolean()', function() {
    it('should return true if the value passed is a boolean.', function() {
      expect(Z.Validations.isBoolean(true)).to.be.true;
      expect(Z.Validations.isBoolean(false)).to.be.true;
      expect(Z.Validations.isBoolean(1 > 5)).to.be.true;
      expect(Z.Validations.isBoolean('a' === 1)).to.be.true;
    });

    it('should return false if the value passed is not a boolean.', function() {
      expect(Z.Validations.isBoolean(3)).to.be.false;
      expect(Z.Validations.isBoolean(0)).to.be.false;
      expect(Z.Validations.isBoolean('a')).to.be.false;
      expect(Z.Validations.isBoolean({a:1})).to.be.false;
      expect(Z.Validations.isBoolean(['a', 'c'])).to.be.false;
    });
  });

  describe('isArray()', function() {
    it('should return true if the value passed is an array.', function() {
      expect(Z.Validations.isArray([])).to.be.true;
      expect(Z.Validations.isArray(['a', 1])).to.be.true;
      expect(Z.Validations.isArray([{}])).to.be.true;
    });

    it('should return false if the value passed is not an array.', function() {
      expect(Z.Validations.isArray(3)).to.be.false;
      expect(Z.Validations.isArray(0)).to.be.false;
      expect(Z.Validations.isArray('a')).to.be.false;
      expect(Z.Validations.isArray({a:1})).to.be.false;
      expect(Z.Validations.isArray(function() {})).to.be.false;
    });
  });

  describe('isString()', function() {
    it('should return true if the value passed is a string.', function() {
      expect(Z.Validations.isString('')).to.be.true;
      expect(Z.Validations.isString('hello')).to.be.true;
    });

    it('should return false if the value passed is not a string.', function() {
      expect(Z.Validations.isString(3)).to.be.false;
      expect(Z.Validations.isString(0)).to.be.false;
      expect(Z.Validations.isString([])).to.be.false;
      expect(Z.Validations.isString({a:1})).to.be.false;
      expect(Z.Validations.isString(function() {})).to.be.false;
    });
  });

  describe('isNumber()', function() {
    it('should return true if the value passed is a number.', function() {
      expect(Z.Validations.isNumber(0)).to.be.true;
      expect(Z.Validations.isNumber(-1)).to.be.true;
    });

    it('should return false if the value passed is not a number.', function() {
      expect(Z.Validations.isNumber('1')).to.be.false;
      expect(Z.Validations.isNumber(NaN)).to.be.false;
      expect(Z.Validations.isNumber([])).to.be.false;
      expect(Z.Validations.isNumber({a:1})).to.be.false;
      expect(Z.Validations.isNumber(function() {})).to.be.false;
    });
  });

  describe('isObject()', function() {
    it('should return true if the value passed is an object.', function() {
      expect(Z.Validations.isObject([])).to.be.true;
      expect(Z.Validations.isObject({})).to.be.true;
      expect(Z.Validations.isObject(function(){})).to.be.true;
    });

    it('should return false if the value passed is not an object.', function() {
      expect(Z.Validations.isObject(1)).to.be.false;
      expect(Z.Validations.isObject('a')).to.be.false;
      expect(Z.Validations.isObject(null)).to.be.false;
      expect(Z.Validations.isObject(undefined)).to.be.false;
    });
  });

  describe('isPlainObject()', function() {
    it('should return true if the value passed is a plain object.', function() {
      expect(Z.Validations.isPlainObject({})).to.be.true;
      expect(Z.Validations.isPlainObject({a:1})).to.be.true;
    });

    it('should return false if the value passed is not a plain object.', function() {
      expect(Z.Validations.isPlainObject(1)).to.be.false;
      expect(Z.Validations.isPlainObject([])).to.be.false;
      expect(Z.Validations.isPlainObject('a')).to.be.false;
      expect(Z.Validations.isPlainObject(function(){})).to.be.false;
    });
  });

  describe('isOneOf()', function() {
    it('should return true if the value passed is in the given array.', function() {
      expect(Z.Validations.isOneOf(4, [1, 2, 4])).to.be.true;
      expect(Z.Validations.isOneOf('apple', ['orange', 'apple', 'steak'])).to.be.true;
    });

    it('should return false if the value passed is not in the given array.', function() {
      expect(Z.Validations.isOneOf('a')).to.be.false;
      expect(Z.Validations.isOneOf('a', 'a')).to.be.false;
      expect(Z.Validations.isOneOf(6, [1, 2, 4])).to.be.false;
      expect(Z.Validations.isOneOf('donut', ['orange', 'apple', 'steak'])).to.be.false;
    });
  });

  describe('isDate()', function() {
    it('should return true if the value passed is a date.', function() {
      expect(Z.Validations.isDate(new Date())).to.be.true;
      expect(Z.Validations.isDate('December 17, 1995 03:24:00')).to.be.true;
    });

    it('should return false if the value passed is not a date.', function() {
      expect(Z.Validations.isDate('a')).to.be.false;
    });
  });

  describe('isDateISO()', function() {
    it('should return true if the value is a valid ISO date (yyyy-mm-dd).', function() {
      expect(Z.Validations.isDateISO('1988-12-19')).to.be.true;
    });

    it('should return false if the value is not a valid ISO date (yyyy-mm-dd).', function() {
      expect(Z.Validations.isDateISO('Sunday, November 9, 2003')).to.be.false;
    });
  });

  describe('isDigit()', function() {
    it('should return true if the value is a digit.', function() {
      expect(Z.Validations.isDigit('5')).to.be.true;
      expect(Z.Validations.isDigit('5.2')).to.be.true;
    });

    it('should return false if the value is not a digit.', function() {
      expect(Z.Validations.isDigit(123)).to.be.false;
      expect(Z.Validations.isDigit('5a')).to.be.false;
    });
  });

  describe('isEmail()', function() {
    it('should return true if the value is an email.', function() {
      expect(Z.Validations.isEmail('name@example.com')).to.be.true;
      expect(Z.Validations.isEmail('name+age@example.com')).to.be.true;
    });

    it('should return false if the value is not an email.', function() {
      expect(Z.Validations.isEmail('name+age@')).to.be.false;
      expect(Z.Validations.isEmail('example.com')).to.be.false;
      expect(Z.Validations.isEmail('name@exam@ple.com')).to.be.false;
    });
  });

  describe('isUrl()', function() {
    it('should return true if the value is a url.', function() {
      expect(Z.Validations.isUrl('http://example.io')).to.be.true;
      expect(Z.Validations.isUrl('http://www.example.com/index')).to.be.true;
    });

    it('should return false if the value is not a url.', function() {
      expect(Z.Validations.isUrl('name+age@')).to.be.false;
      expect(Z.Validations.isUrl('example.com')).to.be.false;
      expect(Z.Validations.isUrl('name@example.com')).to.be.false;
    });
  });

  describe('isDomainName()', function() {
    it('should return true if the value is a domain name.', function() {
      expect(Z.Validations.isDomainName('getblimp.com')).to.be.true;
    });

    it('should return false if the value is not a domain name.', function() {
      expect(Z.Validations.isDomainName('https://app.getblimp.com')).to.be.false;
    });
  });

  describe('isAlphanumeric()', function() {
    it('should return true if the value is alphanumeric.', function() {
      expect(Z.Validations.isAlphanumeric('a')).to.be.true;
      expect(Z.Validations.isAlphanumeric('123')).to.be.true;
      expect(Z.Validations.isAlphanumeric('a123')).to.be.true;
    });

    it('should return false if the value is not alphanumeric.', function() {
      expect(Z.Validations.isAlphanumeric(1)).to.be.false;
      expect(Z.Validations.isAlphanumeric('@__.')).to.be.false;
      expect(Z.Validations.isAlphanumeric('--..--')).to.be.false;
    });
  });

  describe('isPhone()', function() {
    it('should return true if the value is a phone number.', function() {
      expect(Zeppelin.Validations.isPhone('787-555-5555')).to.be.true;
      expect(Zeppelin.Validations.isPhone('+1-787-555-5555')).to.be.true;
    });

    it('should return false if the value is not a phone number.', function() {
      expect(Zeppelin.Validations.isPhone('abc')).to.be.false;
      expect(Zeppelin.Validations.isPhone('5555555')).to.be.false;
    });
  });

  describe('isMinimum()', function() {
    it('should return true if the value is not less that the passed minimum.', function() {
      expect(Zeppelin.Validations.isMinimum(10, 10)).to.be.true;
      expect(Zeppelin.Validations.isMinimum(100, 10)).to.be.true;
    });

    it('should return false if the value is less that the passed minimum.', function() {
      expect(Zeppelin.Validations.isMinimum(0, 10)).to.be.false;
      expect(Zeppelin.Validations.isMinimum(9, 10)).to.be.false;
      expect(Zeppelin.Validations.isMinimum(-1, 10)).to.be.false;
    });
  });

  describe('isMaximum()', function() {
    it('should return true if the value is not greater that the passed maximum.', function() {
      expect(Zeppelin.Validations.isMaximum(5, 10)).to.be.true;
      expect(Zeppelin.Validations.isMaximum(10, 10)).to.be.true;
    });

    it('should return false if the value is greater that the passed maximum.', function() {
      expect(Zeppelin.Validations.isMaximum(11, 10)).to.be.false;
      expect(Zeppelin.Validations.isMaximum(-4, -5)).to.be.false;
      expect(Zeppelin.Validations.isMaximum(100, 10)).to.be.false;
    });
  });

  describe('isInRange()', function() {
    it('should return true if the value is within the passed range.', function() {
      expect(Zeppelin.Validations.isInRange(5, [1, 5])).to.be.true;
      expect(Zeppelin.Validations.isInRange(10, [10, 100])).to.be.true;
      expect(Zeppelin.Validations.isInRange(50, [10, 100])).to.be.true;
    });

    it('should return false if the value is not within the passed range.', function() {
      expect(Zeppelin.Validations.isInRange(0, [1, 5])).to.be.false;
      expect(Zeppelin.Validations.isInRange(-1, [0, 1])).to.be.false;
      expect(Zeppelin.Validations.isInRange(100, [10, '150'])).to.be.false;
    });
  });

  describe('isOfLength()', function() {
    it('should return true if the value has the same length as the passed length.', function() {
      expect(Zeppelin.Validations.isOfLength('red', 3)).to.be.true;
      expect(Zeppelin.Validations.isOfLength([1, 2, 3, 4], 4)).to.be.true;
      expect(Zeppelin.Validations.isOfLength(arguments, 0)).to.be.true;
    });

    it('should return false if the value is not within the passed range.', function() {
      expect(Zeppelin.Validations.isOfLength('red', 2)).to.be.false;
      expect(Zeppelin.Validations.isOfLength([1, 2, 3, 4], 1)).to.be.false;
      expect(Zeppelin.Validations.isOfLength({a: 1, b: 2}, 2)).to.be.false;
    });
  });

  describe('isOfMinimumLength()', function() {
    it('should return true if the value length is less than the passed length.', function() {
      expect(Zeppelin.Validations.isOfMinimumLength('red', 3)).to.be.true;
      expect(Zeppelin.Validations.isOfMinimumLength([1, 2, 3, 4], 2)).to.be.true;
    });

    it('should return false if the value length is not less than the passed length.', function() {
      expect(Zeppelin.Validations.isOfMinimumLength('red', 5)).to.be.false;
      expect(Zeppelin.Validations.isOfMinimumLength([1, 2, 3, 4], 10)).to.be.false;
      expect(Zeppelin.Validations.isOfMinimumLength({a: 1, b: 2}, 10)).to.be.false;
    });
  });

  describe('isOfMaximumLength()', function() {
    it('should return true if the value length is greater than the passed length.', function() {
      expect(Zeppelin.Validations.isOfMaximumLength('red', 3)).to.be.true;
      expect(Zeppelin.Validations.isOfMaximumLength([1, 2, 3, 4], 10)).to.be.true;
    });

    it('should return false if the value length is not greater than the passed length.', function() {
      expect(Zeppelin.Validations.isOfMaximumLength('red', 2)).to.be.false;
      expect(Zeppelin.Validations.isOfMaximumLength([1, 2, 3, 4], 1)).to.be.false;
      expect(Zeppelin.Validations.isOfMaximumLength({a: 1, b: 2}, 10)).to.be.false;
    });
  });

  describe('isLengthInRange()', function() {
    it('should return true if the value length is within the passed range.', function() {
      expect(Zeppelin.Validations.isLengthInRange('red', [1, 3])).to.be.true;
      expect(Zeppelin.Validations.isLengthInRange([1, 2, 3, 4], [4, 10])).to.be.true;
    });

    it('should return false if the value length is not within the passed range.', function() {
      expect(Zeppelin.Validations.isLengthInRange('red', [10, 20])).to.be.false;
      expect(Zeppelin.Validations.isLengthInRange([1, 2, 3, 4], [5, 10])).to.be.false;
    });
  });
});
