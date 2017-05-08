(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL3NyYy9hcHAuanMiLCJleGFtcGxlL3NyYy9saWJzL2NvbXBvbmVudC9pbmRleC5qcyIsImV4YW1wbGUvc3JjL2xpYnMvY29tcG9uZW50L2xpYi9jb21wb25lbnQtcHJvdG90eXBlLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2RlZmF1bHRzLmpzIiwiZXhhbXBsZS9zcmMvbGlicy9jb21wb25lbnQvbGliL2Vhc2luZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7Ozs7Ozs7O0FBRUEsSUFBTSwyQkFBMkIsWUFBTSxBQUN0QztLQUFJLFdBQVcsb0JBQUEsQUFBUyxLQUF4QixBQUFlLEFBQWMsQUFDN0I7U0FBQSxBQUFRLElBQVIsQUFBWSxBQUNaO0FBSEQsQUFBZ0MsQ0FBQTs7QUFLaEMsSUFBRyxzQkFBSCxBQUF5QixlQUFRLEFBQU8saUJBQVAsQUFBd0Isb0JBQW9CLFlBQU0sQUFBRTt5QkFBQSxBQUF3QixRQUFRLFVBQUEsQUFBQyxJQUFEO1NBQUEsQUFBUTtBQUF4QyxBQUFnRDtBQUFwRyxDQUFBOzs7Ozs7Ozs7QUNQakM7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNLE9BQU8sU0FBUCxBQUFPLEtBQUEsQUFBQyxLQUFELEFBQU0sTUFBUyxBQUMzQjtLQUFJLE1BQU0sR0FBQSxBQUFHLE1BQUgsQUFBUyxLQUFLLFNBQUEsQUFBUyxpQkFBakMsQUFBVSxBQUFjLEFBQTBCLEFBRWxEOztLQUFHLENBQUMsSUFBSixBQUFRLFFBQVEsTUFBTSxJQUFBLEFBQUksTUFBVixBQUFNLEFBQVUsQUFFaEM7O2VBQU8sQUFBTyxPQUFPLE9BQUEsQUFBTyw0QkFBckI7ZUFBaUQsQUFDMUMsQUFDYjtZQUFVLE9BQUEsQUFBTyxPQUFQLEFBQWMsd0JBRmxCLEFBQWlELEFBRTdDLEFBQTRCO0FBRmlCLEFBQ3ZELEVBRE0sRUFBUCxBQUFPLEFB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SSxHQUFKLEFBQU8sR0FBUCxBQUFVLEdBQU0sQUFDeEM7UUFBSSxDQUFDLEtBQUcsSUFBSixBQUFNLEtBQVYsQUFBZSxHQUFHLE9BQU8sSUFBQSxBQUFFLElBQUYsQUFBSSxJQUFKLEFBQU0sSUFBTixBQUFRLElBQVIsQUFBVSxJQUFWLEFBQVksSUFBbkIsQUFBdUIsQUFDekM7V0FBTyxJQUFBLEFBQUUsS0FBRyxDQUFDLEtBQUQsQUFBSSxLQUFKLEFBQU8sSUFBUCxBQUFTLElBQVQsQUFBVyxJQUFYLEFBQWEsSUFBbEIsQUFBc0IsS0FBN0IsQUFBa0MsQUFDckM7QUFITTs7QUFLQSxJQUFNLDBDQUFpQixTQUFqQixBQUFpQixlQUFBLEFBQUMsR0FBRCxBQUFJLEdBQUosQUFBTyxHQUFQLEFBQVUsR0FBTSxBQUMxQztRQUFJLENBQUMsS0FBRyxJQUFKLEFBQU0sS0FBVixBQUFlLEdBQUcsT0FBTyxJQUFBLEFBQUUsSUFBRixBQUFJLElBQUosQUFBTSxJQUFOLEFBQVEsSUFBUixBQUFVLElBQVYsQUFBWSxJQUFuQixBQUF1QixBQUN6QztXQUFPLElBQUEsQUFBRSxLQUFHLENBQUMsS0FBRCxBQUFJLEtBQUosQUFBTyxJQUFQLEFBQVMsSUFBVCxBQUFXLElBQVgsQUFBYSxJQUFsQixBQUFzQixLQUE3QixBQUFrQyxBQUNyQztBQUhNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBTY3JvbGxUbyBmcm9tICcuL2xpYnMvY29tcG9uZW50JztcblxuY29uc3Qgb25ET01Db250ZW50TG9hZGVkVGFza3MgPSBbKCkgPT4ge1xuXHRsZXQgc2Nyb2xsVG8gPSBTY3JvbGxUby5pbml0KCcuanMtc2Nyb2xsLXRvJyk7XG5cdGNvbnNvbGUubG9nKHNjcm9sbFRvKTtcbn1dO1xuICAgIFxuaWYoJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdykgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7IG9uRE9NQ29udGVudExvYWRlZFRhc2tzLmZvckVhY2goKGZuKSA9PiBmbigpKTsgfSk7IiwiaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vbGliL2RlZmF1bHRzJztcbmltcG9ydCBjb21wb25lbnRQcm90b3R5cGUgZnJvbSAnLi9saWIvY29tcG9uZW50LXByb3RvdHlwZSc7XG5cbmNvbnN0IGluaXQgPSAoc2VsLCBvcHRzKSA9PiB7XG5cdGxldCBlbHMgPSBbXS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsKSk7XG5cdFxuXHRpZighZWxzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdTY3JvbGwgVG8gY2Fubm90IGJlIGluaXRpYWxpc2VkLCBubyBhdWdtZW50YWJsZSBlbGVtZW50cyBmb3VuZCcpO1xuXG5cdHJldHVybiBPYmplY3QuYXNzaWduKE9iamVjdC5jcmVhdGUoY29tcG9uZW50UHJvdG90eXBlKSwge1xuXHRcdERPTUVsZW1lbnRzOiBlbHMsXG5cdFx0c2V0dGluZ3M6IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRzLCBvcHRzKVxuXHR9KS5pbml0KCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7IGluaXQgfTsiLCJpbXBvcnQgKiBhcyBFQVNJTkcgZnJvbSAnLi9lYXNpbmcnO1xuXG5jb25zdCBUUklHR0VSX0VWRU5UUyA9IFt3aW5kb3cuUG9pbnRlckV2ZW50ID8gJ3BvaW50ZXJkb3duJyA6ICdvbnRvdWNoc3RhcnQnIGluIHdpbmRvdyA/ICd0b3VjaHN0YXJ0JyA6ICdjbGljaycsICdrZXlkb3duJyBdLFxuICAgICAgICBJTkNSRU1FTlRfTVMgPSAxNjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdE5hdkl0ZW1zKCk7XG4gICAgICAgIHRoaXMuaW5pdExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLmluaXRGb2N1c2FibGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcbiAgICBpbml0TmF2SXRlbXMoKXtcbiAgICAgICAgdGhpcy5uYXZJdGVtcyA9IHRoaXMuRE9NRWxlbWVudHMubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgaWYoIWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoaXRlbS5nZXRBdHRyaWJ1dGUoJ2hyZWYnKSkpIHRocm93IG5ldyBFcnJvcignU2Nyb2xsIFRvIGNhbm5vdCBiZSBpbml0aWFsaXNlZCwgYSBuYXYgaXRlbSB0YXJnZXQgaXMgbWlzc2luZycpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBub2RlOiBpdGVtLFxuICAgICAgICAgICAgICAgIHRhcmdldDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihpdGVtLmdldEF0dHJpYnV0ZSgnaHJlZicpKVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBpbml0TGlzdGVuZXJzKCl7XG4gICAgICAgIHRoaXMubmF2SXRlbXMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgICBUUklHR0VSX0VWRU5UUy5mb3JFYWNoKGV2ID0+IHtcbiAgICAgICAgICAgICAgICBlbC5ub2RlLmFkZEV2ZW50TGlzdGVuZXIoZXYsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG8oZWwpO1xuICAgICAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGluaXRGb2N1c2FibGUoKXtcbiAgICAgICAgaWYoIXRoaXMuc2V0dGluZ3MuZm9jdXMpIHJldHVybjsgXG4gICAgICAgIFxuICAgICAgICBsZXQgZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4gPSBub2RlID0+IHtcbiAgICAgICAgICAgIGxldCBmb2N1c2FibGVFbGVtZW50cyA9IFsnYVtocmVmXScsICdhcmVhW2hyZWZdJywgJ2lucHV0Om5vdChbZGlzYWJsZWRdKScsICdzZWxlY3Q6bm90KFtkaXNhYmxlZF0pJywgJ3RleHRhcmVhOm5vdChbZGlzYWJsZWRdKScsICdidXR0b246bm90KFtkaXNhYmxlZF0pJywgJ2lmcmFtZScsICdvYmplY3QnLCAnZW1iZWQnLCAnW2NvbnRlbnRlZGl0YWJsZV0nLCAnW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0pJ107XG5cbiAgICAgICAgICAgIHJldHVybiBbXS5zbGljZS5jYWxsKG5vZGUucXVlcnlTZWxlY3RvckFsbChmb2N1c2FibGVFbGVtZW50cy5qb2luKCcsJykpKS5maWx0ZXIoY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiAhIShjaGlsZC5vZmZzZXRXaWR0aCB8fCBjaGlsZC5vZmZzZXRIZWlnaHQgfHwgY2hpbGQuZ2V0Q2xpZW50UmVjdHMoKS5sZW5ndGgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5uYXZJdGVtcy5mb3JFYWNoKGl0ZW0gPT4geyBpdGVtLmZvY3VzYWJsZUNoaWxkcmVuID0gZ2V0Rm9jdXNhYmxlQ2hpbGRyZW4oaXRlbS50YXJnZXQpOyB9KTtcbiAgICB9LFxuICAgIHNjcm9sbFRvKGVsKXtcbiAgICAgICAgbGV0IHN0YXJ0ID0gd2luZG93LnBhZ2VZT2Zmc2V0LFxuICAgICAgICAgICAgZW5kID0gZWwudGFyZ2V0Lm9mZnNldFRvcCAtIHRoaXMuc2V0dGluZ3Mub2Zmc2V0LFxuICAgICAgICAgICAgY2hhbmdlID0gZW5kIC0gc3RhcnQsXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHRoaXMuc2V0dGluZ3Muc3BlZWQsXG4gICAgICAgICAgICBtb3ZlID0gYW1vdW50ID0+IHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gYW1vdW50O1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucGFyZW50Tm9kZS5zY3JvbGxUb3AgPSBhbW91bnQ7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgPSBhbW91bnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY3VycmVudFRpbWUgPSAwLFxuICAgICAgICAgICAgYW5pbWF0ZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBjdXJyZW50VGltZSArPSBJTkNSRU1FTlRfTVM7XG4gICAgICAgICAgICAgICAgbW92ZShFQVNJTkdbdGhpcy5zZXR0aW5ncy5lYXNpbmddKGN1cnJlbnRUaW1lLCBzdGFydCwgY2hhbmdlLCBkdXJhdGlvbikpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyZW50VGltZSA8IGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYW5pbWF0ZS5iaW5kKHRoaXMpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoISF0aGlzLnNldHRpbmdzLnB1c2hTdGF0ZSAmJiAhIXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSkgJiYgd2luZG93Lmhpc3RvcnkucHVzaFN0YXRlKHsgVVJMOiBlbC5ub2RlLmdldEF0dHJpYnV0ZSgnaHJlZicpfSwgJycsIGVsLm5vZGUuZ2V0QXR0cmlidXRlKCdocmVmJykpO1xuICAgICAgICAgICAgICAgICAgICAoISF0aGlzLnNldHRpbmdzLmZvY3VzICYmICEhZWwuZm9jdXNhYmxlQ2hpbGRyZW4ubGVuZ3RoKSAmJiB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7ZWwuZm9jdXNhYmxlQ2hpbGRyZW5bMF0uZm9jdXMoKTt9LCAwKTtcbiAgICAgICAgICAgICAgICAgICAgISF0aGlzLnNldHRpbmdzLmNhbGxiYWNrICYmIHRoaXMuc2V0dGluZ3MuY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICBhbmltYXRlKCk7XG4gICAgfVxufTtcbiIsImV4cG9ydCBkZWZhdWx0IHtcbiAgICBlYXNpbmc6ICdlYXNlSW5PdXRDdWJpYycsXG4gICAgc3BlZWQ6IDI2MCwvL2R1cmF0aW9uIHRvIHNjcm9sbCB0aGUgZW50aXJlIGhlaWdodCBvZiB0aGUgZG9jdW1lbnRcbiAgICBvZmZzZXQ6IDAsXG4gICAgcHVzaFN0YXRlOiB0cnVlLFxuICAgIGZvY3VzOiB0cnVlLFxuICAgIGNhbGxiYWNrOiBmYWxzZVxufTsiLCJleHBvcnQgY29uc3QgZWFzZUluUXVhZCA9ICh0LCBiLCBjLCBkKSA9PiBjKih0Lz1kKSp0ICsgYjtcblxuZXhwb3J0IGNvbnN0IGVhc2VPdXRRdWFkID0gKHQsIGIsIGMsIGQpID0+IC1jICoodC89ZCkqKHQtMikgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZUluT3V0UXVhZCA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQgKyBiO1xuICAgIHJldHVybiAtYy8yICogKCgtLXQpKih0LTIpIC0gMSkgKyBiO1xufTtcblxuZXhwb3J0IGNvbnN0IGVhc2VJbkN1YmljID0gKHQsIGIsIGMsIGQpID0+IGMqKHQvPWQpKnQqdCArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlT3V0Q3ViaWMgPSAodCwgYiwgYywgZCkgPT4gIGMqKCh0PXQvZC0xKSp0KnQgKyAxKSArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5PdXRDdWJpYyA9ICh0LCBiLCBjLCBkKSA9PiB7XG4gICAgaWYgKCh0Lz1kLzIpIDwgMSkgcmV0dXJuIGMvMip0KnQqdCArIGI7XG4gICAgcmV0dXJuIGMvMiooKHQtPTIpKnQqdCArIDIpICsgYjtcbn07XG5cbmV4cG9ydCBjb25zdCBlYXNlSW5RdWFydCA9ICh0LCBiLCBjLCBkKSA9PiBjKih0Lz1kKSp0KnQqdCArIGI7XG5cbmV4cG9ydCBjb25zdCBlYXNlT3V0UXVhcnQgPSAodCwgYiwgYywgZCkgPT4gLWMgKiAoKHQ9dC9kLTEpKnQqdCp0IC0gMSkgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZUluT3V0UXVhcnQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCArIGI7XG4gICAgcmV0dXJuIC1jLzIgKiAoKHQtPTIpKnQqdCp0IC0gMikgKyBiO1xufTtcblxuZXhwb3J0IGNvbnN0IGVhc2VJblF1aW50ID0gKHQsIGIsIGMsIGQpID0+IGMqKCh0PXQvZC0xKSp0KnQqdCp0ICsgMSkgKyBiO1xuXG5leHBvcnQgY29uc3QgZWFzZU91dFF1aW50ID0gKHQsIGIsIGMsIGQpID0+IHtcbiAgICBpZiAoKHQvPWQvMikgPCAxKSByZXR1cm4gYy8yKnQqdCp0KnQqdCArIGI7XG4gICAgcmV0dXJuIGMvMiooKHQtPTIpKnQqdCp0KnQgKyAyKSArIGI7XG59O1xuXG5leHBvcnQgY29uc3QgZWFzZUluT3V0UXVpbnQgPSAodCwgYiwgYywgZCkgPT4ge1xuICAgIGlmICgodC89ZC8yKSA8IDEpIHJldHVybiBjLzIqdCp0KnQqdCp0ICsgYjtcbiAgICByZXR1cm4gYy8yKigodC09MikqdCp0KnQqdCArIDIpICsgYjtcbn07Il19
