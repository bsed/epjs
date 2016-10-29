var keyAlgorithm  ="RSA";//"SM2"  //密钥生成算法
var keyLength  = 1024;//2048,4096,256  //密钥长度

/**
* 获取ActiveX对象
* @return {object} 获取失败则返回null
*/
function getActiveX()
{
	var result = document.getElementById('EnrollNew');
	if (result == null)
	{
		result = document.getElementById('EnrollOld');
		if (result == null)
		{
			alert("初始化ActiveX控件失败！请确认您的浏览器允许ActiveX控件运行");
			return null;	
		}
	}
	return result;
}

function getVistaActiveX(){
	return document.getElementById("objCertEnrollClassFactory");
}

//安装单证
//function (cspName,strContainName,signCert){
//	// keyLength、cspName、keyAlgorithm需与申请单证时设定的一致
//	// strContainName为申请单证时保存下来的密钥容器名称
////signCert为CA返回的证书数据
//	var res1=CertEnrollment.CFCA_SetCSPInfo(keyLength,cspName);
//	var res2 = CertEnrollment.CFCA_SetKeyAlgorithm(keyAlgorithm);
//	try{
//		var res3 = CertEnrollment.CFCA_ImportSignCert(1, signCert, strContainName);		
//	}catch(e){
//		alert(e.name+":"+e.description);
//	}
//	return res3;
//}


/*取证书主题  
如下
CN=hrbb019601120015, OU=Enterprises, OU=YUZHI, O=CFCA TEST CA, C=CN;412e6f46a52307b33c1effac217c51b2;2013-01-11 14:13:31;2013-07-11 14:13:31;Haitai HaiKey 3000 CSP For HRBank||T=m-alipay, O=Alipay.com Corporation, OU=CA Center, CN=af7e15c72b003dc3ca432acdccea555a;78139783c66df18afdcc825fd682ad21;2012-09-18 09:52:32;2014-09-18 09:52:32;
*/
function getCertInfo(USBKeySn){
	var certInfo =CertEnrollment.CFCA_GetAllCertInfo();
	var curCertInfo="";
	var certInfoArray =certInfo.split("||");
	for(var i=0;i<certInfoArray.length;i++){
		var icertinfo =certInfoArray[i].split(";");
		if(icertinfo[0].indexOf(USBKeySn)!=-1){
			curCertInfo=icertinfo[0];
			break;
		}
	}
	return curCertInfo;
}

/*取证书CSP
如下
CN=hrbb019601120015, OU=Enterprises, OU=YUZHI, O=CFCA TEST CA, C=CN;412e6f46a52307b33c1effac217c51b2;2013-01-11 14:13:31;2013-07-11 14:13:31;Haitai HaiKey 3000 CSP For HRBank||T=m-alipay, O=Alipay.com Corporation, OU=CA Center, CN=af7e15c72b003dc3ca432acdccea555a;78139783c66df18afdcc825fd682ad21;2012-09-18 09:52:32;2014-09-18 09:52:32;
*/
function getCertCSP(USBKeySn){
	var certInfo =CertEnrollment.CFCA_GetAllCertInfo();
	var curCertInfo="";
	var certInfoArray =certInfo.split("||");
	for(var i=0;i<certInfoArray.length;i++){
		var icertinfo =certInfoArray[i].split(";");
		if(icertinfo[0].indexOf(USBKeySn)!=-1){
			curCertInfo=icertinfo[4];
			break;
		}
	}
	return curCertInfo;
}




///**
//* 初始化CSP列表
//*/
//function initCSP()
//{
//	addCSP('请选择USB Key对应的CSP', 0);
//	
//	if(isVista()){
//		var activeXObject = getVistaActiveX();
//		var objCSPs = objCertEnrollClassFactory.CreateObject("X509Enrollment.CCspInformations");
//		objCSPs.AddAvailableCsps();
//        for (var i = 0; i < objCSPs.Count; i++) {
//			var cspInfo = objCSPs.ItemByIndex(i);
//            /* don't use unsafe cryptographic service providers */
//            //if (cspInfo.LegacyCsp == false) {
//				if (filterCSP(cspInfo.Name)) {
//					addCSP(cspInfo.Name, 1);
//				}	
//            //}
//        }
//	}else{
//		var myActiveXObject = getActiveX();
//		if (myActiveXObject == null)
//		{
//			return;
//		}
//		myActiveXObject.providerType = 1;
//		var cspArray = myActiveXObject.enumProviders(0,0);
//		for (var i=0; i<cspArray.length; i++)
//		{
//			try{
//				var currentCSP = myActiveXObject.enumProviders(i,0);
//				if (currentCSP.length == 0)
//				{
//					continue;
//				}
//				if (filterCSP(currentCSP)) {
//					addCSP(currentCSP, 1);
//				}			
//			}catch(e){
//			   
//			}
//		}
//	}
//}
//
//function isVista(){
//	 var appVer = navigator.userAgent; 
//	 if(appVer.indexOf("NT 6.0") > 0 || appVer.indexOf("NT 6.1") > 0){
//	 	return true;
//	 }
//	 return false;
//}
//
//function addCSP(text, value) {
//	var cspSelect = document.getElementById('cspSelect');
//	var lastIndex = cspSelect.length;
//	cspSelect.length += 1;
//	cspSelect.options[lastIndex].text = text;
//	cspSelect.options[lastIndex].value = value;
//}
//
///**
//* 对CSP进行过滤
//* @param {String} CSP名称
//* @return {bool} 是否显示此CSP
//*/
//function filterCSP(name)
//{
//	return true;
//}


/**
* 产生证书请求
*/
function getPKCS10(USBKeySn)
{
//	try 
//    {
//	    
//	    
//		var cspName = document.getElementById("cspSelect").value;//csp名称
//		//document.getElementById("cspName").value=cspName;
//		$("input[name='cspName']").val(cspName);
//		var strSubjectDN =getCertInfo(USBKeySn);//"CN=certRequisition,O=CFCA TEST CA,C=CN";//证书主题  
//	    var res1 = CertEnrollment.CFCA_SetCSPInfo(keyLength, cspName);
//		var res2= CertEnrollment.CFCA_SetKeyAlgorithm(keyAlgorithm);
//		var pkcs10Requisition = CertEnrollment.CFCA_PKCS10CertRequisition(strSubjectDN, 1, 0);//第二个参数 1 单证 2双证
//		//document.getElementById("textareaP10RSASingleCert").value = pkcs10Requisition;
//		var ContainName = CertEnrollment.CFCA_GetContainer(); //密钥容器名称
//	    $("input[name='ContainName']").val(ContainName);
//		//document.getElementById("ContainName").value = contianerName;
//		//document.getElementById("TextContianerName").value = contianerName;
//		//...need to sent pkcs10 requisition to CA
//		return pkcs10Requisition;
//    }
//    catch (e)
//    {
//    	alert(e);
//        var LastErrorDesc = CertEnrollment.GetLastErrorDesc();
//        alert(LastErrorDesc);
//    }
	var pkcs10req = CreatePKCS10();
	return pkcs10req;
}

function getPKCS10Vista(){
        var objPrivateKey = objCertEnrollClassFactory.CreateObject("X509Enrollment.CX509PrivateKey");
        var objRequest = objCertEnrollClassFactory.CreateObject("X509Enrollment.CX509CertificateRequestPkcs10");
        var objObjectId = objCertEnrollClassFactory.CreateObject("X509Enrollment.CObjectId");
        var objDn = objCertEnrollClassFactory.CreateObject("X509Enrollment.CX500DistinguishedName");
        var objEnroll = objCertEnrollClassFactory.CreateObject("X509Enrollment.CX509Enrollment");
        //  Initialize the csp object using the desired Cryptograhic Service Provider (CSP)
        var selectObject = document.getElementById('cspSelect');
		var selectCSP = selectObject.options[selectObject.selectedIndex];
		if (selectCSP.value == '0')
		{
			alert('请选择USB Key对应的CSP');	
			return null;
		}
        //  Provide key container name, key length and key spec to the private key object
        //objPrivateKey.ContainerName = "AlejaCMa";
        objPrivateKey.ProviderName = selectCSP.text;
        objPrivateKey.Existing = false;
        objPrivateKey.ExportPolicy = 1;
        //objPrivateKey.KeyUsage = &HFFFFFF;
        objPrivateKey.KeySpec = 1; // AT_KEYEXCHANGE = 1

		objObjectId.InitializeFromValue("1.2.840.113549.2.5");
		
		objDn.Encode("c=cn", 3); 
        objRequest.InitializeFromPrivateKey(1, objPrivateKey, ""); // context user = 1
        
        objRequest.HashAlgorithm = objObjectId;

        // DN related stuff
        objDn.Encode("c=cn", 0); // XCN_CERT_NAME_STR_NONE = 0
        objRequest.Subject = objDn;

        // Enroll
        objEnroll.InitializeFromRequest(objRequest);
        var pkcs10 = objEnroll.CreateRequest(1); // XCN_CRYPT_STRING_BASE64REQUESTHEADER = 3
		alert(pkcs10);
        return pkcs10;
}
