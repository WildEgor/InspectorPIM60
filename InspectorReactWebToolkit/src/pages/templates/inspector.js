// Helper library for inspector communication
// Provided by Sick IVP, 2013
// Version 1.0

function Inspector(ip) {

    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.slice(0, str.length) == str;
        };
    }

// PRIVATE:
    $.support.cors = true;
    var obj = this;
    obj.async = true;
    obj.cameraip = typeof ip !== 'undefined' ? ip : "";
    obj.enableLogging = false;
    
    // Handle that console might not exist
    if ( ! window.console ) console = { log: function(){} };

    /*
    *    Parse response data from ajax call and generate a response object.
    *    The various commands return data in different ways,
    *    so we need to take that into account when parsing the data
    */
    function parseCmdChannelResponse(responseString) {
        
        // remove junk characters preceding the actual message
        var begin = responseString.indexOf("r");    
        var end   = responseString.length-1;
        
        var responseArray = responseString.substr(begin, end - begin).split(" ");
        var responseObject = {
            message : ""
        };
        
        // first element is always the type of the message
        responseObject.type = responseArray.splice(0,1);
        
        if(responseObject.type == "rgVER") {
        
            responseObject.errorCode = responseArray[0];
            responseObject.protocolVersion = responseArray[1];                              
            
        } else if(responseObject.type == "rgRES") {
            responseObject.errorCode = responseArray[0];
            responseObject.message = responseString.slice(begin+8,end); // 'rgRES 0 ' 8 characters
        } else if (responseObject.type == "rgSTAT") {
            if(responseArray[0] == ""){ // Response OK
                // Special handling because of the formatting of the statistics response.
                var stop = responseArray[1].indexOf("<");
                responseObject.errorCode = responseArray[1].slice(0, stop);
            } else {
                responseObject.errorCode = responseArray[0]; // Error occured
            }
            responseObject.message = responseString.slice(begin+9,end); // 'rgSTAT 0 ' 9 characters
        } else {
        
            // for INT, STR and ACT, the second element is the identifier
            if(responseObject.type == "rsINT" || 
               responseObject.type == "rgINT" ||
               responseObject.type == "raACT" ||
               responseObject.type == "rgSTR") {
                responseObject.identifier = parseInt(responseArray.splice(0,1));
            }
            
            // next element is always the error code
            responseObject.errorCode = parseInt(responseArray.splice(0,1));
            
            // the rest is either an error message or valid return data
            if(responseObject.errorCode) {
                responseObject.message = responseArray.join(" ");
            } else {
                if(responseObject.type == "rgMOD") {
                    responseObject.mode = parseInt(responseArray[0]);
                } else if(responseObject.type == "rgSTR") {
                    responseObject.value = responseArray.join(" ");
                } else {
                    responseObject.values = [];
                    for(var i=0; i<responseArray.length; i++) {
                        responseObject.values[i] = parseInt(responseArray[i]);
                    }
                }
            }
        }
        
        return responseObject;
    }
    
    /*
    *    Send an ajax request to the Web API, calling the user specified callback upon completion
    */
    function sendRequest(request, resultParser, callback) {
    
        var dfd = new jQuery.Deferred();

        // Should not be needed but for some reason cameraip is undefined here sometimes????
        obj.cameraip = typeof obj.cameraip !== 'undefined' ? obj.cameraip : "";
        
        // Add 'http://' to camera address if missing
        var camera = obj.cameraip;
        if (camera != "" && !(camera.startsWith ("http://"))) {
            camera = "http://" + camera;
        }

        var requestURL = camera + "/" + request;
        
        if ( obj.enableLogging ) { 
            console.log(requestURL); 
        }
        
        $.ajax({
            url: requestURL,
            
            dataType: "html",
            
            async: obj.async,
            
            success: function(data, textStatus, jqXHR) {
                if(jqXHR.status == 200) {
                    var result = resultParser(data);
                    result.httpStatus = jqXHR.status;
                        
                    // Run callback if defined
                    if (callback && $.isFunction(callback)) callback(result);

                    // handle protocol violation
                    if(result.errorCode != 0) { dfd.reject(result); } // Protocol Violation! 
                    else { dfd.resolve(result); }
                } else {
                    console.log("AJAX Request Failed!" + "    http status: " + jqXHR.status);
                    
                    if (callback) callback({httpStatus : jqXHR.status, httpMessage : textStatus});
                    dfd.reject(result); // AJAX Request Failed!
                }
            },
            
            error: function(jqXHR, textStatus, errorThrown) {
                // Handle HTTP error
                console.log("AJAX Request Failed!"
                  + "    http status: " + jqXHR.status
                  + "    textStatius: " + textStatus
                  + "    exception:   " + errorThrown);
                
                if (callback) callback({httpStatus : jqXHR.status, httpMessage : textStatus});
                dfd.reject("AJAX Request Failed!");
            }
        });

        return dfd;
    }
    
    function sendCommand(command, callback) {
        return sendRequest("CmdChannel?" + command, parseCmdChannelResponse, callback);
    }
        
// PUBLIC:

    /*
    *    get version of the Web API
    *    \callback     will be called with a response object as parameter when the API call completes.
    */
    obj.getVersion = function(callback) { 
        return sendCommand("gVER", callback);
    };
    
    /*
    *    Get camera Mode
    *    \callback     will be called with a response object as parameter when the API call completes.
    *
    *    if successful we have the mode in response.mode
    */
    obj.getMode = function(callback) { 
        return sendCommand("gMOD", callback);
    };
    
    /*
    *    Set camera Mode
    *    \mode        mode to set
    *    \callback     will be called with a response object as parameter when the API call completes.
    */
    obj.setMode = function(mode, callback) { 
        return sendCommand("sMOD_" + mode, callback); 
    };
    
    /*
    *    Get integer value
    *    \identifier        Integer identifier, specifies what integer to get from the camera (see Reference Manual)
    *    \arg            command parameter relevant for given identifier
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.getInt = function(identifier, arg, callback) {
        var args = Array.prototype.slice.call(arguments);
        return sendCommand("gINT_" + args.slice(0, -1).join("_"), args[args.length-1]);
    };
    
    /*
    *    Get string value
    *    \identifier        String identifier, specifies what string to get from the camera (see Reference Manual)
    *    \arg            command parameter relevant for given identifier
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.getString = function(identifier, args, callback) {
        var args = Array.prototype.slice.call(arguments);
        return sendCommand("gSTR_" + args.slice(0, -1).join("_"), args[args.length-1]);
    };
    
    /*
    *    Set integer value(s)
    *    \identifier        Command identifier, specifies what integer to set in the camera (see Reference Manual)
    *    \args            one or more integer values to set
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.setInt = function(identifier, args, callback) { 
        var args = Array.prototype.slice.call(arguments);
        return sendCommand("sINT_" + args.slice(0, -1).join("_"), args[args.length-1]);
    };
    
    /*
    *    Perform an action
    *    \identifier        Action identifier (See reference manual)
    *    \args            (optional) zero or more parameters to the action 
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.performAction = function(identifier, args, callback) { 
        var args = Array.prototype.slice.call(arguments);
        return sendCommand("aACT_" + args.slice(0, -1).join("_"), args[args.length-1]);
    };
        
    /*
    *    Trig the camera
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.trig = function(callback) { 
        return sendCommand("TRIG", callback);
    };
    
    /*
    *    Lock the log function of the camera, necessary to get logged images.
    */
    obj.lockLog = function (callback){
        return sendRequest("LockLog", function(){return {};}, callback);
    };

    /*
    *    Unlock the log function of the camera, necessary to enable logging.
    */
    obj.unlockLog = function (callback){
        return sendRequest("LockLog?Unlock", function(){return {};}, callback);
    };
    
    /*
    *    Get result string
    *    \callback         will be called with a response object as parameter when the API call completes.
    */
    obj.getResult = function(callback) { 
        return sendCommand("gRES", callback);
    };
    
    /*
    *    Get statistics
    *    \callback        will be called with a response object as parameter when the API call completes.
    */
    obj.getStatistics = function(callback) { 
        return sendCommand("gSTAT", callback);
    };


    return obj;
}