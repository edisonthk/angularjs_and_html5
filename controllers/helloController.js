angular.module('HelloController', [])
.controller('HelloController', ['$rootScope','$scope','$http','$location','$timeout',
  function(rootScope, scope, http, location, $timeout, Shop){

    //　システムオブジェクト
    // アルゴリズムをスムーズに行われるために必要とされるフラグはここで管理しています。
    // 
    // * initial 初期フラグ   - このサイトのロードが初めてなのかを確認するフラグです。
    // * prev_path 前回のパス - 前回のuri。もし初期状態だと、prev_pathはNULLになる。
    scope.system = {}
    scope.system.initial = true;
    scope.system.prev_path = null;

    scope.system.current_transition_state = "";

    // ビデオのパス
    var videopath_prefix = "/assets/video/";
    scope.video = {
      front: videopath_prefix+"front.mp4",
      profile: videopath_prefix+"profile.mp4",
      skills: videopath_prefix+"skills.mp4",
      interest: videopath_prefix+"dice.mp4",
      
    }
    scope.video_reverse = {
      front: videopath_prefix+"front_reverse.mp4",
      profile: videopath_prefix+"profile_reverse.mp4",
      skills: videopath_prefix+"skills_reverse.mp4",
      interest: videopath_prefix+"dice_reverse.mp4",
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
            rootScope.addEventWhenEnded(function(v) {
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
            rootScope.addEventWhenEnded(function(v) {
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
            rootScope.addEventWhenEnded(function(v) {
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
          rootScope.addEventWhenEnded(function(v) {
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
      var sys = scope.system;
      if(sys.prev_path === null){
        // 初期状態
        sys.prev_path = video_path;
        rootScope.getVideo().src = scope.video_reverse[video_path];
        rootScope.addEventWhenCanplay(function() {
          rootScope.getVideo().currentTime = rootScope.getVideo().duration;
        });
      }else{

        rootScope.getVideo().pause();

        // 初期状態ではありません。
        // とあるページから遷移しているから、遷移ビデオを流す
        
        //    A   <- transition <-    B
        // reverse         <-      forward   
        var from = scope.video[sys.prev_path];
        var to = scope.video_reverse[video_path];
        sys.prev_path = video_path;
        rootScope.pauseWithFlag();
        
        scope.playVideoWithTransition(from, to);
        
        sys.prev_path = video_path;

      }
    }

    // トランジションのビデオ
    scope.playVideoWithTransition = function(from, to){
      if(scope.system.current_transition_state == ""){
        scope.playVideoFromTo(from, to);  
      }else if(scope.system.current_transition_state == "from"){
        scope.playVideoFromTo(to);
      }else if(scope.system.current_transition_state == "to"){
        scope.playVideoFromTo(from, to);
      }
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
