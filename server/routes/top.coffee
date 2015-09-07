express = require 'express'
router = express.Router()
c = require 'child_process'

# GET users listing.
router.get '/', (req, res) ->
	procs = 15
	check_top = c.execSync "top -h"
	tData = "" + check_top.toString().replace /(?:\r\n|\r|\n|\t\t)/g, ""
	# console.log tData + "\n"
	if tData.indexOf("-n max") > -1
		# Linux
		cmd = "top -b -n1"
	else if tData.indexOf("-l <samples>") > -1
		# Mac OS
		cmd = "top -n #{procs} -l1"
	if !cmd? or cmd == '' then return console.log "no valid top"
	# console.log "cmd is #{cmd}"
	actual_top = c.exec cmd
	# res.setHeader "Content-Type", "text/html"
	actual_top.stdout.pipe(res)

module.exports = router
