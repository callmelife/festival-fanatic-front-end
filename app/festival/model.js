import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  location: DS.attr('string'),
  venue: DS.attr('string'),
  price: DS.attr('number'),
  genre: DS.attr('string'),
  url: DS.attr('string'),
  date: DS.attr('string'),
  comments: DS.attr(''),
});
