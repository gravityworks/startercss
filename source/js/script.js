'use strict';

/*
 * !!! Change this for Drupal ¡¡¡
 * Any script file in a Drupal theme, like Basic, should have the functions you need
 */
(function($) {
  $(document).ready(function(){

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
