var app = angular.module('app');
var gui = require('nw.gui');

app.service('Menu', function() {
    var self = this;
    this.menubar = new gui.Menu({type: 'menubar'});
    this.menu_archivo = new gui.Menu();
    this.menu_opciones = new gui.Menu();
    this.menu_ayuda = new gui.Menu();

    this.item_guardar = new gui.MenuItem({
        label: 'Guardar...',
        click: function() {
            window.fn_guardar_y_regresar();
        }
    });

    this.item_guardar_como_svg = new gui.MenuItem({
        label: 'Exportar como SVG...',
        click: function() {
            window.fn_guardar_svg();
        }
    });

    this.item_guardar_como_png = new gui.MenuItem({
        label: 'Exportar como PNG...',
        click: function() {
            window.fn_guardar_png();
        }
    });

    this.item_salir = new gui.MenuItem({
        label: 'Salir',
        click: function() {
            gui.App.closeAllWindows();
        }
    });

    this.item_avatar = new gui.MenuItem({
        label: 'Definir como mi avatar de usuario',
        click: function() {
            window.fn_definir_como_mi_avatar();
        }
    });

    this.item_acerca_de = new gui.MenuItem({
        label: 'Acerca de ...',
        click: function() {
            self.funcion_acerca_de.call(this);
        }
    });

    this.deshabilitar_items_menu = function() {
        this.item_guardar.enabled = false;
        this.item_guardar_como_png.enabled = false;
        this.item_guardar_como_svg.enabled = false;
        this.item_avatar.enabled = false;
    }

    this.deshabilitar_items_menu();

    this.menu_archivo.append(this.item_guardar);
    this.menu_archivo.append(this.item_guardar_como_png);
    this.menu_archivo.append(this.item_guardar_como_svg);
    this.menu_archivo.append(new gui.MenuItem({type: 'separator'}));
    this.menu_archivo.append(this.item_salir);

    this.menu_opciones.append(this.item_avatar);
    this.menu_archivo.append(new gui.MenuItem({type: 'separator'}));

    this.menu_ayuda.append(this.item_acerca_de);

    this.menubar.append(new gui.MenuItem({
        label: 'Archivo',
        submenu: this.menu_archivo
    }));

    this.menubar.append(new gui.MenuItem({
        label: 'Opciones',
        submenu: this.menu_opciones
    }));

    this.menubar.append(new gui.MenuItem({
        label: 'Ayuda',
        submenu: this.menu_ayuda
    }));

    this.agregar_a_ventana = function(ventana, funcion_acerca_de) {
        ventana.menu = this.menubar;
        this.funcion_acerca_de = funcion_acerca_de;
    }

    this.habilitar_items_menu = function() {
        this.item_guardar.enabled = true;
        this.item_guardar_como_png.enabled = true;
        this.item_guardar_como_svg.enabled = true;
        this.item_avatar.enabled = true;
    }
});
