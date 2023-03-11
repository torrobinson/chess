export abstract class HtmlUtilities {

	public static elementFromString(htmlString: string): HTMLElement {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		return div.firstChild as HTMLElement;
	}

	public static liveBind(eventType, elementQuerySelector, cb) {
		document.addEventListener(eventType, event => {
			let el = event.target.closest(elementQuerySelector);
			if (el) {
				cb.call(this, el, event);
			}
		});
	}
}