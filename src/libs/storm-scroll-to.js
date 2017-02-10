/**
 * @name storm-scroll-to: Smooth scroll anchor links, update the URL and focus on the first child node of the target
 * @version 0.2.1: Thu, 05 Jan 2017 16:03:06 GMT
 * @author mjbp
 * @license MIT
 */
const triggerEvents = ['click', 'keydown'],
	CONSTANTS = {
		EASING: {//https://github.com/danro/jquery-easing/blob/master/jquery.easing.js
			easeInQuad(t, b, c, d) { return c*(t/=d)*t + b; },
			easeOutQuad (t, b, c, d) { return -c *(t/=d)*(t-2) + b; },
			easeInOutQuad (t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t + b;
				return -c/2 * ((--t)*(t-2) - 1) + b;
			},
			easeInCubic (t, b, c, d) { return c*(t/=d)*t*t + b; },
			easeOutCubic (t, b, c, d) { return c*((t=t/d-1)*t*t + 1) + b; },
			easeInOutCubic (t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t + b;
				return c/2*((t-=2)*t*t + 2) + b;
			},
			easeInQuart (t, b, c, d) { return c*(t/=d)*t*t*t + b; },
			easeOutQuart (t, b, c, d) { return -c * ((t=t/d-1)*t*t*t - 1) + b; },
			easeInOutQuart (t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
				return -c/2 * ((t-=2)*t*t*t - 2) + b;
			},
			easeInQuint (t, b, c, d) { return c*((t=t/d-1)*t*t*t*t + 1) + b; },
			easeOutQuint (t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			},
			easeInOutQuint (t, b, c, d) {
				if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
				return c/2*((t-=2)*t*t*t*t + 2) + b;
			}
		}
	},
	defaults = {
		easing: 'easeInOutCubic',
		speed: 260,//duration to scroll the entire height of the document
		offset: 0,
		pushState: true,
		focus: true,
		callback: false
	},
	StormScrollTo = {
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
					target: document.querySelector(item.getAttribute('href')) || null
				};
			});
		},
		initListeners(){
			this.navItems.forEach(el => {
				triggerEvents.forEach(ev => {
					el.node.addEventListener(ev, e => {
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

			this.navItems.forEach(item => {
				item.focusableChildren = getFocusableChildren(item.target);
			});
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
				increment = 16,
				animate = () => {
					currentTime += increment;
					move(CONSTANTS.EASING[this.settings.easing](currentTime, start, change, duration));
					if (currentTime < duration) {
						window.requestAnimationFrame(animate.bind(this));
					} else {
						(!!this.settings.pushState && !!window.history.pushState) && window.history.pushState({ URL: el.node.getAttribute('href')}, '', el.node.getAttribute('href'));
						(!!this.settings.focus && !!el.focusableChildren.length) && window.setTimeout(() => {el.focusableChildren[0].focus();}, 0);
						!!this.settings.callback && this.settings.callback();
					}
				};
			animate();
		},
		destroy(){
			this.navItems.forEach(el => {
				triggerEvents.forEach(ev => {
					el.node.removeEventListener(ev, e => {
						e.preventDefault();
						this.scrollTo(el);
					});
				});
			});
		}
	};

const init = (sel, opts) => {
	let els = [].slice.call(document.querySelectorAll(sel));
	
	if(!els.length) throw new Error('Scroll To cannot be initialised, no augmentable elements found');

	return Object.assign(Object.create(StormScrollTo), {
		DOMElements: els,
		settings: Object.assign({}, defaults, opts)
	}).init();
};

export default { init };