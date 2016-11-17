/**
 * jQuery mainPanel - v1.0
 */

(function( $ , undefined){
 	"use strict"

 	/* WINDOW CLASS DEFINITION
  	 * ====================== */
	
	var mainPanel = function ( element, options ) {
		this.options = options;
		this.isEditing = false;
		this.$element = $(element);
		this.panelArray = this.$element.find('.panel-slide-item');
		this.panelNum = this.panelArray.length;
		this.buildPosition();
		
		var padinationArray = $('#nav-btn-group [data-content="panel-area"]');
		this.$element.slider({
			generatePagination: false,
			padinationIndex: false,
			animationButton: true,
			padinationArray: padinationArray
		});
		this.dragOverPanel = false;
		this.nextBtn = $('#panel-slide-next', this.$element);
		this.prevBtn = $('#panel-slide-prev', this.$element);
		this.delBtn = $('#panel-slide-delete', this.$element);
	}
	
	mainPanel.prototype = {
		constructor: mainPanel,
		
		toggle: function() {
			if(this.isEditing)
				this.stopElementEdit();
			else
				this.startElementEdit();
		},
		
		startElementEdit: function() {
			if(this.isEditing)
				return;
			for(var j = 0; j < this.panelNum; ++j) {
				var panelArea = this.$element.find('#main-panel' + j);
				
				this.beginDraggable(panelArea);
			}
			this.isEditing = true;
		},
		
		
		beginDraggable: function(panel) {
			var self = this;
			panel.children("div").each(function() {
				var $this = $(this);
				if(!$this.hasClass('draggable'))
					return;
				$(this).draggable({ zIndex: 2700 ,effectObj: self});
			});
		},
		
		stopElementEdit: function() {
			if(!this.isEditing)
				return;
			var panelIdArray = "";
			var positionArray = "";
			var bsnCodeArray = "";
			for(var j = 0; j < this.panelNum; ++j) {
				var panelArea = this.$element.find('#main-panel' + j);
				panelArea.children("div").each(function() {
					var $this = $(this);
					if(!$this.hasClass('draggable'))
						return;
					panelIdArray += j + "|";
					positionArray += $this.data('data-index') + "|";
					bsnCodeArray += $this.attr('bsnCode') + "|";
					$this.data("draggable").destroy();
				});
			}

			$.lily.ajax({
	            url: 'updateQuickMenu.do',
	            type: 'post',
	            data: {
	            	panelIdArray : panelIdArray,
	            	positionArray : positionArray,
	            	bsnCodeArray : bsnCodeArray
	            }
	        });
			this.isEditing = false;
		},
		
		startDrag: function(obj ) {
			if(!this.shadowDiv)
				this.shadowDiv = $('<div ></div>');
			this.$currentPanel = $(this.panelArray[this.$element.data('slider').currentIndex()]);
			
			
			this.shadowDiv.css({
				background: "#FFF",
				left: obj.$element.offset().left - this.$currentPanel.offset().left,
				top: obj.$element.offset().top - this.$currentPanel.offset().top,
				width: obj.$element.width()+"px", 
				height: obj.$element.height()+"px",
				position: "relative", 
				opacity: "0.5", 
				zIndex: 1000
			})
			.appendTo(this.$currentPanel);
			this.shadowDiv.draggable({ zIndex: 2700 ,effectObj: self});
			this.shadowDiv.data("data-index", obj.$element.data("data-index"))
			this.draggableObj = obj;
			
		},
		
		drag: function(event) {
			if(this.animating)
				return;
			this.animating = true;
			var that = this.$element,
			 	self = this,
			 	mousePoint = {x: event.pageX, y: event.pageY},
			 	left = event.pageX - this.$element.offset().left;
			
			var currentPanelIndex = this.$element.data('slider').currentIndex();
			
			
			if(left > 0 && left < this.options.width) {
				this.dragOverPanel = false;
				this.isDeleteElement = false;
				var childrenArray = this.$currentPanel.children("div:not(.lily-draggable-dragging)");
				
				var length = childrenArray.length;
				
				var minDistance = 0;//$.lily.calculateDistanceSqrt($(childrenArray[0]), this.draggableObj.$element);
				
				//var $nextObj = $(childrenArray[0]);
				var currentIndex = this.draggableObj.$element.data('data-index');//$nextObj.data('data-index');
	
				
				for( var i = 0; i < length; ++i) {
					var $nextObj = $(childrenArray[i]);
					if(!$nextObj.hasClass('draggable'))
						continue;
					
					if($.lily.isInElement(mousePoint, $nextObj)) {
						currentIndex = $nextObj.data('data-index');
						break;
					}
				}
				if(currentIndex != this.draggableObj.$element.data('data-index') ) {
					this.generatePosition(currentIndex);
					this.draggableObj.$element.appendTo(this.currentPanel);
				}
			}
			else {
				if(!this.dragOverPanel) {
					var animateDirect = "";
					var $nextPanel;

					if($.lily.isInElement(mousePoint, this.delBtn)) {
						this.dragOverPanel = true;
						this.isDeleteElement = true;
					}
					else {
						this.dragOverPanel = false;
						this.isDeleteElement = false;
						if($.lily.isInElement(mousePoint, this.prevBtn) && currentPanelIndex > 0) {
							this.dragOverPanel = true;
							animateDirect = "prev";
							$nextPanel = $(this.panelArray[currentPanelIndex - 1]);
						}
						else if($.lily.isInElement(mousePoint, this.nextBtn) && currentPanelIndex + 1 < this.panelNum) {
							this.dragOverPanel = true;
							animateDirect = "next";
							$nextPanel = $(this.panelArray[currentPanelIndex + 1]);
						}
	
						if(animateDirect !== "") {
							this.$element.data('slider').animate(animateDirect);
							this.addToPanel(this.draggableObj.$element, $nextPanel);
							var dragDataIndex = this.draggableObj.$element.data('data-index');
							this.shadowDiv.data('data-index', dragDataIndex);
							this.shadowDiv.appendTo($nextPanel);
							this.buildPanelDelete(this.$currentPanel, dragDataIndex);
							this.buildPanelPosition($nextPanel);
							this.$currentPanel = $nextPanel;
						}
					}
				}
			}
			this.animating = false;
		},
		
		stopDrag: function() {
			
			if(this.isDeleteElement) {
				var dragDataIndex = this.draggableObj.$element.data("data-index");
				var bsnCode = this.draggableObj.$element.attr("bsnCode");
				this.buildPanelDelete(this.$currentPanel, dragDataIndex);
				this.draggableObj.$element.data("draggable").destroy();
				this.draggableObj.$element.remove();
				$("#menu-panel-item-" + bsnCode, this.$element).removeClass("disabled");
			}
			else {
				this.draggableObj.$element.css({
					left: this.shadowDiv.offset().left - this.$currentPanel.offset().left,
					top: this.shadowDiv.offset().top - this.$currentPanel.offset().top
				});
				this.draggableObj.$element.widget();
			}

			this.shadowDiv.remove();
			this.processOverflow(this.$element.data('slider').currentIndex());
		},
		
		processOverflow: function(panelIndex) {
			var $panel = $(this.panelArray[panelIndex])
			
			var childrenArray = $panel.children("div:not(.lily-draggable-dragging)");
			
			var length = childrenArray.length;
			
			var overflowIndex = 0;

			var overflowArray = [];
			
			
			for( var i = length-1; i > 0 ; --i) {
				var currentObj = $(childrenArray[i]);
				var top = currentObj.position().top;

				if(top > this.options.height) {
					if(panelIndex >= this.options.maxPanelNum)
						$(childrenArray[i]).remove();
					else {
						//顺延到下一个页面会采用insertbefore 非常耗时。故不采用。如果一定要的话建议采用append加排序
						//var test = $(':first-child', $nextPanel);
						$(childrenArray[i]).data('data-index', overflowIndex);
						++overflowIndex;
						overflowArray.push($(childrenArray[i]));
					}
					
				}
			}

			if(overflowIndex !== 0) {
				this.buildNextPanelForOverflow(panelIndex + 1 , overflowArray);
			}
		},
		
		sortfunc: function(a, b) {
			return  $(a).data('data-index') - $(b).data('data-index');
		},
		
		buildNextPanelForOverflow: function(panelIndex, overFlowArray) {
			
			if(panelIndex < this.panelNum) {
				var $nextPanel = $(this.panelArray[panelIndex]);

				if(overFlowArray) {
					var arrayLength = overFlowArray.length;
					$nextPanel.children("div").each(function(){
						var $this = $(this);
						var dataIndex = $this.data('data-index');
						$this.data('data-index', dataIndex + arrayLength);
					});
					for( var i = 0,length = overFlowArray.length; i < length; ++i) {
						overFlowArray[i].appendTo($nextPanel);
					}
				}
				
				var overflowIndex = 0;
				var overflowArray = [];
				var childrenArray = $nextPanel.children("div");
				
				childrenArray.sort(this.sortfunc);
				var x = 0;
				var y = 0;
				for( var i = 0,length = childrenArray.length; i < length; ++i) {
					
					if(y > this.options.height) {
						if(panelIndex >= this.options.maxPanelNum)
							$(childrenArray[i]).remove();
						else {
							$(childrenArray[i]).data('data-index', overflowIndex);
							++overflowIndex;
							overflowArray.push($(childrenArray[i]));
						}
						continue;
					}
					$(childrenArray[i]).css({
						left: x + "px",
						top: y + "px"
					});
					x += $(childrenArray[i]).width() + this.options.widthInterval;
					var nextWidth = i < length - 1 ? $(childrenArray[i+1]).width() : 0;
					if(x + nextWidth > this.$element.width()) {
						x = this.origX;
						y += $(childrenArray[i]).height() + this.options.heightInterval;
					}
				}
				if(overflowIndex !== 0) {
					this.buildNextPanelForOverflow(panelIndex + 1, overflowArray);
				}
			}
			else {
				var $slidesItem = $('<div id="main-panel' + this.panelNum + '" class="panel-slide-item">');
				this.panelArray.push($slidesItem);
				++this.panelNum;
				this.$element.data('slider').appendSlidesItem($slidesItem);
				for( var i = 0,length = overFlowArray.length; i < length; ++i) {
					overFlowArray[i].appendTo($slidesItem);
				}
				this.buildPanelPosition($slidesItem);
			}
		},
		
		generatePosition: function(currentIndex) {
			var that = this.$element;
			var childrenArray = this.$currentPanel.children("div:not(.lily-draggable-dragging)");
			
			var length = childrenArray.length;
			
			var minIndex = Math.min(this.draggableObj.$element.data('data-index'), currentIndex);
			var maxIndex = Math.max(this.draggableObj.$element.data('data-index'), currentIndex);
			
			var direct = this.draggableObj.$element.data('data-index') < currentIndex;
			for( var i = minIndex; i < maxIndex; ++i) {
				var tempIndex = $(childrenArray[i]).data('data-index');
				if(direct) {
					$(childrenArray[i]).data('data-index', tempIndex - 1);
				}
				else {
					$(childrenArray[i]).data('data-index', tempIndex + 1);
				}
			}
			this.shadowDiv.data('data-index', currentIndex);
			
			var x = this.origX;
			var y = this.origY;
			
			childrenArray.sort(this.sortfunc);
			for( var i = 0; i <= length; ++i) {
				$(childrenArray[i]).css({
					left: x + "px",
					top: y + "px"
				});
				x += $(childrenArray[i]).width() + this.options.widthInterval;
				var nextWidth = i < length - 1 ? $(childrenArray[i+1]).width() : 0;
				if(x + nextWidth > that.width()) {
					x = this.origX;
					y += $(childrenArray[i]).height() + this.options.heightInterval;
				}
			}
			this.draggableObj.$element.data('data-index', currentIndex);
		},
		
		buildPosition: function() {
			var that = this.$element;
			for(var j = 0; j < this.panelNum; ++j) {
				var panelArea = that.find('#main-panel' + j);
				
				this.buildPanelPosition(panelArea);
			}
		},
		
		buildPanelDelete : function(panelArea, dragDataIndex) {
			var childrenArray = panelArea.children("div:not(.lily-draggable-dragging)");
			/*
			var x = $(childrenArray[0]).offset().left;
			var y = $(childrenArray[0]).offset().top ;
			
			x -= this.$element.offset().left;
			y -= this.$element.offset().top;
			*/
			var x = this.origX;
			var y = this.origY;
			
			childrenArray.sort(this.sortfunc);
			
			for( var i = 0, length = childrenArray.length; i < length; ++i) {
				$(childrenArray[i]).css({
					left: x + "px",
					top: y + "px"
				});
				x += $(childrenArray[i]).width() + this.options.widthInterval;
				$(childrenArray[i]).data('data-index', i);
				var nextWidth = i < length - 1 ? $(childrenArray[i+1]).width() : 0;
				if(x + nextWidth > panelArea.width()) {
					x = this.origX;
					y += $(childrenArray[i]).height() + this.options.heightInterval;
				}
			}
		},
		
		buildPanelPosition: function(panelArea) {
			var childrenArray = panelArea.children("div:not(.lily-draggable-dragging)");
			
			var length = childrenArray.length;
			/*
			var x = $(childrenArray[0]).offset().left;
			var y = $(childrenArray[0]).offset().top ;
			
			x -= this.$element.offset().left;
			y -= this.$element.offset().top;
			*/
			var x = 0;
			var y = 0;
			this.origX = x;
			this.origY = y;
			for( var i = 0; i < length; ++i) {
				$(childrenArray[i]).css({
					left: x + "px",
					top: y + "px"
				});
				x += $(childrenArray[i]).width() + this.options.widthInterval;
				$(childrenArray[i]).data('data-index', i);
				var nextWidth = i < length - 1 ? $(childrenArray[i+1]).width() : 0;
				if(x + nextWidth > panelArea.width()) {
					x = this.origX;
					y += $(childrenArray[i]).height() + this.options.heightInterval;
				}
			}
		},
		
		addElement: function(spanWidth, bsncode, actionId, event) {
			var self = this;
			var dragHtml = '<div class="span' + spanWidth + ' draggable transaction-widget" data-toggle="panel-widget" bsncode="' + bsncode 
				+ '" data-content="' + actionId + '"></div>';
			this.startElementEdit();
			this.$currentPanel = $(this.panelArray[this.$element.data('slider').currentIndex()]);
			var dragHtmlObj = $(dragHtml);
			dragHtmlObj
				.data('data-index', this.$currentPanel.children().length)
				.appendTo(this.$currentPanel)
				.css({
					left: event.pageX - this.$element.offset().left,
					top: event.pageY - this.$element.offset().top
				})
				.draggable({ zIndex: 2700 ,effectObj: self})
				.data('draggable')
				.mouseDown(event);
		},
		
		addToPanel: function(element, panel) {
			element.data('data-index', panel.children().length)
			.appendTo(panel)
		}
	},
	/* window PLUGIN DEFINITION
  	 * ======================= */

  	$.fn.mainPanel = function ( option ) {
    	return this.each(function () {
      		var $this = $(this), 
      			data = $this.data('mainPanel'), 
      			options = $.extend({}, $.fn.mainPanel.defaults, $this.data(), typeof option == 'object' && option);
      		if (!data) 
      			$this.data('mainPanel', (data = new mainPanel(this, options)));
    	})
  	}
  	
	$.fn.mainPanel.defaults = {
		widthInterval: 8,
		heightInterval: 8,
		maxPanelNum: 4,
		width: 892,
		height: 442
  	}

  	$.fn.mainPanel.Constructor = mainPanel;

})(jQuery );
