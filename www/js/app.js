var app = angular.module('shopping', ['ionic', 'ionic.utils', 'ngResource'])
.constant('BASE_URL', 'http://localhost:3000')
.constant('LOCALE_ONLY', true)
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  .state('tab.categories', {
    url: '/categories',
    views: {
      'menu': {
        templateUrl: 'templates/tab-categories.html',
        controller: 'CategoryCtrl'
      }
    }
  })
  .state('tab.products', {
    url: '/categories/:category_id/products',
    views: {
      'menu': {
        templateUrl: 'templates/products.html',
        controller: 'ProductCtrl'
      }
    }
  })
  .state('tab.shops', {
    url: '/shops',
    views: {
      'menu': {
        templateUrl: 'templates/tab-shops.html',
        controller: 'ShopCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/categories');
});
