/**
 * jQuery slide Show - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function( $ , undefined){

  	"use strict"

 	/* displayer CLASS DEFINITION
  	 * ====================== */

	var Displayer = function ( element, options ) {
		this.options = options;
		this.$element = $(element)
	  		.delegate('[data-toggle="displayer"]', 'click.toggle.displayer', $.proxy(this.toggle, this));
	  	switch(this.options.direction) {
	  		case 'left':
	  			this.oldPosition = {left: this.$element.offset().left};
	  			break;
	  		case 'right':
	  			this.oldPosition = {right: this.$element.offset().right};
	  			break;
	  		case 'up' :
	  			this.oldPosition = {top: this.$element.offset().top};
	  			break;
	  		case 'down' :
	  			this.oldPosition = {bottom: this.$element.offset().bottom};
	  			break;
	  	}
	  	this.isShown = false;	
	}
	
	Displayer.prototype = {
		constructor: Displayer, 
			
		toggle: function () {
        	return this[!this.isShown ? 'show' : 'hide']()
      	},
      	
      	show: function () {
      		var that = this;
        	if (this.isShown) 
        		return;
        	$('body').addClass('displayer-open');
        	
        	this.isShown = true;
        	this.$element.trigger('show');
        	
        	if(!this.showPosition) {
        		switch(this.options.direction) {
			  		case 'left':
			  			this.showPosition = {left: 0};
			  			break;
			  		case 'right':
			  			this.showPosition = {right: 0};
			  			break;
			  		case 'up' :
			  			this.showPosition = {top: 0};
			  			break;
			  		case 'down' :
			  			this.showPosition = {bottom: 0};
			  			break;
			  	}
        	}
        	
        	
        	backdrop.call(this, function () {
          		that.$element.animate(that.showPosition, that.options.duration, function(){
					$(this).removeClass('active');
				});

        	});
        	
        },
        
        hide: function ( e ) {
        	e && e.preventDefault();
			var that = this;
        	if (!this.isShown) 
        		return;

        	$('body').removeClass('displayer-open');

        	this.isShown = false;
        	this.$element.trigger('hide');

        	//escape.call(this)
        	backdrop.call(this, function () {
				that.$element.animate(that.oldPosition, that.options.duration, function(){
					$(this).addClass('active');
				});
        	});
      	}
	}
	
	
	function backdrop( callback ) {
		var that = this , 
			animate = this.$element.hasClass('fade') ? 'fade' : '';
	
		if (this.isShown && this.options.backdrop) {
	
	  		this.$backdrop = $('<div class="displayer-backdrop ' + animate + '" />')
	    		.appendTo(document.body)
	
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
		this.$backdrop.remove()
		this.$backdrop = null
	}
	
	
	$.fn.displayer = function ( option ) {
    	return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('displayer'), 
      			options = $.extend({}, $.fn.displayer.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('displayer', (data = new Displayer(this, options)));
      		if (typeof option == 'string') 
      			data[option]();
      		else if (options.show) 
      			data.show();
    	})
  	}

  	$.fn.displayer.defaults = {
		backdrop: true, 
		show: false,
		duration: 300,
		direction: 'left' //left right up down 表示那边被覆盖
  	}

  	$.fn.displayer.Constructor = Displayer;
  	
})( window.jQuery );
      	
      	