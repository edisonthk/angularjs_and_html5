var ImageLoader = function(images) {
    var self = this;
    self.progressUpdatedCallback = null;
    self.loadedCallback = function() {};
    self.userImageLoaded = function() {};

    self.images = images;
    self.progressUpdatedInterval = 100;
    self.progressUpdateTimer;
    self.loadedFlag = false;

    self.countImagesLoaded = 0;
    self.imageLoaded = function() {
        if(typeof self.userImageLoaded == 'function') {
            self.userImageLoaded(self.imageTags);    
        }
        self.countImagesLoaded += 1;

        if(self.countImagesLoaded >= self.images.length) {
            // all images is loaded
            clearInterval(self.progressUpdateTimer);
            self.loadedCallback();
        }
    };

    self.imageTags = [];
};

ImageLoader.prototype.load = function() {
    var self = this;

    self.loadedFlag = true;

    if(self.progressUpdatedCallback) {
        self.progressUpdateTimer = setInterval(function() {
            self.progressUpdatedCallback(self.countImagesLoaded / self.images.length);
        }, self.progressUpdatedInterval);
    }

    for (var i = 0; i < self.images.length; i++) {
        var img = new Image;
        img.src = self.images[i];
        img.onload = self.imageLoaded;
        self.imageTags.push(img);
    };
};

ImageLoader.prototype.getImagesTag = function() {
    var self = this;
    if(self.loadedFlag) {
        return self.imageTags;    
    }
    throw "execute load() method before you use getImagesTag() method.";
};

ImageLoader.prototype.setImageLoaded = function(cb) {
    this.userImageLoaded = cb;
};

ImageLoader.prototype.setProgressUpdatedCallback = function(cb) {
    this.progressUpdatedCallback = cb;
};

ImageLoader.prototype.setLoadedCallback = function(cb) {
    this.loadedCallback = cb;
};