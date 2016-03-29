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