(function() {
    'use strict';

    /*@ngInject*/
    angular.module('fabwareApp').config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl: './views/home.html',
                controller: 'homeCtrl',
                controllerAs: 'hc'
            })
            .when('/chart',{
                templateUrl: './views/chart.html',
                controller: 'chartCtrl',
                controllerAs: 'cc'
            })
            .when('/favorites',{
                templateUrl: './views/favorites.html',
                controller: 'favoritesCtrl',
                controllerAs: 'fc'
            })
            .otherwise({
                redirectTo: '/'
            });
    });

})();