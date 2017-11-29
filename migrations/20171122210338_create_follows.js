
exports.up = function(knex, Promise) {
     return knex.schema.createTableIfNotExists('follows', function(table) {
          table.increments('id').primary();
          table.integer('user_id').references('id').inTable('users').onDelete('cascade');
          table.integer('post_id').references('id').inTable('posts').onDelete('cascade');
     });
};

exports.down = function(knex, Promise) {
     return knex.schema.dropTableIfExists('follows');
};
