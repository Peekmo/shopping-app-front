app.service('CategoryService', function($resource, $localstorage, $connection, BASE_URL) {
  var storage_key = 'categories';
  var Category = $resource(BASE_URL + '/categories/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}},
    'delete': {method: 'DELETE', params: {id: "@id"}},
  });

  // Return new category
  this.new = function() {
    return new Category;
  };

  // Get all categories
  this.all = function() {
    if ($connection.has()) {
      var categories = Category.query(function(categories) {
        $localstorage.setArray(storage_key, categories);
      });
    } else {
      var categories = $localstorage.getArray('categories');
    }

    return categories;
  };

  // Get one category
  this.get = function(id, callback) {
    if ($connection.has()) {
      return Category.get({id: id}, callback);
    } else {
      var categories = this.all();
      for (var i=0; i<categories.length; i++) {
        if (categories[i].id == id) {
          callback && callback();

          return categories[i];
        }
      }
    }
  }

  // Save a new or already existing category
  this.save = function(category, callback) {
    if ($connection.has()) {
      if (category.id) {
        category.$update(callback);
      } else {
        category.$save(callback);
      }
    } else {
      var categories = this.all();

      if (category.id) {
        for (var i=0; i<categories.length; i++) {
          if (categories[i].id == category.id) {
            categories[i] = category;
          }
        }
      } else {
        category.id = "temp::" + new Date().getTime();
        categories.push(category);
      }

      $localstorage.setArray(storage_key, categories);
      callback && callback();
    }
  };

  // Suppression
  this.delete = function(category, callback) {
    if ($connection.has()) {
      if (category.id) {
        category.$delete(callback);
      }
    } else {
      var categories = this.all();

      for (var i=0; i<categories.length; i++) {
        if (categories[i].id == category.id) {
          categories.splice(i, 1);
          break;
        }
      }

      $localstorage.setArray(storage_key, categories);
      callback && callback();
    }
  }
});
