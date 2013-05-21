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
        sectionContainer = container.getElementsByClassName("section-container")[0],
        subsectionsContainer = container.getElementsByClassName("subsections-container")[0],
        input = container.getElementsByClassName("breadcrumb-input")[0],
        cachedInputValue = input.value,
        section = options.section || "",
        subsections = (options.subsections instanceof Array) ? options.subsections : [],
        fileName = options.fileName || "",
        callbacks = options.callbacks,
        that = this;


    /** 
        Binds all events on initialization.

        @method bindEvents
    **/
    function bindEvents() {
        input.addEventListener("keyup", checkTyping, false);
    }


    /** 
        Invokes methods based on user input. Basically it will add/remove 
        sections and it will prevents input errors like double forward slash.

        @method checkTyping
        @param {Object} e Event object.
    **/
    function checkTyping(e) {
        var key = e.keyCode,
            target = e.target,
            remainingString = "";

        if (key === 191) { // Forward slash key.

            var subsectionName = target.value,
                separatorIndex = subsectionName.indexOf("/");

            remainingString = subsectionName.substr(separatorIndex + 1);
            setInputValue(remainingString);
            subsectionName = subsectionName.substr(0, separatorIndex);
            setCursorPos(0);

            if (subsectionName !== "") {

                addSubsection(subsectionName);
            }
        } else if (key === 8) { // Delete key.

            if (subsections.length > 0 && target.value === cachedInputValue) {

                var lastSubsectionName = subsections[subsections.length - 1];

                remainingString = target.value;
                setInputValue(lastSubsectionName + remainingString);
                setCursorPos(lastSubsectionName.length);
                removeSubsection();
            }
        }

        cachedInputValue = target.value;
        evaluateCallback("onInputKeyup", [e]);
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
            href = section + "/";

        sectionContainer.innerHTML = "<a href=\"" + href + "\">" + section + "</a>" + separator;

        for (var i = 0; i < subsections.length; i++) {
            var subsection = subsections[i];
            href += subsection + "/";

            html += "<a href=\"" + href + "\">" + subsection + "</a>" + separator;
        }

        subsectionsContainer.innerHTML = html;
    }


    /** 
        Appends a subsection in the path.

        @method addSubsection
        @subsectionName {String} Subsection name to be added.
    **/
    function addSubsection(subsectionName) {
        subsections.push(subsectionName);
        buildBreadcrumb();
        evaluateCallback("afterAddSubsection");        
    }


    /** 
        Removes the last subsection in the path.

        @method removeSubsection
    **/
    function removeSubsection() {
        subsections.pop();
        buildBreadcrumb();
        evaluateCallback("afterRemoveSubsection");                
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
        bindEvents();
        evaluateCallback("onInit");
    };


    /**
        Returns an object that contains information about
        the current section, subsections and file name.

        @method getPath
        @return {Object} A path object.
    **/
    this.getPath = function() {
        var path = {
            section: section,
            subsections: subsections,
            fileName: input.value
        };

        return path;
    };
}
