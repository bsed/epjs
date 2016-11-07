$(function(){
	$.lily.contextPath = $.lily.getContextPath() + '/';
	//引导页
	$(".guide_l,.guide_l a").css("height",$(document).height()+'px');
	$(".guide_r,.guide_r a").css("height",$(document).height()+'px');
	$(".guide_l a,.guide_r a").click(function(){
		   
			$(".guide_l").animate({"left":"-"+$(window).width()/2 + "px"},1000,function(){$(this).hide();});
			$(".guide_r").animate({"right":"-"+$(window).width()/2 + "px"},1000,function(){$(this).hide();});
			setTimeout(function(){
				$('#pwdMask').hide(500).remove();
				showmain();
			},1000);
			 
	});
	$('body').on('click.button.lilyMenu', '[data-toggle=lilyMenu-main]', function(e) {
		var mainarea = '#main-frame-area';	
		$(mainarea).html('');
		var tranCode = $(this).attr('data-content');
		var windowId = tranCode + $.lily.generateUID();
			$.openWindow({
				tranCode: tranCode,
				windowId: windowId,
				appendTo: mainarea
			});
	});
});