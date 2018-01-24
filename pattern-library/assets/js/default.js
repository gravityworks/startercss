(function($) {
  $(document).ready(function(){
        $('#sidebar-toggle').on('click', function (e) {
            $('body').toggleClass('sidebar-hidden');
        });
        // Add SVG to body
        $.ajax({
            url: "../assets/images/svg-symbols.svg",
            context: document.body
        }).done(function(data) {
            $('svg',data).attr('class','visually-hidden').prependTo('body');
        });
    });
})(jQuery);
