/**
 * jQuery modal - v1.0
 */

(function( $ , undefined){

  	"use strict"

 	/* modal CLASS DEFINITION
  	 * ====================== */

	var modal = function ( content, options ) {
		this.options = options;
		this.$element = $(content)
	  		.delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));

		if(!options.showPosition) {
			var showPosition = {};
			showPosition.left = (($(window).width() - this.$element.width()) / 2).toFixed(0);
			showPosition.top = (($(window).height() - this.$element.height()) / 2).toFixed(0);
			this.options.showPosition = showPosition;

			var hidePosition = {};
			hidePosition.left = showPosition.left;
			hidePosition.top = -this.$element.height();
			this.options.hidePosition = hidePosition;
		}

	  	/*
		this.$element.originPosition = {
			left: this.$element.offset().left,
			top: this.$element.offset().top,
			width: this.$element.width(),
			height: this.$element.height()
		}
		*/
	}

  	modal.prototype = {
		constructor: modal,

		toggle: function () {
        	return this[!this.isShown ? 'show' : 'hide']()
      	},

      	show: function () {
        	var that = this;
        	if (this.isShown)
        		return;

        	$('body').addClass('modal-open')

        	this.isShown = true;
        	this.$element.trigger('show');

        	//escape.call(this)
        	backdrop.call(this, function () {
          		var transition = that.$element.hasClass('fade');

          		!that.$element.parent().length && that.$element.appendTo(document.body); //don't move modals dom position

				if(transition)
					that.beginTransatcion(0);

        	});
      	},

      	hide: function ( e ) {
        	e && e.preventDefault();
			var that = this;
        	if (!this.isShown)
        		return;

        	$('body').removeClass('modal-open');

        	this.isShown = false;
        	this.$element.trigger('hide');

        	//escape.call(this)
        	backdrop.call(this, function () {
          		var transition = that.$element.hasClass('fade');
			if(transition)
				that.beginTransatcion(1);

        	});
      	},

      	beginTransatcion: function(type, passedData) {
		var startLeft, startTop, startWidth, startHeight, toLeft, toTop, toWidth, toHeight;
    		var now = (new Date()).getTime(),
    			that = this,
    			timer;
			if (!passedData) {
				passedData = {
					timerStart: now,
					startPosition: this.options.hidePosition,
					toPosition: this.options.showPosition
				};
				if (type === 0) {
					this.$element.css({display:"block"});
				}
				if (type === 1){
					passedData.startPosition = this.options.showPosition;
					passedData.toPosition = this.options.hidePosition;
				}
			}
			// 更新定时器
			timer = now - passedData.timerStart;
			var options =  this.options;
			if (timer < options.duration) {
				var startPosition = passedData.startPosition;
				var toPosition = passedData.toPosition;
				var top = $.easing['swing']((timer / options.duration), timer, toPosition.top - startPosition.top, toPosition.top, options.duration);
				var opacity = top;

				top = startPosition.top + ((toPosition.top - startPosition.top) * top);


				this.$element.css({
				    	top: top + "px",
					opacity: opacity
				});
				var self = this;
				setTimeout(function() {  // 使用timeout来展现每步动作
					self.beginTransatcion(type, passedData);
				}, 0);
		  	}
		  	else {
				this.$element.css({
		    			top: passedData.toPosition.top + "px"
				});
				if (type === 1) {
					this.$element.css({display:"none"});
				}
			}
		}
  	},


	/* modal PRIVATE METHODS
	 * ===================== */

  	function hideWithTransition() {
    	var that = this ,
    		timeout = setTimeout(function () {
          		that.$element.off($.support.transition.end);
          		hidemodal.call(that);
        	}, 500);

    	this.$element.one($.support.transition.end, function () {
      		clearTimeout(timeout);
      		hidemodal.call(that);
    	});
  	}

  	function hidemodal( that ) {
    	this.$element
      		.hide()
      		.trigger('hidden');

    	backdrop.call(this)
  	}

  	function escape() {
    	var that = this;
    	if (this.isShown && this.options.keyboard) {
      		$(document).on('keyup.dismiss.modal', function ( e ) {
        		e.which == 27 && that.hide()
     		})
    	}
    	else if (!this.isShown) {
      		$(document).off('keyup.dismiss.modal')
    	}
  	}

	function backdrop( callback ) {
		var that = this ,
			animate = this.$element.hasClass('fade') ? 'fade' : '';

		if (this.isShown && this.options.backdrop) {

	  		this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
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
 	/* modal PLUGIN DEFINITION
  	 * ======================= */

  	$.fn.modal = function ( option ) {
    	return this.each(function () {
      		var $this = $(this),
      			data = $this.data('modal'),
      			options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data)
      			$this.data('modal', (data = new modal(this, options)));
      		if (typeof option == 'string')
      			data[option]();
      		else if (options.show)
      			data.show();
    	})
  	}

  	$.fn.modal.defaults = {
		backdrop: true,
		show: true,
		duration: 600
  	}

  	$.fn.modal.Constructor = modal


 	/* modal DATA-API
  	 * ============== */

  	$(function () {
    	$('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      		var $this = $(this), href,
      		$target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')), //strip for ie7
      		option = $target.data('modal') ? 'toggle' : $.extend({}, $target.data(), $this.data())

      		e.preventDefault();
      		$target.modal(option);
    	})
  	})

})( window.jQuery );
