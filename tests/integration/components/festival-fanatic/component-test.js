import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('festival-fanatic', 'Integration | Component | festival fanatic', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{festival-fanatic}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#festival-fanatic}}
      template block text
    {{/festival-fanatic}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
