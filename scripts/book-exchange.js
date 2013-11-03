(function($) {
	$(function() {
	//Initialize the exlpore plugin
		$('input#search-main').FFI_BE_Explore();
		
	//Scroll to the browse section of the page
		$('li.browse').click(function() {
			$('html, body').animate({
				 scrollTop: $('section.explore').offset().top + 1
			}, 500);
		});
		
	//Focus on the search text input control
		$('li.search').click(function() {
			$('input#search-main').focus();
		});
	});
})(jQuery);