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
