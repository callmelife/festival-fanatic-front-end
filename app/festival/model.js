import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  genre: DS.attr('string'),
  location: DS.attr('string'),
  venue: DS.attr('string'),
  url: DS.attr('string'),
  date: DS.attr('string'),
  price: DS.attr('number'),
  hidden: DS.attr('boolean'),
  comment: DS.attr('string'),
  editable: DS.attr('boolean'),
  // items: DS.hasMany('item'),
});
