import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('festival', params.festival_id);
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
