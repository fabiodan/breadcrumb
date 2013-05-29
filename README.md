breadcrumb
==========

Github-like breadcrumb

### Markup

Required markup:

```html
<div id="breadcrumb">
    <span class="basepath-container"></span>
    <span class="sections-container"></span>
    <input class="breadcrumb-input" type="text">
</div>
```

### Options

All configuration values are optional. The default values are specified below.

```javascript
var options = {
    
    // {String} Breadcrumb container id. Defaults to "breadcrumb".
    containerId: "container",

    // {Array} Section name. Defaults to [].
    basePath: ["base", "path"],
    
    // {Array} List of sections names. Defaults to [].
    sections: ["section1", "section2"],

    // {Boolean} Create links to section and sections. Defaults to true.
    createLinks: true,
    
    // {String} File name. Defaults to "".
    fileName: "index.html",
    
    // {String} Input placeholder. Defaults to "".
    placeholder: "Name your file...",

    // {Object} Callbacks object.
    callbacks: {
      
        // {Function} Callback invoked on initialization.  
        // The this keyword refers to the breadcrumb instance.
        onInit: function() {},
        
        // {Function} Callback invoked on keyup event. 
        // The this keyword refers to the breadcrumb instance.
        // One parameter, e, is an object event passed to the function.
        onInputKeyup: function(e) {},
        
        // {Function} Callback invoked after a section is added. 
        // The this keyword refers to the breadcrumb instance.
        afterAddSection: function() {},
        
        // {Function} Callback invoked after a section is removed.
        // The this keyword refers to the breadcrumb instance.
        afterRemoveSection: function() {}        
    }
};
```
