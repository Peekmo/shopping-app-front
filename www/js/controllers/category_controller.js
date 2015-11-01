app.controller('CategoryCtrl', function($scope, $resource, $ionicModal, BASE_URL) {
  var Category = $resource(BASE_URL + '/categories/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}}
  });

  // Get categories
  $scope.categories = Category.query();
  $scope.current_edit = null;
  $scope.current_new = null;

  // Adds a new category
  $scope.$root.add = function() {
    $scope.current_new = new Category;

    $ionicModal.fromTemplateUrl('templates/partials/modals/new-category.html', {
      scope: $scope,
      animation: 'slide-in-up'
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
    $scope.current_edit = Category.get({
      id: $scope.categories[index].id
    }, function(category) {
      $ionicModal.fromTemplateUrl('templates/partials/modals/edit-category.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal_edit = modal;
        $scope.modal_edit.show();
      });
    });
  };

  $scope.$on('modal.hidden', function() {
    // Edit modal deletion
    if ($scope.current_edit !== null) {
      $scope.categories[$scope.current_index_edit].name = $scope.current_edit.name
      $scope.current_edit.$update();

      $scope.current_edit = null;
      $scope.current_index_edit = null;
      $scope.modal_edit.remove();

    // New modal deletion
    } else if ($scope.current_new !== null && $scope.current_new.name) {
      $scope.current_new.$save(function() {
        $scope.categories = Category.query()        
      });

      $scope.current_new = null;
      $scope.modal_new.remove();
    }
  });
});
