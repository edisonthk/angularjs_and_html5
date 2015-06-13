<!doctype html>
<html lang="jp" ng-app="myApp">
<head>
	<meta charset="utf-8">
	<title>プロフィール</title>
	<meta name="description" content="">
	<base href="http://<?= $_SERVER["HTTP_HOST"] ?>/" />
	<link rel="stylesheet" type="text/css" href="/assets/css/reset.css">
	<link rel="stylesheet" type="text/css" href="/assets/css/animate.min.css">
	<link rel="stylesheet" type="text/css" href="/assets/css/common.css">

</head>
<body ng-include="'/views/index.html'">

	
	<script type="text/javascript" src="/dist/angularjs/angular.min.js"></script>
	<script type="text/javascript" src="/dist/angularjs/angular-route.min.js"></script>
	<script type="text/javascript" src="/dist/angularjs/angular-sanitize.min.js"></script>
	<script type="text/javascript" src="/dist/angularjs/angular-resource.min.js"></script>
	
	<script type="text/javascript" src="/controllers/helloController.js"></script>
	<script type="text/javascript" src="/directives/background.js"></script>
	<script type="text/javascript" src="/directives/body.js"></script>
	<script type="text/javascript" src="/routes.js"></script>
</body>
</html>