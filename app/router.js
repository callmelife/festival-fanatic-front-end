import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
});

Router.map(function () {
  this.route('sign-up');
  this.route('sign-in');
  this.route('change-password');
  this.route('users');
  this.route('festivals');
  this.route('festivals/new');
  this.route('festivals/view', { path: 'festivals/:festival_id/view' });
  this.route('festival', { path: 'festival/:festival_id/view' }, function() {
    this.route('edit');
  });
  this.route('festival/edit', { path: 'festival/:festival_id/edit' });
});

export default Router;
