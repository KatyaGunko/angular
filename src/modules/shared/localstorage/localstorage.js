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