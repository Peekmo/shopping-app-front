app.controller('CategoryCtrl', function($scope, $resource, $ionicModal, BASE_URL) {
  var Category = $resource(BASE_URL + '/categories/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}}
  });

  // Get categories
  $scope.categories = Category.query();
  $scope.current_edit = null;

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

    $scope.$on('modal.hidden', function() {
      // Edit modal deletion
      if ($scope.current_edit !== null) {
        $scope.categories[$scope.current_index_edit].name = $scope.current_edit.name
        $scope.current_edit.$update();

        $scope.current_edit = null;
        $scope.current_index_edit = null;
        $scope.modal_edit.remove();
      }
    });
  };
});
