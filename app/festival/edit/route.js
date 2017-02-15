import Ember from 'ember';

export default Ember.Route.extend({
  model (params) {
    return this.get('store').findRecord('festival', params.festival_id);
  },
  actions: {
    createFestival (festival) {

      let extensionString = festival.get('url').split('.').pop();
        if (extensionString === jpg) {
        }
        else if (extensionString === png) {
        }
        else if (extensionString === gif) {
        }
        else {
            this.get('flashMessages').warning("It appears that the URL you've tried to upload to the database is not an image URL or the URL uses an extension that is not accepted by this application. All URLs entered into the field MUST end with '.jpg', '.png', or '.gif' and must not have any character after the file extension.");
            return;
        }
      festival.save();
      this.transitionTo('festivals');
    },
    cancelCreateFestival (festival) {
      festival.rollbackAttributes();
      this.transitionTo('festivals');
    },
  },
});
