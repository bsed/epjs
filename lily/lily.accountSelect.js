/**
 * jQuery button - v1.0
 */
 
(function( $, undefined ) {
	
	"use strict"

 	/* BUTTON PUBLIC CLASS DEFINITION
	 * ============================== */
	 
	 
	 var AccountSelect = function ( element, options ) {
		this.$element = $(element);
		this.options = $.extend({}, $.fn.accountSelect.defaults, options);
		this.typeFilter = this.$element.attr("data-content");
	}
	
	AccountSelect.prototype = {
		constructor: AccountSelect,
	
		showAccountSelect: function () {
			var self = this;
			
			var accountList = $.lily.sessionData.iAccountInfo;
			var accountHTML = '<div data-toggle="buttons-radio"><div class="card-area"  id="card-slider"><a href="#" class="prev" style="margin-top:65px;"></a><div class="slides-inner" id="card-slider-inner">';
			var index = 0;
			for(var i=0; i < accountList.length; ++i) {
				if(this.options.filter && this.options.filter.indexOf(accountList[i].accountType) >= 0 ) {
					continue;
				}
						
				if(index%3 === 0) {
					if(index !== 0)
						accountHTML += '</div>';
					accountHTML += '<div class="card-slider-item">';
				}
				accountHTML += '<div class="card-item btn cascade"  data-toggle="button" data-contect="' + i + '"><img src="img/card/card.png" /><div class="card-accountNo">' +
				accountList[i].accountNo + '</div></div>';
				++index;
			}
			
			accountHTML += '</div></div><a href="#" class="next"></a></div></div>';
			
			
			var accountObj = $(accountHTML);
			
			$('.btn', accountObj).bind('click.account.select', function() {
				var selectedAccount = accountList[$(this).attr('data-contect')];
				self.$element.val(selectedAccount.accountNo /*+ '[' + selectedAccount.accountAlias + ']'*/);
				
				if(self.options.balance) {
					// 查询账户余额
					$.lily.ajax({
						url: 'accountBalanceQuery.do',
						data: {'accountNo' : selectedAccount.accountNo},
					    type: 'post',
					    processResponse: function(data) {
							self.$element.parent().find('#' + self.options.balance).text('账户余额：' + data.balance + '元');
					    }
					});
				}
				if(self.options.extendShow) {
					for(var key in self.options.extendShow) {
						var obj = $('#' + self.options.extendShow[key]);
						if(obj.is('input'))
							obj.val(selectedAccount[key]);
						else
							obj.text(selectedAccount[key]);
					}
				}
			});
			
			$.openWindow({
				backdrop: true, 
				content: accountObj,
				allowClose: false,
				allowMinimize: false,
				windowClass: 'card-window',
				showFun: null,
				closeFun: null,
				afterFun: accountSelectCallback
			});
		},
		
		reset: function() {
			this.$element.parent().find('#' + this.options.balance).text("");
		}
	}
	
	$.fn.accountSelect = function ( option ) {
    	return this.each(function () {
			var $this = $(this), 
				data = $this.data('accountSelect'), 
				options = typeof option == 'object' && option;
			if (!data)
				$this.data('accountSelect', (data = new AccountSelect(this, options)));
			
			data.showAccountSelect();
		});
	}
	
	$.fn.accountSelect.defaults = {
		
  	}

  	$.fn.accountSelect.Constructor = AccountSelect;
  	
  	$(function () {
		$('body').on('click.recBook.data-api', '[data-toggle^=accountNo]', function ( e ) {
			var $btn = $(e.target);
			var options = $.parseJSON($btn.attr("data-content"));
		  	$btn.accountSelect(options);
		});
	})

})(jQuery);
