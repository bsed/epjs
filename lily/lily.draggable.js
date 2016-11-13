/**
 * jQuery draggable event - v1.0
 *
 * 	Depends:
 * 		core.js
 */

(function( $, undefined ) {
	"use strict"
	
 	/* TOOLTIP PUBLIC CLASS DEFINITION
 	 * =============================== */

	var Draggable = function ( element, options ) {
		this.draggableInit('draggable', element, options);
	}
	
	Draggable.prototype = $.extend({}, $.fn.mouse.Constructor.prototype, {
		constructor: Draggable,
		
		draggableInit: function(type, element, options) {
			this.init(type, element, options);
			if (!(/^(?:r|a|f)/).test(this.$element.css("position")))
				this.$element[0].style.position = 'relative';
			(this.options.addClasses && this.$element.addClass("lily-draggable"));
			(this.options.disabled && this.$element.addClass("lily-draggable-disabled"));
		},
		
		destroy: function() {
			this.$element
				.removeData("draggable")
				.unbind(".draggable")
				.removeClass("lily-draggable"
					+ " lily-draggable-dragging"
					+ " lily-draggable-disabled");
			this.mouseDestroy();
			return this;
		},
	
		mouseStart: function(event) {
			
			this.cssPosition = this.$element.css("position");
			
			this.scrollParent = this.$element.scrollParent();
			
			//The element's absolute position on the page minus margins
			this.offset = this.positionAbs = this.$element.offset();
			
			$.extend(this.offset, {
				click: { //Where the click happened, relative to the element
					left: event.pageX - this.offset.left,
					top: event.pageY - this.offset.top
				},
				parent: this.getParentOffset(),
				relative: this.getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
			});
			
			this.$element.addClass("lily-draggable-dragging");
			
			if(this.options.effectObj) {
				this.options.effectObj.startDrag(this);
			}
			
			return true;
		},
		
		mouseDrag: function(event) {
			//Compute the helpers position
			this.position = this.generatePosition(event);
			this.positionAbs = this.convertPositionTo("absolute");
			
			
			if(!this.options.axis || this.options.axis != "y") 
				this.$element[0].style.left = this.position.left+'px';
			if(!this.options.axis || this.options.axis != "x") 
				this.$element[0].style.top = this.position.top+'px';
				
			if(this.options.effectObj) {
				this.options.effectObj.drag(event);
			}
			
			return false;
		},
		
		mouseStop: function(event) {
			//var dropped = false;
			if(this.options.effectObj) {
				this.options.effectObj.stopDrag(this);
			}
			
			this.$element.removeClass("lily-draggable-dragging");
			return false;
		},
		
		generatePosition: function(event) {
			var o = this.options, 
				scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.lily.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, 
				scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
			var pageX = event.pageX;
			var pageY = event.pageY;
			/*
			 * - Position constraining -
			 * Constrain the position to a mix of grid, containment.
			 */
			if(this.originalPosition) { //If we are not dragging yet, we won't check for options
				var containment;
				if(this.containment) {
					if (this.relative_container){
						var co = this.relative_container.offset();
						containment = [ this.containment[0] + co.left,
							this.containment[1] + co.top,
							this.containment[2] + co.left,
							this.containment[3] + co.top ];
					}
					else {
						containment = this.containment;
					}
					if(event.pageX - this.offset.click.left < containment[0]) 
						pageX = containment[0] + this.offset.click.left;
					if(event.pageY - this.offset.click.top < containment[1]) 
						pageY = containment[1] + this.offset.click.top;
					if(event.pageX - this.offset.click.left > containment[2]) 
						pageX = containment[2] + this.offset.click.left;
					if(event.pageY - this.offset.click.top > containment[3]) 
						pageY = containment[3] + this.offset.click.top;
				}
				if(o.grid) {
					//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
					var top = o.grid[1] ? 
						this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : 
						this.originalPageY;
					pageY = containment ? 
						(!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : 
							(!(top - this.offset.click.top < containment[1]) ? 
								top - o.grid[1] : 
								top + o.grid[1])) : 
							top;
					var left = o.grid[0] ? 
						this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : 
						this.originalPageX;
					pageX = containment ? 
						(!(left - this.offset.click.left < containment[0] || left - this.offset.click.left> containment[2]) ? 
							left : 
							(!(left - this.offset.click.left < containment[0]) ? 
								left - o.grid[0] : 
								left + o.grid[0])) : 
							left;
				}
			}
			return {
				top: (
					pageY							// The absolute mouse position
					- this.offset.click.top			// Click offset (relative to the element)
					- this.offset.relative.top	// Only for relative positioned nodes: Relative offset from element to offset parent
					- this.offset.parent.top	// The offsetParent's offset without borders (offset + border)
					+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
				),
				left: (
					pageX																// The absolute mouse position
					- this.offset.click.left												// Click offset (relative to the element)
					- this.offset.relative.left												// Only for relative positioned nodes: Relative offset from element to offset parent
					- this.offset.parent.left												// The offsetParent's offset without borders (offset + border)
					+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
				)
			};
		},
		
		getParentOffset: function() {
			//Get the offsetParent and cache its position
			this.offsetParent = this.$element.offsetParent();
			var po = this.offsetParent.offset();
			// This is a special case where we need to modify a offset calculated on start, since the following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
			//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
			if(this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.lily.contains(this.scrollParent[0], this.offsetParent[0])) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}
			if((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
			|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie)) //Ugly IE fix
				po = { top: 0, left: 0 };
			return {
				top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"),10) || 0),
				left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"),10) || 0)
			};
		},
		getRelativeOffset: function() {
			if(this.cssPosition == "relative") {
				var p = this.$element.position();
				return {
					top: p.top - (parseInt(this.$element.css("top"),10) || 0) + this.scrollParent.scrollTop(),
					left: p.left - (parseInt(this.$element.css("left"),10) || 0) + this.scrollParent.scrollLeft()
				};
			} 
			else {
				return { top: 0, left: 0 };
			}
		},
		
		convertPositionTo: function(d, pos) {
			if(!pos) pos = this.position;
			var mod = d == "absolute" ? 1 : -1;
			var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.lily.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
			return {
				top: (
					pos.top																	// The absolute mouse position
					+ this.offset.relative.top * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
					+ this.offset.parent.top * mod											// The offsetParent's offset without borders (offset + border)
					- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
				),
				left: (
					pos.left																// The absolute mouse position
					+ this.offset.relative.left * mod										// Only for relative positioned nodes: Relative offset from element to offset parent
					+ this.offset.parent.left * mod											// The offsetParent's offset without borders (offset + border)
					- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : ( this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
				)
			};
		}
	});
	
	/* POPOVER PLUGIN DEFINITION
	 * ======================= */

	$.fn.draggable = function ( option ) {
		return this.each(function () {
			var $this = $(this), 
				data = $this.data('draggable'), 
				options = typeof option == 'object' && option;
      		if (!data) 
      			$this.data('draggable', (data = new Draggable(this, options)));
      		if (typeof option == 'string') 
      			data[option]();
		});
	}

	$.fn.draggable.Constructor = Draggable

	$.fn.draggable.defaults = $.extend({} , $.fn.mouse.defaults, {
  	});

})(jQuery);
