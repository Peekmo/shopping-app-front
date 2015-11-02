app.controller('CategoryCtrl', function($scope, $ionicModal, CategoryService) {

  // Get categories
  $scope.categories = CategoryService.all();
  $scope.current_edit = null;
  $scope.current_new = null;

  // Adds a new category
  $scope.$root.add = function() {
    $scope.current_new = CategoryService.new();

    $ionicModal.fromTemplateUrl('templates/partials/modals/new-category.html', {
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

  // Edit categories, print a modal
  $scope.edit = function(index) {
    $scope.current_index_edit = index;
    $scope.current_edit = CategoryService.get(
      $scope.categories[index].id,
      function(category) {
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
      $scope.categories[$scope.current_index_edit].name = $scope.current_edit.name
      CategoryService.save($scope.current_edit);

      $scope.current_edit = null;
      $scope.current_index_edit = null;
      $scope.modal_edit.remove();

    // New modal deletion
    } else if ($scope.current_new !== null && $scope.current_new.name) {
      CategoryService.save($scope.current_new, function() {
        $scope.categories = CategoryService.all();
      });

      $scope.current_new = null;
      $scope.modal_new.remove();
    }
  };

  $scope.delete = function() {
    if ($scope.current_edit === null) {
      return;
    }

    CategoryService.delete($scope.current_edit, function() {
      $scope.categories = CategoryService.all();
    });

    $scope.current_edit = null;
    $scope.current_index_edit = null;
    $scope.modal_edit.remove();
  }
});
