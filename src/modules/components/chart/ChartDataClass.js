(function() {
    'use strict';

    /**
     *  CharData Class
     *  creates a config object for chat
     */
    angular.module('fabwareApp').factory('ChartData', function () {


        /**
         * @constructor
         */
        var ChartData = function(movies){

            var chronologicalObject = this.createChronologicalObject(movies);

            this.buildChartData(chronologicalObject);
        };

        /**
         * Create chronologicalObject
         * to store data about how many films had been filmed
         * in particular decade
         *
         * example
         *
         * key => value
         * 191 : 4 (1910 - 1920 - 4 movies)
         * 192 : 6 (1920 - 1930 - 6 movies)
         *
         */
        ChartData.prototype.createChronologicalObject = function(movies){

            var chronologicalObject = {};

            for ( var i = 0, max = movies.length; i < max; i++){

                var interval = Math.floor(+movies[i].year / 10);

                chronologicalObject[interval] = chronologicalObject[interval] ? +chronologicalObject[interval] + 1 : 1;
            }

            return chronologicalObject;
        };

        /**
         * Creating dataObject from chronologicalObject
         * where labels => array of keys form chronologicalObject in a format '1990-1991' etc.
         * where data => array of values form chronologicalObject
         * where colours => Chart module config colours.
         */
        ChartData.prototype.buildChartData = function(chronologicalObject){

            this.labels = [];
            this.data = [];
            this.colours = Chart.defaults.global.colours;

            for(var value in chronologicalObject){

                if(chronologicalObject.hasOwnProperty(value)){

                    this.labels.push( value + '0 - ' + (+value + 1) + '0');

                    this.data.push(chronologicalObject[value]);
                }
            }
        };

        return ChartData;
    });
})();