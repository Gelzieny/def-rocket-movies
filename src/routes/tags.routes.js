const { Router } = require('express')

const MoviesTagsController = require('../controllers/MoviesTagsController')

const tagsRoutes = Router()

const tagsController = new MoviesTagsController()

tagsRoutes.get('/:user_id', tagsController.index)

module.exports = tagsRoutes
