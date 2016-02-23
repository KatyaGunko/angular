(function() {
    'use strict';


    angular.module('fabwareApp').controller('homeCtrl', homeCtrl);

    /*@ngInject*/
    function homeCtrl($scope, Movies){

        var hc = this;
        hc.movies = Movies.moviesList;

    }
})();
