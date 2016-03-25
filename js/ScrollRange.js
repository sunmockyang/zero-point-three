// ScrollRange.js

function AddScrollHandler (range, cb) {
	function callbacker(e){
		var currentY = window.scrollY;
		var t = (currentY - range.start) / (range.end - range.start);
		cb(t, currentY);
	}

	window.addEventListener("scroll", callbacker);
}
