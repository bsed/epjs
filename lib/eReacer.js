var SUCCESS_EREADER_FLAG = "0";//E-Reader连接打开成功标志
var SUCCESS_OPERATOR_FLAG = "36864";//E-Reader操作成功标志
//var setupcab = document.getElementById('setupcab');
/*function openEReader()
{		
		//获取器具类型
        var hasEreader = setupcab.GetEreaderType();
		if(SUCCESS_EREADER_FLAG == hasEreader){
			var type = setupcab.EreaderType;
	       	var isOpen = setupcab.OpenReader(type);
	       	if(SUCCESS_EREADER_FLAG == isOpen){
	       		setupcab.ProConnect;
	       		return true;
	       	}else{
	       		alert("请连接E-Reader异常，请检查设备");
	       		return false;
	       	}
		}else{
			alert("请连接E-Reader设备");
			return false;
		}
}*/

/*//获取卡号
function getCradNo(){
     var cardNo = "";
	 if(SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(14,"00A40000023F00") 
	     		&& SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(10,"00B0840008")){//读取卡号
	     	 cardNo = setupcab.resp;
	     }else{
	     	alert("请确定卡片已经放好");
	     }
	 
	 return cardNo;
}

//获取余额
function getBalanceAmt(){
	var balanceAmt = "";
		if(SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(14,"00A40000023F00") 
	    		&& SUCCESS_OPERATOR_FLAG	== setupcab.ProApdu(14,"00A40000021001") 
	    		&& SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(10,"805C000204")){
	    	
	    	balanceAmt = parseInt(setupcab.resp,16); 
//	    	var zheng = "000".substring(balanceAmt.length-2,0); 
//	    	var xiao = "000".substring(balanceAmt.length-2); 
//	    	balanceAmt = zheng+"."+xiao;
	    	balanceAmt = balanceAmt/100;
	    }else{
	    	alert("请确定卡片已经放好");
	    }
	return balanceAmt;
}

//获取有效期
function getCardStartAdnEndDate(){
	var cardStartAndEndDate = "";
		if(SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(14,"00A40000023F00") 
	    		&& SUCCESS_OPERATOR_FLAG == setupcab.ProApdu(10,"00B0841808")){
			
			cardStartAndEndDate = setupcab.resp; 
	    	
	    }else{
	    	alert("请确定卡片已经放好");
	    }
	return cardStartAndEndDate;
}

//获取E-Reader编号
function getEReaderNumber(){
	var eReaderNumber = "";
	if(SUCCESS_OPERATOR_FLAG == setupcab.PkiReaderNumber()){
		eReaderNumber = setupcab.resp; 
    }
	return eReaderNumber;
}

//获取E-Reader版本
function getEReaderVer(){
	var eReaderVer = "";
	if(SUCCESS_EREADER_FLAG == setupcab.GetEreaderVer()){
		eReaderVer = setupcab.resp; 
    }
	return eReaderVer;
}

//关闭E-Reader
function closeReader(){
	if(SUCCESS_EREADER_FLAG == setupcab.CloseReader()){
		return true;
	}else{
		return false;
	}
}

//执行 apdu指令 ，返回长度和 指令串 ，中间用","间隔
function exceuteApdu(length,apduString,flag){
	var result;
	if(flag == 1){
		result = setupcab.ProApdu(parseInt(length),apduString);
		var apduLength = setupcab.rlen;
		return apduLength+","+setupcab.resp+","+result.toString(16); 
	}else if(flag == 2){
		setupcab.PkiVerifyPin(6,"123456");
		result = setupcab.SendSecApduPack(parseInt(length),apduString);
		var apduLength = setupcab.rlen;
		return setupcab.resp; 
	}
	 
	
}


//卡片复位 
function resetCard(){
	if(SUCCESS_OPERATOR_FLAG == setupcab.ProConnect){
		return true;
	}else{
		return false;
	}
}*/