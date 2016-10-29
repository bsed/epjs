// this is write for main.html
// to start plugin
// ++++++++++++++++++++++++++++++++++++++++++
if(!$.browser.msie) { 
	payType = '1';
} 
//用于lily.accountSelect.js 显示卡号
function accountSelectCallback(currentElement) {
	$('#card-slider',currentElement).slider({
		animationButton: true
	});
}
// 点击专业版 param1 跳转 url 
// param2 一级菜单，param3 二级菜单 ，暂不用
function clickLogin(param1,param2,param3){
/*	$('#order_title button').each(function(index) {
		if(!($(this).hasClass("selected_pay")) &&$(this).attr('id') == param1){
			$(this).toggleClass("selected_pay");
			$(this).siblings("button").removeClass("selected_pay");
		}
    });*/	
	$.doDispatch(param1,  param2, param3);
}

(function ($, undefined) {
	
	$.lily.contextPath = $.lily.getContextPath() + '/';
	$('body').dispatch();
	$(function(){

		switch(payType){
//			case '0' : clickLogin($(".active").find("a").attr("id"), '', '');  break;
			case '1' :clickLogin('login_card_pay',  '', '');  break;
			case '2' :clickLogin('login_guagua_pay',  '', '');  break;
			default:  clickLogin('login_account_pay',  '', '');  break;
		}
		//账户支付
		$('#login_account_pay').click(function() {
			clickLogin('login_account_pay',  '', '');
		});
		
		//钱包支付点击事件
		$('#login_card_pay').click(function() {
			clickLogin('login_card_pay',  '', '');
		});
		
		//手机支付点击事件
		$('#login_guagua_pay').click(function() {
			clickLogin('login_guagua_pay',  '', '');
		});
		
		//银联支付
		$('#login_pro_pay_cups').click(function() {
			clickLogin('login_pro_pay_cups',  '', '');
		});
		$('#login_card_pay_cups').click(function() {
			clickLogin('login_card_pay_cups',  '', '');
		});
		$('#login_mobile_pay_cups').click(function() {
			clickLogin('login_mobile_pay_cups',  '', '');
		});
	});
})(window.jQuery)