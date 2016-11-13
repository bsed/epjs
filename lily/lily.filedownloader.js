/**
 * jQuery file uploader - v1.0
 * 
 */  


$.extend({
    createDownloadIframe: function(id, uri) {
		//create frame
        var frameId = 'jDownloadFrame' + id;
        var iframeHtml = '<iframe id="' + frameId + '" name="' + frameId + '" style="position:absolute; top:-9999px; left:-9999px"';
		if(window.ActiveXObject) {
            if(typeof uri== 'boolean') {
				iframeHtml += ' src="' + 'javascript:false' + '"';
            }
            else if(typeof uri== 'string') {
				iframeHtml += ' src="' + uri + '"';
            }
		}
		iframeHtml += ' />';
		$(iframeHtml).appendTo(document.body);
        return $('#' + frameId).get(0);
    },
    
    createDownloadForm: function(id, data) {
		//create form	
		var formId = 'jDownloadForm' + id;
		var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '"></form>');	
		if(data) {
			for(var i in data) {
				$('<input type="hidden" name="' + i + '" value="' + data[i] + '" />').appendTo(form);
			}			
		}		
		//set attributes
		$(form).css('position', 'absolute');
		$(form).css('top', '-1200px');
		$(form).css('left', '-1200px');
		$(form).appendTo('body');		
		return form;
    },

    ajaxFileDownload: function(s) {
        s = $.extend({}, $.ajaxSettings, s);
        var id = new Date().getTime()        
		var form = $.createDownloadForm(id, (typeof(s.data)=='undefined'?false:s.data));
		var io = $.createDownloadIframe(id, s.secureuri);
		var frameId = 'jDownloadFrame' + id;
		var formId = 'jDownloadForm' + id;		      
        var requestDone = false;
        // Create the request object
        var xml = {}   
        // Wait for a response to come back
        var downloadCallback = function(isTimeout) {
            if ( isTimeout == "timeout") {	
                requestDone = true;
                $(io).unbind()

                setTimeout(function() {	
                	try {
                		$(io).remove();
                		$(form).remove();	
					} 
                	catch(e) {
                		$.handleError(s, xml, null, e);
                	}									
                }, 100);
                xml = null;
            }
        }
        
        // Timeout checker
        setTimeout(function() {
            if( !requestDone ) downloadCallback( "timeout" );
        }, 600000);
        
        try {
			var form = $('#' + formId);
			$(form).attr('action', s.url);
			$(form).attr('method', 'POST');
			$(form).attr('target', frameId);
            $(form).submit();
        } 
        catch(e) {			
            $.handleError(s, xml, null, e);
        }
    },

    handleError: function(s, xml, status) {
    }
})
