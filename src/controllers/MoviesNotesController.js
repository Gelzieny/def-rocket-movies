const knex = require('../database/knex')

class MoviesNotesController {
  async create(request, response) {
    const { title, description, rating, tags = [] } = request.body
    const { user_id } = request.params

    const [note_id] = await knex('movie_notes').insert({
      title,
      description,
      rating,
      user_id,
    })

    if (Array.isArray(tags) && tags.length > 0) {
      const existingTags = await knex('movie_tags')
        .whereIn('name', tags)
        .andWhere({ user_id })
        .select('name')

      const existingTagNames = existingTags.map(tag => tag.name)

      const newTags = tags.filter(tag => !existingTagNames.includes(tag))

      if (newTags.length > 0) {
        const tagsInsert = newTags.map(name => ({
          note_id,
          name,
          user_id,
        }))

        await knex('movie_tags').insert(tagsInsert)
        console.log('Novas tags inseridas:', tagsInsert)
      } else {
        console.log('Nenhuma nova tag para inserir.')
      }
    }

    return response.status(201).json({ message: 'Nota criada com sucesso!' })
  }

  async show(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()
    const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name')

    return response.json({ ...note, tags })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('movie_tags').where({ note_id: id }).delete()
    await knex('movie_notes').where({ id }).delete()

    return response.json({ message: 'Nota deletada com sucesso!' })
  }

  async index(request, response) {
    const { title = '', user_id, tags } = request.query

    let notes

    const decodedTags = tags ? decodeURIComponent(tags) : null

    if (decodedTags) {
      const filterTags = decodedTags.split(',').map(tag => tag.trim())

      notes = await knex('movie_tags')
        .select(['movie_notes.id', 'movie_notes.title', 'movie_notes.user_id'])
        .where('movie_notes.user_id', user_id)
        .whereLike('movie_notes.title', `%${title}%`)
        .whereIn('movie_tags.name', filterTags)
        .innerJoin('movie_notes', 'movie_notes.id', 'movie_tags.note_id')
        .orderBy('movie_notes.title')
    } else {
      notes = await knex('movie_notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')
    }

    const userTags = await knex('movie_tags').where({ user_id })

    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)
      return { ...note, tags: noteTags.map(tag => tag.name) }
    })

    return response.json(notesWithTags)
  }
}

module.exports = MoviesNotesController
