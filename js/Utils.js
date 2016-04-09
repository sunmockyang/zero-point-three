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

function fadeOut(elem) {
	elem.classList.add("fadeOut");
}

function fadeIn(elem) {
	elem.classList.remove("fadeOut");
}

function show(elem) {
	elem.classList.add("show");
}

function unshow(elem) {
	elem.classList.remove("show");
}

function OnMarkerCrossed(marker, last, current, onforward, onbackward) {
	if (onforward && last < marker && current > marker) {
		onforward();
		return true;
	}
	else if (onbackward && last > marker && current < marker) {
		onbackward();
		return true;
	}
	return false;
};

function ScrollToSection(id) {
	animateScroll(document.getElementById(id), 1000, "easeInOutQuint", elements.navbar.firstLevel.getBoundingClientRect().height + 10, "top");
}

function ScrollCenteredElem(elem, duration) {
	animateScroll(elem, (duration) ? duration : 1000, "easeInOutQuint", 0, "center");
}

function ScrollCenteredElemNavBar(elem, duration) {
	animateScroll(elem, (duration) ? duration : 1000, "easeInOutQuint", elements.navbar.firstLevel.getBoundingClientRect().height, "center");
}

var Mathx = {};

Mathx.clamp = function(t, min, max) {
	return Math.min(max, Math.max(min, t));
};

Mathx.normalize = function(t) {
	return Mathx.clamp(t, 0, 1);
};

Mathx.Lerp = function(frm, to, t) {
    return (to - frm) * t + frm;
};
