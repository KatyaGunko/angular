(function() {
    'use strict';

    /**
     *  MAIN MODULE
     */
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
