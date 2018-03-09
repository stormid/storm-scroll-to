import ScrollTo from './libs/component';

const onDOMContentLoadedTasks = [() => {
	let scrollTo = ScrollTo.init('.js-scroll-to');
	console.log(scrollTo);
}];
    
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });