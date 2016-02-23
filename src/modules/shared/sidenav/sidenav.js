(function() {
    'use strict';

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