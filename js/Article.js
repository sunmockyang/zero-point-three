// Article.js

function Article (elements, data) {
	this.container = elements.container;

	this.loadVideo(document.getElementById('section1-video'), "https://s3.amazonaws.com/sunnymock/a/1409173216797.webm", "video/webm");
	this.loadVideo(document.getElementById('section-video-dali'), "https://s3.amazonaws.com/sunnymock/a/1409173216797.webm", "video/webm");

	this.lastY = 0;
	this.onScroll();
}

Article.prototype.loadVideo = function(video, src, type) {
	var source = document.createElement('source');
    source.src = src;
    source.type = type;
    video.appendChild(source);
}

Article.prototype.onResize = function() {
};

Article.prototype.onScroll = function(y) {
	var currentY = window.scrollY;

	this.lastY = currentY;
};
