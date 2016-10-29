function Messenger(id) {
    this.sdkversion = "1.0.0.9";
    this.collectionCNindex="HRBB";//如果是多证书设置要查询的CN唯一标识
    var ua = navigator.userAgent.toLowerCase();
    this.env = {
        isWindows: (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1),
        isMac: (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1),
        isLinux: (ua.indexOf("linux") != -1),
        ie: ua.indexOf('msie') != -1,
        firefox: ua.indexOf('firefox') != -1,
        chrome: ua.indexOf('chrome') != -1,
        opera: ua.indexOf('opera') != -1,
        safari: ua.indexOf('version') != -1
    };
    this.createTag = function () {
        /*if (this.env.isWindows && this.env.ie) {
            return "<object id='" + id + "' classid='CLSID:EC176F0A-69BE-4059-8546-B01EF8C0FB9C' width='0' height='0'></object>";
        } else {
            return "<font color='red'>暂不支持此浏览器</font>";
        }*/
        return "<object id='" + id + "' classid='CLSID:EC176F0A-69BE-4059-8546-B01EF8C0FB9C' width='0' height='0'></object>";
    };
    
    var keychain,certificate,collection,evaldn;
    this.filter = function (){
    	
    }
    this.sign = function (dn, content) {
    	if(dn=="" || content==""){
    		return false;
    	}
    	try {
	    	keychain = this.getObj().keychain();    	
	    	var dn_new = dn.replace(/\s/g,'');
	    	dn_new = dn_new.replace(/=/g,':"');
			dn_new = "{"+dn_new.replace(/,/g,'",')+'"}';
		    dn_new=eval("("+dn_new+")");
	    	collection = keychain.query(dn_new);
    		if(this.collectionCNindex!="" && collection.length>1){
		    	for (i=0;i<collection.length;){
		    		if (collection.item(i).CN.toUpperCase().indexOf(this.collectionCNindex) == -1){
		    			collection.remove(i);
		    		}else{
		    			i++;
		    		}
		    	}
	    	}	    	
	    	if(collection.length>1){
	    		certificate = collection.userChoose();
	    	}else if (collection.length == 1){
		    	certificate = collection.item(0);
	    	}else{
	    		return false;
	    	}
	    	
	    	return certificate.sign(content, parseInt(512) + parseInt(0) + parseInt(0));
	    	
    	}catch(err) {
    		return false;
    	}
    	
    }
    
    this.certInfo = function (dn) {
    	if(dn==""){
    		return false;
    	}
    	try {
	    	keychain = this.getObj().keychain(); 
	    	var dn_new = dn.replace(/\s/g,'');
	    	dn_new = dn_new.replace(/=/g,':"');
			dn_new = "{"+dn_new.replace(/,/g,'",')+'"}';
		    dn_new=eval("("+dn_new+")");    	
	    	collection = keychain.query(dn_new);
    		if(this.collectionCNindex!="" && collection.length>1){
		    	for (i=0;i<collection.length;){
		    		if (collection.item(i).CN.toUpperCase().indexOf(this.collectionCNindex) == -1){
		    			collection.remove(i);
		    		}else{
		    			i++;
		    		}
		    	}
	    	}	    	
	    	if(collection.length>1){
	    		certificate = collection.userChoose();
	    	}else if (collection.length == 1){
		    	certificate = collection.item(0);
	    	}else{
	    		return false;
	    	}
	    	return certificate.CN ;
    	}catch(err) {
    		return false;
    	}   	
    	
    }
    
    this.getObj = function () { return document.getElementById(id); };
    this.getVersion = function () { return this.env.ie ? this.getObj().version : navigator.plugins['SignMessenger'].description; };

}

var sm = new Messenger('sm0');//初始化签名控件