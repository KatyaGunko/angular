(function() {
    'use strict';
    angular.module('Resources', ['ngResource']);


    /*@ngInject*/
    angular.module('Resources').factory('resource', ['$resource', function ($resource) {
        return $resource('', {}, {

            // get top 20 movies
            getTop20: {method: 'GET', url: './json-resource/movies.json', isArray: false},

            // get Trailers for movie, where 'id' is movie imdbID
            getTrailers: { method: 'GET', url: './json-resource/:id.json', isArray: false }
        });
    }]);
})();
