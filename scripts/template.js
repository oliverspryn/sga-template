window.onload = function() {
	var nav = document.querySelectorAll('header#main nav ul li.current_page_item');
	var navItems = document.querySelectorAll('header#main nav ul li');
	var navList = nav[0].parentNode;
	
//Close the navigation menu
	document.onclick = function(e) {
		navList.className = '';
	}
		
//Apply the selected item class to an menu item when selected
	for (var i = 0; i < navItems.length; ++i) {
		navItems[i].onclick = function(e) {
			var target;
			
			if (e.target) { //W3C, Netscape, and the like
				target = e.target;
			} else { //Microsoft
				target = e.srcElement;
			}
			
			target.parentNode.className = 'current_page_item';
			nav[0].className = '';
		}
	}
	
//Open the navigation menu list
	nav[0].onclick = function(e) {
		if(navList.className == '') {
			navList.className = 'open';
		} else {
			navList.className = '';
		}
		
	//Don't follow the link
		e.preventDefault();
		e.stopPropagation();
		return false;
	}
}