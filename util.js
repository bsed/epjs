/*
 * 1、由当前日期计算出“monthCount”个月的月份数组
 * 2、格式化日期：日期格式：有YYYYMMDD转换成YYYY-MM-DD
 * 3、精确计算浮点数 --两个数相加
 * 4、精确计算浮点数 --两个数相减
 * 5、格式化数字，保留几位小数
 * 6、动态的给select拼接下挂账户
 * 7、计算两个日期之间的关系：例如大小，相隔天数
 * 8、异步请求自动给表单域赋值
 * 9、截取账号的前N位。
 * 10、判断是否被选择
 * 11、把某个范围内的表单域拼接成json对象，name为key，值为value
 * 13、对某个范围内进行验证输入框的合法与否
 * 14、异步验证
 * 15、异步提交
 * 16、动态给予select赋值，拼接option
 */
var paramMessageForShow = ["请选择要查询的账户","开始日期不能大于结束日期","只能查询近一年内的记录","开始日期不能大于当前日期","可用余额：","元"];
/*1、
 * 根据当前月计算出一年的年和月
 * 返回数组，数组内容格式为：YYYY-MM
 * 传入参数：当前时间格式为YYYYMMDD,monthCount月数
 */
function getNowMonth(sysDate,monthCount){
	var year = sysDate.substring(0,4);  //年
	var month = sysDate.substring(4,6); //月
	var day = sysDate.substring(6,8);   //日
	var newDate = [];
	var nowDate = new Date(year,month-1,day);
	if(sysDate!=null&&sysDate!=""){
		for ( var i = 0; i < monthCount; i++) {
			if(i==0){
				nowDate.setMonth(nowDate.getMonth()*1);
			}else{
				nowDate.setMonth(nowDate.getMonth()*1-1);
			}
			var month1 = nowDate.getMonth()+1;
			var year1 = nowDate.getFullYear();
			if(month1*1<10){
				month1 = "0"+ month1;
			}
			newDate[i] = year1+"-"+month1;
		}
	}
	return newDate;
}

/*2、
 * 输入格式为YYYYMMDD,或者YYYYMM
 * 返回格式为YYYY-MM-dd或者YYYY-MM
 */
function changDate(value){
	var flag= "";
	if(value!=null&&value!=""){
		value = $.trim(value);
		if(value.length>=14){
			var yyyy = value.substring(0,4);
			var mm = value.substring(4,6);
			var dd = value.substring(6,8);
			var hh = value.substring(8,10);
			var min = value.substring(10,12);
			var sec = value.substring(12,14);
			flag = yyyy+"-"+mm+"-"+dd+" "+hh+":"+min+":"+sec;
		}else if(value.length==8){
			var yyyy = value.substring(0,4);
			var mm = value.substring(4,6);
			var dd = value.substring(6,8);
			flag = yyyy+"-"+mm+"-"+dd;
		}else if(value.length==6){
			var yyyy = value.substring(0,4);
			var mm = value.substring(4,6);
			flag = yyyy+"-"+mm;
		}else if(value.length==4){
			var year = "20"+value.substring(0,2);    //年
			var month = value.substring(2,4);    //月
			flag = year + "-" + month;
		}else{
			flag = value;
		}
	}
	return flag;
}
/*、3、精确计算浮点数      两个数相加(保留n位小数，四舍五入),默认保留两位小数*/
function jia(arg1,arg2,n){
	if(n==null||n==""||n==undefined){
		n=2;
	}
	var r1,r2,m;
	try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
	try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
	m = Math.pow(10,Math.max(r1,r2));
	return  forDight((arg1*m+arg2*m)/m,n);
}
/*4、精确计算浮点数  两个数相减(保留flage位小数，四舍五入),默认保留两位小数*/
function jian(arg1,arg2,flage){
	if(flage==null||flage==""||flage==undefined){
		flage=2;
	}
    var r1,r2,m,n;
    try{r1=arg1.toString().split(".")[1].length;}catch(e){r1=0;}
    try{r2=arg2.toString().split(".")[1].length;}catch(e){r2=0;}
    m = Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return forDight(((arg1*m-arg2*m)/m).toFixed(n),flage);
}
/*5、格式化数字*/
function forDight(value,pointNum){
	var flage = Math.pow(10,pointNum);
	var result = Math.round(value*flage)/flage;
	return result;
}
/*
 * 6、动态的给借记卡：select拼接下挂账户
 * 传入参数： (1)nameValue：select的name名称；  
 * 			 (2)accountType账户类别为json对象：例如'{"01":"01"}'为贷记卡 ,如需要两个类别'{"01":"01","00":"00"}'
 * 			 (3)如果需要哪个账号默认选中，传入该账户值
 *           (4)如果为空的替代字符，例如"--"  （5）传入参数为当前页面，目前写死currentElement;
 *           (5)flag，如何下拉账户后面跟着查询余额按钮，此字段传入1即可，如果不需要此功能不传既可。
 * 拼完格式为：账号/别名/卡类别
 */
function dealAccountForBankCard(nameValue,accountType,realAccount,nullType,nowWeb,flag,currentMVC,currencyType,code,amount){
	var windowId = "";
	if(!(currentMVC==null||currentMVC==undefined||currentMVC=="")){
		windowId = currentMVC.windowId;
	}
	if(currencyType==null||currencyType==""||currencyType==undefined){
		currencyType = "01";
	}
	var accountList;
	$.lily.ajax({
	    url: "queryAllAccounts.do",
	    type: 'post', 
	    dataType:'json',
	    async:false,
	    data:{'currentBusinessCode':'00000504','windowId':windowId,"currencyType":currencyType},
	    processResponse: function(data){
	    	var accountTypeJson = $.parseJSON(accountType); 
	    	accountList = data.iAccountInfoList;              			   //下挂账户信息
	    	var name = "select[name='"+nameValue+"']";                     				   //下拉框
	    	$(name,nowWeb).find("option:gt(0)").remove();
	    	var buttonObj = $(name,nowWeb).parents("td:first").find("a");            //select后查询余额按钮
	    	for ( var i = 0; i < accountList.length; i++) {
	    		var accountNoSession = accountList[i].accountNo;         					    // 下挂账户
	    		var accountNoSession1 = $.lily.format.dealAccountNoHide(accountNoSession);                        // 脱敏账户
	    		var accountAliasSession = accountList[i].accountAlias;   					     //下挂别名
	    		var cardTypeSession = $.lily.param.getDisplay("PB_ACC_TYPE",accountList[i].accountType);      //下挂类型
	    		if(accountType!=null&&accountType!=""){
	    			if(accountTypeJson[accountList[i].accountType]){      	//如果为借记卡
	    				if("00300600"==code){
    						var openNode=accountList[i].accountOpenNode;
    						if(openNode!=null&&openNode!=""&&"012"==openNode.substring(0,3)){
    							var optionBegin = "<option ";
    		    				var accountNoOther = optionBegin+"value='"+accountNoSession+"' id='"+accountNoSession+"' alias='"+accountAliasSession+"' cctype='"+accountList[i].accountType+"'";+accountNoSession;
    		    				if(accountList[i].accountNo==realAccount){         				//预备选中的账户
    		    					if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
    		    						accountNoOther = accountNoOther +" selected >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
    		    					}else{
    		    						accountNoOther = accountNoOther+" selected >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
    		    					}	
    		    				}else{
    		    					if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
    		    						accountNoOther = accountNoOther +" >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
    		    					}else{
    		    						accountNoOther = accountNoOther+" >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
    		    					}	
    		    				}
    		    				$(name,nowWeb).append(accountNoOther);
    						}
    					}else{
    						var optionBegin = "<option ";
    	    				var accountNoOther = optionBegin+"value='"+accountNoSession+"' id='"+accountNoSession+"' alias='"+accountAliasSession+"' cctype='"+accountList[i].accountType+"'";+accountNoSession;
    	    				if(accountList[i].accountNo==realAccount){         				//预备选中的账户
    	    					if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
    	    						accountNoOther = accountNoOther +" selected >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
    	    					}else{
    	    						accountNoOther = accountNoOther+" selected >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
    	    					}	
    	    				}else{
    	    					if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
    	    						accountNoOther = accountNoOther +" >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
    	    					}else{
    	    						accountNoOther = accountNoOther+" >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
    	    					}	
    	    				}
    	    				$(name,nowWeb).append(accountNoOther);
    					}
	    			}
	    		}else{
	    			var optionBegin = "<option ";
	    			var accountNoOther = optionBegin+"value='"+accountNoSession+"' id='"+accountNoSession+"' alias='"+accountAliasSession+"' cctype='"+cardTypeSession+"'";+accountNoSession;
	    			if(accountList[i].accountNo==realAccount){         //预备选中的账户
	    				if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
	    					accountNoOther = accountNoOther +" selected >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
	    				}else{
	    					accountNoOther = accountNoOther+" selected >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
	    				}	
	    			}else{
	    				if(accountAliasSession==null||accountAliasSession==''){   //如果别名为空
	    					accountNoOther = accountNoOther +" >"+accountNoSession1+"/"+nullType+"/"+cardTypeSession+"</option>";
	    				}else{
	    					accountNoOther = accountNoOther+" >"+accountNoSession1+"/"+accountAliasSession+"/"+cardTypeSession+"</option>";
	    				}	
	    			}
	    			$(name,nowWeb).append(accountNoOther);
	    		}
	    	}
	    	var balanceName = "ZHHUYE";                 //余额字段 
	    	var mvcName = "queryAccountBalance";        //查询余额mvc的名称
	    	if(flag=="1"||flag=="2"){                                      
	    		buttonObj.bind("click",function(){
	    			if(validatorCheckByAsy($(name,nowWeb).parent())){
	    				ajaxQueryBlanceMessage("ZHHUYE","querySingleBalanceDL",buttonObj,currentMVC,$(name,nowWeb).val());
	    			}
	    		})
	    		/*
	    		 * 账户
	    		 */
	    		$(name,nowWeb).bind("change",function(){
	    			buttonObj.next().text("");//去掉上一次的错误提示
	    			$(this).next("a").show();
	    			$(this).next("a").next("#test").remove();
	    			if(flag=="2"){
	    				if(validatorCheckByAsy($(name,nowWeb).parent())){
		    				ajaxQueryFeeCount(buttonObj,currentMVC,code,accountList,$(name,nowWeb).val(),amount);
		    			}else{
		    				buttonObj.parent().parent().next().remove();
		    			}
	    			}
	    		});
	    	}
	    	if(!$("#"+nameValue,nowWeb).children().first().is("option")){//未下挂账户
	    		alert("无可用账号，请先到我的地盘--我的账户功能中，加挂可用账号！");
	    	}else{//第一个option为“请选择”
	    		if($("#"+nameValue,nowWeb).children().first("option").val()==""||$("#"+nameValue,nowWeb).children().first("option").val()==" "||$("#"+nameValue,nowWeb).children().first("option").val()==null){
	    			if($("#"+nameValue,nowWeb).children().first("option").next("option").val()==""||$("#"+nameValue,nowWeb).children().first("option").next("option").val()==" "||$("#"+nameValue,nowWeb).children().first("option").next("option").val()==null){
	    				alert("无可用账号，请先到我的地盘--我的账户功能中，加挂可用账号！");
	    			}
	    		}
	    	}
		}
	});
}
//查询手续费
function ajaxQueryFeeCount(buttonObj,currentMVC,code,accountList,account,payAmount){
	var windowId = "";
	if(currentMVC){
		windowId =  currentMVC.windowId;
		currentMVC.query();
	}
	var str="";
	var issCrdBrch;
	$.each(accountList,function(){
		if(this.accountNo==account){
			var curr=this.currencyType;
			issCrdBrch=this.accountOpenNode;
			var type=this.accountType;
			str="<input type=\"hidden\" id=\"currencyType\" value=\""+curr+"\" name=\"currencyType\"/>"+
			"<input type=\"hidden\" id=\"issCrdBrch\" value=\""+issCrdBrch+"\" name=\"issCrdBrch\"/>"+
			"<input type=\"hidden\" id=\"accountType\" value=\""+type+"\" name=\"accountType\"/>";
		}
	});
	$.lily.ajax({
        url: 'queryTransferFee.do',
        type: 'post', 
        dataType:'json',
        data:{"payAccount":account,"currentBusinessCode":code,"issCrdBrch":issCrdBrch,"payAmount":payAmount,'windowId':windowId},
        processResponse: function(data){
        	var html="<tr class=\"bling\" id=\"feeId\">"+							
							"<td class=\"title\">手续费</td>"+
							"<td colspan=\"3\">"+
							 	"<span style='color: red'>"+$.lily.format.toCashWithComma(data.chargeFee)+"元</span>"+
							 	"<input type=\"hidden\" id=\"chargeFee\" value=\""+data.chargeFee+"\" name=\"chargeFee\"/>"+str+
							"</td>"+
						"</tr>";
        	buttonObj.parent().parent().next("#feeId").remove();
        	buttonObj.parent().parent().after(html);
        }
	  });
}
/*
 * 7、思路就是转换两个日期为时间戳即毫秒数，再除以每一天的毫秒数得出相隔多少天
 * 参数：开始日期、结束日期、年数
 * 注：日期格式为："YYYY-MM-DD",年数 ：例如：1,2,3....
 * 注：JS中的month是从0开始，所以month要减一
 * 注：该方法主要是验证查询yearCount年间的参数
 */
function checkQueryDate(checkStartDate,checkEndDate,yearCount){
	var flag = true;
	var arys1 = new Array();
	var arys2 = new Array();
	if (checkStartDate!=null&&checkStartDate!=""&&checkEndDate!=null&&checkEndDate!="") {
		/*
		 * 开始时间串，转换成日期
		 */
		arys1 = new String(checkStartDate).split('-');
		var sdate = new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]); 
		/*
		 * 结束的时间串，转换成日期
		 */
		arys2 = new String(checkEndDate).split('-');  
		var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);  
		var beginDateLimit = new Date(new Date().getTime()-yearCount*365*24*60*60*1000);   //当前时间往前推一年的日期
		if (sdate > edate) {
			alert(paramMessageForShow[1]);
			flag = false;
		}else if (sdate < beginDateLimit) {
			alert(paramMessageForShow[2]);
			flag =  false;
		}else if(sdate>new Date()){
			alert(paramMessageForShow[3]);
			flag =  false;
		}
		/*可以限制一次值查询多少天数据
		else {
			var longdate = Math.ceil((edate.getTime()-sdate.getTime())/(1000 * 60 * 60 * 24));
			var v_betweenDays = 30 + 2;
			if (longdate > v_betweenDays) {
				alert("一次只能查询" + v_betweenDays + "天内的");
				return false;
			}
		}
		*/
	}else{
		alert("日期不能为空");
		flag = false;
	}
	return flag;
}




/*
 * 8、异步请求自动给当前页面赋值
 * 根据json对象，自动给当前页面赋值
 */
function autoSetValue(jsonData,currentElement){
	$(".needValue",currentElement).each(function(){
		var tag = $(this);
		var type = $(this).attr("type");						//当前对象类型
		var nameFlag = tag.attr("name");                        //当前对象的name名字
		var idFlag = tag.attr("id"); 							//针对span可以赋值id
		var tagName = $(this)[0].tagName;                       //标签名
		if(tagName=="INPUT"){                      				//如果是input
			if(type=="radio"||type=="checkbox"){
				if(tag.val()==jsonData[nameFlag]){
					tag.attr("checked","checked");              //给radio选中，或者checkbox
				}
			}else{
				tag.val(jsonData[nameFlag]);         			//给input自动赋值
			}
		}else if(tagName=="SELECT"){
			$(this).val(jsonData[nameFlag]);                //给select选中
		}else if(tagName=="SPAN"){                         //span
			tag.text(jsonData[idFlag]);
		}
	})
}
/*
 * 9、截取账号的前N位
 */
function getAccountBeg(accountNo,count){
	var accountNoNew = accountNo;
	if(accountNo.length>=count){
		accountNoNew = accountNo.substring(0,count);
	}
	return accountNoNew;
}
/*
 * 10、把某个范围内的所有表单域，拼接成json对象
 * 注：如果该范围内，有不想拼入到该json里面去，只需要给该表单加入一个属性flag="noCheck"
 * tr传入的是需要拼接某个范围内的juqery对象。
 * 注：目前这属于特殊情况，取select的值不是取其，value值，而是取其显示值，如这种特殊情况，只需要传入的给其对象加入一个flag='1'属性即可
 */
function getData(str,currentElement){
	var data={};
	$(str +' [name]',currentElement).each(function(){
		if($(this).attr("flag")!='noCheck'){
			if($(this).is(":checkbox,:radio")){
				if($(this).attr("checked")){
					data[$(this).attr("name")]=$(this).val().trim();
				}
			}else{
				if($(this).is("select")){
					var flag = $(this).attr("flag");
					if(flag=='1'){
						data[$(this).attr("name")]=$(this).find(":selected").text().trim();
					}else{
						data[$(this).attr("name")]=$(this).find(":selected").val().trim();
					}
				}else{
					data[$(this).attr("name")]=$(this).val().trim();
				}
			}
		}
	});
	return data;
}
/*
 * 11、根据传入标志，判断是显示还是隐藏
 */
function updateOrCancel(tr,currentElement,updateFlag,flag){
	if(flag=="1"){          //如果为修改按钮
		$(tr,currentElement).show();
		$(updateFlag,currentElement).val("1");
	}else{                 //如果为取消按钮
		$(tr,currentElement).hide();
		$(updateFlag,currentElement).val("0");
	}
}
/*
 * 12、对传入的范围内进行验证，验证通过返回true，验证不通过返回false
 * 注：areaCheck为需要验证的jquery选择器，例如"#id","input[name='shilie']"
 */
function  validatorCheck(areaCheck,currentElement){
	var flag = true;
	var validatorResult = currentElement.data('validator').check();    //验证当前页面需要验证的所有表单域
	if(!validatorResult.passed){
		flag = false;
	}
	return flag;
}
/*
 * 13、异步验证
 * 对传入的范围内进行验证，验证通过返回true，验证不通过返回false
 * 注：areaCheck为需要验证的jquery对象，例如"#id","input[name='shilie']"
 */
function  validatorCheckByAsy(areaCheck){
	//areaCheck.find("input[data-validate],select[data-validate],textarea[data-validate]").unbind("blur"); //把需要验证的表单域先进行解绑，然后再进行绑定blur事件
	var flag = true;
	areaCheck.validator();     											//把该领域的值拼接成json，用data放入到validator属性里面
	var validatorResult = areaCheck.data('validator').check();         //得到一个json的验证结果
	if(!validatorResult.passed){
		flag = false;
	}
	return flag;
}
/*
 * 14、异步提交
 * 参数：1、验证的范围对象。 2、需要传递的json数据， 3、访问的mvc名字  4、访问成功提示信息
 * 注：验证提交
 */
function ajaxSubmitMessage(checkArea,jsonData,mvcName,message){
	if(validatorCheckByAsy(checkArea)){
		$.lily.ajax({
		    url: mvcName+".do",
		    type: 'post', 
		    dataType:'json',
		    data:jsonData,
		    processResponse: function(data){
		    	alert(message);
			}
		})	
	}
}
/*
 * 15、动态给下拉框赋值
 * 参数：1、需要赋值的下拉框json对象,2、存放值的list，3、option的value值对应的name，4、option显示值对应的name.
 * 注：valueList是json对象的一个集合
*/
function setValueForSelect(selectObj,valueList,oValueName,oShowName){
	for ( var i = 0; i < valueList.length; i++) {
		var optionObj = "<option value='"+valueList[i][oShowName]+"' areaCode='"+valueList[i][oValueName]+"'>"+valueList[i][oShowName]+"</option>";
		selectObj.append(optionObj);
	}
}
/*16、
 * 动态拼接验证属性
 * */
function groupValidatorCheck(inputName,alertMessage,mustInputFlag,typeJsonName,validatorType){
	var jsonData = '{"id":"'+inputName+'","name":"'+alertMessage+'","request":'+mustInputFlag+',"'+typeJsonName+'":"'+validatorType+'"}';
	return jsonData;
}
/*
 * 17、动态查询余额
 * 参数说明：1、balanceName，余额name，2、mvcName:既为mvc对应的name名字  3、"查询余额"按钮的jquery对象 ，4、账号name
 */
function ajaxQueryBlanceMessage(balanceName,mvcName,buttonObj,currentMVC,account){
	var windowId = "";
	if(currentMVC){
		windowId =  currentMVC.windowId;
		currentMVC.query();
	}
	
	$.lily.ajax({
		    url: mvcName+".do",
		    type: 'post', 
		    dataType:'json',
		    data:{"accountNo":account,"currentBusinessCode":"00000504",'windowId':windowId,"logRecordFlag":"1"},
		    processResponse: function(data){
				buttonObj.hide();
			//	buttonObj.nextAll().remove();	
				var accBalance=data.balanceAvailable;
		    	buttonObj.after("<span id='test'>"+paramMessageForShow[4]+"<span class='redb'>"+$.lily.format.toCashWithCommaReturn0(accBalance)+""+paramMessageForShow[5]+"</span></span>");  //余额显示     
			}
	});
}
/*
 * 18、打印效果
 * 参数说明：1、printButtonJquery打印按钮的jquery对象选择器（例如'#id','button'...),2、printAreaJquery：需要打印所在域的jquery对象选择器,3、currentElement)
 * 
 */
function printUtil(printButtonJquery,printAreaJquery,currentElement,titleVal){
	$(printButtonJquery,currentElement).click(function() {
		var item={title:titleVal};
		item.table=$(printAreaJquery,currentElement);
        $.lily.print(item); 
//		$.openWindow({
//		    tranCode:'print',
//			windowClass : 'print-window',
//			isSmallWindow:true,
//			appendTo:'body',
//			backdrop : true,
//			allowMinimize : false,
//			btnClass : 'float-btn',
//			showFun : null,
//			allowClose:true,
//			mvcOptions:{fixedHeight:true},
//			param:{"content":$(printAreaJquery,currentElement)}
//		});
	});
}
function printUtilDetail(printButtonJquery,printAreaJquery,currentElement){
	$(printButtonJquery,currentElement).click(function() {
		var item={title:'账单明细'};
		item.table=$(printAreaJquery,currentElement);
        $.lily.print(item); 
	});
}
/*
 * 19、验证证件号码，如果是身份证需要验证18位，如果为其它类型，只需验证必输即可
 * 参数：1、cardType：需要绑定的证件类型，2、cardName:需要提交的证件号码对应的name，3、隐藏的身份证表单对应的name名,4、idCardValue身份证对应的值
 */
function checkIdCardNumber(cardType,cardName,idCardInputName,idCardValue,currentElement){
		$("select[name='"+cardType+"']",currentElement).bind('change',function(){
			var ele = $(this); 
			var certNoObj = ele.parents("tr:first");        //证件类型所在的tr
			var idType = certNoObj.next();    			//身份证输入表单所在TR
			var otherType = certNoObj.next().next();  //证件其它类型所在TR
			if(ele.val()==idCardValue){   //身份证
				idType.find("input").attr("name",cardName).attr("checkInput",true);
				idType.show();
				otherType.hide();
				otherType.find("input").removeAttr("name").attr("checkInput",false).attr("name",idCardInputName);
			}else{
				otherType.find("input").attr("name",cardName).attr("checkInput",true);
				otherType.show();
				idType.hide();
				idType.find("input").removeAttr("name").attr("checkInput",false).attr("name",idCardInputName);
			}
		});
}
/*
 * 20、把地址对应的编码，赋值给另外一个字段
 * 参数说明： 1、selectName：地址下拉的name，2、inputName：需要赋值的表单名 ，
 */
function setAreaValue(selectName,inputName,currentElement){
	$("select[name='"+selectName+"']",currentElement).bind('change',function(){
		$("input[name='"+inputName+"']",currentElement).val($(this).find(":selected").attr("areaCode"));
	})
}
/*
 * 21、打开一个新窗口，该窗口类型为中型或者小型
 */
function openWindowForMid(buttonJquery,jsonCode,cssName,valId,currentElement){
	buttonJquery.bind("click",function(){
		var paramJson = {'recType':$("#"+valId,currentElement).val()};
		$.openWindow({
		//	backdrop: true,	   //点击关闭
			allowClose: true,
			btnClass: 'float-btn',
			tranCode: jsonCode,
			appendTo:'body',
			windowClass: cssName,
			isSmallWindow:true,
			parentMVC:currentElement,
			mvcOptions:{fixedHeight:true},
			param:paramJson
		});
	})
}
/*
 * 22、打开一个新窗口，该窗口类型为中型或者小型,带有高度和宽度
 */
function openWindowForMidWithHw(buttonJquery,jsonCode,cssName,valId,currentElement,Height,Width,currentMVC){

	buttonJquery.bind("click",function(){
		if(!$.lily.CONFIG_SESSION_ID&&(jsonCode!="showFeeMessage")&&(jsonCode!="sureOpenBank")){
			$.lily.login.judgeLogin4Common(currentMVC);
			//$("#loginexplain").remove();
			return;
		}
		var paramJson = {'recType':$("#"+valId,currentElement).val()};
		if(valId == "channel=1105"){
			paramJson = {"channel":"1105"};
		}
		if("sureOpenBank"==jsonCode){
			if("4"==$("#"+valId,currentElement).val()){
				alert("请先选择转账类型！");
				return;
			}
		}
		$.openWindow({
		//	backdrop: true,	   //点击关闭
			allowClose: true,
			btnClass: 'float-btn',
			tranCode: jsonCode,
			isSmallWindow:true,
			appendTo:'body',
			windowClass: cssName,
			parentMVC:currentElement,
			cssHeight:Height,
			mvcOptions:{fixedHeight:false},
			cssWidth:Width,
			param:paramJson,
			hasHeader:false
		});
	});
}


/*
 * 23、动态给下拉框赋值（基金用的）
 * 参数：1、需要赋值的下拉框json对象,2、存放值的list，3、option的value值对应的name，4、option显示值对应的name.
 * 注：valueList是json对象的一个集合
*/
function setValueForSelectFund(selectObj,valueList,oValueName,oShowName){
	for ( var i = 0; i < valueList.length; i++) {
		var optionObj = "<option value='"+valueList[i][oValueName]+"'>"+valueList[i][oShowName]+"</option>";
		selectObj.append(optionObj);
	}
}

/*
 * 24、重新设置查询窗口的补充高度
 */
function resizeQueryWindowAddheight(currentElement,tagWindowFlag){
	
var minHeight=465;
if(tagWindowFlag){
	minHeight=395;
}

	var $appendDiv = $('.areaAppendDiv', currentElement);
	if($appendDiv && $appendDiv.length > 0) {
		var currentHeight = currentElement.height() - $appendDiv.height();
		if(currentHeight > minHeight) {
			$appendDiv.remove();
		}
		else {
			$appendDiv.css("height", (minHeight - currentHeight) + "px");//400为页面最小高度
		}
		//this.$viewContainer.height(height);
	}
	else {
		if(currentElement.height() < minHeight) {
			var $appendDiv = $('<div class="areaAppendDiv"></div>');
			$appendDiv.css({
				width: "10px",
				height:  (minHeight - currentElement.height() ) + 'px'
			});
			currentElement.append($appendDiv);
		}
	}
	
}
/*
 * 25、密码初始化
 * 注：校验针对贷记卡的密码：长度最长六位的数字
 * 参数说明：1、id为密码框所在的第一个div的id,2、reg1：输入过程中字符类型限制正则，3、reg2：输入完毕后的字符类型判断正则，4、maxLength：密码的最长长度
 */
function pwdInitialize(id,currentElement,reg1,reg2,maxLength){
	$('input, textarea').placeholder();
	var pgeditor = new $.pge({
		pgePath: "./ocx/",       	//控件文件目录
		pgeId: "_ocx_password",  	//控件ID
		pgeEdittype: 0,				//控件类型,0星号,1明文
		pgeEreg1: reg1,		   		//输入过程中字符类型限制
		pgeEreg2: reg2,	   			//输入完毕后字符类型判断条件
		pgeMaxlength: maxLength,	//允许最大输入长度
		pgeTabindex: 2,				//tab键顺序
		pgeClass: "ocx_style",		 //控件css样式
		pgeInstallClass: "ocx_style_init", //针对安装或升级
		pgeOnkeydown:null, //回车键响应函数
		tabCallback:"input2" ,        //非IE tab键焦点切换的ID
		currentElement:currentElement
	});	
	var passwordObj = $(pgeditor.getpgeHtml());
	passwordObj.appendTo($("#"+id,currentElement));
	pgeditor.pgInitialize();
	return pgeditor;
}
/*
 * 26、生成密码因子
 * 参数说明：1、buttonObj：为当前页面提交按钮的json对象，2、pgeditor：密码初始化完的对象 ，3、currentElement，4、pwdId：为隐藏传值密码框对应的ID
 */
function checkPwd(buttonObj,pgeditor,currentElement,pwdId){
	buttonObj.bind('click',function(){
		$.ajax({
			url: "SrandNum",
			type: "GET",
			async: false,
			cache:false,
			success: function(srand_num) {
				pgeditor.pwdSetSk(srand_num);
			}
		});
		var passwordEncrypted = pgeditor.pwdResult();
		$("#"+pwdId,currentElement).val(passwordEncrypted);   //密码
		if(pgeditor.pwdValid()==1){
			$("#pwdValid",currentElement).val("1");
		}else{
			$("#pwdValid",currentElement).val("0");
		}
	})
}

/*
* 27、生成四位随机数的图形验证
* 参数说明，1、imageId：为图形的ID，2、buttonId：为换一张按钮对应ID
*/
function creditImageWithFourRan(imageId,buttonId,currentElement){
	$("#"+imageId,currentElement).attr('src','VerifyImage?AUTHCODE=' + Math.random());
	$("#"+imageId+", #"+buttonId,currentElement).bind('click',function () {
		$("#"+imageId,currentElement).attr('src','VerifyImage?AUTHCODE=' + Math.random());
	})
}

/*
 * 28、table查询无记录时显示
 * 参数说明：1、表单下操作按钮所在div的ID,2、tableId：当前table的ID,3、colspanNum：当前table的每一行td个数
 */
function dealNoCord(buttonDivId,tableId,colspanNum,currentElement){
	//var remindMessage = "查询无记录";
	var icollMessage = $('#'+tableId,currentElement).data('table').getDataSource();   //table展示的icoll值
	//$("#externalTransferRemind",currentElement).remove();
	//var showMessage = "<tr id='externalTransferRemind' ><td colspan='"+colspanNum+"' style='text-align: center;'>"+remindMessage+"</td></tr>";
	if(icollMessage.length==0||icollMessage==null){
		$("#"+buttonDivId,currentElement).hide();
		//$("#"+tableId,currentElement).find("tbody").after(showMessage);
	}else{
		$("#"+buttonDivId,currentElement).show();
	}
}

/*
 * 30、自动去掉当前页面的的所有input空格
 */
function dealTrimForInput(currentElement){
	$("input",currentElement).bind('blur',function(){
		if(!($(this).val()==undefined||$(this).val()==null)){
			$(this).val($.trim($(this).val()));
		}
	})
}
/*
 * 31、校验密码控件是否输入合法
 */
function checkPwdActive(dataJson,selfValue,currentElement){
	var remindMessage = "长度不合法";
	var pwdValue = $("#"+dataJson.pwdId,currentElement).val();  //密码值
	if(!(pwdValue==null||pwdValue==""||pwdValue==undefined)){
		if(selfValue=='1'){
			return dataJson.name+remindMessage;
		}else{
			return true;
		}
	}else{
		return true;
	}
}
/*
 * 32、根据当前日期计算近三个月，并自动给页面赋值
 * 参数说明：1、beginDateId：开始日期ID，2、endDateId：截止日期ID，3、monthCount：日期跨度
 */
//使用
function countTrueDate(beginDateId,endDateId,dayCount,currentElement,getSysDate){
	if(getSysDate =='' || getSysDate ==null || getSysDate == undefined){
		var sysDate = $.lily.commonfun.getSysDate();   //获取系统时间
        if(sysDate == 'sysDate' || sysDate == null || sysDate == ''){
        	$.lily.ajax({
				url : 'getSysTime.do',
				type : 'post',
				async:false,
				processResponse : function(data) {
					sysDate = data.sysDate;
				}
			});
        }
	}else{
		var sysDate = getSysDate;
	}
	var year = sysDate.substring(0,4);  //年
	var month = sysDate.substring(4,6); //月
	var day = sysDate.substring(6,8);  //日
	var nowDate = new Date(year,month-1,day);
	//var sureMonth= nowDate.getMonth()-monthCount;   //当前日期减去业务需求月
	nowDate.setDate(nowDate.getDate()-dayCount);
	//nowDate.setMonth(sureMonth);
	var endMonth = nowDate.getMonth()+1+"";
	var endDay = nowDate.getDate()+"";
	if(endMonth.length==1){
		endMonth = "0"+endMonth;
	}
	if(endDay.length==1){
		endDay = "0"+endDay;
	}
	$("#"+endDateId,currentElement).val(year+"-"+month+"-"+day);    //截止日期
	$("#"+beginDateId,currentElement).val(nowDate.getFullYear()+"-"+endMonth+"-"+endDay);  //开始日期
}


//33基金账户查询余额
function dealAccountForFund(nameValue,balName,nowWeb,flag,currentMVC){
	var windowId = "";
	if(!(currentMVC==null||currentMVC==undefined||currentMVC=="")){
		windowId = currentMVC.windowId;
	}
	var buttonObj = $("#"+balName,nowWeb);            //select后查询余额按钮
	var balanceName = "ZHHUYE";                 //余额字段 
	var mvcName = "queryAccountBalance";        //查询余额mvc的名称
	if(flag=="1"){
		buttonObj.bind("click",function(){
			if(currentMVC){
				currentMVC.query();
			}
			ajaxFundQueryBlanceMessage("ZHHUYE","queryAccountBalance",buttonObj.parent(),nameValue,windowId);
		})
	}
}

//34 基金账户余额查询
function ajaxFundQueryBlanceMessage(balanceName,mvcName,buttonObj,accountvalue,windowId){
	$.lily.ajax({
	    url: mvcName+".do",
	    type: 'post', 
	    dataType:'json',
	    data:{"repaymentAccount":accountvalue,"currentBusinessCode":"00100001","windowId":windowId},
	    processResponse: function(data){
	    	buttonObj.hide();
	    	buttonObj.nextAll().remove();
	    	buttonObj.after("<div class='float_word'>"+paramMessageForShow[4]+"<span class='redb'>"+$.lily.format.toCashWithComma(data[balanceName])+""+paramMessageForShow[5]+"</span></div>");  //余额显示     
		}
	})	
}
/*
 * 35、
 * 输入格式为YYYY-MM-DD,
 * 返回格式为YYYYMMdd
 */
function changDateToFomart(value){
	var flag= "";
	if(!(value==null||value==""||value==undefined)){
		if(value.length==10){
			var yyyy = value.substring(0,4);
			var mm = value.substring(5,7);
			var dd = value.substring(8,10);
			flag = yyyy+mm+dd;
		}
	}
	return flag;
}
/*
 * 36、导出Excel或者PDf
 * 参数说明：1、buttonId：导出按钮的ID，2、actionUrl：访问action的url（不需包含.do),3、jsonData：需要上传的json对象数据
 */
function fileDownLoad(buttonId,actionUrl,jsonData,currentElement,currentMVC){
	$('#'+buttonId,currentElement).bind('click', function(){
		if(buttonId=="downExcelForQ"){
			jsonData.fileType = "xls";
		}else{
			jsonData.fileType = "pdf"; 
		}
		  currentMVC.fileDownload(actionUrl+".do",jsonData);
	  });
}
/*
* 37、如果值为NULL返回""
*/
function dealNull(param){
	if(param==null||param=="null"||param==undefined){
		param = "";
	}
	return param;
}
/*
 * 38、打开大的窗口
 * 参数说明：1、buttonObj：按钮的jquery对象，2、jsonData：需要传递的参数，3、jsonCode：mvc.json的code名称
 */
function optenBigWindow(jsonData,jsonCode,currentElement){
		$.openWindow({
			isBigWindow:true,
			backdrop: true,
			btnClass : 'float-btn',
			allowClose: true,
			bigWidowElement:currentElement,
			tranCode: jsonCode,
			windowClass:'common-bigsub-window',
			param:jsonData 
		});
}
/*
 * 39、把一个字符根据特殊字符截取返回数组
 * 参数说明，1、needSplit：需要截取的字符串，2、splitFlag：截取的标志，例如||等
 */
function getArrayMessage(needSplit,splitFlag){
	var paramArray = [];
	if(needSplit&&splitFlag){
		paramArray = needSplit.split(splitFlag);
	}
	return paramArray;
}
/*
 * 38、打开大的窗口
 * 参数说明：1、buttonObj：按钮的jquery对象，2、jsonData：需要传递的参数，3、jsonCode：mvc.json的code名称
 */
function optenBigWindow(jsonData,jsonCode,currentElement){
		$.openWindow({
			isBigWindow:true,
			backdrop: true,
			btnClass : 'float-btn',
			allowClose: true,
			bigWidowElement:currentElement,
			tranCode: jsonCode,
			windowClass:'common-bigsub-window',
			param:jsonData 
		});
}
/*
 * 39、把一个字符根据特殊字符截取返回数组
 * 参数说明，1、needSplit：需要截取的字符串，2、splitFlag：截取的标志，例如||等
 */
function getArrayMessage(needSplit,splitFlag){
	var paramArray = [];
	if(needSplit&&splitFlag){
		paramArray = needSplit.split(splitFlag);
	}
	return paramArray;
}

/*
 * 40、table查询无记录时显示--手动拼接
 * 参数说明：1、表单下操作按钮所在div的ID,2、trId：多添加tr的id名，3、tableId：当前table的ID,5、tdNum：当前table的每一行td个数
 */
function dealNoCordSelfAppend(icollName,trId,tableId,currentElement,tdNum){
	var remindMessage = "查询无记录";
	var showMessage = "<tr id='"+trId+"' ><td colspan='"+tdNum+"' style='text-align: center;'>"+remindMessage+"</td></tr>";
	if(icollName==null||icollName==undefined||icollName.length==0){
		$("#"+tableId,currentElement).append(showMessage);
	}
}
/*
 * 限制图片上传格式
 */
function limitImageType(fileValue,regValue){
	var flag = true;
	var reg = new RegExp(regValue,"i")
	if(!(reg.test(fileValue))){ 
	      alert('您所上传的图片格式不符，请重新上传');
	      flag = false;
     } 
	return flag;
}
/*
 * 根据路径获得文件名称
 */
function getUploadFileName(fileInput){
	var  fileName = "";
	if(fileInput){
		if(fileInput.indexOf("\\")=="-1"){
			fileName = fileInput;
		}else{
			var temp = fileInput.replace(/\\/g,"/").split("/");
			if(temp.length > 1){
				fileName = temp[temp.length - 1];
			}
		}
	}
	return fileName;
}

/*
 * 43、会员中心生成密码因子
 * 参数说明：1、buttonObj：为当前页面提交按钮的json对象，2、pgeditor：密码初始化完的对象 ，3、currentElement，4、pwdId：为隐藏传值密码框对应的ID
 */
function checkInPwd(buttonObj,pgeditor,currentElement,pwdId){
	buttonObj.bind('click',function(){
		$.lily.ajax({
			url: "getPasswdSeed.do",
			type: "GET",
			async: false,
			data: {'EMP_SID': $.lily.CONFIG_SESSION_ID, responseFormat: 'JSON', mvcId: mvcId,windowId: currentElement.windowId},
			cache: false
		}).done(function(data) {
			
			var seed=data.passwdSeed;
			pgeditor.pwdSetSk(seed);
		});
		var passwordEncrypted = pgeditor.pwdResult();
		$("#"+pwdId,currentElement).val(passwordEncrypted);   //密码
		/*if(pgeditor.pwdValid()==1){
			$("#pwdValid",currentElement).val("1");
		}else{
			$("#pwdValid",currentElement).val("0");
		}*/
	})
}
/*
 * 43、动态校验短账号和账户长度不能超过数据库长度（快捷区）
*/
function dealQuickAccnoCheck(radioName,accnoName,shortId,accountId,currentElement){
	$("input[name='"+radioName+"']",currentElement).bind("change",function(){
		if($(this).val()=='1'){   				//短账号
			$("#"+shortId,currentElement).parents("tr:first").show();
			$("#"+shortId,currentElement).parents("tr:first").next().hide();
			$("#"+shortId,currentElement).removeAttr("checkInput").attr("name",accnoName);
			$("#"+accountId,currentElement).attr("checkInput",false).attr("name","aa");
			$("#"+accountId,currentElement).val("");
		}else{
			$("#"+accountId,currentElement).parents("tr:first").show();
			$("#"+accountId,currentElement).parents("tr:first").prev().hide();
			$("#"+accountId,currentElement).removeAttr("checkInput").attr("name",accnoName);
			$("#"+shortId,currentElement).attr("checkInput",false).attr("name","aa");
			$("#"+shortId,currentElement).val("");
		}
	})
}


/*
 * 44、给予查询余额按钮绑定事件
 * 参数说明：1、buttonId：按钮Id,2、selectName：按钮所在下拉框名称，3、currentElement：当前对象
 */
function queryBlanceBySelf(buttonId,selectName,currentElement,currentMVC){
	$('#'+buttonId,currentElement).parent().show();
	$('#'+buttonId,currentElement).parent().nextAll().remove();
	$("#"+buttonId,currentElement).bind('click',function(){
		if(validatorCheckByAsy($("select[name='"+selectName+"']",currentElement).parent())){
			ajaxQueryBlanceMessage("ZHHUYE","queryAccountBalance",$("#"+buttonId,currentElement).parent(),currentMVC);
		}
	})
}

/****
 * 45. 当账户改变时去除余额，显示查询按钮；
 *  参数说明：1、selectName：按钮所在下拉框名称，3、currentElement：当前对象
 * @param selectName    
 * @param currentElement
 */
function removeButton(selectName,currentElement){
	var ele = $("select[name='"+selectName+"']",currentElement);
	ele.parents("td:first").find("a").parent().show();
	ele.parents("td:first").find("a").parent().nextAll().remove();
}


/*
 * 46、开始日期与结束日期进行比较,如果结束日期大于或等于开始日期，则返回true.
 * 
 * 日期输入格式   yyyy-MM-dd
 */
function checkDate(startDate,endDate){
	var flag = false;
	var arys1 = new Array();
	var arys2 = new Array();
	if (startDate!=null&&startDate!=""&&endDate!=null&&endDate!="") {
		
		if(startDate == endDate)
			return true;
		
		/*
		 * 开始时间串，转换成日期
		 */
		arys1 = new String(startDate).split('-');
		var sdate = new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
		/*
		 * 结束的时间串，转换成日期
		 */
		arys2 = new String(endDate).split('-');  
		var edate = new Date(arys2[0], parseInt(arys2[1] - 1), arys2[2]);
		if (edate > sdate) {
			return true;
		}		
	}
	return false;
}
/*
 * 47、重置按钮去取余额显示
 *   1、resetButtonId：重置按钮的id，2、selectName：账户下拉框名字，3、currentElement:当前div的jquery对象
 * 
 */
function removeAmt(resetButtonId,selectName,currentElement){
	$("#"+resetButtonId,currentElement).bind("click",function(){
		var selectObj = $("#"+selectName,currentElement).parents("td:first").find("a").parent();  //查询余额按钮所在的div对象
		selectObj.show();
		selectObj.nextAll().remove();
	})
	
}

/*
 * 48、限额比较
 * 
 */
function checkLimit(dataJson,dayMax,currentElement){
	var remindMessage = "单笔交易限额不能超过日累计限额";
	var remindMessage2 = "不能为空";
	var singleMax = $("#"+dataJson.bSingleMax,currentElement).val();  //单笔限额
	//alert("++"+dayMax+"=="+singleMax);
	var single = $.lily.format.removeComma(singleMax);
	var day = $.lily.format.removeComma(dayMax);
	if((!(single==null||single==""||single==undefined))||(!(day==null||day==""||day==undefined))){
		//alert(single-day);
		if((single-day)>0){
			return remindMessage;
		}else{
			return true;
		}
	}else{
		return remindMessage2;
	}
}

/*
 * 49、协议金额比较
 * 
 */
function checkDay(dataJson,intDayAmountLimit,currentElement){
	var remindMessage = "单笔业务金额上限不能超过日累计金额上限";
	var remindMessage2 = "不能为空";
	var singleMax = $("#"+dataJson.intSingleAmountLimit,currentElement).val();  //单笔金额上限
	//alert("++"+dayMax+"=="+singleMax);
	var single = $.lily.format.removeComma(singleMax);
	var day = $.lily.format.removeComma(intDayAmountLimit);
	if((!(single==null||single==""||single==undefined))||(!(day==null||day==""||day==undefined))){
		//alert(single-day);
		if((single-day)>0){
			return remindMessage;
		}else{
			return true;
		}
	}else{
		return remindMessage2;
	}
}

function checkMonth(dataJson,intMonthAmountLimit,currentElement){
	var remindMessage = "日累计金额上限不能超过月累计金额上限";
	var remindMessage2 = "不能为空";
	var intDayAmountLimit = $("#"+dataJson.intDayAmountLimit,currentElement).val();  //日累计金额上限
	var day = $.lily.format.removeComma(intDayAmountLimit);
	var month = $.lily.format.removeComma(intMonthAmountLimit);
	if((!(day==null||day==""||day==undefined))||(!(month==null||month==""||month==undefined))){
		//alert(single-day);
		if((day-month)>0){
			return remindMessage;
		}else{
			return true;
		}
	}else{
		return remindMessage2;
	}
}

/*
 * 50、协议日期比较
 * 
 */
function dateValidator(dataJson,intAgreementAvaDate,currentElement) {
	var endDate = $("#"+dataJson.intAgreementInvDate).val();    //截止日期
	if (intAgreementAvaDate!=null&&intAgreementAvaDate!="") {
		var remindMessage1 = "协议起始日期不能超过协议截止日期";
		var remindMessage2 = "协议起始日期应不小于当前日期";
		var remindMessage3 = "协议截止日期应不小于当前日期";
		var yyyy = intAgreementAvaDate.substring(0,4);
		var mm = intAgreementAvaDate.substring(4,6);
		var dd = intAgreementAvaDate.substring(6,8);
		var arys1 = new Array();
		var dateNow = new Date();
		/*
		 * 时间串，转换成日期
		 */
		arys1 = new String(endDate).split('-');
		var sdate = new Date(yyyy, parseInt(mm-1), dd);
		var edate = new Date(arys1[0],parseInt(arys1[1]-1),arys1[2]);
		//alert("==="+new Date()+"+++"+sdate+"*****"+edate);
		if (sdate > edate) {
			return remindMessage1;
		}
		//alert(dateNow.getFullYear()+"***"+dateNow.getMonth()+"^^^"+dateNow.getDate());
		if(new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate()) > sdate){
			return remindMessage2;
	    }
		if(new Date(dateNow.getFullYear(),dateNow.getMonth(),dateNow.getDate()) > edate){
	    	return remindMessage3;
	    }
	}
	return true;
}

/*
 * 51、比较账号位数（不能小于9位）
 * 
 */
function accountLength(dataJson,intOutAccount,currentElement){
	//alert("=="+intOutAccount);
	if(intOutAccount!=null&&intOutAccount!=""){
		var remindMessage1 = "账号长度不能小于9位";
		if((intOutAccount.length-9)<0){
			return remindMessage1;
		}
	}
	return true;
}

/*
 * 52、协议签约笔数比较
 * 
 */
function signcount(dataJson,intMonthNumLimit,currentElement){
	//alert("=="+intOutAccount);
	var day = $("#"+dataJson.intDayNumLimit).val();
	if(intMonthNumLimit!=null&&intMonthNumLimit!=""&&day!=null&&day!=""){
		var remindMessage1 = "日累计业务笔数上限不能超过月累计业务笔数上限";
		var remindMessage2 = "日累计业务笔数上限至少为1笔";
		var remindMessage3 = "月累计业务笔数上限至少为1笔";
		if(intMonthNumLimit<1){
			return remindMessage3;
		}
//		if(day<1){
//			return remindMessage2;
//		}
		if((intMonthNumLimit-day)<0){
			return remindMessage1;
		}
	}
	return true;
}
/*
 * 53
 */
function checkDayNumber(dataJson,intDayNumLimit,currentElement){
	//alert("=="+intOutAccount);
	if(intDayNumLimit!=null&&intDayNumLimit!=""){
		var remindMessage2 = "日累计业务笔数上限至少为1笔";
		if(intDayNumLimit<1){
			return remindMessage2;
		}
	}
	return true;
}
/*
 *54、根据特殊字符转换成JSON对象
 * 参数说明：1、needStr：需要转换的字符串；2、键值之间的分隔符，3、不同组之间的分隔符
 */
function creditJsonStr(needStr){
	var jsonStr = '{'
	if(needStr!=null&&needStr!=""&&needStr!=undefined){
		var keyValue = needStr.split("||");
		for ( var i = 0; i < keyValue.length; i++) {
			var mid = keyValue[i].split("^^");
			if(mid.length==2){
				if(i==keyValue.length-1){
					jsonStr += '"'+mid[0]+'":"'+mid[1]+'"';
				}else{
					jsonStr += '"'+mid[0]+'":"'+mid[1]+'",';
				}
			}
		}
	}
	jsonStr +='}';
	return $.parseJSON(jsonStr);
}


/*
 * 55、理财购买输入信息是否输入合法
 */
function checkPayAmountForlilac(dataJson,selfValue,currentElement){
	var message = "";
 	var remindMessage1 = "您卡内余额不足，请重新输入购买金额！";
 	var remindMessage2 = "您输入的购买金额大于该产品剩余额度，请重新输入购买金额！";
 	var remindMessage4 = "您输入的购买金额不符合购买标准,购买金额为购买标准的整数倍，请重新输入购买金额！";
 	var remindMessage3 = "您输入的购买金额大于最大购买额度，请重新输入购买金额！";
 	var remindMessage5 = "您输入的购买金额低于最低购买额度，请重新输入购买金额！";
 
 	var payAmount = $.lily.format.removeComma($("#"+dataJson.payAmount,currentElement).val()); //购买金额
	var IssAmt = $.lily.format.removeComma($("#"+dataJson.IssAmt,currentElement).text());  //剩余额度
	var minamt = $.lily.format.removeComma($("#"+dataJson.minamt,currentElement).text()); //最低购买额度
	var stdamt = $.lily.format.removeComma($("#"+dataJson.stdamt,currentElement).text()); //购买标准
	var maxAmt = $.lily.format.removeComma($("#"+dataJson.maxAmt,currentElement).text()); //最高购买额度
	var balance = $.lily.format.removeComma($("#"+dataJson.balance,currentElement).val()); //卡内余额
	if(balance!=""&&balance!=null){
		if(payAmount/balance>1){  //比较余额
			selfValue='1' ;
		}else if(payAmount/IssAmt>1){  //比较额度
			selfValue='2' ;
		}else if(payAmount/maxAmt>1){  //比较最大额度
			selfValue='3' ; 
		}else if(payAmount%stdamt!=0){  //购买标准的倍数
			selfValue='4' ; 
		}else if(minamt/payAmount>1){   //比较最低购买标准
			selfValue='6' ; 
		}else{
			selfValue='0' ; 
		}
	}else{
		selfValue='5' ;
	}
	
	switch(selfValue) {  
    case '0': break ; 
    case '1': message = remindMessage1 ; break ; 
    case '2': message = remindMessage2 ; break ; 
    case '3': message = remindMessage3 ; break ; 
    case '4': message = remindMessage4 ; break ;
    case '6': message = remindMessage5 ; break ; 
    case '5':break ; 
    default: break; 
	}
 	return dataJson.name+message ; 
}




/*
 * 56、国债购买输入信息是否输入合法
 */
function checkPayAmountForDebt(dataJson,selfValue,currentElement){
//	"checker":"checkPayAmountForDebt","balance":"balance","RemainIssAmt":"RemainIssAmt",
//	"stdamt":"stdamt","maxamt":"maxamt","minamt":"minamt","TxnAmt":"TxnAmt" ,"totamt":"totamt"}
	var message = "";
 	var remindMessage1 = "您卡内余额不足，请重新输入购买金额！";
 	var remindMessage2 = "您输入的购买金额大于该产品剩余额度，请重新输入购买金额！";
 	var remindMessage4 = "您输入的购买金额不符合购买标准（购买金额-最低购买额度）为购买标准的整数倍，请重新输入购买金额！";
 	var remindMessage3 = "您输入的购买金额大于最大购买额度，请重新输入购买金额！";
 
 	var TxnAmt = $.lily.format.removeComma($("#"+dataJson.TxnAmt,currentElement).val()); //购买金额
	var RemainIssAmt = $.lily.format.removeComma($("#"+dataJson.RemainIssAmt,currentElement).val());  //剩余额度
	var minamt = $.lily.format.removeComma($("#"+dataJson.minamt,currentElement).text()); //最低购买额度
	var stdamt = $.lily.format.removeComma($("#"+dataJson.stdamt,currentElement).text()); //购买标准
	var maxamt = $.lily.format.removeComma($("#"+dataJson.maxamt,currentElement).text()); //最高购买额度
	var balance = $.lily.format.removeComma($("#"+dataJson.balance,currentElement).val()); //卡内余额
	if(balance!=""&&balance!=null){
	if((TxnAmt/balance<=1)&&(TxnAmt/RemainIssAmt<=1)&&(TxnAmt/maxamt<=1)&&((TxnAmt-minamt)%stdamt==0)){
		selfValue='0' ;
	}else if(TxnAmt/balance>1){
		selfValue='1' ;
	}else if(TxnAmt/RemainIssAmt>1){
		selfValue='2' ;
	}else if(TxnAmt/maxamt>1){
		selfValue='3' ; 
	}else if((TxnAmt-minamt)%stdamt!=0){
		selfValue='4' ; 
	}
	}else{
		selfValue='5' ;
	}
	
	switch(selfValue) {  
    case '0': break ; 
    case '1': message = remindMessage1 ; break ; 
    case '2': message = remindMessage2 ; break ; 
    case '3': message = remindMessage3 ; break ; 
    case '4': message = remindMessage4 ; break ; 
    case '5':break; 
    default: break; 
	}
 	return dataJson.name+message ; 
}


 
/*
 *57、转换协议不同按钮的账户名称校验
 * 参数说明
 */
function changeNameProtocol(realname,object,valueFlag,nameId1,nameId2,btId1,btId2,currentElement){
	//alert("111");
	object.bind("change",function(){
		var value = $(this).val();
		if(value == valueFlag){
			//alert("111");
			$("#"+nameId1,currentElement).parents("tr:first").show();
			$("#"+nameId2,currentElement).parents("tr:first").hide();
			$("#"+btId2,currentElement).hide();
			$("#"+btId1,currentElement).show();
			$("#"+nameId1,currentElement).attr("name",realname);
			$("#"+nameId2,currentElement).attr("name","replace");
			$(':first-child', $("#"+nameId2,currentElement)).attr("selected", true);
			$("#"+nameId1,currentElement).removeAttr("checkInput").attr("checkInput", "true");
			$("#"+nameId2,currentElement).removeAttr("checkInput").attr("checkInput", "false");
		}
		else{
			//alert("222");
			$("#"+nameId2,currentElement).parents("tr:first").show();
			//alert("==="+$("#"+nameId2,currentElement).parents("tr:first")[0].outerHTML);
			$("#"+nameId1,currentElement).parents("tr:first").hide();
			$("#"+btId1,currentElement).hide();
			$("#"+btId2,currentElement).show();
			$("#"+nameId2,currentElement).attr("name",realname);
			$("#"+nameId1,currentElement).attr("name","replace");
			$(':first-child', $("#"+nameId1,currentElement)).attr("selected", true);
			$("#"+nameId2,currentElement).removeAttr("checkInput").attr("checkInput", "true");
			$("#"+nameId1,currentElement).removeAttr("checkInput").attr("checkInput", "false");
		}
	})
}	
	
/*
 * 58、协议签约开户行不能为本行
 * 
 */
function checkBank(dataJson,unionBankNo,currentElement){
	//alert("111");
	var inbankname = $("#"+dataJson.inbankname).val();
	if(unionBankNo!=null&&unionBankNo!=""&&inbankname!=null&&inbankname!=""){
		var remindMessage1 = "开户网点不能为本行";
		if(unionBankNo==inbankname){
			return remindMessage1;
		}
	}
	return true;
}	


/*
 * 59、活期转定期，最低定期存款金额为50；
 */
function checkPayAmountForCTOT(dataJson,selfValue,currentElement){
//	data-validate='{"id":"payAmountValid","name":"","checker":"checkPayAmountForCTOT","payAmount":"payAmount"}' 
	var message = "";
 	var remindMessage1 = "定期存款最小起存金额不能小于50！";
 	var payAmount = $.lily.format.removeComma($("#"+dataJson.payAmount,currentElement).val()); //购买金额
	if(payAmount!=""&&payAmount!=null){ 
		if(payAmount/50<1){
			message = remindMessage1  ; 
		}
		
	} 
 	return dataJson.name+message ; 
}


/*
 * 60、定期转活期，最低定期存款金额为50,如果转账金额==账户余额 账户销户，不提示；
 */
function checkPayAmountForTTOC(dataJson,selfValue,currentElement){
//	data-validate='{"id":"payAmountValid","name":"","checker":"checkPayAmountForCTOT","payAmount":"payAmount"}' 
	var message = "";
 	var remindMessage1 = "定期存款最小起存金额不能小于50！";
 	var payAmount = $.trim($.lily.format.removeComma($("#"+dataJson.payAmount,currentElement).val())); //购买金额
 	var balance = $.trim($.lily.format.removeComma($("#"+dataJson.balance,currentElement).text())); //购买金额
	if(payAmount!=""&&payAmount!=null&&balance!=null&&balance!=""){ 
			if(((balance-payAmount)/50<1)&&(payAmount-balance!=0)){
				message = remindMessage1  ; 
			}
		}  
	  
 	return dataJson.name+message ; 
}

/*
 * 61、加入收藏夹    ；
 * weiyj@yuchengtech.com
 */
function addFavorite(){
	var ctrl = (navigator.userAgent.toLowerCase()).indexOf('mac') != -1 ? 'Command/Cmd':'Ctrl';
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
/*
 * 62、校验生日日期的合法性
 * 
 */
function checkDateType(dataJson,dateVale,currentElement){
	var dataRemindM = "请输入合法"+dataJson.name;
	if(dateVale!=null&&dateVale!=""){
		dateVale = $.trim(dateVale);
		if(!(new RegExp(/^[0-9]+$/).test(dateVale)&&dateVale.length==8)){    //8位的数字
			return dataRemindM;
		}
		var year = dateVale.substring(0,4);
		var month = dateVale.substring(4,6);
		var day = dateVale.substring(6,8);
		if(month*1>12||day*1>31){    //月不超过12，天不超过31
			return dataRemindM;
		}
		if(month*1==2&&day*1>29){    //如果为2月，天不超过29
			return dataRemindM;
		}
		var nowDate = new Date();
		var dateOld = new Date(year,month*1-1,day);
		if(dateOld>nowDate||nowDate.getFullYear()*1-year*1>100){  //当前日期不能小于输入，而且输入的日期不能与当前日期相差100
			return dataRemindM;
		}
	}
	return true;
}
/*
 * 63、快捷区回到首页  ；
 * weiyj@yuchengtech.com
 */
function goServiceIndex(){
	window.location.href = $.lily.getContextPath()+'/service_index.htm';
}

/*
 * 64、格式化日期，输入参数为yyyy-mm-dd,返回参数为yyyymmdd
 */
function formatDateToNoB(dateType){
	var dateVal = "";
	if(!(dateType==null||dateType==undefined||dateType==""||dateType.length<10)){
		var yyyy = dateType.substring(0,4);
		var mm = dateType.substring(5,7);
		var dd = dateType.substring(8,10);
		dateVal = yyyy+mm+dd;
	}
	return dateVal;
}	

//在页面二级框架中使用 例如frame_recharge.js
function defaultShowMenu(currentElement){
	//默认显示的菜单
	$("#showMenu",currentElement).show();
	     $("#showMenu",currentElement).prev().find("span").addClass("mj_sn");
		 //默认的菜单的前一个同辈元素的里面的span显示图片的向下
	    $(".mj_nav_list p",currentElement).click(function(){
			var thisCur=$(this).find("span");
		    $(".mj_nav_list p span",currentElement).not(thisCur).removeClass("mj_sn");
		
		    $(this).find("span").toggleClass("mj_sn");
		    $(".mj_nav_list ul",currentElement).not($(this).next()).slideUp();
		    $(this).next().slideToggle(400);
		   
	   });
}

function openTabBarWindow(tranCode,currentElement,appendTo,tempdata){
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
		currentElement:currentElement,
		param:tempdata
	});
	
}

function openTabBarWindowA(tranCode,currentElement,tempdata){
	var finalAppendTo = '#firstTransition';
	
	$(finalAppendTo,currentElement).html('');
	$.openWindow({
		tranCode: tranCode,
		showFun: null,
		appendTo:finalAppendTo,
		currentElement:currentElement,
		param:tempdata
	});
	
}
/*
 * 65、根据当前日期自动给页面赋值（按月为跨度）
 * 参数说明：1、beginDateId：开始日期ID，2、endDateId：截止日期ID，3、monthCount：月跨度
 */
function countTrueDate1(beginDateId,endDateId,monthCount,currentElement){
	var sysDate;
	var endDate;
	$.lily.ajax({
		url : 'getSysTime.do',
		type : 'post',
		async:false,
		processResponse : function(data) {
			sysDate = data.sysDate;
		}
	});
	endDate = sysDate.replace(/\-/g,"");
    var year = endDate.substring(0,4);  
    var month = endDate.substring(4,6);  
    var day= endDate.substring(6,8);  
	//indexOf返回-1表示不存在，首位为0
    //month = month.indexOf("0")>-1?month.substr(1,1):month;
	//使用parseInt(month, '10'),否则前缀为0的字符串被默认为八进制
    var newMonth = parseInt(month, '10') - monthCount;
    var newYear=year;
    var newDay=day;
    if(newMonth==4||newMonth==6||newMonth==9||newMonth==11){
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
    
    if(newMonth<0){
    	newMonth=12+newMonth;
    	newYear=year-1;
    }
    if(newMonth==0){
    	newMonth=12;
    	newYear=year-1;
    }
    if(newMonth>0&&newMonth<10){
    	 newMonth='0'+newMonth;
     }
	var newDate= ''+newYear+newMonth+newDay;
    
    $("#"+endDateId,currentElement).val(year+"-"+month+"-"+day);    //截止日期
	$("#"+beginDateId,currentElement).val(newYear+"-"+newMonth+"-"+newDay);  //开始日期
//	$.lily.ajax({
//		url : 'getSysTime.do',
//		type : 'post',
//		async:false,
//		processResponse : function(data) {
//			sysDate = data.sysDate;
//		}
//	});
//		var year = sysDate.substring(0,4);  //年
//		var month = sysDate.substring(4,6); //月
//		var day = sysDate.substring(6,8);  //日
//		var nowDate = new Date(year,month,day);
//		var sureYear=year;
//		var sureMonth= nowDate.getMonth()-monthCount;   //当前日期减去业务需求月
//		if(sureMonth==0){
//		sureMonth=12;
//		sureYear=year-1;
//		}
//		if(sureMonth<10){
//		sureMonth = "0"+sureMonth;
//		}
//		
//		$("#"+endDateId,currentElement).val(year+"-"+month+"-"+day);    //截止日期
//		$("#"+beginDateId,currentElement).val(sureYear+"-"+sureMonth+"-"+day);  //开始日期
}
/*
 * 66、追加营销信息
 * 参数说明：MarketingItem 待追加的营销信息集合
 */
function appendMarketing(MarketingItem,flag){
	try{
	 	var marketInfo="";
	    for(var i=0;i<MarketingItem.length;i++){
	      	var $Item = $('#'+MarketingItem[i].modelNo+'');
	    	if(MarketingItem[i].modelNo.substr(0,6) == flag){
	    		var picpath;
	    	
	    		if(MarketingItem[i].picpath.indexOf('@') > -1){

	    			var picpathArr = MarketingItem[i].picpath.split("@");
	    			picpath = picpathArr[0];
	    		
	    		}
	    		if(MarketingItem[i].marketingType=='3'){
	    			var html = "<img src='"+"images/advert/"+picpath+"'/>";	
	    			$Item.empty().append(html);
	    			$Item.attr("href",""+MarketingItem[i].hrefPath+"");
	    			$Item.attr("target","_blank");
	    			if(MarketingItem[i].marketNo!= ""){
	    				if(MarketingItem[i].modelNo.substr(0,6) == flag){
	        				//getMarket(MarketingItem[i]);
	    					marketInfo=getMarket(marketInfo,MarketingItem[i]);
	        			}
	    				$Item.attr({"data-event":"lily-clientevent","data-market":"modelno:"+MarketingItem[i].modelNo+";marketno:"+MarketingItem[i].marketNo+";productno:"+MarketingItem[i].productNo+""});//;cstno:"+$.lily.sessionData.session_customerNameCN+"
	    			}
	    		}else if(MarketingItem[i].marketingType=='2'){	
	    			var html = "<img src='"+"images/advert/"+picpath+"'/>";
	    			$Item.empty().append(html);
	    			var menuNo = menudeal(MarketingItem[i].hrefPath);
	        		$Item.attr("href","#");
	
	        		if(MarketingItem[i].marketNo =="")
	        			$Item.attr({"data-toggle":"lilyMenu","data-menuno":""+menuNo+"","data-content":"frame_item","data-value":""+MarketingItem[i].hrefPath+""});	
	        		else{
	        			if(MarketingItem[i].modelNo.substr(0,6) == flag){
	        				//getMarket(MarketingItem[i]);
	        				marketInfo=getMarket(marketInfo,MarketingItem[i]);
	        			}
	        			$Item.attr({"data-toggle":"lilyMenu","data-menuno":""+menuNo+"","data-content":"frame_item","data-value":""+MarketingItem[i].hrefPath+"","data-event":"lily-clientevent","data-market":"modelno:"+MarketingItem[i].modelNo+";marketno:"+MarketingItem[i].marketNo+";productno:"+MarketingItem[i].productNo+""});
	    				}
	    		}else if(MarketingItem[i].marketingType=='1'){	//var productdata = eval('(' + MarketingItem[i].productNo+ ')');
	    			var prod = MarketingItem[i].productNo;
	    			//console.log(prod);    			
	    			if (prod != null && prod != "" && prod.indexOf("{") > -1){
	    				prod = prod.replace(/\'/g,"\"")
	    				//console.log(prod);
	    				var datetemp="";
	    				var productdata = null;
	    				var productamt = "";
	    				try{
	    					productdata = $.parseJSON(prod);	
	    				}
	    				catch(e){
	    					productdata = null;
	    				}
  						if(productdata!= null && productdata!="null"){
							if(productdata.IpoStartDate.length == 8){
								datetemp=productdata.IpoStartDate.substring(0,4)+'-'+productdata.IpoStartDate.substring(4,6)+'-'+productdata.IpoStartDate.substring(6,8);
							}
						}
						if(!isNaN(productdata.PfirstAmt)){			
							productamt = parseInt(productdata.PfirstAmt);
						}
						if(MarketingItem[i].hrefPath=="1"){
			    			var html =      '<li style="background:'+'url(images/advert/'+picpath+')'+'">'+
			                           		'<div class="s1"><span>'+productdata.InterestDays+'</span>天理财&nbsp;'+productamt+'元起</div>'+
			                           		'<div class="s2">预计年化收益：<span>'+productdata.GuestRate+'%</span><br/>'+productdata.PrdName+
			                          		'<div class="s3">'+datetemp+'起认购</div>'+
			                           		'<div class="s4"><input name="" value="立即认购" type="button"'+
			                           		'class="btn_reg"></div>'+
			                      	   		'</li>'
			                }
		                else if(MarketingItem[i].hrefPath=="0"){
			                var html = 		'<li style="background:'+'url(images/advert/'+picpath+')'+'">'+
			                           		'<div class="s1"><span>'+productdata.InterestDays+'</span>天基金&nbsp;'+productamt+'元起</div>'+
			                           		'<div class="s2">预计年化收益：<span>'+productdata.GuestRate+'%</span><br />'+productdata.PrdName+
			                          		'<div class="s3">'+datetemp+'起认购</div>'+
			                           		'<div class="s4"><input name="" value="立即认购" type="button"'+
			                           		'class="btn_reg"></div>'+
			                      	   		'</li>'	
			                }
		    			$Item.empty().append(html);
	    			}
	    			var menuNo = menudeal(MarketingItem[i].hrefPath);
	        		$Item.attr("href","#");
	    			if(MarketingItem[i].marketNo ==""){
	        			$Item.attr({"data-toggle":"moneyproduct","data-menuno":"A0010000","data-content":"frame_item","data-href":""+MarketingItem[i].hrefPath+"","data-value":""+MarketingItem[i].productNo+""});	
	    			}
	        		else{
	        			if(MarketingItem[i].modelNo.substr(0,6) == flag){
	        				marketInfo=getMarket(marketInfo,MarketingItem[i]);
	        	//			getMarket(MarketingItem[i]);
	        			}
	        			$Item.attr({"data-toggle":"moneyproduct","data-menuno":"A0010000","data-content":"frame_item","data-href":""+MarketingItem[i].hrefPath+"","data-value":""+MarketingItem[i].productNo+"","data-event":"lily-clientevent","data-market":"modelno:"+MarketingItem[i].modelNo+";marketno:"+MarketingItem[i].marketNo+";productno:"+MarketingItem[i].productNo+""});
	    			}
	    		}
	    	}
	    }
	    var _tkADD = new tkSwitchAD("focus_change_list", "tkBottunn", 5000, 20);
	    //console.log(marketInfo);
	    if (marketInfo != "")
	    {showMarket(marketInfo);}
	}catch(e){
	}
}

function getMarket(marketInfo,mItem){
	try{
		var PrdCode = "";
		var prod = mItem.productNo;
		//console.log(prod);    			
		if (prod != null && prod != "" && prod.indexOf("{") > -1){
			prod = prod.replace(/\'/g,"\"")
			var productdata = null;
			try{	    		
		    	productdata = $.parseJSON(prod);
		    	PrdCode=productdata.PrdCode;	
	    	}catch(e){
	    		productdata = null;
	    	}
		}else{
			PrdCode=mItem.productNo;	
		}
		if (marketInfo != ""){marketInfo=marketInfo+"@";}
		marketInfo=marketInfo+"modelno:"+mItem.modelNo+",marketno:"+mItem.marketNo+",productno:"+PrdCode;
		return marketInfo;
	}catch(e){
	}	
}
/*function getMarket(mItem){
	try{
		var PrdCode = "";
		var prod = mItem.productNo;
		//console.log(prod);    			
		if (prod != null && prod != "" && prod.indexOf("{") > -1){
			prod = prod.replace(/\'/g,"\"")
			var productdata = null;
			try{	    		
		    	productdata = $.parseJSON(prod);
		    	PrdCode=productdata.PrdCode;	
	    	}catch(e){
	    		productdata = null;
	    	}
		}else{
			PrdCode=mItem.productNo;	
		}
		var marketInfo="modelno:"+mItem.modelNo+",marketno:"+mItem.marketNo+",productno:"+PrdCode;
		notClickSetCookie(mItem.marketNo,marketInfo);
	}catch(e){
	}	
}*/


function showMarket(temp){
	temp = base64encode(utf16to8(temp));
	var urlStr = "PubShow?temp="+temp;
	//数据处理
	$.ajax({type: "POST",url: urlStr});	
}

function menudeal(code){
	var menuNo = "";
	var menuList = $.lily.menuInfo;
    for(var e=0;e<menuList.length;e++){
        if(menuList[e].menuAppCode==code&&code!=''){
        	temp = menuList[e].menuNo.split('');//用编号 直接得到父级 祖父级
        		if(temp[0]!='A'){
	    		    if(temp[0]=='B'){
	    		    	menuNo=menuList[e].menuFather;
		            }else{
		               menuNo='A00'+temp[3]+'0000';
		            }
		        }
	        }
	    }
   	return menuNo;
	
}


/*
 * 67、根据当前日期自动给页面赋值（包含闰年的情况，按月为跨度）
 * 参数说明：1、beginDateId：开始日期ID，2、endDateId：截止日期ID，3、monthCount：月跨度
 */
function countTrueDate2(beginDateId,endDateId,monthCount,currentElement){
	
	$.lily.ajax({
		url : 'getSysTime.do',
		type : 'post',
		async:false,
		processResponse : function(data) {
			sysDate = data.sysDate;
		}
	});
		var year = sysDate.substring(0,4);  //年
		var month = sysDate.substring(4,6); //月
		var day = sysDate.substring(6,8);  //日
		var sureYear=year;
		month=month.charAt('0')>1?month.substr(1,1):month;
		var sureMonth= month-monthCount;   //当前日期减去业务需求月
		var sureDay=day;
		if(sureMonth==0){
		sureMonth=12;
		sureYear=year-1;
		}
		if(sureMonth<0){
			sureMonth=12+sureMonth;
			sureYear=year-1;
		}
		
		if(sureMonth==4||sureMonth==6||sureMonth==9||sureMonth==11){
			if(sureDay>30){
				sureDay=30;
			}
		}
		if(sureMonth==2){
			//判断当前年为闰年，闰年2月29天
	        if((sureYear%4==0&&sureYear%100!=0)||sureYear%400==0){
	        	if(sureDay>29){
	        		sureDay=29;
	            }
	        }else{
	        	if(sureDay>28){
	        		sureDay=28;
	            }
	        }
		}
		if(sureMonth<10&&sureMonth>0){
		sureMonth = "0"+sureMonth;
		}
		$("#"+endDateId,currentElement).val(year+"-"+month+"-"+day);    //截止日期
		$("#"+beginDateId,currentElement).val(sureYear+"-"+sureMonth+"-"+sureDay);  //开始日期
}

/*
 * 68、起始日期校验
 * 参数说明：1、beginDate：开始日期，2、endDate：截止日期
 */
function startDateValidate(beginDate,endDate){
	var errorMessage = '';
	var flag = false;
	var arys1 = new Array();
	var arys2 = new Array();
	var currentDate;//当前系统时间yyyyMMDD
	$.lily.ajax({
		url : 'getSysTime.do',
		type : 'post',
		async:false,
		data:{"channel":$.lily.sessionData.session_channel},
		processResponse : function(data) {
			currentDate = data.sysDate+'';
//			alert(curDate);
		}
	});
		/*
		 * 开始时间串，转换成日期
		 */
		arys1 = new String(beginDate).split('-');
		var sdate = arys1[0]+arys1[1]+arys1[2];
		/*
		 * 结束的时间串，转换成日期
		 */
		arys2 = new String(endDate).split('-');  
		var edate = arys2[0]+arys2[1]+arys2[2];
		var lastYear=(parseInt(currentDate.substr(0,4))-1)+''+'0101';
		if(sdate<lastYear){
			errorMessage="起始日期不能大于上一年的一月一日";
			return errorMessage;
		}
		
		if(sdate>currentDate){
			errorMessage="起始日期不能大于当前日期";
			return errorMessage;
		}
		
		//如果起始日期大于终止日期，返回错误信息
		if(sdate>edate){
			errorMessage="起始日期不能大于结束日期";
			return errorMessage;
		}
		//如果起始日期小于终止日期3个月以上，返回错误信息
		if(historyDate(edate)>sdate){
			errorMessage="起始日期不能小于结束日期超过三个月";
			return errorMessage;
		}
		
		//如果起始日期和终止日期相等，错误信息返回空
		if(sdate == edate||sdate==currentDate){
			errorMessage='';
			return errorMessage;
		}
		
		return errorMessage;
}
/*
 * 69、截止日期校验
 * 参数说明：1、beginDate：开始日期，2、endDate：截止日期
 */
function endDateValidate(beginDate,endDate){
	var errorMessage = '';
	var flag = false;
	var arys1 = new Array();
	var arys2 = new Array();
	var currentDate;//当前系统时间yyyyMMDD
	$.lily.ajax({
		url : 'getSysTime.do',
		type : 'post',
		async:false,
		data:{"channel":$.lily.sessionData.session_channel},
		processResponse : function(data) {
			currentDate = data.sysDate+'';
//			alert(curDate);
		}
	});
	/*
	 * 开始时间串，转换成日期
	 */
	arys1 = new String(beginDate).split('-');
	var sdate = arys1[0]+arys1[1]+arys1[2];
	/*
	 * 结束的时间串，转换成日期
	 */
	arys2 = new String(endDate).split('-');  
	var edate = arys2[0]+arys2[1]+arys2[2];
	
	if(edate>currentDate){
		errorMessage="结束日期不能大于当前日期";
		return errorMessage;
	}
	//如果起始日期大于终止日期，返回错误信息
	if(edate<sdate){
		errorMessage="结束日期不能小于起始日期";
		return errorMessage;
	}
//	如果终止日期大于起始日期3个月以上，返回错误信息
	if(historyDate(edate)>sdate){
		errorMessage="结束日期不能超过起始日期三个月";
		return errorMessage;
	}
	//如果起始日期和终止日期相等，错误信息返回空
	if(sdate == edate||sdate==currentDate){
		errorMessage='';
		return errorMessage;
	}
	
	return errorMessage;
}
/*
 * 70、获取从指定日期倒推三个月的日期
 * 参数说明：1、endDate：指定日期;
 */
  function historyDate(endDate) { 
	  var year = endDate.substring(0,4);  
      var month = endDate.substring(4,6);  
      var day= endDate.substring(6,8);  
      month=month.indexOf("0")==0?month.substr(1,1):month;
      var newMonth=parseInt(month)-3;
      var newYear=year;
      var newDay=day;
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
      
      if(newMonth<0){
      	newMonth=12+newMonth;
      	newYear=year-1;
      }
      if(newMonth==0){
      	newMonth=12;
      	newYear=year-1;
      }
      if(newMonth>0&&newMonth<10){
      	 newMonth='0'+newMonth;
       }
     var newDate= ''+newYear+newMonth+newDay;
      return  newDate;
}
	 //检查cookies
	 function checkCookie(cookieName)
	{
		name=getCookie(cookieName);
		if (name!=null && name!="")
		  return true;
		else 
			return false;
	}
	 //获取Cookie
	 function getCookie(c_name)
	{
		if (document.cookie.length>0)
		  {
		  c_start=document.cookie.indexOf(c_name + "=")
		  if (c_start!=-1)
		    { 
		    c_start=c_start + c_name.length+1 
		    c_end=document.cookie.indexOf(";",c_start)
		    if (c_end==-1) c_end=document.cookie.length
		/*    return unescape(document.cookie.substring(c_start,c_end))*/
		    return document.cookie.substring(c_start,c_end)
		    } 
		  }
		return ""
	}
	 function delCookie(name)
	 {
		// var cval = getCookie (name);
		 document.cookie= name+"=";
		// alert(getCookie(name));
	 }
	 //cookies点击赋值
	 function clickSetCookie(value)
	 {
		
			//cookie没有数据或者时间间隔符合要求，更新数据和时间
			//满足条件启动计数器
		 var date=new Date();
		if(!checkCookie("DATE")){
			document.cookie="DATE=" + date.getTime();
			setCookieJson("Clickcookie",value);
		}else if(date.getTime()-getCookie("DATE")>1000){
			setCookieJson("Clickcookie",value);
			document.cookie="DATE=" + date.getTime();
		}
		
	 }	
	 //cookies非点击赋值
	 function notClickSetCookie(key,value)
	 {
		var unclick = getCookie("UNCLICK");
		if(unclick !=""){
			var json = getJsonString(unclick);
			if(!checkJsonData(json,key)){
				setCookieJson("UNCLICK",key);
				setCookieJson("unclickCookie",value);
			}
		}else{
			setCookieJson("UNCLICK",key);
			setCookieJson("unclickCookie",value);
		}
	 }
	 //拼接json
	 function setCookieJson(cookieName,value){
			var clickCookie = getCookie(cookieName);
			if(clickCookie == ""){
				//document.cookie= cookie +"={"+getCookie(click) +":"+ value + "}";
				document.cookie= cookieName +"={"+ value + "}";
			}else{
					var json = getJsonString(clickCookie);
					if(cookieName=="UNCLICK"&&!checkJsonData(json,value)){
						json +=","  + value ;
						document.cookie= cookieName+"={"+json +"}";
					}else{
						json +="@"  + value ;
						document.cookie= cookieName+"={"+json +"}";
					}
				}
			}
	 function getJsonString(clickCookie){
		var json= "";
		var	star = clickCookie.indexOf("{");
		var	end = clickCookie.indexOf("}");
		if( star != -1 && end != -1){
			 json = clickCookie.substring(star+1,end);
		}
		return json;
		
	 }
	 function checkJsonData(json,jsonID){
		 var flag = false;
		 if(json !="" ){
			 if(json == jsonID){
				 flag = true;
			 }
			 if(json.indexOf(",")!=-1){
				var parames = json.split(",");
				var paramesLen = parames.length;
				for(var i = 0;i < paramesLen;i ++){
					if(parames[i] == jsonID){
						 flag = true;
					}
				}
			 }

		 }
		 return flag;
	 }
	 
/*	 window.onbeforeunload = onbeforeunload_handler;   
	 function onbeforeunload_handler(){   
//		 if($.lily.CONFIG_SESSION_ID){//若已登入
//        	$("#quitLogin").click();
//        }
		 //退出事件 曝光
		 baoGuangCookieSend();
		 //退出事件 点击
		 dianjiCookieSend();
	 }  */
	/* function baoGuangCookieSend(){
	    	var BGcookie = getCookie("unclickCookie");
	    	if(BGcookie !=""){
	    		showMarket(getJsonString(BGcookie));
	    		//cookie赋空
		   		 delCookie("unclickCookie");
				 delCookie("UNCLICK");
	    	}
	 }*/
	 //点击上送
/*	 function dianjiCookieSend(){
		 var DJcookie = getCookie("Clickcookie");
	    	if(DJcookie !=""){
	    		DJcookie = getJsonString(DJcookie);
	    		DJcookie = base64encode(utf16to8(DJcookie));
			 	var urlStr = "PubProcess?temp="+DJcookie;
				// 数据处理
				$.ajax({type: "POST",url: urlStr});	
	    		//cookie赋空
		   		 delCookie("Clickcookie");
				 delCookie("DATE");
	    	}
		 

	 }	 */
	 
/*
 * 规定时间内多次点击，只有最后一次生效
 */	 
	 var _timer = {};
function delay_till_last(id, fn, wait) {
	     if (_timer[id]) {
	         window.clearTimeout(_timer[id]);
	         delete _timer[id];
	     }
	  
	     return _timer[id] = window.setTimeout(function() {
	         fn();
	         delete _timer[id];
	     }, wait);
	 }
/**
 * 加入遮罩防重复点击
 * @param fn
 * @param height
 */
function clickOnlyOne(fn ,height,width) {
		$.lily.LoadModelUserDefined(height);
        fn();
        $.lily.LoadModelUserDefined(height,0.1,width);
}	 

/*
 * 动态的给Ta：select拼接下拉code
 * 传入参数： (1)nameValue：select的name名称；  
 * 			 (2)要去掉的基金公司code为json对象：例如'{"01":"01"}'
 * 			 (3)如果需要哪个基金公司code默认选中，传入该code值
 *           (4)传入参数为当前页面，目前写死currentElement;
 */
function dealTAForFund(nameValue,taCodeRemove,realTaCode,nowWeb,currentMVC){
	var windowId = "";
	if(!(currentMVC==null||currentMVC==undefined||currentMVC=="")){
		windowId = currentMVC.windowId;
	}
	var fundCorpList;
	
	$.lily.ajax({
	    url: "queryAllFundCompany.do",
	    type: 'post', 
	    dataType:'json',
	    async:false,
	    data:{'currentBusinessCode':'01200311','windowId':windowId},
	    processResponse: function(data){
	    	var taCodeRemoveJson = $.parseJSON(taCodeRemove); //要去掉基金公司的Ta 
	    	fundCorpList = data.itainfo;              			   // 所有基金公司
	    	var name = "select[name='"+nameValue+"']";                     				   //下拉框
	    	$(name,nowWeb).find("option:gt(0)").remove();
	    	for ( var i = 0; i < fundCorpList.length; i++) {
	    		var fcc = fundCorpList[i].tACd;         					    // 基金公司代码
	    		var fcn = fundCorpList[i].tANme;   					     // 基金公司名
	    		if(taCodeRemove!=null && taCodeRemove!="" && taCodeRemoveJson[fcc] == fcc){ //有要去掉的Ta
		    		continue;
	    		}
	    		var optionBegin = "<option ";
	    		var fundCorpOther = optionBegin+"value='"+fcc+"' id='"+fcc+"'";
	    		if(realTaCode!=null && realTaCode!="" && fcc == realTaCode ){ //有要默认的Ta
	    			fundCorpOther = fundCorpOther +" selected>"+fcn +"</option>";
	    		}else{
	    			fundCorpOther = fundCorpOther +">"+fcn +"</option>";
	    		}
	    		$(name,nowWeb).append(fundCorpOther);
	    	}
	    }
	});
}


function isIE(){
	 return (navigator.appName == 'Microsoft Internet Explorer');
} 


//使用
//交易码与交易名称的转换
function tradeCodeToName(code,callback){
	var code=code;
	if(code==null || code=='null' || code=='' || code=='undefined' || code==undefined){
		return '';
	}else{
		$.lily.ajax({
		 	url: 'paramQuery.do',
		 	type: 'post', 
		 	data:{
		 		'parameterValue':code,
		 		'parameterKey':'BUSINESS_CODE'
		 		},
		 	async: false,
		 	processResponse: function(data){
		 		//console.log(data.parameterName);
		 		//return data.parameterName;
		 		if(callback){
		 			callback(data.parameterName);
		 			
				}

		 	},
		 	selfdefineFailed:function(data){
	        	//alert(data.em);
		 		return '';
	        }
		});
	};
};
var returnNameFun={
	//名称匹配
	nameMatch:function(ajax,valueId,appendToAim){
			//ajax:所有匹配的集合地址
			//valueId:要匹配的值的ID
			//appendTo:匹配结果追加的位置
			var ubpBusinessName=new Array();//名称数组
			var resultArr=new Array();//结果数组
			var noneVal=1;//不在数组中的值的个数
			$.lily.ajax({
				url: ajax,
				type: 'post',
				async:false,
				processResponse: function(data){
					ubpBusinessName=data.ubpBusinessName;
				}
			});
			console.log(ubpBusinessName);
			valueId.keyup(function(){
				var val=$(this).val();
				if($.trim(val)==''){
					appendToAim.hide().children('ul').empty();
					resultArr=[];
				}else{
					for(var i=0;i<ubpBusinessName.length;i++){
						/*if(ubpBusinessName[i].indexOf(val)>-1){
							
							if($.inArray(ubpBusinessName[i],resultArr) == -1){
								resultArr.push(ubpBusinessName[i]);
								console.log('resultArr='+resultArr);
							};
						};*/
						if(ubpBusinessName[i].indexOf(val)==0){
							
							if($.inArray(ubpBusinessName[i],resultArr) == -1){
								resultArr.push(ubpBusinessName[i]);
								console.log('resultArr='+resultArr);
							};
						};
					};
					if(resultArr.length>0){
						returnNameFun.setList(valueId,appendToAim,resultArr);
						//console.log(resultArr);
					}else{
						appendToAim.hide().children('ul').empty();
					};
				};
			});
		},
	setList:function(valueId,appendToAim,resultArr){
			var html='';
			for(var i=0;i<resultArr.length;i++){
				html+='<li>'+resultArr[i]+'</li>';
			};
			//console.log(html);
			appendToAim.show().children('ul').empty().append(html);
			appendToAim.on('click','li',function(){
				valueId.val($(this).text());
				appendToAim.hide().children('ul').empty();
			});
		}
};
//用户身份
/*function ubpUserId(id){
	switch(id)
	{
	case '0':
		return '游客';
		break;
	case '1':
		return '会员';
		break;
	case '2':
		return 'VIP';
		break;
	default:
		return id;
	}
};*/
//将名字只留第一个字，后这的字都是*号；
function ubpCutName(word){
	var html;
	if(word.length==2){
		html=word.substring(0,1);
		for(var i=1;i<word.length;i++){
			html+="*";
		};
	}else if(word.length>2){
		html=word.substring(0,1);
		for(var i=1;i<(word.length-1);i++){
			html+="*";
		};
		html+=word.substring(word.length-1);
	};
	return html;
};
//手机号把中间4位为*
function ubpCutPhone(number){
	var html;
	html=number.substring(0,3)+"****"+number.substring(7);
	return html;
};
//日期转Str  
function toYYYYMMDD(date) {  
    var d = new Date(date.getTime());  
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate().toString();  
    var month = d.getMonth()+1;
    var mm = month < 10 ? "0" + month : month.toString();  
    var yyyy = d.getFullYear().toString();
    return yyyy+mm+dd;  
};
//日期转Str  
function toYYYYMMDD1(date) {  
    var d = new Date(date.getTime());  
    var dd = d.getDate() < 10 ? "0" + d.getDate() : d.getDate().toString();  
    var month = d.getMonth()+1;
    var mm = month < 10 ? "0" + month : month.toString();  
    var yyyy = d.getFullYear().toString();
    return yyyy+'-'+mm+'-'+dd;  
};
/*//计算日期相差天数
function DateDiff(sDate1,sDate2){    //sDate1和sDate2是2006-12-18格式        注：IE不支持'-' aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2]
	   var  aDate,  oDate1,  oDate2,  iDays        
	   aDate  =  sDate1.split("-")        
	   oDate1  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2])    //转换为12-18-2006格式        
	   aDate  =  sDate2.split("-")        
	   oDate2  =  new  Date(aDate[0]  +  '-'  +  aDate[1]  +  '-'  +  aDate[2])        
	   iDays  =  parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数       
	   return  iDays + 1       
};*/
//将毫秒数格式化成1m1s的形式
function formatTime(time){
	if(time == ""||time==null||time==0||time=="0"){
		return "0m0s";
	}else if(time.length > 3){
		var timeT = time.substring(0,time.length-3);  //去掉ms
		var second = parseInt(timeT) % 60;
		var minute = parseInt(timeT/60);
		return minute+'m'+second+'s';
	}
};
//计算距指定日期n天前的日期 传入时间格式：YYYYMMDD或者YYYY/MM/DD
function getBefore(date,n){
	if(date.indexOf("/") <= 0){
		date = date.substring(0,4)+'/'+ date.substring(4,6)+'/'+ date.substring(6,8);
	}
	var d = new Date(date);
	var beforeMS = d.getTime()-1000*60*60*24*n;
	var beforeDate = new Date(beforeMS);
	return toYYYYMMDD(beforeDate);
};
//计算距指定日期n天后的日期 传入时间格式：YYYYMMDD或者YYYY/MM/DD
function getLater(date,n){
	if(date.indexOf("/") <= 0){
		date = date.substring(0,4)+'/'+ date.substring(4,6)+'/'+ date.substring(6,8);
	}
	var d = new Date(date);
	var beforeMS = d.getTime()+1000*60*60*24*n;  //n天后
	var beforeDate = new Date(beforeMS);
	return toYYYYMMDD(beforeDate);
};

//计算日期相差天数//sDate1和sDate2是2006-12-18格式 
function DateDiff(sDate1,sDate2){       
	var  aDate,  oDate1,  oDate2,  iDays;       
	aDate = sDate1.split("-");
	//转换为12-18-2006格式
	oDate1 = new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2]);
	aDate = sDate2.split("-");        
	oDate2 = new  Date(aDate[0]  +  '/'  +  aDate[1]  +  '/'  +  aDate[2]);
	//把相差的毫秒数转换为天数
	iDays = parseInt(Math.abs(oDate1  -  oDate2)  /  1000  /  60  /  60  /24);         
	return  iDays + 1;
}
//用一个字符串放回所有的天数
function DateAll(startDate,endDate){
	var allDateString="";
	var dateDiff = DateDiff(startDate,endDate);
	var date  = new Date(startDate.replace(/-/g,   "/"));//
	
	for(var day=0; day<dateDiff;day++){
		var thisTime = new Date(date.getTime()+day*24*60*60*1000).format("yyyyMMdd");
		allDateString += thisTime + ",";
	}
	allDateString = allDateString.substring(0,allDateString.length-1);
	//alert(allDateString);
	return allDateString;
}