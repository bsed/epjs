/**
 * tkSwitchAD 图片切换
 * id  string ul#id
 * bid string div#id 按钮
 * delay float  间隔时间
 * v     float  淡入淡出动画系数
*/
function tkSwitchAD(id,bid,delay,v){
	this.ul = document.getElementById(id);
	this.liArr = this.ul.getElementsByTagName('li');
	this.bid = document.getElementById(bid);
	this.aArr = [];
	this.size = this.liArr.length;
	this.timer = null;
	this.pid = 0;
	this.cid = 1;
	this.v = v || 30;
	this.delay = delay || 3000;
	
	this.img = [];
	var li_img;
	for(var k=0;k<this.size;k++){
		li_img = this.liArr[k].getElementsByTagName("img")[0];
		this.img.push(li_img);
		this.liArr[k].style.opacity = 0;
	    this.liArr[k].style.filter = 'alpha(opacity=0)';
	    this.liArr[k].style.zIndex = 0;
	    this.liArr[k].style.background = 'url(' + this.img[k].src + ') center 0 no-repeat';
	}	
	this.liArr[0].style.opacity = 1;
	this.liArr[0].style.filter = 'alpha(opacity=100)';
    this.liArr[0].style.zIndex = 1;
	this.liArr[0].style.background = 'url(' + this.img[0].src + ') center 0 no-repeat';

	
	//初始化
	this.init();
	//按钮居中显示
	this.bid.style.left = ((this.ul.offsetWidth - 980)/2) + 'px';
}
tkSwitchAD.prototype = {
	init:function(){
		this.addBtnlist();
		this.start();
		this.handler();
	},
	addBtnlist:function(){
		var btnStr = '';
		for(var i=1,len = this.size; i <= len; i++){
			var classStr = (i==1) ? 'class="current"':'';
			btnStr += '<a '+classStr+' href="javascript:;">'+"<img src='"+this.img[i-1].src+"' />"+'</a>';
		}
		this.bid.innerHTML = btnStr;
		this.aArr = this.bid.childNodes;
	},
	handler:function(){
		var _this = this;
		for(var i=0,len = _this.size;i<len; i++){
			_this.liArr[i].onmouseover =(function(i){
					return function(){
						_this.stop();
					}
			})(i);
			_this.liArr[i].onmouseout =(function(i){
					return function(){
						_this.start();
					}
			})(i);
			
			_this.aArr[i].onmouseover =(function(i){
					return function(){
						_this.stop();
						_this.cid = (i==_this.size) ? 0:(i+1);
						_this.goto(i);
						_this.pid = i;
					}
			})(i);
			_this.aArr[i].onmouseout =(function(i){
					return function(){
						_this.start();
					}
			})(i);
			
		}
	},
	cycle:function(){
		if(this.cid == this.size) this.cid=0;
		this.goto(this.cid);
		this.pid = this.cid;
		this.cid++;
	},
	goto:function(index){
		if(this.pid==index) return;
		this.aArr[this.pid].className = "";
		this.fadeOut(this.pid);
		this.liArr[this.pid].style.zIndex = 0;
		
		for(var i=0,len = this.size; i < len; i++){
			if(i!=index&i!=this.pid){
				this.aArr[i].className = "";
				this.setOpacity(this.liArr[i],0);
				this.liArr[i].style.zIndex = 0;
				
			}
		}		
		this.aArr[index].className = "current";
		this.fadeIn(index);
		this.liArr[index].style.zIndex = 10;
		
	},
	fadeOut:function(index){
		var _this = this;
		var val=90,cli=_this.liArr[index];                                      
        var tt = setInterval(function(){ 
                if(val<=0){ 
                    clearInterval(tt); 
                } 
                 _this.setOpacity(cli,val); 
                val-=10; 
            },_this.v); 
	},
	fadeIn:function(index){
		var _this = this;
		var val=10,cli=_this.liArr[index];                                  
        var t = setInterval(function(){ 
                    if(val>=100){ 
                        clearInterval(t); 
                    } 
                    _this.setOpacity(cli,val); 
                    val+=10; 
             },_this.v);  
	},
	setOpacity:function(obj,val){
		 if(document.documentElement.filters){
			 obj.style.filter = "alpha(opacity="+val+")"; 
		}else{ 
			obj.style.opacity = val/100; 
		} 
	},
	start:function(){
		var _this = this;
		_this.timer = setInterval(function(){
			_this.cycle();
		},_this.delay);
	},
	stop:function(){
		clearInterval(this.timer);
	}
}

