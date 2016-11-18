(function($){  
	
   "use strict";
     
	$.lily.passwd = $.lily.passwd || {};
$.extend($.lily.passwd,{ 
	
	type:'WTXC',//'YD','WTXC'  settings.xml中passwordKJLX需要保持一致
	write:function(currentElement,options){
		
		var appentTo = options.parentid;
		if(!appentTo){
			return;
		}
		if($.lily.passwd.type == 'WTXC'){//维通新城
			var pgeditor=null;
			var pgeIdTemp = "_ocx_password_auth";
			var ocx_style = "ocx_style";
			var ocx_style_init = "ocx_style_init";
			
			if(options.ocx_style){
				ocx_style = options.ocx_style;
				ocx_style_init = options.ocx_style_init;
			}
			
			
			if(options.id){
				pgeIdTemp = options.id;
			}
			
			var defaults={
					pgePath: "./ocx/",//控件文件目录
					pgeId:pgeIdTemp,//控件ID
					pgeEdittype: 0,//控件类型,0星号,1明文
					pgeEreg1: options.reg1==undefined?"[0-9]{0,6}":options.reg1,//输入过程中字符类型限制  
					pgeEreg2: options.reg2==undefined?"[0-9]{6}":options.reg2,	//输入完毕后字符类型判断条件 
					pgeMaxlength: options.maxLength==undefined?"6":options.maxLength,//允许最大输入长度
					pgeTabindex: 2,//tab键顺序
					pgeClass: ocx_style,//控件css样式
					pgeInstallClass: ocx_style_init,//针对安装或升级
					pgeOnkeydown:"",//回车键响应函数
				    tabCallback:"",//非IE tab键焦点切换的ID
				    currentElement:currentElement,
				    pgeBackColor:"16777215"
				};
			
			pgeditor = new $.pge(defaults);
			currentElement.data(options.id, pgeditor);
			var passwordObj = $('<div class="passwdDiv">'+pgeditor.getpgeHtml()+'</div>');
			$("#"+appentTo,currentElement).empty().html(passwordObj);
			pgeditor.pgInitialize();
			
		}else{
			alert("未设置密码控件类型!");
		}
	},
	getPasswd:function(currentElement,id,SrandNum){
		var password = null;
		var srand = null;
		if($.lily.passwd.type == 'WTXC'){//维通新城
			var pgeditor = null;
			if(id){
				pgeditor = currentElement.data(id);
			}else{
				pgeditor = currentElement.data('pgeditor');
			}
			
			if(pgeditor){
				if(SrandNum){
					  pgeditor.pwdSetSk(SrandNum);
		          	  password=pgeditor.pwdResult();
					return {"password":password,"srandNum":SrandNum};
				}
					$.ajax({
				          url: $.lily.getContextPath()+"/SrandNum",
				          type: "GET",
				          async: false,
				          cache:false,
				          success: function(srand_num) {
				        	  srand=srand_num
				              pgeditor.pwdSetSk(srand_num);
				          	  password=pgeditor.pwdResult();
				          }
				     });
			}
		}
		return {"password":password,"srandNum":srand};
    },//end of getPasswd
    
  //密码类型flag:1、交易密码；2、登录密码；3、查询密码
    getPasswdForCredit:function(currentElement,id,flag,errorMessage){
    	var password = null;
    	var srand = null;
    	if($.lily.passwd.type == 'WTXC'){//维通新城
    		var pgeditor = null;
    		if(id){
    			pgeditor = currentElement.data(id);
    		}else{
    			pgeditor = currentElement.data('pgeditor');
    		}
    		if(pgeditor){
    			$.ajax({
    				url: $.lily.getContextPath()+"/SrandNum",
    				type: "GET",
    				async: false,
    				cache:false,
    				success: function(srand_num) {
    					srand=srand_num
    					pgeditor.pwdSetSk(srand_num);
    					password=pgeditor.pwdResult();
    				}
    			});
    		}
    	}
    	return {"password":password,"srandNum":srand};
    },
    getHtml:function(verTable,currentElement,id,colspanSize,channelPWDType){//返回HTML 非登陆交易
		if($.lily.passwd.type == 'WTXC'){//维通新城
			var pgeditor=null;
			var pgeIdTemp = "_ocx_password_auth";
			
			if(id){
				pgeIdTemp = id;
			}
			
			pgeditor = new $.pge({
				pgePath: "./ocx/",//控件文件目录
				pgeId: pgeIdTemp,//控件ID
				pgeEdittype: 0,//控件类型,0星号,1明文
				pgeEreg1: "[0-9]{0,6}",//输入过程中字符类型限制  
				pgeEreg2: "[0-9]{6}",	//输入完毕后字符类型判断条件 
				pgeMaxlength:"6",//允许最大输入长度
				pgeTabindex: 2,//tab键顺序
				pgeClass: "ocx_style",//控件css样式
				pgeInstallClass: "ocx_style_init",//针对安装或升级
				pgeOnkeydown:"",//回车键响应函数
			    tabCallback:"",//非IE tab键焦点切换的ID
			    currentElement:currentElement,
			    pgeBackColor:"16185078"
			});
			currentElement.data(id, pgeditor);
			var passwordObj = $('<div class="passwdDiv">'+pgeditor.getpgeHtml()+'</div>');
			var viewString = '';
			if('1'==channelPWDType){
				viewString = '支付密码';
			}else{
				viewString = '交易密码';
			}
			verTable.append($('<tr ><td class="title"><span class="error_info">*</span>'+viewString+'</td></tr>')
					.append($('<td colspan="'+colspanSize+'" data-toggle="passwd"></td>')
					.append(passwordObj)));
			pgeditor.pgInitialize();
			
		}else{
			alert("未设置密码控件类型!");
		}
		verTable.append($('<input type="hidden" style="width: 280px" id="accountPassword"  name="pwd" data-validate=\'{"id":"accountPassword", "name":"账户密码", "request":true,"checkInput":false}\' type="text"  />'));
		verTable.append($('<input type="hidden" id="pwdValid" value="0"  data-validate=\'{"id":"pwdValid","name":"账户密码","checker":"checkPwdActive","pwdId":"accountPassword"}\'/>'));
	}//end of getHtml
});      
})(jQuery);   


/*使用方法如下：
 * var  newPwdPge = currentElement.data('ocx_password2');
var obj = $('#password_tip1',currentElement);

 window.setInterval(function(){
 	GetLevel(obj,newPwdPge);
 },800); //实时显示密码强度*/

 //获取密码强度
function GetLevel(obj,pgeditor){

  var n=pgeditor.pwdStrength();
  
	  if(n==1){
	    	obj.attr('class','level_show level1');
			
		}
		if(n==2){
			obj.attr('class','level_show level2');
		 
		}
		if(n==3){
			obj.attr('class','level_show level3');
		}
		if(n==0){
	        obj.attr('class','level_show level0');
        }
}

