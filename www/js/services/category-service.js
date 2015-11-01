app.service('CategoryService', function($resource, BASE_URL) {
  var Category = $resource(BASE_URL + '/categories/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}}
  });

  // Return new category
  this.new = function() {
    return new Category;
  };

  // Get all categories
  this.all = function() {
    return Category.query();
  };

  // Save a new or already existing category
  this.save = function(category, callback) {
    if (category.id) {
      category.$update(callback);
    } else {
      category.$save(callback);
    }
  }
});
