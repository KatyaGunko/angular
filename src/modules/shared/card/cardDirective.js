(function() {
    'use strict';

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