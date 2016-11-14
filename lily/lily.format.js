/**
 * jQuery format - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 *
 */
 
(function( $, undefined ) {
	if(!Function.bind) {

		Function.prototype.update = function(array, args) {
			var arrayLength = array.length, length = args.length;
		    while (length--) 
		    	array[arrayLength + length] = args[length];
		    return array;
		}
		Function.prototype.merge = function(array, args) {
		    array = Array.prototype.slice.call(array, 0);
		    return Function.update(array, args);
		}
		
		Function.prototype.bind = function(context) {
			if (arguments.length < 2 && typeof arguments[0] === "undefined") return this;
			var __method = this, args = Array.prototype.slice.call(arguments, 1);
			return function() {
				var a = Function.merge(args, arguments);
				return __method.apply(context, a);
			}
		}
		
	}
	/**
	 * 连续count个当前字符串连接
	 * @param {int} count
	 * @returns {string} 
	 */
	String.prototype.times = function(count) {
    	return count < 1 ? '' : new Array(count + 1).join(this);
  	}
	
	/**
	 * 字符串左补0到指定位数
	 * @param {int} width
	 * @returns {string} 
	 */
	String.prototype.leftPadZero = function( width ) {
		var pad = width - this.length;
		if ( pad > 0 ){
			return ("0".times(pad) + this); 
		}else{
			return this;	
		}
	};
	
	String.prototype.blank = function() {
	    return /^\s*$/.test(this);
	}
	
	/**
	 * 将日期对象根据指定的格式格式化为字符串
	 * @param {string} format 日期格式
	 * @returns {string}
	 */
	Date.prototype.format = function( format ){
		if ( !format ){
			format = $.lily.format.DATE_FORMAT;
		}
		return format.replace(
			$.lily.format.REGEXP_DATE,
			function(str){
				switch ( str.toLowerCase() ){
					case 'yyyy': return this.getFullYear();
					case 'mm': return (this.getMonth() + 1).toString().leftPadZero(2);
					case 'dd': return this.getDate().toString().leftPadZero(2);
					case 'hh': return this.getHours().toString().leftPadZero(2);
					case 'mi': return this.getMinutes().toString().leftPadZero(2);
					case 'ss': return this.getSeconds().toString().leftPadZero(2);
					case 'ms': return this.getMilliseconds().toString().leftPadZero(3);
				}
			}.bind(this)
		);
	};
	
	/**
	 * 比较日期是否为同一天
	 * @param {Date} compareDate 要比较的日期
	 * @returns {boolean} 
	 */
	Date.prototype.isSameDay = function( compareDate ) {
		return ( this.getFullYear() === compareDate.getFullYear() && this.getMonth() === compareDate.getMonth() && this.getDate() === compareDate.getDate() );
	};
	
	/**
	 * 取得当前日期的下一天
	 * @returns {Date} 
	 */
	Date.prototype.nextDay = function( ) {
		return new Date(Date.parse(this)+86400000);
	};
	
	
	
	$.lily.format = $.lily.format || {};
	
	$.extend( $.lily.format, {
		
		/*
		* 常量
		*/
		AREA_CODE : {11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"},
		MONEY_NUMS : new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"), 
		MONEY_DIGITS : new Array("", "拾", "佰", "仟"), 
		MONEY_BIGUNITS : new Array("", "万", "亿", "万亿","仟兆"),
		MONEY_SHOWNAME : new Array("分", "角", "圆"),
		
		MONEY_POSTFIX : "整",
		DATETIME_FORMAT : "yyyymmddhhmiss",
		TIME_FORMAT : "hhmiss",
		TIME_FORMAT_DISPLAY : "hh:mi:ss",
		DATE_FORMAT : "yyyymmdd",
		DATE_FORMAT_DISPLAY : "yyyy年mm月dd日",
		DATE_FORMAT_SHORT : "yyyy-mm-dd",
		
		/**
		* 正则表达式定义
		*/
		REGEXP_INTEGER : new RegExp(/^[0-9]+$/),
		REGEXP_FLOAT : new RegExp(/^([0-9]+(\.+))[0-9]+$/),
		REGEXP_DECIMAL : new RegExp(/^([0-9]+(\.?))?[0-9]+$/),
		REGEXP_MONEY : new RegExp(/^[0-9]{1,15}(\.[0-9]{0,2})?$/),
		REGEXP_COMMA : new RegExp('\,',["g"]),
		REGEXP_DOT : new RegExp('\\.',["g"]),
		REGEXP_EMAIL : new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/),
		REGEXP_EMAIL_ADDRESS : new RegExp(/^\w+((-\w+)|(\.\w+))*\@([a-z0-9]*[-_]?[a-z0-9]+)+[\.][a-z]{2,3}([\.][a-z]{2})?$/i),
		REGEXP_DATE : new RegExp(/(yyyy|mm|dd|hh|mi|ss|ms)/gi),
		REGEXP_PHONE : new RegExp(/^(((((0\d{2,3})-)(\d{7,8})(-(\d{1,6})))|((0\d{2,3})-)(\d{7,8}))|(([2-9][0-9]{6,7})+(\-[0-9]{1,4}))|(([2-9][0-9]{6,7}))|((1[1-9])[0-9]{9})|(\d{7,15}))?$/),
		REGEXP_PHONE_CODE : new RegExp(/^0\d{2,3}$/),
		REGEXP_TELEPHONE_CODE : new RegExp(/^(([0\+]\d{2,3}-)?(0\d{2,3})-)?([1-9]\d{6,7})(-(\d{3,}))?$/),
		REGEXP_PHONE_NOCODE : new RegExp(/^([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/),
		REGEXP_PHONE_EXTENSION : new RegExp(/^[0-9]{1,4}$/),
		REGEXP_MOBILE : new RegExp(/^(1[1-9])[0-9]{9}$/),
		REGEXP_HTTP : new RegExp(/^http:\/\/([\s\S]*)/),
		REGEXP_URL : new RegExp(/^http:\/\/(?:[\w-\.]{0,255})(?:(?:\/?[^\s]{0,255}){0,255})/g),
		REGEXP_ZIPCODE : new RegExp(/^[0-9]\d{5}$/),
		REGEXP_ISINTCHAR : new RegExp(/^[a-zA-Z0-9]+$/),
	    REGEXP_SPECIAL_CHAR:new RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/),
	    REGEXP_CHAR_TYPE : new RegExp(/[a-zA-Z]+/),
	    REGEXP_CONNECTION: new RegExp(/(^1[358][0-9]{9}$)|(^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$)/),
	    REGEXP_PROTOCOL_CONNECTION: new RegExp(/^([0-9]+(\-?))?[0-9]+$/),
	    REGEXP_CHINA_CHARACTERS: new RegExp(/[u4e00-u9fa5]/),
	    REGEXP_SPECIAL_CHAR_reg:new RegExp(/[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\?)(\)]+/),
	    REGEXP_CERT_TYPE:new RegExp(/[^\\d{15}$)|(^\\d{18}$)|(^\\d{17}(\\d|X|x)$]/),
	    PWD_FORMAT:new RegExp(/^[a-zA-Z0-9]{6}$/),
		isEmpty: function(s) {
			return ( s == null || s.length == 0 );
		},
		/**
		* 判断输入变量是否是特殊字符
		* @param {string} s 要检查的变量值
		* @returns {boolean} 是否是特殊字符
		*/
		isSpecialChar: function(s) {
			return ( $.lily.format.REGEXP_SPECIAL_CHAR.test(s) );
		},
		isInteger: function(s) {
			return ( $.lily.format.REGEXP_INTEGER.test(s) );
		},
		/*
		 * 字符校验
		 */
		isChar: function(s) {
			return ( $.lily.format.REGEXP_CHAR_TYPE.test(s) );
		},
		/**
		* 判断输入变量是否是浮点数（即小数点后有数字）
		* @param {string} s 要检查的变量值
		* @returns {boolean} 是否为浮点数
		*/
		isFloat: function( s ){
		    return ( $.lily.format.REGEXP_FLOAT.test(s) );
		},

		/**
		* 检查字符串是否为正数（整数或浮点数)
		* @param {string} s 字符串
		* @returns {boolean} 是否为正数（整数或浮点数)
		*/
		isDecimal: function(s) {
		    return ( $.lily.format.REGEXP_DECIMAL.test(s) );
		},

		/**
		* 检查字符串是否为合法的金额
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法金额
		*/
		isMoney: function(s) {
		    return ( $.lily.format.REGEXP_MONEY.test(s) );
		},

		/**
		* 检查字符串是否为合法的固定电话号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法固定电话号码
		*/
		isPhone: function(s) {
			return ( $.lily.format.REGEXP_PHONE.test(s) );
		},
		/**
		 * 检查字符串是否为合法的固定电话号码,带区号验证
		 * @param {string} s 字符串
		 * @returns {boolean} 是否为合法固定电话号码
		 */
		isTelephone: function(s) {
			return ( $.lily.format.REGEXP_TELEPHONE_CODE.test(s) );
		},

		/**
		* 检查字符串是否为合法的固定电话号码区号
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法固定电话号码区号
		*/
		isPhoneCode: function(s) {
			return ( $.lily.format.REGEXP_PHONE_CODE.test(s) );
		},
		/**
		* 检查字符串是否为合法的固定电话号码不包含区号
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法固定电话号码不包含区号
		*/
		isPhoneNoCode: function(s) {
			return ( $.lily.format.REGEXP_PHONE_NOCODE.test(s) );
		},
		/**
		* 检查字符串是否为合法的固定电话分机号
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法固定电话分机号
		*/
		isPhoneExtension: function(s) {
			return ( $.lily.format.REGEXP_PHONE_EXTENSION.test(s) );
		},
		
		/**
		* 检查字符串是否为合法的手机号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法手机号码
		*/
		isMobile: function(s) {
		    return ( $.lily.format.REGEXP_MOBILE.test(s) );
		},
		/**
		* 检查字符串是否为合法的邮政编码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法邮政编码
		*/
		isZipCode: function(s) {
		    return ($.lily.format.REGEXP_ZIPCODE.test(s) );
		},
		/**
		* 检查字符串是否全部为中文
		* @param {string} s 字符串
		* @returns {boolean} 是否全部为中文
		*/
		isChinese: function(s) {
		    for (var index = 0, len = s.length; index < len; index++) {
		        var charCode = s.charCodeAt(index);
		        if ( ( charCode < 19968 ) || (charCode > 40869) ) {
		            return false;
		        }
		    }
		    return true;
		},

		/**
		* 检查字符串是否为合法的Email
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法Email
		*/
		isEmail: function(s) {
		    if(s.length>50){
		        return false;
		    }
		    return ( $.lily.format.REGEXP_EMAIL.test(s) );
		},
		/**
		 * 检查字符串是否为合法的Email
		 * @param {string} s 字符串
		 * @returns {boolean} 是否为合法Email
		 */
		isEmailAddress: function(s) {
			if(s.length>50){
				return false;
			}
			return ( $.lily.format.REGEXP_EMAIL_ADDRESS.test(s) );
		},
		
		/**
		* 检查字符串是否为合法联系电话
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法联系电话
		*/
		isConnection: function(s) {
			return ( $.lily.format.REGEXP_CONNECTION.test(s) );
		},
		
		/**
		* 检查字符串是否为我的协议的合法联系电话
		* @param {string} s 字符串
		* @returns {boolean} 是否为我的协议的合法联系电话
		*/
		isProtocolConnection: function(s) {
			return ( $.lily.format.REGEXP_PROTOCOL_CONNECTION.test(s) );
		},
		
		/**
		* 检查字符串是否为合法的身份证号码
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法身份证号码
		*/
		isIDNumber: function( s ){
		    // 检查长度是否合法
		    switch(s.length){
		        case 15: case 18:{ 
		            break;
		        }
		        default:{
		            return false;
		        }
		    }
		    // 检查是否为数字
		    var testInt = ( s.length==15 ) ? s : s.substr(0,17) ;
		    if( !$.lily.format.isInteger(testInt) ) {
		        return false;
		    }
		    // 检查区域代码是否合法
		    var areaCode = parseInt( s.substr(0,2) );
		    if( !$.lily.format.AREA_CODE[areaCode] ) {
		        return false;
		    }
		    // 检查出生日期是否合法
//		    var birthDay = ( s.length==15 ) ? ("19" + s.substr(6,6) ): s.substr(6,8);
//		    if ( !$.lily.format.isDate( birthDay, $.lily.format.DATE_FORMAT ) ){
//		        return false;
//		    }
		    // 检查校验位是否合法
		    if ( s.length==18 ){
		    	var testNumber = ( parseInt(s.charAt(0)) + parseInt(s.charAt(10)) ) * 7
		            + ( parseInt(s.charAt(1)) + parseInt(s.charAt(11)) ) * 9
		            + ( parseInt(s.charAt(2)) + parseInt(s.charAt(12)) ) * 10
		            + ( parseInt(s.charAt(3)) + parseInt(s.charAt(13)) ) * 5
		            + ( parseInt(s.charAt(4)) + parseInt(s.charAt(14)) ) * 8
		            + ( parseInt(s.charAt(5)) + parseInt(s.charAt(15)) ) * 4
		            + ( parseInt(s.charAt(6)) + parseInt(s.charAt(16)) ) * 2
		            + parseInt(s.charAt(7)) * 1
		            + parseInt(s.charAt(8)) * 6
		            + parseInt(s.charAt(9)) * 3 ;
		        if ( s.charAt(17) != "10x98765432".charAt( testNumber % 11 )&&s.charAt(17) != "10X98765432".charAt( testNumber % 11 ) ){
		            return false;
		        }
		    }
		    return true;
		},
		
		/**
		* 检查字符串是否为合法的url
		* @param {string} s 字符串
		* @returns {boolean} 是否为合法手机号码
		*/
		isUrl: function(s) {
			/*if($.lily.format.REGEXP_HTTP.test(s) ){
				console.log($.lily.format.REGEXP_HTTP.test(s))
				return ( $.lily.format.REGEXP_URL.test(s) );
			}else{
				s="http://"+s;
				console.log($.lily.format.REGEXP_URL.test(s));
				return ( $.lily.format.REGEXP_URL.test(s) );
			};*/
			return ( $.lily.format.REGEXP_URL.test(s) );
		},
		
		
		parseDate: function( dateString, format ){
			var year=2000,month=0,day=1,hour=0,minute=0,second=0;
			format = format ||  $.lily.format.DATE_FORMAT;
			var matchArray = format.match( $.lily.format.REGEXP_DATE );
			for (var i = 0; i < matchArray.length; i++ ) {
				var postion =format.indexOf( matchArray[i] );
				switch (matchArray[i]) {
					case "yyyy":{
						year = parseInt( dateString.substr(postion,4), 10 );
						break;
					}
					case "mm":{
						month = parseInt( dateString.substr(postion,2), 10 )-1;
						break;
					}
					case "dd":{
						day = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "hh":{
						hour = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "mi":{
						minute = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
					case "ss":{
						second = parseInt( dateString.substr(postion,2), 10 );
						break;
					}
				}
			}
			return new Date(year,month,day,hour,minute,second);
		},
		
		formatDate: function(date, outFormat ) {
			if(date == '' || date == null){
				return '';
			}
			else {
				var parsedDate = $.lily.format.parseDate( date, $.lily.format.DATE_FORMAT );
				if( outFormat && typeof outFormat === "string" ) {
					return parsedDate.format( outFormat );
				}
				else {
					return parsedDate.format( $.lily.format.DATE_FORMAT_SHORT );	
				}
			}
		},
		
		formatTime: function( data, format ){
			var parsedDate = $.lily.format.parseDate( data, $.lily.format.TIME_FORMAT );
			if( format && typeof outFormat === "string" ) {
				return parsedDate.format( format );
			}
			else {
				return parsedDate.format( $.lily.format.TIME_FORMAT_DISPLAY );	
			}
		},
		
		formatDateTime: function( data, format ){
			var parsedDate = $.lily.format.parseDate( data, $.lily.format.DATETIME_FORMAT );
			if( format && typeof outFormat === "string" ){
				return parsedDate.format( format );
			}
			else {
				return parsedDate.format( $.lily.format.DATE_FORMAT_SHORT +" "+ $.lily.format.TIME_FORMAT_DISPLAY );	
			}
		},
		
		removeComma: function(str){
			if(str){
				return str.replace($.lily.format.REGEXP_COMMA,'');
			}else{
				return '0';
			}
		},
		
		addComma: function(str) {
			if (str.length > 3) {
				var mod = str.length % 3;
				var output = (mod > 0 ? (str.substring(0,mod)) : '');
				for (var i=0 ; i < Math.floor(str.length / 3); i++) {
					if ((mod == 0) && (i == 0))
						output += str.substring(mod+ 3 * i, mod + 3 * i + 3);
					else
						output += ',' + str.substring(mod + 3 * i, mod + 3 * i + 3);
				}
				return (output);
			}
			else 
				return str;
		},

		prepareCashString: function( cash, dot, digits ) {
			if (cash == undefined) cash = '0';
			if (dot == undefined) dot = true;
			if (digits == undefined) digits = 2;
			
			if (typeof cash !== 'string') {
				cash = cash.toString();
			}
			cash = $.lily.format.removeComma(cash);
			
			//TODO检查是否金额
			// 处理包含正负符号的情况
			var prefix = cash.charAt(0);
			if ( prefix == "-" || prefix == "+" ){
				return prefix + $.lily.format.prepareCashString( cash.substr(1), dot, digits );
			}
			
			if (cash.indexOf('.') != -1) {
				dot = true;	//如果输入串本身包含小数点，则忽略dot参数的设置，认为是真实金额大小
			}
			var integerCash, decimalCash;
			if (!dot) {
				if (cash.length <= digits) {
					cash = cash.leftPadZero(digits+1);
				}
				integerCash = cash.substring(0, cash.length - digits);
				decimalCash = cash.substring(cash.length - digits);
			} 
			else {
				var dotPos = cash.indexOf('.');
				if (dotPos != -1) {
					integerCash = cash.substring(0, dotPos);
					decimalCash = cash.substring(dotPos + 1);
				} 
				else {
					integerCash = cash;
					decimalCash = '';
				}
				if (integerCash.length == 0)
					integerCash = '0';
				if (decimalCash.length < digits) {
					decimalCash += '0'.times(digits - decimalCash.length);
				} 
				else {
					decimalCash = decimalCash.substring(0, digits);		//TODO 考虑四舍五入
				}
			}
			
			//去掉头部多余的0
			while (integerCash.charAt(0) == '0' && integerCash.length>1) {
				integerCash = integerCash.substring(1);
			}
			cash = integerCash + '.' + decimalCash;
			
			return cash;
		},
		
		convertIntegerToChineseCash: function(cash){
			if ( cash == "0" ) 
				return "";
		    var S = ""; //返回值 
		    var p = 0; //字符位置index 
		    var m = cash.length % 4; //取模 
		
		    // 四位一组得到组数 
		    var k = (m > 0 ? Math.floor(cash.length / 4) + 1 : Math.floor(cash.length / 4)); 
		    // 外层循环在所有组中循环 
		    // 从左到右 高位到低位 四位一组 逐组处理 
		    // 每组最后加上一个单位: "[万亿]","[亿]","[万]" 
		    for (var i = k; i > 0; i--)  {
		        var L = 4; 
		        if (i == k && m != 0) {
		            L = m;
		        }
		        // 得到一组四位数 最高位组有可能不足四位 
		        var s = cash.substring(p, p + L);
		        var l = s.length;
		
		        // 内层循环在该组中的每一位数上循环 从左到右 高位到低位 
		        for (var j = 0;j < l;j++) {
		            var n = parseInt(s.substring(j, j+1));
		            if (n == 0) {
		                if ((j < l - 1) && (parseInt(s.substring(j + 1, j + 1+ 1)) > 0) //后一位(右低) 
		                    && S.substring(S.length-1,S.length) != $.lily.format.MONEY_NUMS[n]) {
		                    S += $.lily.format.MONEY_NUMS[n];
		                }
		            }
		            else {
		                //处理 1013 一千零"十三",  1113一千一百"一十三" 
		//                if (!(n == 1 && (S.substring(S.length-1,S.length) == $.lily.format.MONEY_NUMS[0] | S.length == 0) && j == l - 2)) 
		//                {
		                    S += $.lily.format.MONEY_NUMS[n];
		//                }
		                S +=  $.lily.format.MONEY_DIGITS[l - j - 1];
		            }
		        }
		        p += L;
		        // 每组最后加上一个单位: [万],[亿] 等 
				if (i < k) {
					//不是最高位的一组 
					if (s>0) {
		                //如果所有 4 位不全是 0 则加上单位 [万],[亿] 等 
		                S += $.lily.format.MONEY_BIGUNITS[i - 1];
		            }
		        }
		        else {
		            //处理最高位的一组,最后必须加上单位 
		            S += $.lily.format.MONEY_BIGUNITS[i - 1];
		        }
		    }
			return S + $.lily.format.MONEY_SHOWNAME[2];
		},
		
		convertDecimalToChineseCash: function( cash ){
			var returnCash = "";
			if ( cash == "00" ){
				returnCash = $.lily.format.MONEY_POSTFIX;
			}
			else {
				for( var i = 0;i < cash.length; i++ ){
					if( i >= 2 ){break;}
					var intValue = parseInt(cash.charAt(i));
					switch( i ) {
						case 0:
							if ( intValue != 0 ){
								returnCash += $.lily.format.MONEY_NUMS[intValue] + $.lily.format.MONEY_SHOWNAME[1];
							}
							break;
						case 1:
							returnCash += $.lily.format.MONEY_NUMS[intValue] + $.lily.format.MONEY_SHOWNAME[0];
							break;
						default:
							break;
					}
				}
			}
			return returnCash;	
		},
		
		toPercentRate: function (rate){
			if($.lily.format.isEmpty(rate) ){
				return '';
			}
			if ( parseFloat(rate) == 0 ) {
				return '';
			}
			var temp = parseFloat(rate);
			return temp*100+"%";
		},
		toYuanRate: function (rate){
			if($.lily.format.isEmpty(rate) ){
				return '';
			}
			if ( parseFloat(rate) == 0 ) {
				return '';
			}
			var temp = parseFloat(rate);
			return temp/100;
		},
		toChineseCash: function( cash ){
			if ( $.lily.format.isEmpty(cash)|| !$.lily.format.isMoney(cash) ) {
				return '';
			}
			var noCommaCash = $.lily.format.prepareCashString(cash);
			if ( parseFloat(cash) == 0 ) {
				return '';
			}
			if( $.lily.format.isInteger( noCommaCash ) ) {
				return $.lily.format.convertIntegerToChineseCash(noCommaCash);
			}	
			var dotIndex = noCommaCash.indexOf('.');
			var integerCash = noCommaCash.substring( 0, dotIndex );
			var decimalCash = noCommaCash.substring( dotIndex + 1 );
			var result = "";
			if (!$.lily.format.isEmpty(integerCash) ){
				result += $.lily.format.convertIntegerToChineseCash(integerCash);
			}
			if ( !$.lily.format.isEmpty(decimalCash) ){
				result += $.lily.format.convertDecimalToChineseCash(decimalCash);
			}
			return result;
		},
		
		toCashWithComma: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null){
				return '';
			}
			else {
				var temp = $.lily.format.prepareCashString( cash, dot, digits );
				
				var dotPos = temp.indexOf('.');
				var integerCash = temp.substring(0, dotPos);
				var decimalCash = temp.substring(dotPos + 1);
			
				// 处理包含正负符号的情况
				var prefix = integerCash.charAt(0);
				if ( prefix == "-" || prefix == "+" ) {
					temp = prefix + $.lily.format.addComma(integerCash.substring(1)) + '.' + decimalCash;
				} 
				else {
					temp = $.lily.format.addComma(integerCash) + '.' + decimalCash;
				}
				if(temp=="0.00"){
					return '0.00';
				}
				return temp;
			}
		},
		//格式化日期，把YYYYMMDD转换YYYY-MM-DD或者YYYYMM转换成YYYY-MM
		dataToDate:function(value){   
			var  flag= "";
			if(value!=null||value!=""){
				if(value.length>=8){
					var yyyy = value.substring(0,4);
					var mm = value.substring(4,6);
					var dd = value.substring(6,8);
					flag = yyyy+"-"+mm+"-"+dd;
				}else if(value.length==6){
					var yyyy = value.substring(0,4);
					var mm = value.substring(4,6);
					flag = yyyy+"-"+mm;
				}
			}
			return flag;
		},
		toDataTimeDisplay:function(value){
			var  flag= "";
			if(value != null || value != ""){
				if(value.length>=14){
					var yyyy = value.substring(0,4);
					var mm = value.substring(4,6);
					var dd = value.substring(6,8);
					var hh = value.substring(8,10);
					var mi = value.substring(10,12);
					var ss = value.substring(12,14);
					flag = yyyy+"年"+mm+"月"+dd+"日"+hh+"时"+mi+"分"+ss+"秒";
				}else if(value.length==8){
					var yyyy = value.substring(0,4);
					var mm = value.substring(4,6);
					var dd = value.substring(6,8);
					flag = yyyy+"年"+mm+"月"+dd+"日"+"00时"+"00分"+"00秒";
				}
			}
			return flag;
		},
		//格式化，如果为0.则返回0.00
		toCashWithCommaReturn0: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null){
				return '';
			}
			else {
				var temp = $.lily.format.prepareCashString( cash, dot, digits );
				
				var dotPos = temp.indexOf('.');
				var integerCash = temp.substring(0, dotPos);
				var decimalCash = temp.substring(dotPos + 1);
			
				// 处理包含正负符号的情况
				var prefix = integerCash.charAt(0);
				if ( prefix == "-" || prefix == "+" ) {
					temp = prefix + $.lily.format.addComma(integerCash.substring(1)) + '.' + decimalCash;
				} 
				else {
					temp = $.lily.format.addComma(integerCash) + '.' + decimalCash;
				}
				return temp;
			}
		},
		//不带小数点的数字格式化
		toCashWithCommaNoPoint: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null){
				return '';
			}
			else {
				var temp = $.lily.format.prepareCashString( cash, dot, digits );
				
				var dotPos = temp.indexOf('.');
				var integerCash = temp.substring(0, dotPos);
			
				// 处理包含正负符号的情况
				var prefix = integerCash.charAt(0);
				if ( prefix == "-" || prefix == "+" ) {
					temp = prefix + $.lily.format.addComma(integerCash.substring(1));
				} 
				else {
					temp = $.lily.format.addComma(integerCash);
				}
				if(temp=="0.00"){
					return '';
				}
				return temp;
			}
		},
		//格式化账号，使其格式为4444********6788;
		dealAccountNoHide: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null||cash==undefined){
				return '';
			}
			else {
				var temp;
				cash = $.trim(cash);
				if(cash.length>=12){
					temp = cash.substring(0,4)+"********"+cash.substring(cash.length-4,cash.length);
				}else{
					temp = cash;
				}
			}
			return temp;
		},
		//格式化手机
		mobileNoHide: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null||cash==undefined){
				return '';
			}
			else {
				var temp;
				cash = $.trim(cash);
				if(cash.length == 11){
					temp = cash.substring(0,3)+"****"+cash.substring(cash.length-4,cash.length);
				}else{
					temp = cash;
				}
			}
			return temp;
		},
		//格式化姓名，使其格式为张**;
		dealUserNameNoHide: function( cash, dot, digits ) {
			if (cash != null && typeof cash !== "string") {
				cash = cash.toString();
			}
			if(cash == '' || cash == null||cash==undefined){
				return '';
			}else {
				
				var temp;
				cash = $.trim(cash);
				if(cash.length>=1){
					var nameLeng = cash.length;
					var name = cash.substring(0,1);
					for ( var i = 0; i < nameLeng; i++) {
						if(i!=(nameLeng-1)){
							name+="*";
						}
					}
					temp = name;
				}else{
					temp = cash;
				}
			}
			return temp;
		}
	});
})(jQuery)