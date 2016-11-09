/**
 * jQuery dispatch - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function( $ , undefined){
	"use strict"

 	/* modal CLASS DEFINITION
  	 * ====================== */

	var Dispatch = function ( element, options ) {
		this.options = options;
		this.$element = $(element);
//		this.$transactionArea = $('#right-main-area', this.$element);
//		this.$welcomeArea = $('#right-welcome-area', this.$element);
//		this.$menuPathArea = $('#currentPath');
		this.$transactionPageArea = $('#right-main-content', this.$element);
//		this.welcomePageShow = true;
	}
	
	Dispatch.prototype = {
		constructor: Dispatch,
		
		doDispatch: function(actionId, fitstMenu , secondMenu, thirdMenu, startStep, requestData) {
/*			if(this.welcomePageShow) {
				this.$welcomeArea.fadeOut();
				this.$transactionArea.fadeIn();
				this.welcomePageShow = false;
			}*/
			var windowId = 'transArea' + $.lily.generateUID();
			if(this.currentTransArea)
				this.currentTransArea.remove();
			this.currentTransArea = $('<div class="main-transaction-area" id="' + windowId + '"></div>');
			this.currentTransArea.appendTo(this.$transactionPageArea);
/*			var menuPath;
			if(!fitstMenu&&!secondMenu){
				menuPath = '';
				if(thirdMenu) {
					menuPath = thirdMenu;
				}
			}else{
				menuPath = fitstMenu + ' > ' + secondMenu;
				if(thirdMenu) {
					menuPath += ' > ' + thirdMenu;
				}
			}		
			this.$menuPathArea.text(menuPath);*/
			this.currentTransArea.mvc(this, {
	  			tranCode: actionId, 
	  			startStep: startStep,
	  			requestData: requestData
	  		});
		},
		
/*		showWelcome: function() {
			if(!this.welcomePageShow) {
				this.$transactionArea.fadeOut();
				this.$welcomeArea.fadeIn();
				this.welcomePageShow = true;
			}
		}*/
	}
	
	$.fn.dispatch = function ( option ) {
		return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('dispatch'), 
      			options = $.extend({}, $.fn.dispatch.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('dispatch', (data = new Dispatch(this, options)));
    	});
  	}
	
	$.fn.dispatch.defaults = {
		
  	}
  	
  	$.fn.dispatch.Constructor = Dispatch;
	
	$.doDispatch = function ( actionId, fitstMenu , secondMenu, thirdMenu, startStep, requestData) {
		$('body').data('dispatch').doDispatch(actionId, fitstMenu , secondMenu, thirdMenu, startStep, requestData);
  	}
  	
})(jQuery)