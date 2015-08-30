express = require 'express'
router = express.Router()
c = require('child_process')
through = require 'through2'
# GET users listing.
router.get '/', (req, res) ->
	check_top = c.execSync "top -h"
	tData = check_top.toString().replace /(?:\r\n|\r|\n|\t\t)/g, ""
	console.log tData
	if tData.indexOf "-l <samples>" > -1
		sample = "-l1"
	else if tData.indexOf "-n max" > -1
		sample = "-n1"
	if !sample? or sample == '' then return console.log "no valid top"
	console.log "sample is #{sample}"
	actual_top = c.exec "top -n 20 #{sample}"
	# res.setHeader "Content-Type", "text/html"
	actual_top.stdout.pipe(res)

module.exports = router
