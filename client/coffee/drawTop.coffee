"use strict"
class DrawTop
	@topUrl = '/top'
	@time
	constructor: (root, time)->
		@time = time
		@root = root
		@pendingUpdate = false
	updateContent: =>
		if !@pendingUpdate and @root?
			@pendingUpdate = true
			$.ajax
				url: DrawTop.topUrl,
				success: (data) =>
					@root.html data
					@pendingUpdate = false
					@startTimer()
					return
				error: (xhr, opts, e) =>
					console.log e
					return
		else
			console.log "pendingUpdate is true"
			@stopTimer()
			@startTimer()
	startTimer: (time) ->
		if time? then @time = time
		return @timer = setTimeout @updateContent, if @time? then @time else 10 * 1000
	stopTimer: ->
		if @timer?
			clearTimeout @timer

window.DrawTop = DrawTop