// BackgroundMedia.js

function BackgroundMedia(elements, introConfig) {
	this.scrollBuffer = elements.scrollBuffer;

	this.title1 = elements.title1;
	this.title2 = elements.title2;

	this.video1 = elements.video1;
	this.video2 = elements.video2;

	this.title1.innerHTML = introConfig.title1;
	this.title2.innerHTML = introConfig.title2;

	this.video1Source = introConfig.video1_url;
	this.video2Source = introConfig.video2_url;

	this.loadVideo(this.video1, this.video1Source, "video/webm");
	this.loadVideo(this.video2, this.video2Source, "video/webm");

	this.lastY = 0;

	this.onResize();
}

BackgroundMedia.scrollRange = 999; // Gets adjusted to screen height
BackgroundMedia.prototype.transitionPercentage = 0.3;
BackgroundMedia.prototype.articlePercentage = 2.0;
BackgroundMedia.prototype.fadeRange = 0.15;

BackgroundMedia.prototype.loadVideo = function(video, src, type) {
	var source = document.createElement('source');
    source.src = src;
    source.type = type;
    video.appendChild(source);
}

BackgroundMedia.prototype.onResize = function() {
	BackgroundMedia.scrollRange = document.documentElement.clientHeight;
	// this.scrollBuffer.style.height = BackgroundMedia.scrollRange + "px";

	this.onScroll();
};

BackgroundMedia.prototype.onScroll = function(y) {
	var currentY = window.scrollY;

	// Transition between two videos
	if (this.lastY / BackgroundMedia.scrollRange < this.transitionPercentage &&
		currentY / BackgroundMedia.scrollRange >= this.transitionPercentage) {
		// From first to second video
		this.title1.classList.add("second-video");
		this.title2.classList.add("second-video");
		this.video1.classList.add("second-video");
	}
	else if (this.lastY / BackgroundMedia.scrollRange > this.transitionPercentage &&
		currentY / BackgroundMedia.scrollRange <= this.transitionPercentage) {
		// From second to first video
		this.title1.classList.remove("second-video");
		this.title2.classList.remove("second-video");
		this.video1.classList.remove("second-video");
	}

	// Transition to article
	if (this.lastY / BackgroundMedia.scrollRange < this.articlePercentage &&
		currentY / BackgroundMedia.scrollRange >= this.articlePercentage) {
		// From first to second video
		this.title1.classList.add("hidden");
		this.title2.classList.add("hidden");
		this.video1.classList.add("hidden");
		this.video2.classList.add("hidden");
	}
	else if (this.lastY / BackgroundMedia.scrollRange > this.articlePercentage &&
		currentY / BackgroundMedia.scrollRange <= this.articlePercentage) {
		// From second to first video
		this.title1.classList.remove("hidden");
		this.title2.classList.remove("hidden");
		this.video1.classList.remove("hidden");
		this.video2.classList.remove("hidden");
	}

	var fadePercentage = (currentY + this.fadeRange * BackgroundMedia.scrollRange - BackgroundMedia.scrollRange) / BackgroundMedia.scrollRange;
	if (fadePercentage > 0) {
		this.video2.style.opacity = Math.min(1 - fadePercentage, 1);
		this.video2.style.transform = translate3dY(-fadePercentage * 100);
	}
	else if (this.video2.style.opacity != 1) {
		this.video2.style.opacity = 1;
		this.video2.style.transform = translate3dY(0);
	}

	this.lastY = currentY;
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
