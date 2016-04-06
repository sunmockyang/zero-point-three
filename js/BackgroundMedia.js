// BackgroundMedia.js

function BackgroundMedia(elements) {
	this.scrollBuffer = elements.scrollBuffer;

	this.title1 = elements.title1;
	this.title2 = elements.title2;
	this.titleContainer = elements.titleContainer;

	this.video1 = elements.video1;
	this.video2 = elements.video2;
	this.videoContainer = elements.videoContainer;

	this.videoContainer.classList.remove("hidden");
	this.playVideo(true);

	this.indexBackground = elements.indexBackground;

	this.lastY = 0;

	this.onResize();
}

BackgroundMedia.scrollRange = 999; // Gets adjusted to screen height
BackgroundMedia.prototype.transitionPercentage = 0.2;
BackgroundMedia.prototype.articlePercentage = 2.0;
BackgroundMedia.prototype.fadeRange = 0.15;

BackgroundMedia.prototype.onResize = function() {
	BackgroundMedia.scrollRange = document.documentElement.clientHeight;
	// this.scrollBuffer.style.height = BackgroundMedia.scrollRange + "px";

	this.onScroll();
};

BackgroundMedia.prototype.onScroll = function(y) {
	var currentY = window.scrollY;

	var lastYPercentage = this.lastY / BackgroundMedia.scrollRange;
	var currentYPercentage = currentY / BackgroundMedia.scrollRange;

	// Transition between two videos
	OnMarkerCrossed(this.transitionPercentage, lastYPercentage, currentYPercentage, this.animateSecondVideoIn.bind(this), this.animateSecondVideoOut.bind(this));
	OnMarkerCrossed(this.articlePercentage, lastYPercentage, currentYPercentage, this.animateArticleIn.bind(this), this.animateArticleOut.bind(this));

	// Container
	if (currentYPercentage < 2) {
		this.titleContainer.style.transform = translate3dY(-currentYPercentage * 15);
	}

	// Video1
	var video1Parallax = currentYPercentage / this.transitionPercentage;
	if (video1Parallax < 2) {
		this.video1.style.transform = translate3dY(-video1Parallax * 5);
	}

	// Video2
	var fadePercentage = (currentY + this.fadeRange * BackgroundMedia.scrollRange - BackgroundMedia.scrollRange) / BackgroundMedia.scrollRange;
	if (fadePercentage > 0) {
		this.titleContainer.style.opacity = Math.min(1 - Math.pow(fadePercentage, 2), 1);
		this.video2.style.opacity = Math.min(1 - Math.pow(fadePercentage, 2), 1);
		this.video2.style.transform = translate3dY(-fadePercentage * 30);
	}
	else if (this.video2.style.opacity != 1) {
		this.titleContainer.style.opacity = 1;
		this.video2.style.opacity = 1;
		this.video2.style.transform = translate3dY(0);
	}

	this.lastY = currentY;
};

BackgroundMedia.prototype.animateSecondVideoIn = function() {
	this.title1.classList.add("second-video");
	this.title2.classList.add("second-video");
	this.video1.classList.add("second-video");
};

BackgroundMedia.prototype.animateSecondVideoOut = function() {
	this.title1.classList.remove("second-video");
	this.title2.classList.remove("second-video");
	this.video1.classList.remove("second-video");
};

BackgroundMedia.prototype.animateArticleIn = function() {
	this.playVideo(false);
	this.title1.classList.add("hidden");
	this.title2.classList.add("hidden");
	this.video1.classList.add("hidden");
	this.video2.classList.add("hidden");
	this.videoContainer.classList.add("hidden");
	this.indexBackground.classList.remove("hidden");
};

BackgroundMedia.prototype.animateArticleOut = function() {
	this.playVideo(true);
	this.title1.classList.remove("hidden");
	this.title2.classList.remove("hidden");
	this.video1.classList.remove("hidden");
	this.video2.classList.remove("hidden");
	this.videoContainer.classList.remove("hidden");
	this.indexBackground.classList.add("hidden");
};

BackgroundMedia.prototype.playVideo = function(play) {
	if (play && !this.playing) {
		this.playing = true;
		this.video1.play();
		this.video2.play();
	}
	else if (!play && this.playing){
		this.playing = false;
		this.video1.pause();
		this.video2.pause();
	}
};
