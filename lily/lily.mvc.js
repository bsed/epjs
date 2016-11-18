/**
 * jQuery mvc controller - v1.0
 *
 */

(function( $ , undefined){

	"use strict";

	var Mvc = function ( element, currentWindow, options ) {
		this.init( element, currentWindow, options);
	};

	Mvc.prototype = {
		constructor: Mvc,

		init: function(element, currentWindow, options) {
			this.options = options;
			this.$element = $(element);
			this.currentWindow = currentWindow;
			this.valid = false;
			this.tranMask=false;
			this.tranCode = this.options.tranCode;
			var self = this;
			var url = $.lily.contextPath + this.options.defineFilePath + '/' + this.tranCode + this.options.defineFileSuffix;
			this.id = $.lily.generateUID();
			if(currentWindow)
				this.windowId = currentWindow.options.windowId;

			$.lily.ajax({url: url})
			.done(function ( data ) {
				self.valid = true;
				self.mvcDefine = data;//$.parseJSON(data);
				if(self.options.startStep) {
					self.currentStep = self.options.startStep;
				}
				else {
					if(self.options.isWidget)
						self.currentStep = 'widget_start';
					else
						self.currentStep = 'start';
				}
				self.nextStep();
			});

			this.stepArray = [];
			this.tranCodeArray = [];
			this.initView = false;
			this.responseDataArray = [];
			this.pageCallbackArray = [];
			this.successCollectData = true;
			this.loginFlag = false;
		},

		nextStep: function() {
			if(this.loginFlag){
				if(!$.lily.CONFIG_SESSION_ID){
					$.lily.login.judgeLogin(this);
					return;
				}
			}
			if(!this.valid)
				return;
			if(this.inTransation)
				return;
			this.inTransation = true;
			if(!this.initView) {

				this.width = this.$element.innerWidth();
				this.height = this.$element.innerHeight();

				if(this.currentStep === 'start')
					this.currentStep = this.mvcDefine.start;
				else if(this.currentStep === 'widget_start')
					this.currentStep = this.mvcDefine.widget_start;

				this.currentFlowNode = this.mvcDefine.flow[this.currentStep];

				if(this.options.fixedHeight) {
                    this.$viewContainer = $('<div></div>');

                    this.$viewContainer.css({
                        position: 'relative',
                        width: this.width,
                        height: this.height,
                        zIndex: '100'
                      //  backgroundColor: "white"
                    });
                    this.$element.append(this.$viewContainer);
                }
                else {
                    this.$viewContainer = this.$element;
                    this.$viewContainer.css("position", "relative");
                    this.$clearBothDiv = $('<div id="clearCon"></div>');
                    this.$clearBothDiv.css("clear", "both");
                    this.$clearBothDiv.appendTo(this.$viewContainer);
    				this.height = this.$element.height();
                }

				this.$maskContainer = $('<div class="loading-mask"> '
						+'<iframe frameborder="0" scrolling="no" style="border:1px;position:absolute;top:0;left:0;width:100%;height:100%;" '
						+'src="css/loadding.html"></iframe></div>'
						);

				this.$maskContainer.css({
					position: 'absolute',
					width:this.width,
					height: this.height,
					top: "0px"
				});
				this.$maskContainer.appendTo(this.$element);
			}
			else {
				this.prevFlowNode = this.currentFlowNode;
				this.currentStep = this.currentFlowNode.transition;
				this.currentFlowNode = this.mvcDefine.flow[this.currentStep];
			}
			this.loadNode(this.options.requestData);

			this.inTransation = false;
		},

		gotoStep: function(step, requestData, needPageInput) {
			if(this.loginFlag){
				if(!$.lily.CONFIG_SESSION_ID){
					$.lily.login.judgeLogin(this,step, requestData);
					return;
				}
			}


			if(arguments.length < 3) {
				needPageInput=true;
			}
			if(arguments.length < 2) {
				var validatorResult = this.currentStepDiv.data('validator').check();
				if(!validatorResult.passed)
					return null;
				requestData = validatorResult.requestData;
			}
			if(this.inTransation)
				return;
			if(step === 'start') {
				step = this.mvcDefine.start;
			}
			this.inTransation = true;

			if(this.mvcDefine.flow[step]) {
				this.prevFlowNode = this.currentFlowNode;
				this.currentStep = step;
				this.currentFlowNode = this.mvcDefine.flow[step];
			}
			else {
				alert("invalid flow node name!");
			}
			this.loadNode(requestData, needPageInput);
			this.inTransation = false;
		},

		doReturn: function() {
			//this.$viewContainer.remove();

			this.$viewContainer.html('');

			if(this.options.isWidget)
				this.currentStep = 'widget_start';
			else
				this.currentStep = 'start';


			this.responseDataArray = [];


			this.stepArray = [];
			this.tranCodeArray = [];
			this.responseDataArray = [];
			this.initView = false;
			this.signData = [];
			this.pageCallbackArray = [];

			this.successCollectData = true;
			this.$viewContainer.parent().css('width','');
			this.$viewContainer.css('width',this.$viewContainer.parent().width()+'px');
			this.$maskContainer.css('width',this.$viewContainer.parent().width()+'px');
			this.nextStep();



		},

		gotoOtherMVCStep: function(tranCode, step, requestData) {
			this.tranMask=true;
			if(arguments.length < 2) {
				this.$viewContainer.html('');
				this.currentStep = 'start';
				this.responseDataArray = [];
				this.stepArray = [];
				this.tranCodeArray = [];
				this.responseDataArray = [];
				this.initView = false;
				this.signData = [];
				this.pageCallbackArray = [];

				this.successCollectData = true;
				this.$viewContainer.parent().css('width','');
				this.$viewContainer.css('width',this.$viewContainer.parent().width()+'px');
				this.$maskContainer.css('width',this.$viewContainer.parent().width()+'px');


			}
			/*if(requestData){
				if(requestData.windowMvcid){
					$('#task-'+requestData.windowMvcid).find('i').text(requestData.windowName);
				}
			}*/

			this.valid = false;
			var self = this;
			var url = $.lily.contextPath + this.options.defineFilePath + '/' + tranCode + this.options.defineFileSuffix;

			$.lily.ajax({url: url})
			.done(function ( data ) {
				self.valid = true;
				self.tranCode = tranCode;
				self.mvcDefine = data;//$.parseJSON(data);
				if(self.currentStep == 'start' || self.currentStep=='widget_start'){

					self.nextStep();
				}else{
					self.gotoStep(step, requestData);
				}

			});
		},

		loadNode: function(requestData, needPageInput) {
			if(arguments.length < 2) {
				needPageInput = true;
			}
			var self = this;

			if(this.currentFlowNode.type === 'view') {

				var currentView = this.mvcDefine.views[this.currentFlowNode.id];

				self.loadView(currentView,  requestData);
			}
			else {
				this.modalHandler(requestData, needPageInput);
			}

		},

		transactionHandler: function(data) {
			var alertOptions={type:'error-remind'};
			alertOptions.ec=data.ec;
			myAlert($.lily.localization.errorCodeRemind+$.lily.param.translateSysFlag(data.ec)+"<br>"+$.lily.localization.errorMsgRemind+data.em,alertOptions);
			this.hideLoadMask();
			this.currentStep = this.stepArray[this.stepArray.length-1];
			this.currentFlowNode = this.prevFlowNode;
			if (this.currentStepDiv.attr("needrefresh")) {
				var currentView = this.mvcDefine.views[this.currentFlowNode.id];
				if(currentView.js) {
					var size = this.pageCallbackArray.length;
					this.pageCallbackArray[size - 1](this.currentStepDiv, this.reponseData, this);
				}
			}
		},

		modalHandler: function(data, needPageInput) {
			if(this.options.fixedHeight) {
				var maskHeight = this.height;
				if(this.currentStepDiv) {
					maskHeight = this.currentStepDiv[0].scrollHeight;
				}
				this.$maskContainer.css({
					height: maskHeight,
					left: -this.left + 'px'
				});
			}
			else {
				this.height = this.$element.height();
				this.$maskContainer.css({
					height: this.height,
					left: -this.left + 'px'
				});
			}
			this.$maskContainer.css("display", "block");
			this.startTime = (new Date()).getTime();

			var self = this;
			var requestData;

			if((this.currentStep === this.mvcDefine.start || this.currentStep === this.mvcDefine.widget_start) && this.currentFlowNode.type === 'model') {

				if(!this.tranMask)
				$.lily.showLoadModelStart();
				this.tranMask=false;

				requestData = this.options.requestData;
				if(data) {
					requestData = $.extend(data, requestData);
				}
			}
			else if(data && (this.currentStep === this.mvcDefine.start || this.currentStep === this.mvcDefine.widget_start))
				requestData = data;
			else if(needPageInput) {

				requestData = this.collectRequestData();


				if(requestData == null) {
					this.currentFlowNode = this.prevFlowNode;
					this.currentStep = this.currentFlowNode.id;
					self.hideLoadMask();
					return;
				}

				if(data) {
					requestData = $.extend(requestData, data);
				}

				if(requestData == null) {
					this.currentFlowNode = this.prevFlowNode;
					this.currentStep = this.currentFlowNode.id;
					self.hideLoadMask();
					return;
				}
			}

			requestData = $.extend(requestData, {"mvcId": this.id});



			var molelNode = this.mvcDefine.models[this.currentFlowNode.id];
			if(molelNode.needLogCode){
			var logRecordFlag='';
			if(molelNode.logRecordFlag){
				logRecordFlag=molelNode.logRecordFlag;
				$.extend(requestData,{'currentBusinessCode':molelNode.needLogCode,"logRecordFlag":logRecordFlag});
			}else{
				$.extend(requestData,{'currentBusinessCode':molelNode.needLogCode});
			}

			}
			if(molelNode.fileUpload) {
				 $.extend(requestData, {'EMP_SID': $.lily.CONFIG_SESSION_ID, 'responseFormat': 'JSON', 'windowId': this.windowId});
				 $.ajaxFileUpload({
	                url: molelNode.url,
	                secureuri: false,
	                fileElement: $('[type="file"]' , this.currentStepDiv),
	                dataType: 'json',
	                data: requestData,
	                success: function (reponseData, status) {
	                	self.currentStep = self.currentFlowNode.transition;

						self.currentFlowNode = self.mvcDefine.flow[self.currentFlowNode.transition];

						var currentView = self.mvcDefine.views[self.currentFlowNode.id];

						self.loadView(currentView, reponseData);
						self.currentStep = self.currentFlowNode.transition;
	                },
	                transactionFailed: function(){
						self.transactionHandler();
					},
	                processFailed: function(reponseData, status,e) {
	                	var alertOptions={type:'error-remind'};
	        			alertOptions.ec=reponseData.ec;
	                	if(reponseData.em){
	                		myAlert($.lily.localization.errorCodeRemind+$.lily.param.translateSysFlag(reponseData.ec)+"<br>"+$.lily.localization.errorMsgRemind+reponseData.em,alertOptions);
	                	}
	                	else{
	                		alert($.lily.localization.connectError);
	                	}
						self.hideLoadMask();
						self.currentStep = self.stepArray[self.stepArray.length-1];
						self.tranCode = self.tranCodeArray[self.tranCodeArray.length-1];
						self.currentFlowNode = self.mvcDefine.flow[self.currentStep];
					}
	            });
			}
			else {
				$.extend(requestData, {'windowId': this.windowId});
				$.lily.ajax({url: molelNode.url,
					data: requestData,
					dataType: 'json',
					type: 'POST',
					processResponse: function ( reponseData ) {


						self.currentStep = self.currentFlowNode.transition;

						self.currentFlowNode = self.mvcDefine.flow[self.currentStep];

						var currentView = self.mvcDefine.views[self.currentFlowNode.id];

						self.loadView(currentView, reponseData);
						self.currentStep = self.currentFlowNode.transition;
					},
					 transactionFailed: function(data){
							self.transactionHandler(data);
						},
					processFailed: function() {
						alert($.lily.localization.connectError);
						self.hideLoadMask();
						self.currentStep = self.stepArray[self.stepArray.length-1];
						self.tranCode = self.tranCodeArray[self.tranCodeArray.length-1];
						self.currentFlowNode = self.mvcDefine.flow[self.currentStep];

					},
					hideMask: function() {
						self.hideLoadMask();
					},
					currentMVC: self
				});
			}
		},

		loadView: function(currentView, reponseData) {
			var self = this;
			self.savePreview();
			var stepDiv = $('<div id="stepDiv' + this.tranCode + this.currentStep + '"></div>');
			if(!this.initView) {
				this.left = 0;
				this.initView = true;
			}
			else {
				if(this.options.enableAnimate) {
					this.$viewContainer.width(this.$viewContainer.width() + this.width);
					this.left -= this.width;
				}
				else
					this.left = 0;
			}

			if(this.options.fixedHeight) {
                stepDiv.css({
                    position: 'absolute',
                    left: -this.left + 'px',
                    top: '0px',
                    width: this.width,
                    height: this.height
                });
            }
            else {
                stepDiv.css({
                    //position: 'relative',
                    float: "left",
                    top: '0px',
                    width: this.width
                });
                //this.$viewContainer.height = this.height;
            }

			stepDiv.load(currentView.url, function() {
				if(currentView.paramArray){
					if (currentView.paramArray.explain){
						$.lily.explain.execute(stepDiv,currentView.paramArray);
					}
					if(currentView.paramArray.login){
						$.lily.loginExplain.execute(stepDiv,currentView.paramArray);
					}
					if(currentView.paramArray.code){
						$.lily.relation.execute(stepDiv,currentView.paramArray);
 						$.lily.market.execute(stepDiv,currentView.paramArray);
					}
				}
				if(reponseData){
					self.perLoadData(reponseData, stepDiv);

				}

				if(currentView.js) {
                    $.getScript(currentView.js, function() {
                        self.pageCallbackArray.push(pageCallback);
                        pageCallback(stepDiv, reponseData, self, self.options.parentMVC);

                        $('button', stepDiv).data('currentMVC', self);
                        $('button', stepDiv).data('parentMVC', self.options.parentMVC);
                        $('input', stepDiv).data('currentMVC', self);
                        $('input', stepDiv).data('parentMVC', self.options.parentMVC);
                        $('a', stepDiv).data('currentMVC', self);
                        $('a', stepDiv).data('parentMVC', self.options.parentMVC);
                        $('table', stepDiv).data('currentMVC', self);
                    });
                }
                else {
                    $('table', stepDiv).data('currentMVC', self);
                    $('button', stepDiv).data('currentMVC', self);
                    $('input', stepDiv).data('currentMVC', self);
                    $('input', stepDiv).data('parentMVC', self.options.parentMVC);
                    $('button', stepDiv).data('parentMVC', self.options.parentMVC);
                    $('a', stepDiv).data('currentMVC', self);
                    $('a', stepDiv).data('parentMVC', self.options.parentMVC);
                }

				self.$viewContainer.append(stepDiv);
				stepDiv.placeholder();
                if(currentView.needUserAuth) {
                    var amt ='0';
                    var amtTmp=$('[data-security="payAmount"]', stepDiv).html();
                    if(!(amtTmp==null||amtTmp==''||amtTmp==undefined)){
                    	 amt=amtTmp;
                    }




                 var quickFlag=false;   //鍒ゆ柇鏄惁鏄揩鎹峰尯
                 var customerQuickId='';
               /*  var channelQuick='';*/
                 if(currentView.quickFlag){
                	 quickFlag=true;
                	 customerQuickId=$('[data-security="customerId"]', stepDiv).val();
                 }

                 var needLogCode;
                 if(currentView.needLogCode){
                	 needLogCode=currentView.needLogCode;
                 }else{
                	needLogCode= $('[data-security="needLogCode"]', stepDiv).val();
                 }

                 if(reponseData){
                	 if(reponseData.currentBusinessCode){
                		 needLogCode=reponseData.currentBusinessCode;
                	 }
                 }

                 var optionsAuth={};
                 optionsAuth.amt=amt;
                 optionsAuth.businessCode=needLogCode;
                 optionsAuth.mvcId=self.id;
                 optionsAuth.quickFlag=quickFlag;
                 optionsAuth.customerId=customerQuickId;
            	 var challengeCode ;
        		 if($('#'+currentView.tokenCodeField,stepDiv).is("input"))
            		 challengeCode=$('#'+currentView.tokenCodeField,stepDiv).val();
 				else
 					challengeCode=$('#'+currentView.tokenCodeField,stepDiv).text();
            	 optionsAuth.challengeCode= challengeCode;
                 $.lily.security.init($(currentView.needUserAuth, stepDiv), optionsAuth);

                }
                //self.$element.accountSelect();
                if(self.options.fixedHeight) {
                    self.$viewContainer.append(stepDiv);
                }
                else {
                    stepDiv.insertBefore(self.$clearBothDiv);
                }
				$("input[data-toggle^=datapick]", stepDiv).data("currentStepDiv", stepDiv);
				//self.$element.accountSelect();

				if(self.initView) {
					var currentTime = (new Date()).getTime();
					var timeInterval = currentTime - self.startTime ;
					if(timeInterval < self.options.minInterval) {
						setTimeout(function() { self.hideLoadMask.apply(self);}, self.options.minInterval - timeInterval);
					}
					else
						self.hideLoadMask();

					var currentScrollTop = $("html").scrollTop() || $("body").scrollTop();


					if(!$('[data-toggle^=isSmallWindow]',stepDiv)){//寮瑰嚭绐楀彛涓姞姝ゅ睘鎬�
						$('html,body').scrollTop(0);
					}

					}
				stepDiv.validator();
				$('input:checkbox,input:radio' , stepDiv).each(function() {
					var $this = $(this);
					$this.data('orgChecked',$this.attr("checked"));
				});
//				stepDiv.scrollbar();
				// if(!$('[data-toggle^=tag-window]',stepDiv)){//寮瑰嚭绐楀彛涓姞姝ゅ睘鎬�
						self.resizeView();
				//	}
			});
			this.currentStepDiv = stepDiv;
			this.currentView = currentView;
		},

		resizeView: function() {
			if(this.options.fixedHeight) {
				return;
			}

			/*if(this.currentStepDiv){
				var height = this.currentStepDiv.height();

				var $appendDiv = $('.areaAppendDiv', this.currentStepDiv);
				if($appendDiv && $appendDiv.length > 0) {
					var currentHeight = height - $appendDiv.height();
					if(currentHeight > this.options.minHeight) {
						$appendDiv.remove();
					}
					else {
						$appendDiv.css("height", (this.options.minHeight - currentHeight) + "px");
					}

				}
				else {
					if(height < this.options.minHeight) {
						var $appendDiv = $('<div class="areaAppendDiv"></div>');
						$appendDiv.css({
							width: "10px",
							height:  (this.options.minHeight - height) + 'px'
						});
						this.currentStepDiv.append($appendDiv);
					}
				}
			}*/

		},

		refreshView: function() {
			if(this.inTransation)
				return;
			this.inTransation = true;

			this.loadNode();

			this.inTransation = false;
		},
		fileDownload: function(url,reqPrams) {
			var reqData= $.extend({'EMP_SID': $.lily.CONFIG_SESSION_ID, 'responseFormat': 'JSON'},reqPrams);
			 $.ajaxFileDownload({
	             url: url,
	             secureuri: false,
	             dataType: 'json',
	             data: reqData,
	             success: function (reponseData, status) {
	             },
	             processFailed: function(reponseData, status,e) {
	             	alert($.lily.localization.connectError);
				}
	         });
		},

		hideLoadMask: function() {
			if(this.options.enableAnimate) {
				var self = this;
				this.$viewContainer.animate({left: this.left + 'px'}, {
					duration: this.options.slideSpeed,
					complete: function() {
						//if(self.preview && self.options.fixedHeight) {
						if(self.preview && self.successCollectData) {
							self.preview.css("display", "none");
							if(!self.options.fixedHeight)
								self.currentStepDiv.css("marginLeft", -self.left + "px");
						}
						//}
						self.$maskContainer.css("display", "none");
					}
				});
			}

			this.$maskContainer.css("display", "none");
		},
		showLoadMask: function() {
			this.$maskContainer.css("display", "block");
		},

		savePreview: function() {
			this.stepArray.push(this.currentStep);
			this.tranCodeArray.push(this.tranCode);
			if(this.stepArray.length > 1) {
				this.preview = $('#stepDiv' + this.tranCodeArray[this.tranCodeArray.length - 2] + this.stepArray[this.stepArray.length - 2], this.$element);
			}
		},

		prevStep: function() {
			this.left += this.width;
			var currentView = this.mvcDefine.views[this.currentFlowNode.id];
			if(currentView.js) {
				this.pageCallbackArray.pop();
			}

			this.preview.css("display", "block");
			if(this.options.enableAnimate)
				this.$viewContainer.animate({left: this.left + 'px'}, this.options.slideSpeed );

			this.currentStep = this.stepArray.pop();
			this.tranCode = this.tranCodeArray.pop();
			//$('#stepDiv' + this.tranCode + this.currentStep, this.$element).data('scrollbar').distory();
			$('#stepDiv' + this.tranCode + this.currentStep, this.$element).remove();

			this.currentStep = this.stepArray[this.stepArray.length-1];
			this.tranCode = this.tranCodeArray[this.tranCodeArray.length-1];
			this.currentFlowNode = this.mvcDefine.flow[this.currentStep];
			//由于跳转到其他页面mvc的startview中，this.currentFlowNode可能为空，若不特殊处理会报错
			if(this.currentFlowNode!=null){
				this.currentView = this.mvcDefine.views[this.currentFlowNode.id];
			}
			this.currentStepDiv = $('#stepDiv' + this.tranCode + this.currentStep, this.$element);
			this.responseDataArray.pop();
			this.reponseData = this.responseDataArray[this.responseDataArray.length-1];
			if(this.options.fixedHeight) {
				this.currentStepDiv.css("display", "block");
			}
			if(this.stepArray.length > 1) {
				this.preview = $('#stepDiv' + this.tranCodeArray[this.tranCodeArray.length - 2] + this.stepArray[this.stepArray.length - 2], this.$element);
			}else{
				this.preview = undefined;
			}


			this.resizeView();
		},

		perLoadData: function(reponseData , stepDiv) {
			this.reponseData = reponseData;
			this.responseDataArray.push(reponseData);
			$('[data-toggle="echo"]' , stepDiv).each(function() {
				var $this = $(this);
				var value = reponseData[this.id];
				var dataType = $this.attr("data-type");
				if(dataType) {
					switch ( dataType ){
						case "date" : value = $.lily.format.formatDate(value);break;
						case "time" : value = $.lily.format.formatTime(value);break;
						case "dateTime" : value = $.lily.format.formatDateTime(value);break;
						case "currency" : value = $.lily.format.toCashWithComma(value);break;
						case "currencyNoPoint" : value = $.lily.format.toCashWithCommaNoPoint(value);break;  //娌℃湁灏忔暟鐐规牸寮忓寲
						case "toCashWithCommaReturn0" : value = $.lily.format.toCashWithCommaReturn0(value);break;  //濡傛灉閲戦涓�杩斿洖0.00
						case "rate" : value = $.lily.format.toPercentRate(value);break;
						case "accountNo" : value = $.lily.format.dealAccountNoHide(value);break;
						case "toYuanRate": value= $.lily.format.toYuanRate(value);break;
						case "userName" : value =$.lily.format.dealUserNameNoHide(value);break; //鏄熷彿闅愯棌
						case dataType : value=$.lily.param.getDisplay(dataType,value);break;   //杞崲椤甸潰鏄剧ず
					}
				}
				if($this.is("input"))
					$this.val(value);
				else
					$this.text(value);
			});
		},

		reset: function() {
			this.currentStepDiv.data('validator').reset();

			$('input:text' , this.currentStepDiv).each(function() {
				var $this = $(this);
				$this.val('');
			});
            $('input:file' , this.currentStepDiv).each(function() {

				var $this = $(this);
				$this.after($this.clone().val(""));
				$this.remove();
			});
			$('textarea' , this.currentStepDiv).each(function() {
				var $this = $(this);
				$this.val('');
			});
			$( this.currentStepDiv).find('[data-toggle^=pass-color]').each(function (){

				var $this = $(this);
				$this.remove();
			});

			$('select' , this.currentStepDiv).each(function() {
				var $this = $(this);
				//$this.find('option:gt(0)').remove();
				$(':first-child', $this).attr("selected", true);
			});
			$('input:checkbox,input:radio' , this.currentStepDiv).each(function() {

				var $this = $(this);
				if( $this.data('orgChecked')){
					$this.attr("checked", $this.data('orgChecked'));
				}else{
					$this.attr("checked", false);
				}

			});
			this.perLoadData(this.reponseData, this.currentStepDiv);
			var currentView = this.mvcDefine.views[this.currentFlowNode.id];
			if(currentView.js) {
				var size = this.pageCallbackArray.length;
				this.pageCallbackArray[size - 1](this.currentStepDiv, this.reponseData, this);
			}
		},
		query: function() {
			$.lily.showLoadModelStart();
		},
		collectRequestData: function() {
			var requestData = {};
			if( this.reponseData )
				$.extend(requestData, this.reponseData);



			var orginRequestData = {};
			$('input' , this.currentStepDiv).each(function() {
				// 寰呯敤缁熶竴鏂规硶瀹屽杽
				if (this.type == 'checkbox') {
					if (this.checked) {
						orginRequestData[this.name] = '1';
					}
					else {
						orginRequestData[this.name] = '0';
					}
				}
				else if (this.type == 'radio') {
					if (this.checked) {
						orginRequestData[this.name] = this.value;
					}
				}
				else {
					orginRequestData[this.name] = this.value;
				}
			});

			$('textarea' , this.currentStepDiv).each(function() {
				orginRequestData[this.name] = this.value;
			});

			$('select' , this.currentStepDiv).each(function() {
				orginRequestData[this.name] = this.value;
			});
			$.extend(requestData,orginRequestData);


			var validatorResult = this.currentStepDiv.data('validator').check();
//			if(!validatorResult.passed) {
//				this.successCollectData = false;
//				return null;
//			}
			this.successCollectData = true;
			$.extend(requestData, validatorResult.requestData);



			var currentView = this.currentView;
			if(currentView && currentView.needUserAuth) {
				 var authOptions = {};
				var quickFlag=false;   //鍒ゆ柇鏄惁鏄揩鎹峰尯

                if(currentView.quickFlag){
               	 quickFlag=true;
                }

                if(currentView.tokenType){
                	 authOptions.tokenType= currentView.tokenType;
                     var challengeCode ;

                	 if(currentView.tokenType == '0'){//鎸戞垬鍨�
                		 if($('#'+currentView.tokenCodeField,this.currentStepDiv).is("input"))
                    		 challengeCode=$('#'+currentView.tokenCodeField,this.currentStepDiv).val();
         				else
         					challengeCode=$('#'+currentView.tokenCodeField,this.currentStepDiv).text();



                		 authOptions.challengeCode= challengeCode;
                	 }
                }
                authOptions.mvcId=this.id;
		authOptions.windowId=this.windowId;

                var needSignDataSelf=$('[data-security="needSignDataSelf"]', this.currentStepDiv).val();
                if(needSignDataSelf){
                	authOptions.signData=needSignDataSelf;
                }else{
                	 authOptions.signData=currentView.needSignData;
                }

                authOptions.quickFlag=quickFlag;


               var needLogCode;
				if(currentView.needLogCode){
					if(this.reponseData && this.reponseData.currentBusinessCode){
						needLogCode=this.reponseData.currentBusinessCode;
					}else{
						needLogCode=currentView.needLogCode;
					}

				}else{
					needLogCode=$('[data-security="needLogCode"]', this.currentStepDiv).val();
				}

				authOptions.needLogCode=needLogCode;
				var quickFlag,customerQuickId;
				 if(currentView.quickFlag){
                	 quickFlag=true;

                 }
				 customerQuickId=$('[data-security="customerId"]', this.currentStepDiv).val();
				 authOptions.customerId=customerQuickId;

				 $.extend(requestData, {'currentBusinessCode':needLogCode});

				var userSafe = $.lily.security.getUserSafe($(currentView.needUserAuth, this.currentStepDiv),  requestData, authOptions);

				if(userSafe == null){
					 this.currentStepDiv.data('validator').check();
					 this.successCollectData = false;

					 return null;
				}

				if(currentView.tokenType){
	               	 userSafe.tokenType=currentView.tokenType;
	            }


				$.extend(requestData, userSafe);
			}



			return requestData;
		},

		getSequence : function(id) {
			$.lily.ajax({
				url : 'getSequence.do',
				data: {'EMP_SID' : $.lily.CONFIG_SESSION_ID,'currentBusinessCode':'01900000'},
				async:false
			}).done(function(data) {
				$.lily.sequenceMap[id] = data.sequenceNo;
			});
		}
	};

	$.fn.mvc = function (currentWindow, option ) {
		return this.each(function () {
      		var $this = $(this),
      			data = $this.data('mvc'),
      			options = $.extend({}, $.fn.mvc.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) {
      			$this.data('mvc', (data = new Mvc(this, currentWindow, options)));
      			$.lily.currentMVC = $this.data('mvc');
      		}
    	});
	};

	$.fn.mvc.defaults = {
		show: false,
		tranCode: '',
		defineFilePath: 'mvcs',
		defineFileSuffix: '.mvc.json',
		parentMVC: null,
		requestData: null,
		slideSpeed: 350,
		fadeSpeed: 350,
		fadeEasing: '',
		minInterval: 1000,
		isWidget: false,
		enableAnimate: true,
		fixedHeight: false,
		minHeight: 465
  	};

  	$.fn.mvc.Constructor = Mvc;

	//mvc button data-api
	$(function () {
	/*	$('body').on('click.recBook.data-api', '[data-login^=session]', function ( e ) {
			var $btn = $(e.target);
			$btn.data('currentMVC').loginFlag=true;
		});*/
		$('body').on('click.recBook.data-api', '[data-toggle^=submit]', function ( e ) {
			var $btn = $(e.target);
			var sessionFlag = $btn.attr('data-login');
			if(sessionFlag){
				$btn.data('currentMVC').loginFlag=true;
			}
				$btn.data('currentMVC').nextStep();
		});

		$('body').on('click.recBook.data-api', '[data-toggle^=prev]', function ( e ) {
			var $btn = $(e.target);
		  	$btn.data('currentMVC').prevStep();
		});

		$('body').on('click.recBook.data-api', '[data-toggle^=close]', function ( e ) {
			var $btn = $(e.target);
		  	$btn.data('currentMVC').currentWindow.close();
		});

		$('body').on('click.recBook.data-api', '[data-toggle^=return]', function ( e ) {
			var $btn = $(e.target);
		  	$btn.data('currentMVC').doReturn();
		});

		$('body').on('click.recBook.data-api', '[data-toggle^=reset]', function ( e ) {
			var $btn = $(e.target);
		  	$btn.data('currentMVC').reset();
		});

		$('body').on('click.recBook.data-api', '[data-toggle^=query]', function ( e ) {
			var $btn = $(e.target);
			var validatorResult=$btn.data('currentMVC').currentStepDiv.data('validator').check();
			if(validatorResult.passed) {
				$btn.data('currentMVC').query();
			}

		});

		$('body').on('click.recBook.data-api', '[data-toggle^=sendPassword]', function ( e ) {
			var $btn = $(e.target);

			$.lily.security.sendPassword($btn.data('currentMVC'));
		});
	});

})( window.jQuery);