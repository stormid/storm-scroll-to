import should from 'should';
import 'jsdom-global/register';
import ScrollTo from '../dist/storm-scroll-to.standalone';

const html = `<nav class="js-scroll-spy">
            <a class="js-scroll-to" href="#section1">Section 1</a>
            <a class="js-scroll-to" href="#section2">Section 2</a>
            <a class="js-scroll-to" href="#section3">Section 3</a>
        </nav><section id="section1" style="height:500px">
            Section 1
        </section>
        <section id="section2" style="height:500px">
            Section 2
        </section>
        <section id="section3" style="height:500px">
            Section 3
            <button>Focusable Node</button>
        </section>`;

document.body.innerHTML = html;

describe('Initialisation', () => {

	let ScrollToItem = ScrollTo.init('.js-scroll-to', {
		callback(){
			
		}
	});

	it('should return a scroll to object', () => {
		should(ScrollToItem)
		.Object();
	});
	
	it('should throw an error if no link elements are found', () => {
		ScrollTo.init.bind(ScrollTo, '.js-err').should.throw();
	});
	
	it('each array item should be an object with the correct properties', () => {
		ScrollToItem.should.have.property('DOMElements').Array();
		ScrollToItem.should.have.property('settings').Object();
		ScrollToItem.should.have.property('init').Function();
		ScrollToItem.should.have.property('initListeners').Function();
		ScrollToItem.should.have.property('initFocusable').Function();
		ScrollToItem.should.have.property('scrollTo').Function();
		ScrollToItem.should.have.property('destroy').Function();
	});
	
	it('should attach the handleClick eventListener to DOMElement click event to toggle className', () => {
		ScrollToItem.navItems[0].node.click();
		ScrollToItem.navItems[1].node.click();
		ScrollToItem.navItems[2].node.click();
	});

});

describe('Destroy', () => {

	let ScrollToItem = ScrollTo.init('.js-scroll-to', {
		focus: false
	});
	it('should remove the eventListeners from the nav items', () => {
		ScrollToItem.destroy();
	});
});