/**
 * jQuery Carousel - v1.0
 * auth: shenmq
 * E-mail: shenmq@yuchengtech.com
 * website: shenmq.github.com
 */
 
(function($ , undefined) {

	var defaults, methods;
	
	$.extend({
		carouselShapes: {
			def: "lazySusan",
			lazySusan: function (r, a, t) {
				return {
					x: Math.sin(r + a),
					y: (Math.sin(r + 3 * Math.PI / 2 + a) / 8) * t,
					z: (Math.cos(r + a) + 1) / 2,
					scale: (Math.sin(r + Math.PI / 2 + a) / 2) + 0.5
				};
			}
		}
	});
	
	defaults = {
		angle: 0.0,
		focusAngle: 0.0,
		tilt: 0.0,
		minZ: 100,
		maxZ: 280,
		minOpacity: 0.4,
		maxOpacity: 1.0,
		minScale: 0.6,
		maxScale: 1.0,
		duration: 600,
		shape: "lazySusan",
		childSelector: "li",
		clickToFocus: true,
		floatComparisonThreshold: 0.001,
		startingChild: null,
		showClass: 'menu-carousel-show',
		hideClass: 'menu-carousel-hide'
	};
	
	methods = {
		//init method
		//initialize carousel
		init: function(options, callback) {
			var settings;
			
			options = (typeof options === "object") ? options : {};
			settings  = $.extend({}, defaults, options);
			
			return this
				.each(function() {
					// 计算位置信息
					var self = $(this),
						childCount = self.children(settings.childSelector).length,
						interval = 360.0 / childCount,
						startingChild = (settings.startingChild && settings.startingChild > (childCount - 1)) ? (childCount - 1) : settings.startingChild,
						startingAngle = (settings.startingChild === null) ? settings.angle : 360 - (startingChild * interval),
					    holderCSSPosition = (self.css("position") !== "static") ? self.css("position") : "relative";
					    
					self.css({  // 初始样式
							padding:   0,
							position:  holderCSSPosition
						})
						.addClass("carousel-holder")
						.data(  // 初始位置信息
							"carousel",
							$.extend(
								{},
								settings,
								{
									startingChild: startingChild,
									angle: startingAngle,
									interval: interval
								}
							)
						);
						
					// 是否支持点击触发转动
					if (settings.clickToFocus) {
						self.children(settings.childSelector)
							.each(function(i) {
								$(this)
									.bind("click.carousel", function( event ) {
										var degrees = methods.getPlacement.apply(self, [i]);

										if (!methods.isInFocus.apply(self, [degrees])) {
											if (!self.data("carousel").animating) {
												methods.animateAngleToFocus.apply(self, [degrees, self.data("carousel").clickToFocusCallback]);
											}
											return false;
										}
									});
							});
					}
					// 初始化子节点
					methods.initChildren.apply(self, [callback]);
				});
		},
		//initChildren
		//初始化子节点
		initChildren: function(callback) {
			var self = $(this),
			    data = self.data("carousel");

			callback = callback || function() {};
			
			self.children(data.childSelector).each(function(i) {
				var startWidth, startHeight, startFontSize,
				    degrees = methods.getPlacement.apply(self, [i]);
				    
				$(this)
					.addClass("carousel-moveable-item")
					.css("position", "absolute");
					
				$(this)
					.data(
						"carousel",
						{
							startWidth: startWidth || $(this).width(),
							startHeight: startHeight || $(this).height(),
							startFontSize: startFontSize || parseInt($(this).css("font-size"), 10),
							degrees: degrees,
							backDegrees: methods.normalize.apply(null, [degrees - 180]),
							childNumber: i,
							currentScale: 1,
							parent: self
						}
					);
			});
			methods.updateChildren.apply(self);

			self.trigger('ready');
			callback.apply(self);
			return self;
		},
		
		//updateChildren
		//
		updateChildren: function() {
			return this
				.each(function() {
					var self = $(this),
					    data = self.data("carousel"),
					    inFocus = -1,
					    info = {
								angle: data.angle,
								tilt: data.tilt,
								animating: data.animating,
								inFocus: data.childInFocus,
								focusRadian: methods.degToRad.apply(null, [data.focusAngle]),
								shape: $.carouselShapes[data.shape] || $.carouselShapes[$.carouselShapes.def]
					    };
					    
					info.center = {
						x: self.width() / 2,
						y: self.height() / 2
					};
					    
					info.zValues = {
						min: data.minZ,
						max: data.maxZ,
						diff: data.maxZ - data.minZ
					};

					info.opacity = {
						min: data.minOpacity,
						max: data.maxOpacity,
						diff: data.maxOpacity - data.minOpacity
					};

					info.scale = {
						min: data.minScale,
						max: data.maxScale,
						diff: data.maxScale - data.minScale
					};
					
					info.modifyClass = {
						showClass: data.showClass,
						hideClass: data.hideClass
					};

					// 更新 childselector 的位置
					self.children(data.childSelector)
						.each(function(i) {
							if (methods.updateChild.apply(self, [$(this), info, i, function() { $(this).trigger('ready'); }]) && (!info.animating || data.lastAnimationStep)) {
								inFocus = i;
								$(this).addClass("carousel-in-focus");
							} 
							else {
								$(this).removeClass("carousel-in-focus");
							}
						});
					if (inFocus !== info.inFocus) {
						// 原来的子节点失去焦点
						if (data.triggerBlurEvents) {
							self.children(data.childSelector)
								.eq(info.inFocus)
								.trigger("blur");
						}

						data.childInFocus = inFocus;

						if (data.triggerFocusEvents && inFocus !== -1) {
							// 新节点获取焦点
							self.children(data.childSelector)
								.eq(inFocus)
								.trigger("focus");
						}
					}
					self.trigger("childrenUpdated");
				});
		},
		// updateChild
		// 更新子节点位置
		updateChild: function(childElement, info, childPos, callback) {
			var factors,
			    self = this,
			    child = $(childElement),
			    data = child.data("carousel"),
			    out = [],
			    degree = (360.0 - data.degrees) + info.angle,
			    rad = methods.degToRad.apply(null, [degree]);
			

			callback = callback || function() {};

			rad = methods.normalizeRad.apply(null, [rad]);

			factors = info.shape(rad, info.focusRadian, info.tilt);

			factors.scale = (factors.scale > 1) ? 1 : factors.scale;
			factors.adjustedScale = (info.scale.min + (info.scale.diff * factors.scale)).toFixed(4);
			factors.width = (factors.adjustedScale * data.startWidth).toFixed(4);

			if(rad > 2.6 && rad < 3.6) {
				child.addClass(info.modifyClass.hideClass);
				child.removeClass(info.modifyClass.showClass);
				factors.height = (factors.adjustedScale * data.startHeight).toFixed(4);
				factors.top = (factors.y * info.center.y + info.center.y - data.startHeight / 2.0 ).toFixed(0);
			}
			else {
				child.addClass(info.modifyClass.showClass);
				child.removeClass(info.modifyClass.hideClass);
				factors.height = data.startHeight;
				factors.top = (factors.y * info.center.y + info.center.y - factors.height / 2.0).toFixed(0);
			}
			
			
			child
				.css({
					left: (factors.x * info.center.x + info.center.x - factors.width / 2.0).toFixed(0) + "px",
					top:  factors.top + "px",
					width: factors.width + "px",
					height: factors.height + "px", 
					opacity: (info.opacity.min + (info.opacity.diff * factors.scale)).toFixed(2),
					zIndex: Math.round(info.zValues.min + (info.zValues.diff * factors.z)),
					fontSize: (factors.adjustedScale * data.startFontSize).toFixed(1) + "px"
				});
			data.currentScale = factors.adjustedScale;

			child.trigger("reposition");
			
			callback.apply(self);

			return methods.isInFocus.apply(self, [data.degrees]);
		},
		// animateAngleToFocus
		// 旋转角度degress以获取焦点
		animateAngleToFocus: function(degrees, duration, callback) {
			callback = callback || function() {};

			return this
				.each(function() {
					var delta = $(this).data("carousel").angle - degrees;
					
					delta = (Math.abs(360 - delta) < Math.abs(delta)) ? 360 - delta : -delta;
					delta = (delta > 180) ? -(360 - delta) : delta;

					if (delta !== 0) {
						methods.animateToDelta.apply($(this), [delta, duration, callback]);
					}
				});
		},
		// animateToDelta
		// 旋转固定角度
		animateToDelta: function(degrees, duration, callback) {
			callback = callback || function() {};

			// find callback
			if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			return this
				.each(function() {
					var delta = $(this).data("carousel").angle + degrees;
					methods.animateToAngle.apply($(this), [delta, duration, callback]);
				});
		},
		// animateToAngle
		// 按轴承转动 所有转动的入口
		animateToAngle: function(angle, duration, passedData, callback) {
			var now = (new Date()).getTime();

			callback = callback || function() {};

			// find callback function in arguments
			if ($.isFunction(passedData)) {
				callback = passedData;
				passedData = null;
			} else if ($.isFunction(duration)) {
				callback = duration;
				duration = null;
			}

			this
				.each(function() {
					var timer, newAngle,
					    self = $(this),
					    data = self.data("carousel"),
					    thisDuration = (!duration) ? data.duration : duration;
					    
					// 是否为第一次
					if (!passedData) {
						passedData = {
							timerStart: now,
							start: data.angle,
							totalTime: thisDuration
						};
					}

					// 更新定时器
					timer = now - passedData.timerStart;

					// 动画期间
					if (timer < thisDuration) {
						if (!data.animating) {
							self.trigger("animationStart");
						}

						data.animating = true;

						newAngle = $.easing['swing']((timer / passedData.totalTime), timer, passedData.start, angle - passedData.start, passedData.totalTime);

						newAngle = passedData.start + ((angle - passedData.start) * newAngle);
						
						newAngle = methods.normalize.apply(null, [newAngle]);
						methods.setAngle.apply(self, [newAngle, function() {
							setTimeout(function() {  // 使用timeout来展现每步动作
								methods.animateToAngle.apply(self, [angle, thisDuration, passedData, callback]);
							}, 0);
						}]);
					}
					// 动画完成
					else {
						data.lastAnimationStep = true;

						angle = methods.normalize.apply(null, [angle]);
						methods.setAngle.apply(self, [angle, function() {
							self.trigger("animationEnd");
						}]);
						data.animating = false;
						data.lastAnimationStep = false;
						callback.apply(self);
					}
				});

			return this;
		},
		// setAngle
		// 改变转盘的转动角度
		setAngle: function(angle, callback) {
			callback = callback || function() {};
			angle = methods.normalize.apply(null, [angle]);

			this
				.each(function() {
					var diff, lowerValue, higherValue,
					    self = $(this),
					    data = self.data("carousel"),
					    oldAngle = data.angle;

					data.angle = angle;
					self.trigger("angleSet");
					methods.updateChildren.apply(self);

					// not animating? we're done here
					diff = Math.abs(oldAngle - angle);
					if (!data.animating || diff > 180) {
						return;
					}

					self.children(data.childSelector).each(function(i) {
						var eventType;

						if (methods.isChildBackDegreesBetween.apply($(this), [angle, oldAngle])) {
							eventType = (oldAngle > angle) ? "Clockwise" : "Counterclockwise";
							$(this).trigger("move" + eventType + "ThroughBack");
						}
					});
				});
			// call callback if one was given
			callback.apply(this);
			return this;
		},
		// isChildBackDegreesBetween
		isChildBackDegreesBetween: function(value1, value2) {
			var backDegrees = $(this).data("carousel").backDegrees;

			if (value1 > value2) {
				return (backDegrees >= value2 && backDegrees < value1);
			} else {
				return (backDegrees < value2 && backDegrees >= value1);
			}
		},
		// getPlacement
		// 返回child的开始角度
		getPlacement: function(child) {
			var data = this.data("carousel");
			return 360.0 - (data.interval * child);
		},
		// isInFocus
		// 是否是焦点
		isInFocus: function(degrees) {
			var diff,
			    self = this,
			    data = self.data("carousel"),
			    angle = methods.normalize.apply(null, [data.angle]);

			degrees = methods.normalize.apply(null, [degrees]);
			diff = Math.abs(angle - degrees);

			// this calculation gives a bit of room for javascript float rounding
			// errors, it looks on both 0deg and 360deg ends of the spectrum
			return (diff <= data.floatComparisonThreshold || diff >= 360 - data.floatComparisonThreshold);
		},
		// normalize
		// 角度单位化
		normalize: function(degrees) {
			var inRange = degrees % 360.0;
			return (inRange < 0) ? 360 + inRange : inRange;
		},
		// degToRad
		// 角度 to 弧度
		degToRad: function(degrees) {
			return methods.normalize.apply(null, [degrees]) * Math.PI / 180.0;
		},
		//normalizeRad
		//单位化弧度
		normalizeRad: function(radians) {
			while (radians < 0) {
				radians += (Math.PI * 2);
			}

			while (radians > (Math.PI * 2)) {
				radians -= (Math.PI * 2);
			}
			return radians;
		}
	};
	
	$.fn.carousel = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === "object" || $.isFunction(method) || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error("Method " + method + " does not exist for jQuery.carousel.");
		}
	};
})(jQuery);		
			
			