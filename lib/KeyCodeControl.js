/////////////////////////////////////////////////////////////////////////
// 
// Copyright (C) 2007 e-Channels CORPORATION
// 
// ALL RIGHTS RESERVED BY e-Channels CORPORATION, THIS PROGRAM
// MUST BE USED SOLELY FOR THE PURPOSE FOR WHICH IT WAS  
// FURNISHED BY e-Channels CORPORATION, NO PART OF THIS PROGRAM
// MAY BE REPRODUCED OR DISCLOSED TO OTHERS, IN ANY FORM
// WITHOUT THE PRIOR WRITTEN PERMISSION OF e-Channels CORPORATION.
// USE OF COPYRIGHT NOTICE DOES NOT EVIDENCE PUBLICATION
// OF THE PROGRAM
// 
//			e-Channels CONFIDENTIAL AND PROPRIETARY
// 
////////////////////////////////////////////////////////////////////////////

/**
 * 控件的classid
 */
var KEY_CODE_CONTROL_CLASSID = 'B1CE16C6-EE96-44D0-8866-654C5536F810';
var isIE = (navigator.appName == 'Microsoft Internet Explorer');

/**
 * 密码控件，如果启用控件，则在调用的地方写密码控件的Object，否则写input
 * @param name		控件名称，可选，默认为'password'
 * @param options	控件选项，可选，默认为'password'
 * 			width: '140',			控件宽度
 *			height: '20',			控件高度
 *			size: '24',				不使用控件时input的大小
 *			maxlength: '20',		密码最大长度
 *			minlength: '6',			密码最小长度
 *			className: 'text_area'	样式名称
 * @return
 * @author luogs@yuchengtech.com
 */
function KeyCodeControl(name, options) {
	this.ctrlId = arguments[0]? arguments[0] : 'password';
	this.options = {
			width: '156',			/*控件宽度*/
			height: '20',			/*控件高度*/
			size: '20',				/*不使用控件时input的大小*/
			maxlength: '20',		/*密码最大长度*/
			minlength: '6',			/*密码最小长度*/
			className: 'text_area'	/*样式名称*/
			
	};
	for (var property in options) {
		this.options[property] = options[property];
	}
	
	this.inputCtrl = null;
	this.isInstallCtrl = false;
	this.init();
}

KeyCodeControl.prototype.init = function() {

	if ($.lily.keyCodeControlEnabled) {
		if(isIE)
			$('[data-toggle="passwd"]').append('<OBJECT id="'+this.ctrlId+'" name="'+
			this.ctrlId+'" classid="clsid:'+KEY_CODE_CONTROL_CLASSID+'" width="'+this.options.width+'px" height="'+
			this.options.height+'px" class="'+this.options.className+'"></OBJECT>');
		else{
			$('[data-toggle="passwd"]').append('<span id="'+this.ctrlId+'Area"><input id="'+this.ctrlId+'" name="'+
				this.ctrlId+'" type="password" class="'+this.options.className+'" size="'+this.options.size+'" maxlength="'+this.options.maxlength+'"/></span>');
		}
	} else {
		$('[data-toggle="passwd"]').append('<span id="'+this.ctrlId+'Area"><input id="'+this.ctrlId+'" width="200px" name="'+
		this.ctrlId+'" type="password" class="'+this.options.className+'" size="'+this.options.size+'" maxlength="'+this.options.maxlength+'"/></span>');
	}
	
	this.inputCtrl = document.getElementById(this.ctrlId);
	
	try{
		if (this.inputCtrl.inLength != "undefined" && 
				this.inputCtrl.inLength == 0 && 
				this.inputCtrl.GetKeyCode() == "") {
			this.isInstallCtrl = true;
			this.inputCtrl.SetMaxPwdLength(this.options.maxlength);
		} else {
			this.isInstallCtrl = false;
		}
	} catch (e) { }
}
// 取密文
KeyCodeControl.prototype.getKeyCode = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.GetKeyCode();
	} else {
		return this.inputCtrl.value;
	}
}
// 取明文长度
KeyCodeControl.prototype.getLength = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.inLength;
	} else {
		return this.inputCtrl.value.length;
	}
	
}
// 取哈希值
KeyCodeControl.prototype.getHash = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.GetHash();
	} else {
		return this.inputCtrl.value;
	}
}
// 取密码强度
KeyCodeControl.prototype.getPwdStrength = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.GetPwdStrength();
	} else {
		return getLs(this.inputCtrl.value);
	}
}

// 光标选中
KeyCodeControl.prototype.focus = function() {
	if (settings.keyCodeControlEnabled) {
		// do nothing
	} else {
		this.inputCtrl.focus();
	}
}

//重置为空
KeyCodeControl.prototype.reset = function() {
	if (settings.keyCodeControlEnabled) {
		this.inputCtrl.ResetState();
	} else {
		this.inputCtrl.value = '';
	}
}

//取MAC地址
KeyCodeControl.prototype.getMacAddress = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.GetMacAddress();
	} else {
		return '';
	}
}

//是否包含字母和数字
KeyCodeControl.prototype.isValid = function() {
	if (settings.keyCodeControlEnabled) {
		return this.inputCtrl.IsNCValid();
	} else {
	    return isNumAndStr(this.inputCtrl.value);
	}
}

function isNumAndStr(str){
	var regexpUperStr=/[A-Z]+/;
	var reexpLowerStr=/[a-z]+/;
	var regexpNum=/\d+/;
	var uperStrFlag = regexpUperStr.test(str);
	var lowerStrFlag = reexpLowerStr.test(str);
	var numFlag = regexpNum.test(str);
	if((lowerStrFlag&&numFlag)||(uperStrFlag&&numFlag))
	   return true;
	return false;
}
/**
 * 密码强度
 */
function PasswordStrength(showed){	
	this.showed = (typeof(showed) == "boolean")?showed:true;
	this.styles = new Array();	

	this.styles[0] = {backgroundColor:"#EBEBEB",borderLeft:"solid 1px #FFFFFF",borderRight:"solid 1px #BEBEBE",borderBottom:"solid 1px #BEBEBE"};	
	this.styles[1] = {backgroundColor:"#FF4545",borderLeft:"solid 1px #FFFFFF",borderRight:"solid 1px #BB2B2B",borderBottom:"solid 1px #BB2B2B"};
	this.styles[2] = {backgroundColor:"#FFD35E",borderLeft:"solid 1px #FFFFFF",borderRight:"solid 1px #E9AE10",borderBottom:"solid 1px #E9AE10"};
	this.styles[3] = {backgroundColor:"#95EB81",borderLeft:"solid 1px #FFFFFF",borderRight:"solid 1px #3BBC1B",borderBottom:"solid 1px #3BBC1B"};

	this.labels= ["弱","中","强"];
	this.divName = "pwd_div_"+Math.ceil(Math.random()*100000);
	this.minLen = 6;
	this.width = "133px";
	this.height = "21px";
	this.content = "";
	this.selectedIndex = 0;
	this.init();	
}

PasswordStrength.prototype.init = function(){
	var s = '<table  cellpadding="0" id="'+this.divName+'_table" cellspacing="0" style="width:'+this.width+';height:'+this.height+';">';
	s += '<tr>';
	for(var i=0;i<3;i++){
		s += '<td id="'+this.divName+'_td_'+i+'" width="33%" align="center"><span style="font-size:1px">&nbsp;</span><span id="'+this.divName+'_label_'+i+'" style="display:none;padding:2px;font-size: 12px;color: #000000;">';
		s += this.labels[i]+'</span></td>';
    }
	s += '</tr>';
	s += '</table>';
	this.content = s;
	if(this.showed){
		document.write(s);
		this.copyToStyle(this.selectedIndex);
	}	
}

PasswordStrength.prototype.copyToObject = function(o1,o2){
	for(var i in o1){
		o2[i] = o1[i];
	}
}

PasswordStrength.prototype.copyToStyle = function(id){
	this.selectedIndex = id;
	for(var i=0;i<3;i++){
	 	if(i == id-1){
			this.$(this.divName+"_label_"+i).style.display = "inline";
	  	}else{
	    this.$(this.divName+"_label_"+i).style.display = "none";
	  }
	}
	for(var i=0;i<id;i++){
		this.copyToObject(this.styles[id],this.$(this.divName+"_td_"+i).style);			
	}
	for(;i<3;i++){
		this.copyToObject(this.styles[0],this.$(this.divName+"_td_"+i).style);
	}
}

PasswordStrength.prototype.$ = function(s){
	return document.getElementById(s);
}

PasswordStrength.prototype.setSize = function(w,h){
	this.width = w;
	this.height = h;
}

PasswordStrength.prototype.setMinLength = function(n){
	if(isNaN(n)){
		return ;
	}
	n = Number(n);
	if(n>1){
		this.minLength = n;
	}
}

PasswordStrength.prototype.setStyles = function(){
	if(arguments.length == 0){
		return ;
	}
	for(var i=0;i<arguments.length && i < 4;i++){
		this.styles[i] = arguments[i];
	}
	this.copyToStyle(this.selectedIndex);
}

PasswordStrength.prototype.write = function(s){
	if(this.showed){
		return ;
	}
	var n = (s == 'string') ? this.$(s) : s;
	if(typeof(n) != "object"){
		return ;
	}
	n.innerHTML = this.content;
	this.copyToStyle(this.selectedIndex);
}

PasswordStrength.prototype.update = function(s){
	if(s.length < this.minLen){
		this.copyToStyle(0);
		return;
	}
	var ls = -1;
	if (s.match(/[a-z]/ig)){
		ls++;
	}
	if (s.match(/[0-9]/ig)){
		ls++;
	}

 	if (s.match(/([^a-z0-9])/ig)){
		ls++;
	}

	if(ls==0&&s.length>=8)
	{
	    ls=1;
	}

	if (s.length < 6 && ls > 0){
		ls--;
	}
	LS=ls;

	switch(ls) { 
		 case 0:
			 this.copyToStyle(1);
			 break;
		 case 1:
			 this.copyToStyle(2);
			 break;
		 case 2:
			 this.copyToStyle(3);
			 break;
		 default:
			 this.copyToStyle(0);
	 }
}

//密码控件强度显示
PasswordStrength.prototype.updateContrl = function(ls){
	 switch(ls) { 
		 case 0:
			 this.copyToStyle(1);
			 break;
		 case 1:
			 this.copyToStyle(2);
			 break;
		 case 2:
			 this.copyToStyle(3);
			 break;
		 default:
			 this.copyToStyle(0);
	 }
}


//函数：ShowFlag(s)
//功能：设置密码设置提示；
//通过getLs获取密码的安全状态。
function ShowFlag(flagId, password) {
	if(typeof password =="string") {
		FLAGA.value= getLs(password);
	}
	
	if(typeof password =="object") {
		try{
			FLAGA.value = password.GetPwdStrength();
		}catch(e){ }
	}
	var tranType = document.getElementsByName("FLAG");
	var tranFlag = 0;
	
	for(var i=0;i<tranType.length;i++) {
		if(tranType[i].checked) {
			tranFlag = tranType[i].value;
			break;
		}
	}
	if(typeof naviObj == 'undefined'){	
		document.write("<script language='javascript' src='<%= scriptPath %>doNavigatorInfo.js'></script>");
		naviObj.initFFMethod();
	}
	var passText = tranFlag==0?i18n_KeyCodeControl_1:i18n_KeyCodeControl_2;
	if(FLAGA.value=="0") {
	   document.getElementById(flagId).innerText= i18n_KeyCodeControl_3;
	}
	
	if(FLAGA.value=="1"||FLAGA.value=="2") {
	    document.getElementById(flagId).innerText= i18n_KeyCodeControl_4 + passText;
	}
	if(password.length==0 || password.inLength==0) {
		document.getElementById(flagId).innerText = "新密码可以由6-10位的数字、大小写字母组成";
	}	
	
	if(FLAGA.value==-1 && password.length!=0 && password.inLength!=0) {
		document.getElementById(flagId).innerText = i18n_KeyCodeControl_3;
	}	
}


function getLs(s){
	var ls = -1;
	if(s.length  < 6 ){
		return ls;
	}
	
	if (s.match(/[a-z]/ig)){
		ls++;
	}

	if (s.match(/[0-9]/ig)){
		ls++;
	}

 	if (s.match(/([^a-z0-9])/ig)){
		ls++;
	}

	if(ls==0&&s.length>=8)
	{
	    ls=1;
	}	 
   return ls ;
}
