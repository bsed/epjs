(function($){  
	
    "use strict";
	
	$.lily.login = $.lily.login || {};
	
$.extend($.lily.login,{ 
	
	I18N:{//国际化
		loginDesc:'登录'
	},
	
	judgeLogin:function(currentMVC,step, requestData){ 
		   if(arguments.length==0){//无参数 即登陆之后不需要任何操作
			   openSignWin(this);
		   }else if(arguments.length==1){//currentMVC登陆之后可能需要进行下一步
			   openSignWin(this,currentMVC);
		   }else if(arguments.length==2){//currentMVC，step 登陆之后可能需要跳转到某一步
			   var requestData=null;
			   $.extend(requestData,{'step':step});
			   openSignWin(this,currentMVC,requestData);
		   }else if(arguments.length==3){//下一步或者某一步，但是需要传参数
			   if(!step){
				   $.extend(requestData,{'step':step});
			   }
			   openSignWin(this,currentMVC,requestData);	
		   }
		   function openSignWin(parentThis,currentMVC,requestData){
				$.openWindow({
					appendTo:'body',
					isSmallWindow:true,
					title:parentThis.I18N.loginDesc,
					param:requestData,
					allowClose:true,
					windowClass:'common-smallsub-window-login',
					tranCode : 'login',
					parentMVC:currentMVC,
					cssWidth:883,
					cssHeight:441,
					hasHeader:false
					
				});
		   }

	},
	judgeLogin4Common:function(currentMVC){
		objectForpwd=$("object:visible");
		objectForpwd.hide();
		if($.lily.CONFIG_SESSION_ID){
			return;
		}else{
			 $.openWindow({
					appendTo:'body',
					isSmallWindow:true,
					title:this.I18N.loginDesc,
					allowClose:true,
					windowClass:'common-smallsub-window-login',
					tranCode : 'login',
					parentMVC:currentMVC,
					cssWidth:883,
					cssHeight:421,
					hasHeader:false
					
				});
		   
		}
	}
	
	
	

    
}); 



})(jQuery);     
