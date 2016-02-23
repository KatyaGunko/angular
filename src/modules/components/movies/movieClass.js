(function() {
    'use strict';

    /**
     *  Movie class that creates instance of movie
     *  and provides some methods
     */

    angular.module('fabwareApp').factory('Movie', function($localstorage, resource){

        /**
         * @constructor
         */
        var Movie = function(options){

            this.id = options.idIMDB || '';

            this.title = options.title || '';

            this.year = options.year || '';

            this.directors = angular.copy(options.directors) || [];

            this.poster = options.urlPoster || '';

            this.plot = options.plot || '';

            this.genres = angular.copy(options.genres) || [];

            this.rating = options.rating || 0;

            this.countries = angular.copy(options.countries) || [];

        };

        /**
         *  Get trailers for movie
         */
        Movie.prototype.getTrailers = function(){

            var self = this;

            var params = {
                id: self.id
            };

            resource.getTrailers(params,

                function(success_res){

                    self.trailers = [];

                    if(success_res.data && success_res.data.trailer){
                        self.trailers = success_res.data.trailer;
                    }

                },
                function(err_res){

                }
            );

        };

        /**
         *  Change tha value of favorite
         */
        Movie.prototype.toggleFavorite = function(){

            var favorites = $localstorage.getObject('Favorites') || [];

            var index = favorites.indexOf(this.id);

            this.favorite = ( index === -1 );

            if(this.favorite){

                favorites.push(this.id);

                $localstorage.setObject('Favorites', favorites);
                console.log('added to favorites');

            } else {

                favorites.splice(index, 1);

                $localstorage.setObject('Favorites', favorites);
                console.log('removed from favorites');
            }
        };

        /**
         *  Check if movie is one of favorites
         */
        Movie.prototype.checkFavorite = function(){

            var favorites = $localstorage.getObject('Favorites') || [];

            var index = favorites.indexOf(this.id);

            this.favorite = !( index === -1 );

        };

        return Movie;
    });

})();
