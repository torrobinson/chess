export abstract class HtmlUtilities {

	public static elementFromString(htmlString: string): HTMLElement {
		var div = document.createElement('div');
		div.innerHTML = htmlString.trim();
		return div.firstChild as HTMLElement;
	}
}