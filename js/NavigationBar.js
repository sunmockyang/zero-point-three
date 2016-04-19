function NavigationBar(elements) {
	this.container = elements.container;
	this.firstLevel = elements.firstLevel;
	this.secondLevel = elements.secondLevel;
	this.firstLevelItems = elements.firstLevelItems;
	this.secondLevelItems = elements.secondLevelItems;
	this.stories_container = elements.storyItems;
	this.analysis_container = elements.analysisItems;

	this.timeoutID = 0;
	this.lastShownSecondLevel = "";

	this.container.onmousemove = this.onMouseMove.bind(this);
	if (isIOS()){
		this.hideTimeout = 10000;
	}

	this.activeButton = null;

	this.setupFirstLevelButtons();
	this.setupLinkButtons();

	elements.title.onclick = function() {
		animateScroll(document.documentElement, 3000, "easeInOutQuint", 0, "top");
	}
}

NavigationBar.prototype.hideTimeout = 5000;

NavigationBar.prototype.setupFirstLevelButtons = function() {
	for (var i = 0; i < this.firstLevelItems.length; i++) {
		var secondLayer = this.firstLevelItems[i].dataset.secondLayer;
		if (secondLayer) {
			this.firstLevelItems[i].onclick = this.showSecondLevel.bind(this, secondLayer, this.firstLevelItems[i]);
		}
	}
};

NavigationBar.prototype.setupLinkButtons = function() {
	var that = this; // hack but w/e
	function setupOnClickScroll(elem) {
		var linkID = elem.dataset.linkId;
		if (linkID) {
			elem.onclick = that.onLinkClicked.bind(that, linkID);
		}
	}
	
	for (var i = 0; i < this.firstLevelItems.length; i++) {
		setupOnClickScroll(this.firstLevelItems[i]);
	}
	
	for (var i = 0; i < this.secondLevelItems.length; i++) {
		setupOnClickScroll(this.secondLevelItems[i]);
	}
};

NavigationBar.prototype.isSecondLevelShowing = function() {
	return this.secondLevel.classList.contains("show");
};

NavigationBar.prototype.onLinkClicked = function(linkID) {
	this.hideSecondLevel();
	if (linkID == "index-box") {
		ScrollCenteredElem(document.getElementById(linkID));
	}
	else {
		ScrollToSection(linkID);
	}
};

NavigationBar.prototype.showSecondLevel = function(id, button) {
	if (button != this.activeButton) {
		if (this.activeButton) {
			this.activeButton.classList.remove("active");
		}
		button.classList.add("active");
		this.activeButton = button;
	}

	if (this.isSecondLevelShowing() && this.lastShownSecondLevel != id) {
		this.hideSecondLevel();
		setTimeout(this.showSecondLevel.bind(this, id, button), 200);
		return;
	}

	if (id == "stories_container"){
		this.analysis_container.classList.add("hidden");
		this.analysis_container.classList.add("no-size");
		this.stories_container.classList.remove("hidden");
		this.stories_container.classList.remove("no-size");
	}
	else if (id == "analysis_container"){
		this.stories_container.classList.add("hidden");
		this.stories_container.classList.add("no-size");
		this.analysis_container.classList.remove("hidden");
		this.analysis_container.classList.remove("no-size");
	}

	this.lastShownSecondLevel = id;

	this.onMouseMove();

	show(this.secondLevel);
};

NavigationBar.prototype.hideSecondLevel = function() {
	this.stories_container.classList.add("hidden");
	this.stories_container.classList.add("no-size");
	this.analysis_container.classList.add("hidden");
	this.analysis_container.classList.add("no-size");
	if (this.activeButton) {
		this.activeButton.classList.remove("active");
		this.activeButton = null;
	}
	this.lastShownSecondLevel = "";
	unshow(this.secondLevel);
};

NavigationBar.prototype.onMouseMove = function() {
	this.onMouseOver();
	this.onMouseOut();
};

NavigationBar.prototype.onMouseOver = function() {
	if (this.timeoutID != 0) {
		clearTimeout(this.timeoutID);
		this.timeoutID = 0;
	}
};

NavigationBar.prototype.onMouseOut = function() {
	this.timeoutID = setTimeout(this.hideSecondLevel.bind(this), this.hideTimeout);
};

NavigationBar.prototype.showContainer = function() {
	this.container.classList.add("show");
};

NavigationBar.prototype.hideContainer = function() {
	this.container.classList.remove("show");
};
