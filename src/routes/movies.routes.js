const { Router } = require('express')

const MoviesNotesController = require('../controllers/MoviesNotesController')

const moviesRoutes = Router()

const moviesController = new MoviesNotesController()

moviesRoutes.get('/', moviesController.index)
moviesRoutes.post('/:user_id', moviesController.create)
moviesRoutes.get('/:id', moviesController.show)
moviesRoutes.delete('/:id', moviesController.delete)

module.exports = moviesRoutes
