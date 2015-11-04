app.controller('ProductCtrl', function($scope, $ionicModal, $stateParams, CategoryService, ProductService) {
  // Get products
  var getAll = function() {
    $scope.products = ProductService.all($stateParams.category_id);
  };

  getAll();
  $scope.current_category = CategoryService.get($stateParams.category_id)

  $scope.current_edit = null;
  $scope.current_new = null;


  // Adds a new product
  $scope.$root.add = function() {
    $scope.current_new = ProductService.new($scope.current_category);

    $ionicModal.fromTemplateUrl('templates/partials/modals/new-product.html', {
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

  // Edit products, print a modal
  $scope.edit = function(index) {
    $scope.current_index_edit = index;
    $scope.current_edit = ProductService.get(
      $scope.products[index].id,
      function(category) {
        // Can't edit system products
        if (category.type == "system") {
          return;
        }

        $ionicModal.fromTemplateUrl('templates/partials/modals/edit-category.html', {
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
      $scope.products[$scope.current_index_edit].name = $scope.current_edit.name
      ProductService.save($scope.current_edit);

      $scope.current_edit = null;
      $scope.current_index_edit = null;
      $scope.modal_edit.remove();

    // New modal deletion
    } else if ($scope.current_new !== null && $scope.current_new.name) {
      ProductService.save($scope.current_new, function() {
        $scope.products = getAll();
      });

      $scope.current_new = null;
      $scope.modal_new.remove();
    }
  };

  $scope.delete = function() {
    if ($scope.current_edit === null) {
      return;
    }

    // Can't edit system products
    if ($scope.current_edit.type == "system") {
      return;
    }

    ProductService.delete($scope.current_edit, function() {
      $scope.products = getAll();
    });

    $scope.current_edit = null;
    $scope.current_index_edit = null;
    $scope.modal_edit.remove();
  };
});
