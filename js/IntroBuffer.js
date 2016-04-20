function IntroBuffer() {
	this.currentHeight = 0;
}

IntroBuffer.prototype.bufferScale = 4;
IntroBuffer.prototype.resizeThreshold = 0.15;

IntroBuffer.prototype.onResize = function() {
	var targetHeight = this.bufferScale * (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);

	if (Math.abs(targetHeight - this.currentHeight) > this.currentHeight * this.resizeThreshold) {
		this.currentHeight = targetHeight;
	}
};

IntroBuffer.prototype.getHeight = function() {
	return this.currentHeight;
};