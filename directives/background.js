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
      scope: {
        control: '=',
      },
      template: '<canvas id="gafewVA21Z" width="{{canvas_width}}" height="{{canvas_height}}"></canvas><div style="position:absolute;" ng-transclude></div>',
      link: function(scope){
        
        var that = this,
            control = {},
            cnt_pause = 0
            canvas = document.getElementById("gafewVA21Z"),
            currentFrameIndex = 0,
            currentFrames = [],
            currentFrame = null,
            frames = [],
            intervalIndex = null
            ;
        
        
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

        
        var ctx = document.getElementsByTagName("canvas")[0].getContext("2d");

        var sizingEvent = function(){
            scope.canvas_height = window.innerHeight;
            scope.canvas_width = window.innerWidth;
            if(currentFrame != null){
                ctx.drawImage(currentFrame, 0, 0, scope.canvas_width, scope.canvas_height);
            }
        }
        sizingEvent();  
        
        // resizeイベントを遅延する効果が働きます
        angular.element(w).on('resize', function(){
            clearTimeout(scope.timeout_id_for_background);
            scope.timeout_id_for_background = setTimeout(function(){
            
                // scopeを更新
                sizingEvent();
            
            }, 1000);
        });


        
        var canvasDrawImage = function(){

            if(scope.state.current == scope.state.FLAG_PLAY || scope.state.current == scope.state.FLAG_IDLE){
                if(currentFrameIndex < currentFrames.length) {
                    currentFrame = currentFrames[currentFrameIndex];
                    try{
                        ctx.drawImage(currentFrame, 0, 0, scope.canvas_width, scope.canvas_height);    
                    }catch(err){}
                    
                    currentFrameIndex ++;
                }else{
                    scope.control.stop();
                    if(scope.eventsWhenEnded.length > 0 ) {
                        for (var i = 0; i < scope.eventsWhenEnded.length; i++) {
                            scope.eventsWhenEnded[i]();
                        }
                    }
                }
            }
          
        };

        // videoタグに関するイベント
        // BEGIN: API
        scope.control.setFrames = function(frames) {
            scope.control.stop();
            currentFrames = frames;
            if(currentFrames.length > 0) {
                currentFrame = currentFrames[0];
            }
        }
        scope.control.play = function() {
            clearInterval(intervalIndex);
            scope.state.current = scope.state.FLAG_PLAY;
            currentFrameIndex = 0;
            intervalIndex = setInterval(canvasDrawImage, 1000/20);
        };
        scope.control.stop = function() {
            scope.state.current = scope.state.FLAG_PAUSE;
            clearInterval(intervalIndex);
        };
        scope.control.pause = function() {
            scope.control.stop();
        }
        scope.control.getBackgroundContext = function() {
          return ctx;
        }
        scope.control.getState = function() {
          return scope.state;
        }
        scope.control.addEventWhenCanplay = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenCanPlay.push(_event);
          }
        }
        scope.control.addEventWhenEnded = function(_event){
          if(typeof _event === "function"){
            scope.eventsWhenEnded.push(_event);
          }
        }
        scope.control.clearAllEvents = function() {
          scope.eventsWhenEnded = [];
          scope.eventsWhenCanPlay = [];
        }
        // END: API

        
      }
    }
  }]);