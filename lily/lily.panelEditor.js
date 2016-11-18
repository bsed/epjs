/**
 * jQuery panel editor - v1.0
 */

(function($, undefined){
	"use strict"

	var PanelEditor = function ( element, options ) {
		this.init(element, options);
	}

	PanelEditor.prototype = {
		constructor: PanelEditor,

		init: function(element, options) {
			this.$element = $(element);
			this.options = options;
			var self = this;

			this.editBtn = $('#panel-edit-btn', this.$element);
			this.addBtn = $('#panel-add-btn', this.$element);
			this.finishBtn = $('#panel-stop-btn', this.$element);
			this.deleteBtn = $('#panel-slide-delete');
			this.$menuContainer = $('#menu-foradd-panel');

			this.mainPanel = $('#panel-area').data('mainPanel');

			$('#menu-foradd-panel-close', this.$menuContainer).bind('click.close', function(){
				self.closeMenuContainer();
			});

			this.editBtn.bind('click.startEditting', function () { self.startEditting(); });
			this.addBtn.bind('click.showMenuContainer', function () { self.showMenuContainer(); });
			this.finishBtn.bind('click.stopEditting', function () { self.stopEditting(); });


			$('.menu-panel-item', this.$menuContainer).bind('mousedown.addWidget', function(event) {
				var $this = $(this);
				if($this.hasClass("disabled"))
					return;
				self.closeMenuContainer();
				var bsnCode = $this.attr('bsncode');
				var actionId = $this.attr('data-content');
				var width = $this.attr('widget-width');
				//<div class="span2 draggable transaction-widget" data-toggle="panel-widget" bsncode="006001" data-content="006001_customerInfoUpdate" style="left: 0px; top: 0px; ">
				$("#panel-area").data('mainPanel').addElement(width, bsnCode, actionId, event);
				$this.addClass("disabled");
			});
		},

		startEditting: function() {
			if(this.editBtn.hasClass('active'))
				return;
			this.editBtn.addClass('active');
			this.addBtn.fadeIn();
			this.finishBtn.fadeIn();
			this.deleteBtn.fadeIn();
			this.mainPanel.startElementEdit();
		},

		stopEditting: function() {
			this.editBtn.removeClass('active');
			this.addBtn.fadeOut();
			this.finishBtn.fadeOut();
			this.deleteBtn.fadeOut();
			this.mainPanel.stopElementEdit();
		},

		showMenuContainer: function() {
			var self = this;
			this.isShown = true;
			backdrop.call(this, function () {

				self.$menuContainer.fadeIn(self.options.fadeSpeed, self.options.fadeEasing);

			});
		},

		closeMenuContainer: function() {
			if(this.options.backdrop) {
				this.$backdrop.removeClass('in');
	    		removeBackdrop.call(this);
	    	}
			this.$menuContainer.fadeOut(this.options.fadeSpeed, this.options.fadeEasing);
		}
	}

	function backdrop( callback ) {
		var that = this ;

		if (this.isShown && this.options.backdrop) {

	  		this.$backdrop = $('<div class="displayer-backdrop " />').appendTo('body');

	  		if (this.options.backdrop != 'static') {
	    		this.$backdrop.click($.proxy(this.closeMenuContainer, this));
	  		}

	  		this.$backdrop.addClass('in');
	    	callback();
		}
		else if (!this.isShown && this.$backdrop) {
	  		this.$backdrop.removeClass('in');
	    	removeBackdrop.call(this);
			callback();
		}
		else if (callback) {
	  		callback();
		}
	}

	function removeBackdrop() {
		this.$backdrop.remove()
		this.$backdrop = null
	}

	$.fn.panelEditor = function( option ) {
		option = $.extend( {}, $.fn.panelEditor.option, option );
		return this.each(function(){
			var $this = $(this),
				data = $this.data('panelEditor'),
				options = typeof option == 'object' && option;
      		if (!data)
      			$this.data('panelEditor', (data = new PanelEditor(this, options)));
		});
	};

	$.fn.panelEditor.option = {
		backdrop: true
	};

})(jQuery);