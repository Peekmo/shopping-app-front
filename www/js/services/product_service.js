app.service('ProductService', function($resource, $localstorage, $connection, BASE_URL) {
  var storage_key = 'products';
  var Product = $resource(BASE_URL + '/products/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}},
    'delete': {method: 'DELETE', params: {id: "@id"}},
  });

  this.sync = false;

  // Return new product
  this.new = function(category) {
    var product = new Product;
    product.category = category;

    return product;
  };

  // Get all products
  this.all = function(category_id, callback) {
    if ($connection.has() && !this.sync) {
      this.sync();

      var products = $localstorage.getArray('products');
      callback && callback(products);

      products = $localstorage.getArray('products');
    } else if ($connection.has()) {
      var products = Product.query(function(products) {
        $localstorage.setArray(storage_key, products);
        callback(products);

        products = $localstorage.getArray('products');
      });
    } else {
      this.sync = false;

      var products = $localstorage.getArray('products');
      callback && callback(products);
      products = $localstorage.getArray('products');
    }

    if (category_id !== null && category_id !== undefined) {
      var finalProducts = [];
      products.forEach(function(element) {
        if (element.category.id === category_id) {
          finalProducts.push(element);
        }
      });
    } else {
      finalProducts = products;
    }

    return finalProducts;
  };

  // Get one product
  this.get = function(id, callback) {
    var products = this.all();

    for (var i=0; i<products.length; i++) {
      if (products[i].id == id) {
        callback && callback(products[i]);

        return products[i];
      }
    }
  };

  // Save a new or already existing product
  this.save = function(product, callback) {
    if ($connection.has()) {
      if (product.id) {
        product.$update(callback);
      } else {
        product.$save(callback);
      }
    } else {
      this.sync = false;
      var products = this.all();

      if (product.id) {
        for (var i=0; i<products.length; i++) {
          if (products[i].id == product.id) {
            products[i] = product;
          }
        }
      } else {
        product.id = "temp::" + new Date().getTime();
        products.push(product);
      }

      $localstorage.setArray(storage_key, products);
      callback && callback();
    }
  };

  // Suppression
  this.delete = function(product, callback) {
    if ($connection.has()) {
      if (product.id) {
        product.$delete(callback);
      }
    } else {
      this.sync = false;
      var products = this.all();

      for (var i=0; i<products.length; i++) {
        if (products[i].id == product.id) {
          products.splice(i, 1);
          break;
        }
      }

      $localstorage.setArray(storage_key, products);
      callback && callback();
    }
  };

  // Sync local storage and server
  this.sync = function() {
    if (!$connection.has()) {
      return;
    }

    var products = Product.query(function(products) {
      var olds = $localstorage.getArray(storage_key, products);

      // Adds new ones
      for (var i=0; i<olds.length; i++) {
        if (olds[i].id.startsWith("temp::")) {
          olds[i].id = null;
        }

        this.save(olds[i]);
      }

      // Remove old ones
      for (var i=0; i<products.length; i++) {
        var found = false;

        for (var j=0; j<olds.length; j++) {
          if (products[i].id == olds[j].id) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.delete(products[i]);
        }
      }

      $localstorage.setArray(storage_key, products);
      this.sync = true;
    });
  }
});
