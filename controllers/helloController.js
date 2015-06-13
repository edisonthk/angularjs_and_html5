angular.module('myApp.controllers', [])
.controller('HelloController', ['$scope','$http','$location','$timeout','FramesFactory',
  function(scope, http, location, $timeout, framesFactory){

    //　システムオブジェクト
    // アルゴリズムをスムーズに行われるために必要とされるフラグはここで管理しています。
    // 
    // * initial 初期フラグ   - このサイトのロードが初めてなのかを確認するフラグです。
    // * prev_path 前回のパス - 前回のuri。もし初期状態だと、prev_pathはNULLになる。
    scope.system = {}
    scope.system.initial = true;
    scope.prev_path = null;
    scope.bgControl = {};

    scope.system.current_transition_state = "";

    // ビデオのパス
    
    scope.videoFront = {
        front:    framesFactory.getFrontFrames(true),
        profile:  framesFactory.getProfileFrames(true),
        skills:   framesFactory.getSkillsFrames(true),
        interest: framesFactory.getInterestFrames(true),   
    }
    scope.videoEnd = {
        front:    framesFactory.getFrontFrames(false),
        profile:  framesFactory.getProfileFrames(false),
        skills:   framesFactory.getSkillsFrames(false),
        interest: framesFactory.getInterestFrames(false),
    }
    scope.animate_state = false;

    // 
    scope.userfield = {
        textbox: "",
        shop_selected: {},
        content: "/views/front.html",
    };

    // location update
    scope.$watch(function () {
        return location.path();
    }, function (t) {

        var path = t.split("/");
        scope.animate_state = false;
        if(path.length > 1 && path[1].length > 0){
            // 詳細ページ
            if(path[1] === "profile"){
                // リストページ
                scope.playVideo("profile");
                var c = "/views/profile.html";


                if(scope.system.initial){
                    scope.animate_state = true;
                    scope.userfield.content = c;  
                }else{
                    scope.userfield.content = c;
                    scope.bgControl.addEventWhenEnded(function(v) {
                        scope.animate_state = true;
                        scope.$apply();
                    });
                }
            }else if(path[1] === "skills"){
                scope.playVideo("skills");

                var c = "/views/skills.html";
                scope.animate_state = false;
                if(scope.system.initial){
                    scope.animate_state = true;
                    scope.userfield.content = c;  
                }else{
                    scope.userfield.content = c;
                    scope.bgControl.addEventWhenEnded(function(v) {
                        scope.animate_state = true;
                        scope.$apply();
                    });
                }

            }else if(path[1] === "interest"){
                scope.playVideo("interest");
                var c = "/views/interest.html";
                scope.animate_state = false;
                if(scope.system.initial){
                    scope.animate_state = true;
                    scope.userfield.content = c;  
                }else{
                    scope.userfield.content = c;
                    scope.bgControl.addEventWhenEnded(function(v) {
                        scope.animate_state = true;
                        scope.$apply();
                    });
                }
            }

        }else{
            // リストページ
            scope.playVideo("front");
            
            var c = "/views/front.html";
            scope.animate_state = false;
            if(scope.system.initial){
                scope.animate_state = true;
                scope.userfield.content = c;  
            }else{
                scope.userfield.content = c;
                scope.bgControl.addEventWhenEnded(function(v) {
                    scope.animate_state = true;
                    scope.$apply();
                });
            }
        }

        scope.system.initial = false;

    });  


    // setInterval(function(){
    //   console.log(rootScope.getVideo().currentTime);
    // },1000/10);

    // BEGIN: API
    scope.playVideo = function(video_path) {
      if(scope.prev_path === null){
        // 初期状態
        var frames = scope.videoFront[video_path];
        console.log(scope.bgControl);
        scope.bgControl.setFrames(frames);
        scope.bgControl.play();
        scope.bgControl.addEventWhenEnded(function() {
            scope.prev_path = video_path;
            scope.bgControl.clearAllEvents();
        });
    }else{

        scope.bgControl.pause();

        // 初期状態ではありません。
        // とあるページから遷移しているから、遷移ビデオを流す
        
        //    A   <- transition <-    B
        // reverse         <-      forward   
        var from = scope.videoEnd[scope.prev_path];
        var to = scope.videoFront[video_path];
        scope.prev_path = video_path;
        scope.bgControl.pause();
        
        scope.playVideoWithTransition(from, to);
        
    }
}

    // トランジションのビデオ
    scope.playVideoWithTransition = function(from, to){
        scope.bgControl.clearAllEvents();
        scope.bgControl.setFrames(from);
        scope.bgControl.play();
        console.log("play");
        scope.bgControl.addEventWhenEnded(function() {
            
            scope.bgControl.setFrames(to);
            scope.bgControl.play();
            scope.bgControl.addEventWhenEnded(function() {
                scope.bgControl.clearAllEvents();
            });
        });
    }

    scope.playVideoFromTo = function(from, to){
      var new_currentTime = rootScope.getVideo().duration - rootScope.getVideo().currentTime;

      rootScope.getVideo().src = from;
      // トランジションの場合はsrcを挿入してからcurrentTimeを設定
      if(scope.system.current_transition_state == "from" || scope.system.current_transition_state == "to"){

        rootScope.clearAllEvents();

        rootScope.getVideo().pause();
        rootScope.getVideo().currentTime = new_currentTime;
    }

    scope.system.current_transition_state = "from";
    rootScope.addEventWhenCanplay(function() {
        rootScope.playWithFlag();
    });
    if(typeof to !== "undefined"){
        // parameter "to" is defined
        rootScope.addEventWhenEnded(function() {
          rootScope.getVideo().src = to;
          scope.system.current_transition_state = "to";
          rootScope.playWithFlag();
          rootScope.addEventWhenEnded(function() {
            scope.system.current_transition_state = "";
        });
      });
    }else{
        scope.system.current_transition_state = "to";
        // parameter "to" is undefined
        rootScope.addEventWhenEnded(function() {
          scope.system.current_transition_state = "";
      });
    }
}
}
]);
