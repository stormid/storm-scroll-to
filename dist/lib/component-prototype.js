import * as EASING from './easing';

const TRIGGER_EVENTS = [window.PointerEvent ? 'pointerdown' : 'ontouchstart' in window ? 'touchstart' : 'click', 'keydown' ],
        INCREMENT_MS = 16;
const KEYCODES = [32, 13];

export default {
    init() {
        this.initNavItems();
        this.initListeners();
        this.initFocusable();
        return this;
    },
    initNavItems(){
        this.navItems = this.DOMElements.map(item => {
            if(!document.querySelector(item.getAttribute('href'))) throw new Error('Scroll To cannot be initialised, a nav item target is missing');
            return {
                node: item,
                target: document.querySelector(item.getAttribute('href'))
            };
        });
    },
    initListeners(){
        this.navItems.forEach(el => {
            TRIGGER_EVENTS.forEach(ev => {
                el.node.addEventListener(ev, e => {
                    if (!!e.keyCode && !~KEYCODES.indexOf(e.keyCode) || (e.which && e.which === 3)) return;
                    e.preventDefault();
                    this.scrollTo(el);
                }, false);
            });
        });
    },
    initFocusable(){
        if(!this.settings.focus) return; 
        
        let getFocusableChildren = node => {
            let focusableElements = ['a[href]', 'area[href]', 'input:not([disabled])', 'select:not([disabled])', 'textarea:not([disabled])', 'button:not([disabled])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex="-1"])'];

            return [].slice.call(node.querySelectorAll(focusableElements.join(','))).filter(child => {
                return !!(child.offsetWidth || child.offsetHeight || child.getClientRects().length);
            });
        };

        this.navItems.forEach(item => { item.focusableChildren = getFocusableChildren(item.target); });
    },
    scrollTo(el){
        let start = window.pageYOffset,
            end = el.target.offsetTop - this.settings.offset,
            change = end - start,
            duration = this.settings.speed,
            move = amount => {
                document.documentElement.scrollTop = amount;
                document.body.parentNode.scrollTop = amount;
                document.body.scrollTop = amount;
            },
            currentTime = 0,
            animate = () => {
                currentTime += INCREMENT_MS;
                move(EASING[this.settings.easing](currentTime, start, change, duration));
                if (currentTime < duration) {
                    window.requestAnimationFrame(animate.bind(this));
                } else {
                    (!!this.settings.pushState && !!window.history.pushState) && window.history.pushState({ URL: el.node.getAttribute('href')}, '', el.node.getAttribute('href'));
                    (!!this.settings.focus && !!el.focusableChildren.length) && window.setTimeout(() => {el.focusableChildren[0].focus();}, 0);
                    !!this.settings.callback && this.settings.callback();
                }
            };
        animate();
    }
};
