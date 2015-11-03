app.service('CategoryService', function($resource, $localstorage, $connection, BASE_URL) {
  var storage_key = 'categories';
  var Category = $resource(BASE_URL + '/categories/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}},
    'delete': {method: 'DELETE', params: {id: "@id"}},
  });

  this.sync = false;

  // Return new category
  this.new = function() {
    return new Category;
  };

  // Get all categories
  this.all = function(callback) {
    if ($connection.has() && !this.sync) {
      this.sync();

      var categories = $localstorage.getArray('categories');
      callback && callback(categories);
      
      categories = $localstorage.getArray('categories');
    } else if ($connection.has()) {
      var categories = Category.query(function(categories) {
        $localstorage.setArray(storage_key, categories);
        callback(categories);

        categories = $localstorage.getArray('categories');
      });
    } else {
      this.sync = false;

      var categories = $localstorage.getArray('categories');
      callback && callback(categories);
      categories = $localstorage.getArray('categories');
    }

    return categories;
  };

  // Get one category
  this.get = function(id, callback) {
    var categories = this.all();
    for (var i=0; i<categories.length; i++) {
      if (categories[i].id == id) {
        callback && callback(categories[i]);

        return categories[i];
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
      this.sync = false;
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
      this.sync = false;
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

  // Sync local storage and server
  this.sync = function() {
    if (!$connection.has()) {
      return;
    }

    var categories = Category.query(function(categories) {
      var olds = $localstorage.getArray(storage_key, categories);

      // Adds new ones
      for (var i=0; i<olds.length; i++) {
        if (olds[i].id.startsWith("temp::")) {
          olds[i].id = null;
        }

        this.save(olds[i]);
      }

      // Remove old ones
      for (var i=0; i<categories.length; i++) {
        var found = false;

        for (var j=0; j<olds.length; j++) {
          if (categories[i].id == olds[j].id) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.delete(categories[i]);
        }
      }

      $localstorage.setArray(storage_key, categories);
      this.sync = true;
    });
  }
});
