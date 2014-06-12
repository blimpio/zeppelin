describe('Zeppelin.Subscriptions', function() {
  describe('hasSubscriptions()', function() {
    var object;

    beforeEach(function() {
      object = {};
      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
    });

    afterEach(function() {
      object.unsubscribe();
    });

    it('should return false if the object has no subscriptions.', function() {
      expect(object.hasSubscriptions()).to.be.false;
    });

    it('should return true if the object has subscriptions.', function() {
      object.subscribe('event', function() {
        return this;
      });

      expect(object.hasSubscriptions()).to.be.true;
    });
  });

  describe('hasSubscription()', function() {
    var object;

    beforeEach(function() {
      object = {};
      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
    });

    afterEach(function() {
      object.unsubscribe();
    });

    it('should return false if the object doesn\'t have the given subscription.', function() {
      expect(object.hasSubscription('event')).to.be.false;
    });

    it('should return true if the object has the given subscription.', function() {
      object.subscribe('event', function() {
        return this;
      });

      expect(object.hasSubscription('event')).to.be.true;
    });
  });

  describe('registerSubscriptions()', function() {
    var object, onEventSpy;

    beforeEach(function() {
      object = {
        data: {
          a: 1
        },

        onEvent: function() {
          return this;
        }
      };

      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
      onEventSpy = sinon.spy(object, 'onEvent');
    });

    afterEach(function() {
      object.onEvent.restore();
      object.unsubscribe();
    });

    it('should register all given subscriptions.', function() {
      object.subscriptions = {
        'app:event': function(data) {
          this.data = data;
        },

        'app:other:event': 'onEvent'
      };

      object.registerSubscriptions();

      expect(object._subscriptions['app:event']).to.exist;
      expect(object._subscriptions['app:other:event']).to.exist;

      Backbone.Events.trigger('app:event', {hello: 'world'});
      expect(object.data.hello).to.equal('world');

      Backbone.Events.trigger('app:other:event', {hello: 'universe'});
      expect(onEventSpy).to.have.been.called;
    });
  });

  describe('subscribe()', function() {
    var object, onEventSpy;

    beforeEach(function() {
      object = {
        data: {
          a: 1
        },

        onEvent: function() {
          return this;
        },

        subscriptions: {}
      };

      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
      onEventSpy = sinon.spy(object, 'onEvent');
    });

    afterEach(function() {
      object.onEvent.restore();
      object.unsubscribe();
    });

    it('should not subscribe the object to the given event if the callback is not a method of the object.', function() {
      object.subscribe('app:event', 'callback');
      expect(object._subscriptions['app:event']).to.not.exist;
    });

    it('should subscribe the object to the given event.', function() {
      object.subscribe('app:event', function(data) {
        this.data = data;
      });

      object.subscribe('app:other:event', 'onEvent');

      Backbone.Events.trigger('app:event', {hello: 'world'});
      expect(object._subscriptions['app:event']).to.exist;
      expect(object.data.hello).to.equal('world');

      Backbone.Events.trigger('app:other:event', {hello: 'universe'});
      expect(object._subscriptions['app:other:event']).to.exist;
      expect(onEventSpy).to.have.been.called;
    });

    it('should subscribe the object to the given events.', function() {
      object.subscribe('app:event app:other:event', function(data) {
        this.data = data;
      });

      expect(object._subscriptions['app:event app:other:event']).to.exist;

      Backbone.Events.trigger('app:event', {hello: 'world'});
      expect(object.data.hello).to.equal('world');

      Backbone.Events.trigger('app:other:event', {hello: 'universe'});
      expect(object.data.hello).to.equal('universe');
    });
  });

  describe('subscribeToOnce()', function() {
    var object;

    beforeEach(function() {
      object = {
        data: {
          a: 1
        },

        onEvent: function() {
          return this;
        },

        subscriptions: {}
      };

      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
    });

    afterEach(function() {
      object.unsubscribe();
    });

    it('should not subscribe the object to the given event if the callback is not a method of the object.', function() {
      object.subscribeToOnce('app:event', 'callback');
      expect(object._subscriptions['app:event']).to.not.exist;
    });

    it('should subscribe the object to the given event and unsubscribe afterEach the first event.', function() {
      object.subscribeToOnce('app:event', function(data) {
        this.data = data;
      });

      Backbone.Events.trigger('app:event', {times: 1});
      Backbone.Events.trigger('app:event', {times: 2});
      Backbone.Events.trigger('app:event', {times: 3});
      expect(object._subscriptions['app:event']).to.exist;
      expect(object.data.times).to.equal(1);
    });
  });

  describe('broadcast()', function() {
    var objectA, objectB;

    beforeEach(function() {
      objectA = {
        data: {
          a: 1
        },

        onEvent: function() {
          return this;
        },

        subscriptions: {}
      };

      objectB = {
        otherData: {
          b: 2
        },

        subscriptions: {}
      };

      _.extend(objectA, Backbone.Events, Zeppelin.Subscriptions);
      _.extend(objectB, Backbone.Events, Zeppelin.Subscriptions);
    });

    afterEach(function() {
      objectA.unsubscribe();
      objectB.unsubscribe();
    });

    it('should trigger a global event.', function() {
      objectA.subscribe('app:event', function(data) {
        this.data = data;
      });

      objectB.broadcast('app:event', {triggered: true});
      expect(objectA.data.triggered).to.be.true;
    });
  });

  describe('unsubscribe()', function() {
    var object;

    beforeEach(function() {
      object = {
        data: {
          a: 1
        },

        onEvent: function() {
          return this;
        },

        subscriptions: {}
      };

      _.extend(object, Backbone.Events, Zeppelin.Subscriptions);
    });

    afterEach(function() {
      object.unsubscribe();
    });

    it('should unsubscribe the object from the given event.', function() {
      object.subscribe('app:event', function(data) {
        this.data = data;
      });

      object.unsubscribe('app:event');
      Backbone.Events.trigger('app:event', {hello: 'world'});
      expect(object.data.hello).to.not.exist;
    });

    it('should unsubscribe the object from all events if no events are passed.', function() {
      object.subscribe('app:event', function(data) {
        this.data = data;
      });

      object.subscribe('app:other:event', function(data) {
        this.data = data;
      });

      expect(object._subscriptions['app:event']).to.exist;
      expect(object._subscriptions['app:other:event']).to.exist;

      object.unsubscribe();
      Backbone.Events.trigger('app:event', {hello: 'world'});
      expect(object.data.hello).to.not.exist;
      Backbone.Events.trigger('app:other:event', {times: 1});
      expect(object.data.times).to.not.exist;

      expect(object._subscriptions).to.be.empty;
    });
  });
});
