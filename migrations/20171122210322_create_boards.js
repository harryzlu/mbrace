
exports.up = function(knex, Promise) {
     return knex.schema.createTableIfNotExists('boards', function(table) {
          table.increments('id').primary();
          table.string('name').unique().notNullable();
     });
};

exports.down = function(knex, Promise) {
     knex.schema.dropTableIfExists('boards');
};
