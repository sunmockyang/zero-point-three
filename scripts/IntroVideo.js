// IntroVideo.js

function IntroVideo(video1, video2, scrollRanges) {
	this.video1 = video1;
	this.video2 = video2;
	this.scrollRanges = scrollRanges;

	this.video1Source = "https://s3.amazonaws.com/sunnymock/zeropointthree/1422577769051.webm";
	this.video2Source = "https://s3.amazonaws.com/sunnymock/zeropointthree/1420393862539.webm";

	this.LoadVideo(this.video1, this.video1Source, "video/webm");
	this.LoadVideo(this.video2, this.video2Source, "video/webm");
}

IntroVideo.prototype.LoadVideo = function(video, src, type) {
	var source = document.createElement('source');

    source.src = src;
    source.type = type;

    video.appendChild(source);
}

IntroVideo.prototype.SetOpacityLevel = function(video, t) {
	video.style.opacity = Mathx.clamp(t, 0, 1);
}

IntroVideo.prototype.SetVolumeLevel = function(video, t) {
	video.volume = Mathx.clamp(t, 0, 1);
}

IntroVideo.prototype.OnScroll = function(currentY){
	this.Video1Level(this.scrollRanges.introVideoFadeRange, currentY);
	this.Video2Level(this.scrollRanges.introVideoFadeRange, this.scrollRanges.articleStartRange, currentY);
}

IntroVideo.prototype.Video1Level = function(introVideoFadeRange, currentY) {
	currentY -= introVideoFadeRange.start;
	var t = 1 - currentY/(introVideoFadeRange.end - introVideoFadeRange.start);
	this.SetVolumeLevel(this.video1, t);
	this.SetOpacityLevel(this.video1, t);
}

IntroVideo.prototype.Video2Level = function(introVideoFadeRange, articleStartRange, currentY) {
	if (currentY < introVideoFadeRange.end) {
		currentY -= introVideoFadeRange.start;
		this.SetVolumeLevel(this.video2, currentY/(introVideoFadeRange.end - introVideoFadeRange.start));
	}
	else {
		currentY -= articleStartRange.start;
		var t = 1 - currentY/(articleStartRange.end - articleStartRange.start);
		this.SetVolumeLevel(this.video2, t);
		this.SetOpacityLevel(this.video2, t);
	}
}
