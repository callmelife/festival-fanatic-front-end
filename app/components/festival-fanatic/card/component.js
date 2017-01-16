import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    editFestival () {
      console.log("You're insdie editFestival in the festival-fanatic/card component");
      console.log("The festival I'm clicking edit on is: ", this.get('festival'));
      this.sendAction('editFestival', this.get('festival'));
    },
    delete () {
      this.sendAction('delete', this.get('festival'));
    },
  },
});
