import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  genre: DS.attr('string'),
  location: DS.attr('string'),
  venue: DS.attr('string'),
  url: DS.attr('string'),
  price: DS.attr('number'),
  date: DS.attr('string'),
  comment: DS.attr('string'),
  hidden: DS.attr('boolean'),
  // items: DS.hasMany('item'),
});
