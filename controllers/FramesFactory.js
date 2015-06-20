angular.module('myApp.factory', [])
    .factory('FramesFactory', [ function(){

        

        var frontFramesPathPrefix,
            endFramesPathPrefix,
            direction,
            frames = {},
            loadedCallback = null,
            progressUpdateCallback = null
            ;


        var leadingZeroString = function(len, number) {
            var zeros = "0000000000" + number;
            return zeros.substring(zeros.length - len, zeros.length);
        }

        
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
            frames = {};
            var links = [];
            var imageLinks = [];

            // front
            for (var i = 0; i < 47; i++) {
                imageLinks.push({
                    src:       frontFramesPathPrefix+"front"+leadingZeroString(2, i)+".jpg",
                    group:     'front',
                    direction: 'front',
                });
            };

            // for (var i = 0; i < 40; i++) {
            //     var img = new Image;
            //     img.src = frontFramesPathPrefix+"profile"+leadingZeroString(2, i)+".jpg";
            //     profileFrames.push(img);
            // };
            
            for (var i = 0; i < 10; i++) {
                imageLinks.push({
                    src:       frontFramesPathPrefix+"skills"+leadingZeroString(2, i)+".jpg",
                    group:     'skills',
                    direction: 'front',
                });
            };

            for (var i = 0; i < 28; i++) {
                imageLinks.push({
                    src:       frontFramesPathPrefix+"dice"+leadingZeroString(2, i)+".jpg",
                    group:     'interest',
                    direction: 'front',
                });
            };

            // end
            for (var i = 0; i < 37; i++) {
                imageLinks.push({
                    src:       endFramesPathPrefix+"front"+leadingZeroString(2, i)+".jpg",
                    group:     'front',
                    direction: 'end',
                });
            };

            // for (var i = 0; i < 45; i++) {
            //     var img = new Image;
            //     img.src = endFramesPathPrefix+"profile"+leadingZeroString(2, i)+".jpg";
            //     profileEndFrames.push(img);
            // };

            for (var i = 0; i < 66; i++) {
                imageLinks.push({
                    src:       endFramesPathPrefix+"skills"+leadingZeroString(2, i)+".jpg",
                    group:     'skills',
                    direction: 'end',
                });
            };

            for (var i = 0; i < 39; i++) {
                var src = "";
                if(i > 24) {
                    src = endFramesPathPrefix+"dice25.jpg";
                }else{
                    src = endFramesPathPrefix+"dice"+leadingZeroString(2, i)+".jpg";    
                }

                imageLinks.push({
                    src:       src,
                    group:     'interest',
                    direction: 'end',
                });
            };

            for (var i = 0; i < imageLinks.length; i++) {
                links.push(imageLinks[i].src);
            }

            var loader = new ImageLoader(links);

            loader.setProgressUpdatedCallback(progressUpdateCallback);
            loader.setLoadedCallback(loadedCallback);
            loader.load();


            var imagesTag = loader.getImagesTag();
            for (var i = 0; i < imageLinks.length; i++) {
                var link = imageLinks[i];
                var indexName = link.group + "_" + link.direction;
                if(typeof frames[indexName] === 'undefined') {
                    frames[indexName] = [];
                }

                for (var j = 0; j < imagesTag.length; j++) {
                    var imageTag = imagesTag[j];

                    var imageTagSrc = imageTag.src;
                    var pathPosition = -1;
                    if(link.direction == 'end') {
                        pathPosition = imageTagSrc.indexOf(endFramesPathPrefix);
                    }else {
                        pathPosition = imageTagSrc.indexOf(frontFramesPathPrefix);
                     
                    }

                    if(pathPosition > 0 ) {
                        imageTagSrc = imageTagSrc.substring(pathPosition, imageTagSrc.length);    
                    }
                    
                    if(imageTagSrc == link.src) {
                        link.tag = imageTag;
                        frames[indexName].push(imageTag);
                        break;      
                    }
                };
                
            };
        }

        // configurePath();
        // loadFrames();

        return {
            getFrontFrames: function(front) { 
                if(front) {
                    return frames["front_front"];
                }
                return frames["front_end"];
            },
            getProfileFrames: function(front) { 
                if(front) {
                    return frames["profile_front"];
                }
                return frames["profile_end"];;
            },
            getSkillsFrames: function(front) { 
                if(front) {
                    return frames["skills_front"];;    
                }
                return frames["skills_end"];;
            },
            getInterestFrames: function(front) { 
                if(front) {
                    return frames["interest_front"];;    
                }
                return frames["interest_end"];;
            },
            setProgressUpdateCallback: function(cb) {
                progressUpdateCallback = cb;
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
