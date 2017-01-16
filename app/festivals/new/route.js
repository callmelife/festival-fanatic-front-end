import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.get('store').createRecord('festival', {});
  },
  actions: {
    createFestival (festival) {
      console.log("Insde festivals/new route createFestival");
      festival.save();
    },
    cancelCreateFestival (festival) {
      festival.rollbackAttributes();
      console.log("Insde festivals/new route cancelCreateFestival");
    },
  },
});
