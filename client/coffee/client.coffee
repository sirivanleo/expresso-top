"use strict"
(($) ->
	$ ->
		container = $('.top-content')
		topRenderer = new DrawTop container, 5 * 1000
		topRenderer.updateContent()
) jQuery

