function IndexController(elements) {
	this.buttonElems = elements.indexButtons;
	this.backgroundImageElems = {};

	this.lastImage = elements.backgroundImages[0];

	for (var i = 0; i < elements.backgroundImages.length; i++) {
		this.backgroundImageElems[elements.backgroundImages[i].id] = elements.backgroundImages[i];
		this.AnimateImageOut(elements.backgroundImages[i]);
	};

	this.AnimateImageIn(this.lastImage);

	this.setupButtons();
}

IndexController.prototype.buttonIDs = [
	"dali",
	"manel",
	"mohammed_ali",
	"safa",
	"lilli",
	"underground_church",
	"church_of_tunisia",
	"tunisian_society",
	"conclusion"
]

IndexController.prototype.setupButtons = function() {
	for (var id in this.buttonElems) {
		this.buttonElems[id].onmouseover = this.buttonOnMouseOver.bind(this, this.buttonElems[id]);
	}
};

IndexController.prototype.buttonOnMouseOver = function(button) {
	if (this.lastImage != this.backgroundImageElems[button.dataset.linkId]) {
		this.AnimateImageIn(this.backgroundImageElems[button.dataset.linkId]);
		this.AnimateImageOut(this.lastImage);

		this.lastImage = this.backgroundImageElems[button.dataset.linkId];
	}
};

IndexController.prototype.AnimateImageIn = function(elem) {
	elem.classList.add("show");
};

IndexController.prototype.AnimateImageOut = function(elem) {
	elem.classList.remove("show");
};
