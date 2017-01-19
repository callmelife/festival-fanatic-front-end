import AjaxService from 'ember-ajax/services/ajax';
import ENV from 'festival-fanatic/config/environment';

import Ember from 'ember';


export default AjaxService.extend({
  host: ENV.apiHost,

  auth: Ember.inject.service(),
  headers: Ember.computed('auth.credentials.token', {
    get () {
      let headers = {};
      const token = this.get('auth.credentials.token');
      if (token) {
        headers.Authorization = `Token token=${token}`;
      }

      return headers;
    },
  }),
});
