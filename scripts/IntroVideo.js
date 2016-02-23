// IntroVideo.js

function IntroVideo(video1, video2, scrollRanges) {
	this.video1 = video1;
	this.video2 = video2;
	this.scrollRanges = scrollRanges;

	this.video1Source = "https://s3.amazonaws.com/sunnymock/zeropointthree/1422577769051.webm";
	this.video2Source = "https://s3.amazonaws.com/sunnymock/zeropointthree/1420393862539.webm";

	this.loadVideo(this.video1, this.video1Source, "video/webm");
	this.loadVideo(this.video2, this.video2Source, "video/webm");
}

IntroVideo.prototype.loadVideo = function(video, src, type) {
	var source = document.createElement('source');

    source.src = src;
    source.type = type;

    video.appendChild(source);
}

IntroVideo.prototype.setOpacityLevel = function(video, t) {
	video.style.opacity = Mathx.clamp(t, 0, 1);
}

IntroVideo.prototype.setVolumeLevel = function(video, t) {
	video.volume = Mathx.clamp(t, 0, 1);
}

IntroVideo.prototype.onResize = function() {
	this.scrollRanges.introVideoFadeRange.start = document.documentElement.clientHeight - 200;
	this.scrollRanges.introVideoFadeRange.end = document.documentElement.clientHeight;

	this.scrollRanges.articleStartRange.start = document.documentElement.clientHeight * 1.75;
	this.scrollRanges.articleStartRange.end = document.documentElement.clientHeight * 2;
};

IntroVideo.prototype.onScroll = function(currentY){
	this.setVideo1Level(this.scrollRanges.introVideoFadeRange, currentY);
	this.setVideo2Level(this.scrollRanges.introVideoFadeRange, this.scrollRanges.articleStartRange, currentY);
}

IntroVideo.prototype.setVideo1Level = function(introVideoFadeRange, currentY) {
	currentY -= introVideoFadeRange.start;
	var t = 1 - currentY/(introVideoFadeRange.end - introVideoFadeRange.start);
	this.setVolumeLevel(this.video1, t);
	this.setOpacityLevel(this.video1, t);
}

IntroVideo.prototype.setVideo2Level = function(introVideoFadeRange, articleStartRange, currentY) {
	if (currentY < introVideoFadeRange.end) {
		currentY -= introVideoFadeRange.start;
		this.setVolumeLevel(this.video2, currentY/(introVideoFadeRange.end - introVideoFadeRange.start));
	}
	else {
		currentY -= articleStartRange.start;
		var t = 1 - currentY/(articleStartRange.end - articleStartRange.start);
		this.setVolumeLevel(this.video2, t);
		this.setOpacityLevel(this.video2, t);
	}
}
