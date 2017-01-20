// festival-list/view/Component

import Ember from 'ember';

export default Ember.Component.extend({
  auth: Ember.inject.service(),
  user: Ember.computed.alias('auth.credentials.email'),
  isAuthenticated: Ember.computed.alias('auth.isAuthenticated'),
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

  model (params) {
    return this.get('store').findRecord('festival', params.festival_id);
  },
  actions: {
    delete () {
      this.sendAction('delete', this.get('festival'));
    },
  },
});
