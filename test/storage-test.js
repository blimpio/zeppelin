describe('Zeppelin.Storage', function() {
  describe('when instantiated.', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should exist.', function() {
      expect(object.storage).to.exist;
      expect(object.storage.store).to.exist;
    });

    it('should have a type defined.', function() {
      expect(object.storage.type).to.exist;
    });

    it('should have a namespace.', function() {
      expect(object.storage.namespace).to.exist;
      expect(object.storage.namespace).to.equal('Zeppelin');
    });
  });

  describe('has()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should return true if the given attribute is in storage.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.has('a')).to.be.true;
      expect(object.storage.has('b')).to.be.true;
    });

    it('should return false if the given attribute is not in storage.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.has('c')).to.be.false;
      expect(object.storage.has('d')).to.be.false;
    });
  });

  describe('length()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should return the length of the storage.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.length()).to.equal(2);
      object.storage.clear('b');
      expect(object.storage.length()).to.equal(1);
    });
  });

  describe('isEmpty()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should return true if the storage is empty.', function() {
      expect(object.storage.isEmpty()).to.be.true;

      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.isEmpty()).to.be.false;

      object.storage.clearAll();
      expect(object.storage.isEmpty()).to.be.true;
    });
  });

  describe('set()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should set the given data under the defined storage namespace without overriding existing data.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      object.storage.set('a', 2);
      expect(JSON.parse(sessionStorage.getItem(object.storage.namespace)).a).to.equal(2);
      expect(JSON.parse(sessionStorage.getItem(object.storage.namespace)).b).to.equal(2);

      object.storage.set({'b': 1});
      expect(JSON.parse(sessionStorage.getItem(object.storage.namespace)).a).to.equal(2);
      expect(JSON.parse(sessionStorage.getItem(object.storage.namespace)).b).to.equal(1);
    });
  });

  describe('setAll()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should override the data under the defined storage namespace with the given data.', function() {
      var data1, data2;

      data1 = {
        a: 1,
        b: 2
      };

      data2 = {
        a: 3,
        b: 4
      };

      object.storage.setAll(data1);
      expect(sessionStorage.getItem(object.storage.namespace)).to.eql(JSON.stringify(data1));
      object.storage.setAll(data2);
      expect(sessionStorage.getItem(object.storage.namespace)).to.eql(JSON.stringify(data2));
    });
  });

  describe('get()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should get the data of the given key under the defined storage namespace.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.get('a')).to.equal(1);
      expect(object.storage.get('b')).to.equal(2);
    });
  });

  describe('getAll()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should get all the data under the defined storage namespace.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      expect(object.storage.getAll()).to.eql({
        a: 1,
        b: 2
      });
    });
  });

  describe('clear()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should clear the data of the given key under the defined storage namespace.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      object.storage.clear('b');
      expect(object.storage.getAll()).to.eql({a: 1});
    });
  });

  describe('clearAll()', function() {
    var object = {};

    beforeEach(function() {
      object.storage = new Zeppelin.Storage({
        type: 'sessionStorage',
        namespace: 'Zeppelin'
      });
    });

    afterEach(function() {
      object.storage.clearAll();
    });

    it('should clear all the data under the defined storage namespace.', function() {
      object.storage.setAll({
        a: 1,
        b: 2
      });

      object.storage.clearAll();
      expect(object.storage.length()).to.equal(0);
    });
  });
});
