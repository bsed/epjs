(function($, undefined) {
	
	function password(){
		$.lily.passwd.write(
				$("#loginBox"),// currentElement
				{
					"parentid":"childNeed",// 容器id
					"id":"indexInputPwd",// 控件id
					"maxLength":"20",// 通用长度控制 首页20 其他密码情况无需填写此项
					'reg1':'[\\S]{0,20}',// 微通输入校验
					'reg2':'[\\S]{6,20}',// 微通输入结束校验
					'tab':'checkCode',
					'ocx_style':'ocx_style_index',
					ocx_style_init:'ocx_style_index_init'/*,
					"placeholderText":"用户密码"*/
				}
		);
	};
	function loginInit(){
		//默认显示域
		//$('input, textarea').placeholder();
		//var _tkADD = new tkSwitchAD("focus_change_list", "tkBottunn", 5000, 20);
		//pgeditor.pgInitialize();
		
		//password();
		
		$('#verifyImg').bind('click',function(){
			changeImage();
		});
		
		
	}
	
	function changeImage() {
		document.getElementById("verifyImg").src = 'VerifyImage?update='+ Math.random();
	}
	
	function loginSubmit(){
		
		$(".loginButton").bind("click",function(){// index页面登陆
	    	var logonId = $.trim($('#logonId').val());
	        if(logonId==null||logonId==""){
	        	alert("请输入登录ID");
	          return false;
	        }
	        
	    	//var passResult=$.lily.passwd.getPasswd($("#loginBox"),"indexInputPwd");
	    	//var passwordEncrypted=passResult.password;
	    	var passwordEncrypted=$.trim($('#password').val());
	    	if(!passwordEncrypted){
	        	alert("请输入密码!");
	    		return false;
	    	}
	    	/*passwordEncrypted=passwordEncrypted.replace(/\+/g, "%2B");
	    	if(!passwordEncrypted){
	        	alert("请输入密码!");
	    		return false;
	    	}
	        
	        if(passwordEncrypted==null||passwordEncrypted==""){
	        	alert("请输入密码!");
	          return false;
	        }*/
	        var checkCode = $.trim($('#checkCode').val());
	        if(checkCode==null||checkCode==""){
	          alert("请输入验证码!");
	          return false;
	        }
	      
	        var params = "?checkCode=" + checkCode + "&logonType=1&channel=1101" + 
	               "&currentBusinessCode=00000100&logRecordFlag=1" +
	               "&logonId=" + logonId + "&passwordEncrypted=" + passwordEncrypted;
	       
	      $.lily.ajax({
	          url: 'signIn.do' + params,
	          type: 'post', 
	          dataType:'json',
	          async: false,
	          processResponse: function(data){
	        	//$.lily.CONFIG_SESSION_ID  =  data.sessionId;
		        $.lily.sessionData = data;
		        //console.log($.lily.CONFIG_SESSION_ID);
		        //console.log($.lily.sessionData);
		        window.location.href=$.lily.getContextPath() + '/main.html?'+base64encode(utf16to8(JSON.stringify($.lily.sessionData)));
	          },
	          selfdefineFailed:function(data){
	        	  alert(data.em);
	        	  $("#verifyImg").attr('src', 'VerifyImage?update=' + Math.random());
	        	  $('#checkCode').val('');
	          }
	        
	         });
	      }); 
		
		$('.cancelButton').bind('click',function(){
			$("#logonId").val("");
			$("#checkCode").val("");
			$("#childNeed").empty();
			password();
		});
		
		/*$('.loginButton').bind('click',function(){
			window.location.href=$.lily.getContextPath() + '/main.html';
		});*/
	}
	$(function() {
		loginInit();
		loginSubmit();
	});
})(window.jQuery);