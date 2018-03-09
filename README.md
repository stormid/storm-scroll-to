# Storm Scroll To

[![npm version](https://badge.fury.io/js/storm-scroll-to.svg)](https://badge.fury.io/js/storm-scroll-to)

Smooth scroll anchor links, update the URL and focus on the first child node of the target.

Can be used in conjunction with [https://stormid.github.io/storm-scroll-spy](https://stormid.github.io/storm-scroll-spy) to set the active className on the anchor links.

## Example
[https://stormid.github.io/storm-scroll-to](https://stormid.github.io/storm-scroll-to)

## Usage
HTML
```
<nav>
    <a href="#section1" class="js-scroll-to">Section 1</a>
    <a href="#section2" class="js-scroll-to">Section 2</a>
    <a href="#section3" class="js-scroll-to">Section 3</a>
</nav>
<section id="section1">
    ...
</section>
<section id="section2">
    ...
</section>
<section id="section3">
    ...
</section>
```

JS
```
npm i -S storm-scroll-to
```
either using es6 import
```
import ScrollTo from 'storm-scroll-to';

ScrollTo.init('.js-scroll-to');
```
aynchronous browser loading (use the .standalone version in the /dist folder)
```
import Load from 'storm-load';

Load('/content/js/async/storm-scroll-to.standalone.js')
    .then(() => {
        ScrollTo.init('.js-scroll-to');
    });
```


## Options
```
{
    easing: 'easeInOutCubic', //see src/lib/easing.js for availble easing functions
    speed: 260,//ms
    offset: 0,
    pushState: true,//update the URL
    focus: true,//focus on the first focusable child of the target node
    callback: null
}
```

e.g.
```
ScrollTo.init('.js-scroll-to', {
	offset: '50%'
});
```

## Tests
```
npm run test
```

## Browser support
This is module has both es6 and es5 distributions. The es6 version should be used in a workflow that transpiles.

This module depends upon Object.assign available in all evergreen browsers. ie9+ is supported with polyfills, ie8+ will work with even more polyfills for Array functions and eventListeners.

## Dependencies
None

## License
MIT