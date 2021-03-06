(function() {
	'use strict';

	angular
		.module('myApp')
		.run(authRun);

	authRun.$inject = ['$rootScope', '$cookies', '$location', 'Fire'];

	function authRun($rootScope, $cookies, $location, Fire) {
		$rootScope.$on('$routeChangeStart', function(event, next, current) {
			var _isAuthenticated = !!Fire.ref.getAuth();

			if (next && next.$$route) {

				// if not authenticated, redirect to login page
				// if possible, after login, redirect to intended route (large mq)
				if (next.$$route.secure && !_isAuthenticated) {
					$cookies.authPath = $location.path();

					$rootScope.$evalAsync(function() {
						// send user to login
						$location.path('/login');
						$location.hash(null);
						$location.search('view', null);
					});
				}

				// if attempting to access /login route and already logged in, redirect to homepage
				if (next.$$route.originalPath === '/login' && _isAuthenticated) {
					$rootScope.$evalAsync(function() {
						$location.path('/');
					});
				}

				// if redirecting from Oauth, check to see if an intended route was saved
				// if intended secure route, login and then redirect
				// if no intended route, go to homepage
				if (current && current.$$route && current.$$route.originalPath === '/login' && _isAuthenticated) {
					$rootScope.$evalAsync(function() {
						if ($cookies.authPath) {
							$location.path($cookies.authPath);
						} else {
							$location.path('/');
						}
					});
				}

				// logged in and going to and from a secure route: clear cookie
				if (next && next.$$route && next.$$route.secure && current && current.$$route && current.$$route.secure && _isAuthenticated) {
					delete $cookies.authPath;
				}
			}

		});
	}

})();