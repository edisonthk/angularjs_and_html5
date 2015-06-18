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
    scope.currentPath = "";

    scope.system.current_transition_state = "";

    scope.framesLoadedFlag = false;
    var currentFrame = {
        path: null,
        front: true
    };

    // ビデオのパス
    
    scope.getVideoFront = {
        front:    function() { return framesFactory.getFrontFrames(true); },
        profile:  function() { return framesFactory.getProfileFrames(true); },
        skills:   function() { return framesFactory.getSkillsFrames(true); },
        interest: function() { return framesFactory.getInterestFrames(true); },
    }
    scope.getVideoEnd = {
        front:    function() { return framesFactory.getFrontFrames(false); },
        profile:  function() { return framesFactory.getProfileFrames(false); },
        skills:   function() { return framesFactory.getSkillsFrames(false); },
        interest: function() { return framesFactory.getInterestFrames(false); },
    }
    scope.animate_state = false;

    // 
    scope.userfield = {
        textbox: "",
        shop_selected: {},
        content: "/views/front.html",
    };


    var backgroundLoadedCallback = function() {
        scope.bgControl.addResizedCallback(function() {
            framesFactory.reload();
        }); 
    }

    var framesLoadedCallback = function() {
        scope.framesLoadedFlag = true;

        if(scope.bgControl.isPlaying()) {
            setCurrentFrames();
        }else{
            if(scope.system.initial) {
                showContentAndFrame();
            }else{
                setCurrentFrames();
                scope.bgControl.drawAgain();
            }
        } 

        scope.$apply();
    };

    var setCurrentFrames = function() {
        var frames;
        var video_path = currentFrame.path;
        if(currentFrame.front) {
            frames = scope.getVideoFront[video_path]();
        }else{
            frames = scope.getVideoEnd[video_path]();
        }
        scope.bgControl.setFrames(frames);
    }

    // show content and frame in animated way
    var showContentAndFrame = function() {
        scope.animate_state = false;
        scope.playVideo(scope.currentPath);
        var c = "/views/"+scope.currentPath+".html";

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
        
        scope.system.initial = false;
    }

    // location update
    scope.$watch(function () {
        return location.path();
    }, function (t) {

        var path = t.split("/");

        scope.currentPath = path.length > 1 && path[1].length > 0 ? path[1] : 'front';
        if(scope.framesLoadedFlag) {
            showContentAndFrame();
        }
    });  

    scope.$watch('bgControl', function() {
        backgroundLoadedCallback();
    });

    framesFactory.setLoadedCallback(framesLoadedCallback);

    // setInterval(function(){
    //   console.log(rootScope.getVideo().currentTime);
    // },1000/10);

    // BEGIN: API
    scope.playVideo = function(video_path) {
        
        if(scope.prev_path === null){
            // 初期状態
            var frames = scope.getVideoFront[video_path]();
            scope.bgControl.setFrames(frames);
            scope.bgControl.play();
            currentFrame.path = video_path;
            currentFrame.front = true;
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
            var from = scope.getVideoEnd[scope.prev_path]();
            var to = scope.getVideoFront[video_path]();
            scope.prev_path = video_path;
            scope.bgControl.pause();
            
            scope.playVideoWithTransition(from, to, video_path);
            
        }
    }

    // トランジションのビデオ
    scope.playVideoWithTransition = function(from, to, video_path){
        scope.bgControl.clearAllEvents();
        scope.bgControl.setFrames(from);
        scope.bgControl.play();
        currentFrame.path = scope.prev_path;
        currentFrame.front = false;

        scope.bgControl.addEventWhenEnded(function() {
            currentFrame.path = video_path;
            currentFrame.front = true;
            scope.bgControl.setFrames(to);
            scope.bgControl.play();
            scope.bgControl.addEventWhenEnded(function() {
                scope.bgControl.clearAllEvents();
            });
        });
    }

}
]);
