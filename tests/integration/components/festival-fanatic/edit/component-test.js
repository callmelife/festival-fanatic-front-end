import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('festival-fanatic/edit', 'Integration | Component | festival fanatic/edit', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{festival-fanatic/edit}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#festival-fanatic/edit}}
      template block text
    {{/festival-fanatic/edit}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
