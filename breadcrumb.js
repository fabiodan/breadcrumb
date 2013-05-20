// The MIT License (MIT)

// Copyright (c) 2013 Fabio Dan

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/** 
    Generates a Github's like breadcrumb.

    @constructor Breadcrumb
    @param {Object} options Breadcrumb's init options.
        @param {String} options.section Section name.
        @param {Array} options.subsections List of subsections.
        @param {String} options.fileName File name. 
        @param {Object} options.callbacks Callbacks available.
            @param {Function} options.callbacks.onInit Callback invoked on initialization.
            @param {Function} options.callbacks.onInputKeyup Callback invoked on keyup event.
            @param {Function} options.callbacks.afterAddSubsection Callback invoked after a 
                                                                   subsection is added.
            @param {Function} options.callbacks.afterRemoveSubsection Callback invoked after a 
                                                                      subsection is removed.
Required markup:

<div id="breadcrumb">
    <strong id="section-container"></strong>
    <span id="subsections-container"></span>
    <input id="breadcrumb-input" type="text" placeholder="Name your file...">
</div>
**/
function Breadcrumb(options) {
    "use strict";

    options = options || {};

    var sectionContainer = document.getElementById("section-container"),
        subsectionsContainer = document.getElementById("subsections-container"),
        input = document.getElementById("breadcrumb-input"),
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
