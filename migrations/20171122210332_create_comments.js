
exports.up = function(knex, Promise) {
     return knex.schema.createTableIfNotExists('comments', function(table) {
          table.increments('id').primary();
          table.string('time_posted');
          table.text('text').notNullable();
          table.integer('rating').defaultTo(0);
          table.integer('post_id').references('id').inTable('posts').onDelete('cascade');
          table.integer('user_id').references('id').inTable('users').onDelete('cascade');
     });
};

exports.down = function(knex, Promise) {
     return knex.schema.dropTableIfExists('comments');
};
