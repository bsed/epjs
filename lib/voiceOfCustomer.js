;
(function ($, undefined) {
	var opts = {
			position: 'fixed',
			kfTop: '120',
			z: '99999',
			callback: function () {}
		},
		$body = $("body");
	//插入html结构和基础css
	if (!$("#ubpViceOfCustomer").length) {
		var html = '';
		html += '<div id="ubpViceOfCustomer" style="position:' + opts.position + ';top:' + opts.kfTop + 'px; z-index:' + opts.z + '; right:-183px; background: url(http://localhost:8080/sys/images/viceOfCustomer_bg.png) no-repeat; width: 264px; height: 263px; transition:all ease 0.3s;">';
		html += '<div style="padding-left:93px; padding-top:39px">';
		html += '<textarea class="content" style="padding: 5px; font-family: \'微软雅黑\'; font-size: 12px; width: 150px; height: 120px; background:#fff; border:1px solid #257fa4;"></textarea>';
		html += '<div class="tip" style="margin-right: 9px;font-family: \'微软雅黑\'; font-size: 12px; text-align: right; color: #0f4359; text-shadow: -1px -1px 7px #fff;">还可输入<span>120</span>个汉字</div>';
		html += '<input type="button" class="ubp_submit" value="提 交" style="font-family: \'微软雅黑\'; font-size: 18px; color: #fff; text-align: center; cursor: pointer; width: 160px; height: 33px; line-height: 33px; background: #257fa4; border: 1px solid #186787; border-bottom: 2px solid #186787; border-radius: 2px; margin-top:13px;" />';
		html += '</div>';
		html += '</div>';
		$body.append(html);
	}

	$("#ubpViceOfCustomer").hover(function () {
		$(this).css("right", "0px");
	}, function () {
		$(this).css("right", "-183px");
	});

	var ubpContent = $("#ubpViceOfCustomer").find(".content");
	var ubpTip = $("#ubpViceOfCustomer").find(".tip");
	var ubpSubmit = $("#ubpViceOfCustomer").find(".ubp_submit");

	ubpContent.keyup(function () {
		var words = $(this).val();
		var reg = /[^x00-xff]/;
		var len = 120; //字符串长度
		var count = 0;
		var actWords = "";
		for (var i = 0; i < words.length; i++) {
			if (reg.test(words.charAt(i)) && words.charAt(i) != "y" && words.charAt(i) != "z") {
				count += 2;
			} else {
				count++;
			}
			if (count > len) {
				ubpTip.html("还可输入<span>" + 0 + "</span>个汉字");
				$(this).val(words.substring(0, count - 1));
			} else {
				ubpTip.html("还可输入<span>" + (len - count) + "</span>个汉字");
			}
		}
	});

	ubpSubmit.click(function () {
		if ($.trim(ubpContent.val()) == "") {
			ubpTip.html("内容不能为空！");
			window.setTimeout(function () {
				ubpTip.html("还可输入120个汉字");
				ubpContent.val("");
			}, 300);
		} else {
			$.ajax({
				url: '',
				type: 'post',
				data: {

				},
				async: true,
				beforeSend: function () {
					ubpTip.html("正在提交……");
				},
				success: function (data) {
					ubpTip.html("提交成功！");
					window.setTimeout(function () {
						ubpTip.html("还可输入120个汉字");
						ubpContent.val("");
					}, 300);
				},
				error: function (data) {
					ubpTip.html("提交失败！");
				}
			});
		};

	});


})(window.jQuery);
