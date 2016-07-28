#Storm ScrollSpy

##Usage
```
npm i -S storm-scrollto
```

```javascript
var ScrollSpy = require('storm-scrollto')
ScrollTo.init('js-scrollto');
```

```html
<nav class="js-scrollspy">
    <a href="#section1" class="js-scrollto">Section 1</a>
    <a href="#section2" class="js-scrollto">Section 2</a>
    <a href="#section3" class="js-scrollto">Section 3</a>
</nav>
<section id="section1"></section>
<section id="section2"></section>
<section id="section3"></section>
```

###Options
Defaults:

```javascript
{
	offset: 0,
	activeClassName: 'active',
	callback: null
}
``