Zeppelin
========

The [Blimp Boards frontend](https://github.com/GetBlimp/boards-web) is built on top of a set of components that leverage the Backbone library called Zeppelin. Zeppelin was built to solve structuring problems encountered while building the [Blimp project management app](http://www.getblimp.com/). Building big Backbone apps can sometimes be difficult as the library does not provide a clear way to structure apps, a "weakness" that makes Backbone so powerful. Zeppelin borrows ideas from frameworks that work on top of Backbone (Chaplin, Marionette, Thorax, etc.) while introducing new concepts and functionality that help structure and develop apps faster.

Installing
----------

On node:

    npm install blimp-zeppelin

On the browser:

    bower install zeppelin

*Be sure to put the Zeppelin library after the Backbone library.*

Building
--------

1. Run `npm install`.
2. Run `gulp build`. The library will be build placed in the `build/` directory.

Testing
-------

1. Build Zeppelin.
2. Run `bower install`.
3. Run `gulp test`.

## Components

### `Zeppelin.Application`

The application is top-level component that's usually assign to the `window` object. `Zeppelin.Application` extends `Backbone.Router` so all routes are define in the application object. The application object is also a good place to put global data, for example `window.Application.API_URL`.

    var Application = Zeppelin.Application.extend({
      routes: {
        'help': function() {
          console.log('Get some help!');
        }
      }
    });

    window.App = new Application();
    App.start({pushState: true});
    App.navigate('/help/', {trigger: true});

### `Zeppelin.Controller`

A controller represents the current page, there can only be one controller active at a time. Controllers can have `views`, `layouts` and `regions`. The logic inside a controller is up to you. Usually this is where you would fetch data and render the main layout and child views as well as respond to any global events related to the current page (like state changes).

    var MainController = Zeppelin.Controller.extend({
      layouts: {
        main: MainLayout
      },

      initialize: function() {
        this.getLayout('main').render();
        this.posts = Zeppelin.Util.getInstance(Z.Collection);
        this.posts.fetch();
      }
    });

    var controller = new MainController();

### `Zeppelin.Layout`

A layout is a container of regions that manages their lifecycle (init and unplug). Layouts are assigned a DOM element like `Backbone.View`, in this element you can render a template that will hold the elements that the regions will use to render views. Layouts are a good place to handle DOM events that aren't handled by views.

    var MainLayout = Zeppelin.Layout.extend({
      el: 'div.main',

      template: function() {
        return '<div class="content"></content>'
      },

      regions: {
        content: ContentRegion
      },

      onRender: function() {
        this.getRegion('content').show(SomeView);
      }
    });

    var layout = new MainLayout();
    layout.render();

### `Zeppelin.Region`

A region manages view rendering on a specific element. In a Zeppelin app views don't have a defined `el` property, this means that a view is not attached to a specific element in the document. A view can be rendered and inserted into any element by using a region. By using regions to render and remove views from elements views are more component-like because they are not exclusive to any part of the document so they can be used in multiple locations/cases.

    var ContentRegion = Zeppelin.Region.extend({
      el: 'div.content',

      onShow: function() {
        this.$el.addClass('has-a-rendered-view');
      }
    });

    var content = new ContentRegion();
    content.show(SomeView);

### Simple app structure example:

[http://jsbin.com/wadam/6/edit](http://jsbin.com/wadam/6/edit)

## Views

In addition to components that help structure your app, Zeppelin has a couple of views that solve common tasks like rendering a collection or binding a model to a form.

### `Zeppelin.ModelView`

Plain view that works with a model, used by `Zeppelin.CollectionView` to render collections and inherited by `Zeppelin.FormView` to bind form elements to model attributes.

    var PostView = Zeppelin.ModelView.extend({
      bindings: {
        model: {
          'change:title': 'onChangeTitle'
        }
      },

      onChangeTitle: function(post, title) {
        this.find('h1').text(title);
      }
    });

    var post = new PostView({ model: PostModel });
    PostModel.set('title', 'Hello World');
    console.log(post.find('h1').text()); // Hello World

### `Zeppelin.CollectionView`

A view that automatically renders a collection and reacts to `remove` and `add` events. It can also render filtered collections.

    var PostsView = Zeppelin.CollectionView.extend({
      tagName: 'ol',

      itemView: PostView,

      collection: PostsCollection,

      addMethod: 'prepend',

      listSelector: 'ol.posts',

      template: function() {
        return '<h1>Posts</h1>' + '<ol class="posts"></ol>';
      },

      emptyTemplate: function() {
        return '<p>No posts...</p>';
      }
    });

    var posts = new PostsView();

    // Renders posts that are awesome.
    posts.filter(function(post) {
      return post.get('isAwesome') === true;
    });

### `Zeppelin.FormView`

A view that binds form elements to model attributes. The view validates the model when submitting the for and reacts to the model's `valid` and `invalid` events.

    var CreatePostForm = Zeppelin.FormView.extend({
      model: PostModel,

      events: {
        'click [data-action=cancel]': 'onCancel'
      },

      elements: {
        titleInput: 'input[name=title]'
      },

      onCancel: function() {
        this.reset();
        this.getElement('titleInput').removeClass('is-focused');
      },

      onSubmit: function() {
        this.reset();
      },

      onValidationSuccess: function() {
        this.broadcast('post:created', this.model);
      },

      onValidationError: function() {
        this.$el.addClass('show-error-messages');
      }
    });

    var form = new CreatePostForm();
    form.render();
    form.getAttributeElement('title').val('Blimp');
    form.getAttributeValue('title'); // Blimp

## Models and Collections

### `Zeppelin.Model`

Models in Zeppelin extend `Backbone.Model` to add local attributes, attribute caching to `localStorage`/`sessionStorage` and attribute validations.

    var PostModel = Zeppelin.Model.extend({
      defaults: {
        edited: false
      },

      localAttributes: ['edited'],

      validations: {
        title: [{
          isEmpty: false,
          message: 'Every card requires at least a name.'
        }, {
          isOfMaximumLength: 140,
          message: 'The title can\'t be longer than 140 characters.'
        }]
      },

      cacheId: 'Post#123'
    });

    var post = new PostModel();
    post.save(); // Won't save because the model is not valid.
    post.set({ title: 'A post.', edited: true });
    post.save(); // Will only send the title attribute to the server.
    post.saveCache(); // Will save the model to localStorage under the key 'Post#123'

### `Zeppelin.Collection`

Extends `Backbone.Collection` to add models caching to `localStorage`/`sessionStorage` (works like model caching).

## TODO

- API documentation.
- Tests.
- More examples.
