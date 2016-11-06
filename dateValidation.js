/**
 * 覆盖交易，如下
 * 1、交易日志查询（标准版）
 */

/**
 * 网银常规日期校验
 * 日期公共参数
 */
var pub_yearDate = ''; //系统年
var pub_monthDate = ''; //系统月
var pub_dateDate = ''; //系统日
/**
 * 获取服务端系统时间
 * @returns {String}
 */
function getCurrentSysTime(){
	$.lily.ajax({
		url : 'getSysTime.do',
		type : 'post',
		async:false,
		data:{"channel":$.lily.sessionData.session_channel},
		processResponse : function(data) {
			pub_yearDate = data.sysDate.substring(0,4);
			pub_monthDate = data.sysDate.substring(4,6);
			pub_dateDate = data.sysDate.substring(6,8);
		}
	});
	var currentSysTime = pub_yearDate + "-" + pub_monthDate + "-" + pub_dateDate;
	return currentSysTime ;
}

/**
 * 获取前一年的1月1日
 */
function getPreYearTime(){
	getCurrentSysTime();//获取当前系统时间
	var preYearDate;//前一年的1月1日
	preYearDate = (pub_yearDate-1) + '-' + 1 + '-' + 1;

	return preYearDate;
}

/**
 * 校验开始时间
 * @param startDt 日期控件标签id
 * @param startDtTip 错误提示标签id
 */
function judgeBeginDate(startDt,startDtTip){
	var startDt = $("#"+startDt).val();//获取指定的开始时间
	var preYearTime = getPreYearTime(); //前一年的1月1日
	var startResult = compareDate(startDt,preYearTime);  //开始时间与上一年1月1日比较
	if(startResult < 0){  //起始日期不能早于上一年1月1日(开始日期应大于上一年的1月1日)
		$("#" + startDtTip).text('起始日期不能早于前一年1月1日');  //
		return false;
	}
	
	var currentTime = getCurrentSysTime();//获取当前系统时间
	startResult = compareDate(currentTime,startDt); //开始日期不应大于当前日期
	if(startResult < 0){//终止时间>当前时间
		$("#" + startDtTip).text('起始日期不能超过当前日期');
		return false;
	}
	$("#" + startDtTip).text('');
	return true;
}

/**
 * 校验结束时间
 * @param endDt 日期控件标签id
 * @param endDtTip 错误提示标签id
 */
function judgeEndDate(endDt,endDtTip){
	var endDt = $("#" + endDt).val();//获取用户指定结束结束时间
	var currentTime = getCurrentSysTime();//获取当前系统时间
	var endResult = compareDate(currentTime,endDt); //当前时间与终止时间比较
	if(endResult < 0){//终止时间>当前时间
		$("#" + endDtTip).text('截止日期不能超过当前日期');
		return false;
	}
	
	var preYearTime = getPreYearTime(); //前一年的1月1日
	endResult = compareDate(endDt,preYearTime);  //开始时间与上一年的1月1日比较
	if(endResult < 0){  //起始日期不能早于前一年1月1日
		$("#" + endDtTip).text('截止日期不能早于上一年1月1日');
		return false;
	}
	$("#" +　endDtTip).text('');
	return true;
}

/**
 * 起始时间比较截止时间
 * @param startDt 起始时间：日期控件标签id
 * @param endDt 截止时间：日期控件标签id
 * @param startDtTip 起始时间：错误提示标签id
 * @param endDtTip 截止时间：错误提示标签id
 */
function startDtComEndDt(startDt,startDtTip,endDt,endDtTip){
	if(judgeEndDate(endDt,endDtTip)){ //截止日期（通过基础校验）
		var startDt = $("#" + startDt).val();//获取用户指定起始时间
		var endDt = $("#" + endDt).val();//获取用户指定截止时间
		startResult = compareDate(startDt,endDt);
		if(startResult > 0){ //异常：开始时间大于结束时间
			$("#" + startDtTip).text('起始日期不能大于截止日期');
			return false;
		}
		$("#" + startDtTip).text('');
		return true;
	}
	return false;
}

/**
 * 截止时间比较起始时间
 * @param startDt 起始时间：日期控件标签id
 * @param endDt 截止时间：日期控件标签id
 * @param startDtTip 起始时间：错误提示标签id
 * @param endDtTip 截止时间：错误提示标签id
 */
function endDtComStartDt(startDt,startDtTip,endDt,endDtTip){ 
	if(judgeBeginDate(startDt,startDtTip)){ //起始日期（符合基础校验）
		var startDt = $("#" + startDt).val();//获取用户指定起始时间
		var endDt = $("#" + endDt).val();//获取用户指定截止时间
		endResult = compareDate(startDt,endDt); 
		if(endResult > 0){//异常：开始时间大于结束时间
			$("#" + endDtTip).text('截止日期不能小于起始日期');
			return false;
		}
		$("#" + endDtTip).text('');
		return true;
	}
	return false;
}

/**
 * 对日期比较结果进行合法性判断
 * @param startDt 起始时间：日期控件标签id
 * @param endDt 截止时间：日期控件标签id
 * @param startDtTip 起始时间：错误提示标签id
 * @param endDtTip 截止时间：错误提示标签id
 * @param isValidThreeMonth 是否检验三个月的时间跨度 true是，false否
 */
function doCommonCompareDate(startDt,startDtTip,endDt,endDtTip,isValidThreeMonth,monthSpan){
	if(judgeBeginDate(startDt,startDtTip) & judgeEndDate(endDt,endDtTip)){ //开始日期和结束日期（基础校验）
		//日期比较校验
		if(startDtComEndDt(startDt,startDtTip,endDt,endDtTip)) { //日期比较校验
			if(isValidThreeMonth){ //校验三个月的时间跨度的合法性
				if(noAllowCrossThreeMonths(startDt,endDt,endDtTip,monthSpan)){ //三个月跨度校验
					return true;
				}else{
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

/**
 * 时间跨度不能超过3个月
 * @param startDt 起始时间：日期控件标签id
 * @param endDt 截止时间：日期控件标签id
 * @param startDtTip 起始时间：错误提示标签id
 * @param monthSpan 月份跨度
 */
function noAllowCrossThreeMonths(startDt,endDt,endDtTip,monthSpan){
	var startDtTmp = $("#" + startDt).val();
	var endDtTmp = $("#" + endDt).val().replace(/\-/g,""); //去除日期中的符号
    var year = endDtTmp.substring(0,4);  //取截止日期年份
    var month = endDtTmp.substring(4,6); //取截止日期月份
    var day= endDtTmp.substring(6,8); //取截止日期日期
	//indexOf返回-1表示不存在，首位为0
    //month = month.indexOf("0")>-1?month.substr(1,1):month;
	//使用parseInt(month, '10'),否则前缀为0的字符串被默认为八进制
    var newMonth = parseInt(month, '10') - parseInt(monthSpan); //新月份减去月份跨度（一般为3个月）
    var newYear=year; //新年份
    var newDay=day; //新日期
    if(newMonth == 4 || newMonth == 6 || newMonth == 9 || newMonth == 11){
		if(newDay>30){
			newDay=30;
		}
	}
    //判断当前年为闰年，闰年2月29天
    if((parseInt(newYear)%4==0&&parseInt(newYear)%100!=0)||parseInt(newYear)%400==0){
    	if(newMonth==2&&parseInt(newDay)>29){
        	newDay=29;
        }
    }else{
    	if(newMonth==2&&parseInt(newDay)>28){
        	newDay=28;
        }
    }
    
    if(newMonth < 0){
    	newMonth=12+newMonth;
    	newYear=year-1;
    }
    if(newMonth == 0){
    	newMonth=12;
    	newYear=year-1;
    }
    if(newMonth > 0 && newMonth < 10){
    	 newMonth='0'+newMonth;
     }
    
    var newEndDtThreeMonthAgo = newYear+"-"+newMonth+"-"+newDay; //截止日期三个月前的日期
    //截止日期不能大于起始日期超过3个月
	var result = compareDate(startDtTmp,newEndDtThreeMonthAgo);
	if(result < 0){
		$('#' + endDtTip).text('截止日期不能大于起始日期超过' + monthSpan + '个月');
		return false;
	}
	return true;
}

/**
* 获取六个月前的当天时间
*/
function getSixMonthsAgoTime(){
	getCurrentSysTime();//获取当前系统时间
	var sixMonthsAgoTime;
	var month = pub_monthDate -6;
	if(month < 1){
		sixMonthsAgoTime = (pub_yearDate-1) + '-' + (12 + month) + '-' + pub_dateDate;
	}else{
		sixMonthsAgoTime = pub_yearDate + '-' + month + '-' + pub_dateDate;
	}
	return sixMonthsAgoTime;
}

/**
 * 只支持半年内的明细查询
 */
function noCrossPreSixMonths(startDt,startDtTip){
	var startDtTmp = $("#" + startDt,_currentElement).val();//获取用户指定开始时间
	var preSixMonthsTime = getSixMonthsAgoTime(); //获取6个月前的时间
	var startResult = compareDate(startDtTmp,preSixMonthsTime);  //开始时间与6个月前时间比较
	if(startResult < 0){  //起始日期不能早于6个月前的时间
		$("#" + startDtTip).text('只支持半年内的明细查询');  //
		return false;
	}
	return true;
}

/**
 * 对日期比较结果进行合法性判断
 * @param startDt 起始时间：日期控件标签id
 * @param endDt 截止时间：日期控件标签id
 * @param startDtTip 起始时间：错误提示标签id
 * @param endDtTip 截止时间：错误提示标签id
 * @param isValidThreeMonth 是否检验三个月的时间跨度 true是，false否
 */
function doCommonCompareDateSix(startDt,startDtTip,endDt,endDtTip,isValidPreSixMonth){
	if(judgeBeginDateSix(startDt,startDtTip) & judgeEndDateSix(endDt,endDtTip)){ //开始日期和结束日期（基础校验）
		//日期比较校验
		if(startDtComEndDt(startDt,startDtTip,endDt,endDtTip)) { //日期比较校验
			if(isValidPreSixMonth){ //校验六个月的时间跨度的合法性
				if(noCrossPreSixMonths(startDt,startDtTip)){ //三个月跨度校验
					return true;
				}else{
					return false;
				}
			}
			return true;
		}
	}
	return false;
}

/**
 * 校验开始时间
 * @param startDt 日期控件标签id
 * @param startDtTip 错误提示标签id
 */
function judgeBeginDateSix(startDt,startDtTip){
	var startDt = $("#"+startDt).val();//获取指定的开始时间
	var preSixMonthsTime = getSixMonthsAgoTime(); //获取6个月前的时间
	var startResult = compareDate(startDt,preSixMonthsTime);  //开始时间与上一年1月1日比较
	if(startResult < 0){  //起始日期不能早于上一年1月1日(开始日期应大于上一年的1月1日)
		$("#" + startDtTip).text('只支持半年内的明细查询');  //
		return false;
	}
	
	var currentTime = getCurrentSysTime();//获取当前系统时间
	startResult = compareDate(currentTime,startDt); //开始日期不应大于当前日期
	if(startResult < 0){//终止时间>当前时间
		$("#" + startDtTip).text('起始日期不能超过当前日期');
		return false;
	}
	$("#" + startDtTip).text('');
	return true;
}

/**
 * 校验结束时间
 * @param endDt 日期控件标签id
 * @param endDtTip 错误提示标签id
 */
function judgeEndDateSix(endDt,endDtTip){
	var endDt = $("#" + endDt).val();//获取用户指定结束结束时间
	var currentTime = getCurrentSysTime();//获取当前系统时间
	var endResult = compareDate(currentTime,endDt); //当前时间与终止时间比较
	if(endResult < 0){//终止时间>当前时间
		$("#" + endDtTip).text('截止日期不能超过当前日期');
		return false;
	}
	
	var preSixMonthsTime = getSixMonthsAgoTime(); //获取6个月前的时间
	endResult = compareDate(endDt,preSixMonthsTime);  //开始时间与上一年的1月1日比较
	if(endResult < 0){  //起始日期不能早于前一年1月1日
		$("#" + endDtTip).text('只支持半年内的明细查询');
		return false;
	}
	$("#" +　endDtTip).text('');
	return true;
}


/**
 * 日期比较
 * @param startDt
 * @param endDt
 */
function compareDate(startDt,endDt){
	var date1 = new Date(startDt.replace(/\-/g,"\/")); //如此替换，日期才能进行减法的比较运算
	var date2 = new Date(endDt.replace(/\-/g,"\/"));
	return date1-date2;
}
