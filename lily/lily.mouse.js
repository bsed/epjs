/**
 * jQuery mouse event - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */

(function( $, undefined ) {

	"use strict"
	
 	/* TOOLTIP PUBLIC CLASS DEFINITION
 	 * =============================== */

	var Mouse = function ( element, options ) {
		var mouseHandled = false;
		this.init('mouse', element, options);
	}
	
	Mouse.prototype = {
		constructor: Mouse, 
		
		init: function ( type, element, options ) {
			this.type = type;
			this.$element = $(element);
			this.options = options;
			var self = this;
			
			this.$element
				.bind('mousedown.'+this.type, function(event) {
					return self.mouseDown(event);
				})
				.bind('click.'+this.type, function(event) {
					if (true === $.data(event.target, self.type + '.preventClickEvent')) {
				    	$.removeData(event.target, self.type + '.preventClickEvent');
						event.preventDefault();
						return false;
					}
				});

			this.started = false;
    	},
    	
    	mouseDown: function(event) {
    		
			// 只有一个mouse 句柄在之星
			if( this.mouseHandled ) { 
				return;
			}
			
			//处理鼠标移出窗口外
			(this.mouseStarted && this.mouseUp(event));

			this.mouseDownEvent = event;
			var self = this,
				btnIsLeft = (event.which == 1),
				// event.target.nodeName works around a bug in IE 8 with
				// disabled inputs (#7620)
				elIsCancel = (typeof this.options.cancel == "string" && event.target.nodeName ? 
					$(event.target).closest(this.options.cancel).length : 
					false);
			if (!btnIsLeft || elIsCancel || !this.mouseCapture(event)) {
				return true;
			}
			
			this.mouseStarted = (this.mouseStart(event) !== false);
			
			
			if (!this.mouseStarted) {
				event.preventDefault();
				return true;
			}
			
			// these delegates are required to keep context
			this.mouseMoveDelegate = function(event) {
				return self.mouseMove(event);
			};
			this.mouseUpDelegate = function(event) {
				return self.mouseUp(event);
			};
			
			$(document)
				.bind('mousemove.'+this.type, this.mouseMoveDelegate)
				.bind('mouseup.'+this.type, this.mouseUpDelegate);

			event.preventDefault();
		
			this.mouseHandled = true;
			return true;
		},
		
		mouseMove: function(event) {
			
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
				return this.mouseUp(event);
			}
	
			if (this.mouseStarted) {
				this.mouseDrag(event);
				return event.preventDefault();
			}
			
			this.mouseStarted = (this.mouseStart(this.mouseDownEvent, event) !== false);
			(this.mouseStarted ? this.mouseDrag(event) : this.mouseUp(event));
	
			return !this.mouseStarted;
		},
		
		mouseUp: function(event) {

			$(document)
				.unbind('mousemove.'+this.type, this.mouseMoveDelegate)
				.unbind('mouseup.'+this.type, this.mouseUpDelegate);
				
			if (this.mouseStarted) {
				this.mouseStarted = false;
	
				if (event.target == this.mouseDownEvent.target) {
				    $.data(event.target, this.type + '.preventClickEvent', true);
				}
				this.mouseStop(event);
			}
			
			this.mouseHandled = false;
			
			return false;
		},
		
		mouseDestroy: function() {
			this.$element.unbind('.'+this.type);
			$(document)
				.unbind('mousemove.'+this.type, this.mouseMoveDelegate)
				.unbind('mouseup.'+this.type, this.mouseUpDelegate);
		},
		
		sortIndex: function(index) {
			if(index)
				this.options.sortIndex = index;
			return this.options.sortIndex;
		},
		
		mouseCapture: function(event) { return true; },
		mouseStart: function(event) { },
		mouseDrag: function(event) {},
		mouseStop: function(event) {}
	}
	
	$.fn.mouse = function ( option ) {
    	return this.each(function () {
			var $this = $(this), 
				data = $this.data('mouse'), 
				options = typeof option == 'object' && option;
      		if (!data) 
      			$this.data('mouse', (data = new Mouse(this, options)));
      		if (typeof option == 'string') 
      			data[option]();
    	});
  	}

  	$.fn.mouse.Constructor = Mouse;
  	
  	$.fn.mouse.defaults = {
  		delay: 0
  	}

})(jQuery);

 