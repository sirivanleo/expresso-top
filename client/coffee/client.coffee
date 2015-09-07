"use strict"
(($) ->
	$ ->
		container = $('.top-content')
		topRenderer = new DrawTop container, 3 * 1000
		topRenderer.updateContent()
) jQuery

