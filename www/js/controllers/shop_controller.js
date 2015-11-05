app.controller('ShopCtrl', function($scope, $ionicModal, ShopService) {
    // Get shops
  var getAll = function() {
    $scope.shops = ShopService.all();
  };

  getAll();

  $scope.current_edit = null;
  $scope.current_new = null;


  // Adds a new shop
  $scope.$root.add = function() {
    $scope.current_new = ShopService.new($scope.current_shop);

    $ionicModal.fromTemplateUrl('templates/partials/modals/new-shop.html', {
      scope: $scope,
      animation: 'slide-in-up',
      focusFirstInput: true
    }).then(function(modal) {
      $scope.modal_new = modal;
      $scope.modal_new.show();
    });
    };
    // Remove from the global scope
    $scope.$on("$stateChangeStart", function() {
    $scope.$root.add = null;
  });

  // Edit shops, print a modal
  $scope.edit = function(index) {
    $scope.current_index_edit = index;
    $scope.current_edit = ShopService.get(
      $scope.shops[index].id,
      function(shop) {
        // Can't edit system shops
        if (shop.type == "system") {
          return;
        }

        $ionicModal.fromTemplateUrl('templates/partials/modals/edit-shop.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.modal_edit = modal;
          $scope.modal_edit.show();
        });
      }
    );
  };

  $scope.save = function() {
    // Edit modal deletion
    if ($scope.current_edit !== null) {
      $scope.shops[$scope.current_index_edit].name = $scope.current_edit.name
      ShopService.save($scope.current_edit);

      $scope.current_edit = null;
      $scope.current_index_edit = null;
      $scope.modal_edit.remove();

    // New modal deletion
    } else if ($scope.current_new !== null && $scope.current_new.name) {
      ShopService.save($scope.current_new, function() {
        getAll();
      });

      $scope.current_new = null;
      $scope.modal_new.remove();
    }
  };

  $scope.delete = function() {
    if ($scope.current_edit === null) {
      return;
    }

    ShopService.delete($scope.current_edit, function() {
      getAll();
    });

    $scope.current_edit = null;
    $scope.current_index_edit = null;
    $scope.modal_edit.remove();
  };
});
