// ZeroPointThree.js
// Main app for PH thesis
// Contains main logic for the entire article

function ZeroPointThree(elements) {
	this.elements = elements;

	this.scrollRange = {start: 0, end: 0};
	AddScrollHandler(this.scrollRange, this.onScroll.bind(this));

	this.backgroundMediaController = new BackgroundMedia(this.elements.background);
	this.indexController = new IndexController(this.elements.index, this.onArticleStart.bind(this), this.onArticleUnstart.bind(this));
	this.navBarController = new NavigationBar(this.elements.navbar);

	window.requestAnimationFrame(this.onResize.bind(this));
}

ZeroPointThree.prototype.onResize = function() {
	for (var i = 0; i < this.elements.fullscreenElements.length; i++) {
		window.requestAnimationFrame(resizeFullscreen.bind(this, this.elements.fullscreenElements[i]));
	};

	// Overall scroll range
	var docElem = document.documentElement;
	this.scrollRange.end = ( 'scrollMaxY' in window ) ? window.scrollMaxY : (docElem.scrollHeight - docElem.clientHeight);

	// Index scroll range
	this.indexController.scrollRange.start = this.elements.article.introParagraph.getBoundingClientRect().bottom + window.pageYOffset;
	this.indexController.scrollRange.end = this.elements.index.indexWrapper.getBoundingClientRect().height + this.indexController.scrollRange.start;
	this.indexController.onScroll();

	this.backgroundMediaController.onResize();
};

ZeroPointThree.prototype.onScroll = function(y) {
	window.requestAnimationFrame(this.backgroundMediaController.onScroll.bind(this.backgroundMediaController, y));
	window.requestAnimationFrame(this.indexController.onScroll.bind(this.indexController));
};

ZeroPointThree.prototype.onArticleStart = function() {
	this.navBarController.showContainer();
};

ZeroPointThree.prototype.onArticleUnstart = function() {
	this.navBarController.hideContainer();
};

// Utils

function resizeFullscreen (elem) {
	var aspectRatio = parseFloat(elem.dataset.aspectRatio);
	var scale = parseFloat((elem.dataset.scale > 0) ? elem.dataset.scale : 1);

	var width = document.documentElement.clientWidth * scale;
	var height = document.documentElement.clientHeight * scale;

	if (isNaN(aspectRatio)) {
		elem.style.width = width + "px";
		elem.style.height = height + "px";
		return;
	}

	if (width / height > aspectRatio) { // align to width
		elem.style.width = width + "px";
		elem.style.height = width / aspectRatio + "px";

		elem.style.left = "0px";
		elem.style.top = (height - width / aspectRatio) / 2 + "px";
	}
	else {
		elem.style.width = height * aspectRatio + "px";
		elem.style.height = height + "px";

		elem.style.top = "0px";
		elem.style.left = (width - height * aspectRatio) / 2 + "px";
	}

	if (scale != 1) {
		elem.style.left = - (width - document.documentElement.clientWidth) / 2 + "px";
	}
};

function translate3dY(y) {
	return "translate3d(0," + y + "vh, 0)"
}
