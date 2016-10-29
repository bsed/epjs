(function ($, undefined) {
	$.lily.contextPath = $.lily.getContextPath() + '/';
	$('body').dispatch();

	$(function(){

		switch(protocolType){
//			case '0' : clickLogin($(".active").find("a").attr("id"), '', '');  break;
			case '1' :clickLogin('other_protocol_query',  '', '');  break;
			case '2' :clickLogin('other_protocol_pay',  '', '');  break;
			default:  clickLogin('other_protocol_query',  '', '');  break;
		}
	});
})(window.jQuery)

function clickLogin(param1,param2,param3){
	$.doDispatch(param1,  param2, param3);
}