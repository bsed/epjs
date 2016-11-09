 
(function( $, undefined ){
	"use strict"
	
	var createPayBookGroup = function ( element, options ) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.createPayBookGroup.defaults, options);
	}
	
	createPayBookGroup.prototype = {
		constructor: createPayBookGroup,
		
		show_createPayBookGroup: function() {			
			$.openWindow({
				backdrop: true,
				allowClose: false,
				tranCode: 'createPayBookGroup',
				windowClass: 'createPayBookGroup-window',
				showFun: null,
				parentMVC: this.$element.data('currentMVC')
			});
		}
	}
	
	$.fn.createPayBookGroup = function ( option ) {
    	return this.each(function () {
			var $this = $(this), 
				data = $this.data('createPayBookGroup'), 
				options = typeof option == 'object' && option;
			if (!data)
				$this.data('createPayBookGroup', (data = new createPayBookGroup(this, options)));
			if (option == 'show') 
				data.show_createPayBookGroup();
		});
	}
	
	$.fn.createPayBookGroup.defaults = {
		
  	}

  	$.fn.createPayBookGroup.Constructor = createPayBookGroup;
  	
  	$(function () {
		$('body').on('click.createPayBookGroup.data-api', '[data-toggle^=createPayBookGroup]', function ( e ) {
			
			var $btn = $(e.target);
			
		  	$btn.createPayBookGroup('show');
		});
	})
  	
})(jQuery) 