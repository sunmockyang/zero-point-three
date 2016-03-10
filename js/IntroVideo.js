// IntroVideo.js

function IntroVideo(elements, introVideoData) {
	this.scrollBuffer = elements.scrollBuffer;

	this.title1 = elements.title1;
	this.title2 = elements.title2;

	this.video1 = elements.video1;
	this.video2 = elements.video2;

	this.video1Source = introVideoData.video1_url;
	this.video2Source = introVideoData.video2_url;

	this.loadVideo(this.video1, this.video1Source, "video/webm");
	this.loadVideo(this.video2, this.video2Source, "video/webm");

	this.lastY = 0;

	this.onResize();
}

IntroVideo.scrollRange = 999; // Gets adjusted to screen height
IntroVideo.prototype.transitionPercentage = 0.3;
IntroVideo.prototype.fadeRange = 0.15;

IntroVideo.prototype.loadVideo = function(video, src, type) {
	var source = document.createElement('source');
    source.src = src;
    source.type = type;
    video.appendChild(source);
}

IntroVideo.prototype.onResize = function() {
	IntroVideo.scrollRange = document.documentElement.clientHeight;
	this.scrollBuffer.style.height = IntroVideo.scrollRange + "px";

	this.onScroll();
};

IntroVideo.prototype.onScroll = function(y) {
	var currentY = window.scrollY;

	if (this.lastY / IntroVideo.scrollRange < this.transitionPercentage &&
		currentY / IntroVideo.scrollRange >= this.transitionPercentage) {
		this.title1.classList.add("second-video");
		this.title2.classList.add("second-video");
		this.video1.classList.add("second-video");
	}
	else if (this.lastY / IntroVideo.scrollRange > this.transitionPercentage &&
		currentY / IntroVideo.scrollRange <= this.transitionPercentage) {
		this.title1.classList.remove("second-video");
		this.title2.classList.remove("second-video");
		this.video1.classList.remove("second-video");
	}

	var fadePercentage = (currentY + this.fadeRange * IntroVideo.scrollRange - IntroVideo.scrollRange) / IntroVideo.scrollRange;
	if (fadePercentage > 0) {
		this.video2.style.opacity = 1 - fadePercentage;
		this.video2.style.transform = translate3dY(-fadePercentage * 100);
	}
	else if (this.video2.style.opacity != 1) {
		this.video2.style.opacity = 1;
		this.video2.style.transform = translate3dY(0);
	}

	this.lastY = currentY;
};

IntroVideo.prototype.playVideo = function(play) {
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
