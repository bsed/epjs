(function($, undefined) {

	$.lily.contextPath = $.lily.getContextPath() + '/';
	//默认显示域
	$(document).placeholder();

	function mainPageInit() { 
		
		var tranCode='user_register';
		
		var windowId = tranCode + $.lily.generateUID();
		
		$.openWindow({
			tranCode: tranCode,
			windowId: windowId
		});
		

	}
	
	

	$(function() {
		mainPageInit();
		
	});
})(window.jQuery);