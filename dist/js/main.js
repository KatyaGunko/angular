(function() {
    'use strict';

    /**
     *  MAIN MODULE
     */
    mainCtrl.$inject = ["$scope", "$timeout", "$mdSidenav", "$mdDialog", "resource", "Movies"];
    angular.module('fabwareApp', [
        'ngMaterial',
        'ngRoute',
        'chart.js',


        'Resources',
        'utils',
        'menu'
    ]);

    angular.module('fabwareApp').controller('mainCtrl', mainCtrl);


    /**
     *  Main app controller
     */
    /*@ngInject*/
    function mainCtrl($scope, $timeout, $mdSidenav, $mdDialog, resource, Movies) {

        // menu toggler
        $scope.toggleLeft = buildDelayedToggler('left');

        // getting data for app
        resource.getTop20({},

            function(success_res){

                // calling service method to create Movie instances from received data
                Movies.createMoviesList(success_res.data.movies);

            },
            function(err_res){

                // error alert
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title('Error!')
                        .textContent('Sorry, something went wrong while getting data from server.')
                        .ariaLabel('Alert Dialog')
                        .ok('OK')

                );
            });

        /**
         * Build handler to open/close a SideNav; when animation finishes
         * report completion in console
         */
        function buildDelayedToggler(navID) {
            return debounce(function () {
                $mdSidenav(navID)
                    .toggle();
            }, 200);
        }

        /**
         * Supplies a function that will continue to operate until the
         * time is up.
         */
        function debounce(func, wait, context) {
            var timer;
            return function debounced() {
                var context = $scope,
                    args = Array.prototype.slice.call(arguments);
                $timeout.cancel(timer);
                timer = $timeout(function () {
                    timer = undefined;
                    func.apply(context, args);
                }, wait || 10);
            };
        }
    }
})();

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

(function() {
    'use strict';

    /*@ngInject*/
    angular.module('fabwareApp').config(["$routeProvider", function($routeProvider){
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
    }]);

})();
(function() {
    'use strict';

    /*@ngInject*/
    angular.module('fabwareApp').config(["$mdThemingProvider", function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('lime');
    }]);

})();
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
(function() {
    'use strict';

    chartCtrl.$inject = ["$scope", "Movies", "ChartData"];
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
(function() {
    'use strict';


    favoritesCtrl.$inject = ["$scope", "Movies"];
    angular.module('fabwareApp').controller('favoritesCtrl', favoritesCtrl);

    /*@ngInject*/
    function favoritesCtrl($scope, Movies){

        var fc = this;
        fc.movies = Movies.moviesList;

    }
})();

(function() {
    'use strict';


    homeCtrl.$inject = ["$scope", "Movies"];
    angular.module('fabwareApp').controller('homeCtrl', homeCtrl);

    /*@ngInject*/
    function homeCtrl($scope, Movies){

        var hc = this;
        hc.movies = Movies.moviesList;

    }
})();

(function() {
    'use strict';

    /**
     *  Movie class that creates instance of movie
     *  and provides some methods
     */

    angular.module('fabwareApp').factory('Movie', ["$localstorage", "resource", function($localstorage, resource){

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
    }]);

})();

(function() {
    'use strict';

    /**
     *  Service that stores movies array and provides it to other
     *  controllers/directives etc.
     */

    angular.module('fabwareApp').service('Movies', ["Movie", function (Movie) {

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
    }]);

})();
(function() {
    'use strict';

    cardCtrl.$inject = ["$scope", "$mdMedia", "$mdDialog"];
    angular.module('fabwareApp').directive('card', function () {
        return {
            restrict: 'E',
            templateUrl: './src/modules/shared/card/cardDirective.html',
            scope: {
                movies: '=movies',
                filterfavorites: '=filterfavorites'
            },
            controller: cardCtrl,
            link: cardLink,
            controllerAs: 'cc'
        };
    });

    /*@ngInject*/
    function cardCtrl($scope, $mdMedia, $mdDialog){

        var cc = this;

        /**
         * Open video popup using angular material functionality
         */
        cc.showVideoPopup = function(ev, trailer) {

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            $mdDialog.show({
                controller: 'popupCtrl',
                controllerAs: 'pc',
                templateUrl: './src/modules/shared/videoPopup/videoPopup.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: {
                    trailer: trailer
                }
            }).then(function() {
                console.log('trailer closed');
            });

            $scope.$watch(function() {

                return $mdMedia('xs') || $mdMedia('sm');

            }, function(wantsFullScreen) {

                $scope.customFullscreen = (wantsFullScreen === true);

            });
        };

    }

    function cardLink(scope, element, attrs){

    }

})();
(function() {
	'use strict';

	angular.module('utils', []);

	/**
	 *  Localstorage module
	 */

	/*@ngInject*/
	angular.module('utils').factory('$localstorage', ['$window', function($window) {
		return {
			set: function(key, value) {

				$window.localStorage[key] = value;

			},
			get: function(key, defaultValue) {

				return $window.localStorage[key] || defaultValue;

			},
			setObject: function(key, value) {

				$window.localStorage[key] = JSON.stringify(value);

			},
			getObject: function(key) {

				if(window.localStorage[key] !== undefined){

					return JSON.parse(window.localStorage[key]);

				} else {

					return undefined;

				}
			}
		}
	}]);
})();
(function() {
    'use strict';

    sideNavCtrl.$inject = ["$scope"];
    angular.module('menu', []);

    /**
     *  Sidebar navigation directive
     */
    angular.module('menu').directive('sideNav', function () {
        return {
            restrict: 'E',
            templateUrl: './src/modules/shared/sidenav/sidenav.html',
            controller: sideNavCtrl,
            link: sideNavLink,
            controllerAs: 'sn'
        };
    });

    /*@ngInject*/
    function sideNavCtrl($scope){

        var sn = this;
    }

    function sideNavLink(scope, element, attrs){

    }

})();
(function() {
    'use strict';


    popupCtrl.$inject = ["$scope", "$mdDialog", "$sce", "trailer"];
    angular.module('fabwareApp').controller('popupCtrl', popupCtrl);

    /*@ngInject*/
    function popupCtrl($scope, $mdDialog, $sce, trailer){

        var pc = this;

        pc.trailer = $sce.trustAsHtml(trailer.embed);
        pc.title = trailer.title;

        pc.close = function(){
            $mdDialog.cancel();
        }
    }
})();
