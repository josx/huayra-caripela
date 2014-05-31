var fs = require('fs');
var app = angular.module('app');

var sel_Rect = undefined;





app.factory("Canvas", function() {
  var Canvas = {}
  var ruta_mis_archivos = process.env.HOME + '/.caripela/'


  Canvas.actualizar = function() {
    Canvas.canvas = new fabric.Canvas('canvas');
    fabric.Object.prototype.transparentCorners = false;

    Canvas.canvas.on("object:selected", function(options) {
      Canvas.funcion_respuesta.call(this, true);
    });

    Canvas.canvas.on("selection:cleared", function(options) {
      Canvas.funcion_respuesta.call(this, false);
    });
  }

  Canvas.conectar_eventos = function(funcion_respuesta) {
    Canvas.funcion_respuesta = funcion_respuesta;
  }

  function informar_error(error) {
    if (error)
      alert(error);
  }

  Canvas.definir_imagen_de_fondo = function(ruta) {
    var c = Canvas.canvas;
    c.setBackgroundImage(ruta, c.renderAll.bind(c));
  }

  Canvas.guardar_como_archivo_svg = function(ruta) {
      var data = Canvas.canvas.toSVG();

      fs.writeFile(ruta, data, 'utf-8', informar_error);
  }

  Canvas.guardar_como_archivo_png = function(ruta, success) {
    var data = Canvas.canvas.toDataURL({format: 'png'});
    var base64Data = data.replace(/^data:image\/png;base64,/, "");

    fs.writeFile(ruta, base64Data, 'base64', function(err) {
      if (err) {
        informar_error.call(this, err);
      } else {
        if (success)
          success.call(this);
      }
    });
  }

  Canvas.definir_fondo = function(ruta, preferencias) {
    var canvas = Canvas.canvas;
    canvas.setBackgroundImage(ruta, canvas.renderAll.bind(canvas));
  }

  Canvas.agregar_imagen = function(ruta, preferencias) {
    var canvas = Canvas.canvas;
    canvas.controlsAboveOverlay = true;
    var group = [];

    fabric.Image.fromURL(ruta, function(img) {

      var size = img.getOriginalSize();
      var ratio_horizontal = preferencias.ancho / size.width;
      var ratio_vertical = preferencias.alto / size.height;
      var ratio = Math.min(ratio_horizontal, ratio_vertical);

      // Extrae el nombre del directorio de donde salió la imagen, por
      // ejemplo si el path es 'partes/cara/1.svg', la variable categoría
      // va a quedar con el valor 'cara'.
      //
      // Esta categoría se guarda en el objeto, para evitar que el avatar
      // tenga mas de una cara, mas de dos bocas etc...
      //
      // Pero ojo, esto solo aplica si la categoría del objeto no admite
      // duplicados.
      var categoria = ruta.match(/partes\/(.+)\//)[1];


      // Intenta borrar todos los objetos de esta categoria si no
      // admite duplicados:
      if (! preferencias.admite_duplicados) {
        canvas.forEachObject(function(o, i) {
          if (o.categoria == categoria) {
            preferencias.x = o.left;
            preferencias.y = o.top;
            canvas.remove(o);
          }
        });
      }


      img.set({
        left: preferencias.x,
        top: preferencias.y,
        scaleX: ratio,
        scaleY: ratio,
        categoria: categoria,
        z: preferencias.z
      });

      Canvas.canvas.add(img);

      // Si el objeto es simétrico, como los ojos, se
      // encarga de clonar el objeto dos veces.
      if (preferencias.doble) {
        var object = fabric.util.object.clone(img);
        object.set({
          left: preferencias.x - preferencias.distancia_entre_dobles,
          top: preferencias.y,
          scaleX: -ratio,
          scaleY: ratio,
          categoria: categoria,
          z: preferencias.z
        });

        canvas.add(object);
      }


      // ordena todos los objetos por valor Z.
      canvas.forEachObject(function(o, i) {
        Canvas.canvas.moveTo(o, -o.z);
      });

    });
  }

  Canvas.guardar = function(nombre, success) {
    var data = Canvas.canvas.toJSON();
    var filename = ruta_mis_archivos + nombre + '.json';
    var ruta_png = ruta_mis_archivos + nombre + '.png';
    Canvas.deseleccionar_todo();

    Canvas.guardar_como_archivo_png(ruta_png, function() {
      fs.writeFile(filename, JSON.stringify(data, null, 4), function(err) {
        if (err)
          alert(err);

        success.apply(this);
      });
    });
  }

  Canvas.deseleccionar_todo = function() {
    Canvas.canvas.deactivateAll().renderAll();
  }

  Canvas.cargar = function(ruta) {

    fs.readFile(ruta, 'utf8', function (err, data) {
      if (err) {
        alert(err);
        return;
      }

      var data = JSON.parse(data);
      var canvas = Canvas.canvas;
      canvas.loadFromJSON(data, canvas.renderAll.bind(canvas));
    });
  }

  return Canvas;
});
