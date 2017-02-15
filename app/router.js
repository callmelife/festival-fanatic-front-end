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
  this.route('festivals/mine');
  this.route('festivals/new');
  this.route('festivals/genre');
  this.route('festivals/view', { path: 'festivals/:festival_id/view' });
  this.route('festival', { path: 'festival/:festival_id/view' }, function() {
    this.route('edit');
  });
  this.route('festival/edit', { path: 'festival/:festival_id/edit' });
  this.route('welcome');
  this.route('mine');
  this.route('genre');
  this.route('genre/rap');
  this.route('genre/country');
  this.route('genre/classic');
  this.route('genre/jazz');
  this.route('genre/edm');
  this.route('genre/rock');
  this.route('genre/jazz');

});

export default Router;
