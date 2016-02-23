(function() {
    'use strict';


    angular.module('fabwareApp').controller('favoritesCtrl', favoritesCtrl);

    /*@ngInject*/
    function favoritesCtrl($scope, Movies){

        var fc = this;
        fc.movies = Movies.moviesList;

    }
})();
