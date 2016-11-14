/**
 * jQuery initializer - v1.0
 */


(function($, undefined) {
	"use strict"
	
	var Initializer = function ( element, options ) {
		this.options = options;
		this.$element = $(element);
		this.$msgTip = $(this.options.msgArea, this.$elemen);
		
		this.stepArray = [];
		
	}
	
	Initializer.prototype = {
		constructor: Initializer,
		
		DEFAULT_STEP : {
			func : null,
			sync : true,
			msg : null
		},
		
		addStep: function(step) {
			
			var aStep = $.extend({}, this.DEFAULT_STEP);
			if(step){
				if ($.isFunction(step)) {
					aStep.func = step;
				} 
				else {
					$.extend(aStep, step);
				}
			}
			this.stepArray.push(aStep);
		},
		
		start : function() {
			this.startTime = (new Date()).getTime();
			
			this.curStep = 0;
			this.end = false;
			this.error = false;
			
			this.run();
		},
		
		run : function() {
			
			while (true) {
				if (this.curStep>=this.stepArray.length) {
					var currentTime = (new Date()).getTime();
					var timeInterval = currentTime - this.startTime ;
					if(timeInterval < this.options.minTime) {
						var self = this;
						setTimeout(function() { self.finish.apply(self);}, this.options.minTime - timeInterval);
					}
					else
						this.finish();
					break;
				}
				var curStep = this.stepArray[this.curStep];
				var func = curStep.func;
				var sync = curStep.sync;
				var msg = curStep.msg;

				if (msg) {
					this.updateTip(msg);
				}
				
				if (sync) {
					setTimeout(func, 0);
				} 
				else {
					func();
				}
				this.curStep++;
			}
		},
		
		updateTip : function(msg) {
			
			if (msg && this.options.showTip) {
				this.$msgTip.text(msg);
			}
		},
		
		finish : function() {
			this.end = true;
			this.$element.fadeOut();
			if(this.callback)
				this.callback();
		},
		
		setCallback: function(callback) {
			this.callback = callback;
		}
	}
	
	$.fn.initializer = function ( option ) {
    	return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('initializer'), 
      			options = $.extend({}, $.fn.initializer.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('initializer', (data = new Initializer(this, options)));
      		if (option == 'show') 
				data.show();
    	})
  	}
	
	$.fn.initializer.defaults = {
		msgArea: '#loadding-tip',
		showTip: true,
		minTime: 1000
  	}

})(jQuery);
