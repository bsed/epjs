(function( $, undefined ) {
	$.lily.market= $.lily.market || {};
	$.extend( $.lily.market, {
　　	execute: function(currentElement,paramArray) {
　　		var marketInfo="",modelNo="",marketNo="",productNo="",picpath="";
		var currentBusinessCode = paramArray.code;
		if ($.lily.MarketingItem !=null && $.lily.MarketingItem != ''){
			for(var i=0;i< $.lily.MarketingItem.length;i++){
				if ($.lily.MarketingItem[i].currentBusinessCode == currentBusinessCode){
		    		if($.lily.MarketingItem[i].picpath.indexOf('@') > -1){
		    			var picpathArr = $.lily.MarketingItem[i].picpath.split("@");
		    			picpath = picpathArr[0];
		    		}
					if($.lily.MarketingItem[i].marketingType=='3'){
						$("#advert",currentElement).attr("src","images/advert/"+picpath+"");
						$("#advert",currentElement).parent().attr("href",""+$.lily.MarketingItem[i].hrefPath+"");
						$("#advert",currentElement).parent().attr("target","_blank");
						if($.lily.MarketingItem[i].marketNo!= ""){
		    				if($.lily.MarketingItem[i].modelNo.substr(0,6) == "010099"){
		    					marketInfo=getMarket(marketInfo,$.lily.MarketingItem[i]);
		    					//getMarket($.lily.MarketingItem[i]);
		    				}
		    				$("#advert",currentElement).parent().attr({"data-event":"lily-clientevent","data-market":"modelno:"+$.lily.MarketingItem[i].modelNo+";marketno:"+$.lily.MarketingItem[i].marketNo+";productno:"+$.lily.MarketingItem[i].productNo+""});//;cstno:"+$.lily.sessionData.session_customerNameCN+"
						}
					}else if($.lily.MarketingItem[i].marketingType=='2'){
						$("#advert",currentElement).attr("src","images/advert/"+picpath+"");
		    			var menuNo = menudeal($.lily.MarketingItem[i].hrefPath);
		        		$("#advert",currentElement).parent().attr("href","#");
		        		if($.lily.MarketingItem[i].marketNo =="")
		        			$("#advert",currentElement).parent().attr({"data-toggle":"lilyMenu","data-menuno":""+menuNo+"","data-content":"frame_item","data-value":""+$.lily.MarketingItem[i].hrefPath+""});	
		        		else{
		        			
		        			if($.lily.MarketingItem[i].modelNo.substr(0,6) == "010099"){
		        				marketInfo=getMarket(marketInfo,$.lily.MarketingItem[i]);
		        				//getMarket($.lily.MarketingItem[i]);
			        		}
			        		$("#advert",currentElement).parent().attr({"data-toggle":"lilyMenu","data-menuno":""+menuNo+"","data-content":"frame_item","data-value":""+$.lily.MarketingItem[i].hrefPath+"","data-event":"lily-clientevent","data-market":"modelno:"+$.lily.MarketingItem[i].modelNo+";marketno:"+$.lily.MarketingItem[i].marketNo+";productno:"+$.lily.MarketingItem[i].productNo+""});
		    			}
	    			}
	    			else if($.lily.MarketingItem[i].marketingType=='1'){
	    				var prod = $.lily.MarketingItem[i].productNo;
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
						if($.lily.MarketingItem[i].hrefPath=="1"){
			    			var html =		'<li style="background:'+'url(images/advert/'+picpath+')'+'">'+
			                           		'<div class="s1"><span>'+productdata.InterestDays+'</span>天理财&nbsp;'+productamt+'元起</div>'+
			                           		'<div class="s2">预计年化收益：<span>'+productdata.GuestRate+'%</span><br/>'+productdata.PrdName+
			                          		'<div class="s3">'+datetemp+'起认购</div>'+
			                           		'<div class="s4"><input name="" value="立即认购" type="button"'+
			                           		'class="btn_reg"></div>'+
			                      	   		'</li>'
			                }
		                else if($.lily.MarketingItem[i].hrefPath=="0"){
			                var html = 		'<li style="background:'+'url(images/advert/'+picpath+')'+'">'+
			                           		'<div class="s1"><span>'+productdata.InterestDays+'</span>天基金&nbsp;'+productamt+'元起</div>'+
			                           		'<div class="s2">预计年化收益：<span>'+productdata.GuestRate+'%</span><br />'+productdata.PrdName+
			                          		'<div class="s3">'+datetemp+'起认购</div>'+
			                           		'<div class="s4"><input name="" value="立即认购" type="button"'+
			                           		'class="btn_reg"></div>'+
			                      	   		'</li>'	
			                }
		    			 $("#advert",currentElement).parent().append(html).addClass("hot-lc1");
	    				}	
		        		$("#advert",currentElement).parent().attr("href","#");
		    			if($.lily.MarketingItem[i].marketNo =="")
		        			$("#advert",currentElement).parent().attr({"data-toggle":"moneyproduct","data-menuno":"A0010000","data-content":"frame_item","data-href":""+$.lily.MarketingItem[i].hrefPath+"","data-value":""+$.lily.MarketingItem[i].productNo+""});	
		        		else{
		        			if($.lily.MarketingItem[i].modelNo.substr(0,6) == "010099"){
		        				marketInfo=getMarket(marketInfo,$.lily.MarketingItem[i]);
		        				//getMarket($.lily.MarketingItem[i]);
		        		}
		        			$("#advert",currentElement).parent().attr({"data-toggle":"moneyproduct","data-menuno":"A0010000","data-content":"frame_item","data-href":""+$.lily.MarketingItem[i].hrefPath+"","data-value":""+$.lily.MarketingItem[i].productNo+"","data-event":"lily-clientevent","data-market":"modelno:"+$.lily.MarketingItem[i].modelNo+";marketno:"+$.lily.MarketingItem[i].marketNo+";productno:"+$.lily.MarketingItem[i].productNo+""});
		    			}	
	    			}
			  		$("#advertdiv",currentElement).addClass('account_show');
					break;
				}	
			}
			if (marketInfo != "")
		    {showMarket(marketInfo);}
		}　		
　　	}
});	
})(jQuery)