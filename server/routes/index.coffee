express = require 'express'
router = express.Router()

# GET home page.

router.get '/', (req, res) ->
	links = {
		'Downloads' : '/sab',
		'Movies' : '/movies'
		'TV' : '/tv',
		'Media' : '/web'
	}

	res.render 'index', { title: 'XbServ', links }

module.exports = router
