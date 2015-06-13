angular.module('myApp.directive',[])

  .directive('body',['$window','$document',function(w,d) {
    return {
      restrict: 'E',
      link: function(scope, element, attrs){
        // 初期化
        scope.system = {};
        scope.system.timeout_id = 0;
        var sizingEvent = function(){
           scope.system.height = d[0].body.offsetHeight;
           scope.system.width = d[0].body.offsetWidth;
        }
        sizingEvent();  
        
        // resizeイベントを遅延する効果が働きます
        angular.element(w).on('resize', function(){
          clearTimeout(scope.system.timeout_id);
            scope.system.timeout_id = setTimeout(function(){
              sizingEvent();

                // scopeを更新
              scope.$apply(attrs.onResize);
            }, 1000);
        });
      }

    }
  }])