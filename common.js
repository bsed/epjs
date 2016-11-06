//下拉菜单/////////////////////////////////////////
function selectFormat(id,currentElement){
	var selectHtml='';
	var selectId="selectId";
	var li="";
	var theSelect=$("#"+id,currentElement)
	var optionSelected=theSelect.find("option[selected=\'selected\']");
	if(id=="" || id==undefined || id==null){
		alert('未设置Select的Id');
	};
	selectHtml='<div class="ubp_selectDiv'+id+' '+theSelect.attr("class")+'" style="width:'+theSelect.width()+'px">'
    	selectHtml+='<div class="name" value="'+optionSelected.attr("value")+'">'+optionSelected.text()+'</div>'

    selectHtml+='</div>';
	selectHtml+='<ul class="'+id+'_ul" style="width:'+(parseInt(theSelect.width())+parseInt(52))+'px">';
		for(var i=0;i<theSelect.find("option").length;i++){
			li+='<li value="'+theSelect.find("option").eq(i).attr("value")+'">'+theSelect.find("option").eq(i).text()+'</li>';
		};
		selectHtml+=li;
	selectHtml+='</ul>'
        	/*console.log(theSelect);
        	console.log(selectHtml);*/
    theSelect.hide().after(selectHtml);
    $(".ubp_selectDiv"+id,currentElement).click(function(){
    	$(this).parent().find("ul").is(":visible")?$(this).parent().find("ul").hide():$(this).parent().find("ul").show();
    });
	$(".ubp_selectDiv"+id,currentElement).parent().find("li").click(function(){
		$(".ubp_selectDiv"+id,currentElement).find(".name").text($(this).text());
		$(".ubp_selectDiv"+id,currentElement).find(".name").attr("value",$(this).attr("value"));
		$(this).parent().hide();
	});
};
///////////////////////////////////////////////////////////





//返回数字值
function returnVal(value){
	if(value==""){
		return 0;
	}else{
		return $.lily.format.addComma(parseInt(value));
	};
};

function sliderLeftRight(slider_item,slider_box,show_num,next,prev){
		/*********************
		控制左右滚动：
		1.slider_item:滚动项
		2.slider_box:滚动框
		3.show_num:可视频框中，共有几项
		*********************/
	var v_width = $(slider_item).outerWidth(true);  //各项的宽度
	var card_total = $(slider_item).length;   // 滚动项的个数
	$(slider_box).width(v_width * card_total);   // 滚动框宽度
	var slider_stop_pos = v_width * (card_total-show_num) * -1;
	if(card_total<=1){
		$(prev).hide();
		$(next).hide();
		return;
	}
	//后一项 按钮
    $(next).click(function(){  
		 if(!$(slider_box).is(":animated") ){  
			if($(slider_box).position().left > slider_stop_pos ){
         		$(prev).removeClass("first");
				$(slider_box).animate({ left : '-='+v_width+'px' }, "slow",function(){
									if($(slider_box).position().left == slider_stop_pos ){
	            	                   $(next).addClass("last");
									}
										});
      		}	
		 }
   });
	
	
	

	
	
    //前一项 按钮
    $(prev).click(function(){
		 if(!$(slider_box).is(":animated") ){  
	     	if($(slider_box).position().left < 0 ){
				$(next).removeClass("last");
				    $(slider_box).animate({ left : '+='+v_width }, "slow",function(){
						if($(slider_box).position().left == 0 ){
				          $(prev).addClass("first");
					     }							   
				    });	
			}		
		 }
    });
   }






$(function(){
		   
	//登录框位置
	if(document.getElementById('focus_change_list')){
    var focus_w = document.getElementById('focus_change_list').offsetWidth;
	//document.getElementById('login_index').style.right = (focus_w - 980) / 2+ 'px';
	}
	
    
	//引导页
	//console.log($(window).width());
	if(($(window).width())<1024){
		$("#main-content").css("width", "980px");
		$(".guide_l").addClass("guide_l_1024");
		$(".guide_r").addClass("guide_r_1024");
	    //$("body").css("overflow","hidden");
	}else{
		//$("body").css("overflow","hidden");	
	}
	$(".guide_l,.guide_l a").css("height",$(document).height()+'px');
	$(".guide_r,.guide_r a").css("height",$(document).height()+'px');
	$(".guide_l a,.guide_r a").click(function(){
		document.body.style.overflow="auto";
		
			$(".guide_l").animate({"left":"-"+$(window).width()/2 + "px"},1000,function(){$(this).hide();});
			$(".guide_r").animate({"right":"-"+$(window).width()/2 + "px"},1000,function(){$(this).hide();$("#childNeed").css("visibility","visible");});
			setTimeout(function(){
				$('#pwdMask').hide(500).remove();
			},1000);
			 
	});
	 $(window).resize(function() {
		
	    if(($(window).width())<980){
		  $("#main-content").css("width", "980px");
        }else{
          $("#main-content").css("width","100%");
        }
	 });
	
   	//弹出层
	$("#login").click(function(){
							 
			//登录			 
		    var pop_left = ($(window).width()-$("#login_box_p").width())/2;
		    var pop_height = ($(window).height()-$("#login_box_p").height())/2 - 40;
		    $("#login_box_p").show().css('left', pop_left +'px').css('top', pop_height +'px');
			$(".pop-layer").show().css("height",$(document).height()+'px');
  
	});
	
	$("#pop1").click(function(){
							 
    		//收款人名册
			var pop_left1 = ($(window).width()-$("#name_list_p").width())/2;
		    var pop_height1 = ($(window).height()-$("#name_list_p").height())/2;
			$("#name_list_p").show().css('left', pop_left1 +'px').css('top', pop_height1 +'px');
			$(".pop-layer").show().css("height",$(document).height()+'px');
			
			$(".name-list-table tr:odd").addClass("bg1");		
	  
	});
	
	$("#pop2").click(function(){
							 
    		//网点查询
			var pop_left1 = ($(window).width()-$("#web_search").width())/2;
		    var pop_height1 = ($(window).height()-$("#web_search").height())/2;
			$("#web_search").show().css('left', pop_left1 +'px').css('top', pop_height1 +'px');
			$(".pop-layer").show().css("height",$(document).height()+'px');
			
			$(".name-list-table1 tr:odd").addClass("bg1");		
	  
	});
	
	$(".pop-hide").click(function(){
		    $(".pop-box").hide();
			$(".pop-box1").hide();
			$(".pop-layer").hide();
	});
	
	//转账流程
	var index=0;
    var w=$(".nav_t div").width();
    $(".cont_r ul li").click(function(){
        var index=$(this).index();
        $(this).addClass("over").siblings().removeClass("over");
	    $(".nav_t").stop().animate({"marginLeft":-w*index},500);
    });  
	
//    //转账－左边菜单
//	$(".menu_header").click(function(){
//        $(this).css({"backgroundImage":"url(images/daoS.jpg) no-repeat 219px 14px"})
//		       .next(".menu_body").slideToggle(300).siblings(".menu_body").slideUp("slow");
//        $(this).addClass("one").siblings(".menu_header").removeClass("one");
//        $(this).siblings(".menu_header").css({"backgroundImage":"url(images/san1.jpg) no-repeat 219px 14px"});
//     })

	// 返回顶部
	$("#back-to-top").hide();
	$("#back-to-top").css('right',($(window).width()-989)/2-66+'px');
	$("#back-to-top").css('+right',($(window).width()-989)/2+20+'px');
	$("#back-to-top").css('_right',($(window).width()-989)/2+20+'px');
	$(window).scroll(function() {
		if ($(window).scrollTop() > 100) {
			$("#back-to-top").fadeIn(1500);
		}
		 else
		 {
			$("#back-to-top").fadeOut(1500);
		}
	});
	$("#back-to-top").click(function() {
		$('body,html').animate({
			scrollTop: 0
		},
		1000);
		return false;
	});
	
//	//我的地盘
//	$(".user-itme-list li").hover(function(){
//			$(this).addClass("cur");							   
//		},function(){
//			$(this).removeClass("cur");
//	});
	
	
	
	

	

});

