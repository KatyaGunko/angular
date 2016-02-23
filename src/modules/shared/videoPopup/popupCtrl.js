(function() {
    'use strict';


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
