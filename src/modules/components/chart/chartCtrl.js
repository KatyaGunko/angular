(function() {
    'use strict';

    angular.module('fabwareApp').controller('chartCtrl', chartCtrl);

    /**
     * Controller for chart page
     */

    /*@ngInject*/
    function chartCtrl($scope, Movies, ChartData){

        var cc = this;


        var config = new ChartData(Movies.moviesList);

        cc.labels = config.labels;
        cc.data = config.data;
        cc.colours = config.colours;
    }
})();