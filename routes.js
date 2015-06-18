angular.module('myApp',['ngRoute','ngSanitize','ngResource','myApp.directive','myApp.background','myApp.controllers','myApp.factory'])
  .config(['$locationProvider',
    function($locationProvider) {
      $locationProvider.html5Mode(true);
    }]);