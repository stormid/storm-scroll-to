/**
 * @name storm-scroll-to: Smooth scroll anchor links, update the URL and focus on the first child node of the target
 * @version 1.0.9: Fri, 09 Mar 2018 14:44:04 GMT
 * @author stormid
 * @license MIT
 */
(function(root, factory) {
   var mod = {
       exports: {}
   };
   if (typeof exports !== 'undefined'){
       mod.exports = exports
       factory(mod.exports)
       module.exports = mod.exports.default
   } else {
       factory(mod.exports);
       root.StormScrollTo = mod.exports.default
   }

}(this, function(exports) {
   'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var defaults = {
    easing: 'easeInOutCubic',
    speed: 260, //duration to scroll the entire height of the document
    offset: 0,
    pushState: true,
    focus: true,
    callback: false
};

var easeInQuad = function easeInQuad(t, b, c, d) {
    return c * (t /= d) * t + b;
};

var easeOutQuad = function easeOutQuad(t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

var easeInOutQuad = function easeInOutQuad(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t + b;
    return -c / 2 * (--t * (t - 2) - 1) + b;
};

var easeInCubic = function easeInCubic(t, b, c, d) {
    return c * (t /= d) * t * t + b;
};

var easeOutCubic = function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

var easeInOutCubic = function easeInOutCubic(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t + 2) + b;
};

var easeInQuart = function easeInQuart(t, b, c, d) {
    return c * (t /= d) * t * t * t + b;
};

var easeOutQuart = function easeOutQuart(t, b, c, d) {
    return -c * ((t = t / d - 1) * t * t * t - 1) + b;
};

var easeInOutQuart = function easeInOutQuart(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
    return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
};

var easeInQuint = function easeInQuint(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
};

var easeOutQuint = function easeOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

var easeInOutQuint = function easeInOutQuint(t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
};

var EASING = Object.freeze({
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInOutQuad: easeInOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInOutCubic: easeInOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    easeInOutQuart: easeInOutQuart,
    easeInQuint: easeInQuint,
    easeOutQuint: easeOutQuint,
    easeInOutQuint: easeInOutQuint
});

var TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown'];
var INCREMENT_MS = 16;

var componentPrototype = {
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

var init = function init(sel, opts) {
    var els = [].slice.call(document.querySelectorAll(sel));

    if (!els.length) throw new Error('Scroll To cannot be initialised, no augmentable elements found');

    return Object.assign(Object.create(componentPrototype), {
        DOMElements: els,
        settings: Object.assign({}, defaults, opts)
    }).init();
};

var index = { init: init };

exports.default = index;;
}));
