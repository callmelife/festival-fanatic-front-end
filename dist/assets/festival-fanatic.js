"use strict";

/* jshint ignore:start */



/* jshint ignore:end */

define('festival-fanatic/ajax/service', ['exports', 'ember', 'ember-ajax/services/ajax', 'festival-fanatic/config/environment'], function (exports, _ember, _emberAjaxServicesAjax, _festivalFanaticConfigEnvironment) {
  exports['default'] = _emberAjaxServicesAjax['default'].extend({
    host: _festivalFanaticConfigEnvironment['default'].apiHost,

    auth: _ember['default'].inject.service(),
    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers.Authorization = 'Token token=' + token;
        }

        return headers;
      }
    })
  });
});
define('festival-fanatic/app', ['exports', 'ember', 'festival-fanatic/resolver', 'ember-load-initializers', 'festival-fanatic/config/environment'], function (exports, _ember, _festivalFanaticResolver, _emberLoadInitializers, _festivalFanaticConfigEnvironment) {

  var App = undefined;

  _ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = _ember['default'].Application.extend({
    modulePrefix: _festivalFanaticConfigEnvironment['default'].modulePrefix,
    podModulePrefix: _festivalFanaticConfigEnvironment['default'].podModulePrefix,
    Resolver: _festivalFanaticResolver['default']
  });

  (0, _emberLoadInitializers['default'])(App, _festivalFanaticConfigEnvironment['default'].modulePrefix);

  exports['default'] = App;
});
define('festival-fanatic/application/adapter', ['exports', 'festival-fanatic/config/environment', 'active-model-adapter', 'ember'], function (exports, _festivalFanaticConfigEnvironment, _activeModelAdapter, _ember) {
  exports['default'] = _activeModelAdapter['default'].extend({
    host: _festivalFanaticConfigEnvironment['default'].apiHost,

    auth: _ember['default'].inject.service(),

    headers: _ember['default'].computed('auth.credentials.token', {
      get: function get() {
        var headers = {};
        var token = this.get('auth.credentials.token');
        if (token) {
          headers.Authorization = 'Token token=' + token;
        }

        return headers;
      }
    })
  });
});
define('festival-fanatic/application/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      signOut: function signOut() {
        var _this = this;

        this.get('auth').signOut().then(function () {
          return _this.get('store').unloadAll();
        }).then(function () {
          return _this.transitionTo('sign-in');
        }).then(function () {
          _this.get('flashMessages').warning('You have been signed out.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Are you sure you\'re signed-in?');
        });
      },

      error: function error(reason) {
        var unauthorized = reason.errors && reason.errors.some(function (error) {
          return error.status === '401';
        });

        if (unauthorized) {
          this.get('flashMessages').danger('You must be authenticated to access this page.');
          this.transitionTo('/sign-in');
        } else {
          this.get('flashMessages').danger('There was a problem. Please try again.');
        }

        return false;
      }
    }
  });
});
define('festival-fanatic/application/serializer', ['exports', 'active-model-adapter'], function (exports, _activeModelAdapter) {
  exports['default'] = _activeModelAdapter.ActiveModelSerializer.extend({});
});
define("festival-fanatic/application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0H4h7mtV", "block": "{\"statements\":[[\"append\",[\"helper\",[\"my-application\"],null,[[\"signOut\"],[\"signOut\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/application/template.hbs" } });
});
define('festival-fanatic/auth/service', ['exports', 'ember', 'ember-local-storage'], function (exports, _ember, _emberLocalStorage) {
  exports['default'] = _ember['default'].Service.extend({
    ajax: _ember['default'].inject.service(),
    credentials: (0, _emberLocalStorage.storageFor)('auth'),
    isAuthenticated: _ember['default'].computed.bool('credentials.token'),

    signUp: function signUp(credentials) {
      return this.get('ajax').post('/sign-up', {
        data: {
          credentials: {
            email: credentials.email,
            password: credentials.password,
            password_confirmation: credentials.passwordConfirmation
          }
        }
      });
    },

    signIn: function signIn(credentials) {
      var _this = this;

      return this.get('ajax').post('/sign-in', {
        data: {
          credentials: {
            email: credentials.email,
            password: credentials.password
          }
        }
      }).then(function (result) {
        _this.get('credentials').set('id', result.user.id);
        _this.get('credentials').set('email', result.user.email);
        _this.get('credentials').set('token', result.user.token);
      });
    },

    changePassword: function changePassword(passwords) {
      return this.get('ajax').patch('/change-password/' + this.get('credentials.id'), {
        data: {
          passwords: {
            old: passwords.previous,
            'new': passwords.next
          }
        }
      });
    },

    signOut: function signOut() {
      var _this2 = this;

      return this.get('ajax').del('/sign-out/' + this.get('credentials.id'))['finally'](function () {
        return _this2.get('credentials').reset();
      });
    }
  });
});
define('festival-fanatic/auth/storage', ['exports', 'ember-local-storage/local/object'], function (exports, _emberLocalStorageLocalObject) {
  exports['default'] = _emberLocalStorageLocalObject['default'].extend({});
});
define('festival-fanatic/change-password/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      changePassword: function changePassword(passwords) {
        var _this = this;

        this.get('auth').changePassword(passwords).then(function () {
          return _this.get('auth').signOut();
        }).then(function () {
          return _this.transitionTo('sign-in');
        }).then(function () {
          _this.get('flashMessages').success('Successfully changed your password!');
        }).then(function () {
          _this.get('flashMessages').warning('You have been signed out.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("festival-fanatic/change-password/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "0eskBMbU", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"not-logged-in\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Change Password\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"helper\",[\"change-password-form\"],null,[[\"submit\"],[\"changePassword\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/change-password/template.hbs" } });
});
define("festival-fanatic/comment/model", ["exports"], function (exports) {});
// import DS from 'ember-data';
//
// export default DS.Model.extend({
//   content: DS.attr('string'),
//   festival: DS.belongsTo('festival'),
// });
define('festival-fanatic/components/change-password-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    passwords: {},

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('passwords'));
      },

      reset: function reset() {
        this.set('passwords', {});
      }
    }
  });
});
define("festival-fanatic/components/change-password-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "1DUr/6g1", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"previous\"],[\"flush-element\"],[\"text\",\"Old Password\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"placeholder\",\"value\"],[\"password\",\"form-control\",\"previous\",\"Old password\",[\"get\",[\"passwords\",\"previous\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"form-group\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"next\"],[\"flush-element\"],[\"text\",\"New Password\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"class\",\"id\",\"placeholder\",\"value\"],[\"password\",\"form-control\",\"next\",\"New password\",[\"get\",[\"passwords\",\"next\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Change Password\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/change-password-form/template.hbs" } });
});
define('festival-fanatic/components/email-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("festival-fanatic/components/email-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "CG/b72ci", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"email\"],[\"flush-element\"],[\"text\",\"Email\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"email\",\"email\",\"Email\",[\"get\",[\"email\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/email-input/template.hbs" } });
});
define('festival-fanatic/components/festival-list/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      'delete': function _delete() {
        this.sendAction('delete', this.get('festival'));
      }
    }
  });
});
define('festival-fanatic/components/festival-list/edit/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      save: function save() {
        this.sendAction('save', this.get('festival'));
      },
      cancel: function cancel() {
        this.sendAction('cancel', this.get('festival'));
      }
    }
  });
});
define("festival-fanatic/components/festival-list/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "2rxCV2Oi", "block": "{\"statements\":[[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,3,2]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"If you havent created a user profile yet you can click Here to be redirected to the Sign-up Page\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"      \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Click Here to be redirected to the Sign-In Page\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"not-logged-in\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"h1\",[]],[\"flush-element\"],[\"text\",\"We're sorry - but if you'd like to upload a Festival you have to sign into an existing account or create an account to sign into.\"],[\"close-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"sign-in\"],null,1],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"sign-up\"],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"form\",[]],[\"static-attr\",\"class\",\"enter-info-container\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"save\"],[[\"on\"],[\"submit\"]]],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"What's the Name?\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\" Current Title: \"],[\"append\",[\"unknown\",[\"festival\",\"title\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"placeholder\",\"value\"],[\"input-area\",\"Enter Festival Name Here...\",[\"get\",[\"festival\",\"title\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"Tell everyone alittle about the festival! Regardless of if its a description from their website, what you think the festival is all about, a word-for-word description from its site - we want to know!\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"Current Description: \"],[\"append\",[\"unknown\",[\"festival\",\"description\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"class\",\"placeholder\",\"value\"],[\"input-area\",\"Enter Festival Description Here...\",[\"get\",[\"festival\",\"description\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"What Type of music is it? \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Current  Genre: \"],[\"append\",[\"unknown\",[\"festival\",\"genre\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"Enter Festival Genre Here...\",\"input-area\",[\"get\",[\"festival\",\"genre\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"Where's the event being held? 279 Tremont St, Boston, MA 02116? Some where in the London metro area? Belgium? Festival Fanatic doesn't care if you have specific address or a general area! \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Current  Location: \"],[\"append\",[\"unknown\",[\"festival\",\"location\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"Enter Festival Location Here...\",\"input-area\",[\"get\",[\"festival\",\"location\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"What's the venue? Your favorite club? A festival out in the desert? A party on the Moon? A rave in your friend's basement? An undisclosed location? Whereever it is, somewhere is hosting. \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Current Venue: \"],[\"append\",[\"unknown\",[\"festival\",\"venue\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"Enter Festival Venue Here...\",\"input-area\",[\"get\",[\"festival\",\"venue\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"Let's see a picture of what we're working with! Enter a valid image URL below to give your friends an idea of what you've seen! Note: Festival Fanatic only consumes valid URLs (.jpg, .png, .gif) \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Current Image URL: \"],[\"append\",[\"unknown\",[\"festival\",\"url\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"Enter Image URL Here...\",\"input-area\",[\"get\",[\"festival\",\"url\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"Is the event upcoming? Have you already been to it? Maybe the date hasn't been released yet! Festival Fanatic understands that finding a date on events can be a difficult task - so we've given you the option to display the most accurate terms as possible. All the following are acceptable: '12/31/1999', 'Already happened and I missed it!', 'It's coming up, but I'm not sure when!' \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Festival Date: \"],[\"append\",[\"unknown\",[\"festival\",\"date\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"mm/dd/yyyy\",\"input-area\",[\"get\",[\"festival\",\"date\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"How much did this festival set you back (financially speaking)? $200? €100? Nothing? Don't remember? That's OK - Being a Festival Fanatic isn't about the money.\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Festival Price: \"],[\"append\",[\"unknown\",[\"festival\",\"price\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"class\",\"value\"],[\"Enter Ticket Price Here...\",\"input-area\",[\"get\",[\"festival\",\"price\"]]]]],false],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"instructions\"],[\"flush-element\"],[\"text\",\"So, how was it? Let us know what you think of the event! Is the event upcoming? That's OK too! Post about how excited you are to go! Posting about intent to go makes meet-up's much easier! The the more the merrier! \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"input-field\"],[\"flush-element\"],[\"text\",\"\\n    Current Comment on Festival: \"],[\"append\",[\"unknown\",[\"festival\",\"comment\"]],false],[\"text\",\"\\n    \"],[\"append\",[\"helper\",[\"input\"],null,[[\"placeholder\",\"value\",\"class\"],[\"Enter A Comment Here...\",[\"get\",[\"festival\",\"comment\"]],\"input-area\"]]],false],[\"text\",\"\\n            \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-md submit-festival btn-primary\"],[\"flush-element\"],[\"text\",\"Save Your Event To The List!\"],[\"close-element\"],[\"text\",\"\\n            \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-md cancel-submit-btn btn-danger\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"cancel\"]],[\"flush-element\"],[\"text\",\"Cancel\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/festival-list/edit/template.hbs" } });
});
define("festival-fanatic/components/festival-list/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "GcVhEOBr", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-holder\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"festival-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"festival\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"img\",[]],[\"dynamic-attr\",\"src\",[\"concat\",[[\"unknown\",[\"festival\",\"url\"]]]]],[\"static-attr\",\"class\",\"image\"],[\"static-attr\",\"alt\",\"Image of Event\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"brief-descrition-container\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"festival\",\"description\"]],false],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"link-to\"],[\"festival\",[\"get\",[\"festival\"]]],null,1],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"festival\",\"editable\"]]],null,0],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-danger delete-card-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"delete\"]],[\"flush-element\"],[\"text\",\"Delete Festival\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default btn-success view-festival-btn\"],[\"flush-element\"],[\"text\",\"Click Here To View This Festival\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/festival-list/template.hbs" } });
});
define('festival-fanatic/components/festival-list/view/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),
    owner: JSON.parse(localStorage.getItem('storage:auth')).email,

    // userIsOwner: Ember.computed('festival', function(){
    //   let objOwner = this.get('auth.credentials.email');
    //   let currentUser = JSON.parse(localStorage.getItem('storage:auth')).email;
    //   if (objOwner === currentUser) {
    //     return true;
    //     console.log("owner & user are the same");
    //     return `{{#link-to 'festival/edit' festival}}
    //         <button class='btn btn-primary post-festival-btn'>Click Here to Edit This Festival's information</button>
    //       {{/link-to}}`;
    //
    //   }
    // }),

    model: function model(params) {
      return this.get('store').findRecord('festival', params.festival_id);
    },
    actions: {
      'delete': function _delete() {
        this.sendAction('delete', this.get('festival'));
      }
    }
  });
});
// festival-list/view/Component
define("festival-fanatic/components/festival-list/view/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "tg2qrRBl", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"card-holder\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h3\",[]],[\"static-attr\",\"class\",\"festival-title\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"festival\",\"title\"]],false],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"img\",[]],[\"dynamic-attr\",\"src\",[\"concat\",[[\"unknown\",[\"festival\",\"url\"]]]]],[\"static-attr\",\"class\",\"image\"],[\"static-attr\",\"alt\",\"Image of Event\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"brief-descrition-container\"],[\"flush-element\"],[\"append\",[\"unknown\",[\"festival\",\"description\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"festival-info-container\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-location\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Location:\"],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"unknown\",[\"festival\",\"location\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-venue\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Venue:\"],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"unknown\",[\"festival\",\"venue\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-genre\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Genre:\"],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"unknown\",[\"festival\",\"genre\"]],false],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-price\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Ticket Price:\"],[\"close-element\"],[\"text\",\" $\"],[\"append\",[\"unknown\",[\"festival\",\"price\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-date\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Date:\"],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"unknown\",[\"festival\",\"date\"]],false],[\"close-element\"],[\"text\",\"\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"info-container-comment\"],[\"flush-element\"],[\"open-element\",\"strong\",[]],[\"flush-element\"],[\"text\",\"Comment:\"],[\"close-element\"],[\"text\",\" \"],[\"append\",[\"unknown\",[\"festival\",\"comment\"]],false],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"festival\",\"editable\"]]],null,1],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"festival-owner-div\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"festival-owner\"],[\"flush-element\"],[\"text\",\"This Festival was added by: \"],[\"append\",[\"unknown\",[\"user\"]],false],[\"text\",\" \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\" Connect with them and see if they want to meet up!\"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"text\",\"\\n\"],[\"text\",\"\\n\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-primary edit-festival-btn\"],[\"flush-element\"],[\"text\",\"Edit This Festival's information\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"block\",[\"link-to\"],[\"festival/edit\",[\"get\",[\"festival\"]]],null,0]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/festival-list/view/template.hbs" } });
});
define('festival-fanatic/components/festival-view/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({});
});
define("festival-fanatic/components/festival-view/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "CAiipjyZ", "block": "{\"statements\":[[\"text\",\"This page should be dsiplaying the specific fesitval I click on!!!!\\n\"],[\"append\",[\"unknown\",[\"festival\",\"title\"]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/festival-view/template.hbs" } });
});
define('festival-fanatic/components/flash-message', ['exports', 'ember-cli-flash/components/flash-message'], function (exports, _emberCliFlashComponentsFlashMessage) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashComponentsFlashMessage['default'];
    }
  });
});
define('festival-fanatic/components/hamburger-menu/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'button',
    classNames: ['navbar-toggle', 'collapsed'],
    attributeBindings: ['toggle:data-toggle', 'target:data-target', 'expanded:aria-expanded'],
    toggle: 'collapse',
    target: '#navigation',
    expanded: false
  });
});
define("festival-fanatic/components/hamburger-menu/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "kRwOOMYp", "block": "{\"statements\":[[\"text\",\"  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"sr-only\"],[\"flush-element\"],[\"text\",\"Toggle navigation\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"span\",[]],[\"static-attr\",\"class\",\"icon-bar\"],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/hamburger-menu/template.hbs" } });
});
define('festival-fanatic/components/my-application/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    auth: _ember['default'].inject.service(),
    user: _ember['default'].computed.alias('auth.credentials.email'),
    isAuthenticated: _ember['default'].computed.alias('auth.isAuthenticated'),

    actions: {
      signOut: function signOut() {
        this.sendAction('signOut');
      }
    }
  });
});
define("festival-fanatic/components/my-application/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "RSBsRy/z", "block": "{\"statements\":[[\"open-element\",\"nav\",[]],[\"static-attr\",\"class\",\"navbar navbar-default\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"container-fluid\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"navbar-header\"]],false],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"collapse navbar-collapse\"],[\"static-attr\",\"id\",\"navigation\"],[\"flush-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,14,11],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n      \"],[\"open-element\",\"ul\",[]],[\"static-attr\",\"class\",\"nav navbar-nav navbar-right\"],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,9,7],[\"text\",\"      \"],[\"close-element\"],[\"text\",\"\\n    \"],[\"close-element\"],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"if\"],[[\"get\",[\"isAuthenticated\"]]],null,4,3],[\"text\",\"\\n\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"flashMessages\",\"queue\"]]],null,0],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"col-md-8 col-md-offset-2\"],[\"flush-element\"],[\"text\",\"\\n    \"],[\"append\",[\"unknown\",[\"outlet\"]],false],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"flash-message\"],null,[[\"flash\"],[[\"get\",[\"flash\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[\"flash\"]},{\"statements\":[[\"text\",\"Click Here to sign back in if you've been on Festival Fanatic before!\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Click Here to Get Started if this is your first time on Festival Fanatic!\"]],\"locals\":[]},{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"welcome-info\"],[\"flush-element\"],[\"text\",\"\\n  Hello and Welcome to Festival Fanatic!\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"sub-welcome-info\"],[\"flush-element\"],[\"text\",\"\\n    Festival Fanatic is an application used track your experiences with events that you've already been to and plan ahead for upcoming events.\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n    While you don't HAVE to sign-in to view others' festival experiences, if you'd like to use Festival Fanatic to it's full potential, you have to create an account and sign in!  \"],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"sign-up\"],null,2],[\"open-element\",\"br\",[]],[\"flush-element\"],[\"close-element\"],[\"text\",\"\\n      \"],[\"block\",[\"link-to\"],[\"sign-in\"],null,1],[\"text\",\"\\n  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[],\"locals\":[]},{\"statements\":[[\"text\",\"Sign In\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Sign Up\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"sign-up\"],null,6],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"sign-in\"],null,5],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Change Password\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"change-password\"],null,8],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"open-element\",\"a\",[]],[\"static-attr\",\"href\",\"#\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"signOut\"]],[\"flush-element\"],[\"text\",\"Sign Out\"],[\"close-element\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Festivals\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"festivals\"],null,10],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Festivals\"]],\"locals\":[]},{\"statements\":[[\"text\",\"Users\"]],\"locals\":[]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"users\"],null,13],[\"close-element\"],[\"text\",\"\\n        \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"block\",[\"link-to\"],[\"festivals\"],null,12],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/my-application/template.hbs" } });
});
define('festival-fanatic/components/navbar-header/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['navbar-header']
  });
});
define("festival-fanatic/components/navbar-header/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Rr8Yfz6U", "block": "{\"statements\":[[\"append\",[\"unknown\",[\"hamburger-menu\"]],false],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"application\"],[[\"class\"],[\"navbar-brand\"]],0],[\"text\",\"\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"Home\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/navbar-header/template.hbs" } });
});
define('festival-fanatic/components/password-confirmation-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("festival-fanatic/components/password-confirmation-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "bNVpLF58", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"password-confirmation\"],[\"flush-element\"],[\"text\",\"Password Confirmation\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"password\",\"password-confirmation\",\"Password Confirmation\",[\"get\",[\"password\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/password-confirmation-input/template.hbs" } });
});
define('festival-fanatic/components/password-input/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'div',
    classNames: ['form-group']
  });
});
define("festival-fanatic/components/password-input/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "jdcwhjAU", "block": "{\"statements\":[[\"open-element\",\"label\",[]],[\"static-attr\",\"for\",\"kind\"],[\"flush-element\"],[\"text\",\"Password\"],[\"close-element\"],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"input\"],null,[[\"type\",\"id\",\"placeholder\",\"value\"],[\"password\",\"password\",\"Password\",[\"get\",[\"password\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/password-input/template.hbs" } });
});
define('festival-fanatic/components/sign-in-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('credentials'));
      },

      reset: function reset() {
        this.set('credentials', {});
      }
    }
  });
});
define("festival-fanatic/components/sign-in-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Wp3tnk8v", "block": "{\"statements\":[[\"append\",[\"helper\",[\"email-input\"],null,[[\"email\"],[[\"get\",[\"credentials\",\"email\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"password\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Sign In\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default cancel-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/sign-in-form/template.hbs" } });
});
define('festival-fanatic/components/sign-up-form/component', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Component.extend({
    tagName: 'form',
    classNames: ['form-horizontal'],

    credentials: {},

    actions: {
      submit: function submit() {
        this.sendAction('submit', this.get('credentials'));
      },

      reset: function reset() {
        this.set('credentials', {});
      }
    }
  });
});
define("festival-fanatic/components/sign-up-form/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "liiAumNo", "block": "{\"statements\":[[\"append\",[\"helper\",[\"email-input\"],null,[[\"email\"],[[\"get\",[\"credentials\",\"email\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"password\"]]]]],false],[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"password-confirmation-input\"],null,[[\"password\"],[[\"get\",[\"credentials\",\"passwordConfirmation\"]]]]],false],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"type\",\"submit\"],[\"static-attr\",\"class\",\"btn btn-primary\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"submit\"]],[\"flush-element\"],[\"text\",\"\\n  Sign Up\\n\"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-default cancel-btn\"],[\"modifier\",[\"action\"],[[\"get\",[null]],\"reset\"]],[\"flush-element\"],[\"text\",\"\\n  Cancel\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/components/sign-up-form/template.hbs" } });
});
define('festival-fanatic/controllers/array', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('festival-fanatic/controllers/object', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Controller;
});
define('festival-fanatic/festival/edit/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('festival', params.festival_id);
    },
    actions: {
      createFestival: function createFestival(festival) {
        festival.save();
        this.transitionTo('festivals');
      },
      cancelCreateFestival: function cancelCreateFestival(festival) {
        festival.rollbackAttributes();
        this.transitionTo('festivals');
      }
    }
  });
});
define("festival-fanatic/festival/edit/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "z2Ep0mZG", "block": "{\"statements\":[[\"append\",[\"helper\",[\"festival-list/edit\"],null,[[\"festival\",\"save\",\"cancel\"],[[\"get\",[\"model\"]],\"createFestival\",\"cancelCreateFestival\"]]],false],[\"text\",\"\\n\\n\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festival/edit/template.hbs" } });
});
define('festival-fanatic/festival/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    title: _emberData['default'].attr('string'),
    description: _emberData['default'].attr('string'),
    genre: _emberData['default'].attr('string'),
    location: _emberData['default'].attr('string'),
    venue: _emberData['default'].attr('string'),
    url: _emberData['default'].attr('string'),
    date: _emberData['default'].attr('string'),
    price: _emberData['default'].attr('number'),
    hidden: _emberData['default'].attr('boolean'),
    comment: _emberData['default'].attr('string'),
    editable: _emberData['default'].attr('boolean')
  });
});
// items: DS.hasMany('item'),
define('festival-fanatic/festival/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('festival', params.festival_id);
    },
    actions: {
      deleteFestival: function deleteFestival(festival) {
        festival.destroyRecord();
        this.transitionTo('festivals');
      }
    }
  });
});
define("festival-fanatic/festival/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "YP0PTs0s", "block": "{\"statements\":[[\"append\",[\"helper\",[\"festival-list/view\"],null,[[\"festival\",\"delete\"],[[\"get\",[\"model\"]],\"deleteFestival\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festival/template.hbs" } });
});
define('festival-fanatic/festival/view/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('festival', params.festival_id);
    },
    actions: {
      'delete': function _delete() {
        this.sendAction('delete', this.get('festival'));
      }
    }
  });
});
define("festival-fanatic/festival/view/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "H5RyGrYV", "block": "{\"statements\":[[\"append\",[\"helper\",[\"festival-list/view\"],null,[[\"festival\",\"delete\"],[[\"get\",[\"model\"]],\"deleteFestival\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festival/view/template.hbs" } });
});
define('festival-fanatic/festivals/new/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').createRecord('festival', {});
    },
    actions: {
      createFestival: function createFestival(festival) {
        // let jpg = "jpg";
        // let png = "png";
        // let gif = "gif";
        // let split = function(string) {
        //
        // }
        //
        // let extensionString = festival.url.split('.').pop();
        //   if (extensionString === jpg) {
        //   }
        //   else if (extensionString === png) {
        //   }
        //   else if (extensionString === gif) {
        //   }
        //   else {
        //       alert("It appears that the URL you've tried to upload to the database is not an image URL or the URL uses an extension that is not accepted by this application. All URLs entered into the field MUST end with '.jpg', '.png', or '.gif' and must not have any character after the file extension.");
        //       return;
        //   }
        festival.save();
        this.transitionTo('festivals');
      },
      cancelCreateFestival: function cancelCreateFestival(festival) {
        festival.rollbackAttributes();
        this.transitionTo('festivals');
      }
    }
  });
});
// festivals/new/template
define("festival-fanatic/festivals/new/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "rJHMlKuf", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"festival-list/edit\"],null,[[\"festival\",\"save\",\"cancel\"],[[\"get\",[\"model\"]],\"createFestival\",\"cancelCreateFestival\"]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festivals/new/template.hbs" } });
});
define('festival-fanatic/festivals/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('festival');
    },
    actions: {
      deleteFestival: function deleteFestival(festival) {
        festival.destroyRecord();
      }
    }
  });
});
define("festival-fanatic/festivals/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "PgBmDIXC", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"main-background\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"static-attr\",\"class\",\"static-title\"],[\"flush-element\"],[\"text\",\"Festival Fanatic\"],[\"close-element\"],[\"text\",\"\\n\\n    \"],[\"open-element\",\"div\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"link-to\"],[\"festivals/new\"],null,1],[\"text\",\"    \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"text\",\"\\n  \"],[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"festivals-footer\"],[\"flush-element\"],[\"text\",\"\\n    And  Many  Miles  to  Go  Before  I  Sleep.....\\n  \"],[\"close-element\"],[\"text\",\"\\n\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"append\",[\"helper\",[\"festival-list\"],null,[[\"festival\",\"editFestival\",\"delete\"],[[\"get\",[\"festival\"]],\"editFestival\",\"deleteFestival\"]]],false],[\"text\",\"\\n\"]],\"locals\":[\"festival\"]},{\"statements\":[[\"text\",\"        \"],[\"open-element\",\"button\",[]],[\"static-attr\",\"class\",\"btn btn-primary post-festival-btn\"],[\"flush-element\"],[\"text\",\"Click Here to Add a Festival\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festivals/template.hbs" } });
});
define('festival-fanatic/festivals/view/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model(params) {
      return this.get('store').findRecord('festival', params.festival_id);
    }
  });
});
// festivals/view/route
define("festival-fanatic/festivals/view/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "fyrWqETt", "block": "{\"statements\":[[\"text\",\"\\n\"],[\"append\",[\"helper\",[\"festival-list/view\"],null,[[\"festival\"],[[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/festivals/view/template.hbs" } });
});
define('festival-fanatic/flash/object', ['exports', 'ember-cli-flash/flash/object'], function (exports, _emberCliFlashFlashObject) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashFlashObject['default'];
    }
  });
});
define('festival-fanatic/helpers/app-version', ['exports', 'ember', 'festival-fanatic/config/environment'], function (exports, _ember, _festivalFanaticConfigEnvironment) {
  exports.appVersion = appVersion;
  var version = _festivalFanaticConfigEnvironment['default'].APP.version;

  function appVersion() {
    return version;
  }

  exports['default'] = _ember['default'].Helper.helper(appVersion);
});
define('festival-fanatic/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _emberInflectorLibHelpersPluralize) {
  exports['default'] = _emberInflectorLibHelpersPluralize['default'];
});
define('festival-fanatic/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _emberInflectorLibHelpersSingularize) {
  exports['default'] = _emberInflectorLibHelpersSingularize['default'];
});
define("festival-fanatic/initializers/active-model-adapter", ["exports", "active-model-adapter", "active-model-adapter/active-model-serializer"], function (exports, _activeModelAdapter, _activeModelAdapterActiveModelSerializer) {
  exports["default"] = {
    name: 'active-model-adapter',
    initialize: function initialize() {
      var application = arguments[1] || arguments[0];
      application.register('adapter:-active-model', _activeModelAdapter["default"]);
      application.register('serializer:-active-model', _activeModelAdapterActiveModelSerializer["default"]);
    }
  };
});
define('festival-fanatic/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'festival-fanatic/config/environment'], function (exports, _emberCliAppVersionInitializerFactory, _festivalFanaticConfigEnvironment) {
  var _config$APP = _festivalFanaticConfigEnvironment['default'].APP;
  var name = _config$APP.name;
  var version = _config$APP.version;
  exports['default'] = {
    name: 'App Version',
    initialize: (0, _emberCliAppVersionInitializerFactory['default'])(name, version)
  };
});
define('festival-fanatic/initializers/container-debug-adapter', ['exports', 'ember-resolver/container-debug-adapter'], function (exports, _emberResolverContainerDebugAdapter) {
  exports['default'] = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _emberResolverContainerDebugAdapter['default']);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('festival-fanatic/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `data-adapter` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('festival-fanatic/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/-private/core'], function (exports, _emberDataSetupContainer, _emberDataPrivateCore) {

  /*
  
    This code initializes Ember-Data onto an Ember application.
  
    If an Ember.js developer defines a subclass of DS.Store on their application,
    as `App.StoreService` (or via a module system that resolves to `service:store`)
    this code will automatically instantiate it and make it available on the
    router.
  
    Additionally, after an application's controllers have been injected, they will
    each have the store made available to them.
  
    For example, imagine an Ember.js application with the following classes:
  
    App.StoreService = DS.Store.extend({
      adapter: 'custom'
    });
  
    App.PostsController = Ember.Controller.extend({
      // ...
    });
  
    When the application is initialized, `App.ApplicationStore` will automatically be
    instantiated, and the instance of `App.PostsController` will have its `store`
    property set to that instance.
  
    Note that this code will only be run if the `ember-application` package is
    loaded. If Ember Data is being used in an environment other than a
    typical application (e.g., node.js where only `ember-runtime` is available),
    this code will be ignored.
  */

  exports['default'] = {
    name: 'ember-data',
    initialize: _emberDataSetupContainer['default']
  };
});
define('festival-fanatic/initializers/export-application-global', ['exports', 'ember', 'festival-fanatic/config/environment'], function (exports, _ember, _festivalFanaticConfigEnvironment) {
  exports.initialize = initialize;

  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_festivalFanaticConfigEnvironment['default'].exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _festivalFanaticConfigEnvironment['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember['default'].String.classify(_festivalFanaticConfigEnvironment['default'].modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('festival-fanatic/initializers/flash-messages', ['exports', 'ember', 'festival-fanatic/config/environment'], function (exports, _ember, _festivalFanaticConfigEnvironment) {
  exports.initialize = initialize;
  var deprecate = _ember['default'].deprecate;

  var merge = _ember['default'].assign || _ember['default'].merge;
  var INJECTION_FACTORIES_DEPRECATION_MESSAGE = '[ember-cli-flash] Future versions of ember-cli-flash will no longer inject the service automatically. Instead, you should explicitly inject it into your Route, Controller or Component with `Ember.inject.service`.';
  var addonDefaults = {
    timeout: 3000,
    extendedTimeout: 0,
    priority: 100,
    sticky: false,
    showProgress: false,
    type: 'info',
    types: ['success', 'info', 'warning', 'danger', 'alert', 'secondary'],
    injectionFactories: ['route', 'controller', 'view', 'component'],
    preventDuplicates: false
  };

  function initialize() {
    var application = arguments[1] || arguments[0];

    var _ref = _festivalFanaticConfigEnvironment['default'] || {};

    var flashMessageDefaults = _ref.flashMessageDefaults;

    var _ref2 = flashMessageDefaults || [];

    var injectionFactories = _ref2.injectionFactories;

    var options = merge(addonDefaults, flashMessageDefaults);
    var shouldShowDeprecation = !(injectionFactories && injectionFactories.length);

    application.register('config:flash-messages', options, { instantiate: false });
    application.inject('service:flash-messages', 'flashMessageDefaults', 'config:flash-messages');

    deprecate(INJECTION_FACTORIES_DEPRECATION_MESSAGE, shouldShowDeprecation, {
      id: 'ember-cli-flash.deprecate-injection-factories',
      until: '2.0.0'
    });

    options.injectionFactories.forEach(function (factory) {
      application.inject(factory, 'flashMessages', 'service:flash-messages');
    });
  }

  exports['default'] = {
    name: 'flash-messages',
    initialize: initialize
  };
});
define('festival-fanatic/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `injectStore` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('festival-fanatic/initializers/local-storage-adapter', ['exports', 'ember-local-storage/initializers/local-storage-adapter'], function (exports, _emberLocalStorageInitializersLocalStorageAdapter) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter['default'];
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function get() {
      return _emberLocalStorageInitializersLocalStorageAdapter.initialize;
    }
  });
});
define('festival-fanatic/initializers/store', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `store` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('festival-fanatic/initializers/text-field', ['exports', 'ember'], function (exports, _ember) {
  exports.initialize = initialize;

  function initialize() {
    _ember['default'].TextField.reopen({
      classNames: ['form-control']
    });
  }

  exports['default'] = {
    name: 'text-field',
    initialize: initialize
  };
});
define('festival-fanatic/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {

  /*
    This initializer is here to keep backwards compatibility with code depending
    on the `transforms` initializer (before Ember Data was an addon).
  
    Should be removed for Ember Data 3.x
  */

  exports['default'] = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("festival-fanatic/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _emberDataPrivateInstanceInitializersInitializeStoreService) {
  exports["default"] = {
    name: "ember-data",
    initialize: _emberDataPrivateInstanceInitializersInitializeStoreService["default"]
  };
});
define('festival-fanatic/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  exports['default'] = _emberResolver['default'];
});
define('festival-fanatic/router', ['exports', 'ember', 'festival-fanatic/config/environment'], function (exports, _ember, _festivalFanaticConfigEnvironment) {

  var Router = _ember['default'].Router.extend({
    location: _festivalFanaticConfigEnvironment['default'].locationType
  });

  Router.map(function () {
    this.route('sign-up');
    this.route('sign-in');
    this.route('change-password');
    this.route('users');
    this.route('festivals');
    this.route('festivals/new');
    this.route('festivals/view', { path: 'festivals/:festival_id/view' });
    this.route('festival', { path: 'festival/:festival_id/view' }, function () {
      this.route('edit');
    });
    this.route('festival/edit', { path: 'festival/:festival_id/edit' });
  });

  exports['default'] = Router;
});
define('festival-fanatic/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _emberAjaxServicesAjax) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberAjaxServicesAjax['default'];
    }
  });
});
define('festival-fanatic/services/flash-messages', ['exports', 'ember-cli-flash/services/flash-messages'], function (exports, _emberCliFlashServicesFlashMessages) {
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function get() {
      return _emberCliFlashServicesFlashMessages['default'];
    }
  });
});
define('festival-fanatic/sign-in/route', ['exports', 'ember', 'rsvp'], function (exports, _ember, _rsvp) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    model: function model() {
      return _rsvp['default'].Promise.resolve({});
    },

    actions: {
      signIn: function signIn(credentials) {
        var _this = this;

        return this.get('auth').signIn(credentials).then(function () {
          return _this.transitionTo('festivals');
        }).then(function () {
          return _this.get('flashMessages').success('Thanks for signing in!');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("festival-fanatic/sign-in/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "JfxgVvUd", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"not-logged-in\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Sign In\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"helper\",[\"sign-in-form\"],null,[[\"submit\",\"reset\",\"credentials\"],[\"signIn\",\"reset\",[\"get\",[\"model\"]]]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/sign-in/template.hbs" } });
});
define('festival-fanatic/sign-up/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    auth: _ember['default'].inject.service(),
    flashMessages: _ember['default'].inject.service(),

    actions: {
      signUp: function signUp(credentials) {
        var _this = this;

        this.get('auth').signUp(credentials).then(function () {
          return _this.get('auth').signIn(credentials);
        }).then(function () {
          return _this.transitionTo('application');
        }).then(function () {
          _this.get('flashMessages').success('Successfully signed-up! You have also been signed-in.');
        })['catch'](function () {
          _this.get('flashMessages').danger('There was a problem. Please try again.');
        });
      }
    }
  });
});
define("festival-fanatic/sign-up/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "GwPk7eqT", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"not-logged-in\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Sign Up\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"append\",[\"helper\",[\"sign-up-form\"],null,[[\"submit\"],[\"signUp\"]]],false],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/sign-up/template.hbs" } });
});
define('festival-fanatic/user/model', ['exports', 'ember-data'], function (exports, _emberData) {
  exports['default'] = _emberData['default'].Model.extend({
    email: _emberData['default'].attr('string')
  });
});
define('festival-fanatic/users/route', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = _ember['default'].Route.extend({
    model: function model() {
      return this.get('store').findAll('user');
    }
  });
});
define("festival-fanatic/users/template", ["exports"], function (exports) {
  exports["default"] = Ember.HTMLBars.template({ "id": "Oe0lyR/8", "block": "{\"statements\":[[\"open-element\",\"div\",[]],[\"static-attr\",\"class\",\"users-page\"],[\"flush-element\"],[\"text\",\"\\n  \"],[\"open-element\",\"h2\",[]],[\"flush-element\"],[\"text\",\"Users\"],[\"close-element\"],[\"text\",\"\\n\\n  \"],[\"open-element\",\"ul\",[]],[\"flush-element\"],[\"text\",\"\\n\"],[\"block\",[\"each\"],[[\"get\",[\"model\"]]],null,0],[\"text\",\"  \"],[\"close-element\"],[\"text\",\"\\n\"],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"blocks\":[{\"statements\":[[\"text\",\"    \"],[\"open-element\",\"li\",[]],[\"flush-element\"],[\"append\",[\"unknown\",[\"user\",\"email\"]],false],[\"close-element\"],[\"text\",\"\\n\"]],\"locals\":[\"user\"]}],\"hasPartials\":false}", "meta": { "moduleName": "festival-fanatic/users/template.hbs" } });
});
/* jshint ignore:start */



/* jshint ignore:end */

/* jshint ignore:start */

define('festival-fanatic/config/environment', ['ember'], function(Ember) {
  var prefix = 'festival-fanatic';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

/* jshint ignore:end */

/* jshint ignore:start */

if (!runningTests) {
  require("festival-fanatic/app")["default"].create({"name":"festival-fanatic","version":"0.0.0+d4b18ff2"});
}

/* jshint ignore:end */
//# sourceMappingURL=festival-fanatic.map
