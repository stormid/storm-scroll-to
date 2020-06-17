(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _component = require('./libs/component');

var _component2 = _interopRequireDefault(_component);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var onDOMContentLoadedTasks = [function () {
	var scrollTo = _component2.default.init('.js-scroll-to');
	console.log(scrollTo);
}];

if ('addEventListener' in window) window.addEventListener('DOMContentLoaded', function () {
	onDOMContentLoadedTasks.forEach(function (fn) {
		return fn();
	});
});

},{"./libs/component":2}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _defaults = require('./lib/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _componentPrototype = require('./lib/component-prototype');

var _componentPrototype2 = _interopRequireDefault(_componentPrototype);

function _interopRequireDefault(obj) {
	return obj && obj.__esModule ? obj : { default: obj };
}

var init = function init(sel, opts) {
	var els = [].slice.call(document.querySelectorAll(sel));

	if (!els.length) throw new Error('Scroll To cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(_componentPrototype2.default), {
		DOMElements: els,
		settings: Object.assign({}, _defaults2.default, opts)
	}).init();
};

exports.default = { init: init };

},{"./lib/component-prototype":3,"./lib/defaults":4}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _easing = require('./easing');

var EASING = _interopRequireWildcard(_easing);

function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};if (obj != null) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key];
            }
        }newObj.default = obj;return newObj;
    }
}

var TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'],
    INCREMENT_MS = 16;
var KEYCODES = [32, 13];

exports.default = {
    init: function init() {
        this.initNavItems();
        this.initListeners();
        this.initFocusable();
        return this;
    },
    initNavItems: function initNavItems() {
        this.navItems = this.DOMElements.map(function (item) {
            if (!document.querySelector(item.getAttribute('href'))) throw new Error('Scroll To cannot be initialised, a nav item target is missing');
            return {
                node: item,
                target: document.querySelector(item.getAttribute('href'))
            };
        });
    },
    initListeners: function initListeners() {
        var _this = this;

        this.navItems.forEach(function (el) {
            TRIGGER_EVENTS.forEach(function (ev) {
                el.node.addEventListener(ev, function (e) {
                    if (!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || e.which && e.which === 3) return;
                    e.preventDefault();
                    _this.scrollTo(el);
                }, false);
            });
        });
    },
    initFocusable: function initFocusable() {
        if (!this.settings.focus) return;

        var getFocusableChildren = function getFocusableChildren(node) {
            var focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

            return [].slice.call(node.querySelectorAll(focusableElements.join(','))).filter(function (child) {
                return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
            });
        };

        this.navItems.forEach(function (item) {
            item.focusableChildren = getFocusableChildren(item.target);
        });
    },
    scrollTo: function scrollTo(el) {
        var _this2 = this;

        var start = window.pageYOffset,
            end = el.target.offsetTop - this.settings.offset,
            change = end - start,
            duration = this.settings.speed,
            move = function move(amount) {
            document.documentElement.scrollTop = amount;
            document.body.parentNode.scrollTop = amount;
            document.body.scrollTop = amount;
        },
            currentTime = 0,
            animate = function animate() {
            currentTime += INCREMENT_MS;
            move(EASING[_this2.settings.easing](currentTime, start, change, duration));
            if (currentTime < duration) {
                window.requestAnimationFrame(animate.bind(_this2));
            } else {
                !!_this2.settings.pushState && !!window.history.pushState && window.history.pushState({ URL: el.node.getAttribute('href') }, '', el.node.getAttribute('href'));
                !!_this2.settings.focus && !!el.focusableChildren.length && window.setTimeout(function () {
                    el.focusableChildren[0].focus();
                }, 0);
                !!_this2.settings.callback && _this2.settings.callback();
            }
        };
        animate();
    }
};

},{"./easing":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    easing: 'easeInOutCubic',
    speed: 260, //duration to scroll the entire height of the document
    offset: 0,
    pushState: true,
    focus: true,
    callback: false
};

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var easeInQuad = exports.easeInQuad = function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
};

var easeOutQuad = exports.easeOutQuad = function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

var easeInOutQuad = exports.easeInOutQuad = function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * (--t * (t - 2) - 1) + b;
};

var easeInCubic = exports.easeInCubic = function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
};

var easeOutCubic = exports.easeOutCubic = function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

var easeInOutCubic = exports.easeInOutCubic = function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

var easeInQuart = exports.easeInQuart = function easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};

var easeOutQuart = exports.easeOutQuart = function easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

var easeInOutQuart = exports.easeInOutQuart = function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

var easeInQuint = exports.easeInQuint = function easeInQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};

var easeOutQuint = exports.easeOutQuint = function easeOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

var easeInOutQuint = exports.easeInOutQuint = function easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2Vhc2luZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBQSxhQUFBLFFBQUEsa0JBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsS0FBSSxXQUFXLFlBQUEsT0FBQSxDQUFBLElBQUEsQ0FBZixlQUFlLENBQWY7QUFDQSxTQUFBLEdBQUEsQ0FBQSxRQUFBO0FBRkQsQ0FBZ0MsQ0FBaEM7O0FBS0EsSUFBRyxzQkFBSCxNQUFBLEVBQWlDLE9BQUEsZ0JBQUEsQ0FBQSxrQkFBQSxFQUE0QyxZQUFNO0FBQUUseUJBQUEsT0FBQSxDQUFnQyxVQUFBLEVBQUEsRUFBQTtBQUFBLFNBQUEsSUFBQTtBQUFoQyxFQUFBO0FBQXBELENBQUE7Ozs7Ozs7OztBQ1BqQyxJQUFBLFlBQUEsUUFBQSxnQkFBQSxDQUFBOzs7O0FBQ0EsSUFBQSxzQkFBQSxRQUFBLDJCQUFBLENBQUE7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFBLEdBQUEsRUFBQSxJQUFBLEVBQWU7QUFDM0IsS0FBSSxNQUFNLEdBQUEsS0FBQSxDQUFBLElBQUEsQ0FBYyxTQUFBLGdCQUFBLENBQXhCLEdBQXdCLENBQWQsQ0FBVjs7QUFFQSxLQUFHLENBQUMsSUFBSixNQUFBLEVBQWdCLE1BQU0sSUFBQSxLQUFBLENBQU4sZ0VBQU0sQ0FBTjs7QUFFaEIsUUFBTyxPQUFBLE1BQUEsQ0FBYyxPQUFBLE1BQUEsQ0FB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Q0FBQSxHQUFMLENBQUEsSUFBUCxDQUFBO0FBRkcsQ0FBQTs7QUFLQSxJQUFNLGlCQUFBLFFBQUEsY0FBQSxHQUFpQixTQUFqQixjQUFpQixDQUFBLENBQUEsRUFBQSxDQUFBLEVBQUEsQ0FBQSxFQUFBLENBQUEsRUFBZ0I7QUFDMUMsUUFBSSxDQUFDLEtBQUcsSUFBSixDQUFBLElBQUosQ0FBQSxFQUFrQixPQUFPLElBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQVAsQ0FBQTtBQUNsQixXQUFPLElBQUEsQ0FBQSxJQUFLLENBQUMsS0FBRCxDQUFBLElBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFMLENBQUEsSUFBUCxDQUFBO0FBRkcsQ0FBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsImltcG9ydCBTY3JvbGxUbyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcclxuXHJcbmNvbnN0IG9uRE9NQ29udGVudExvYWRlZFRhc2tzID0gWygpID0+IHtcclxuXHRsZXQgc2Nyb2xsVG8gPSBTY3JvbGxUby5pbml0KCcuanMtc2Nyb2xsLXRvJyk7XHJcblx0Y29uc29sZS5sb2coc2Nyb2xsVG8pO1xyXG59XTtcclxuICAgIFxyXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xyXG5pbXBvcnQgY29tcG9uZW50UHJvdG90eXBlIGZyb20gJy4vbGliL2NvbXBvbmVudC1wcm90b3R5cGUnO1xyXG5cclxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcclxuXHRsZXQgZWxzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbCkpO1xyXG5cdFxyXG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCBUbyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XHJcblxyXG5cdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xyXG5cdFx0RE9NRWxlbWVudHM6IGVscyxcclxuXHRcdHNldHRpbmdzOiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0cywgb3B0cylcclxuXHR9KS5pbml0KCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgKiBhcyBFQVNJTkcgZnJvbSAnLi9lYXNpbmcnO1xyXG5cclxuY29uc3QgVFJJR0dFUl9FVkVOVFMgPSBbd2luZG93LlBvaW50ZXJFdmVudCA/ICdwb2ludGVyZG93bicgOiAnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLCAna2V5ZG93bicgXSxcclxuICAgICAgICBJTkNSRU1FTlRfTVMgPSAxNjtcclxuY29uc3QgS0VZQ09ERVMgPSBbMzIsIDEzXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGluaXQoKSB7XHJcbiAgICAgICAgdGhpcy5pbml0TmF2SXRlbXMoKTtcclxuICAgICAgICB0aGlzLmluaXRMaXN0ZW5lcnMoKTtcclxuICAgICAgICB0aGlzLmluaXRGb2N1c2FibGUoKTtcclxuICAgICAgICByZXR1cm4gdGhpcztcclxuICAgIH0sXHJcbiAgICBpbml0TmF2SXRlbXMoKXtcclxuICAgICAgICB0aGlzLm5hdkl0ZW1zID0gdGhpcy5ET01FbGVtZW50cy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGlmKCFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykpKSB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCBUbyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIGEgbmF2IGl0ZW0gdGFyZ2V0IGlzIG1pc3NpbmcnKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIG5vZGU6IGl0ZW0sXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaXRlbS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSlcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgIH0sXHJcbiAgICBpbml0TGlzdGVuZXJzKCl7XHJcbiAgICAgICAgdGhpcy5uYXZJdGVtcy5mb3JFYWNoKGVsID0+IHtcclxuICAgICAgICAgICAgVFJJR0dFUl9FVkVOVFMuZm9yRWFjaChldiA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbC5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghIWUua2V5Q29kZSAmJiAhfktFWUNPREVTLmluZGV4T2YoZS5rZXlDb2RlKSB8fCAoZS53aGljaCAmJiBlLndoaWNoID09PSAzKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNjcm9sbFRvKGVsKTtcclxuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9LFxyXG4gICAgaW5pdEZvY3VzYWJsZSgpe1xyXG4gICAgICAgIGlmKCF0aGlzLnNldHRpbmdzLmZvY3VzKSByZXR1cm47IFxyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCBnZXRGb2N1c2FibGVDaGlsZHJlbiA9IG5vZGUgPT4ge1xyXG4gICAgICAgICAgICBsZXQgZm9jdXNhYmxlRWxlbWVudHMgPSBbJ2FbaHJlZl0nLCAnYXJlYVtocmVmXScsICdpbnB1dDpub3QoW2Rpc2FibGVkXSknLCAnc2VsZWN0Om5vdChbZGlzYWJsZWRdKScsICd0ZXh0YXJlYTpub3QoW2Rpc2FibGVkXSknLCAnYnV0dG9uOm5vdChbZGlzYWJsZWRdKScsICdpZnJhbWUnLCAnb2JqZWN0JywgJ2VtYmVkJywgJ1tjb250ZW50ZWRpdGFibGVdJywgJ1t0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdKSddO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpLmZpbHRlcihjaGlsZCA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gISEoY2hpbGQub2Zmc2V0V2lkdGggfHwgY2hpbGQub2Zmc2V0SGVpZ2h0IHx8IGNoaWxkLmdldENsaWVudFJlY3RzKCkubGVuZ3RoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5uYXZJdGVtcy5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmZvY3VzYWJsZUNoaWxkcmVuID0gZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oaXRlbS50YXJnZXQpOyB9KTtcclxuICAgIH0sXHJcbiAgICBzY3JvbGxUbyhlbCl7XHJcbiAgICAgICAgbGV0IHN0YXJ0ID0gd2luZG93LnBhZ2VZT2Zmc2V0LFxyXG4gICAgICAgICAgICBlbmQgPSBlbC50YXJnZXQub2Zmc2V0VG9wIC0gdGhpcy5zZXR0aW5ncy5vZmZzZXQsXHJcbiAgICAgICAgICAgIGNoYW5nZSA9IGVuZCAtIHN0YXJ0LFxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHRoaXMuc2V0dGluZ3Muc3BlZWQsXHJcbiAgICAgICAgICAgIG1vdmUgPSBhbW91bnQgPT4ge1xyXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCA9IGFtb3VudDtcclxuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5zY3JvbGxUb3AgPSBhbW91bnQ7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGFtb3VudDtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3VycmVudFRpbWUgPSAwLFxyXG4gICAgICAgICAgICBhbmltYXRlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY3VycmVudFRpbWUgKz0gSU5DUkVNRU5UX01TO1xyXG4gICAgICAgICAgICAgICAgbW92ZShFQVNJTkdbdGhpcy5zZXR0aW5ncy5lYXNpbmddKGN1cnJlbnRUaW1lLCBzdGFydCwgY2hhbmdlLCBkdXJhdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lIDwgZHVyYXRpb24pIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGUuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICghIXRoaXMuc2V0dGluZ3MucHVzaFN0YXRlICYmICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IGVsLm5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJyl9LCAnJywgZWwubm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgKCEhdGhpcy5zZXR0aW5ncy5mb2N1cyAmJiAhIWVsLmZvY3VzYWJsZUNoaWxkcmVuLmxlbmd0aCkgJiYgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge2VsLmZvY3VzYWJsZUNoaWxkcmVuWzBdLmZvY3VzKCk7fSwgMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgISF0aGlzLnNldHRpbmdzLmNhbGxiYWNrICYmIHRoaXMuc2V0dGluZ3MuY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBhbmltYXRlKCk7XHJcbiAgICB9XHJcbn07XHJcbiIsImV4cG9ydCBkZWZhdWx0IHtcclxuICAgIGVhc2luZzogJ2Vhc2VJbk91dEN1YmljJyxcclxuICAgIHNwZWVkOiAyNjAsLy9kdXJhdGlvbiB0byBzY3JvbGwgdGhlIGVudGlyZSBoZWlnaHQgb2YgdGhlIGRvY3VtZW50XHJcbiAgICBvZmZzZXQ6IDAsXHJcbiAgICBwdXNoU3RhdGU6IHRydWUsXHJcbiAgICBmb2N1czogdHJ1ZSxcclxuICAgIGNhbGxiYWNrOiBmYWxzZVxyXG59OyIsImV4cG9ydCBjb25zdCBlYXNlSW5RdWFkID0gKHQsIGIsIGMsIGQpID0+IGMqKHQvPWQpKnQgKyBiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWFkID0gKHQsIGIsIGMsIGQpID0+IC1jICoodC89ZCkqKHQtMikgKyBiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1YWQgPSAodCwgYiwgYywgZCkgPT4ge1xyXG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQgKyBiO1xyXG4gICAgcmV0dXJuIC1jLzIgKiAoKC0tdCkqKHQtMikgLSAxKSArIGI7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZWFzZUluQ3ViaWMgPSAodCwgYiwgYywgZCkgPT4gYyoodC89ZCkqdCp0ICsgYjtcclxuXHJcbmV4cG9ydCBjb25zdCBlYXNlT3V0Q3ViaWMgPSAodCwgYiwgYywgZCkgPT4gIGMqKCh0PXQvZC0xKSp0KnQgKyAxKSArIGI7XHJcblxyXG5leHBvcnQgY29uc3QgZWFzZUluT3V0Q3ViaWMgPSAodCwgYiwgYywgZCkgPT4ge1xyXG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XHJcbiAgICByZXR1cm4gYy8yKigodC09MikqdCp0ICsgMikgKyBiO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGVhc2VJblF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IGMqKHQvPWQpKnQqdCp0ICsgYjtcclxuXHJcbmV4cG9ydCBjb25zdCBlYXNlT3V0UXVhcnQgPSAodCwgYiwgYywgZCkgPT4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xyXG5cclxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IHtcclxuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCArIGI7XHJcbiAgICByZXR1cm4gLWMvMiAqICgodC09MikqdCp0KnQgLSAyKSArIGI7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZWFzZUluUXVpbnQgPSAodCwgYiwgYywgZCkgPT4gYyooKHQ9dC9kLTEpKnQqdCp0KnQgKyAxKSArIGI7XHJcblxyXG5leHBvcnQgY29uc3QgZWFzZU91dFF1aW50ID0gKHQsIGIsIGMsIGQpID0+IHtcclxuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcclxuICAgIHJldHVybiBjLzIqKCh0LT0yKSp0KnQqdCp0ICsgMikgKyBiO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dFF1aW50ID0gKHQsIGIsIGMsIGQpID0+IHtcclxuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcclxuICAgIHJldHVybiBjLzIqKCh0LT0yKSp0KnQqdCp0ICsgMikgKyBiO1xyXG59OyJdfQ==
