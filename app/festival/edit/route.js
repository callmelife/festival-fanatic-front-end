import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('festival', params.festival_id);
  },
  actions: {
    saveFestival (festival) {
      console.log("You got to the festival/edit route. Your festival is ", festival);
      festival.save();
  },
  cancel (festival) {
    festival.rollbackAttributes();
    this.transitionTo('festivals');
    },
  },
});
