express = require 'express'
router = express.Router()

# GET home page.

router.get '/', (req, res) ->
	links = {
		'SabNzb' : '/sab',
		'Couchpotato' : '/movies'
		'Sonarr' : '/tv',
		'Plex' : '/web'
	}

	res.render 'index', { title: 'XbServ', links }

module.exports = router
