///**
// * jQuery Carousel - v1.0
// */
//
//(function($ , undefined) {
//	"use strict"
//
//
//	var Placeholder = function ( element, options ) {
//		this.init(element, options)
//	}
//
//	Placeholder.prototype = {
//		constructor: Placeholder,
//
//		init: function (element, options ) {
//			if(!$(element).attr('placeholder'))
//				return;
//			this.$element = $(element);
//			this.$element.bind({'focus.placeholder':  $.proxy(this.clearPlaceholder, this),
//				'blur.placeholder':  $.proxy(this.setPlaceholder, this)
//			});
//			this.$element.data('placeholder-enabled', true)
//			.trigger('blur.placeholder');
//		},
//
//		clearPlaceholder: function(event, value) {
//			var input = this.$element[0],
//			    $input = $(input);
//			if (input.value == $input.attr('placeholder') && $input.hasClass('placeholder')) {
//				if ($input.data('placeholder-password')) {
//					$input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
//					// If `clearPlaceholder` was called from `$.valHooks.input.set`
//					if (event === true) {
//						return $input[0].value = value;
//					}
//					$input.focus();
//				}
//				else {
//					input.value = '';
//					$input.removeClass('placeholder');
//				}
//			}
//		},
//
//		setPlaceholder :function() {
//			var $replacement,
//			    input = this.$element[0],
//			    $input = $(input),
//			    id = this.id;
//			if (input.value == '') {
//				if (input.type == 'password') {
//					if (!$input.data('placeholder-textinput')) {
//						try {
//							$replacement = $input.clone().attr({ 'type': 'text' });
//						} catch(e) {
//							$replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
//						}
//						$replacement
//							.removeAttr('name')
//							.data({
//								'placeholder-password': true,
//								'placeholder-id': id
//							})
//							.bind('focus.placeholder', clearPlaceholder);
//						$input
//							.data({
//								'placeholder-textinput': $replacement,
//								'placeholder-id': id
//							})
//							.before($replacement);
//					}
//					$input = $input.removeAttr('id').hide().prev().attr('id', id).show();
//					// Note: `$input[0] != input` now!
//				}
//				$input.addClass('placeholder');
//				$input[0].value = $input.attr('placeholder');
//			}
//			else {
//				$input.removeClass('placeholder');
//			}
//		}
//	}
//
//	$.fn.placeholder = function ( option ) {
//		var isInputSupported = 'placeholder' in document.createElement('input'),
//	    	isTextareaSupported = 'placeholder' in document.createElement('textarea');
//	    //游览器已经支持 placeholder
//	    if (isInputSupported && isTextareaSupported)
//	    	return this;
//
//	    // 页面加载的时候清空 域的value 防止刷新时value不同步
//		$(window).bind('beforeunload.placeholder', function() {
//			$('.placeholder').each(function() {
//				this.value = '';
//			});
//		});
//    	return this.each(function () {
//			var $this = $(this),
//				data = $this.data('placeholder'),
//				options = typeof option == 'object' && option;
//      		if (!data)
//      			$this.data('placeholder', (data = new Placeholder(this, options)));
//      		if (typeof option == 'string')
//      			data[option]();
//    	});
//  	}
//
//  	$.fn.placeholder.Constructor = Placeholder;
//
//  	$.fn.placeholder.defaults = {
//  		delay: 0
//  	}
//
//
//})(jQuery);











/**
 * jQuery Carousel - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */

(function($ , undefined) {
	"use strict"


	var Placeholder = function (element) {
		this.init(element);
	}
	Placeholder.prototype = {
		constructor: Placeholder,

		_check : function(){
	        return 'placeholder' in document.createElement('input');
	    },
	    init : function(element){
	        if(!this._check()){
	            this.fix(element);
	        }
	    },
	    fix : function(element){
	        $('input[placeholder]',element).each(function(index, element) {
	            var self = $(this), txt = self.attr('placeholder');
	            self.wrap($('<div></div>').css({position:'relative', zoom:'1', border:'none', background:'none', padding:'none', margin:'none','float':'left'}));
	            var pos = self.position(), h = self.outerHeight(true), paddingleft = self.css('padding-left'),left=pos.left,top=pos.top;
	            if($(this).is(":hidden")){
	            	top=0;
	            	h=26;
	            }
	            var holder = $('<span></span>').text(txt).css({position:'absolute', left:left, top:top, height:h, 'line-height':h+'px', paddingLeft:paddingleft, color:'#D0D0D0',"font-size":"12"}).appendTo(self.parent());
	            self.focus(function(e) {
	                holder.hide();
	            });
	            self.blur(function(e) {
	                if(!self.val()){
	                    holder.show();
	                }
	            });
	            holder.click(function(e) {
	                holder.hide();
	                self.focus();
	            });
	            self.change(function(e){//值有变动时使用
	            	if(!self.val()){
	            		holder.show();
	            	}else{
	            		holder.hide();
	            		//self.focus();
	            	}

	            });
	        });
	    }
	}//prototype
	$.fn.placeholder = function (  ) {
		new Placeholder(this);
  	}
  	$.fn.placeholder.Constructor = Placeholder;
  	$.fn.placeholder.defaults = {
  		delay: 0
  	}
})(jQuery);







