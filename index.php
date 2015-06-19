<!doctype html>
<html lang="jp" ng-app="myApp">
<head>
	<meta charset="utf-8">
	<title>プロフィール</title>
	<meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=no">
	<base href="http://<?= $_SERVER["HTTP_HOST"] ?>/" />
	<link rel="stylesheet" type="text/css" href="/assets/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/assets/css/animate.min.css">
	<link rel="stylesheet" type="text/css" href="/assets/css/common.css">

</head>
<body ng-controller="HelloController">
    <div ng-if="system.initial || !framesLoadedFlag" class="spinner">
        <img src="spinner2.gif">
        <p>Loading ...</p>
    </div>
    
    <ng-include src="'/views/index.html'" onload="indexLoadedCallback()"></ng-include>
	<script>
    var HORIZONTAL_SCREEN = 1,
        VERTICAL_SCREEN = 2,
        UNKNOWN_SCREEN = 0,
        CURRENT_SCREEN = UNKNOWN_SCREEN
    ;
    </script>
	<script src="/dist/angularjs/angular.min.js"></script>
	<script src="/dist/angularjs/angular-route.min.js"></script>
	<script src="/dist/angularjs/angular-sanitize.min.js"></script>
	<script src="/dist/angularjs/angular-resource.min.js"></script>
	<script src="/controllers/FramesFactory.js"></script>
	<script src="/controllers/helloController.js"></script>
	<script src="/directives/background.js"></script>
	<script src="/directives/body.js"></script>
	<script src="/routes.js"></script>
</body>
</html>