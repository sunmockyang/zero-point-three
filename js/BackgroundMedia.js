// BackgroundMedia.js

function BackgroundMedia(elements) {
	this.scrollBuffer = elements.scrollBuffer;

	this.title1 = elements.title1;
	this.title2 = elements.title2;
	this.titleContainer = elements.titleContainer;

	this.video1 = elements.video1;
	this.video2 = elements.video2;
	this.videoContainer = elements.videoContainer;
	this.videoOverlay = elements.videoOverlay;
	this.currentVideo = this.video1;

	this.introParagraph = elements.introParagraph;

	this.video1TargetVolume = this.maxVolume;
	this.video2TargetVolume = 0;
	this.video1.volume = this.video2.volume = 0;

	this.videoContainer.classList.remove("hidden");
	this.playVideo(true);
	this.updateVideoVolume();

	this.indexBackground = elements.indexBackground;

	this.lastY = 0;

	this.onResize();
}

BackgroundMedia.scrollRange = 999; // Gets adjusted to screen height
BackgroundMedia.prototype.transitionPercentage = 0.3;
BackgroundMedia.prototype.articlePercentage = 1.1;
BackgroundMedia.prototype.fadeRange = 0.25;
BackgroundMedia.prototype.fadeEnd = 0.9;
BackgroundMedia.prototype.volumeLerp = 0.05;
BackgroundMedia.prototype.maxVolume = 0.1;
BackgroundMedia.prototype.volumeRequestID = 0;

BackgroundMedia.prototype.onResize = function() {
	BackgroundMedia.scrollRange = this.scrollBuffer.getBoundingClientRect().height;

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
	if (currentYPercentage < 1) {
		this.titleContainer.style.transform = translate3dY(-currentYPercentage * 30);
	}

	// Video1
	var video1Parallax = currentYPercentage / this.transitionPercentage;
	if (video1Parallax < 2) {
		this.video1.style.transform = translate3dY(-video1Parallax * 5);
	}

	// Video2
	var fadePercentage = 1 - (this.fadeEnd - currentYPercentage) / this.fadeRange;
	if (fadePercentage > 0) {
		var percentage = Mathx.normalize(1 - Math.pow(fadePercentage, 2));
		this.titleContainer.style.opacity = percentage;
		this.video2.style.opacity = percentage;
		this.video2.style.transform = translate3dY(-fadePercentage * 30);
		this.videoOverlay.style.opacity = percentage;
		this.volumeLerp = 0.5;
		this.video2TargetVolume = percentage * this.maxVolume;
	}
	else if (this.video2.style.opacity != 1) {
		this.titleContainer.style.opacity = 1;
		this.video2.style.opacity = 1;
		this.video2.style.transform = translate3dY(0);
		this.videoOverlay.style.opacity = 1;
	}

	this.lastY = currentY;
};

BackgroundMedia.prototype.animateSecondVideoIn = function() {
	this.title1.classList.add("second-video");
	this.title2.classList.add("second-video");
	this.video1.classList.add("second-video");
	this.currentVideo = this.video2;

	this.volumeLerp = 0.05;
	this.video1TargetVolume = 0;
	this.video2TargetVolume = this.maxVolume;
};

BackgroundMedia.prototype.animateSecondVideoOut = function() {
	this.title1.classList.remove("second-video");
	this.title2.classList.remove("second-video");
	this.video1.classList.remove("second-video");
	this.currentVideo = this.video1;

	this.volumeLerp = 0.05;
	this.video1TargetVolume = this.maxVolume;
	this.video2TargetVolume = 0;
};

BackgroundMedia.prototype.updateVideoVolume = function() {
	if (this.video1.volume != this.video1TargetVolume ||
		this.video2.volume != this.video2TargetVolume) {
		this.video1.volume = Mathx.Lerp(this.video1.volume, this.video1TargetVolume, this.volumeLerp);
		this.video2.volume = Mathx.Lerp(this.video2.volume, this.video2TargetVolume, this.volumeLerp);
	}
	window.requestAnimationFrame(this.updateVideoVolume.bind(this));
};

BackgroundMedia.prototype.animateArticleIn = function() {
	this.playVideo(false);
	this.title1.classList.add("hidden");
	this.title2.classList.add("hidden");
	this.video1.classList.add("hidden");
	this.video2.classList.add("hidden");
	this.videoContainer.classList.add("hidden");
	this.indexBackground.classList.remove("hidden");

	show(this.introParagraph);
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
