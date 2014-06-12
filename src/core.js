(function(root, Backbone) {
  'use strict';

  var Zeppelin, Z;

  if (typeof exports !== 'undefined') {
    Zeppelin = exports;
  } else {
    root.Zeppelin = root.Z = Zeppelin = Z = {};
  }

  Zeppelin.$ = Backbone.$;
  Zeppelin.extend = Backbone.View.extend;
  Zeppelin.VERSION = '0.0.1-alpha';

  // require src/utils.js
  // require src/subscriptions.js
  // require src/storage.js
  // require src/validations.js
  // require src/bindings.js
  // require src/mixins.js
  // require src/model.js
  // require src/collection.js
  // require src/view.js
  // require src/model-view.js
  // require src/form-view.js
  // require src/composite-view.js
  // require src/collection-view.js
  // require src/region.js
  // require src/layout.js
  // require src/controller.js
  // require src/router.js
  // require src/application.js
  return Zeppelin;
})(this, Backbone);
