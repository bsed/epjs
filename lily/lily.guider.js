/**
 * jQuery guider - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function($, undefined) {
	$.lily.Guider = function() {
		this.optionArray = [];
		this.currentStep = 0;
	}
	$.lily.Guider.prototype = {
		addStep: function(option) {
			this.optionArray.push(option);
		},
		
		nextStep: function() {
			if(!this.$backdrop) {
				this.$backdrop = $('<div class="displayer-backdrop" />').appendTo('body');
				this.$guiderContainer = $('<div class="guider-container" />').appendTo('body');
				this.$guiderContainer.click($.proxy(this.nextStep, this));
			}
			if(this.currentStep >= this.optionArray.length) {
				this.$backdrop.remove();
				this.$guiderContainer.remove();
				return;
			}
			
			this.$currentMessage = $('<img src="' + this.optionArray[this.currentStep].img + '" style="position:absolute"/>');
			
			this.$currentMessage.css(this.optionArray[this.currentStep].postion);
			
			this.$currentMessage.appendTo(this.$guiderContainer);
			if(this.optionArray[this.currentStep].target) {
				var $target = $(this.optionArray[this.currentStep].target);
				var $cloneElement = $target.clone();
				this.optionArray[this.currentStep].$cloneElement = $cloneElement;
				if(this.optionArray[this.currentStep].showClass)
					$cloneElement.addClass(this.optionArray[this.currentStep].showClass);
				$cloneElement.css({
					position: "absolute",
					left: $target.offset().left,
					top: $target.offset().top
				});
				$cloneElement.appendTo(this.$backdrop);
			}
			
			++this.currentStep;
		}
	}
	
})(jQuery);