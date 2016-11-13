/*
 * 温馨提示信息
*/
(function( $, undefined ) {
	$.lily.explainData='';
	$.lily.explain= $.lily.explain || {};
	$.extend( $.lily.explain, {
　　	execute: function(currentElement,param) {
　　		var list = $.lily.explainData.kindRemindList;
　　		var currentPage = param.explain;
　　		if (currentPage){
	　　		//var flag = false;
	　　		var Remind = ''; 
	　　		for(var i=0;i<list.length;i++){
	　　			if(list[i].pageID==currentPage){
	　　				　　	Remind=Remind+'<p>'+list[i].kindRemind+'</p>';
  				}
　　			}
	　　		$('#explain',currentElement).append("<p class='pagenumber'>页面编号："+currentPage+"</p><div class='clear'></div>");
	　　		if (Remind.length > 7){
		　　		Remind="<h2><span>温馨提示</span></h2><div class='notice_box1'>"+Remind+"</div>";
		　　		$('#explain',currentElement).append(Remind).addClass("warmPrompt");
	　　		}
　　		}
　　	  }
　　});	
})(jQuery)
