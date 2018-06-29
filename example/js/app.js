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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2Vhc2luZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBQSxhQUFBLFFBQUEsa0JBQUEsQ0FBQTs7Ozs7Ozs7QUFFQSxJQUFNLDBCQUEwQixDQUFDLFlBQU07QUFDdEMsS0FBSSxXQUFXLFlBQUEsT0FBQSxDQUFBLElBQUEsQ0FBZixlQUFlLENBQWY7QUFDQSxTQUFBLEdBQUEsQ0FBQSxRQUFBO0FBRkQsQ0FBZ0MsQ0FBaEM7O0FBS0EsSUFBRyxzQkFBSCxNQUFBLEVBQWlDLE9BQUEsZ0JBQUEsQ0FBQSxrQkFBQSxFQUE0QyxZQUFNO0FBQUUseUJBQUEsT0FBQSxDQUFnQyxVQUFBLEVBQUEsRUFBQTtBQUFBLFNBQUEsSUFBQTtBQUFoQyxFQUFBO0FBQXBELENBQUE7Ozs7Ozs7OztBQ1BqQyxJQUFBLFlBQUEsUUFBQSxnQkFBQSxDQUFBOzs7O0FBQ0EsSUFBQSxzQkFBQSxRQUFBLDJCQUFBLENBQUE7Ozs7Ozs7O0FBRUEsSUFBTSxPQUFPLFNBQVAsSUFBTyxDQUFBLEdBQUEsRUFBQSxJQUFBLEVBQWU7QUFDM0IsS0FBSSxNQUFNLEdBQUEsS0FBQSxDQUFBLElBQUEsQ0FBYyxTQUFBLGdCQUFBLENBQXhCLEdBQXdCLENBQWQsQ0FBVjs7QUFFQSxLQUFHLENBQUMsSUFBSixNQUFBLEVBQWdCLE1BQU0sSUFBQSxLQUFBLENBQU4sZ0VBQU0sQ0FBTjs7QUFFaEIsUUFBTyxPQUFBLE1BQUEsQ0FBYyxPQUFBLE1BQUEsQ0FB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LE9BQU8sSUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBUCxDQUFBO0FBQ2xCLFdBQU8sSUFBQSxDQUFBLElBQUssQ0FBQyxLQUFELENBQUEsSUFBQSxDQUFBLEdBQUEsQ0FBQSxHQUFBLENBQUEsR0FBQSxDQUFBLEdBQUwsQ0FBQSxJQUFQLENBQUE7QUFGRyxDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IFNjcm9sbFRvIGZyb20gJy4vbGlicy9jb21wb25lbnQnO1xuXG5jb25zdCBvbkRPTUNvbnRlbnRMb2FkZWRUYXNrcyA9IFsoKSA9PiB7XG5cdGxldCBzY3JvbGxUbyA9IFNjcm9sbFRvLmluaXQoJy5qcy1zY3JvbGwtdG8nKTtcblx0Y29uc29sZS5sb2coc2Nyb2xsVG8pO1xufV07XG4gICAgXG5pZignYWRkRXZlbnRMaXN0ZW5lcicgaW4gd2luZG93KSB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHsgb25ET01Db250ZW50TG9hZGVkVGFza3MuZm9yRWFjaCgoZm4pID0+IGZuKCkpOyB9KTsiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9saWIvZGVmYXVsdHMnO1xuaW1wb3J0IGNvbXBvbmVudFByb3RvdHlwZSBmcm9tICcuL2xpYi9jb21wb25lbnQtcHJvdG90eXBlJztcblxuY29uc3QgaW5pdCA9IChzZWwsIG9wdHMpID0+IHtcblx0bGV0IGVscyA9IFtdLnNsaWNlLmNhbGwoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWwpKTtcblx0XG5cdGlmKCFlbHMubGVuZ3RoKSB0aHJvdyBuZXcgRXJyb3IoJ1Njcm9sbCBUbyBjYW5ub3QgYmUgaW5pdGlhbGlzZWQsIG5vIGF1Z21lbnRhYmxlIGVsZW1lbnRzIGZvdW5kJyk7XG5cblx0cmV0dXJuIE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShjb21wb25lbnRQcm90b3R5cGUpLCB7XG5cdFx0RE9NRWxlbWVudHM6IGVscyxcblx0XHRzZXR0aW5nczogT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdHMsIG9wdHMpXG5cdH0pLmluaXQoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHsgaW5pdCB9OyIsImltcG9ydCAqIGFzIEVBU0lORyBmcm9tICcuL2Vhc2luZyc7XG5cbmNvbnN0IFRSSUdHRVJfRVZFTlRTID0gW3dpbmRvdy5Qb2ludGVyRXZlbnQgPyAncG9pbnRlcmRvd24nIDogJ29udG91Y2hzdGFydCcgaW4gd2luZG93ID8gJ3RvdWNoc3RhcnQnIDogJ2NsaWNrJywgJ2tleWRvd24nIF0sXG4gICAgICAgIElOQ1JFTUVOVF9NUyA9IDE2O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgaW5pdCgpIHtcbiAgICAgICAgdGhpcy5pbml0TmF2SXRlbXMoKTtcbiAgICAgICAgdGhpcy5pbml0TGlzdGVuZXJzKCk7XG4gICAgICAgIHRoaXMuaW5pdEZvY3VzYWJsZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9LFxuICAgIGluaXROYXZJdGVtcygpe1xuICAgICAgICB0aGlzLm5hdkl0ZW1zID0gdGhpcy5ET01FbGVtZW50cy5tYXAoaXRlbSA9PiB7XG4gICAgICAgICAgICBpZighZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpdGVtLmdldEF0dHJpYnV0ZSgnaHJlZicpKSkgdGhyb3cgbmV3IEVycm9yKCdTY3JvbGwgVG8gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBhIG5hdiBpdGVtIHRhcmdldCBpcyBtaXNzaW5nJyk7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIG5vZGU6IGl0ZW0sXG4gICAgICAgICAgICAgICAgdGFyZ2V0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGl0ZW0uZ2V0QXR0cmlidXRlKCdocmVmJykpXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGluaXRMaXN0ZW5lcnMoKXtcbiAgICAgICAgdGhpcy5uYXZJdGVtcy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgICAgIFRSSUdHRVJfRVZFTlRTLmZvckVhY2goZXYgPT4ge1xuICAgICAgICAgICAgICAgIGVsLm5vZGUuYWRkRXZlbnRMaXN0ZW5lcihldiwgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUbyhlbCk7XG4gICAgICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG4gICAgaW5pdEZvY3VzYWJsZSgpe1xuICAgICAgICBpZighdGhpcy5zZXR0aW5ncy5mb2N1cykgcmV0dXJuOyBcbiAgICAgICAgXG4gICAgICAgIGxldCBnZXRGb2N1c2FibGVDaGlsZHJlbiA9IG5vZGUgPT4ge1xuICAgICAgICAgICAgbGV0IGZvY3VzYWJsZUVsZW1lbnRzID0gWydhW2hyZWZdJywgJ2FyZWFbaHJlZl0nLCAnaW5wdXQ6bm90KFtkaXNhYmxlZF0pJywgJ3NlbGVjdDpub3QoW2Rpc2FibGVkXSknLCAndGV4dGFyZWE6bm90KFtkaXNhYmxlZF0pJywgJ2J1dHRvbjpub3QoW2Rpc2FibGVkXSknLCAnaWZyYW1lJywgJ29iamVjdCcsICdlbWJlZCcsICdbY29udGVudGVkaXRhYmxlXScsICdbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXSknXTtcblxuICAgICAgICAgICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwobm9kZS5xdWVyeVNlbGVjdG9yQWxsKGZvY3VzYWJsZUVsZW1lbnRzLmpvaW4oJywnKSkpLmZpbHRlcihjaGlsZCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhKGNoaWxkLm9mZnNldFdpZHRoIHx8IGNoaWxkLm9mZnNldEhlaWdodCB8fCBjaGlsZC5nZXRDbGllbnRSZWN0cygpLmxlbmd0aCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLm5hdkl0ZW1zLmZvckVhY2goaXRlbSA9PiB7IGl0ZW0uZm9jdXNhYmxlQ2hpbGRyZW4gPSBnZXRGb2N1c2FibGVDaGlsZHJlbihpdGVtLnRhcmdldCk7IH0pO1xuICAgIH0sXG4gICAgc2Nyb2xsVG8oZWwpe1xuICAgICAgICBsZXQgc3RhcnQgPSB3aW5kb3cucGFnZVlPZmZzZXQsXG4gICAgICAgICAgICBlbmQgPSBlbC50YXJnZXQub2Zmc2V0VG9wIC0gdGhpcy5zZXR0aW5ncy5vZmZzZXQsXG4gICAgICAgICAgICBjaGFuZ2UgPSBlbmQgLSBzdGFydCxcbiAgICAgICAgICAgIGR1cmF0aW9uID0gdGhpcy5zZXR0aW5ncy5zcGVlZCxcbiAgICAgICAgICAgIG1vdmUgPSBhbW91bnQgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3AgPSBhbW91bnQ7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5wYXJlbnROb2RlLnNjcm9sbFRvcCA9IGFtb3VudDtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IGFtb3VudDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXJyZW50VGltZSA9IDAsXG4gICAgICAgICAgICBhbmltYXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRUaW1lICs9IElOQ1JFTUVOVF9NUztcbiAgICAgICAgICAgICAgICBtb3ZlKEVBU0lOR1t0aGlzLnNldHRpbmdzLmVhc2luZ10oY3VycmVudFRpbWUsIHN0YXJ0LCBjaGFuZ2UsIGR1cmF0aW9uKSk7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRUaW1lIDwgZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShhbmltYXRlLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICghIXRoaXMuc2V0dGluZ3MucHVzaFN0YXRlICYmICEhd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKSAmJiB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUoeyBVUkw6IGVsLm5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJyl9LCAnJywgZWwubm9kZS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSk7XG4gICAgICAgICAgICAgICAgICAgICghIXRoaXMuc2V0dGluZ3MuZm9jdXMgJiYgISFlbC5mb2N1c2FibGVDaGlsZHJlbi5sZW5ndGgpICYmIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtlbC5mb2N1c2FibGVDaGlsZHJlblswXS5mb2N1cygpO30sIDApO1xuICAgICAgICAgICAgICAgICAgICAhIXRoaXMuc2V0dGluZ3MuY2FsbGJhY2sgJiYgdGhpcy5zZXR0aW5ncy5jYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIGFuaW1hdGUoKTtcbiAgICB9XG59O1xuIiwiZXhwb3J0IGRlZmF1bHQge1xuICAgIGVhc2luZzogJ2Vhc2VJbk91dEN1YmljJyxcbiAgICBzcGVlZDogMjYwLC8vZHVyYXRpb24gdG8gc2Nyb2xsIHRoZSBlbnRpcmUgaGVpZ2h0IG9mIHRoZSBkb2N1bWVudFxuICAgIG9mZnNldDogMCxcbiAgICBwdXNoU3RhdGU6IHRydWUsXG4gICAgZm9jdXM6IHRydWUsXG4gICAgY2FsbGJhY2s6IGZhbHNlXG59OyIsImV4cG9ydCBjb25zdCBlYXNlSW5RdWFkID0gKHQsIGIsIGMsIGQpID0+IGMqKHQvPWQpKnQgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZU91dFF1YWQgPSAodCwgYiwgYywgZCkgPT4gLWMgKih0Lz1kKSoodC0yKSArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRRdWFkID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCArIGI7XG4gICAgcmV0dXJuIC1jLzIgKiAoKC0tdCkqKHQtMikgLSAxKSArIGI7XG59O1xuXG5leHBvcnQgY29uc3QgZWFzZUluQ3ViaWMgPSAodCwgYiwgYywgZCkgPT4gYyoodC89ZCkqdCp0ICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VPdXRDdWJpYyA9ICh0LCBiLCBjLCBkKSA9PiAgYyooKHQ9dC9kLTEpKnQqdCArIDEpICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VJbk91dEN1YmljID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0ICsgYjtcbiAgICByZXR1cm4gYy8yKigodC09MikqdCp0ICsgMikgKyBiO1xufTtcblxuZXhwb3J0IGNvbnN0IGVhc2VJblF1YXJ0ID0gKHQsIGIsIGMsIGQpID0+IGMqKHQvPWQpKnQqdCp0ICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWFydCA9ICh0LCBiLCBjLCBkKSA9PiAtYyAqICgodD10L2QtMSkqdCp0KnQgLSAxKSArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRRdWFydCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCp0ICsgYjtcbiAgICByZXR1cm4gLWMvMiAqICgodC09MikqdCp0KnQgLSAyKSArIGI7XG59O1xuXG5leHBvcnQgY29uc3QgZWFzZUluUXVpbnQgPSAodCwgYiwgYywgZCkgPT4gYyooKHQ9dC9kLTEpKnQqdCp0KnQgKyAxKSArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlT3V0UXVpbnQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcbiAgICByZXR1cm4gYy8yKigodC09MikqdCp0KnQqdCArIDIpICsgYjtcbn07XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRRdWludCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCp0KnQgKyBiO1xuICAgIHJldHVybiBjLzIqKCh0LT0yKSp0KnQqdCp0ICsgMikgKyBiO1xufTsiXX0=
