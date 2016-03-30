function evalToOverlay(elem, childEval) {
	var overlay = elem.getElementsByClassName("overlay")[0];
	childEval(overlay);
};

function addHover(elem) {
	elem.classList.add("hover");
}

function removeHover(elem) {
	elem.classList.remove("hover");
}

var Mathx = {};

Mathx.clamp = function(t, min, max) {
	return Math.min(max, Math.max(min, t));
};

Mathx.Lerp = function(frm, to, t) {
    return (to - frm) * t + frm;
};