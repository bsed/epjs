/*
 * 登陆提示信息
*/
(function( $, undefined ) {
	$.lily.loginExplain= $.lily.loginExplain || {};
	$.extend( $.lily.loginExplain, {
　　	execute: function(currentElement,param) {
　　		if (param.login){
	　　		if (!$.lily.CONFIG_SESSION_ID){
	　　			$('#loginexplain',currentElement).append('<img src="images/font_1.jpg" /><a id="quickLogin" href="#">登录</a><img src="images/font_2.jpg" /><a target="_blank" href="html/register/00000000_treaty_sign_step1.html">注册</a><img src="images/font_3.jpg" />').addClass("font_list");					
　　	    　　			$('#quickLogin',currentElement).bind('click',function(){
　　	  　　					$.lily.login.judgeLogin();
　　	  　　					return;
	　　	  　　			});	
	　　		}
　　		}
　　	  }
　　});	
})(jQuery)