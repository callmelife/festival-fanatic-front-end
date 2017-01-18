import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),

  actions: {
    save () {
      this.sendAction('save', this.get('festival'));
    },
    cancel () {
      this.sendAction('cancel', this.get('festival'));
    },
  },
});
