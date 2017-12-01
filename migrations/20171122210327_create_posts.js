exports.up = function(knex, Promise) {
     return knex.schema.createTableIfNotExists('posts', function(table) {
          table.increments('id').primary();
          table.string('time_posted');
          table.string('title').notNullable();
          table.text('text').defaultTo('See title');
          table.integer('rating').defaultTo(0);
          table.integer('board_id').references('id').inTable('boards').onDelete('cascade');
          table.integer('user_id').references('id').inTable('users').onDelete('cascade');
     });
};

exports.down = function(knex, Promise) {
     return knex.schema.dropTableIfExists('posts');
};
