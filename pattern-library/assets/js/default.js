(function($) {
  $(document).ready(function(){
        // Add SVG to body
        $.ajax({
            url: "../assets/images/svg-symbols.svg",
            context: document.body
        }).done(function(data) {
            $('svg',data).attr('class','visually-hidden').prependTo('body');
        });
    });
})(jQuery);
