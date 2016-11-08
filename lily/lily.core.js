/**
 * jQuery mouse event - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */

(function( $, undefined ) {

// prevent duplicate loading
// this is only a problem because we proxy existing functions
// and we don't want to double proxy them
$.lily = $.lily || {};
if ( $.lily.version ) {
	return;
}

/*$(document).bind("contextmenu",function(e){  
	if(!$.lily.forbinddenKey){
		return true;
	}
    return false;  
}); 
$(document).keydown(function(e){
	if(!$.lily.forbinddenKey){
		return true;
	}
	
     var target = e.target ;
     var tag = e.target.tagName.toUpperCase();
     if(e.keyCode == 8){
      if((tag == 'INPUT' && !$(target).attr("readonly"))||(tag == 'TEXTAREA' && !$(target).attr("readonly"))){
       if((target.type.toUpperCase() == "RADIO") || (target.type.toUpperCase() == "CHECKBOX")){
        return false ;
       }else{
        return true ; 
      }
      }else{
       return false ;
      }
     }
     if((e.ctrlKey)&& (e.keyCode==78 || e.keyCode== 82)||e.keyCode==123  ){
		 e.keyCode==0;
		 return false ;
     }
 }); */


var alertID=0;
var _alert = window.alert; 

ajustMaskHeight = function(maskId){
	
	if(!$('#'+maskId).attr('id')){
		clearTimeout(setTimeout("ajustMaskHeight('"+maskId+"');",0));
		return;
	}
	var scorllHeightTmp=$(document).height();

	 $('#'+maskId).css({
		 height:scorllHeightTmp
	 });
	setTimeout("ajustMaskHeight('"+maskId+"');",0);
}
,
myAlert = function(txt,options,titleTmp) { 
		objectForpwd=$("object:visible");
		objectForpwd.css("visibility","hidden");
		var errCode="";
        if(options){ //session超时只弹出一个对话框
        	 if(options.ec){
        		 errCode=options.ec;
	        	 if(options.ec == '20000'||options.ec == 'EBLN1001'){
	        	        //曝光上送
//	        		 baoGuangCookieSend();
	        		 var sessionTimeoutCount=0;
		              $('body').find('[data-toggle^=alertFram]').each(function (){
			            sessionTimeoutCount+=1;
		              });
					  
					  if(sessionTimeoutCount!=0){
					  return;
					  }
	        		 
	        	 }
        	 }
         }
	
	 var shield=$('<div  id="shield'+alertID+'" class="shield-mask"><iframe style="border:1px;position:absolute;top:0;left:0;width:100%;height:100%;filter:alpha(opacity=0);" ></iframe></div>');
	 var scorllHeight=$(document).height();
	
	var zIndex=11000;
     shield.css({
	 'height' : scorllHeight,
	 'z-index' : zIndex
     });
   
	 
	 var alertFram=$('<div data-toggle="alertFram" class="wrong_box" id="alertFram'+alertID+'"></div>');
     alertFram.css({
     'margin-left' : '15px',
     'margin-top' : '42.5px',
     'width' : '500px',
     'z-index':zIndex+1,
     'height' : '205px'
     });
    var title='系统提示';
    if(titleTmp){
    	title=titleTmp;
    }
  
    var     strHtml ='<div class="pop-box_top1"><div class="pop-box_top">';
    		strHtml += ' <div class="pop-t" style="font-size: 16px;height: 15px;">'+title+'</div>';
		    strHtml +='<div class="wrong_con"><div class="wrong_icon fl"></div>';
		    strHtml +='<p style="color:red;"><strong>'+txt+'</strong></p>';
		    strHtml +='<p><strong></strong></p></div>';
		    strHtml +='<div class="table_oper table_oper1"><button class="pop-search1 dook" onclick="dook(\''+alertID+'\',\''+errCode+'\')" >确&nbsp;&nbsp;&nbsp;定</button></div>';
		    strHtml +='</div></div><div class="pop-box1_bottom1"><div class="pop-box1_bottom"></div></div>';
  
     alertFram.append(strHtml)  ;
     
     var shieldCountAll=0;
		$('body').find('[data-toggle^=alertFram]').each(function (){
			shieldCountAll+=1;
		});
		
	
     /*alertFram.css(
	    		{
	    		'margin-left': -450/2+25*(shieldCountAll)+"px",
	    		'margin-top':-205/2+25*(shieldCountAll)+'px'
	    		}
	 	);*/

		
		if(shieldCountAll>0){
			 alertFram.css('display','none');
			 $('body').append(alertFram);
			 
			 alertFram.show(300*shieldCountAll,'linear');
			 

		}else{
			 $('body').append(alertFram);
			 $('body').append(shield);
		}
		ajustMaskHeight('shield'+alertID);
		
    
        	

     
     alertFram.focus();
  
     document.body.onselectstart = function(){return false;};
     alertID++;
}, 
myAlert.noConflict = function() { 
   window.myAlert = _alert; 

};
window.alert = myAlert; 

jQuery.fn.extend({
	bind: function( types, data, fn ) {
		this.off( types, null, fn );
		return this.on( types, null, data, fn );
	}	  
		
});

jQuery.fn.extend({
	live: function( types, data, fn ) {
		//console.log("aaaaa");
		jQuery(this.context).off( types, this.selector || "**", fn );
		
		return jQuery(this.context).on( types, this.selector, data, fn );
	}	  
		
});

$.extend( $.lily, {
	version: "@VERSION",
	/**
	 * 是否启用密码控件，必须与settings.xml文件的一致
	 */
	keyCodeControlEnabled : true,
	
	/*证书相关*/
	/**
	 * 是否启用签名验签，必须与settings.xml文件的一致
	 */
	signDataEnabled : false,
	/**
	 * 是否支持文件证书，生产环境应该为false
	 */
	fileCertEnabled : false,
	/**
	 * 是否支持移动证书，生产环境应该为true
	 */
	mobileCertEnabled : true,
	/**
	 * 是否使用虚拟报文
	 */
	readLocalFile: false,
	/**
	 * local file 存储文件夹
	 */
	localFilePath: "virtualHost/",
	
	signDataCertOU:'C = CN',
	
	/**
	 *渠道标志channel定义 ：个人会员中心 原01
	 */
	PC_pb_tranCenter : "1101",
	/**
	 *渠道标志channel定义 ：个人网上营业厅 原04
	 */
	PC_pb_loginService : "1102",
	/**
	 *渠道标志channel定义 ：企业会员中心 原02
	 */
	PC_cb_tranCenter : "1103",
	/**
	 *渠道标志channel定义 ：企业网上营业厅 原05
	 */
	PC_cb_loginService : "1104",
	/**
	 *渠道标志channel定义 ：快捷服务区 原06
	 */
	PC_quickService : "1105",
	/**
	 * 标准版
	 */
	stander_version : 'stanver',
	
	forbinddenKey:false,
	
	countDown:60,
	
	keyCode: {
		ALT: 18,
		BACKSPACE: 8,
		CAPS_LOCK: 20,
		COMMA: 188,
		COMMAND: 91,
		COMMAND_LEFT: 91, // COMMAND
		COMMAND_RIGHT: 93,
		CONTROL: 17,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		INSERT: 45,
		LEFT: 37,
		MENU: 93, // COMMAND_RIGHT
		NUMPAD_ADD: 107,
		NUMPAD_DECIMAL: 110,
		NUMPAD_DIVIDE: 111,
		NUMPAD_ENTER: 108,
		NUMPAD_MULTIPLY: 106,
		NUMPAD_SUBTRACT: 109,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SHIFT: 16,
		SPACE: 32,
		TAB: 9,
		UP: 38,
		WINDOWS: 91 // COMMAND
	},
	
	calculateDistanceSqrt: function(a, b) {
		var x1 = a.offset().left,
			y1 = a.offset().top,
			x2 = b.offset().left,
			y2 = b.offset().top;
		return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
	},
	
	isInElement: function(point, element) {
		var x = element.offset().left,
			y = element.offset().top,
			objWidth = element.width(),
			objHeight = element.height();
		
		
		if(x < point.x && point.x < x + objWidth && y < point.y && point.y < y + objHeight) {
			return true;
		}
		return false;
	},
	
	getContextPath: function() {
		var contextPath = document.location.pathname;
		var index =contextPath.substr(1).indexOf("/");
		contextPath = contextPath.substr(0,index+1);
		delete index;
		return contextPath;
	},
	//用户登录后服务的sessionId
	CONFIG_SESSION_ID: '',
	
	//我的当前应用
	
	myCurrentApp:'', 
	
	sequenceMap: {},
	
	_windowErrArry:{},	
	
	localization: {
		connectError: '通讯失败',
		loadingMsg: '加载中...',
		mainPage: '首页',
		closeAllPage: '关闭所有',
		noMessage: '没有通知信息',
		errorMsgRemind: '错误信息：',
		errorCodeRemind: '错误代码：'
	},
	
	ajax: function(options) {
		var option = $.extend(options, {cache:false, dataType:'json', traditional: true});
		var commRequestData = {'EMP_SID': $.lily.CONFIG_SESSION_ID, responseFormat: 'JSON','channel': $.lily.PC_pb_tranCenter,'version':$.lily.stander_version,'orgCode':$.lily.orgCode,'administratorId':$.lily.administratorId};
		
		if(options.data) {
			if(options.data.mvcId)
			$.extend(options.data ,{sequenceNo: $.lily.sequenceMap[options.data.mvcId]});
		}
		if(options.data){
		   var trimData=options.data;
		 
	       $.each(trimData,function(name,value){//去掉数据中null的值，改为空,对数据trim

				if(!$.isArray(trimData[name])){
					
					if(value=='null'||value==null||value==undefined||value=='undefined'){
						if($.type(value)==='string')
						trimData[name]='';
					}else{
						if($.type(value)==='string')
						value=$.trim(value);
						
					}
					trimData[name]=value;
				}
				
				
				
               if($.isArray(trimData[name])){
            	 
					$.each(trimData[name],function(i,value1){
						 $.each(trimData[name][i],function(m,value2){
							 
							 if(value2=='null'||value2==null||value2==undefined||value2=='undefined'){
								 if($.type(value)==='string')
								 trimData[name][i][m]='';
							 }else{
								 if($.type(value2)==='string')
								 value2=$.trim(value2);
							 }
							 trimData[name][i][m]=value2;
		            	   });
					});
				}
				
				
			});//去掉数据中null的值，改为空,对数据trim
	       
	        $.extend(options.data ,trimData);
			$.extend(options.data ,commRequestData);
		}	
		else
			options.data = commRequestData;
		
		if($.lily.readLocalFile) {
			if(options.url.indexOf('\.mvc') < 0)
				options = $.extend(options, {"url": $.lily.localFilePath + options.url });
		}


		function doResponse(data) {
            if(options.url){
				if(options.url!='getSysTime.do'){
					setTimeout(function() {
						$('#shieldModelStart').hide();
						$('#shieldModelStart').remove();
					},300);
				}
			}

			
			$.each(data,function(name,value){//去掉数据中null的值，改为空
				
				
				
				if(value=='null'||value==null||value==undefined||value=='undefined'){
					data[name]='';
				}
				
               if($.isArray(data[name])){
            	 
					$.each(data[name],function(i,value1){
						 $.each(data[name][i],function(m,value2){
							 if(value2=='null'||value2==null||value2==undefined||value2=='undefined'){
									data[name][i][m]='';
								}
		            	   });
					});
				}
				
				
			});//去掉数据中null的值，改为空
		
			
			
			if(data.ec != '0' && data.ec != '0000'){
				/*var windowIdTmp='';
				if( data.windowId){
					windowIdTmp=data.windowId;
				}*/
				if(options.data.mvcId) {				
					var sequenceNo = data.sequenceNo;
					$.lily.sequenceMap[options.data.mvcId] = sequenceNo;
				}
				if(options.selfdefineFailed){
					
					options.selfdefineFailed(data);
					
				}else if(options.transactionFailed) {
					
					options.transactionFailed(data);
					
					/*if(data.windowId == 'null' ||( windowIdTmp.length == 36)){
						options.transactionFailed(data);
					}else{	

						if($("#task-"+windowIdTmp).hasClass('active')) {
							options.transactionFailed(data);
						}else{
							for(var i=0;i<3;i++)
								$("#task-"+windowIdTmp).fadeOut(600).fadeIn(600);
							$("#task-"+windowIdTmp).css({backgroundColor: '#3b1707'});						
							
							var errStr = $.lily._windowErrArry[windowIdTmp];
							if(errStr === undefined)
								errStr = data.em+"#"+data.ec;
							else	
								errStr += "|" + data.em+"#"+data.ec;
							$.lily._windowErrArry[windowIdTmp] = errStr;
						}
					}	*/
					
					
				}else{
					
					myAlert($.lily.localization.errorCodeRemind+$.lily.param.translateSysFlag(data.ec)+"<br>"+$.lily.localization.errorMsgRemind+data.em,data);
					
				/*	var alertOptions={type:'error-remind'};
					alertOptions.ec=data.ec;
					
					if(data.windowId == 'null' || (windowIdTmp.length == 36)){
					    
					    
						myAlert($.lily.localization.errorCodeRemind+$.lily.param.translateSysFlag(data.ec)+"<br>"+$.lily.localization.errorMsgRemind+data.em,alertOptions);
					}else{
											
						if($("#task-"+windowIdTmp).hasClass('active')) {
							myAlert($.lily.localization.errorCodeRemind+$.lily.param.translateSysFlag(data.ec)+"<br>"+$.lily.localization.errorMsgRemind+data.em,alertOptions);
						}else{
							for(var i=0;i<3;i++)
								$("#task-"+windowIdTmp).fadeOut(600).fadeIn(600);
							$("#task-"+windowIdTmp).css({backgroundColor: '#3b1707'});
							
							var errStr = $.lily._windowErrArry[windowIdTmp];
							if(errStr === undefined)
								errStr = data.em+"#"+data.ec;
							else	
								errStr += "|" + data.em+"#"+data.ec;
							$.lily._windowErrArry[windowIdTmp] = errStr;
						}	
					}*/						
					
				}
			}
			else
				options.processResponse(data);
		}
		
		if(options.processResponse) {
			$.extend(options, {success: doResponse});
		}
		
		function processFailed() {
			alert($.lily.localization.connectError);
		}
		
		if(options.processFailed)
			$.extend(options, {error: options.processFailed});
		else
			$.extend(options, {error: processFailed});
		
		
		return $.ajax(option);
	},
	
	
	generateUID : function() {
		var guid = "";
		for (var i = 1; i <= 32; i++){
			var n = Math.floor(Math.random()*16.0).toString(16);
			guid += n;
			if((i==8)||(i==12)||(i==16)||(i==20))
				guid += "-";
		}
		return guid;    
	},
	judgeVersion: function(){
		userAgent=window.navigator.userAgent.toLowerCase();
		if(userAgent.indexOf("msie 6.0")!=-1){
			return "ie6";
		}
		if(userAgent.indexOf("msie 7.0")!=-1){
			return "ie7";
		}
		if(userAgent.indexOf("msie 8.0")!=-1){
			return "ie8";
		}
		if(userAgent.indexOf("msie 9.0")!=-1){
			return "ie9";
		}
		if(userAgent.indexOf("msie 10.0")!=-1){
			return "ie10";
		}
		if(userAgent.indexOf("firefox")>=1){
			return "firefox";
		}
		return userAgent;
	},
	print: function(item) {
		if(null==item || null==item.table){
			return;
		}
		var table=item.table.clone();
		var width=900;
		var height=500;
		if(!$.lily.format.isEmpty(item.width)){
			width=item.width;
		}
		if(!$.lily.format.isEmpty(item.height)){
			height=item.height;
		}
		if(!$.lily.format.isEmpty(item.title)){
			table.append($('<caption style="text-align:center;">'+item.title+'</caption><br>'));
		}
		item.hides=[];
		table.find('tr').first().find('td').each(function(i,n){
			var printHide=$(this).attr('printHide');
			if(!$.lily.format.isEmpty(printHide) && printHide=='true'){
				item.hides[item.hides.length]=i;
			}
		});
		table.find('tr').each(function(i,n){
			$(this).children('td').each(function(index,tr){
				for(var j=0;j<item.hides.length;j++){
					if(item.hides[j]==index){
						$(this).remove();
					}
				}
			});
		});
		var printer = window.open('','','width='+width+',height='+height);
		printer.document.open("text/html");
		$(document).find("link").filter(function() {
			return $(this).attr("rel").toLowerCase() == "stylesheet";
		}).each(
			function() {
				printer.document.write('<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >');	
			}
		);
		
     		printer.document.write(table[0].outerHTML);
		
		
			
			printer.print();
			printer.document.close();
			printer.window.close();
		
		
	},
	showLoadModelStart: function() {
		var sty=$("div[id='clearCon']:first").prev().attr("style");
		var left=':0px;';
		if(sty!=null&&sty.indexOf("margin-left")!=-1){
			var styStr=sty.substring(sty.indexOf("margin-left"),sty.length);
			var left=styStr.substring(styStr.indexOf(":"),styStr.indexOf(";"));
		}
		if($("div[class='loading-mask']:first").html()!=null){
			var html=$("div[class='loading-mask']:first").html();
			var con='<div id="shieldModelStart" class="loading-mask" style="position: absolute; width: 1000px; height: 1000px; top: 0px;display: block;margin-left'+left+';">'
				+html+'</div>';
			$("div[class='loading-mask']:first").before(con);
		}else{
			var shield=$('<div id="shieldModelStart" class="loading-mask"><iframe frameborder="0" scrolling="no" style="border:1px;position:absolute;top:0;left:0;width:100%;height:100%;" '
					+'src="css/loadding.html"></iframe></div>');
			 var scorllHeight=$(window).height();
			 shield.css({
			     'position':'absolute',
			     'left' : '0px',
				 'top' : '0px',
				 'width' : '100%',
				 'text-align' : 'center',
				 'height' : scorllHeight,
				 'z-index' : 11000,
				 'display': 'block'
			});
			$('body').append(shield);
		}
	},
	LoadModelUserDefined: function( height, width, opacity ) {//自定义遮罩 可控高宽度
		var sty=$("div[id='clearConterritory']:first").prev().attr("style");
		var left=':0px;';
		if(opacity != undefined && opacity != "") {
			opacity ='opacity: '+opacity+'; ';
		}else{
			opacity='';
		}
		if(height == undefined || height == "") {
			height=645;
		}
		if(width == undefined || width == "") {
			width=722;
		}
		if(sty!=null&&sty.indexOf("margin-left")!=-1){
			var styStr=sty.substring(sty.indexOf("margin-left"),sty.length);
			var left=styStr.substring(styStr.indexOf(":"),styStr.indexOf(";"));
		}
		if($("div[class='loading-mask']:first").html()!=null){
			var html=$("div[class='loading-mask']:first").html();
			var con='<div id="shieldModelStart" class="loading-mask" style="'+opacity+'position: absolute; width: '+width+'px; height: '+height+'px; top: 0px;display: block;margin-left'+left+';">'
				+html+'</div>';
			$("div[class='loading-mask']:first").before(con);
		}else{
			var shield=$('<div id="shieldModelStart" class="loading-mask"><iframe frameborder="0" scrolling="no" style="'+opacity+'border:1px;position:absolute;top:0;left:0;width:100%;height:100%;" '
					+'src="css/loadding.html"></iframe></div>');
			 var scorllHeight=$(document).height();
			 shield.css({
			     'position':'absolute',
			     'left' : '0px',
				 'top' : '0px',
				 'width' : '100%',
				 'text-align' : 'center',
				 'height' : height,
				 'z-index' : 11000,
				 'display': 'block'
			});
			$('body').append(shield);
		}
	}
});




})( jQuery );
var objectForpwd;

function dook(alertID,errorCode){
	objectForpwd.css("visibility","visible");
    $('#alertFram'+alertID).remove();
    $('#shield'+alertID).remove();
    setTimeout(function() {
    	$('#shieldModelStart').hide();
		$('#shieldModelStart').remove();
	},300);
   	if('20000' == errorCode||'EBLN1001' == errorCode){
   		window.location.href = $.lily.contextPath + 'login.html'; 
   	}
};

function addFavorite(){
	//var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd':'Ctrl';
	   if(document.all)
	   {
	      window.external.addFavorite(window.location,document.title);
	   }
	   else if(window.sidebar)
	   { 
	       window.sidebar.addPanel(document.title,window.location);
	   }
	   else{
	       alert('添加失败，请用Ctrl+D进行添加');
	   }
}

/**
 * 密码控件配置信息
 */
var WIN_32_ACTIVEX_VERSION = 2005000007;                		// Windows系统下32位控件版本号，例如2.4.1.3版本号则为2004001003
var WIN_64_ACTIVEX_VERSION = 2005000007;                		// Windows系统下64位控件版本号，例如2.4.1.3版本号则为2004001003
var WIN_PLUGIN_VERSION = 2005000007;                    		// Windows系统下插件版本号，例如2.4.1.3版本号则为2004001003
var MAC_PLUGIN_VERSION = 2005000007;                    		// Windows系统下插件版本号，例如2.4.1.3版本号则为2004001003
var WIN_SETUP_PATH = $.lily.getContextPath()+"/setup/iSecurityBODL.exe";          		// Windows系统下安装程序下载路径
var MAC_SETUP_PATH = $.lily.getContextPath()+"/setup/iSecurityBODL.pkg";					// Mac OS系统下安装程序下载路径
var WIN_32_CAB_PATH = $.lily.getContextPath()+"/setup/iSecurityBODL.ocx#version=2,5,0,7";
var WIN_64_CAB_PATH = $.lily.getContextPath()+"/setup/iSecurityBODL_x64.ocx#version=2,5,0,7";
var codeBaseFile = "";
var LocalObjVersion="";
var isInistall = false;

// 控件
var PassCtrlClsid = "clsid:1079B8D1-E9E7-420F-8C9C-CD26E350978E";
var EditCtrlClsid = "clsid:98C5A190-80B5-4DCF-B380-B93345418DFA";
var UtilCtrlClsid = "clsid:AFE1CA8E-9F51-44F4-921A-2FE3C9F1D006";
var CtlName = "POWERENTERBODL.PowerUtilityXBODLCtrl.1";

// 插件
var MIME = "application/x-vnd-sa-isecurity-bodl";
var PluginDescription = "SA-iSecurity Plug-in for BODL";