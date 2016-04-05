function IndexController(elements) {
	this.buttonElems = elements.indexButtons;
	this.indexWrapperElem = elements.indexWrapper;
	this.indexBoxElem = elements.indexBox;
	this.indexBackground = elements.indexBackground;
	this.backgroundImageElems = {};

	this.lastImage = elements.backgroundImages[0];

	for (var i = 0; i < elements.backgroundImages.length; i++) {
		this.backgroundImageElems[elements.backgroundImages[i].id] = elements.backgroundImages[i];
		this.AnimateBGImageOut(elements.backgroundImages[i]);
	};

	this.AnimateBGImageIn(this.lastImage);

	this.lastRange = -Infinity;

	this.setupButtons();

	window.requestAnimationFrame(this.onScroll.bind(this));
};

IndexController.prototype.scrollRange = {start: 0, end: 0};
IndexController.prototype.animateInMark = -0.3;
IndexController.prototype.animateOutStartMark = 0.5;
IndexController.prototype.animateOutEndMark = 0.7;
IndexController.prototype.startArticleMark = 0.8;

IndexController.prototype.setupButtons = function() {
	for (var id in this.buttonElems) {
		this.buttonElems[id].onmouseover = this.buttonOnMouseOver.bind(this, this.buttonElems[id]);
		this.buttonElems[id].onclick = this.buttonOnClick.bind(this, this.buttonElems[id]);
	};
};

IndexController.prototype.onScroll = function() {
	var rangePercentage = (window.scrollY - this.scrollRange.start)/(this.scrollRange.end - this.scrollRange.start);

	// Animate in
	OnMarkerCrossed(this.animateInMark, this.lastRange, rangePercentage, this.onAnimateIn.bind(this), this.onAnimateOut.bind(this));

	// Animate out
	var transparency = 1 -(rangePercentage - this.animateOutStartMark) / (this.animateOutEndMark - this.animateOutStartMark);
	transparency = Mathx.normalize(transparency);

	this.indexWrapperElem.style.opacity = transparency;

	// Start Article
	OnMarkerCrossed(this.startArticleMark, this.lastRange, rangePercentage, fadeOut.bind(this, this.indexBackground), fadeIn.bind(this, this.indexBackground));

	this.lastRange = rangePercentage;
};

IndexController.prototype.onAnimateIn = function() {
	this.indexBoxElem.classList.add("animate-in");

	var menuElements = this.indexBoxElem.children;

	for (var i = 0; i < menuElements.length; i++) {
		setTimeout((function (index) {
			menuElements[index].classList.add("animate-in");
		}).bind(this, i), i * 50)
	}
};

IndexController.prototype.onAnimateOut = function() {
	this.indexBoxElem.classList.remove("animate-in");

	var menuElements = this.indexBoxElem.children;

	for (var i = menuElements.length - 1; i > 0; i--) {
		menuElements[i].classList.remove("animate-in");
	}
};

IndexController.prototype.buttonOnMouseOver = function(button) {
	var linkBGID = button.dataset.linkId + "_bg";
	if (this.lastImage != this.backgroundImageElems[linkBGID]) {
		this.AnimateBGImageIn(this.backgroundImageElems[linkBGID]);
		this.AnimateBGImageOut(this.lastImage);

		this.lastImage = this.backgroundImageElems[linkBGID];
	}
};

IndexController.prototype.buttonOnClick = function(button) {
	animateScroll(document.getElementById(button.dataset.linkId), 1000, "easeInOutQuint", 0, "top");
};

IndexController.prototype.AnimateBGImageIn = function(elem) {
	elem.classList.add("show");
};

IndexController.prototype.AnimateBGImageOut = function(elem) {
	elem.classList.remove("show");
};
