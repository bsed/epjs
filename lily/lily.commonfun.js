/**
*lily常量定义
**/
(function( $, undefined ) {
	
	$.lily.commonfun = $.lily.commonfun || {};


$.extend( $.lily.commonfun, {
    
     
    loadVerifyImg :function(targetId,recAccountName,payAmount,recAccount, currentMvc,currentElement){
		$('#'+targetId,currentElement).attr("src", $.lily.getContextPath() + '/generateImage.do?EMP_SID='+$.lily.CONFIG_SESSION_ID + '&mvcId=' + 
				currentMvc.id +'&windowId='+ currentMvc.windowId+
				'&update=' + Math.random()+'&recAccountName='+recAccountName+
				'&payAmount='+payAmount+'&recAccount='+recAccount);
	},
	generateNumMap:function(num,startNum,suppZero){
		//suppZero  补零 true|false
		var map=[];
		for (var i=startNum;i<num;i++){
			var value= i+'';
			if(suppZero){
				if(value.length<2){
					value = '0'+i;
				}
			}
			
			map[value]=value;
		}
		return map;
	},
	getSysDate:function(){
		currentDate = null;
		$.lily.ajax({
			url : 'getSysTime.do',
			type : 'post',
			async:false,
			data:{"channel":$.lily.sessionData.session_channel},
			processResponse : function(data) {
				
				currentDate = data.sysDate;
			}
		});
		return currentDate;
	},
	getSysTime:function(){
		currentTime = null;
		$.lily.ajax({
			url : 'getSysTime.do',
			type : 'post',
			async:false,
			data:{"channel":$.lily.sessionData.session_channel},
			processResponse : function(data) {
				currentTime = data.sysDate+data.sysTime;
			}
		});
		return currentTime;
	},
	 openTabBarWindow:function(tranCode,currentElement,appendTo){
		var finalAppendTo = '#firstTransition';
		
		if(appendTo){
			$(appendTo,currentElement).html('');
			finalAppendTo =  appendTo;
		}
		$(finalAppendTo,currentElement).html('');
		
		$.openWindow({
			tranCode: tranCode,
			showFun: null,
			appendTo:finalAppendTo,
			currentElement:currentElement
		});
		
	},
	/**
	 * 获取开始时间方法
	 * valueDay:传入的天数
	 * formatvalue:传入的格式,如yyyyMMdd或者yyyyMMddHHmmss
	 * 
	 */
	 getBeginDay:function (valueDay, formatvalue, currentElement){
		 if(valueDay==null || valueDay=='' || valueDay==undefined){
			 return valueDay="";
		 }
		var valDay = parseInt(valueDay);
		var endDate = $.lily.commonfun.getSysDate();//获取系统时间
		var checkValue =$.lily.format.parseDate(endDate.replace(new RegExp("-","g"),''),'yyyymmdd');//转化为标准日期
		endDay  = checkValue.getTime();
		var day = Math.floor(Math.abs(valDay*24*3600*1000));
		var beginDate = endDay-day;
		var time = new Date(beginDate);
		var year = time.getFullYear()+"";
		var month = fmd(time.getMonth()+1)+"";
		var date = fmd(time.getDate())+"";
		var hour = fmd(time.getHours())+"";
		var minute = fmd(time.getMinutes())+"";
		var second = fmd(time.getSeconds())+"";
		if(formatvalue.length=="8"){
			return year+month+date;
		}else if(formatvalue.length=="14"){
			return year+month+date+hour+minute+second;
		}
		
	}
	
	
  });

	//字符串多长显示点点点

	$.lily.cutString = $.lily.cutString || {};
	$.extend( $.lily.cutString, {
		cutStringDot:function(stringWord,len){

			var reg = /[^x00-xff]/ ;
			var len = len ? len*2 : 12;//字符串长度
			var count = 0;
			for(var i=0;i<stringWord.length;i++){
				if(reg.test(stringWord.charAt(i)) && stringWord.charAt(i)!="y" && stringWord.charAt(i)!="z"){
					count +=2;
				}else{
					count++;
				}
				if(count >len){
					var str=stringWord.substring(0,i)+'…';
					return str;
				}
			}
			/*var cutedWord;
			if(stringWord.length>parseInt(len)){
				cutedWord=stringWord.substring(0,len)+'…';
			}else{
				cutedWord=stringWord;
			};*/

			return stringWord;
		}
	});
	//字符串多长显示点点点
	var cutString=$('[cut-string]');
	for(var i=0;i<cutString.length;i++){
		var len=cutString.eq(i).attr('cut-string');
		cutString.eq(i).html(cutString.eq(i).html().substring(0,len)+'…');
	};
})( jQuery );
