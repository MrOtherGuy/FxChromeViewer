# FxChromeViewer

Creates a textual snapshot of the Firefox browser UI

![Document tree](https://github.com/MrOtherGuy/FxChromeViewer/blob/master/chromeViewer.png)


# Instructions

1. Enable browser chrome debugging in developer tools advanced section
2. Open Scratchpad
3. If #1 was done correctly you should see a menu option "Environment" - select Browser as the environment.
4. Run chromeViewer code

You should see a new tab opening with snapshot view of the UI structure

# Parameters

The function takes two parameters

1. String which is the outermost element ( default: "#navigator-toolbox") see [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector)
2. Number (default `6`) which means the depth how deep the structure is traversed from the provided parent

# WARNING

This code will be run in the browser environment and could basically do absolutely anything including destroying your profile. Just so you know.

To be safe you should probably not run this in your normal profile