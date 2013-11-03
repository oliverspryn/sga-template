/**
 * Minimalist template splash section controller class
 *
 * This class controls all of the essential features and logic of the
 * splash section on the home page of the minimalist template. A high
 * level overview of its duties include:
 * - preloading and transitioning background images into view
 * - transitioning between different states using either the jewels
 *   or the navigation arrows
 * - conditionally showing or hiding the content toggle button as the
 *   size of the screen changes and whether or not the current state
 *   has any additional content to display
 * - showing or hiding additional content as the toggle button is 
 *   pressed
 *
 * @author    Oliver Spryn
 * @copyright Copyright (c) 2013 and Onwards, ForwardFour Innovations
 * @license   MIT
 * @package   includes
 * @since     v2.0 Dev
*/

function Splash() {
//Configuration
	this.mobile = 650;
	this.tablet = 980;
	
//Frequently references jQuery objects
	this.splash = $('section#splash');
	this.ads = this.splash.find('div.ad-container div.ad-contents ul');
	this.adContainer = this.splash.find('div.ad-container');
	this.adContents = this.splash.find('div.ad-container div.ad-contents');
	this.button = this.splash.children('div.button');
	this.contentOpen = false;
	this.jewels = this.splash.children('ul.jewels');
	this.mode = 'desktop';
	this.social = $('article#social');
	this.window = $(window);
	
//Internal reference
	this.images = [];
	
//Start up the splash display
	var reference = this;
	
	setTimeout(function() {
		reference.init();
	}, 1000);
	
	this.displayButton();
	this.jewelNav();
	this.arrowNav();
	this.toggleContents();
	
//Check if the window goes into tablet mode as it resizes	
    $(window).resize(function() {
        reference.displayButton();
		reference.adjustMeasurements();
    });
}

/**
 * Preload the splash background image and transition the currently
 * selected advertisement into view. This method will also store
 * the URLs of all of the background images for future usage.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.init = function() {
	var reference = this;
	
	this.jewels.children('li').each(function(index, value) {
		var tab = $(this);
		var img = new Image();
		img.src = tab.attr('data-background');
		
	//Push the URL onto the image array from this class
		reference.images.push(img.src);
		
	//Preload the image
		img.onload = function() {
			if (tab.hasClass('active')) {
				reference.adContainer.css('background-image', 'url(' + img.src + ')').children('div').addClass('show-background');
			}
		};
	});
};

/**
 * Listen for jewel clicks to navigate between different states.
 * 
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.jewelNav = function() {
	var reference = this;
	
	this.jewels.children('li').click(function() {
		var item = $(this);
		
	//Don't perform the transition between the same states
		if (!item.hasClass('active')) {
			reference.adContents.addClass('transition');
			
		//Wait for the CSS3 transitions to finish
			setTimeout(function() {
			//Transition the jewels
				item.siblings('li').removeClass('active');
				item.addClass('active');
				
			//Transition the splash background
				reference.adContainer.removeAttr('style').css('background-image', 'url(' + item.attr('data-background') + ')')
				reference.adContents.removeClass('transition');
				
			//Transition the splash content
				reference.adContents.find('ul li.active').removeClass('active');
				reference.adContents.find('ul li').eq(item.index()).addClass('active');
			}, 250);
		}
	});
};
	
/**
 * Listen for navigation arrow clicks to navigate between different
 * states.
 * 
 * @access public
 * @return void
 * @since  v1.0 Dev
*/
	
Splash.prototype.arrowNav = function() {
	var reference = this;
	
	this.splash.children('span.nav').click(function() {
        var trigger = $(this);
        var index = reference.jewels.children('li.active').index();
        
    //Determine the index of the desired splash image
        if (trigger.hasClass('right')) {			
		//If the active jewel is not the last one, then set the index equal to the the next one
            if (index < reference.jewels.children('li').length - 1) {
                index++;
            } else {
                index = 0;
            }
        } else {
		//If the active jewel is not the first one, then set the index equal to the previous one
            if (reference.jewels.children('li.active').index() > 0) {
                index--;
            } else {
                index = reference.jewels.children('li:last').index();
            }
        }
        
        reference.adContents.addClass('transition');
        
    //Wait for the CSS3 transitions to finish
        setTimeout(function() {
        //Transition the jewels
            reference.jewels.children('li.active').removeClass('active');
            reference.jewels.children('li').eq(index).addClass('active');
            
        //Transition the splash background
            reference.adContainer.removeAttr('style').css('background-image', 'url(' + reference.images[index] + ')')
            reference.adContents.removeClass('transition');
            
        //Transition the splash content
            reference.adContents.find('ul li.active').removeClass('active');
            reference.adContents.find('ul li').eq(index).addClass('active');
            
        //If this is in tablet or mobile mode, make sure all content has been collapsed
			reference.resetDisplay();
            reference.displayButton();
        }, 250);
    });
};

/**
 * This method is the event handler for appearance of the content
 * toggle button. Depending on the size of the window and contents
 * of the currently displaying advertisement, this function will
 * determine whether or not the content toggle button should show, 
 * will call the appropraite method, to show the button.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.displayButton = function() {
	var width = this.window.width();
	
//In mobile mode, the content toggle button will always be displayed
	if (width <= this.mobile) {
		this.mode != 'mobile' ? this.resetDisplay() : false; 
		this.mode = 'mobile';
		return; //CSS took care of this
	}
	
//In tablet mode, the content toggle button will only display if there is a second column on the current splash page
	if (width <= this.tablet) {
		this.mode != 'tablet' ? this.resetDisplay() : false; 
		this.mode = 'tablet';
		this.ads.find('li.active div.splash-right').length ? this.showButton() : this.hideButton();
	}
	
//In desktop mode, the content toggle button will always be hidden
	if (width > this.tablet) {
		this.mode = 'desktop';
		this.hideButton(); //resetDisplay() is called in here
	}
};

/**
 * This method will show the content toggle button.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.showButton = function() {
	this.button.addClass('show');
};

/**
 * This method will hide the content toggle button. It will also
 * call the instance method to reset the button and the contents
 * it was displaying.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.hideButton = function() {
	this.button.removeClass('show');
	this.resetDisplay();
};
	
/**
 * This method will toggle the contents of the currently isplaying
 * advertisement. If the window is in tablet mode, then only the 
 * second column will display (if there is one). If the  window is in
 * mobile mode, then all of the content will be displayed.
 *
 * Due to difficulties with CSS styling, the second column (if there
 * is one) will not be displayed, but rather have its contents copied
 * to the first column. resetDisplay() will remove these contents
 * when the display is reset.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/
	
Splash.prototype.toggleContents = function() {
	var reference = this;
	
	this.button.children('button').click(function() {
        var content = reference.ads.children('li.active');
        var target;
        
    //Mobile mode requires us to show all of the content
        if (reference.mode == 'mobile') {
            var height = 0;
            
            if (content.hasClass('show')) {
				reference.contentsOpen = false;
                reference.resetDisplay();
            } else {
				reference.contentsOpen = true;
				var right = content.find('div.splash-right');
			
			//Copy the right column onto the left
				if (right.length) {
					reference.ads.find('li.active div.splash-left').append('<div class="delete-me">' + right.html() + '</div>');
				}
				
                content.addClass('show');
                height = content.children('div:first').height();
                
                reference.button.css('top', (100 + height - 18 + 20) + 'px').children('button').text('Show Less'); //100px = ad container, 20px padding
                reference.social.css('margin-top', height + 20 + 'px'); //20px padding
            }
        }
        
    //Tablet mode will only require us to show the right-side column
        if (reference.mode == 'tablet') {
            target = content.children('div.splash-right');
            
            if (target.hasClass('show')) {
				reference.contentsOpen = false;
				reference.resetDisplay();
            } else {
				reference.contentsOpen = true;
                target.addClass('show');
                reference.button.css('top', (500 + target.height() - 18 + 20) + 'px').children('button').text('Show Less'); //500px = ad container, 20px padding
                reference.social.css('margin-top', target.height() + 'px');
            }
        }
    });
};
	
/**
 * This method will check to see if the expanded contents have been
 * opened. Each time the window resize event occurs, this method will
 * remeasure the content which has been placed using calculated values,
 * so that as the window changes size, then contents remain in their
 * proper places.
 *
 * The items this method will adjust include:
 *  - the location of the content toggle button
 *  - the padding on top of the social networking section
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/
	
Splash.prototype.adjustMeasurements = function() {
	if (this.contentsOpen) {
		var height;
		
		if (this.mode == 'tablet') {
			height = this.ads.find('li.active div:last').height();
			
			this.button.css('top', (500 + height - 18 + 20) + 'px');
			this.social.css('margin-top', height + 'px');
		} else {
			height = this.ads.find('li.active div:first').height();
			
			this.button.css('top', (100 + height - 18 + 20) + 'px');
			this.social.css('margin-top', height + 20 + 'px');
		}
		
	}
};

/**
 * This method will hide all items the "Show Button" was displaying,
 * reset the text of the button, and slide the contents of the 
 * social networking section back up to its original location.
 *
 * @access public
 * @return void
 * @since  v1.0 Dev
*/

Splash.prototype.resetDisplay = function() {
	this.adContents.find('.show').removeClass('show');                    //Hide items which should be hidden, but had the "show" class
	this.adContents.find('div.delete-me').remove();                       //Delete content from column two when was copied to column one
	this.button.removeAttr('style').children('button').text('Show More'); //Reset the expand button
	this.social.removeAttr('style');                                      //Remove the extra space appled to the social block
	this.contentsOpen = false;                                            //The expanded contents have been closed
};