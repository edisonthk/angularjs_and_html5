angular.module('myApp.factory', [])
    .factory('FramesFactory', [ function(){

        var frontFramesPathPrefix,
            endFramesPathPrefix,
            direction
        ;

        var frontFrames = [],
            profileFrames = [],
            skillsFrames = [],
            interestFrames = [],

            frontEndFrames = [],
            profileEndFrames = [],
            skillsEndFrames = [],
            interestEndFrames = [],
            loadedCallback = null
            ;

        var leadingZeroString = function(len, number) {
            var zeros = "0000000000" + number;
            return zeros.substring(zeros.length - len, zeros.length);
        }

        var totalLength = 227;
        var loadedLen = 0;
        var loaded = function() {
            loadedLen ++;
            if(loadedLen >= totalLength) {
                if(typeof loadedCallback === 'function') {
                    loadedCallback();
                }
            }
        };
        var configurePath = function() {
            direction = "vertical";
            if(CURRENT_SCREEN == HORIZONTAL_SCREEN) {
                direction = "horizontal";
            }
            frontFramesPathPrefix = "/assets/frames_front_"+direction+"/",
            endFramesPathPrefix = "/assets/frames_end_"+direction+"/";
        }

        var loadFrames = function() {
            loadedLen = 0;
            frontFrames = [];
            profileFrames = [];
            skillsFrames = [];
            interestFrames = [];
            frontEndFrames = [];
            profileEndFrames = [];
            skillsEndFrames = [];
            interestEndFrames = [];

            // front
            for (var i = 0; i < 47; i++) {
                var img = new Image;
                img.src = frontFramesPathPrefix+"front"+leadingZeroString(2, i)+".jpg";
                img.onload = loaded;
                frontFrames.push(img);
            };

            // for (var i = 0; i < 40; i++) {
            //     var img = new Image;
            //     img.src = frontFramesPathPrefix+"profile"+leadingZeroString(2, i)+".jpg";
            //     profileFrames.push(img);
            // };

            for (var i = 0; i < 10; i++) {
                var img = new Image;
                img.src = frontFramesPathPrefix+"skills"+leadingZeroString(2, i)+".jpg";
                img.onload = loaded;
                skillsFrames.push(img);
            };

            for (var i = 0; i < 28; i++) {
                var img = new Image;
                img.src = frontFramesPathPrefix+"dice"+leadingZeroString(2, i)+".jpg";
                img.onload = loaded;
                interestFrames.push(img);
            };

            // end
            for (var i = 0; i < 37; i++) {
                var img = new Image;
                img.src = endFramesPathPrefix+"front"+leadingZeroString(2, i)+".jpg";
                img.onload = loaded;
                frontEndFrames.push(img);
            };

            // for (var i = 0; i < 45; i++) {
            //     var img = new Image;
            //     img.src = endFramesPathPrefix+"profile"+leadingZeroString(2, i)+".jpg";
            //     profileEndFrames.push(img);
            // };

            for (var i = 0; i < 66; i++) {
                var img = new Image;
                img.src = endFramesPathPrefix+"skills"+leadingZeroString(2, i)+".jpg";
                img.onload = loaded;
                skillsEndFrames.push(img);
            };

            for (var i = 0; i < 39; i++) {
                var img = new Image;
                if(i > 24) {
                    img.src = endFramesPathPrefix+"dice25.jpg";
                }else{
                    img.src = endFramesPathPrefix+"dice"+leadingZeroString(2, i)+".jpg";    
                }
                img.onload = loaded;
                interestEndFrames.push(img);
            };
        }

        // configurePath();
        // loadFrames();

        return {
            getFrontFrames: function(front) { 
                if(front) {
                    return frontFrames;    
                }
                return frontEndFrames;
            },
            getProfileFrames: function(front) { 
                if(front) {
                    return profileFrames;    
                }
                return profileEndFrames;
            },
            getSkillsFrames: function(front) { 
                if(front) {
                    return skillsFrames;    
                }
                return skillsEndFrames;
            },
            getInterestFrames: function(front) { 
                if(front) {
                    return interestFrames;    
                }
                return interestEndFrames;
            },
            setLoadedCallback: function(cb) {
                loadedCallback = cb;
            },
            reload: function() {
                configurePath();
                loadFrames();
            },
        };
    }
]);
