var app = angular.module('app');

var acerca_de = function(){

}

app.controller('MainCtrl', function($scope, Menu, Config) {
  $scope.data = {};

  if (Config.livereload) {
    var path = './';
    console.log("Activando livereload ...");

    fs.watch(path, function() {
      if (location)
        location.reload();
    });
  }

  $scope.actualizar = function() {
    location.reload(true);
  }

  $scope.abrir_modo_desarrollador = function() {
    require('nw.gui').Window.get().showDevTools();
  }

  Menu.agregar_a_ventana(
      require('nw.gui').Window.get(),
      function(){
          swal("Here's a message!");
          swal({
              title: "Acerca de",
              text: "Un programa sencillo para hacer avatares.\n\n\n(c) 2014 - Hugo Ruscitti",
              imageUrl: "imagenes/caripela.png",
              confirmButtonText: "OK!"
          });
      }
  );


});
