'use strict';

/*
 * !!! Change this for Drupal ¡¡¡
 * Any script file in a Drupal theme, like Basic, should have the functions you need
 */
(function($) {
  $(document).ready(function(){

  	console.log('the script file is here');

		// Get IE Version
		var version = detectIE();

		// import stylesheet for IE 11 and less
		if (version !== false && version <= 11) {
			$('head').append('<link rel="stylesheet" type="text/css" href="/sites/all/themes/raind/css/lte-ie11.css">');
		}

		// Detect IE
		// returns version of IE, or false if browser is not Internet Explorer
		function detectIE() {
			var ua = window.navigator.userAgent;

			var trident = ua.indexOf('Trident/');
			if (trident > 0) {
				// IE 11 => return version number
				var rv = ua.indexOf('rv:');
				return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
			}

			var edge = ua.indexOf('Edge/');
			if (edge > 0) {
				// Edge (IE 12+) => return version number
				return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
			}
			// other browser
			return false;
		}

		// Skip Nav with tabindex fix
		$(".skip-link").click(function(event){

			// strip the leading hash and declare
			// the content we're skipping to
			var skipTo="#"+this.href.split('#')[1];

			// Setting 'tabindex' to -1 takes an element out of normal
			// tab flow but allows it to be focused via javascript
			$(skipTo).attr('tabindex', -1).on('blur focusout', function () {

				// when focus leaves this element,
				// remove the tabindex attribute
				$(this).removeAttr('tabindex');

			}).focus(); // focus on the content container
		});

		// Add SVG to body
		$.ajax({
			// Update url as needed
			url: "/themes/themename/images/svg-symbols.svg",
			context: document.body
		}).done(function (data) {
			$('svg', data).attr('class', 'visually-hidden').prependTo('body');
		});

	});
})(jQuery);
