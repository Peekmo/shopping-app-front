app.service('ShopService', function($resource, $localstorage, $connection, BASE_URL) {
  var storage_key = 'shops';
  var Shop = $resource(BASE_URL + '/shops/:id.json', null, {
    'update': {method: 'PUT', params: {id: "@id"}},
    'delete': {method: 'DELETE', params: {id: "@id"}},
  });

  this.sync = false;

  // Return new shop
  this.new = function() {
    return new Shop;
  };

  // Get all shops
  this.all = function(callback) {
    if ($connection.has() && !this.sync) {
      this.sync();

      var shops = $localstorage.getArray('shops');
      callback && callback(shops);

      shops = $localstorage.getArray('shops');
    } else if ($connection.has()) {
      var shops = Shop.query(function(shops) {
        $localstorage.setArray(storage_key, shops);
        callback(shops);

        shops = $localstorage.getArray('shops');
      });
    } else {
      this.sync = false;

      var shops = $localstorage.getArray('shops');
      callback && callback(shops);
      shops = $localstorage.getArray('shops');
    }

    return shops;
  };

  // Get one shop
  this.get = function(id, callback) {
    var shops = this.all();
    for (var i=0; i<shops.length; i++) {
      if (shops[i].id == id) {
        callback && callback(shops[i]);

        return shops[i];
      }
    }
  };

  // Save a new or already existing shop
  this.save = function(shop, callback) {
    if ($connection.has()) {
      if (shop.id) {
        shop.$update(callback);
      } else {
        shop.$save(callback);
      }
    } else {
      this.sync = false;
      var shops = this.all();

      if (shop.id) {
        for (var i=0; i<shops.length; i++) {
          if (shops[i].id == shop.id) {
            shops[i] = shop;
          }
        }
      } else {
        shop.id = "temp::" + new Date().getTime();
        shops.push(shop);
      }

      $localstorage.setArray(storage_key, shops);
      callback && callback();
    }
  };

  // Suppression
  this.delete = function(shop, callback) {
    if ($connection.has()) {
      if (shop.id) {
        shop.$delete(callback);
      }
    } else {
      this.sync = false;
      var shops = this.all();

      for (var i=0; i<shops.length; i++) {
        if (shops[i].id == shop.id) {
          shops.splice(i, 1);
          break;
        }
      }

      $localstorage.setArray(storage_key, shops);
      callback && callback();
    }
  };

  // Sync local storage and server
  this.sync = function() {
    if (!$connection.has()) {
      return;
    }

    var shops = Shop.query(function(shops) {
      var olds = $localstorage.getArray(storage_key, shops);

      // Adds new ones
      for (var i=0; i<olds.length; i++) {
        if (olds[i].id.startsWith("temp::")) {
          olds[i].id = null;
        }

        this.save(olds[i]);
      }

      // Remove old ones
      for (var i=0; i<shops.length; i++) {
        var found = false;

        for (var j=0; j<olds.length; j++) {
          if (shops[i].id == olds[j].id) {
            found = true;
            break;
          }
        }

        if (!found) {
          this.delete(shops[i]);
        }
      }

      $localstorage.setArray(storage_key, shops);
      this.sync = true;
    });
  };
});
