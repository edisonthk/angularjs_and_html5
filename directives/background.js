angular.module('myApp.background',[])
  //
  // 背景の動画やフルサイズなどの仕事はこちらのdirectiveに任せています。
  // 
  // background directiveの使えるメソッドは
  // 1. getBackgroundCanvas()   返り値はbackgroundのcanvas要素です。
  // 2. state           状態オブジェクト
  //    * current         状態オブジェクトの現在の状態を返します
  //    * FLAG .. 
  // 3. getVideoList()      ビデオタグの配列を返します 
  .directive('background',['$window','$document','$location','$timeout',function(w,d,location,$timeout) {
    return {
      restrict: 'E',
      transclude: true,
      template: '<canvas width="{{canvas_width}}" height="{{canvas_height}}"></canvas><div style="position:absolute;" ng-transclude></div>',
      controller: ['$rootScope','$scope',function(rootScope,scope){
        
        var that = this;
        var cnt_pause = 0;
        
        // ページ遷移する際に使うオブジェクトです。
        // 現在の状態を表すフラグです。
        scope.state = {
          // それぞれの状態定数／フラグ
          FLAG_IDLE: 2,  // 動画が完全停止
          FLAG_PAUSE: 0,  // 動画を停止
          FLAG_PLAY: 1,   // 動画を再生

          // 初期状態
          initial: 0,
        }
        scope.state.current = scope.state.FLAG_PAUSE;
        scope.eventsWhenCanPlay = [];
        scope.eventsWhenEnded = [];

        // ビデオをCanvasにコピー
        var video = document.getElementById("video");
        video.loop = false;
        video.muted = true;
        video.currentTime = 0.0;
        video.pause();


        var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");

        var sizingEvent = function(){
          scope.canvas_height = d[0].body.offsetHeight;
          scope.canvas_width = d[0].body.offsetWidth;
          if(scope.state.initial > 0){
            ctx.drawImage(video, 0, 0, scope.canvas_width, scope.canvas_height);
          }
        }
        sizingEvent();  
        
        // resizeイベントを遅延する効果が働きます
        angular.element(w).on('resize', function(){
          clearTimeout(scope.system.timeout_id_for_background);
            scope.system.timeout_id_for_background = setTimeout(function(){
            
            // scopeを更新
            scope.$apply(function(){
              sizingEvent();
            });
          }, 1000);
        });


        
        // BEGIN: canvas drawImage
        setInterval(function(){

          if(scope.state.current == scope.state.FLAG_PAUSE){
            if(cnt_pause > 20){
              scope.state.current = scope.state.FLAG_IDLE;
              cnt_pause = 0 ;
            }
            cnt_pause++;
          } 

          if(scope.interruptEvent){
            var afterInterrupt = scope.interruptEvent();
            delete scope.interruptEvent;
          }

          if(typeof afterInterrupt === "undefined" || afterInterrupt){
            if(scope.state.current == scope.state.FLAG_PLAY || scope.state.current == scope.state.FLAG_IDLE){
              ctx.drawImage(video, 0, 0, scope.canvas_width, scope.canvas_height);
            }
          }
          
        },1000/20);
        // END: canvas drawImage


        // videoタグに関するイベント
        video.addEventListener("canplay",function(){
          cnt_pause = 0 ;
          // API: ビデオのロードが完了したらexecuteUntilCanplayイベントを実行
          if(scope.eventsWhenCanPlay.length > 0){
            var __temp = scope.eventsWhenCanPlay;
            scope.eventsWhenCanPlay = [];
            for (var i = 0; i < __temp.length; i++) {
              __temp[i](this);
            };
          }

          if(scope.state.current == scope.state.FLAG_PLAY){
            this.play();
          }else{
            this.pause();
          }

          if(scope.state.initial < 3){
            ctx.drawImage(video, 0, 0, scope.canvas_width, scope.canvas_height);
            scope.state.initial++;
          }
        });

        video.addEventListener("ended",function(){
          cnt_pause = 0 ;
          scope.state.current = scope.state.FLAG_PAUSE;
          // API: ビデオのプレイが終了したらeventWhenEndedイベントを実行
          if(scope.eventsWhenEnded.length > 0){
            var _temp = scope.eventsWhenEnded;
            scope.eventsWhenEnded = [];
            for (var i = 0; i < _temp.length; i++) {
              _temp[i](this);
            };
          }
        });
        
        // BEGIN: API 
        rootScope.getVideo = function() {
          return video;
        }
        rootScope.getBackgroundContext = function() {
          return ctx;
        }
        rootScope.getState = function() {
          return scope.state;
        }
        rootScope.playWithFlag = function() {
          scope.state.current = scope.state.FLAG_PLAY;
        }
        rootScope.pauseWithFlag = function() {
          scope.state.current = scope.state.FLAG_PAUSE;
        }
        rootScope.addEventWhenCanplay = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenCanPlay.push(_event);
          }
        }
        rootScope.addEventWhenEnded = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenEnded.push(_event);
          }
        }
        rootScope.clearAllEvents = function() {
          scope.eventsWhenEnded = [];
          scope.eventsWhenCanPlay = [];
        }
        // END: API

        
      }]
    }
  }]);