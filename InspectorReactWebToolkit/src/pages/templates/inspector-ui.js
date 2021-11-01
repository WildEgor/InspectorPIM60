// Helper library for Inspector Web User Interface
// Provided by SICK IVP, 2013
// Version 2.0

;var InspectorUI = new function() {

    var obj = this;
    
    // If the Date.now function is not defined (IE8)
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }
    
    // If Object.freeze function is not defined (IE7-8, FF-4)
    if (typeof Object.freeze !== 'function') {
        Object.freeze = function(obj) { return obj; };
    }

    // PRIVATE:
    function defaultFor(arg, val) { return typeof arg !== 'undefined' ? arg : val; }

    function getCameraURL(ip) { return (typeof ip !== 'undefined' && ip != "") ? "http://" + ip : ""; }

    function applyPending(element) {
        var that = $(element);
        // If no overlay is available add it in
        if (that.has(".overlay").length === 0){
            that.append($("<div>").addClass("overlay").hide());
            
            // Both relative and absolute are ok
            if(that.css("position") != "absolute") {
                that.css("position", "relative");
            }
        }

        that.addClass("pending");
        $(".overlay", element).fadeIn("fast");
    }

    function removePending(element) {
        $(element).removeClass("pending");
        $(".overlay", element).fadeOut("fast");
    }

    function defaultForOverlay(arg, val) {
        if (typeof arg == 'undefined') {
            return val;
        } else {
            return OverlayEnum.hasOwnProperty(arg) ? arg : val;
        }
    }
    
    function getKeys(obj) {
        var keys = [];
        for(k in obj) {
            if(k) {
                keys.push(k);
            }
        }
        return keys;
    }
    
    // Returns an single object {key: <name of key>, value: <value>}
    // If obj has more than one key only the first will be returned
    function getKeyWithValue(obj) {
        for(k in obj) {
            if(k) {
                return {"key":k, "value": obj[k]};
            }
        }
    }
    
    // Returns an array with {key: <name of key>, value: <value>}
    function getAllKeyWithValue(obj) {
        var keys = [];
        for(k in obj) {
            if(k){
                keys.push({"key": k, "value": obj[k]});
            }
        }
        return keys;
    }
    
    function inEditMode(device) {
        return device.runMode == 1;
    };
    


    /* CONSTANS AND ENUMS */
    /**********************/
    var OverlayEnum = Object.freeze({
        hide : "HideOverlay",
        show : "ShowOverlay",
        simple : "SimplifiedOverlay"
    });

    var WebConstants = Object.freeze({
        DEFAULT_REFRESH : 700
    });

    /** A lot of commands are missing **/
    // Command Enum/identifiers
    var CE = Object.freeze({
        /** Action identifiers **/
        SAVE_TO_FLASH : 1,
        RETEACH_REF_OBJ : 2,
        PERFORM_CALIBRATION : 3,
        REMOVE_CALIBRATION : 4,
        APPLY_IP_SETTINGS : 5,
        REBOOT_DEVICE : 6,
        PERFORM_ALIGNMENT : 7,

        /** String identifiers **/
        GET_NAME_DEVICE : 1,
        GET_NAME_REF_OBJ : 2,
        GET_NAME_OBJ_LOC : 3,
        GET_NAME_PIXEL : 4,
        GET_NAME_EDGE_PIXEL : 5,
        GET_NAME_PATTERN : 6,
        GET_NAME_BLOB : 7,
        GET_NAME_POLYGON : 8,
        GET_NAME_EDGE_LOCATOR : 9,
        GET_NAME_CIRCLE_LOCATOR : 10,
        GET_NAME_DISTANCE : 11,
        GET_NAME_ANGLE : 12,
        GET_NAME_ECP : 13,
        GET_NAME_ALL : 14,

        /** sINT and gINT identifiers **/
        REF_OBJ : 1,
        GET_NO_REF_OBJ : 2,

        // Image 
        EXPOSURE : 14,
        GAIN : 15,
        TRIG_MODE : 16,
        CALIBRATION_MODE : 20,

        // Object locator
        OBJ_LOC_MATCH_THRESHOLD : 32,
        OBJ_LOC_ROTATION_MODE : 33,
        OBJ_LOC_ROTATION_SEARCH : 34,
        OBJ_LOC_SCALED_SEARCH : 35,
        OBJ_LOC_ROBUSTNESS : 36,
        OBJ_LOC_ACCURACY : 37,
        OBJ_LOC_MOVE_ROTATE : 38,

        // Blob 
        BLOB_INTENSITY_THRESHOLD : 48,
        BLOB_AREA_THRESHOLD : 49,
        BLOB_ANGLE_THRESHOLD : 50,
        BLOB_STRUCTURE_THRESHOLD : 53,
        BLOB_EDGE_STRENGTH : 54,
        BLOB_AMBIENT_LIGHT : 55,
        BLOB_SERACH_METHOD : 56,
        BLOB_MOVE_ROTATE : 58,
        BLOB_NO_BLOB_THRESHOLD : 59,

        // Polygon
        POLYGON_POSITION_TOLERANCE : 64,
        POLYGON_FLEXIBILITY_TOLERANCE : 65,
        POLYGON_SCORE_THRESHOLD : 66,
        POLYGON_MARGIN : 67,
        POLYGON_DEFECT_DETECTION_WIDTH : 68,
        POLYGON_DEFECT_INTENSITY_THESHOLD : 69,
        POLYGON_MAX_DEFECTS_THRESHOLD : 70,
        POLYGON_DEFECT_DETECTION_MODE : 71,
        POLYGON_MOVE_ROTATE : 72,
        POLYGON_MOVE_CORNER : 73,

        // Pixel counter
        PIXEL_INTENSITY_THRESHOLD : 80,
        PIXEL_NO_PIXELS_THRESHOLD : 81,


        // Edge pixel counter
        EDGE_PIXEL_EDGE_STRENGTH : 82,
        EDGE_PIXEL_NO_PIXELS_THRESHOLD: 83,

        // Pattern
        PATTERN_POSITION_TOLERANCE : 84,
        PATTERN_SCORE_THRESHOLD : 85,

        // Move and rotate inspections
        INSPECTION_MOVE_ROTATE : 86,

        // Device settings
        INTERFACE_PERMISSION : 112,
        IP_ADDRESS : 120,
        NETMASK : 121,
        GATEWAY : 122,

        // Edge locator
        EDGE_LOC_EDGE_CONTRAST : 150,
        EDGE_LOC_LINE_FIT_CRITERIA : 151,
        EDGE_LOC_POLARITY : 152,
        EDGE_LOC_SCORE_THRESHOLD : 153,

        // Circle locator
        CIRCLE_LOC_EDGE_CONTRAST: 160,
        CIRCLE_LOC_DIAMETER_THRESHOLD: 161,
        CIRCLE_LOC_LINE_FIT_CRITERIA: 162,
        CIRCLE_LOC_POLARITY: 163,
        CIRCLE_LOC_ROBUSTNESS: 164,
        CIRCLE_LOC_SCORE_THRESHOLD: 165,
        CIRCLE_LOC_QUALITY: 166,
        CIRCLE_LOC_DIAMETER_OFFSET: 167,
        CIRCLE_LOC_DIAMETER_THRESHOLD: 169,

        // Distance
        DISTANCE_THRESHOLD : 170,
        DISTANCE_OFFSET : 173,

        // Angle
        ANGLE_THRESHOLD : 180,
        ANGLE_OFFSET : 181

    });


    /* DEFAULT CONTROL VALUES */
    /**************************/
    // The default 'default seetings' are tool: -1, min: 0, max: 100, range: false, multiplier: 1, unit: undefined

    var defaultSettings = new Array();

    // Image settings
    defaultSettings[CE.EXPOSURE] = { type: 'slider', min: 0.1, max: 100, multiplier: 100 };
    defaultSettings[CE.GAIN] = { type: 'slider', min: 100, max: 400 };
    defaultSettings[CE.TRIG_MODE] = { type: 'radio', labels: ['Free-running', 'Triggered'] };

    // Object locator
    defaultSettings[CE.OBJ_LOC_MATCH_THRESHOLD] = { type: 'slider' };
    defaultSettings[CE.OBJ_LOC_ROTATION_MODE] = { type: 'check' };
    defaultSettings[CE.OBJ_LOC_ROTATION_SEARCH] = { type: 'slider', min: 0, max: 180, range: 'min' };
    defaultSettings[CE.OBJ_LOC_SCALED_SEARCH] = { type: 'check' };
    defaultSettings[CE.OBJ_LOC_ROBUSTNESS] = { type: 'radio', labels: ['High robustness', 'Normal', 'High speed'] };
    defaultSettings[CE.OBJ_LOC_ACCURACY] = { type: 'radio', labels: ['High accuracy', 'Normal', 'High speed'] };

    // Blob
    defaultSettings[CE.BLOB_INTENSITY_THRESHOLD] = { type: 'slider', min: 0, max: 255, range: true };
    defaultSettings[CE.BLOB_AREA_THRESHOLD] = { type: 'slider', min: 10, max: 307200, range: true };

    // TODO: Get and set max here
    // defaultSettings[CE.BLOB_ANGLE_THRESHOLD] : ... Has two values to adjust

    defaultSettings[CE.BLOB_STRUCTURE_THRESHOLD] = { type: 'slider', min: 0, max: 100000, range: true };
    defaultSettings[CE.BLOB_EDGE_STRENGTH] = { type: 'slider', min: 0, max: 100, range: 'max' };
    defaultSettings[CE.BLOB_AMBIENT_LIGHT] = { type: 'check' };
    defaultSettings[CE.BLOB_SERACH_METHOD] = { type: 'radio', labels: ['High quality', 'Normal', 'High speed'] };
    defaultSettings[CE.BLOB_NO_BLOB_THRESHOLD] = { type: 'slider', min: 0, max: 16, range: true };

    // Polygon
    defaultSettings[CE.POLYGON_POSITION_TOLERANCE] = { type: 'slider', min: 1, max: 400 };
    defaultSettings[CE.POLYGON_FLEXIBILITY_TOLERANCE] = { type: 'slider', min: 0, max: 100 };
    defaultSettings[CE.POLYGON_SCORE_THRESHOLD] = { type: 'slider', min: 0, max: 100 };
    defaultSettings[CE.POLYGON_MARGIN] = { type: 'slider', min: 0, max: 20  };
    defaultSettings[CE.POLYGON_DEFECT_DETECTION_WIDTH] = { type: 'slider', min: 0, max: 100 };
    defaultSettings[CE.POLYGON_DEFECT_INTENSITY_THESHOLD] = { type: 'slider', min: 0, max: 255, range: true };
    defaultSettings[CE.POLYGON_MAX_DEFECTS_THRESHOLD] = { type: 'slider', min: 0, max: 100 };
    defaultSettings[CE.POLYGON_DEFECT_DETECTION_MODE] = { type: 'check' };

    // Pixel Counter
    defaultSettings[CE.PIXEL_INTENSITY_THRESHOLD] = { type: 'slider', min: 0, max: 255, range: true };
    defaultSettings[CE.PIXEL_NO_PIXELS_THRESHOLD] = { type: 'slider', min: 0, max: 'dynamic', range: true };

    // Edge pixel counter
    defaultSettings[CE.EDGE_PIXEL_EDGE_STRENGTH] = { type: 'slider' };
    defaultSettings[CE.EDGE_PIXEL_NO_PIXELS_THRESHOLD] = { type: 'slider', min: 0, max: 'dynamic', range: true };

    // Pattern
    defaultSettings[CE.PATTERN_POSITION_TOLERANCE] = { type: 'slider', min: 0, max: 4 };
    defaultSettings[CE.PATTERN_SCORE_THRESHOLD] = { type: 'slider' };

    // Edge locator
    defaultSettings[CE.EDGE_LOC_EDGE_CONTRAST] = { type: 'slider' };
    defaultSettings[CE.EDGE_LOC_LINE_FIT_CRITERIA] = { type: 'radio', labels: ['Strongest', 'First', 'Last'] };
    defaultSettings[CE.EDGE_LOC_POLARITY] = { type: 'radio', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    defaultSettings[CE.EDGE_LOC_SCORE_THRESHOLD] = { type: 'slider' };

    // Circle locator
    defaultSettings[CE.CIRCLE_LOC_EDGE_CONTRAST] = { type: 'slider' };
    defaultSettings[CE.CIRCLE_LOC_DIAMETER_THRESHOLD] = { type: 'slider', min: 0, max: 500, range: true, unit: 0 };
    defaultSettings[CE.CIRCLE_LOC_LINE_FIT_CRITERIA] = { type: 'radio', labels: ['Strongest', 'Smallest', 'Largest'] };
    defaultSettings[CE.CIRCLE_LOC_POLARITY] = { type: 'radio', labels: ['Any', 'Bright to Dark', 'Dark to Bright'] };
    defaultSettings[CE.CIRCLE_LOC_ROBUSTNESS] = { type: 'slider', min: 0, max: 4 };
    defaultSettings[CE.CIRCLE_LOC_SCORE_THRESHOLD] = { type: 'slider' };
    defaultSettings[CE.CIRCLE_LOC_QUALITY] = { type: 'slider', min: 0, max: 6 };
    defaultSettings[CE.CIRCLE_LOC_DIAMETER_OFFSET] = { type: 'slider', min: -1000, max: 1000, range: false, multiplier: 1000, unit: 0 };
    defaultSettings[CE.CIRCLE_LOC_DIAMETER_THRESHOLD] = { type: 'slider', min: 0, max: 640, range: true, multiplier: 1000, unit: 0 };

    // Distance
    defaultSettings[CE.DISTANCE_THRESHOLD] = { type: 'slider', min: 0, max: 640 * 480, range: true, multiplier: 1000, unit: 0 };
    defaultSettings[CE.DISTANCE_OFFSET] = { type: 'slider', min: -1000, max: 1000, range: false, multiplier: 1000, unit: 0 };

    // Angle
    defaultSettings[CE.ANGLE_THRESHOLD] = { type: 'slider', min: 0, max: 180, range: true, multiplier: 1000 };
    defaultSettings[CE.ANGLE_OFFSET] = { type: 'slider', min: -1000, max: 1000, range: false, multiplier: 1000 };

    /**************************/




    // Default Inspector communication framework with default settings
    var inspector = new Inspector();
    
    // List of Inspector objects used to control multiple Inspectors. 
    // Before every Inspector.js call, select the correct device to send the request to
    var devices = [];
    
    // Returns Inspector object by IP,
    function getDevice(deviceip){
        try {
            if(devices.length == 0 || deviceip == undefined){
                return inspector;
            }

            for(var i = 0; i < devices.length; ++i) {
                if(devices[i].cameraip == deviceip) {
                    return devices[i];
                }
            }
            
            // If device was not found, throw error            
            throw {
                name: "Inspector object error",
                message: "An Inspector with the specified IP has not been defined.",
                toString: function(){return this.name + ": " + this.message} 
            }
        } catch (e) {
            console.error(e.toString());
            return null;
        }
    }

    // Dialog class used to provide feedback to the user on error or pending operations
    var dialog = new function(){
        var dialogDiv = $("<div id='dialog' title='Please wait...'>").hide();
        var progressLabel = $("<div class='progress-label'>").text("An action is running...");
        var progressDiv = $("<div id='progressbar'>");

        // Initialize the dialog class
        this.init = function()
        {
            progressDiv.append(progressLabel);
            dialogDiv.append(progressDiv);
            $(document).append(dialogDiv);
            dialogDiv.dialog(
            {
                modal:true,
                autoOpen: false,
                dialogClass: "no-close"
            });
            dialogDiv.show();
            // progressDiv.progressbar({
            //  value: false,
            //  complete: function() {
            //      progressLabel.text( "Complete!" );
            //  }
            // });
        };

        // Disable the entire HMI while waiting for an operation to complete
        this.show = function(text) {
            this.hide();
            progressLabel.html(text);
            dialogDiv.dialog( "option", "buttons", [ ] );
            dialogDiv.dialog( "open" );
        };

        // Show a message box to the user with an OK button and disable the HMI
        this.alert = function(text) {
            this.hide();
            progressLabel.html(text);
            dialogDiv.dialog( "option", "buttons", [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ] );
            dialogDiv.dialog( "open" );
        };

        // Close the message box and enable the HMI
        this.hide = function() {
            dialogDiv.dialog("close");
        };
    };
    
    /*         WIDGETS        */
    /**************************/

    (function($) {
    $.widget("hmi.radio", $.ui.buttonset, {
        options: {
            cameraip: "",
            id: 0,
            tool: -1,
            labels: []
        },

        _create: function() {
            var o = this.options;
            // Set the default tool index to 0 for parameters with id > 40
            if (o.tool == -1 && o.id > 40) { o.tool = 0; }

            // Parameters with id < 40 do not have a tool index.
            if (o.id <= 40) { o.tool = -1; }

            // Prepend tool index to request string
            this._urlPrefix = ((o.tool != -1) ? o.tool + "_" : "");

            // Create an unique id for the radio button group
            this.element.uniqueId();
            this._groupname = this.element.attr("id");

            // Create error box
            this._errormsg = $("<p>").addClass("errormsg");
            this.element.append(this._errormsg);

            this._super();
        },

        _init: function() {
            var that = this;

            that.element.empty();

            $(that.options.labels).each(function(index, element){
                opt = $("<input type='radio'>").attr('value', index).attr('name', that._groupname).uniqueId();
                label = $("<label>").attr('for', opt.attr('id')).text(element);
                that.element.append(opt);
                that.element.append(label);
            });

            this._super();
            this.disable();

            // The buttonset widget does not have a change event. We simulate it here.
            $("#" + this._groupname + " input[type=radio]").change(function(){ that._change(); });

            getDevice(this.options.cameraip).getInt(this.options.id, this._urlPrefix, function(result){
                if (result.errorCode == 0)
                {
                    that.element.children(":radio[value=" + result.values[0] + "]").attr("checked", "checked");
                    that.refresh();
                    that.enable();
                    that._errormsg.text("");
                } else {
                    that.disable();
                    that._errormsg.text(result.message);
                }
            });
        },

        _destroy: function() {
            this.element.buttonset( "destroy" );
            this.element.empty();
            this._super();
        },

        _change: function() {
            var that = this;
            this.element.addClass("pending");
            this.disable();
            var val = that.element.children(":radio:checked").attr('value');
            getDevice(this.options.cameraip).setInt(that.options.id, this._urlPrefix, val, function(){
                that.enable();
                that.element.removeClass("pending");
                $(InspectorUI).trigger('parameterChange', [that.options.id, val, that.options.cameraip]); 
            });
        }
    });

    $.widget("hmi.checkbox", {
        options: {
            cameraip: "",
            id: 0,
            tool: -1
        },

        _create: function() {
            var that = this;

            // Parameters with id < 40 do not have a tool index.
            // Set the default tool index to 0 for parameters with id > 40
            if (this.options.id > 40) { that.options.tool = 0; }

            // Prepend tool index to request string
            var urlPrefix = ((that.options.tool != -1) ? that.options.tool + "_" : "");

            var cb = $("<input type='checkbox'>").uniqueId();
            var label = $("<label>").attr('for', cb.attr('id'));

            that.element.append(label);
            that.element.prepend(cb);

            that.element.addClass("checkbox");
            cb.attr("disabled", true); 

            cb.click(function( event ) {
                that.element.addClass("pending");
                cb.attr("disabled", true);

                getDevice(that.options.cameraip).setInt(that.options.id, urlPrefix + (cb[0].checked ? 1 : 0), function(){
                    cb.removeAttr("disabled");
                    that.element.removeClass("pending");
                    $(InspectorUI).trigger('parameterChange', [that.options.id, (cb[0].checked ? 1 : 0), that.options.cameraip]); 
                });
            });

            getDevice(this.options.cameraip).getInt(this.options.id, urlPrefix, function(result){
                if (result.errorCode == 0 && result.values.length == 2){
                    cb.prop("checked", (result.values[0]==1));
                    cb.removeAttr("disabled");
                } else {
                    that.element.append($("<p>").text(result.message));
                }
            });
        },

        _destroy: function() {
            that.element.empty();
        }
    });

    $.widget("hmi.slidertext", $.ui.slider, {
        options: {
            id: 0,
            tool: -1, 
            min: 0,
            max: 100,
            range: false,
            multiplier: 1, 
            unit: undefined,
            cameraip: ""
        },

        _setOption: function (key, value) {
            this._super(key, value);
        },

        _create: function() {
            var that = this;

            // Set the default tool index to 0 for parameters with id > 40
            if (that.options.tool == -1 && that.options.id > 40) { that.options.tool = 0; }

            // Parameters with id < 40 do not have a tool index.
            if (that.options.id <= 40) { that.options.tool = -1; }

            this._useIndex = (that.options.tool != -1);
            this._useUnit = that.options.unit !== undefined;
            
            this._decimals = (this.options.multiplier > 10 ? 1 : 0);
            this.options.step = (this.options.multiplier > 10 ? 0.1 : 1);

            // Create error box
            this._errormsg = $("<p>").addClass("errormsg");

            // Create textboxes
            this._textinputLow = $("<input/>").addClass("ui-slider-input ui-input-text ui-corner-all ui-shadow-inset ui-rangeslider-first");
            this._textinputHigh = $("<input/>").addClass("ui-slider-input ui-input-text ui-corner-all ui-shadow-inset ui-rangeslider-last");

            if (that.options.range == true){
                this._textinputHigh.change(function() {
                    that.values([that.values(0), parseInt(this.value)]);
                    that._stop(null, 1); // Call stop to send value 
                });

                this._textinputLow.change(function() {
                    that.values([parseInt(this.value), that.values(1)]);
                    that._stop(null, 0); // Call stop to send value 
                });
                that.element.addClass("ui-rangeslider");
            } else {
                this._textinputHigh.hide();

                this._textinputLow.change(function() {
                    that.value(parseFloat(this.value));
                    that._stop(null, 0);
                });
            }

            if(that.options.max == 'dynamic') {
                getDevice(that.options.cameraip).async = false;
                getDevice(that.options.cameraip).getInt(87, that.options.tool, function(result){
                    if (result.errorCode == 0 && result.values.length == 2)
                    {
                        that.options.max = result.values[0];
                    }
                });
                getDevice(that.options.cameraip).async = true;
            }

            that._super();

            // Insert into DOM
            this.element.before(this._textinputLow);
            this.element.before(this._textinputHigh);
            this.element.append(this._errormsg);
            this.disable();
        },

        _init: function() {
            this._super();

            var that = this;
            var reqStr2 = "";

            if(this._useIndex && this._useUnit) {   reqStr2 = this.options.tool + "_" + this.options.unit;  }
            else if(this._useUnit)              {   reqStr2 = this.options.unit;                            }
            else if (this._useIndex)            {   reqStr2 = this.options.tool;                            }

            getDevice(this.options.cameraip).getInt(this.options.id, reqStr2, function(result){
                if (result.errorCode == 0) {
                    if(result.values.length == 2){
                        that.value(result.values[0]/that.options.multiplier);
                    } else if (result.values.length == 3) {
                        that.values([result.values[0]/that.options.multiplier, result.values[1]/that.options.multiplier]);
                    }
                    that.enable();
                    that._errormsg.text("");
                } else {
                    that.disable();
                    that._errormsg.text(result.message);
                }
            });
        },

        // Use change and not slide here so that the values of the textboxes can be updated without sending the value
        _change: function( event, index) {
            this._superApply(arguments);
            if (this.options.range == true){
                this._textinputLow.val((this.values()[0]).toFixed(this._decimals));
                this._textinputHigh.val((this.values()[1]).toFixed(this._decimals));
            } else {
                this._textinputLow.val(this.value().toFixed(this._decimals));
            }
        },

        _stop: function( event, index ) {
            var that = this;
            this._superApply(arguments);

            this.element.addClass("pending");
            this.disable();

            // Assemble request string
            var reqStr = "";
            if(this._useIndex){
                reqStr = that.options.tool + "_";
            }

            if (this.options.range == true){
                reqStr += (this.values()[0]*that.options.multiplier).toFixed(0) + "_" + this.values()[1]*that.options.multiplier;
            } else {
                reqStr += (this.value()*that.options.multiplier).toFixed(0);
            }

            if (this._useUnit) {
                reqStr += "_" + this.options.unit;
            }

            getDevice(this.options.cameraip).setInt(this.options.id, reqStr, function(){
                that.enable();
                that.element.removeClass("pending");
                $(InspectorUI).trigger('parameterChange', [that.options.id, (that.options.range ? that.values() : that.value()), that.options.cameraip]); 
            });
        },

        _destroy: function() {
            this.element.prev('input.ui-rangeslider-last').remove();
            this.element.prev('input.ui-rangeslider-first').remove();
            $.remove(this._errormsg);
            this._super();
            this.element.empty();
        },

        disable: function() {
            this._super();
            this._textinputLow.attr("disabled", "disabled"); 
            this._textinputHigh.attr("disabled", "disabled");
        },

        enable: function() {
            this._super();
            this._textinputLow.removeAttr("disabled");
            this._textinputHigh.removeAttr("disabled");
        }
    });

    $.widget("hmi.refimage", {
        options: {
            toolregion: [],
            cameraip: ""
        },

        crossOffset: 9,
        imagepath: "/ActiveReferenceImage.jpg?no-cache=",

        _setOption: function (key, value) {
            this._super(key, value);
        },

        _create: function() {
            var that = this;
            this._super();
            var o = this.options;
            
            // Add 'http://' to cameraip address if missing
            if (o.cameraip != "" && !(o.cameraip.startsWith("http://")) ){
                this._cameraip = "http://" + o.cameraip;
            } else {
                this._cameraip = "";
            }

            this._movableRegions = o.toolregion.length > 0 && o.index == -1;

            if (this._movableRegions){
                // TODO: Get this from image
                var tmp_width = 640;
                // canvas.height = 480;

                this.element.load(function(){
                    var checkVisible = setInterval(function(){
                        if(!that.element.is(':visible')) return;
                        clearInterval(checkVisible);

                        that._scale = tmp_width / that.element.width();
                        that._updateRegions();
                    }, 1000);
                    
                });

                // Set canvas size to match image
                this.element.css("margin", 0);
                var parentDiv = $("<div>").addClass("hmi-refimageWrapper").css("position", "relative");
                this.element.wrap(parentDiv);

                this._scale = tmp_width / this.element.width();

                this._regions = new Array();
                for (var i = 0; i < o.toolregion.length; i++){
                    var t = o.toolregion[i];
                    if (t.tool == CE.OBJ_LOC_MOVE_ROTATE || t.id == CE.OBJ_LOC_MOVE_ROTATE){
                        that._regions[i] = { gUrl: CE.OBJ_LOC_MOVE_ROTATE, sUrl: CE.OBJ_LOC_MOVE_ROTATE };
                    } else if (t.id == CE.BLOB_MOVE_ROTATE) {
                        that._regions[i] = { gUrl: "" + CE.BLOB_MOVE_ROTATE + "_" + t.tool, sUrl: "" + CE.BLOB_MOVE_ROTATE + "_" + t.tool };
                    } else if (t.id == CE.POLYGON_MOVE_ROTATE) {
                        that._regions[i] = { gUrl: "" + CE.INSPECTION_MOVE_ROTATE + "_" + t.tool, sUrl: "" + CE.POLYGON_MOVE_ROTATE + "_" + t.tool };
                    } else if (t.id == CE.INSPECTION_MOVE_ROTATE) {
                        that._regions[i] = { gUrl: "" + CE.INSPECTION_MOVE_ROTATE + "_" + t.tool, sUrl: "" + CE.INSPECTION_MOVE_ROTATE + "_" + t.tool };
                    }

                    var r = that._regions[i];
                    r.ready = false;
                    r.div = $("<div>").addClass("hmi-movableregion").hide().draggable();
                    r.div.addClass("ui-icon").addClass("ui-icon-plus");
                    $("div.hmi-refimageWrapper").append(that._regions[i].div);

                    (function(r){
                        r.div.on( "dragstop", function(event, ui)
                        {
                            if (r.ready)
                            {
                                var dx = that._scale * (ui.position.left - ui.originalPosition.left);
                                var dy = that._scale * (ui.position.top - ui.originalPosition.top);
                                r.ready = false;
                                getDevice(that.options.cameraip).setInt(r.sUrl, dx.toFixed(0), dy.toFixed(0), 0, function(result){
                                    that.element.attr("src",  that._cameraip + that.imagepath + Date.now());
                                    that._updateRegions();
                                });
                            }
                        } );
                    })(that._regions[i]);
                }
            }

            // Reload the reference image on changed object and parameter change
            $(InspectorUI).on('refObjChange', function(event, index, deviceip){
                // Only react if local device or correctly specified device
                if(that.options.cameraip == "" || that.options.cameraip == deviceip) { 
                    that._init();
                }
            });
            $(InspectorUI).on('parameterChange', function(event, id, val, deviceip){
                // Only react if local device or correctly specified device
                if(that.options.cameraip == "" || that.options.cameraip == deviceip) { 
                    that._init(); 
                }
            });
        }, 

        _init: function(){
            // Create and download background image
            this.element.attr("src",  this._cameraip + this.imagepath + Date.now());
            this._updateRegions();
        },

        _updateRegions: function(){
            var that = this;

            for (var i = 0; i < this.options.toolregion.length; i++){
                var r = that._regions[i];
                (function(r){
                    getDevice(that.options.cameraip).getInt(r.gUrl, function(result){
                        if (result.errorCode == 0){
                            r.ready = true;
                            r.div.css({'top': result.values[1] / that._scale - that.crossOffset + that.element.position().top, 'left' : result.values[0] / that._scale - that.crossOffset + that.element.position().left});
                            r.div.show();
                        }
                    });
                })(that._regions[i]);
            }
        }
    });
    
    
    $.widget("hmi.liveimage", {
        options: {
            interval : WebConstants.DEFAULT_REFRESH,
            overlay : "show",
            scale : 2,
            cameraip: ""
        },

        _setOption: function(key, value){
            this.options[key] = value;
            switch (key) {
            case "interval":
                // Refresh interval changed
                clearInterval(liveImageInterval)
                liveImageInterval = setInterval($.proxy(this._updateLiveImage, this), value);
                break;
            }

            this._super(key, value);    
        },

        _create: function() {
            this.element.prop("pending", false);
            // Get the live image once before the interval kicks in
            $.proxy(this._updateLiveImage, this)();
        },

        _init: function(){
            var that = this;
            this._super();

            this.element.prop("pending", false);
            this.element.load(function() {
                that.element.prop("pending", false);
            });

            // Get the live image with at a specific interval
            liveImageInterval = setInterval($.proxy(this._updateLiveImage, this), this.options.interval);
        },
 
        // Update the src property
        _updateLiveImage: function(){
            var that = this;
            var camera = getCameraURL(this.options.cameraip);
            if (this.element.prop("pending") == false && this.element.is(":visible")){
                this.element.prop("src", camera + "/LiveImage.jpg?" + "s=" + that.options.scale + "&" + OverlayEnum[this.options.overlay] + "&no-cache=" + Date.now());
                this.element.prop("pending", true);

                // Include a 5 second timeout if request is not responding
                setTimeout(function(){
                    that.element.prop("pending", false);
                }, 5000); 
            }
        }

    });

    $.widget("hmi.resultstring",{
        options: {
            cameraip: "",
            interval : WebConstants.DEFAULT_REFRESH
        },

        _setOption: function(key, value){
            this.options[key] = value;
            switch(key){
            case "interval":
                // Refresh interval changed
                clearInterval(liveImageInterval)
                liveImageInterval = setInterval($.proxy(this._getResultString, this), value);
            break;
            }
        },

        _create: function() {
            this.element.prop("pending", false);
            // Get the result once before the interval kicks in
            $.proxy(this._getResultString, this)();
        },


        _init: function(){
            this._super();
            liveImageInterval = setInterval($.proxy(this._getResultString, this), this.options.interval);
        },
 
        _getResultString: function(){
            var that = this;
            getDevice(that.options.cameraip).getResult(function(response){
                that.element.html(response.message);
            });
        }

    });
        
    $.widget("hmi.statistics",{
        options: {
            cameraip: "",
            item : undefined,
            interval : WebConstants.DEFAULT_REFRESH
        },

        _setOption: function(key, value){
            this.options[key] = value;
            switch(key){
                case "interval":
                    this._updateTimer(value);
                    break;
                case "cameraip":
                    console.error("Sorry, this widget does not support changing camera ip without re-initialization.");
                    break;
            }
        },

        _create: function() {
            this.element.prop("pending", false);
            // Get the result once before the interval kicks in
            //$.proxy(this._getStatistics, this)();
            var that = this;
            
            // Always react on statistics update, regardless of source
            $(getDevice(this.options.cameraip)).on("statisticsUpdate", function(event, logItems){
                try {                        
                    if(that.options.item != undefined){
                        that.element.html(logItems[that.options.item]);
                    } else {
                        var output = "<table>";
                        
                        $.each(logItems, function(key, value){
                            output += "<tr><th>" + key + "</th><td>" + value + "</td></tr>"; // HTML formatting
                        });
                        
                        output += "</table>";
                        that.element.html(output);
                    }
                } catch (e) {
                    console.error("Could not parse result. ", e.toString())
                }
            });
        },

        _init: function(){
            this._super();
            this._updateTimer(this.options.interval);
        },
        
        _updateTimer: function(value){
            // Refresh interval changed
            var device = getDevice(this.options.cameraip);
            if (device.statisticsTimer === undefined || value < device.statisticsInterval)
            {
                clearInterval(device.statisticsTimer);
                device.statisticsInterval = value;
                device.statisticsTimer = setInterval(function(){ 
                    device.getStatistics(function(response){
                        checkResponse(response);
                        var xml = $($.parseXML(response.message));
                        var collection = xml.children().children();
                        var logItems = {};
                        
                        $.each(collection, function(i, attr){
                            logItems[attr.tagName] = attr.getAttribute('value');
                        });
                        
                        $(device).trigger('statisticsUpdate', logItems); 
                    });
                }, value);
            }
        },
        
        refresh: function(){
            this._getStatistics();
        },
        
        statistics: function(key){
            if(key) {
                return this._logItems[key];
            } else {
                return this._logItems;
            }
        }

    });

    $.widget("hmi.logimage", {

        options: {
            cameraip: "",
            index : 0,
            overlay : "show"
        },

        _init: function(){
            var that = this;
            var camera = getCameraURL(this.options.cameraip);
            this.options.index = (this.options.index < 10 ? "0" + this.options.index : "" + this.options.index);

            var imagepath = camera + "/LogImage.jpg?" + this.options.index + "&" + OverlayEnum[this.options.overlay] + "&no-cache=";

            $(this.element).load(function() {
                getDevice(that.options.cameraip).unlockLog(function(){});
            });

            getDevice(this.options.cameraip).lockLog(function(){
                that.element.prop("src", camera + imagepath + Date.now());
            });
        }

    });

    $.widget("hmi.logimagelist", {

        options: {
            overlay : "show",
            cameraip: "",
            orientation : "vertical",
            index : "0-30"
        },

        _init: function(){
            var that = this;
            var indices = this.options.index.split("-");

            if (indices.length === 2){
                this.element.empty();

                applyPending(this.element);

                this.element.addClass("hmi-imagelist");
                if (this.options.orientation === "horizontal"){
                    this.element.addClass("horizontalimageList");
                }

                var ul = $("<ul>");
                this.element.append(ul);

                // Lock the log images
                getDevice(this.options.cameraip).lockLog(function(){
                    // Load each image
                    that._recursiveLogImageLoad(that, parseInt(indices[0]), ul, parseInt(indices[1]));
                });
            } else {
                alert("Invalid index range for log image list");
            }
        },

        _recursiveLogImageLoad: function(that, index, ul, lastImage){
            var i = index;
            var camera = getCameraURL(that.options.cameraip);
            var imagepath = "/LogImage.jpg?" + (index < 10 ? "0" + index : "" + index) + "&" + OverlayEnum[that.options.overlay] + "&no-cache=";
            var img = $("<img>").attr("src", camera + imagepath + Date.now());
            img.addClass("hmi-listImage");
            li = $("<li>").attr("id", "logImage" + index);
            li.append(img);
            ul.append(li);

            img.load(function() {
                // When all images have been loaded unlock the log images
                if(i == lastImage){
                    getDevice(that.options.cameraip).unlockLog(function(){
                        removePending(that.element);
                    });
                } else {
                    var j = i + 1; // Yes, this is needed...
                    that._recursiveLogImageLoad(that, j, ul, lastImage);
                }
            });
        },

        _destroy: function(){
            this.element.removeClass("hmi-imagelist");
            if (this.options.orientation === "horizontal"){
                    this.element.removeClass("horizontalimageList");
            }
            this.element.empty();
            this._super();
        }
    });

    $.widget("hmi.refimagelist", {

        options: {
            cameraip: "",
            orientation : "vertical"
        },

        _init: function(){
            var that = this;
            var camera = getCameraURL(that.options.cameraip);

            this.element.empty();
            this.element.addClass("hmi-imagelist");
            if (this.element.data("orientation") == 'horizontal'){
                this.element.addClass("horizontalimageList");
            }

            applyPending(this.element);

            var ul = $("<ul>");
            this.element.append(ul);

            var imgs = new Array();

            // Load each image and title
            getDevice(this.options.cameraip).getInt(CE.GET_NO_REF_OBJ, function(result){
                var numRefs = result.values[0];
                var title = new Array();
                var numLoaded = 0;

                for (var i = 0; i < numRefs; i++) {
                    (function (index){
                        var li = $("<li>").attr("id", "refObj" + index);
                        var img = $("<img>").attr("src",  camera + "/getRefObject?" + index);
                        img.addClass("hmi-listImage");
                        imgs[index]= img;
                        
                        if (that.element.data("selectable") === true){
                            img.css("cursor", "pointer");
                            img.click(function(){
                                that.element.children("img").removeClass("selected");
                                img.addClass("pending");
                                dialog.show("Setting Reference Object... Please wait, page will return when ready.");
                                
                                getDevice(that.options.cameraip).setInt(CE.REF_OBJ, index, ResponseHandler(function(response){
                                    img.removeClass("pending");                             
                                }))
                                .always(function(){
                                    dialog.hide();
                                })
                                .done(function(){
                                    $("img", that.element).removeClass("selected");
                                    img.addClass("selected");
                                    $(InspectorUI).trigger("refObjChange", [index, that.options.cameraip]); 
                                });
                            });
                        }

                        img.load(function(){
                            numLoaded++;
                            // Check if all reference images has been loaded
                            if (numLoaded === numRefs){
                                removePending(that.element);
                                getDevice(that.options.cameraip).getInt(CE.REF_OBJ, function(result){
                                    $("img", that.element).removeClass("selected");
                                    var sel = result.values[0];
                                    if (sel >= 0 && sel < imgs.length){
                                        imgs[sel].addClass("selected");
                                    }
                                });
                            }
                        });

                        title[index] = $("<span>").text("Reference Object " + index);

                        getDevice(that.options.cameraip).getString(CE.GET_NAME_REF_OBJ, index, function(result){
                            title[index].text(result.value);
                        });

                        div = $("<div>").append(img).append("<br/>").append(title[index]);
                        li.append(div);
                        ul.append(li);
                    })(i);
                }

                $(InspectorUI).on('refObjChange', function(event, index, deviceip){
                    // Only react if local device or correctly specified device
                    if(that.options.cameraip == "" || that.options.cameraip == deviceip) { 
                        imgs[index].attr("src",  camera + "/getRefObject?" + index);
                    }
                });
            });

        },

        _destroy: function(){
            this.element.removeClass("hmi-imagelist");
            if (this.options.orientation === "horizontal"){
                this.element.removeClass("horizontalimageList");
            }
            this.element.empty();
            this._super();
        }
    });


    $.widget("hmi.mode", {

        options: {
            mode : 0, // Run mode
            cameraip: ""
        },

        _create: function(){
            // Create button
            $(this.element).button();
        },

        _init: function(){
            var that = this;

            $(this.element).click(function(){
                applyPending(that.element);
                
                obj.SetMode(that.options.mode, function(response){
                    removePending(that.element);
                }, that.options.cameraip);
            });

            $(obj).on("modeChange", function(event, newMode, deviceip){
                // Only react if local device or correctly specified device
                if(that.options.cameraip == "" || that.options.cameraip == deviceip) { 
                    if (newMode == that.options.mode) {
                        $(that.element).addClass("active"); 
                    } else { 
                        $(that.element).removeClass("active"); 
                    }
                }
            });
        }

    });


    $.widget("hmi.monitor",{
        options: {
            id : -1,
            multiplier : 1,
            cameraip: ""
        },

        _init: function(){
            var that = this;

            // Always react on monitor update, regardless of source
            $(obj).on("monitorUpdate", function(event){
                $.proxy(that._updateValue, that);
            });
        },

        _updateValue: function(){
            var that = this;
            getDevice(that.options.cameraip).getInt(that.options.id, function(result){
                if (result.errorCode == 0){
                    if(result.values.length == 2){
                        $(that.element).html(result.values[0]/that.options.multiplier);
                    } else if (result.values.length == 3) {
                        $(that.element).html(result.values[0]/that.options.multiplier + " - " + result.values[1]/that.options.multiplier);
                    }
                } else {
                    $(that.element).html(result.message);
                }
            });
        }
    });

    $.widget("hmi.actionbutton", {
        options: {
            cameraip: "",
            id : -1,
            squareside : 6,
            usedhcp : 0
        },

        _init: function(){
            var that = this;

            that.element.button();
            that.element.click(function(event){
                event.preventDefault();
                // Prevent more than one click
                if (that.element.hasClass("pending")){ return; }

                applyPending(that.element);
                var operation = null;
                switch(that.options.id){
                case CE.SAVE_TO_FLASH:
                    operation = InspectorUI.SaveToFlash(that.options.cameraip);
                    break;

                case CE.RETEACH_REF_OBJ:
                    operation = InspectorUI.ReTeach(that.options.cameraip);
                    break;

                case CE.PERFORM_CALIBRATION:
                    operation = InspectorUI.Calibrate(that.options.squareside, that.options.cameraip);
                    break;

                case CE.REMOVE_CALIBRATION:
                    operation = InspectorUI.RemoveCalibration(that.options.cameraip);
                    break;

                case CE.APPLY_IP_SETTINGS:
                    operation = InspectorUI.ApplyIP(that.options.usedhcp, that.options.cameraip);
                    break;

                case CE.REBOOT_DEVICE:
                    operation = InspectorUI.RestartDevice(that.options.cameraip);
                    break;

                default:
                    alert("Invalid action id");
                    return;
                    break;
                }

                operation
                    .always(function(){
                        removePending(that.element); dialog.hide();
                    })
                    .fail(function(result){
                        if (typeof result.message !== 'undefined'){
                            dialog.alert(result.message);
                        } else {
                            dialog.alert(result);
                        }
                    });
            });
        }

    });

    $.widget("hmi.resultplot",{
        options: {
            cameraip: "",
            color: "#0084C2",
            showclearbutton: true,
            showmenu: true,
            selectedvalue: {}, // e.g. {"Pixel_counter_1":"PIXELS"}
            toollist: [],
            interval: 1000,
            plotlength: 100,
            plotoptions : {
                series: {
                    color: "#0084C2",
                    lines: { show: true },
                    points: { show: false }
                },
                grid: {
                    hoverable: true
                },
                xaxis:{
                    show: false
                }
            }
        },
        
        _setOption: function(key, value){
            this.options[key] = value;
            switch( key ) {
            case "plotoptions":
                this._plot = $.plot($(".hmi-plot-placeholder"), this._series, value);
                break;
            case "color":
                this.options.plotoptions.series.color = value;
                this._plot = $.plot($(".hmi-plot-placeholder"), this._series, this.options.plotoptions);
                break;
            case "showmenu":
                this._showMenuButton(value);
                break;
            case "showclearbutton":
                this._clearButton(value);
                break;
            case "interval":
                clearInterval(this._timerHandle);
                this._timerHandle = setInterval($.proxy(this._getResultString, this), this.options.interval);
                break;
            }
        },
        _create: function(){
            // We don't support IE7
            if (typeof JSON === 'undefined'){
                var divNotSupported = $("<div>").text("Plot is not supported by your browser!");
                this.element.append(divNotSupported);
            }
        },

        _init: function(){
            var that = this;
            this._series = [{ label: "", data: []}];
            this._currentData = [];
            this._dataStruct = [];
            this._lastPlotValue = -1; // Last timestamp/image number plotted against, to prevent duplicates
            this._plot = undefined;
            this._clearDataButton = undefined;
            this._menuButton = undefined;
            this._dataMenu = undefined;
            this._saveCounter = 0;
            this._timerHandle = 0;

            window.onbeforeunload = function(){
                if(supportsHtml5Storage()) {
                    localStorage.setItem("result", JSON.stringify(that._currentData));
                }
                return;
            };
                                    
            // Init result structure and start collecting data
            // Needs to get the result once to create the data structure
            getDevice(this.options.cameraip).getResult(function(response){
                // Try parsing the response to verify that it is properly formatted
                try{
                    $.parseJSON(response.message)
                    var struct = that._initStorage(response.message);
                    
                    if($.isEmptyObject(struct)){
                        throw {
                            name: "Result message error",
                            message: "The specified tools do not exsist in the result string.",
                            toString: function(){return this.name + ": " + this.message} 
                        }
                    }
                    
                    // Add graph, button and menu
                    that._initDOM(struct);
                    
                    // Get result every second which in turn will update the plot
                    that._timerHandle = setInterval($.proxy(that._getResultString, that), that.options.interval);
                } catch(e) {
                    console.error("Initialization failed ", e.toString());
                }
            });
        },
                
        // Returns a the a struct object of the result
        _initStorage: function(resultString){
            var that = this;
            
            // Data structure as a JSON string if data needs to be cleared and reinitialized
            var struct = this._initDataStructure(resultString);
            this._dataStruct = JSON.stringify(struct);
            
            // Check for stored data            
            if(supportsHtml5Storage()){
                try{
                    this._currentData = $.parseJSON(localStorage.getItem("result"));
                } catch (e) {
                    console.error("Could not parse stored data", e);
                    this._currentData = null;
                }
            }
            
            // Initialize data storage
            if(this._currentData == null){
                this._currentData = $.parseJSON(this._dataStruct); // Parse structure to get a copy
            }
            return struct;
        },
        
        // Init data structure
        // { <tool-name>:{
        //      <result-tag> : [] // empty array, will contain [x y] for plot, x = image number / sample, y = result value
        //      ...
        //    }
        //   <tool-name>:{
        //      <result-tag> :
        //      ...
        //   }
        // ...
        // }
        //
        // Assume that all tools are within MESSAGE and that all tools have their results directly under
        // IMAGE_NUMBER must be present in the result as well.
        // {"MESSAGE" : {"Pixel_counter_1":{"SCORE":100, "DECISON:1"}, ... }}
        _initDataStructure: function(resultString){
            var that = this;
            var struct = $();
            
            try{
                struct = this._listKeyValuePairs($.parseJSON(resultString).MESSAGE, this.options.toollist);
                $.each(struct, function(key, value){
                    $.each(value, function(subKey, v){
                        struct[key][subKey] = [];
                    });
                });
                if($.isEmptyObject(struct)){
                    throw {
                        name: "Result message error",
                        message: "The specified tools do not exsist in the result string.",
                        toString: function(){return this.name + ": " + this.message} 
                    }
                }
            } catch (e) {
                console.error("Could not create data structure ", e.toString());
            }
            
            return struct;
        },
        
        // Adds a button for clearing data and a menu for selecting which result to plot
        _initDOM: function(resultStruct){
            var that = this;
            var containerDiv = $("<div/>").addClass("hmi-plot-container");
            var plotDiv = $("<div/>").addClass("hmi-plot-placeholder");
            
            var previousPoint = null;
            $(plotDiv).bind("plothover", function (event, pos, item) {
                if (item) {
                    if (previousPoint != item.dataIndex) {
                        previousPoint = item.dataIndex;

                        $("#tooltip").remove();
                        var x = item.datapoint[0].toFixed(0),
                        y = item.datapoint[1].toFixed(2);

                        that._showTooltip(item.pageX, item.pageY, "Image number  " + x + ":  " + y);
                    }
                } else {
                    $("#tooltip").remove();
                    previousPoint = null;            
                }
                
              });
            
            
            // Container div also includes the result data menu
            $(containerDiv).append(plotDiv);
            
            // Create result menu button node
            this._menuButton = $("<button/>").addClass("hmi-plot-menu-button");
            
            // Add click function
            this._menuButton.text("Menu");
            this._menuButton.click(function () {
                that._dataMenu.show().position({
                    my: "left top",
                    at: "left bottom",
                    of: that._menuButton
                });
                $(document).one("click", function () {
                    that._dataMenu.hide();
                });
                return false;
            });

            // Create widget-button
            $(this._menuButton).button({
              icons: {
                primary: "ui-icon-gear",
                secondary: "ui-icon-triangle-1-s"
              },
              text: false
            });
            
            // Create result menu node
            this._dataMenu = $("<ul/>").addClass("hmi-plot-data-menu");

            // Generate ul for every tool and li:s for every result to create the result list
            $.each(resultStruct, function(key, value){
                var toolListItem = $("<li>").append($("<a/>", {href: "#", text: key}));
                var toolListItemList = $("<ul/>");
                $.each(value, function(subkey, subValue){
                    // Add result to tool
                    toolListItemList.append($("<li>").addClass("hmi-plot-data-menu-item").append($("<a/>", {href: "#", text: subkey})));
                });
                toolListItem.append(toolListItemList);
                that._dataMenu.append(toolListItem);
            });
            
            // Add selection event to update plotted result
            $(this._dataMenu).on("menuselect", function(event, ui){
                // Get the text (seleted result) from the menu as well as the tool                
                var topLi = $(ui.item).closest("ul").closest("li");
                if(topLi != undefined && topLi.length>0){
                    var tool = topLi[0].firstChild.textContent;
                    var toolResult = $(ui.item).text();
                    var res = {}
                    res[tool] = toolResult;
                    that.options.selectedvalue = res;
                }
            });
            
            // Create widget-menu
            $(this._dataMenu).menu();
            
            // Create clear button
            this._clearDataButton = $("<button/>").addClass("hmi-plot-clear-data-button");
            
            // Add click function
            this._clearDataButton.text("Clear plot data");
            this._clearDataButton.click(function(){
                localStorage.removeItem("result"); // Empty result storage
                that._currentData = $.parseJSON(that._dataStruct); //Reinitialize data structure
                that._series[0] = [{ label: "", data: []}];
                that._updatePlot();
            });
            
            // Create widget-button
            $(this._clearDataButton).button();
            
            this._dataMenu.hide();
            this.element.append(this._dataMenu);
            this.element.append(containerDiv);
            if( this.options.showclearbutton ) { this.element.append(this._clearDataButton); }
            if (this.options.showmenu ) {this.element.append(this._menuButton);}
            
            this._plot = $.plot(plotDiv, this._series, this.options.plotoptions);
        },
        
        // Show/Hide clear button, controlled via options
        _clearButton: function(enable){
            if(enable && !$(this.element).find(".hmi-plot-clear-data-button").length && this._clearDataButton != undefined){
                this.element.append(this._clearDataButton);
            } else {
                $(this._clearDataButton).detach();
            }
        },
        
        // Show/Hide menu, controlled via options
        _showMenuButton: function(enable){
            if(enable && !$(".hmi-plot-container").find(".hmi-plot-menu-button").length){
                this.element.append(this._menuButton);
            } else {
                $(this._menuButton).detach();
            }
        },

        _updatePlot: function(){
            this._plot.setData(this._series);
            this._plot.setupGrid();
            this._plot.draw();
        },
        
        _listKeyValuePairs: function(result, tools) {
            var val = {};
            var len = tools.length;
            
            if(len === 0) { // List all results
                $.each(result, function(key, value){
                    if(typeof value === 'object' && value != null){
                        val[key] = value;
                    }
                });
            } else { // List specified results
                for(var i = 0; i < len; ++i) {
                    var key = tools[i];
                    if(result.hasOwnProperty(key)) {
                        val[key] = result[key];
                    }
                }
            }

            return val;

        },

        // Get result string from device and update the plot
        _getResultString: function(){
            var that = this

            // On callback update the plot
            getDevice(this.options.cameraip).getResult(function(response) {
                var result;
            
                try {
                    // Check if response is valid
                    checkResponse(response);
                    result = $.parseJSON(response.message);
                } catch (e) {
                    console.error("Could not parse result", e);
                    return;
                }
                
                // Extract tools and their values from the result string
                // Will extract tools listed in this._currentData that is defined at init
                var extractedTools = that._listKeyValuePairs(result.MESSAGE, getKeys(that._currentData));
                
                var kvs = getAllKeyWithValue(that._currentData);
                
                // Plot results against image number
                var imageNr = result.MESSAGE.IMAGE_NUMBER;
                if(imageNr === undefined){
                    dialog.alert("Image number not available in result string!");
                    return;
                } else if(imageNr == that._lastPlotValue){ // Only update if result has changed
                    return;
                }
                
                that._lastPlotValue = imageNr;
                
                // Store data for selected/all tools
                $.each(kvs, function(index, toolSet) {
                    for(tag in toolSet.value) {
                        that._currentData[toolSet.key][tag].push([ imageNr, extractedTools[toolSet.key][tag] ]);
                    }
                });
                that._saveCounter++;
                if(that._saveCounter > 100)
                {
                    if(supportsHtml5Storage()) {
                        localStorage.setItem("result", JSON.stringify(that._currentData));
                    }
                    that._saveCounter = 0;
                }
                
                if(that.options.selectedvalue){
                    // Set current plot data to new updated
                    var kv = getKeyWithValue(that.options.selectedvalue);
                    
                    // Key = tool, value = tool result
                    var plotdata = that._currentData[kv.key][kv.value];
                    // Only show options.plotlength latest results
                    that._series[0].data = $(plotdata).slice(-that.options.plotlength, -1);
                    that._series[0].label = kv.key + ": " + kv.value;
    
                    // Call plot update
                    that._updatePlot();
                } else {
                    console.log("No result value selected");
                }
            });
        },
        
        _showTooltip: function (x, y, contents) {
			$("<div id='tooltip'>" + contents + "</div>").css({
				position: "absolute",
				display: "none",
				top: y + 5,
				left: x + 5,
				border: "1px solid #CCC",
				padding: "2px",
				"background-color": "#FFFFFF",
				opacity: 0.90
			}).appendTo("body").fadeIn(200);
		},
        
        _destroy: function(){
            $(this.element).remove(".hmi-plot-container");
            $(this.element).remove(".hmi-plot-placeholder");
            $(this.element).remove(".hmi-plot-clear-data-button");
            $(this.element).remove(".hmi-plot-data-menu");
        }


    });

    })(jQuery);


    /**************************/
    
    function supportsHtml5Storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null && typeof JSON !== 'undefined';
        } catch (e) {
            return false;
        }
    }
    
    // Use surrounded with a try catch
    function checkResponse(response){
        if(parseInt(response.errorCode) != 0){
            throw {
                errorCode: response.errorCode,
                message: response.message,
                toString: function(){return this.errorCode + ": " + this.message} 
            }
        }
        return response;
    }

    // Callback function called when receiving a result from the camera
    function ResponseHandler(callback) {
        return function(response){
            if (response.httpStatus != 200) {
                // handle HTTP error
                alert("HTTP Error (" + response.httpStatus + "): " + response.httpMessage);
            } else if(response.errorCode != 0){
                // handle protocol violation
                alert("Error (" + response.errorCode + "): " + response.message);
            } else {
                callback(response);
            }
        };
    }

    function hmiCreateRefImage(element){
        var id = $(element).data("id");

        var opt = { 
            id: id,
            index: defaultFor($(element).data("index"), -1),
            cameraip : defaultFor($(element).data("cameraip"), ""),
            toolregion: []
        };

        // Parse toolregion data (example: "2:87, 4:87, 38")
        if (typeof $(element).data("toolregion") !== 'undefined'){
            var parts = $(element).data("toolregion").split(",");
            for (var i = 0; i < parts.length; i++){
                var parts2 = parts[i].split(":");
                opt.toolregion[i] = { tool: parseInt(parts2[0]), id: parseInt(parts2[1])};
            }
        }

        $(element).refimage(opt);
    }

    
    function hmiCreateLiveImage(element, callback){
        var opt = {
            interval : defaultFor($(element).data("interval"), WebConstants.DEFAULT_REFRESH),
            overlay : defaultForOverlay($(element).data("overlay"), "show"),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };
        
        $(element).liveimage(opt);
    }

    function hmiCreateLogImage(element, callback){
        var opt = {
            index : defaultFor($(element).data("index"), 0),
            overlay : defaultForOverlay($(element).data("overlay"), "show"),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).logimage(opt);
    }

    function hmiCreateLogImageList(element, callback){
        var opt = {
            index : defaultFor($(element).data("index"), "0-30"),
            orientation : defaultFor($(element).data("orientation"), "vertical"),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).logimagelist(opt);
    }

    function hmiCreateRefImageList(element, callback){
        var opt = {
            cameraip : defaultFor($(element).data("cameraip"), ""),
            orientation : defaultFor($(element).data("orientation"), "vertical")
        };

        $(element).refimagelist(opt);
    }

    function hmiCreateActionButton(element, callback){
        var id = $(element).data("id");

        // id must be specified
        if (typeof id == 'undefined') { alert("No data-id provided for action button"); }

        var opt = {
            id : id,
            squareside : defaultFor($(element).data("squareside"), 6),
            usedhcp : defaultFor($(element).data("usedhcp"), 0),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).actionbutton(opt);

    }

    function hmiCreateControl(element){
        var id = $(element).data("id");

        var opt = { 
            id: id,
            tool: $(element).data("tool"),
            min: $(element).data("min"), 
            max: $(element).data("max"), 
            range: $(element).data("range"), 
            multiplier: $(element).data("multiplier"), 
            unit: $(element).data("unit"),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        if (typeof defaultSettings[id] === undefined){
            alert("This identifier is not supported by the HMI library");
        }

        opt = $.extend({}, defaultSettings[id], opt);

        if (opt.type == 'slider'){
            $(element).slidertext(opt);
        } else if (opt.type == 'radio'){
            $(element).radio(opt);
        } else if (opt.type == 'check'){
            $(element).checkbox(opt);
        }
    }

    function hmiCreateModebutton(element, callback){
        var opt = {
            mode : $(element).data("mode"),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).mode(opt);
    }

    function hmiCreateMonitorLabel(element, callback){
        var id = $(element).data("id");

        if (typeof defaultSettings[id] === undefined){
            alert("This identifier is not supported by the HMI library");
        }

        var opt = {
            id : id,
            multiplier : defaultSettings[id].multiplier,
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).monitor(opt);
    }

    function hmiCreateResultString(element, callback){
        var opt = {
            interval : defaultFor($(element).data("interval"), WebConstants.DEFAULT_REFRESH),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).resultstring(opt);
    }
    
    function hmiCreateStatistics(element, callback){
        var opt = {
            interval : defaultFor($(element).data("interval"), WebConstants.DEFAULT_REFRESH),
            item : defaultFor($(element).data("item"), undefined),
            cameraip : defaultFor($(element).data("cameraip"), "")
        };

        $(element).statistics(opt);
    }

    function hmiCreatePlot(element){
        var opt = {
            cameraip : defaultFor($(element).data("cameraip"), ""),
            color : defaultFor($(element).data("color"), "#0084C2"),
            showmenu : defaultFor($(element).data("showmenu"), true),
            showclearbutton : defaultFor($(element).data("showclearbutton"), true),
            selectedvalue : defaultFor($(element).data("selectedvalue"), {}),
            toollist : defaultFor(ParseDataCSV($(element), "toollist"), []),
            interval : defaultFor($(element).data("interval"), 1000),
            plotlength : defaultFor($(element).data("plotlength"), 100)
        };

        $(element).resultplot(opt);
    }

    function ParseDataCSV(element, name)
    {
        if (element.data(name) != undefined)
        {
            return element.data(name).toString().split(",");
        }
        return undefined;
    }

    obj.init = function (){
        dialog.init();

        $( ".hmi-parameter" ).each(function(index, element){
            hmiCreateControl(element);
        });

        $( ".hmi-liveimage" ).each(function(index, element){
            hmiCreateLiveImage(element);
        });
        
        $( ".hmi-refimage" ).each(function(index, element){
            hmiCreateRefImage(element);
        });

        $( ".hmi-logimage" ).each(function(index, element){
            hmiCreateLogImage(element);
        });

        $( ".hmi-logimagelist" ).each(function(index, element){
            hmiCreateLogImageList(element);
        });
        
        $( ".hmi-refimagelist" ).each(function(index, element){
            hmiCreateRefImageList(element);
        });

        $( ".hmi-resultstring" ).each(function(index, element){
            hmiCreateResultString(element);
        });
        
        $( ".hmi-statistics" ).each(function(index, element){
            hmiCreateStatistics(element);
        });

        $( ".hmi-action" ).each(function(index, element){
            hmiCreateActionButton(element);
        });

        $( ".hmi-mode" ).each(function(index, element){
            hmiCreateModebutton(element);
        });

        $(".hmi-monitor").each(function(index, element){
            hmiCreateMonitorLabel(element);
        });

        // Update all monitors for all devices with the same interval
        liveImageInterval = setInterval(function(){ $(obj).trigger('monitorUpdate'); }, WebConstants.DEFAULT_REFRESH);

        // Init device(s) mode and selected reference object
        if(devices.length > 0) {
            $.each(devices, function(index, device) {
                device.getMode(ResponseHandler(function(response){
                    device.runMode = response.mode; 
                    $(InspectorUI).trigger('modeChange', [response.mode, device.cameraip]);
                }) );
                
                device.getInt(CE.REF_OBJ, ResponseHandler(function(result){
                    $(InspectorUI).trigger("refObjChange", [result.values[0], device.cameraip]);
                }) );
            });
        } else {
            inspector.getMode(ResponseHandler(function(response){
                inspector.runMode = response.mode; 
                $(InspectorUI).trigger('modeChange', [response.mode, inspector.cameraip]);
            }));
            
            inspector.getInt(CE.REF_OBJ, ResponseHandler(function(result){
            $(InspectorUI).trigger("refObjChange", [result.values[0], inspector.cameraip]);
        }));
            
        }

        $( ".hmi-resultplot").each(function(index, element){ 
            hmiCreatePlot(element);
        });
    };

    obj.RefreshReferenceImages = function(){
        $( ".hmi-refimage" ).each(function(index, element){
            hmiCreateRefImage(element);
        });
    };

    obj.RefreshReferenceImageList = function(callback){
        $( ".hmi-refimagelist" ).each(function(index, element){
            hmiCreateRefImageList(element, callback);
        });
    };

    obj.RefreshLogImages = function(){
        $( ".hmi-logimage" ).each(function(index, element){
            hmiCreateLogImage(element);
        });
    };

    obj.RefreshLogImageList = function(callback){
        $( ".hmi-logimagelist" ).each(function(index, element){
            hmiCreateLogImageList(element, callback);
        });
    };

    obj.RefreshControls = function(){
        $(':hmi-slidertext').slidertext();
        $(':hmi-radio').radio();
        $(':hmi-checkbox').checkbox();
    };
    
    // Run calibration sequence
    obj.Calibrate = function(squareSide, deviceip) {
        var device = getDevice(deviceip);
        if (inEditMode(device)) {
            var promise = $.Deferred();
            dialog.show("Calibrating... <br/> Please wait, page will return when ready.");
            var dummy = function(){};
            var printMsg = function(result){promise.reject(result.message);};
            // Wait for response before continueing with next command

            // Set the Inspector in Calibration mode 
            device.setInt(CE.CALIBRATION_MODE, 1, dummy).done(function(){
                // Perform calibration
                device.performAction(CE.PERFORM_CALIBRATION, squareSide, dummy).done(function(){
                    promise.resolve("Calibration Complete!");
                }).fail(printMsg);
            }).fail(printMsg);

            return promise; 
        } else {
            return $.Deferred().reject("Set the device in Edit mode to be able to calibrate!");
        }
    };

    // Remove calibration
    obj.RemoveCalibration = function(deviceip) {
        var device = getDevice(deviceip);
        if (inEditMode(device)) {
            //Remove the calibration
            dialog.show("Removing Calibration... <br/> Please wait, page will return when ready.");             
            return device.performAction(CE.REMOVE_CALIBRATION, function(response){}).done(function(){ dialog.alert("Calibration Removed!"); });
        } else {
            return $.Deferred().reject("Set the device in Edit mode to be able to calibrate!");
        }
    };

    // Restart device
    obj.RestartDevice = function(deviceip) {
        var device = getDevice(deviceip);
        dialog.show("Restarting device... <br/> Please reload page when device is ready.");
        device.performAction(CE.REBOOT_DEVICE, function(response){});
    };

    // Save configuration to flash
    obj.SaveToFlash = function(deviceip) {
        var device = getDevice(deviceip);
        if (inEditMode(device)) {
            dialog.show("Saving... Please wait, page will return when ready.");
            return device.performAction(CE.SAVE_TO_FLASH, function(){});
        } else {
            return $.Deferred().reject("The device must be in Edit mode to be able to calibrate!");
        }
    };

    // Re-Teach the current Reference Object
    obj.ReTeach = function(deviceip) {
        var device = getDevice(deviceip);
        if (!inEditMode(device)) {
            dialog.show("Re-Teaching... Please wait, page will return when ready.");
            return device.performAction(CE.RETEACH_REF_OBJ, 0, ResponseHandler(function(response){
                dialog.hide();
                device.getInt(CE.REF_OBJ, function(result){
                    $(InspectorUI).trigger("refObjChange", [result.values[0], deviceip]);
                });
            }));
        } else {
            return $.Deferred().reject("You must be in Run mode to be able to Re-Teach the Reference Object!");
        }
    };

    // Set active Reference object to specified reference bank index
    obj.SetReferenceObject = function(refBankIndex, deviceip) {
        var device = getDevice(deviceip);
        dialog.show("Setting Reference Object... Please wait, page will return when ready.");
        return device.setInt(CE.REF_OBJ, refBankIndex, ResponseHandler(function(response){
            dialog.hide();
            $(InspectorUI).trigger("refObjChange", [refBankIndex, deviceip]);
        }));
    };

    // Get the current ip-address into specified text boxes
    obj.GetIP = function(ip1, ip2, ip3, ip4, deviceip) {
        return getDevice(deviceip).getInt(CE.IP_ADDRESS, ResponseHandler(function(response){
            ip1.val(response.values[0]);
            ip2.val(response.values[1]);
            ip3.val(response.values[2]);
            ip4.val(response.values[3]);
        }));
    };

    // Set the current ip-address from specified text boxes
    obj.SetIP = function(ip1, ip2, ip3, ip4, deviceip) {
        dialog.show("Setting IP-address... Please wait, page will return when ready.");

        return getDevice(deviceip).setInt(CE.IP_ADDRESS, ip1, ip2, ip3, ip4, ResponseHandler(function(response){
            dialog.hide();
        })); 
    };

    // Get the current netmask into specified text boxes
    obj.GetNetmask = function(mask1, mask2, mask3, mask4, deviceip) {
        getDevice(deviceip).getInt(CE.NETMASK, ResponseHandler(function(response){
            mask1.val(response.values[0]);
            mask2.val(response.values[1]);
            mask3.val(response.values[2]);
            mask4.val(response.values[3]);
        }));
    };

    // Set the current netmask from specified text boxes
    obj.SetNetmask = function(mask1, mask2, mask3, mask4, deviceip) {
        dialog.show("Setting netmask... Please wait, page will return when ready.");

        return getDevice(deviceip).setInt(CE.NETMASK, mask1, mask2, mask3, mask4, ResponseHandler(function(response){
            dialog.hide();
        })); 
    };

    // Get the current network gateway into specified text boxes
    obj.GetGateway = function(gate1, gate2, gate3, gate4, deviceip) {
        getDevice(deviceip).getInt(CE.GATEWAY, ResponseHandler(function(response){
            gate1.val(response.values[0]);
            gate2.val(response.values[1]);
            gate3.val(response.values[2]);
            gate4.val(response.values[3]);
        }));
    };

    // Set the current network gateway from specified text boxes
    obj.SetGateway = function(gate1, gate2, gate3, gate4, deviceip) {
        dialog.show("Setting network gateway address... Please wait, page will return when ready.");

        return getDevice(deviceip).setInt(CE.GATEWAY, gate1, gate2, gate3, gate4, ResponseHandler(function(response){
            dialog.hide();
        })); 
    };

    // Apply network settings
    obj.ApplyIP = function(usedhcp, deviceip) {
        dialog.show("Setting IP-address... Please wait, page will return when ready. The Inspector needs to be restarted in order for the new IP-settings to take effect.");
        usedhcp = usedhcp == undefined ? 0 : usedhcp;
        return getDevice(deviceip).performAction(CE.APPLY_IP_SETTINGS, usedhcp, ResponseHandler(function(response2){
            dialog.hide();
        }));
    };

    // Set camera mode to run or edit
    obj.SetMode = function(mode, callback, deviceip) {
        var device = getDevice(deviceip);
        device.setMode(mode, ResponseHandler(function(){
            device.runMode = mode; 
            $(obj).trigger('modeChange', [mode, deviceip]);
            if($.isFunction(callback)) {
                callback();
            }
        }));
    };
    
    // Creates Inspector.js objects from array of IP-addresses
    obj.AddDevicesIP = function(ips) {
        devices.length = 0; // Clear array before adding new objects
        $.each(ips, function(index, ip){
            devices.push(new Inspector(ip));
        });
    }

    //Adds Inspector.js class instances to list of devices
    obj.AddDevices = function(objs) {
        devices.length = 0; // Clear array before adding new objects
        $.merge(devices, objs);
        devices.length;
    }
        
};

/* Search the document and auto-initialize all controls */
$(function() {
    InspectorUI.init();
});
