angular.module('myApp',['ngRoute','ngSanitize','ngResource','myApp.directive','myApp.background','HelloController'])
  .config(['$locationProvider',
    function($locationProvider) {
    	console.log("fdsfsdf");
      $locationProvider.html5Mode(true);
    }]);