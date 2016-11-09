/**
 * jQuery datapicker - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 * 
 * depend lily.calendar.js
 */

(function($, undefined) {
	"use strict"

 	/* Datapicker CLASS DEFINITION
  	 * ====================== */
	var Datapicker = function ( element, options ) {
		this.options = options;
		this.$element = $(element);
		var datapickContainer = this.$element.parent().parent().parent();
		
		this.pickerContainer =$('<div class="data-pick" style="display:none"></div>')	
		.appendTo(datapickContainer);
		
		this.pickerContainer
		.css({
			marginTop: "30px",
			width: this.options.width + "px",
			height: this.options.height + "px",
			zIndex: this.options.zIndex
		})
		.calendar({
			target: this,
			selectFun: this.setDate
		});
	  	this.isShown = false;
	}
	
	Datapicker.prototype = {
		constructor: Datapicker, 
		
		show: function() {
			if(this.isShown)
				return;
			var self = this;
			if($.lily.currentDataPick) {
				$.lily.currentDataPick.hide();
			}
			self.isShown = true;
			backdrop.call(this, function () {
				self.pickerContainer.fadeIn(self.options.fadeSpeed, self.options.fadeEasing);
        	});
			$.lily.currentDataPick = this;
		},
		
		hide: function() {
			if(!this.isShown)
				return;
			
			$('body').removeClass('displayer-open');

        	this.isShown = false;
        	this.$element.trigger('hide');

			var self = this;
        	//escape.call(this)
        	backdrop.call(this, function () {
        		self.pickerContainer.fadeOut(self.options.fadeSpeed, self.options.fadeEasing);
        	});
		},
		
		setDate: function(date) {
			this.$element.val(date.format('yyyy-mm-dd'));
			this.hide();
		}
	}
	
	function backdrop( callback ) {

		var that = this , 
			animate = this.$element.hasClass('fade') ? 'fade' : '';
		
		if (this.isShown && this.options.backdrop) {
			
	  		this.$backdrop = $('<div class="datapick-backdrop ' + animate + '" />')
	    		.appendTo(document.body);
	  		if (this.options.backdrop != 'static') {
	    		this.$backdrop.click($.proxy(this.hide, this));
	  		}
	
	  		//this.$backdrop[0].offsetWidth; // force reflow
	
	  		this.$backdrop.addClass('in');
	    	callback();
	
		} 
		else if (!this.isShown && this.$backdrop) {
	  		this.$backdrop.removeClass('in');
	    	removeBackdrop.call(this);
			callback();
		} 
		else if (callback) {
	  		callback();
		}
	}
	
	function removeBackdrop() {
		this.$backdrop.remove();
		this.$backdrop = null
	}
	
	$.fn.datapicker = function ( option ) {
    	return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('datapicker'), 
      			options = $.extend({}, $.fn.datapicker.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('datapicker', (data = new Datapicker(this, options)));
      		if (option == 'show') 
				data.show();
    	});
  	}
	
	$.fn.datapicker.defaults = {
		backdrop: true, 
		show: false,
		width: 300,
		height: 160,
		zIndex: 3001,
		fadeSpeed: 600, 
		fadeEasing: ''
  	}
	/* DATAPICK DATA-API
 	 * =============== */

	$(function () {
		$('body').on('focus.input.data-api', '[data-toggle^=datapick]', function ( e ) {
			
			var $field = $(e.target);
			
			$field.datapicker('show');
			
		});
	})
	
})(jQuery);