(function() {
	'use strict';

	angular
		.module('myApp')
		.controller('AdminCtrl', AdminCtrl);

	AdminCtrl.$inject = ['$scope', '$location', 'Fire', 'rsvpData'];

	function AdminCtrl($scope, $location, Fire, rsvpData) {
		// controllerAs ViewModel
		var admin = this;

		// authentication controls
		var _auth = Fire.auth();

		// get data from the database
		admin.data = Fire.data();

		/**
		 * Success function from authenticating
		 *
		 * @param authData {object}
		 */
		function _getAuthData(authData) {
			admin.user = authData;
			admin.isAuthenticated = !!admin.user;
		}

		// on login or logout
		_auth.$onAuth(_getAuthData);



		// verify that user is admin
		userData.getUser().then(function(data) {
			admin.adminReady = true;

			if (data.isAdmin) {
				admin.showAdmin = true;
			}
		});

		var _tab = $location.search().view;

		admin.tabs = [
			{
				name: 'Events',
				query: 'events'
			},
			{
				name: 'Add Event',
				query: 'add-event'
			}
		];

		admin.currentTab = _tab ? _tab : 'events';

		/**
		 * Change tabs by watching for route update
		 */
		$scope.$on('$routeUpdate', function(event, next) {
			admin.currentTab = next.params.view || 'events';
		});

		/**
		 * Function for successful API call getting user list
		 * Show Admin UI
		 * Display list of users
		 *
		 * @param data {Array} promise provided by $http success
		 * @private
		 */
		function _getAllUsersSuccess(data) {
			admin.users = data;

			angular.forEach(admin.users, function(user) {
				user.linkedAccounts = User.getLinkedAccounts(user);
			});
		}

		userData.getAllUsers().then(_getAllUsersSuccess);

		/**
		 * Show RSVPed guest modal
		 *
		 * @param eventId {string} event ID to get RSVPs for
		 * @param eventName {string} event name to get RSVPs for
		 */
		admin.showGuests = function(eventId, eventName) {
			admin.showGuestsEventId = eventId;
			admin.showGuestsEventName = eventName;
			admin.showModal = true;
		};
	}
})();