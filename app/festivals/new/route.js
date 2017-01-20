// festivals/new/template

import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.get('store').createRecord('festival', {});
  },
  actions: {
    createFestival (festival) {
      festival.save();
      this.transitionTo('festivals');
    },
    cancelCreateFestival (festival) {
      festival.rollbackAttributes();
      this.transitionTo('festivals');
    },
  },
});
