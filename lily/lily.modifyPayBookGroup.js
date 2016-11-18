 
(function( $, undefined ){
	"use strict"
	
	var modifyPayBookGroup = function ( element, options ) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.modifyPayBookGroup.defaults, options);
	}
	
	modifyPayBookGroup.prototype = {
		constructor: modifyPayBookGroup,
		
		show_modifyPayBookGroup: function() {			
			$.openWindow({
				backdrop: true,
				allowClose: false,
				tranCode: 'modifyPayBookGroup',
				windowClass: 'modifyPayBookGroup-window',
				showFun: null,
				parentMVC: this.$element.data('currentMVC')
			});
		}
	}
	
	$.fn.modifyPayBookGroup = function ( option ) {
    	return this.each(function () {
			var $this = $(this), 
				data = $this.data('modifyPayBookGroup'), 
				options = typeof option == 'object' && option;
			if (!data)
				$this.data('modifyPayBookGroup', (data = new modifyPayBookGroup(this, options)));
			if (option == 'show') 
				data.show_modifyPayBookGroup();
		});
	}
	
	$.fn.modifyPayBookGroup.defaults = {
		
  	}

  	$.fn.modifyPayBookGroup.Constructor = modifyPayBookGroup;
  	
  	$(function () {
		$('body').on('click.modifyPayBookGroup.data-api', '[data-toggle^=modifyPayBookGroup]', function ( e ) {
			
			var $btn = $(e.target);
			
		  	$btn.modifyPayBookGroup('show');
		});
	})
  	
})(jQuery) 