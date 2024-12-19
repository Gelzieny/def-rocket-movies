exports.up = knex =>
  knex.schema.createTable('movie_tags', table => {
    table.increments('id')
    table
      .integer('note_id')
      .unsigned()
      .references('id')
      .inTable('movie_notes')
      .onDelete('CASCADE')
    table.string('name')
    table.integer('user_id').unsigned().references('id').inTable('users')
    table.timestamps()
  })

exports.down = knex => knex.schema.dropTable('movie_tags')
