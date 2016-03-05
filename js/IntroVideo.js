// IntroVideo.js

function IntroVideo(videoElem1, videoElem2, video1Src, video2Src) {
	this.video1 = videoElem1;
	this.video2 = videoElem2;

	this.video1Source = video1Src;
	this.video2Source = video2Src;

	this.loadVideo(this.video1, this.video1Source, "video/webm");
	this.loadVideo(this.video2, this.video2Source, "video/webm");
}

IntroVideo.prototype.loadVideo = function(video, src, type) {
	var source = document.createElement('source');
    source.src = src;
    source.type = type;
    video.appendChild(source);
}
