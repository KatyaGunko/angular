(function() {
    'use strict';

    /**
     *  Service that stores movies array and provides it to other
     *  controllers/directives etc.
     */

    angular.module('fabwareApp').service('Movies', function (Movie) {

        var self = this;
        self.moviesList = [];


        /**
         * Create array of Movie instances out of raw data
         */
        this.createMoviesList = function(arr){

            for( var i = 0, max = arr.length; i < max; i++ ){

                var movie = new Movie(arr[i]);

                movie.checkFavorite();
                movie.getTrailers();

                self.moviesList.push(movie);
            }
        };
    });

})();