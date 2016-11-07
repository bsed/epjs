
(function($, undefined) {
	
	$("#main-transaction-area").css("min-height",$(window).height()-$(".ubp_header").height()-$(".ubp_footer").height());
	$(window).resize(function(){
		$("#main-transaction-area").css("min-height",$(window).height()-$(".ubp_header").height()-$(".ubp_footer").height());
	});

	$.lily.contextPath = $.lily.getContextPath() + '/';
	
	var href = window.location.href;
	
	if(href.indexOf("?")!=-1){
			$.lily.sessionData = $.parseJSON(utf8to16(base64decode(href.split("?")[1])));
			$.lily.orgCode = $.lily.sessionData.orgCode;
			$.lily.administratorId =  $.lily.sessionData.logonId;
			$.lily.CONFIG_SESSION_ID = $.lily.sessionData.sessionId;
			$(".ubp_header").find(".ubp_user").attr("userId",$.lily.sessionData.session_customerId).html("你好，"+$.lily.sessionData.session_customerNameCN);
			if(!$.lily.sessionData.session_customerNameCN){
					window.location.href = $.lily.getContextPath()+'/login.html';
			}
	}


	function mainPageInit() {	
		// 默认显示域
		$(document).placeholder();
        // 打开对应交易窗口
		$('body').on('click.button.lilyMenu', '[data-toggle=lilyMenu]', function(e) {
			$('#main-transaction-area').empty().show();
			var tranCode = $(this).attr('data-content');
			var windowId = tranCode + $.lily.generateUID();
			
				$.openWindow({
					tranCode: tranCode,
					windowId: windowId
				});
		});
		$('body').on('click', '.first_children', function(e) {
			$(this).children("ul").find("li:last").trigger("click");
			/*$('#main-transaction-area').empty().show();
			var tranCode = $(this).attr('data-content');
			var windowId = tranCode + $.lily.generateUID();
			
				$.openWindow({
					tranCode: tranCode,
					windowId: windowId
				});*/
		});
		
	}
	//生成菜单
	function getMenu(){
		var menuHtml="";
		var fileNm = 'ubpMenu';
		if($.lily.sessionData.userType == '1'){
			fileNm = 'ubpMenu1'
		}
		$.lily.ajax({
		      url: 'virtualHost/'+fileNm+'.do.txt',
		      type: 'post',
		      async: false,
		      processResponse: function(data){
		    	  for(var i=0;i<data.firstMenu.length;i++){
		              menuHtml+='<li class="first_children"><a href="javascript:;">'+data.firstMenu[i].menuName+'</a><ul pos="'+data.firstMenu[i].link+'" class="'+data.firstMenu[i].link+'"></ul></li>';         
		    	  };
		    	  $("#ubpMenu").find("ul").append(menuHtml);
		    	  menuHtml="";
		    	  for(var j=0;j<data.secondMenu.length;j++){
		    		  $("#ubpMenu").find("ul[pos='"+data.secondMenu[j].link+"']\"").append('<li class="second_children" data-toggle="lilyMenu" data-content="'+data.secondMenu[j].dataContent+'"><a href="javascript:;">'+data.secondMenu[j].menuName+'</a></li>');
		    	  };
		    	  $(".first_children:last").addClass("current").find("ul").show().children("li:last").trigger("click");
		      	}
		});
	}
	
	function userSignOff(){
		$('.ubp_logout').click(function(){
				$.ajax({
					url: 'userSignOff.do',
					data:{
						channel:'1101',
						EMP_SID:$.lily.sessionData.sessionId,
						responseFormat: 'JSON'
					},
					type: 'post',
					async: false,
					success:function(data){
						  $.lily.CONFIG_SESSION_ID  =  "";
			        	  $.lily.sessionData = "";
			        	  window.location.href = $.lily.getContextPath()+'/login.html';
					}
			     		 
			     		 
			     		
				});
			});
	}
	  
	$(function() {
		
		//菜单控制
		
		var ubpMenuArr=$("#ubpMenu").find(".ubp_menu_arr");
		$("body").on("click",".first_children",function(){
			/*$(this).addClass("current").siblings("li").removeClass("current");
			$(this).find("ul").show();
			var pos=$(this).position().left;
			ubpMenuArr.css("right",(176-pos));*/
		});
		$("body").on("mouseover",".first_children",function(){
			$(this).siblings("li").find("ul").hide();
			$(this).find("ul").show();
		});
		$("body").on("mouseout",".first_children",function(){
			$(this).parent().children("li").find("ul").hide();
			$(this).parent().children("li[class='first_children current']").find("ul").show();
		});
		$("body").on("click",".second_children",function(event){
			$(".second_children").removeClass("current");
			$(".first_children").removeClass("current");
			$(this).addClass("current").parents(".first_children").addClass("current");
			var pos=$(".first_children.current").position().left;
			//console.log(pos);
			ubpMenuArr.css("right",(700-pos));
			event.stopPropagation();
		});
		////////////////////////////////////////////////////////////////
		
	/*	
		$.lily.ajax({
		      url: 'test.do',
		      type: 'post',
		      data:{'infoType':'0000003',
		    	   'cust':'PB100000807',
		    	   'sortBy':'month'},
		      async: false,
		      processResponse: function(data){
		    	
		      	}
		});*/
		
		mainPageInit();
		getMenu();
		userSignOff();
		
 		
	});
	
})(window.jQuery);

function enterSumbit(){  
    var event=arguments.callee.caller.arguments[0]||window.event;// 消除浏览器差异
    if (event.keyCode == 13){  
	   $('#loginBtn').trigger("click");
	   event.cancelBubble = true;
	    event.returnValue = false;
    }  
    
}  