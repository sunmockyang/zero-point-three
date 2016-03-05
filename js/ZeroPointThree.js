// ZeroPointThree.js
// Main app for PH thesis
// Contains main logic for the entire article

function ZeroPointThree(data, elements) {
	this.elements = elements;

	this.introVideoController = new IntroVideo(this.elements.video1Elem,
															this.elements.video2Elem,
															data.video1_url,
															data.video2_url);
	this.onResize();
}

ZeroPointThree.prototype.onResize = function() {
	for (var i = 0; i < this.elements.fullscreenElements.length; i++) {
		window.requestAnimationFrame(resizeFullscreen.bind(this, this.elements.fullscreenElements[i]));
	};
};

// Utils

function resizeFullscreen (elem) {
	var width = document.documentElement.clientWidth;
	var height = document.documentElement.clientHeight;
	var aspectRatio = parseFloat(elem.dataset.aspectRatio);

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
};

