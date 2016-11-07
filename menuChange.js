/*//左右滑动效果
var a=1;
	var slider_count = 0;
	var time="";
var animating={
	init:function(){
		var arr = new Array();
		var $slider = $('#hotService');
		var $slider_lis = $('#hotService li').length;
		var $slider_width = $('#hotService li').width();
		$slider.width($slider_lis * $slider_width);
		arr['count'] = $slider_lis;
		arr['width'] = $slider_width;
		return arr;
	},
	right1:function(count,width){
			if (slider_count >=  count - 9){
				a=0;
				animating.left1(count,width);
			}else{
				slider_count++;
				$('#hotService').animate({left: '-=' + width + 'px'}, 'slow');	
				time = setTimeout("animating.right1(" + count + ","  + width + ")",2500);
			};		
	},
	left1:function(count,width){
			if (slider_count <= 0) {
				a=1;
				animating.right1(count,width);	
			}else{
				slider_count--;
				$('#hotService').animate({left: '+=' + width + 'px'}, 'slow');
				time = setTimeout("animating.left1(" + count + ","  + width + ")",2500);
			};			
		}
};*/
 //页脚
( function ( window , $ ){
	    /* 焦点图自动切换
		 * author：ld 20140911
		 */

	$.fn.slide = function( option ){
		var defaults = {
			parenName :'',	    //滑动的父级标签
			classParent : '',   //滑动的标签
			interval : 3000,	//动画间隔时间
			sliderChildren : '',//滑动标签的子标签
			maxNum:'9',			//默认显示的个数
			isAnimate:false	    //是否有动画效果
		};
		var opts     = $.extend( defaults, option ),
		 	$objPar  = opts.classParent+' '+opts.sliderChildren,
		    len      = $($objPar).length,
		    maxNum   = opts.maxNum,
			width    = $($objPar).width(),
		    index    = 0,
		    flag     = true,
		    repeat   = null;
		//鼠标hover事件
		if(len > maxNum){
			$(opts.parenName).hover(function(){
				clearInterval(repeat);
			},function(){
				repeat = setInterval(function(){moveImg(width);},opts.interval)
			}).trigger('mouseleave');
		}
		//图片移动
		function moveImg(width){
			if(index < len - maxNum && flag){
				index++;
				width = '-=' + width;
			}else{
				if(index == 1){
					flag = true;
				}else{
					flag = false;
				}
				index--;
				width = '+=' + width;
			}
			if(opts.isAnimate){
				$(opts.classParent).animate({marginLeft:width},opts.animSpeed);
			}else{
				$(opts.classParent).css('marginLeft',width);
			}
		}
		
	}


})( window , jQuery )
$(function(){
	$("#slider").slide({
		   classParent:'.service-list',
		   parenName:'#slider',
		   sliderChildren:'li',
		   isAnimate:true
	});
	$('.slider a').hover(function() {
		$(this).css('color', '#0094da');
	}, function() {
		$(this).css('color', '');
	});
})

