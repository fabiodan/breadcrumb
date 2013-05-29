/** 
    Generates a Github-like breadcrumb.
    @author Fabio Dan
    @license MIT (http://www.opensource.org/licenses/mit-license.php)
    @since 2013-05-20

    @constructor Breadcrumb
    @param {Object} options Breadcrumb configuration options.
**/
function Breadcrumb(options) {
    "use strict";

    options = options || {};

    var container = document.getElementById(options.containerId || "breadcrumb"),
        basePathContainer = container.getElementsByClassName("basepath-container")[0],
        sectionsContainer = container.getElementsByClassName("sections-container")[0],
        input = container.getElementsByClassName("breadcrumb-input")[0],
        cachedInputValue = "",
        basePath = (options.basePath instanceof Array) ? options.basePath : [],
        sections = (options.sections instanceof Array) ? options.sections : [],
        validPattern = options.validPattern || /^[a-zA-Z0-9_-]*$/,
        fileName = options.fileName || "",
        placeholder = options.placeholder || "",
        callbacks = options.callbacks,
        createLinks = (options.createLinks === false) ? false : true,
        that = this;


    /** 
        Binds all events on initialization.

        @method bindEvents
    **/
    function bindEvents() {
        input.addEventListener("input", checkTyping, false);
        input.addEventListener("keyup", checkTyping, false);
    }


    /** 
        Invokes methods based on user input. Basically it will add/remove 
        sections and it will prevents input errors like double forward slash.

        @method checkTyping
        @param {Object} e Event object.
    **/
    function checkTyping(e) {
        var targetValue = e.target.value,
            remainingString = "",
            separatorIndex = targetValue.indexOf("/");

        if (separatorIndex > -1) { // Forward slash key.

            var sectionName = targetValue.substr(0, separatorIndex);
            remainingString = targetValue.substr(separatorIndex + 1);
            setInputValue(remainingString);
            setCursorPos(0);

            if (sectionName !== "" && (!/\s/.test(sectionName)) 
                                   && (validPattern.test(sectionName))) {

                addSection(sectionName);
            }
        } else if (e.keyCode === 8) { // Delete key.

            if (sections.length > 0 && targetValue === cachedInputValue) {

                var lastSectionName = sections[sections.length - 1];

                remainingString = targetValue;
                setInputValue(lastSectionName + remainingString);
                setCursorPos(lastSectionName.length);
                removeSection();
            }
        }

        if (e.type === "keyup") {
            cachedInputValue = targetValue;
            evaluateCallback("onInputKeyup", [e]);
        }        
    }


    /** 
        Sets the breadcrumb's input value.

        @method setInputValue
        @value {String} Input value to be set.
    **/
    function setInputValue(value) {
        input.value = value;
    }


    /** 
        Builds the breadcrumb markup.

        @method buildBreadcrumb
    **/
    function buildBreadcrumb() {
        var separator = "<span class=\"separator\"> / </span>",
            html = "",
            href = "";

        if (basePath.length > 0) {

            for (var i = 0; i < basePath.length; i++) {
                var basePathSection = basePath[i];
                href += basePathSection + "/";

                if (createLinks) {
                    html += "<a class=\"section\" href=\"" + href + "\">" + basePathSection + "</a>" + separator;
                } else {
                    html += "<span class=\"section\">" + basePathSection + "</span>" + separator;
                }
            }

            basePathContainer.innerHTML = html;
            html = "";
        }

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            href += section + "/";

            if (createLinks) {
                html += "<a class=\"section\" href=\"" + href + "\">" + section + "</a>" + separator;
            } else {
                html += "<span class=\"section\">" + section + "</span>" + separator;
            }
        }

        sectionsContainer.innerHTML = html;
    }


    /** 
        Appends a section in the path.

        @method addSection
        @sectionName {String} Section name to be added.
    **/
    function addSection(sectionName) {
        sections.push(sectionName);
        buildBreadcrumb();
        evaluateCallback("afterAddSection");        
    }


    /** 
        Removes the last section in the path.

        @method removeSection
    **/
    function removeSection() {
        sections.pop();
        buildBreadcrumb();
        evaluateCallback("afterRemoveSection");                
    }


    /** 
        Sets cursor position on input elements.

        @method setCursorPos
        @pos {Number} Index position.
    **/
    function setCursorPos(pos) {

        // Modern browsers.
        if (input.setSelectionRange) {

            input.focus();
            input.setSelectionRange(pos, pos);

        } else if (input.createTextRange) {

            var range = input.createTextRange();

            range.collapse(true);
            range.moveEnd("character", pos);
            range.moveStart("character", pos);
            range.select();
        }
    }


    /**
        Evaluates a callback supplied via "fn" parameter. The object context will be passed 
        to the callback as first paramater, enabling the use of "this" to invoke all public
        methods. Other values can be passed to the supplied callback via "params" parameter.

        @method evaluateCallback
        @param {Function} fn Callback function.
        @param {Array} params Single array of arguments.
    **/
    function evaluateCallback(fn, params) {
        if (callbacks && typeof callbacks[fn] === "function") {

            return callbacks[fn].apply(that, params);
        }

        return false;
    }


    /**
        Initializes the breadcrumb lib.

        @method init
    **/
    this.init = function() {
        buildBreadcrumb();
        setInputValue(fileName);
        cachedInputValue = input.value;
        input.setAttribute("placeholder", placeholder);
        bindEvents();
        evaluateCallback("onInit");
    };


    /**
        Returns an object that contains information about
        the current base path, sections and file name.

        @method getPath
        @return {Object} A path object.
    **/
    this.getPath = function() {
        var path = {
            basePath: basePath,
            sections: sections,
            fileName: input.value
        };

        return path;
    };
}
