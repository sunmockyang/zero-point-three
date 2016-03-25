// ZeroPointThree.js
// Main app for PH thesis
// Contains main logic for the entire article

function ZeroPointThree(data, elements) {
	this.elements = elements;
	this.data = data;

	this.scrollRange = {start: 0, end: 0};
	AddScrollHandler(this.scrollRange, this.onScroll.bind(this));

	this.introVideoController = new IntroVideo(this.elements.intro, data.intro);
	this.articleController = new Article(this.elements.article, data.article);

	this.setContent();

	this.onResize();
}

ZeroPointThree.prototype.setContent = function() {
	for (var id in this.data.article) {
		document.getElementById(id).innerHTML = this.data.article[id];
	}
};

ZeroPointThree.prototype.onResize = function() {
	for (var i = 0; i < this.elements.fullscreenElements.length; i++) {
		window.requestAnimationFrame(resizeFullscreen.bind(this, this.elements.fullscreenElements[i]));
	};

	var docElem = document.documentElement;
	this.scrollRange.end = ( 'scrollMaxY' in window ) ? window.scrollMaxY : (docElem.scrollHeight - docElem.clientHeight);

	this.introVideoController.onResize();
	this.articleController.onResize();
};

ZeroPointThree.prototype.onScroll = function(y) {
	window.requestAnimationFrame(this.introVideoController.onScroll.bind(this.introVideoController, y));
	this.articleController.onScroll(y);
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
		elem.style.top = - (height - document.documentElement.clientHeight) / 2 + "px";
	}
};

function translate3dY(y) {
	return "translate3d(0," + y + "px, 0)"
}
