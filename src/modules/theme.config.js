(function() {
    'use strict';

    /*@ngInject*/
    angular.module('fabwareApp').config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('lime')
            .accentPalette('lime');
    });

})();