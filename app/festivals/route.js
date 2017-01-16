import Ember from 'ember';

export default Ember.Route.extend({
  model () {
    return this.get('store').findAll('festival');
  },
  actions: {
    deleteFestival (festival) {
      festival.destroyRecord();
    },
  },
});
