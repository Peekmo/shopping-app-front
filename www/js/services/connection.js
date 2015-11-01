app.service('$connection', function(LOCALE_ONLY) {
  this.has = function() {
    if (LOCALE_ONLY) {
      return false;
    }

    if (window.Connection) {
      return navigator.connection.type !== Connection.NONE
    }

    return true;
  }
});
