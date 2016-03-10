// Article.js

function Article (elements, data) {
	this.container = elements.container;

	this.lastY = 0;
	this.onScroll();
}

Article.prototype.startY = IntroVideo.scrollRange;

Article.prototype.onResize = function() {
	Article.prototype.startY = IntroVideo.scrollRange;
};

Article.prototype.onScroll = function(y) {
	var currentY = window.scrollY;

	if (this.lastY < this.startY && currentY > this.startY) {
	}
	else if (this.lastY > this.startY && currentY < this.startY) {
	}

	this.lastY = currentY;
};
