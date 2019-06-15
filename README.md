# FxChromeViewer

Creates a textual snapshot of the Firefox browser UI

![](https://github.com/MrOtherGuy/FxChromeViewer/blob/master/FxChromeViewer.png "Document tree")


# Instructions

1. Enable browser chrome debugging in developer tools advanced section
2. Open Scratchpad
3. If #1 was done correctly you should see a menu option "Environment" - select Browser as the environment.
4. Run chromeViewer code

I haven't get this to run on pre-Firefox 65 

You should see a new tab opening with snapshot view of the UI structure

# Parameters

The function takes three parameters as an object:

 `type` - String, one of: `"JSON"` `"HTML"` `"STRING"`
 
 `parent` - String which is the outermost element ( default: "#navigator-toolbox") see [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
 
 `depth` - Number (default `6`) which means the depth how deep the structure is traversed from the provided parent

# WARNING

This code will be run in the browser environment and could basically do absolutely anything including destroying your profile. Just so you know.

To be safe you should probably not run this in your normal profile

# Examples

Here are few examples of the output:

## #mainPopupSet

![mainPopupSet.json](examples/mainPopupSet_Fx69.json)
![mainPopupSet.html](examples/mainPopupSet_Fx69.html)

## #navigator-toolbox

![navigator-toolbox.json](examples/navigator-toolbox_Fx69.json)
![navigator-toolbox.html](examples/navigator-toolbox_Fx69.html)