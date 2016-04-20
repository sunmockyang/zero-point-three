// BackgroundMedia.js

function BackgroundMedia(elements, introBuffer) {
	this.articleContainer = elements.articleContainer;

	this.title1 = elements.title1;
	this.title2 = elements.title2;
	this.titleContainer = elements.titleContainer;

	this.video1 = elements.video1;
	this.video2 = elements.video2;
	this.videoContainer = elements.videoContainer;
	this.videoOverlay = elements.videoOverlay;
	this.currentVideo = this.video1;

	this.introParagraph = elements.introParagraph;
	elements.introDownCaret.onclick = (function () {
		if (window.pageYOffset < this.transitionPercentage * BackgroundMedia.scrollRange) {
			animateScroll(this.transitionPercentage * BackgroundMedia.scrollRange, 1500, "easeInOutQuad", -10, "top");
		}
		else {
			animateScroll(document.getElementById('introStart'), 3000, "easeInOutQuint", document.documentElement.clientHeight * 0.075, "top");
		}
	}).bind(this);

	this.video1TargetVolume = this.maxVolume;
	this.video2TargetVolume = 0;
	this.video1.volume = this.video2.volume = 0;

	this.videoContainer.classList.remove("hidden");
	if (isIOS()){
		this.video1.outerHTML = '<div class="image" id="video1"></div>';
		this.video2.outerHTML = '<div class="image" id="video2"></div>';

		this.video1 = document.getElementById("video1");
		this.video2 = document.getElementById("video2");
	}
	else {
		this.playVideo(true);
		this.updateVideoVolume();
	}

	this.indexBackground = elements.indexBackground;

	this.lastY = 0;
	this.lastYPercentage = 0;

	this.onResize(introBuffer);
}

BackgroundMedia.scrollRange = 999; // Gets adjusted to screen height
BackgroundMedia.prototype.transitionPercentage = 0.3;
BackgroundMedia.prototype.videoEndPercentage = 1.1;
BackgroundMedia.prototype.introParagraphStart = -0.2;
BackgroundMedia.prototype.fadeRange = 0.25;
BackgroundMedia.prototype.fadeEnd = 0.9;
BackgroundMedia.prototype.volumeLerp = 0.02;
BackgroundMedia.prototype.maxVolume = 0.2;
BackgroundMedia.prototype.volumeRequestID = 0;

BackgroundMedia.prototype.onResize = function(introBuffer) {
	BackgroundMedia.scrollRange = introBuffer.getHeight();
	this.articleContainer.style.marginTop = BackgroundMedia.scrollRange + "px";
	this.onScroll();
};

BackgroundMedia.prototype.onScroll = function(y) {
	var currentY = window.pageYOffset;

	var currentYPercentage = currentY / BackgroundMedia.scrollRange;

	// Transition between two videos
	OnMarkerCrossed(this.transitionPercentage, this.lastYPercentage, currentYPercentage, this.animateSecondVideoIn.bind(this), this.animateSecondVideoOut.bind(this));
	OnMarkerCrossed(this.videoEndPercentage, this.lastYPercentage, currentYPercentage, this.animateVideoOut.bind(this), this.animateVideoIn.bind(this));
	OnMarkerCrossed(BackgroundMedia.scrollRange + (this.introParagraphStart * document.documentElement.clientHeight), this.lastY, currentY, show.bind(window, this.introParagraph));

	// Container
	if (currentYPercentage < 1) {
		setTranslate3dY(this.titleContainer, -currentYPercentage * 50);
	}

	// Video1
	// var video1Parallax = currentYPercentage / this.transitionPercentage;
	// if (video1Parallax < 2) {
	// 	setTranslate3dY(this.video1, -video1Parallax * 5);
	// }

	// Video2
	var fadePercentage = 1 - (this.fadeEnd - currentYPercentage) / this.fadeRange;
	if (fadePercentage > 0) {
		var percentage = Mathx.normalize(1 - Math.pow(fadePercentage, 2));
		this.titleContainer.style.opacity = percentage;
		this.video2.style.opacity = percentage;
		// setTranslate3dY(this.video2, -fadePercentage * 30);
		this.videoOverlay.style.opacity = percentage;
		this.volumeLerp = 0.02;
		this.video2TargetVolume = percentage * this.maxVolume;
	}
	else if (this.video2.style.opacity != 1) {
		this.titleContainer.style.opacity = 1;
		this.video2.style.opacity = 1;
		// setTranslate3dY(this.video2, 0);
		this.videoOverlay.style.opacity = 1;
	}

	this.lastY = currentY;
	this.lastYPercentage = this.lastY / BackgroundMedia.scrollRange;
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

BackgroundMedia.prototype.animateVideoOut = function() {
	this.playVideo(false);
	this.title1.classList.add("hidden");
	this.title2.classList.add("hidden");
	this.video1.classList.add("hidden");
	this.video2.classList.add("hidden");
	this.videoContainer.classList.add("hidden");
	this.indexBackground.classList.remove("hidden");
};

BackgroundMedia.prototype.animateVideoIn = function() {
	this.playVideo(true);
	this.title1.classList.remove("hidden");
	this.title2.classList.remove("hidden");
	this.video1.classList.remove("hidden");
	this.video2.classList.remove("hidden");
	this.videoContainer.classList.remove("hidden");
	this.indexBackground.classList.add("hidden");
};

BackgroundMedia.prototype.playVideo = function(play) {
	if (!isIOS() && play && !this.playing) {
		this.playing = true;
		this.video1.play();
		this.video2.play();
	}
	else if (!isIOS() && !play && this.playing){
		this.playing = false;
		this.video1.pause();
		this.video2.pause();
	}
};
