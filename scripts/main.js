(function($) {
	$(function() {
	//Control the main page splash
		new Splash();
		
	//Control the navigation between calendar events with the tiles
		$('article#calendar ul.event-list li').click(function() {
			var link = $(this);
			var events = $('article#calendar ul.event-details');
			
			if (!link.hasClass('active')) {
				link.siblings('li').removeClass('active');
				link.addClass('active');
				events.children('li.active').removeClass('active');
				events.children('li').eq(link.index()).addClass('active');
			}
		});
		
	//Control the navigation between calendar events with the arrows
		$('article#calendar span.nav').click(function() {
			var arrow = $(this);
			var events = $('article#calendar ul.event-details');
			var links = $('article#calendar ul.event-list');
			var index = events.children('li.active').index();
			
		//Determine the index of the desired splash image
			if (arrow.hasClass('right')) {
			//If the active event is not the last one, then set the index equal to the the next one
				if (index < events.children('li').length - 1) {
					index++;
				} else {
					index = 0;
				}
			} else {
			//If the active event is not the first one, then set the index equal to the previous one
				if (events.children('li.active').index() > 0) {
					index--;
				} else {
					index = events.children('li:last').index();
				}
			}
			
		//Change the event and active tile
			events.children('li.active').removeClass('active');
			events.children('li').eq(index).addClass('active');
			links.children('li.active').removeClass('active');
			links.children('li').eq(index).addClass('active');
		});
		
	//Initialize the jQuery Twitter plugin
		$('article.twitter-post').tweet({
			'count' : 1,
			'username' : 'sgaatgcc'
		});
	});
})(jQuery)