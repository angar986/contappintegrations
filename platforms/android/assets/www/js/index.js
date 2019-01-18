//   fP8k5N4S_Es:APA91bHI1bhMuOpFQjABFjrXJRgeAzfx16MBjU_7B3Lo26HRRc3jtxzKA0mhRt3HHrsksMrMHpBgwloMKZ1ZxXmyp8uS3X_e5b5XqhElyaHApZGyDAhkuBG6xoSe3KTE63yVKyAg2HPz

//$("#ruta-inicio-viaje").val("");
//                    debugger;
//                    $("#gasolina-inicio-viaje").val(0).slider("refresh");

/********************* Cont APP  **************************/
function Person(id, razon, nick, foto, identificacion, ruc, email, empleado, guardame, pass, direccion, telefono, anio) {
    this.id = id;
    this.razon = razon;
    this.nick = nick;
    this.foto = foto;
    this.identificacion = identificacion;
    this.ruc = ruc;
    this.email = email;
    this.empleado = empleado;
    this.guardame = guardame;
    this.pass = pass;
    this.direccion = direccion;
    this.telefono = telefono;
    this.anio = anio;
}

function Transaccion(id, nombre, nick) {
    this.id = id;
    this.nombre = nombre;
    this.nick = nick;
}

function Imagen(id, ruta, descripcion, anulada, revisado, malo) {
    this.id = id;
    this.ruta = ruta;
    this.descripcion = descripcion;
    this.anulada = anulada;
    this.revisado = revisado;
    this.malo = malo;
}

function getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

function truncateDecimals(number) {
    return Math[number < 0 ? 'ceil' : 'floor'](number);
}

function comboanos() {
    var ano = new Date();
    ano_actual = ano.getFullYear();
    anos = new Array();
    for (i = ano_actual; i > 2014; i--) {
        anos.push(i);
    }
}

function eliminarFotosTemporales() {
    navigator.camera.cleanup(onSuccess, onFail);

    function onSuccess() {
        console.log("Camera cleanup success.")
    }

    function onFail(message) {
        alert('Failed because: ' + message);
    }
}

function llenarComboAnos(id, tam) {
    var ayuda = "#" + id;
    $(ayuda).empty();
    for (i = 0; i < tam.length; i++) {
        //        console.log(anos[i] + " id: " + ayuda);
        $(ayuda).append('<option value="' + anos[i] + '">' + anos[i] + '</option>');
    }
    //    $(ayuda).val(anos[0]).change();
}

function validarEmail(email) {
    expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email)) {
        return false;
    } else {
        return true;
    }

}

function validarPassword(pass) {
    //    regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])^(?=.*[@#$%^&+=])(?=\S+$).{8,}$/;
    //    regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$).{8,}$/;
    regularExpression = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?!.*[@#$%^&+='"/])(?=\S+$).{8,20}$/;
    if (!regularExpression.test(pass)) {
        return false;
    } else {
        return true;
    }
}



var usuario;
var transaccion;
var imagen;

var pictureSource; // picture source
var destinationType; // sets the format of returned value 
var nuevo_token = '';

//var vio_veo = "";
//var url = "http://contapp.com.ec/nueva/ws/ios.php?i=";
var url = "http://contapp.com.ec/nueva/ws/ios2.php?i=";
var pathImageCategoria = "";
var nombre_foto = "";
var nombre_original_foto = "";
var lista_imagenes;
var mesActivo;
var mes_estado_cuenta = "";
//var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var meses_mini = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

var close_panel_registros = "si";
var close_panel_informes = "si";

//var anos = "";
var ano_actual = "";
//var ano_value = "";
var id_paquete = "";


var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function () {
        this.receivedEvent('deviceready');

        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        document.getElementById("btn-comencemos").disabled = true;
        var usuarioAux = localStorage.getItem('Usuario') || '<empty>';
        if (usuarioAux == "<empty>") {
            document.getElementById("btn-comencemos").disabled = false;
        } else {
            usuario = JSON.parse(usuarioAux);
            loginAux(usuario.email, usuario.pass);
        }



        FCMPlugin.onTokenRefresh(function (token) {
            nuevo_token = token;
        });
        FCMPlugin.getToken(function (token) {
            nuevo_token = token;
            //            console.log("Pajarito: " + nuevo_token);
        });

        eliminarFotosTemporales();

    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};


app.initialize();
window.onload = function () {

    console.log("crear tabs");
    //Registros
    $('.slider-nav').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: false,
        focusOnSelect: true
    });

    ///Informes
    $('.slider-nav-informes').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: false,
        focusOnSelect: true,
    });

    ///Grafica Ingresos Gastos
    $('.slider-nav-grafica-ingreso-gastos').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: false,
        focusOnSelect: true,
    });

    ///Grafica Ingresos Detalle Gastos
    $('.slider-nav-grafica-detalle-gastos').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: false,
        focusOnSelect: true
    });

    ///Grafica Ingresos Detalle Gastos
    $('.slider-nav-resultado').slick({
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        dots: false,
        arrows: false,
        focusOnSelect: true
    });


};


///********  Inicio Pagina Inicio ********//////
$(document).on("click touchstart", "#btn-comencemos", function () {
    //    vio_veo = localStorage.getItem('saltarVideo') || '<empty>';
    // console.log("vio video: " + Token);
    if (nuevo_token == "" || nuevo_token == null || nuevo_token == '') {
        FCMPlugin.onTokenRefresh(function (token) {
            nuevo_token = token;
        });
        FCMPlugin.getToken(function (token) {
            nuevo_token = token;
        });
    }

    //    if (vio_veo == "<empty>" || vio_veo == "undefined") {
    //        $.mobile.changePage('#pageVideo', {
    //            transition: "slide"
    //        });
    $.mobile.changePage('#pageLogin', {
        transition: "slide"
    });
    //    } else {
    //        $.mobile.changePage('#pageLogin', {
    //            transition: "slide"
    //        });
    //    }

});

$(document).on("pagebeforeshow", "#pageInicio", function (event) {
    var hoy = new Date();
    mesActivo = hoy.getMonth() + 1;
    comboanos();

});


///********  Inicio Pagina Video ********//////

$(document).on("pagebeforeshow", "#pageVideo", function (event) {

    $('.slider-nav').on('afterChange', function (event, slick, currentSlide) {
        //        console.log("cambiando: " + currentSlide);

        $('.slider-nav').slick('slickGoTo', currentSlide);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + currentSlide + '"]';
        //        console.log("cambiando: " + currrentNavSlideElem);
        $('.slider-nav .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
    });

    $('.slider-nav').slick('slickGoTo', 6, true);
    $('.slider-nav .slick-slide').eq(6).addClass('is-active');

});

$(document).on("click", "#btn-saltar-video", function () {
    var vid = document.getElementById("myVideo");
    vid.pause();
    localStorage.setItem("saltarVideo", "si");
    $.mobile.changePage('#pageLogin', {
        transition: "slide"
    });
});



///********  Inicio Pagina Login ********//////
$(document).on("click", "#btn-ingresar", function () {
    login();
});

$(document).on("click touchstart", "#btn_olvido_contrasena", function () {
    swal({
        title: "ContApp",
        text: '<label>Ingresa el email para recuperar tu contraseña</label><br/><input id="input_olvido_contrasena" autofocus minlength="3" class="form-control wedding-input-text wizard-input-pad" type="text" name="taxCode" >',
        type: "warning",
        showCancelButton: true,
        html: true,
        confirmButtonText: "Enviar",
        closeOnConfirm: false
    }, function () {

        olvidoContrasena();
    });
});

function olvidoContrasena() {
    var datos = new Object();
    datos.accion = "olvidoPass";
    datos.email = document.getElementById("input_olvido_contrasena").value;


    if (datos.email == "") {
        swal("", "Escribe un email", "error");
    } else {
        var _url = url + '' + JSON.stringify(datos);
        console.log(_url);
        $.ajax({
            type: "POST",
            url: _url,
            dataType: 'json',
            beforeSend: function () {
                $.mobile.loading('show');
            },
            complete: function () {
                $.mobile.loading('hide');
            },
            success: function (data) {
                //                var data = JSON.parse(data);
                console.log(data.flag);
                if (data.flag == 'si') {
                    swal("ContApp", "Datos enviados exitosamente a su correo", "success");
                } else if (data.flag == "noMail") {
                    swal("", data.message, "error");
                } else if (data.flag == 'no') {
                    swal("", data.message, "error");
                } else if (data.flag == 'error') {
                    swal("", data.message, "error");
                }
            },
            error: function (jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                swal("", msg, "error");
            },
        });
    }
}

function login() {
    var datos = new Object();
    datos.accion = "login";
    datos.user = document.getElementById("name").value;
    datos.pass = document.getElementById("pass").value;

    if (datos.user == "" || datos.pass == "") {
        swal("", "Debe llenar todos los campos", "error");
    } else {
        var _url = url + '' + JSON.stringify(datos);
        $.ajax({
            type: "POST",
            url: _url,
            dataType: 'json',
            beforeSend: function () {
                $.mobile.loading('show');
            },
            complete: function () {
                $.mobile.loading('hide');
            },
            success: function (data) {
                //                swal("", data.flag + " error", "error");
                if (data.flag == 'si') {

                    ///Token
                    if (nuevo_token == "" || nuevo_token == null || nuevo_token == '') {
                        FCMPlugin.onTokenRefresh(function (token) {
                            nuevo_token = token;
                        });

                        if (nuevo_token == "" || nuevo_token == null || nuevo_token == '') {
                            FCMPlugin.getToken(function (token) {
                                nuevo_token = token;
                            });
                        }
                    }
                    if ($('#recuerdame').is(":checked")) {
                        usuario = new Person(data.user.id, data.user.razon, data.user.nick, data.user.foto, data.user.identificacion, data.user.ruc, data.user.email, data.user.empleado, "si", document.getElementById("pass").value, data.user.direccion, data.user.telefono, ano_actual);
                        localStorage.setItem("Usuario", JSON.stringify(usuario));
                    } else {
                        usuario = new Person(data.user.id, data.user.razon, data.user.nick, data.user.foto, data.user.identificacion, data.user.ruc, data.user.email, data.user.empleado, "no", document.getElementById("pass").value, data.user.direccion, data.user.telefono, ano_actual);
                    }

                    //                    alert("nuevo_token: " + nuevo_token);
                    if (nuevo_token != "" || nuevo_token != null || nuevo_token != '') {
                        registrarToken(nuevo_token, data.user.id);
                    }
                    console.log(usuario);

                    $.mobile.changePage('#pageMenu', {
                        transition: "slide"
                    });
                } else if (data.flag == "deshabilitado") {
                    swal("", "Usuario deshabilitado ", "error");
                } else {
                    swal("", "Datos Incorrectos", "error");
                }
            },
            error: function () {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                swal("", msg, "error");
            }
        });
    }
}

function loginAux(user, contrasena) {
    var datos = new Object();
    datos.accion = "login";
    datos.user = user;
    datos.pass = contrasena;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            if (data.flag == 'si') {
                usuario = new Person(data.user.id, data.user.razon, data.user.nick, data.user.foto, data.user.identificacion, data.user.ruc, data.user.email, data.user.empleado, "si", contrasena, data.user.direccion, data.user.telefono, ano_actual);
                localStorage.setItem("Usuario", JSON.stringify(usuario));

                $.mobile.changePage('#pageMenu', {
                    transition: "slide"
                });
            }
            document.getElementById("btn-comencemos").disabled = false;
        },
        error: function () {
            document.getElementById("btn-comencemos").disabled = false;
        }
    });

}

/*Pagina Registro*/
$(document).on("touchstart click", "#btn_registrate", function () {

    urlRegistro();

    //    setTimeout(function () {
    //        $.mobile.changePage('#pageRegistrate', {
    //            transition: "slide"
    //        });
    //        urlRegistro();
    //    }, 300);

});

function urlRegistro() {
    var datos = new Object();
    datos.accion = "regWeb";
    var _url = url + '' + JSON.stringify(datos);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //            console.log(data.url);
            //            $("#iframe_registro").attr("src", data.url);
            var ref = cordova.InAppBrowser.open(data.url, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
            ref.addEventListener('loadstop', function () {
                ref.insertCSS({
                    file: "css/index.css"
                });
            });

        },
        error: function (jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        },
    });

}

//
//$(document).on("touchstart", "#btn_registrate1", function () {
//    //    $("#contenido_registro").niceScroll("#content_registro", {
//    //        cursorcolor: "rgb(166, 164, 164)",
//    //        autohidemode: false,
//    //        cursoropacitymax: 0.1,
//    //        touchbehavior: true
//    //    });
//    setTimeout(function () {
//        $.mobile.changePage('#pageRegistrate', {
//            transition: "slide"
//        });
//    }, 300);
//
//});
//
//$(document).on("pagecreate", "#pageRegistrate", function () {
//    // Without JQuery
//    slider = new Slider("#numero_facturas", {
//        ticks: [5, 25, 50, 100, 200, 300, 500, 1000],
//        ticks_labels: ['5', '25', '50', '100', '200', '300', '500', '1000'],
//        ticks_positions: [0, 10, 20, 35, 45, 55, 75, 100],
//        step: 5,
//        min: 5
//    });
//
//
//});
//
//$(document).on("pagebeforeshow", "#pageRegistrate", function () {
//    path_arreglo = new Array();
//    nombre_image_arreglo = new Array();
//    templstImg = new Array();
//    name_arreglo_subir = new Array();
//    tempname = new Array();
//    contador_fotos = 0;
//    $('.div_mas_foto').remove();
//
//});
//
//$(document).on("pageshow", "#pageRegistrate", function () {
//
//    $('#ruc').keyup(function () {
//        this.value = this.value.replace(/[^0-9]/g, '');
//    });
//
//    //    $('#identificacion').keyup(function () {
//    //        this.value = this.value.replace(/[^0-9]/g, '');
//    //    });
//
//    $('#telefono').keyup(function () {
//        this.value = this.value.replace(/[^0-9]/g, '');
//    });
//
//
//
//
//    //    $('.carousel').carousel();
//    //    console.log("numero_facturas:" + $("#numero_facturas ").val());
//    paquetes($("#select_tipo_contribuyente").val(), $("#numero_facturas").val());
//
//    $(document).on('change', "#select_tipo_contribuyente", function (e) {
//        //        console.log("tipo_contribuyente1:" + $("#select_tipo_contribuyente ").val());
//        paquetes($("#select_tipo_contribuyente").val(), $("#numero_facturas").val());
//    });
//
//
//
//    slider.on('change', function (data) {
//        //        console.log(data);
//        document.getElementById('rangeText').innerHTML = 'Número Facturas: ' + data.newValue;
//        paquetes($("#select_tipo_contribuyente").val(), data.newValue);
//    });
//    $("#numero_facturas").attr('data-slider-value', 5);
//
//});
//
//var colors = ['#549F9F !important', 'rgb(78, 97, 129) !important', 'rgb(185, 105, 64) !important', 'rgb(197, 79, 87) !important'];
//
//function paquetes(tipo_contribuyente, num_factura) {
//    var datos = new Object();
//    datos.accion = "paquetes";
//    var _url = url + '' + JSON.stringify(datos);
//    //    console.log("paquete url: " + _url);
//    $.ajax({
//        type: "POST",
//        url: _url,
//        beforeSend: function () {
//            $.mobile.loading('show');
//        },
//        complete: function () {
//            $.mobile.loading('hide');
//        },
//        success: function (data) {
//            //            data = JSON.parse(data);
//
//            var item_paquete = '';
//            var nota = "";
//            $.each(data, function (i, v) {
//                //                console.log(v + " i: " + i);
//                $.each(v, function (j, w) {
//                    //                    console.log("j: " + j);
//                    if (j == tipo_contribuyente) {
//                        item_paquete += '<div class="item active" style="border: 1px solid #f1f2f3 !important;">';
//                        if (typeof w == "object") {
//                            $.each(w, function (k, x) {
//                                //console.log("   k: " + k);
//
//                                if (k == "tipo") {
//                                    item_paquete += '<div class="header-paquete" style="background-color:' + colors[j] + '">' + x + '</div>';
//                                }
//                                if (k == "nota") {
//                                    item_paquete += '<div class="body-paquete">';
//                                    item_paquete += '<p class="pading-top" style="color:' + colors[j] + '">' + x + '</p>';
//                                }
//
//                                if (k == "precios") {
//                                    if (typeof x == "object") {
//                                        $.each(x, function (l, y) {
//                                            if (typeof y == "object") {
//                                                var dolares = '';
//                                                var centavos = '';
//                                                var min = '';
//                                                var mas = '';
//                                                $.each(y, function (m, z) {
//                                                    if (m == "min") {
//                                                        min = z;
//                                                    }
//                                                    if (m == "mas") {
//                                                        mas = z;
//                                                    }
//                                                    if (m == "valor") {
//                                                        dolares = z;
//                                                    }
//                                                    if (m == "centavos") {
//                                                        centavos = z;
//                                                    }
//                                                });
//                                                //console.log("           min: " + num_factura + " mas: " + mas);
//                                                if (parseInt(num_factura) >= parseInt(min) && parseInt(num_factura) <= parseInt(mas)) {
//                                                    //console.log("ACTIVADO " + dolares + " NUMERO FAC: " + num_factura);
//                                                    item_paquete += '<div class="valor"><h1 id="Gratis" class="price" style="color:' + colors[j] + '"><span class="price-unit">$</span>' + dolares + '<span class="price-unit">' + centavos + '/mes</span></h1></div>';
//                                                }
//                                            }
//                                        });
//                                    }
//                                }
//
//                                if (k == "descripcion") {
//                                    if (typeof x == "object") {
//                                        $.each(x, function (l, y) {
//                                            if (typeof y != "object") {
//                                                item_paquete += '<label><span class="glyphicon glyphicon-asterisk" style="color:' + colors[j] + '"> </span> ' + y + '</label>';
//                                            }
//                                        });
//                                    }
//                                }
//                                if (k == "pago") {
//                                    item_paquete += '<p class="" style="color:' + colors[j] + '">' + x + '</p>';
//                                }
//                                if (k == "footer") {
//                                    item_paquete += '<br>\
//                                 <p class="" style="color:' + colors[j] + '">' + x + '</p>';
//                                    item_paquete += '</div>';
//                                }
//                                if (k == "paq_id") {
//                                    // console.log("id_paquete: " + x);
//                                    id_paquete = x;
//                                }
//                            });
//                        }
//                        item_paquete += '</div>';
//                    }
//                });
//            });
//
//            $('#contenido_paquetes').html(item_paquete);
//            $("#contenido_paquetes").listview().listview('refresh');
//
//        },
//        error: function () {
//            var msg = '';
//            if (jqXHR.status === 0) {
//                msg = 'Not connect.\n Verify Network.';
//            } else if (jqXHR.status == 404) {
//                msg = 'Requested page not found. [404]';
//            } else if (jqXHR.status == 500) {
//                msg = 'Internal Server Error [500].';
//            } else if (exception === 'parsererror') {
//                msg = 'Requested JSON parse failed.';
//            } else if (exception === 'timeout') {
//                msg = 'Time out error.';
//            } else if (exception === 'abort') {
//                msg = 'Ajax request aborted.';
//            } else {
//                msg = 'Uncaught Error.\n' + jqXHR.responseText;
//            }
//            swal("", msg, "error");
//        }
//    });
//}
//
///*Validar Datos*/
//function checkRuc(input) {
//    console.log(validarPassword(document.getElementById("ruc").value));
//    if (input.value.length > 10 && input.value.length < 14) {
//
//        console.log("valio");
//        $('#error_ruc').addClass("hiden");
//        $('input[id=ruc]').parent().removeClass("has-error");
//        $('input[id=ruc]').parent().addClass("has-success");
//
//    } else {
//        console.log("no valio");
//        $('#error_ruc').removeClass("hiden");
//        $('input[id=ruc]').parent().removeClass("has-success");
//        $('input[id=ruc]').parent().addClass("has-error");
//    }
//}
//
//function checkTelefono(input) {
//    console.log(validarPassword(document.getElementById("telefono").value));
//    if (input.value.length > 7) {
//
//        console.log("valio");
//        $('#error_telefono').addClass("hiden");
//        $('input[id=telefono]').parent().removeClass("has-error");
//        $('input[id=telefono]').parent().addClass("has-success");
//
//    } else {
//        console.log("no valio");
//        $('#error_telefono').removeClass("hiden");
//        $('input[id=telefono]').parent().removeClass("has-success");
//        $('input[id=telefono]').parent().addClass("has-error");
//    }
//}
//
//function checkEmail(input) {
//    console.log(validarPassword(document.getElementById("email").value));
//    if (!validarEmail(document.getElementById("email").value)) {
//        console.log("no valio");
//        $('#error_email').removeClass("hiden");
//        $('input[id=email]').parent().removeClass("has-success");
//        $('input[id=email]').parent().addClass("has-error");
//    } else {
//        console.log("valio");
//        $('#error_email').addClass("hiden");
//        $('input[id=email]').parent().removeClass("has-error");
//        $('input[id=email]').parent().addClass("has-success");
//    }
//}
//
//function checkPass(input) {
//    console.log(validarPassword(document.getElementById("passRegistro").value));
//    if (!validarPassword(document.getElementById("passRegistro").value)) {
//        console.log("no valio");
//        $('#error_pass').removeClass("hiden");
//        $('input[id=passRegistro]').parent().removeClass("has-success");
//        $('input[id=passRegistro]').parent().addClass("has-error");
//    } else {
//        console.log("valio");
//        $('#error_pass').addClass("hiden");
//        $('input[id=passRegistro]').parent().removeClass("has-error");
//        $('input[id=passRegistro]').parent().addClass("has-success");
//    }
//}
//
//function checkRepetirPass(input) {
//    console.log(validarPassword(document.getElementById("repetirpass").value));
//    if (document.getElementById("passRegistro").value != document.getElementById("repetirpass").value) {
//        console.log("no valio");
//        $('#error_repetir_pass').removeClass("hiden");
//        $('input[id=repetirpass]').parent().removeClass("has-success");
//        $('input[id=repetirpass]').parent().addClass("has-error");
//    } else {
//        console.log("valio");
//        $('#error_repetir_pass').addClass("hiden");
//        $('input[id=repetirpass]').parent().removeClass("has-error");
//        $('input[id=repetirpass]').parent().addClass("has-success");
//    }
//}

//Fotos ruc

var ticks = "";
var tipo_eleccion = "";
var id_tipo_elecion = "";
var img_name_user = "";
var img_name_ruc = "";
var img_path_user = "";
var img_path_ruc = "";

var contador_fotos;
var path_arreglo;
var nombre_image_arreglo;
var templstImg, tempname, name_arreglo_subir;
var slider;

//
//function openAlertUser() {
//    $("#myModalImagen").modal('show');
//    tipo_eleccion = "user";
//    id_tipo_elecion = "img_perfil_registre";
//}
//
//function openAlertRuc() {
//    $("#myModalImagen").modal('show');
//    tipo_eleccion = "ruc";
//    id_tipo_elecion = "img_foto_ruc";
//}
//
//$(document).on("click touchstart", "#btn_camara_registre", function () {
//    openCamera(id_tipo_elecion, tipo_eleccion);
//    $('#myModalImagen').modal('hide');
//
//});
//
//$(document).on("click touchstart", "#btn_galeria_registre", function () {
//    console.log("tipo galeria: " + tipo_eleccion);
//    openGaleria(pictureSource.PHOTOLIBRARY, id_tipo_elecion, tipo_eleccion);
//    $('#myModalImagen').modal('hide');
//});
//
//function generarFoto(path, id) {
//    $('.foto-mas:last').before('<div class="div_mas_foto" id="' + id + '"><img src="img/eliminar.png" alt="" id="' + id + '" class="foto_ruc_eliminar" ><img src="' + path + '" alt="" class="foto_ruc"></div>');
//}
//
//$(document).on('touchstart', ".foto_ruc_eliminar", function () {
//    console.log("aca");
//    var id = $(this).attr("id");
//    delete path_arreglo[id];
//    delete nombre_image_arreglo[id];
//    var ayuda = $(this).parent();
//    setTimeout(function () {
//        ayuda.remove();
//    }, 500);
//
//    //    for (i = 0; i < path_arreglo.length; i++) {
//    //        console.log("path: " + " i: " + i + " " + path_arreglo[i]);
//    //    }
//});
//
//function openCamera(id, tipo) {
//    //    console.log("apoen camera: "+tipo);
//    $.mobile.loading('show');
//    navigator.camera.getPicture(onSuccess, onFail, {
//        quality: 30,
//        destinationType: Camera.DestinationType.FILE_URI,
//        sourceType: Camera.PictureSourceType.CAMERA,
//        encodingType: Camera.EncodingType.JPEG,
//        targetWidth: 1000,
//        targetHeight: 1200,
//        popoverOptions: CameraPopoverOptions,
//        allowEdit: true,
//        correctOrientation: true
//
//    });
//
//    function onSuccess(imageURI) {
//        if (tipo == "user") {
//            $('#' + id).attr('src', imageURI);
//            img_name_user = 'useRegistre.jpg';
//            img_path_user = imageURI;
//
//        } else if (tipo == "ruc") {
//            //$('#' + id).attr('src', imageURI);
//            //            img_name_ruc = 'rucRegistre.jpg';
//            //            img_name_ruc = 'rucRegistre' + contador_fotos + '.jpg';
//            //            img_path_ruc = imageURI;
//            nombre_image_arreglo.push('rucRegistre' + contador_fotos + '.jpg');
//            generarFoto(imageURI, contador_fotos);
//            path_arreglo.push(imageURI);
//            contador_fotos++;
//            for (i = 0; i < path_arreglo.length; i++) {
//                console.log("path: " + " i: " + i + " " + path_arreglo[i]);
//            }
//
//        }
//        $.mobile.loading('hide');
//    }
//
//    function onFail(message) {
//        if (tipo == "user") {
//            img_path_user = "";
//        } else if (tipo == "ruc") {
//            img_path_ruc = "";
//        }
//
//        $.mobile.loading('hide');
//    }
//    $('#myModalImagen').modal('hide');
//}
//
//function openGaleria(source, id, tipo) {
//    $.mobile.loading('show');
//    navigator.camera.getPicture(
//        function onSuccessCam(imageURI) {
//
//            if (tipo == "user") {
//                $('#' + id).attr('src', imageURI);
//                img_name_user = 'useRegistre.jpg';
//                img_path_user = imageURI;
//            } else if (tipo == "ruc") {
//                console.log("tipo: " + tipo + " path: " + imageURI);
//                generarFoto(imageURI, contador_fotos);
//                nombre_image_arreglo.push('rucRegistre' + contador_fotos + '.jpg');
//                path_arreglo.push(imageURI);
//                contador_fotos++;
//            }
//
//            //            console.log("open galeria tipo: " + tipo + " img_path_user: " + img_path_user + " img_path_ruc: " + img_path_ruc);
//            $.mobile.loading('hide');
//        },
//        function onFailCamera() {
//            if (tipo = "user") {
//                img_path_user = "";
//            } else if (tipo = "ruc") {
//                img_path_ruc = "";
//            }
//
//            $.mobile.loading('hide');
//        }, {
//            quality: 30,
//            destinationType: destinationType.FILE_URI,
//            sourceType: source,
//            allowEdit: true,
//            encodingType: Camera.EncodingType.JPEG,
//            targetWidth: 1200,
//            targetHeight: 1200,
//            correctOrientation: true,
//            popoverOptions: CameraPopoverOptions
//        });
//    $('#myModalImagen').modal('hide');
//}
//
//function uploadImage(pathImage, tipo, nombre) {
//    var options = new FileUploadOptions();
//    options.fileKey = "file";
//    options.mimeType = "image";
//    var params = new Object();
//    params.type = "image";
//
//    options.params = params;
//    options.chunkedMode = false;
//
//    if (tipo == "user") {
//        console.log(img_name_user);
//        options.fileName = img_name_user;
//    } else if (tipo == "ruc") {
//        console.log(nombre);
//        options.fileName = nombre;
//    }
//
//    var uri = encodeURI("http://contapp.com.ec/nueva/ws/upload.php");
//    var win = makeSuccessCallback(tipo);
//
//    var ft = new FileTransfer();
//    ft.upload(pathImage, uri, win, failRegistre, options);
//}
//
//function makeSuccessCallback(parameters) {
//    console.log("Success with parameters: " + parameters);
//    return function successCallback(r) {
//        //        console.log("obj: " + r);
//        var obj = JSON.parse(r.response);
//        if (parameters == "user") {
//            $.each(obj, function (i, v) {
//                if (i == "img") {
//                    console.log("img_name_user: " + v);
//                    img_name_user = v;
//                }
//            });
//            if (obj.flag == "si") {
//                //                uploadImage(img_path_ruc, "ruc");
//                //                console.log("antes lenght: " + templstImg.length);
//                if (templstImg.length == 0) {
//                    console.log("lenght: " + templstImg.length);
//                    for (i = 0; i < name_arreglo_subir.length; i++) {
//                        if (i == 0) {
//                            img_name_ruc += name_arreglo_subir[i];
//                        } else {
//                            img_name_ruc += " ," + name_arreglo_subir[i];
//                        }
//                    }
//                    uploadDatos();
//                } else if (templstImg != "") {
//                    var img = templstImg.pop();
//                    var name = tempname.pop();
//                    uploadImage(img, "ruc", name);
//                } else {
//                    uploadDatos();
//                    console.log("subir datos user");
//                }
//            }
//        } else if (parameters == "ruc") {
//            console.log("imagen ruc: " + obj.flag);
//            if (obj.flag == "si") {
//                $.each(obj, function (i, v) {
//                    if (i == "img") {
//                        name_arreglo_subir.push(v);
//                        console.log("path de regreso: " + v);
//                    }
//                });
//
//                if (templstImg.length == 0) {
//                    console.log("lenght: " + templstImg.length);
//                    for (i = 0; i < name_arreglo_subir.length; i++) {
//                        if (i == 0) {
//                            img_name_ruc += name_arreglo_subir[i];
//                        } else {
//                            img_name_ruc += " ," + name_arreglo_subir[i];
//                        }
//                    }
//                    uploadDatos();
//                } else if (templstImg != "") {
//                    var img = templstImg.pop();
//                    var name = tempname.pop();
//                    uploadImage(img, "ruc", name);
//                } else {
//                    uploadDatos();
//                    console.log("subir datos user");
//                }
//
//                //                if (templstImg != "") {
//                //                    if (templstImg.length == 0) {
//                //                        for (i = 0; i < name_arreglo_subir.length; i++) {
//                //                            if (i == 0) {
//                //                                img_name_ruc += name_arreglo_subir[i];
//                //                            } else {
//                //                                img_name_ruc += "," + name_arreglo_subir[i];
//                //                            }
//                //                        }
//                //                        uploadDatos();
//                //                    } else {
//                //                        var img = templstImg.pop();
//                //                        var name = tempname.pop();
//                //                        uploadImage(img, "ruc", name);
//                //                    }
//                //                } else {
//                //                    uploadDatos();
//                //                }
//
//
//                //                console.log("path img: " + img_name_ruc);
//
//
//            }
//        }
//    }
//}
//
//function failRegistre(error) {
//    $.mobile.loading('hide');
//    console.log("error: " + error);
//}
//
//function uploadDatos() {
//
//    var datos = new Object();
//    datos.accion = "registro";
//    datos.razon = document.getElementById("razon").value;
//    datos.nick = document.getElementById("nickname").value;
//    datos.ruc = document.getElementById("ruc").value;
//    datos.direccion = document.getElementById("direccion").value;
//    datos.telefono = document.getElementById("telefono").value;
//    datos.email = document.getElementById("email").value;
//    datos.pass = document.getElementById("passRegistro").value;
//    datos.identificacion = document.getElementById("identificacion").value;
//    datos.foto = img_name_user;
//    datos.fotoruc = "";
//    datos.fotosruc = img_name_ruc;
//    datos.facturas = $("#numero_facturas").val();
//    datos.paquete = id_paquete;
//    var _url = url + '' + JSON.stringify(datos);
//    console.log("url: " + _url);
//    $.ajax({
//        type: "POST",
//        url: _url,
//        dataType: 'json',
//        beforeSend: function () {
//            $.mobile.loading('show');
//        },
//        complete: function () {
//            $.mobile.loading('hide');
//        },
//        success: function (data) {
//            //                    swal("", data + " error", "error");
//            if (data.flag == 'si') {
//                swal("ContApp", "Gracias por registrarte, tu cuenta ha sido creada, puedes disfrutarla gratis por 30 días. Nuestro equipo se contactará contigo para mayor información", "success");
//                $("#razon").val("");
//                $("#nickname").val("");
//                $("#ruc").val("");
//                $("#direccion").val("");
//                $("#telefono").val("");
//                $("#email").val("");
//                $("#passRegistro").val("");
//                $("#repetirpass").val("");
//                $("#identificacion").val("");
//
//                $('#img_foto_ruc').attr('src', "img/logo.png");
//                //$('#img_perfil_registre').attr('src', "img/perfil.png");
//                document.getElementById('rangeText').innerHTML = 'Número Facturas: 5';
//                //                $("#numero_facturas").val(5).slider("refresh");
//                $("#numero_facturas").attr('data-slider-value', 5);
//
//
//
//                var el = $('#select_tipo_contribuyente');
//                el.val(0).attr('selected', true).siblings('option').removeAttr('selected');
//                el.selectmenu();
//                el.selectmenu("refresh", true);
//
//
//                nombre_img = "";
//                path_img_registre = "";
//                path_img_ruc = "";
//                nombre_img_ruc = "";
//                $.mobile.changePage("#pageLogin", {
//                    transition: "slide",
//                    reverse: true
//                });
//
//            } else {
//                swal("", data.mensaje, "error");
//            }
//        },
//        error: function () {
//            var msg = '';
//            if (jqXHR.status === 0) {
//                msg = 'Not connect.\n Verify Network.';
//            } else if (jqXHR.status == 404) {
//                msg = 'Requested page not found. [404]';
//            } else if (jqXHR.status == 500) {
//                msg = 'Internal Server Error [500].';
//            } else if (exception === 'parsererror') {
//                msg = 'Requested JSON parse failed.';
//            } else if (exception === 'timeout') {
//                msg = 'Time out error.';
//            } else if (exception === 'abort') {
//                msg = 'Ajax request aborted.';
//            } else {
//                msg = 'Uncaught Error.\n' + jqXHR.responseText;
//            }
//            swal("", msg, "error");
//        }
//    });
//    //    }
//}
//
//$(document).on("click", "#btn_enviar_registro", function () {
//    $.mobile.loading('show');
//    if (document.getElementById("razon").value == "" || document.getElementById("nickname").value == "" || document.getElementById("ruc").value == "" || document.getElementById("direccion").value == "" || document.getElementById("telefono").value == "" || document.getElementById("email").value == "" || document.getElementById("passRegistro").value == "" || document.getElementById("repetirpass").value == "" || document.getElementById("identificacion").value == "") {
//        $.mobile.loading('hide');
//        swal("", "Debe llenar todos los campos", "error");
//    } else if (validarEmail(document.getElementById("email").value) == "false") {
//        $.mobile.loading('hide');
//        swal("", "La dirección de correo " + datos.email + " es incorrecta.", "error");
//        //            swal("", "Debe llenar todos los campos", "error");
//    } else if (document.getElementById("passRegistro").value != document.getElementById("repetirpass").value) {
//        $.mobile.loading('hide');
//        swal("", "Las contraseñas ingresadas no coinciden ", "error");
//    } else {
//        console.log("path antes: " + path_arreglo + " name antes: " + nombre_image_arreglo);
//        for (i = 0; i < path_arreglo.length; i++) {
//            if (path_arreglo[i] != undefined) {
//                templstImg.push(path_arreglo[i]);
//            }
//            if (nombre_image_arreglo[i] != undefined) {
//                tempname.push(nombre_image_arreglo[i]);
//            }
//        }
//
//
//        if (img_path_user != "") {
//            console.log("upload user");
//            uploadImage(img_path_user, "user", img_name_user);
//        } else if (templstImg != "") {
//            var img = templstImg.pop();
//            var name = tempname.pop();
//            console.log("upload ruc: " + img + " " + name);
//            uploadImage(img, "ruc", name);
//        } else {
//            console.log("no hay imagenes");
//            uploadDatos();
//        }
//    }
//
//    //    uploadImage(img_path_ruc, "ruc");
//});


///********  Inicio Menu ********//////

$(document).on("pagebeforeshow", "#pageMenu", function (event) {

    verificarNotificacion("");
    $('#nombreUsuario').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick').html(usuario.nick);
    $('#img_foto_usu').attr('src', usuario.foto);

    $("#overlayPanel").niceScroll("#lista_menu", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    $("#btn_open_panel").on("click", function () {
        $("#overlayPanel").panel("open");
    });

    //    usuario.anio = ano_actual;

});

$(document).on('click', '#btn-compras-foto', function (e) {
    transaccion = new Transaccion("3", "Registro Compras", "Compras");
    $("#titulo_categoria").html(transaccion.nombre);
    $.mobile.changePage("#pageFoto", {
        transition: "slide",
        reverse: false
    });
});

$(document).on('click', '#btn-retenciones-compras-foto', function (e) {
    transaccion = new Transaccion("4", "Reg. Retenciones Compras", "RetCompras");
    $("#titulo_categoria").html(transaccion.nombre);
    //    categoria = "4";
    //    nombre_categoria = "Retenciones Compras";
    //    $("#titulo_categoria").html(nombre_categoria);
    $.mobile.changePage("#pageFoto", {
        transition: "slide",
        reverse: false
    });
});

$(document).on('click', '#btn-retenciones-ventas-foto', function (e) {
    //    categoria = "2";
    //    nombre_categoria = "Retenciones Ventas";
    //    $("#titulo_categoria").html(nombre_categoria);
    transaccion = new Transaccion("2", "Reg. Retenciones Ventas", "RetVentas");
    $("#titulo_categoria").html(transaccion.nombre);
    $.mobile.changePage("#pageFoto", {
        transition: "slide",
        reverse: false
    });
});

$(document).on('click', '#btn-ventas-foto', function (e) {
    transaccion = new Transaccion("1", "Registro Ventas", "Ventas");
    $("#titulo_categoria").html(transaccion.nombre);
    //    categoria = "1";
    //    nombre_categoria = "Ventas";
    //    $("#titulo_categoria").html(nombre_categoria);
    $.mobile.changePage("#pageFoto", {
        transition: "slide",
        reverse: false
    });
});


///********  Inicio Pagina Foto ********//////

$(document).on('click touchstart', '#btn_camara', function (e) {
    llenarComboAnos("anos_modal_foto", anos);
    $("#anos_modal_foto").val(usuario.anio);
    $("#anos_modal_foto").change();
    $.mobile.loading('show');
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        //        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 1200,
        popoverOptions: CameraPopoverOptions

    });

    function onSuccess(imageURI) {
        nombre_foto = transaccion.nick + '.jpg';
        pathImageCategoria = imageURI;
        $("#categoria_modal_titulo").html(transaccion.nombre);
        $('#imagen_categoria').attr('src', imageURI);
        $("#descripcion_foto").val("");
        $("#myModal").modal();
        //        var hoy = new Date();
        //        mesActivo = hoy.getMonth() + 1;
        //    $('#meses_modal_foto').val("1");
        $('#meses_modal_foto').val(mesActivo).attr('selected', true).siblings('option').removeAttr('selected');
        $.mobile.loading('hide');

        window.resolveLocalFileSystemURI(imageURI,
            function (fileEntry) {
                var name = fileEntry.fullPath;
                var ayuda = name.split('/');
                nombre_original_foto = ayuda[1];
            },
            function () {}
        );
    }

    function onFail(message) {
        pathImageCategoria = "";
        $.mobile.loading('hide');
    }

});

$(document).on('click touchstart', '#btn_galeria', function (e) {
    galeria(pictureSource.PHOTOLIBRARY)
});

function galeria(source) {
    llenarComboAnos("anos_modal_foto", anos);
    $("#anos_modal_foto").val(usuario.anio);
    $("#anos_modal_foto").change();

    $.mobile.loading('show');
    navigator.camera.getPicture(
        function onSuccessCam(imageURI) {
            nombre_foto = transaccion.nick + '.jpg';
            pathImageCategoria = imageURI;
            $("#categoria_modal_titulo").html(transaccion.nombre);
            $('#imagen_categoria').attr('src', imageURI);
            $("#descripcion_foto").val("");

            $('#meses_modal_foto').val(mesActivo).attr('selected', true).siblings('option').removeAttr('selected');
            $("#myModal").modal();

            $.mobile.loading('hide');

            window.resolveLocalFileSystemURI(imageURI,
                function (fileEntry) {
                    var name = fileEntry.fullPath;
                    var ayuda = name.split('/');
                    nombre_original_foto = ayuda[1];
                },
                function () {}
            );
        },
        function onFailCamera() {
            pathImageCategoria = "";
            $.mobile.loading('hide');
        }, {
            quality: 30,
            destinationType: destinationType.FILE_URI,
            sourceType: source,
            //            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1000,
            targetHeight: 1200,
            popoverOptions: CameraPopoverOptions
        });
}

function noEnviar() {
    $.mobile.loading('hide');
    swal.close();
}

function Enviar() {
    $.mobile.loading('show');
    uploadPhoto(pathImageCategoria)
}

function uploadPhoto(imageURI) {
    //    $.mobile.loading('show');
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = nombre_foto;
    nombreFoto = options.fileName;
    options.mimeType = "image";
    var params = new Object();
    params.type = "image";

    options.params = params;
    options.chunkedMode = false;

    var uri = encodeURI("http://contapp.com.ec/nueva/ws/upload.php");

    var ft = new FileTransfer();
    ft.upload(imageURI, uri, winPhoto, fail, options);
}

function winPhoto(r) {
    var nombre_img = "";
    var anulado_img = "";
    var obj = JSON.parse(r.response);
    // console.log("respuesta foto: " + obj.flag + " object: " + obj);
    $.each(obj, function (i, v) {
        if (i == "img") {
            nombre_img = v;
            //console.log("nombre: " + nombre_img);
        }
    });
    if ($('#anulado_foto').is(":checked")) {
        // it is checked
        anulado_img = "1";
    } else {
        anulado_img = "0";
    }


    if (obj.flag == "si") {
        var datos = new Object();
        datos.accion = "registrarFoto";
        datos.idUser = usuario.id;
        datos.imagen = nombre_img;
        datos.transaccion = transaccion.nick;
        datos.mes = $("#meses_modal_foto").val();
        datos.nombre = document.getElementById("descripcion_foto").value;;
        datos.anulado = anulado_img;
        datos.empleado = usuario.empleado;
        datos.imgNombreOriginal = nombre_original_foto;
        datos.anio = $("#anos_modal_foto").val();
        usuario.anio = $("#anos_modal_foto").val();

        mesActivo = $("#meses_modal_foto").val();

        var _url = url + '' + JSON.stringify(datos);
        console.log("subir foto: " + _url);
        $.ajax({
            type: "POST",
            url: _url,
            dataType: 'json',
            beforeSend: function () {
                $.mobile.loading('show');
            },
            complete: function () {
                $.mobile.loading('hide');
            },
            success: function (data) {
                if (data.flag == 'si') {
                    $('#myModal').modal('hide');
                    $('#imagen_categoria').attr('src', "");
                    pathImageCategoria = "";
                    $("#descripcion_foto").val("");
                    swal("", "Datos enviados correctamente", "success");
                    $.mobile.changePage('#pageFoto', {
                        transition: "slide"
                    });

                } else {
                    swal("", "Ocurrió un error inesperado. Por favor, intenta de nuevo", "error");
                }
            },
            error: function () {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                swal("", msg, "error");
            }
        });
    } else {
        swal("", "Ocurrió un error inesperado al subir la imagen. Por favor, intenta de nuevo", "error");
    }
}

function fail(error) {
    $.mobile.loading('hide');
}


//********  Inicio Pagina Lista Imagen Registros ********//////


//$(document).on("pagebeforecreate", "#pageListaImagen", function (event) {
//    var hoy = new Date();
//    mesActivo = hoy.getMonth() + 1;
//});

$(document).on('click', '.listaImagen', function (e) {
    transaccion = new Transaccion($(this).attr("codigo"), $(this).attr("nombre"), $(this).attr("nick"));

    console.log("mesActivo: " + (parseInt(mesActivo)));

    $("#titulo_categoria_lista").html(transaccion.nombre);
    llenarComboAnos("anos_registros", anos);

    $('.slider-nav .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    $("#anos_registros").val(usuario.anio);
    $("#anos_registros").change();

    listaImagenes(mesActivo);
    $.mobile.changePage("#pageListaImagen", {
        transition: "slide",
        reverse: false
    });

});



$(document).on("pageshow", "#pageListaImagen", function (event) {

    $("#anos_registros").on("change", function () {
        usuario.anio = $(this).val();
        listaImagenes(mesActivo);
    });


    verificarNotificacion("2");
    $('#nombreUsuario2').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick2').html(usuario.nick);
    $('#img_foto_usu2').attr('src', usuario.foto);

    $('.slider-nav .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav').slick('slickGoTo', (parseInt((mesActivo)) + 1), true);
    $('.slider-nav .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    $('.slider-nav').on('click', '.slick-slide', function (e) {
        e.preventDefault();
        mesActivo = $(this).attr("id");
        console.log("dario id mes: " + mesActivo);
        var ayuda_num = parseInt(mesActivo) + 1;
        console.log("ayuda: " + ayuda_num);
        var currrentNavSlideElem = '.slider-nav .slick-slide[data-slick-index="' + ayuda_num + '"]';
        $('.slider-nav .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
        listaImagenes(mesActivo);
    });

    $("#overlayPanel2").niceScroll("#lista_menu2", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    $("#btn_open_panel2").on("click", function () {
        close_panel_registros = "no";
        $("#overlayPanel2").panel("open");
    });




});

function listaImagenes(mesComparar) {
    var datos = new Object();
    datos.accion = "verArchivos";
    datos.transaccion = transaccion.nick;
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    datos.mes = mesComparar;
    datos.anio = $("#anos_registros").val();
    var _url = url + '' + JSON.stringify(datos);
    console.log("URL: " + _url);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            lista_imagenes = "";
            var rutaArchivo = "";
            var fe_reg = "";
            if (data.flag == 'si') {
                $.each(data.fotos, function (i, v) {
                    //                    console.log(getFileExtension1(v.ruta));
                    if (getFileExtension1(v.ruta) == "pdf") {
                        rutaArchivo = "img/pdf.png";
                    } else if (getFileExtension1(v.ruta) == "doc" || getFileExtension1(v.ruta) == "docx") {
                        rutaArchivo = "img/doc.png";
                    } else if (getFileExtension1(v.ruta) == "xls" || getFileExtension1(v.ruta) == "xlsx") {
                        rutaArchivo = "img/excel.png";
                    } else if (getFileExtension1(v.ruta) == "png" || getFileExtension1(v.ruta) == "jpg" || getFileExtension1(v.ruta) == "jpeg" || getFileExtension1(v.ruta) == "gif") {
                        rutaArchivo = v.ruta;
                    } else {
                        rutaArchivo = "img/logo.png";
                    }

                    fe_reg = v.fecha.split(' ');

                    if (v.anulado == "1") {

                        lista_imagenes += '<li class="registros" id="' + v.id + '" foto="' + v.ruta + '" descripcion="' + v.descripcion + '" anulado="' + v.anulado + '" revisado="' + v.revisado + '" malo="' + v.malo + '"><div class="row vertical-align"><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2"><img src="' + rutaArchivo + '"alt="" class="ui-li-icon img_registros"></div><div class="col-xs-5 col-sm-6 col-md-6 col-lg-6"><label><span class="fecha_lista"> ' + fe_reg[0] + ' </span><br><span class="fecha_lista">' + v.descripcion + '</span></label></div><div class="col-xs-2 col-sm-3 col-md-3 col-lg-3 text-right"><img class="flecha_lista_anulado ui-li-icon" src="img/anulada.png" alt=""></div><div class="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-right"><img class="flecha_lista" src="img/flecha.png" alt="" class="ui-li-icon"></div></div></li>';


                        //                        lista_imagenes += '<li class="registros" foto="' + v.ruta + '" descripcion="' + v.descripcion + '" anulado="' + v.anulado + '" revisado="' + v.revisado + '" malo="' + v.malo + '"><img src="' + rutaArchivo + '" alt="" class="ui-li-icon img_registros"><label><span class="fecha_lista">' + v.descripcion + '</span><br><span class="fecha_lista">' + v.descripcion + '</span><div class="ayuda_lista"></label><img class="flecha_lista" src="img/anulada.png" alt="" class="ui-li-icon"><img class="flecha_lista" src="img/flecha.png" alt="" class="ui-li-icon"></div></li>';
                    } else {

                        //                        lista_imagenes += '<li class="registros" foto="' + v.ruta + '" descripcion="' + v.descripcion + '" anulado="' + v.anulado + '" revisado="' + v.revisado + '" malo="' + v.malo + '"><img src="' + rutaArchivo + '" alt="" class="ui-li-icon img_registros"><label><span class="fecha_lista">' + v.descripcion + '</span><br><span class="fecha_lista">' + v.descripcion + '</span></label><div class="ayuda_lista"><img class="flecha_lista" src="img/flecha.png" alt="" class="ui-li-icon"></div></li>';

                        lista_imagenes += '<li class="registros" id="' + v.id + '" foto="' + v.ruta + '" descripcion="' + v.descripcion + '" anulado="' + v.anulado + '" revisado="' + v.revisado + '" malo="' + v.malo + '"><div class="row vertical-align"><div class="col-xs-3 col-sm-2 col-md-2 col-lg-2"><img src="' + rutaArchivo + '"alt="" class="ui-li-icon img_registros"></div><div class="col-xs-5 col-sm-6 col-md-6 col-lg-6"><label><span class="fecha_lista"> ' + fe_reg[0] + ' </span><br><span class="fecha_lista">' + v.descripcion + '</span></label></div><div class="col-xs-2 col-sm-3 col-md-3 col-lg-3"></div><div class="col-xs-2 col-sm-1 col-md-1 col-lg-1 text-right"><img class="flecha_lista ui-li-icon" src="img/flecha.png" alt=""></div></div></li>';
                    }

                    // console.log("item:  imagen_fecha: " + v.fot_id);
                });

                $("#lista_imagenes").html(lista_imagenes);
                $("#lista_imagenes").listview().listview('refresh');


            } else {
                $("#lista_imagenes").html(lista_imagenes);
                $("#lista_imagenes").listview().listview('refresh');
                swal("", "No existe registros que mostrar", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
    if (close_panel_registros == "no") {
        $("#overlayPanel2").panel("close");
    } else {
        close_panel_registros = "si";
    }

}

$(document).on('click', '.registros', function (e) {

    imagen = new Imagen($(this).attr("id"), $(this).attr("foto"), $(this).attr("descripcion"), $(this).attr("anulado"), $(this).attr("revisado"), $(this).attr("malo"));

    if (imagen.revisado == "1") {
        var ref = cordova.InAppBrowser.open(imagen.ruta, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
    } else {
        llenarComboAnos("anos_modal_lista", anos);
        if (getFileExtension1(imagen.ruta) == "png" || getFileExtension1(imagen.ruta) == "jpg" || getFileExtension1(imagen.ruta) == "jpeg" || getFileExtension1(imagen.ruta) == "gif") {
            $('#imagen_previsualizar').attr('src', imagen.ruta);
            $('#href_imagen_previsualizar').attr('href', imagen.ruta);
            $("#descripcion_lista").val(imagen.descripcion);
            $("#categoria_modal_titulo_lista").html(transaccion.nombre);
            $('#meses_modal_lista').val(mesActivo);
            if (imagen.anulada == "1") {
                $('#anulado_lista').prop('checked', true);

            } else {
                $('#anulado_lista').prop('checked', false);
            }

            $("#anos_modal_lista").val(usuario.anio);
            $("#anos_modal_lista").change();
            $("#myModalPrevisualizar").modal();
        } else {
            console.log(imagen.ruta);
            var ref = cordova.InAppBrowser.open(imagen.ruta, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
        }
    }


    //    llenarComboAnos("anos_modal_lista", anos);
    //
    //    imagen = new Imagen($(this).attr("id"), $(this).attr("foto"), $(this).attr("descripcion"), $(this).attr("anulado"), $(this).attr("revisado"), $(this).attr("malo"));
    //
    //    if (getFileExtension1(imagen.ruta) == "png" || getFileExtension1(imagen.ruta) == "jpg" || getFileExtension1(imagen.ruta) == "jpeg" || getFileExtension1(imagen.ruta) == "gif") {
    //        $('#imagen_previsualizar').attr('src', imagen.ruta);
    //        $('#href_imagen_previsualizar').attr('href', imagen.ruta);
    //        $("#descripcion_lista").val(imagen.descripcion);
    //        $("#categoria_modal_titulo_lista").html(transaccion.nombre);
    //        $('#meses_modal_lista').val(mesActivo);
    //        if (imagen.anulada == "1") {
    //            $('#anulado_lista').prop('checked', true);
    //
    //        } else {
    //            $('#anulado_lista').prop('checked', false);
    //        }
    //
    //        $("#anos_modal_lista").val(usuario.anio);
    //        $("#anos_modal_lista").change();
    //        $("#myModalPrevisualizar").modal();
    //    } else {
    //        console.log(imagen.ruta);
    //        var ref = cordova.InAppBrowser.open(imagen.ruta, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
    //    }



});

$(document).on('click', '#btn_editar_registro', function (e) {
    if ($('#anulado_lista').is(":checked")) {
        anulado_img = "1";
    } else {
        anulado_img = "0";
    }
    var datos = new Object();
    datos.accion = "editaRegistro";
    datos.idArchivo = imagen.id;
    datos.mes = $("#meses_modal_lista").val();
    datos.anio = $("#anos_modal_lista").val();
    datos.nombre = document.getElementById("descripcion_lista").value;;
    datos.anulado = anulado_img;

    usuario.anio = $("#anos_modal_lista").val();

    var _url = url + '' + JSON.stringify(datos);
    // console.log("subir foto: " + _url);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            if (data.flag == 'si') {
                $('#myModalPrevisualizar').modal('hide');
                $('#imagen_previsualizar').attr('src', "");
                swal("", "Datos editados correctamente", "success");
                listaImagenes(mesActivo);

            } else {
                swal("", "Ocurrió un error inesperado. Por favor, intenta de nuevo", "error");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });

});

$(document).on('click', '#imagen_previsualizar', function (e) {
    var url_image = $(this).attr('src');
    //    PhotoViewer.show(url_image, 'Previsualización');
    var ref = cordova.InAppBrowser.open(url_image, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');

});

$(document).on('click', '#i_imagen_previsualizar', function (e) {
    var url_image = $('#imagen_previsualizar').attr('src');
    //    PhotoViewer.show(url_image, 'Previsualización');
    var ref = cordova.InAppBrowser.open(url_image, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
});



//********  Inicio Pagina Informes ********//////
//$(document).on("pagebeforecreate", "#pageInformes", function (event) {
//    var hoy = new Date();
//    mesActivo = hoy.getMonth() + 1;
//});

$(document).on('click', '.listaImagenInformes', function (e) {
    transaccion = new Transaccion($(this).attr("codigo"), $(this).attr("nombre"), $(this).attr("nick"));

    $("#titulo_categoria_informes").html(transaccion.nombre);
    llenarComboAnos("anos_informes", anos);

    //    var hoy = new Date();
    //    mesActivo = hoy.getMonth() + 1;


    $('.slider-nav-informes .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav-informes').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav-informes .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    $("#anos_informes").val(usuario.anio);
    $("#anos_informes").change();

    if (transaccion.id == "1") {
        // console.log("informe ventas: " + transaccion.id);
        $(".total_informe").css("display", "block");
        $(".total_informe").css("background-color", "#569DA0");
        $(".total_informe_retenciones").css("display", "none");
        listaInformesVentas(mesActivo);
    } else if (transaccion.id == "4") {
        //  console.log("informe retenciones compras: " + transaccion.id);
        $(".total_informe").css("display", "none");
        $(".total_informe_retenciones").css("display", "block");
        listaInformesRetencionesCompra(mesActivo);

    } else if (transaccion.id == "3") {
        // console.log("informe compras: " + transaccion.id);
        $(".total_informe").css("display", "block");
        $(".total_informe").css("background-color", "#C06869");
        $(".total_informe_retenciones").css("display", "none");
        listaInformesCompras(mesActivo);

    } else if (transaccion.id == "2") {
        // console.log("informe retenciones ventas: " + transaccion.id);
        $(".total_informe").css("display", "none");
        $(".total_informe_retenciones").css("display", "block");
        listaInformesRetencionesVentas(mesActivo);
    }

    $.mobile.changePage("#pageInformes", {
        transition: "slide",
        reverse: false
    });
});

$(document).on("pageshow", "#pageInformes", function (event) {


    console.log("mesActivo: " + mesActivo);
    verificarNotificacion("3");
    $('#nombreUsuario3').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick3').html(usuario.nick);
    $('#img_foto_usu3').attr('src', usuario.foto);

    $('.slider-nav-informes .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav-informes').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav-informes .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    console.log("mesActivoqw: " + mesActivo);

    $('.slider-nav-informes').on('click', '.slick-slide', function (e) {
        e.preventDefault();
        mesActivo = $(this).attr("id");
        //        console.log("idMes: " + mesActivo);
        var ayuda_num = parseInt(mesActivo) + 1;
        var currrentNavSlideElem = '.slider-nav-informes .slick-slide[data-slick-index="' + ayuda_num + '"]';
        $('.slider-nav-informes .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');

        if (transaccion.id == "1") {
            // console.log("informe ventas: " + transaccion.id);
            listaInformesVentas(mesActivo);
        } else if (transaccion.id == "4") {
            // console.log("informe retenciones compras: " + transaccion.id);
            listaInformesRetencionesCompra(mesActivo);

        } else if (transaccion.id == "3") {
            // console.log("informe compras: " + transaccion.id);
            listaInformesCompras(mesActivo);

        } else if (transaccion.id == "2") {
            // console.log("informe retenciones ventas: " + transaccion.id);
            listaInformesRetencionesVentas(mesActivo);
        }
    });

    $("#anos_informes").on("change", function () {
        usuario.anio = $(this).val();
        if (transaccion.id == "1") {
            listaInformesVentas(mesActivo);
        } else if (transaccion.id == "4") {
            listaInformesRetencionesCompra(mesActivo);

        } else if (transaccion.id == "3") {
            listaInformesCompras(mesActivo);

        } else if (transaccion.id == "2") {
            listaInformesRetencionesVentas(mesActivo);
        }

    });

    $("#overlayPanel3").niceScroll("#lista_menu3", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    $("#btn_open_panel3").on("click", function () {
        close_panel_informes = "no";
        $("#overlayPanel3").panel("open");
    });
});

$(document).on('click', '.headers', function (e) {
    console.log("colapse");
    setTimeout(function () {
        $("#lista_informes").listview().listview('refresh');
        $("#contenido_informes").iscrollview().iscrollview('refresh');
    }, 1000);

});

function numberWithCommas(n) {
    var parts = n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function listaInformesCompras(mesComparar) {
    var datos = new Object();
    datos.accion = "informes";
    datos.user = usuario.id;
    datos.transaccion = transaccion.nick;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            var lista_informes = '<div class="panel-group">';
            //            data = JSON.parse(data);
            var count = 0;
            var total_proveedor = 0;
            var total = 0;

            var subtotal = 0;
            var ivatotal = 0;
            var iva_proveedor = 0;
            if (data.flag == 'si') {
                $.each(data, function (i, v) {
                    if (i != "flag") {
                        $.each(v, function (j, w) {
                            total_proveedor = total_proveedor + parseFloat(w.total);
                            iva_proveedor = iva_proveedor + parseFloat(w.iva);
                            //                            console.log("iva_proveedor: " + w.total + " i: " + w.proveedor + " iva: " + w.iva);
                        });
                        lista_informes += '<div class="panel panel-default"><div class="panel-heading headers"><a data-toggle="collapse" href="#collapse' + count + '"><h4 class="panel-title display_title"><i class="glyphicon glyphicon-chevron-down" style="color: gray;"></i>&nbsp&nbsp<img src="img/logo.png" alt="" class="img_informes">' + i + '</h4><span class="span_title">$ ' + numberWithCommas(((truncateDecimals(total_proveedor * 100)) / 100)) + ' </span></a></div><div id = "collapse' + count + '" class="panel-collapse collapse informe-ul"><ul class="list-group">';
                        $.each(v, function (j, w) {
                            lista_informes += '<li class="list-group-item"><div class="row"><div class="col-xs-6 col-sm-5 col-md-5 col-lg-5"><strong class="negro">' + w.proveedor + '</strong></div><div class="col-xs-3 col-sm-4 col-md-4 col-lg-4"><p>&nbsp;&nbsp;&nbsp;' + w.fecha + '</p></div><div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-right"><strong class="negro"><p>T. $ ' + numberWithCommas(((truncateDecimals(w.total * 100)) / 100)) + '</p></strong><div><strong class="negro"><p>IVA $ ' + numberWithCommas(((truncateDecimals(w.iva * 100)) / 100)) + '</p></strong></div></div></div> </li>';
                        });
                        //                        lista_informes += '</ul><div class="panel-footer" > ' + i + ' </div></div></div>';
                        lista_informes += '</ul></div></div>';
                        total = total + total_proveedor;
                        ivatotal = ivatotal + iva_proveedor;
                        iva_proveedor = 0;
                        total_proveedor = 0;
                    }
                    //                    console.log("ivatotal: " + ivatotal + " total: " + total);
                    count++;
                });
                var ayuda_iva_total = numberWithCommas((truncateDecimals(ivatotal * 100)) / 100);
                var ayuda_total = numberWithCommas((truncateDecimals(total * 100)) / 100);

                var ayuda_subtotal = (parseFloat(total) - parseFloat(ivatotal));
                var ayuda_subtotal = numberWithCommas((truncateDecimals(ayuda_subtotal * 100)) / 100);


                $("#iva_informe_compras").html("$ " + ayuda_iva_total);
                $("#subtotal_informe_compras").html("$ " + ayuda_subtotal);
                $("#total_informe_compras").html("$ " + ayuda_total);
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');

            } else {
                $("#iva_informe_compras").html("");
                $("#subtotal_informe_compras").html("");
                $("#total_informe_compras").html("");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');
                swal("", "No existe informes que mostrar", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
    if (close_panel_informes == "no") {
        $("#overlayPanel3").panel("close");
    } else {
        close_panel_informes = "si";
    }
}

function listaInformesVentas(mesComparar) {
    var datos = new Object();
    datos.accion = "informes";
    datos.user = usuario.id;
    datos.transaccion = transaccion.nick;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    //console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            var lista_informes = "";
            //            data = JSON.parse(data);
            var total_proveedor = 0;
            var total = 0;

            var subtotal = 0;
            var ivatotal = 0;
            var iva_proveedor = 0;
            if (data.flag == 'si') {
                //                if (data.flag != "flag") {
                $.each(data.ventas, function (j, w) {
                    total_proveedor = total_proveedor + parseFloat(w.total);
                    iva_proveedor = iva_proveedor + parseFloat(w.iva);
                    //                    console.log("iva_proveedor: " + w.total + " i: " + w.proveedor + " iva: " + w.iva);
                });

                $.each(data.ventas, function (j, w) {
                    //                    for (var i = 0; i < 4; i++) {
                    //                    lista_informes += '<li class=""><div class="row vertical-align"><div class="col-xs-6 col-sm-5 col-md-5 col-lg-5"><label class="display_title" style="width: 100%;"><span> Fac. No' + w.factura + '</span><br><span><strong class="negro">' + w.cliente + '</strong></span></label></div><div class="col-xs-3 col-sm-4 col-md-4 col-lg-4">' + w.fecha + '</div><div class="col-xs-3 col-sm-3 col-md-3 col-lg-3 text-right"><strong class="negro">' + ((truncateDecimals(w.total * 100)) / 100) + ' USD</strong></div></div></li>';


                    lista_informes += '<li class=""><div class="row vertical-align"><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6"><label class="display_title" style="width: 100%;"><span> Fac. No' + w.factura + '</span><br><span><strong class="negro">' + w.cliente + '</strong></span></label></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right"><span>' + w.fecha + '</span><br><span><strong class="negro">$ ' + numberWithCommas(((truncateDecimals(w.total * 100)) / 100)) + '</strong></span><br><span><strong class="negro">IVA $ ' + numberWithCommas(((truncateDecimals(w.iva * 100)) / 100)) + '</strong></span></div></div></li>';
                    //                    }
                });


                total = total + total_proveedor;
                total_proveedor = 0;

                ivatotal = ivatotal + iva_proveedor;
                total_proveedor = 0;

                //                var ayuda_total = (numberWithCommas((truncateDecimals(total * 100)) / 100));
                var ayuda_iva_total = numberWithCommas((truncateDecimals(ivatotal * 100)) / 100);
                var ayuda_total = numberWithCommas((truncateDecimals(total * 100)) / 100);

                var ayuda_subtotal = (parseFloat(total) - parseFloat(ivatotal));
                var ayuda_subtotal = numberWithCommas((truncateDecimals(ayuda_subtotal * 100)) / 100);


                $("#iva_informe_compras").html("$ " + ayuda_iva_total);
                $("#subtotal_informe_compras").html("$ " + ayuda_subtotal);
                $("#total_informe_compras").html("$ " + ayuda_total);
                //                $("#total_informe_compras").html("$ " + ayuda_total + "");

                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');

            } else {
                $("#iva_informe_compras").html("");
                $("#subtotal_informe_compras").html("");
                $("#total_informe_compras").html("");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');
                swal("", "No existe informes que mostrar", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
    if (close_panel_informes == "no") {
        $("#overlayPanel3").panel("close");
    } else {
        close_panel_informes = "si";
    }
}

function listaInformesRetencionesCompra(mesComparar) {
    $("#tipo_retencion").html("T. FUENTE:");
    var datos = new Object();
    datos.accion = "informes";
    datos.user = usuario.id;
    datos.transaccion = transaccion.nick;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
	var urlp="https://www.practisis.online/contabilidad/integracioncontapp/ios2.php?i=";
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            var lista_informes = "";
            //            data = JSON.parse(data);
            var total_iva = 0;
            var total_fuente = 0;
            var total = 0;
            if (data.flag == 'si') {
                $.each(data, function (i, v) {
                    if (i != "flag") {
                        $.each(v, function (j, w) {
                            total_iva = total_iva + parseFloat(w.ivaValor);
                            total_fuente = total_fuente + parseFloat(w.fuenteValor);
                            console.log("total: " + total);
                        });

                        total = total_iva + total_fuente;


                        $.each(v, function (j, w) {

                            lista_informes += '<li><div class="row"><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="gray">Fac. No  ' + w.factura + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="gray">' + w.ivaTipo + " $ " + numberWithCommas(((truncateDecimals(parseFloat(w.ivaValor) * 100)) / 100)) + ' </h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="gray">Ret No ' + w.numeroRet + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="gray">T. FUENTE ' + w.fuenteTipo + " $ " + numberWithCommas(((truncateDecimals(parseFloat(w.fuenteValor) * 100)) / 100)) + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="negro">' + w.proveedor + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="negro">Total $ ' + numberWithCommas(((truncateDecimals(parseFloat((parseFloat(w.ivaValor) + parseFloat(w.fuenteValor))) * 100)) / 100)) + '</h5></div></div></li>';
                        });
                    }
                });


                //                total_iva = total_iva;
                //                total_fuente = total_fuente;
                //                total = total;
                $("#label_t_iva").html("$ " + numberWithCommas(((truncateDecimals(parseFloat(total_iva) * 100)) / 100)) + "   ");
                $("#label_t_fuente").html("$ " + numberWithCommas(((truncateDecimals(parseFloat(total_fuente) * 100)) / 100)) + "   ");
                $("#label_t_total").html("$ " + numberWithCommas(((truncateDecimals(parseFloat(total) * 100)) / 100)) + "   ");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');

            } else {
                $("#label_t_iva").html("");
                $("#label_t_fuente").html("");
                $("#label_t_total").html("");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');
                swal("", "No existe Informes que mostrar", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
    if (close_panel_informes == "no") {
        $("#overlayPanel3").panel("close");
    } else {
        close_panel_informes = "si";
    }
}

function listaInformesRetencionesVentas(mesComparar) {
    $("#tipo_retencion").html("T. FUENTE:");

    var datos = new Object();
    datos.accion = "informes";
    datos.user = usuario.id;
    datos.transaccion = transaccion.nick;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    //  console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            var lista_informes = "";
            //            data = JSON.parse(data);
            var total_iva = 0;
            var total_fuente = 0;
            var total = 0;
            if (data.flag == 'si') {
                $.each(data, function (i, v) {
                    if (i != "flag") {
                        $.each(v, function (j, w) {
                            total_iva = total_iva + parseFloat(w.ivaValor);
                            total_fuente = total_fuente + parseFloat(w.rentaValor);
                        });

                        total = total_iva + total_fuente;

                        $.each(v, function (j, w) {
                            lista_informes += '<li><div class="row"><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="gray">Fac. No ' + w.factura + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="gray">' + w.ivaTipo + " $ " + numberWithCommas(((truncateDecimals(parseFloat(w.ivaValor) * 100)) / 100)) + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="gray">Ret. No ' + w.numeroRet + '</h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="gray">T. FUENTE ' + w.rentaTipo + " $ " + numberWithCommas(((truncateDecimals(parseFloat(w.rentaValor) * 100)) / 100)) + ' </h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-left pading_informe_item"><h5 class="negro"><b>' + w.cliente + '</b></h5></div><div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right pading_informe_item"><h5 class="negro"><b>Total $ ' + numberWithCommas(((truncateDecimals(parseFloat((parseFloat(w.ivaValor) + parseFloat(w.rentaValor))) * 100)) / 100)) + ' </b></h5></div></div></li>';
                        });
                    }
                });
                //
                //                total_iva = ((truncateDecimals( * 100)) / 100);
                //                total_fuente = ((truncateDecimals(total_fuente * 100)) / 100);
                //                total = ((truncateDecimals(total * 100)) / 100);
                $("#label_t_iva").html("$ " + numberWithCommas(((truncateDecimals(total_iva * 100)) / 100)) + " ");
                $("#label_t_fuente").html("$ " + numberWithCommas(((truncateDecimals(total_fuente * 100)) / 100)) + " ");
                $("#label_t_total").html("$ " + numberWithCommas(((truncateDecimals(total * 100)) / 100)) + " ");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');

            } else {
                $("#label_t_iva").html("");
                $("#label_t_fuente").html("");
                $("#label_t_total").html("");
                $("#lista_informes").html(lista_informes);
                $("#lista_informes").listview().listview('refresh');
                swal("", "No existe Informes que mostrar", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
    if (close_panel_informes == "no") {
        $("#overlayPanel3").panel("close");
    } else {
        close_panel_informes = "si";
    }
}


//********  Inicio Pagina Graficas ********//////

var barChart;
var gastos = new Array("Ingresos", "Gastos");
var colores = new Array("#4BC0C0", "#FF6384", "#FF5859", "#009692", "#216093", "#FC6719");
var colores_gatos = new Array("#4BC0C0", "#FF6384");
var totalCompras = 0,
    totalVentas = 0;
var valores;

$(document).on('click', '#btn_graficas', function (e) {
    //    llenarComboAnos("anos_graficas_ingreso_ventas", anos);
    $.mobile.changePage("#pageIngresoGasto", {
        transition: "slide",
        reverse: false
    });
});

$(document).on('click', '#btn_ingreso_gastos', function (e) {
    //    llenarComboAnos("anos_graficas_ingreso_ventas", anos);
    $.mobile.changePage("#pageIngresoGasto", {
        transition: "fade",
        reverse: false
    });
});

//$(document).on("pagebeforecreate", "#pageIngresoGasto", function (event) {
//    var hoy = new Date();
//    mesActivo = hoy.getMonth() + 1;
//});

$(document).on("pageshow", "#pageIngresoGasto", function (event) {

    llenarComboAnos("anos_graficas_ingreso_ventas", anos);
    $('.slider-nav-grafica-ingreso-gastos .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav-grafica-ingreso-gastos').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav-grafica-ingreso-gastos .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');



    $('.slider-nav-grafica-ingreso-gastos').on('click', '.slick-slide', function (e) {
        e.preventDefault();
        mesActivo = $(this).attr("id");
        //        console.log("dario id mes: " + mesActivo);
        var ayuda_num = parseInt(mesActivo) + 1;
        var currrentNavSlideElem = '.slider-nav-grafica-ingreso-gastos .slick-slide[data-slick-index="' + (ayuda_num) + '"]';
        $('.slider-nav-grafica-ingreso-gastos .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');

        llenarGastosIngresos(mesActivo);
    });

    verificarNotificacion("4");
    $('#nombreUsuario4').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick4').html(usuario.nick);
    $('#img_foto_usu4').attr('src', usuario.foto);

    $("#anos_graficas_ingreso_ventas").val(usuario.anio);
    $("#anos_graficas_ingreso_ventas").change();

    llenarGastosIngresos(mesActivo);

    $("#overlayPanel4").niceScroll("#lista_menu4", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    $("#btn_open_panel4").on("click", function () {
        $("#overlayPanel4").panel("open");
    });

    $("#anos_graficas_ingreso_ventas").on("change", function () {
        usuario.anio = $(this).val();
        llenarGastosIngresos(mesActivo);

    });
});

function llenarGastosIngresos(mesComparar) {
    var datos = new Object();
    datos.accion = "grafico";
    datos.idUser = usuario.id;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;

    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            var datos = JSON.parse(data);
            var tot_compras = 0;
            var tot_ventas = 0;
            totalCompras = 0;
            totalVentas = 0;
            // console.log(datos.flagCompras);
            if (datos.flagCompras == 'si') {
                $.each(datos.compras, function (j, w) {
                    tot_compras = tot_compras + parseFloat(w.total);
                });
                totalCompras = tot_compras;

            } else {
                totalCompras = 0;
            }


            if (datos.flagVentas == 'si') {
                $.each(datos.ventas, function (i, v) {
                    // console.log(v);
                    tot_ventas = tot_ventas + parseFloat(v);
                });
                totalVentas = tot_ventas;

            } else {
                totalVentas = 0;
            }
            // console.log("Compras: " + totalCompras + " Ventas: " + totalVentas);

            if (totalCompras == 0 && totalVentas == 0) {
                $('#barChartIngresoGatos').hide();
                swal("", "No hay datos en este mes", "");
            } else {
                $('#barChartIngresoGatos').show();
                //                charIngresoGastos(totalVentas, totalCompras);
                charIngresoGastos(((truncateDecimals(parseFloat(totalVentas) * 100)) / 100), ((truncateDecimals(parseFloat(totalCompras) * 100)) / 100));

            }

        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

function charIngresoGastos(ventas, gatos) {
    valores = new Array();
    valores.push(ventas);
    valores.push(gatos);


    Highcharts.chart('barChartIngresoGatos', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        colors: colores_gatos,
        tooltip: {
            formatter: function () {
                var sliceIndex = this.point.index;
                var sliceName = this.series.chart.axes[0].categories[sliceIndex];
                return '<b>' + sliceName +
                    '</b>: <b>$ ' + numberWithCommas(this.y) + '</b>';
            }
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: true,
            labelFormatter: function () {
                var legendIndex = this.index;
                var legendName = this.series.chart.axes[0].categories[legendIndex];

                return legendName;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    //                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    format: '{point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor)
                    }
                },
                innerSize: 50,
                depth: 45
            }
        },
        xAxis: {
            categories: gastos,
        },
        series: [{
            name: "",
            data: valores
    }]
    });

}

/*Pagina grafica detalle gastos*/

$(document).on('click', '#btn_detalle_gastos', function (e) {
    //    mesesCabeceraDetalleGastos();
    // console.log("dario: btn_detalle_gastos");
    $.mobile.changePage("#pageDetalleGasto", {
        transition: "fade",
        reverse: false
    });
});

$(document).on("pageshow", "#pageDetalleGasto", function (event) {

    llenarComboAnos("anos_graficas_detalle_gastos", anos);
    //    var hoy = new Date();
    //    mesActivo = hoy.getMonth() + 1;


    $('.slider-nav-grafica-detalle-gastos .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav-grafica-detalle-gastos').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav-grafica-detalle-gastos .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    $('.slider-nav-grafica-detalle-gastos').on('click', '.slick-slide', function (e) {
        e.preventDefault();
        mesActivo = $(this).attr("id");
        //        console.log("dario id mes: " + mesActivo);
        var ayuda_num = parseInt(mesActivo) + 1;
        var currrentNavSlideElem = '.slider-nav-grafica-detalle-gastos .slick-slide[data-slick-index="' + (ayuda_num) + '"]';
        $('.slider-nav-grafica-detalle-gastos .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');

        llenarDetalleGastos(mesActivo);
    });

    verificarNotificacion("5");
    $('#nombreUsuario5').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick5').html(usuario.nick);
    $('#img_foto_usu5').attr('src', usuario.foto);

    $("#anos_graficas_detalle_gastos").val(usuario.anio);
    $("#anos_graficas_detalle_gastos").change();

    llenarDetalleGastos(mesActivo);

    $("#overlayPanel5").niceScroll("#lista_menu5", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    $("#btn_open_panel5").on("click", function () {
        $("#overlayPanel5").panel("open");
    });

    $("#anos_graficas_detalle_gastos").on("change", function () {
        usuario.anio = $(this).val();
        llenarDetalleGastos(mesActivo);

    });
});

var detalle_gastos;
var colores_detalle_gastos;

function llenarDetalleGastos(mesComparar) {
    var datos = new Object();
    datos.accion = "grafico";
    datos.idUser = usuario.id;
    datos.mes = mesComparar;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            console.log(data);
            //            var datos = JSON.parse(data);
            var cont = 0;
            valores = new Array();
            detalle_gastos = new Array();
            colores_detalle_gastos = new Array();
            if (datos.flagCompras == 'si') {
                $.each(datos.compras, function (j, w) {
                    detalle_gastos.push(w.descripcion);
                    valores.push(((truncateDecimals(parseFloat(w.total) * 100)) / 100));
                    if (cont == colores.length) {
                        cont = 0;
                    }
                    colores_detalle_gastos.push(colores[cont]);
                    cont++;
                });
                $('#barChartDetalleGastos').show();

                charDetalleGastos(detalle_gastos, valores);

            } else {
                $('#barChartDetalleGastos').hide();
                swal("", "No hay datos en este mes", "");
                //                detalle_gastos.push("");
                //                valores.push("");
            }



        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

function charDetalleGastos(nombres, datos) {
    Highcharts.chart('barChartDetalleGastos', {
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45
            }
        },
        colors: colores_detalle_gastos,
        tooltip: {
            formatter: function () {
                var sliceIndex = this.point.index;
                var sliceName = this.series.chart.axes[0].categories[sliceIndex];
                return '<b>' + sliceName +
                    '</b>: <b>$ ' + numberWithCommas(this.y) + '</b>';
            }
        },
        title: {
            text: '',
            style: {
                display: 'none'
            }
        },
        legend: {
            enabled: true,
            labelFormatter: function () {
                var legendIndex = this.index;
                var legendName = this.series.chart.axes[0].categories[legendIndex];

                return legendName;
            }
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                //                showInLegend: true,
                dataLabels: {
                    enabled: true,
                    //                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    format: '{point.percentage:.1f} % ',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor)
                    }
                },
                innerSize: 50,
                depth: 45
            }
        },
        xAxis: {
            categories: nombres,
        },
        series: [{
            name: "",
            data: datos
    }]
    });

    //    var chartDiv = $("#barChartDetalleGastos");
    //    var myChart = new Chart(chartDiv, {
    //        type: 'doughnut',
    //        data: {
    //            labels: nombres,
    //            datasets: [
    //                {
    //                    data: datos,
    //                    backgroundColor: colors
    //        }]
    //        },
    //        options: {
    //            //            title: {
    //            //                display: true,
    //            //                text: 'Detalle gastos'
    //            //            },
    //            responsive: true,
    //            maintainAspectRatio: false,
    //        }
    //    });
}

/*Pagina grafica anualizado*/

$(document).on('click', '#btn_anualizado', function (e) {
    // console.log("dario: btn_anualizado");
    $.mobile.changePage("#pageAnualizado", {
        transition: "fade",
        reverse: false
    });
});

$(document).on("pageshow", "#pageAnualizado", function (event) {
    llenarComboAnos("anos_grafica_anualizado", anos);
    llenarAnualizado();

    $("#overlayPanel6").niceScroll("#lista_menu6", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    verificarNotificacion("6");


    $("#anos_grafica_anualizado").val(usuario.anio);
    $("#anos_grafica_anualizado").change();

    $('#nombreUsuario6').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick6').html(usuario.nick);
    $('#img_foto_usu6').attr('src', usuario.foto);

    $("#btn_open_panel6").on("click", function () {
        $("#overlayPanel6").panel("open");
    });


    $("#anos_grafica_anualizado").on("change", function () {
        usuario.anio = $(this).val();
        llenarAnualizado();
    });
});

var valoresGastos;
var valoresIngresos;
var data, series;

function llenarAnualizado() {
    var datos = new Object();
    datos.accion = "graficoAnual";
    datos.idUser = usuario.id;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            var datos = JSON.parse(data);
            valoresGastos = [];
            valoresIngresos = [];
            data = [];
            series = [];
            $.each(datos, function (i, v) {
                //                console.log("i: " + i);
                $.each(v, function (j, w) {
                    if (j != "flag") {
                        if (j == "compras") {
                            $.each(w, function (k, u) {
                                //                                console.log("   compras: " + u.total);
                                valoresGastos.push(((truncateDecimals(parseFloat(u.total) * 100)) / 100));
                            });
                        }



                        if (j == "ventas") {

                            valoresIngresos.push(((truncateDecimals(parseFloat(w.total) * 100)) / 100));
                        }
                    }
                    //                    console.log("Ingresos: " + valoresIngresos + " Gastos: " + valoresGastos);
                });
            });

            //            charAnualizado(valoresGastos, valoresIngresos);
            charAnualizado();
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

//function charAnualizado(valGastos, valIngresos) {
function charAnualizado() {
    // console.log("Gastos: " + valoresGastos);
    //console.log("Ingresos: " + valoresIngresos);
    Highcharts.setOptions({
        lang: {
            decimalPoint: '.',
            thousandsSep: ","
        }
    });
    Highcharts.chart('barChartAnualizado', {
        chart: {
            type: 'column'
        },
        colors: colores_gatos,
        title: {
            text: ''
        },
        xAxis: {
            categories: meses_mini,
            crosshair: true
        },
        yAxis: [{ // 1er yAxis (numero 0)
            gridLineWidth: 2,
            tickInterval: 10,
            labels: {
                formatter: function () {
                    return numberWithCommas(this.value) + '';
                }
            },
            title: {
                text: '$ Dólares'
            }

            }],
        tooltip: {
            headerFormat: '<span style="font-size:4px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>$ {point.y:,.1f} </b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 1,
            },
            series: {
                events: {
                    legendItemClick: function (e) {
                        e.preventDefault();
                    }
                }
            }
        },
        series: [{
            type: 'column',
            name: 'Ingresos',
            data: valoresIngresos
        }, {
            type: 'column',
            name: 'Gastos',
            data: valoresGastos
        }]
    });



    //    var ctx = document.getElementById("barChartAnualizado").getContext('2d');
    //    //    Chart.defaults.global.defaultFontFamily = "Roboto";
    //    Chart.defaults.global.defaultFontSize = 8
    //    var myChart = new Chart(ctx, {
    //        type: 'horizontalBar',
    //        data: {
    //            labels: meses_mini,
    //            datasets: [{
    //                label: 'Gastos',
    //                data: valGastos,
    //                backgroundColor: "#FF6384"
    //        }, {
    //                label: 'Ingresos',
    //                data: valIngresos,
    //                backgroundColor: "#4BC0C0"
    //        }]
    //        }
    //    });
}


//********  Inicio Pagina Estado Cuenta ********//////
$(document).on('click', '#btn_estado_cuenta', function (e) {

    llenarComboAnos("anos_resultado_mes", anos);

    $.mobile.changePage('#pageEstadoCuenta', {
        transition: "slide"
    });

    $("#anos_resultado_mes").val(usuario.anio);
    $("#anos_resultado_mes").change();

});

$(document).on('pageshow', '#pageEstadoCuenta', function (e) {


    //    var hoy = new Date();
    //    mesActivo = hoy.getMonth() + 1;

    $('.slider-nav-resultado .slick-slide.is-active').removeClass('is-active');
    $('.slider-nav-resultado').slick('slickGoTo', (parseInt(mesActivo) + 1), true);
    $('.slider-nav-resultado .slick-slide').eq((parseInt(mesActivo) + 1)).addClass('is-active');

    $('.slider-nav-resultado').on('click', '.slick-slide', function (e) {
        e.preventDefault();
        mesActivo = $(this).attr("id");
        //        console.log("dario id mes: " + mesActivo);
        var ayuda_num = parseInt(mesActivo) + 1;
        var currrentNavSlideElem = '.slider-nav-resultado .slick-slide[data-slick-index="' + (ayuda_num) + '"]';
        $('.slider-nav-resultado .slick-slide.is-active').removeClass('is-active');
        $(currrentNavSlideElem).addClass('is-active');
        resultadosMes(mesActivo);
        //        llenarGastosIngresos(mesActivo);
    });

    resultadosMes(mesActivo);

    $("#overlayPanel8").niceScroll("#lista_menu8", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    verificarNotificacion("8");
    $('#nombreUsuario8').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick8').html(usuario.nick);
    $('#img_foto_usu8').attr('src', usuario.foto);

    $("#btn_open_panel8").on("click", function () {
        $("#overlayPanel8").panel("open");
    });

    $("#anos_resultado_mes").on("change", function () {
        usuario.anio = $(this).val();
        resultadosMes(mesActivo);

    });
});

function resultadosMes(mes_estado_cuenta) {
    var datos = new Object();
    datos.accion = "estadoCuenta";
    datos.idUser = usuario.id;
    datos.mes = mes_estado_cuenta;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;

    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            var datos = JSON.parse(data);
            if (datos.flag == "si") {
                $("#contenido_estado_cuenta").css("display", "block");
                $("#esc_ventas").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.ingresos) * 100)) / 100)) + " USD  ");
                $("#esc_compras").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.gastos) * 100)) / 100)) + " USD  ");
                $("#esc_utilidad").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.utilidad) * 100)) / 100)) + " USD  ");
                $("#esc_total_imp_iva").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.impuesto) * 100)) / 100)) + " USD  ");
                $("#esc_saldo_credito").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.credito) * 100)) / 100)) + " USD  ");
                //                $("#esc_saldo_credito").html(datos.estado.esc_saldo_tributario + " USD  ");
                $("#esc_total_pagar").html(numberWithCommas(((truncateDecimals(parseFloat(datos.estado.total) * 100)) / 100)) + " USD  ");
                $("#fecha_declaracion").html(datos.estado.declaracion + "   ");
                $("#fecha_pago").html(datos.estado.pago + "   ");

                $('#titulo_estado_cuenta').html('Resultado de Mes');
                $("#contenido_estado_cuenta").listview().listview('refresh');

            } else if (datos.flag == "no") {
                swal("", "No existe datos en este mes", "");
                $("#contenido_estado_cuenta").css("display", "none");
            } else {
                $("#contenido_estado_cuenta").css("display", "none");
                swal("", "Ups parece que hay un fallo, por favor reintentalo!", "error");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

$(document).on('click', '.meses', function (e) {
    mes_estado_cuenta = $(this).attr('codigo');
    var mes_letras = $(this).attr('mes');

    var datos = new Object();
    datos.accion = "estadoCuenta";
    datos.idUser = usuario.id;
    datos.mes = mes_estado_cuenta;
    datos.anio = usuario.anio;
    datos.empleado = usuario.empleado;

    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            var datos = JSON.parse(data);
            if (datos.flag == "si") {
                $("#esc_ventas").html(datos.estado.ingresos + " USD  ");
                $("#esc_compras").html(datos.estado.gastos + " USD  ");
                $("#esc_utilidad").html(datos.estado.utilidad + " USD  ");
                $("#esc_total_imp_iva").html(datos.estado.impuesto + " USD  ");
                $("#esc_saldo_credito").html(datos.estado.credito + " USD  ");
                //                $("#esc_saldo_credito").html(datos.estado.esc_saldo_tributario + " USD  ");
                $("#esc_total_pagar").html(datos.estado.total + " USD  ");
                $("#fecha_declaracion").html(datos.estado.declaracion + "   ");
                $("#fecha_pago").html(datos.estado.pago + "   ");

                $('#titulo_estado_cuenta').html('Resultado de ' + mes_letras);
                $.mobile.changePage('#pageDetalleEstadoCuenta', {
                    transition: "slide"
                });
            } else if (datos.flag == "no") {
                swal("", "No existe datos en este mes", "");
            } else {
                swal("", "Ups parece que hay un fallo, por favor reintentalo!", "error");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });


});


//********  Inicio Pagina Mas ********//////

$(document).on('click', '#btn_mas', function (e) {
    $.mobile.changePage('#pageMas', {
        transition: "slide"
    });
});

$(document).on('pageshow', '#pageMas', function (e) {

    $("#overlayPanel9").niceScroll("#lista_menu9", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    verificarNotificacion("9");
    $('#nombreUsuario9').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick9').html(usuario.nick);
    $('#img_foto_usu9').attr('src', usuario.foto);

    $("#btn_open_panel9").on("click", function () {
        $("#overlayPanel9").panel("open");
    });
});



//********  Inicio Pagina Perfil ********//////
$(document).on('click', '#btn_mi_perfil', function (e) {
    $('.div_mas_foto_registro').remove();
    var datos = new Object();
    datos.accion = "verPerfil";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;

    var _url = url + '' + JSON.stringify(datos);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //            var ayudaNumFac, ayudaNumPaquete;
            if (data.flag == 'si') {
                $("#img_editar_perfil").attr("src", "" + data.perfil.foto);
                $("#img_editar_foto_ruc").attr("src", "" + data.perfil.fotoRuc);

                $("#editar_razon").val(data.perfil.razon);
                $("#editar_nickname").val(data.perfil.nick);
                $("#editar_ruc").val(data.perfil.ruc);
                $("#editar_direccion").val(data.perfil.direccion);
                $("#editar_telefono").val(data.perfil.telefono);
                $("#editar_identificacion").val(data.perfil.identificacion);
                $("#editar_email").val(data.perfil.email);


                //                var el = $('#select_editar_tipo_contribuyente');
                //                if (data.perfil.paquete == "" || data.perfil.paquete == null || data.perfil.paquete == undefined) {
                //                    ayudaNumPaquete = 0;
                //                    el.val(ayudaNumPaquete).attr('selected', true).siblings('option').removeAttr('selected');
                //                } else {
                //                    ayudaNumPaquete = parseInt(data.perfil.paquete) - 1;
                //                    el.val(ayudaNumPaquete).attr('selected', true).siblings('option').removeAttr('selected');
                //                }
                //                el.selectmenu();
                //                el.selectmenu("refresh", true);
                //
                //                if (data.perfil.paquete == "" || data.perfil.paquete == null || data.perfil.paquete == undefined) {
                //                    ayudaNumFac = 0;
                //                    document.getElementById('rangeTextEditar').innerHTML = 'Número Facturas: 5';
                //
                //                    $("#editar_numero_facturas").attr('data-slider-value', 5);
                //                } else {
                //                    ayudaNumFac = data.perfil.facturas;
                //                    document.getElementById('rangeTextEditar').innerHTML = 'Número Facturas: ' + data.perfil.facturas;
                //
                //                    $("#editar_numero_facturas").attr('data-slider-value', parseInt(data.perfil.facturas));
                //                }
                //
                //                paquetesPerfil(ayudaNumPaquete, ayudaNumFac);

                ////aayuda
                //                console.log(data.perfil.fotosRuc);
                nombre_image_arreglo = new Array();
                path_arreglo = new Array();
                $.each(data.perfil.fotosRuc, function (k, x) {
                    console.log("contador: " + k + " " + x);
                    contador_fotos = k;
                    downloadFile(x, k);
                    //                    if (getFileExtension1(x) == "pdf") {
                    //                        contador_fotos = k;
                    //                        generarFotoEditar(x, k);
                    //                        nombre_image_arreglo.push('rucRegistre' + k + '.pdf');
                    //                        path_arreglo.push(x);
                    //
                    //                    } else {
                    //                        downloadFile(x, k);
                    //                    }

                });

                $.mobile.changePage('#pagePerfil', {
                    transition: "slide"
                });
            } else {
                swal("", "Ups!! ha ocurrido un error, intente nuevamente", "error");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
});

var folderName = 'xyz';
var fileName;

function downloadFile(URL, k) {
    var uri = encodeURI(URL);
    //step to request a file system 
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

    function fileSystemSuccess(fileSystem) {
        var download_link = uri;
        fileName = download_link.substr(download_link.lastIndexOf('/') + 1); //Get filename of URL
        //        fileName = 'rucRegistre' + k + '.jpg';
        //        var filename = fileSystem.root.toURL() + folderName + "/" + uri.substr(uri.lastIndexOf("/") + 1);
        var directoryEntry = fileSystem.root; // to get root path of directory
        directoryEntry.getDirectory(folderName, {
            create: true,
            exclusive: false
        }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
        //        var rootdir = fileSystem.root;
        var fp = fileSystem.root.toURL(); // Returns Fullpath of local directory

        fp = fp + "/" + folderName + "/" + fileName; // fullpath and name of the file which we want to give
        // download function call
        filetransfer(download_link, fp, k);
    }

    function onDirectorySuccess(parent) {
        // Directory created successfuly
        //        console.log("parent: " + parent);
    }

    function onDirectoryFail(error) {
        //Error while creating directory
        //        console.log("Unable to create new directory: " + error.code);

    }

    function fileSystemFail(evt) {
        //Unable to access file system
        //        console.log(evt.target.error.code);
    }
}

function filetransfer(download_link, fp, id) {
    var fileTransfer = new FileTransfer();
    //    var ayuda = 'rucRegistre' + id + '.jpg';
    var ayuda = 'rucPerfil' + id + "." + getFileExtension1(download_link);
    //    console.log('download_link_ruc: ' + ayuda);
    // File download function with URL and local path
    fileTransfer.download(download_link, fp,
        function (entry) {
            contador_fotos = id;
            generarFotoEditar(fp, id);
            nombre_image_arreglo.push(ayuda);
            path_arreglo.push(fp);
            //            console.log("imagens: " + path_arreglo);

        },
        function (error) {
            //Download abort errors or download failed errors
            console.log("download error source " + error.source);
        }
    );
}

function paquetesPerfil(tipo_contribuyente, num_factura) {
    var datos = new Object();
    datos.accion = "paquetes";
    var _url = url + '' + JSON.stringify(datos);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //            data = JSON.parse(data);
            var item_paquete = '';
            var nota = "";
            $.each(data, function (i, v) {
                $.each(v, function (j, w) {
                    console.log("j: " + j);
                    if (j == tipo_contribuyente) {
                        item_paquete += '<div class="item active" style="border: 1px solid #f1f2f3 !important;">';
                        if (typeof w == "object") {
                            $.each(w, function (k, x) {
                                //console.log("   k: " + k);

                                if (k == "tipo") {
                                    item_paquete += '<div class="header-paquete" style="background-color:' + colors[j] + '">' + x + '</div>';
                                }
                                if (k == "nota") {
                                    item_paquete += '<div class="body-paquete">';
                                    item_paquete += '<p class="pading-top" style="color:' + colors[j] + '">' + x + '</p>';
                                }

                                if (k == "precios") {
                                    if (typeof x == "object") {
                                        $.each(x, function (l, y) {
                                            if (typeof y == "object") {
                                                var dolares = '';
                                                var centavos = '';
                                                var min = '';
                                                var mas = '';
                                                $.each(y, function (m, z) {
                                                    if (m == "min") {
                                                        min = z;
                                                    }
                                                    if (m == "mas") {
                                                        mas = z;
                                                    }
                                                    if (m == "valor") {
                                                        dolares = z;
                                                    }
                                                    if (m == "centavos") {
                                                        centavos = z;
                                                    }
                                                });
                                                //console.log("           min: " + min + " mas: " + mas);
                                                if (parseInt(num_factura) >= parseInt(min) && parseInt(num_factura) <= parseInt(mas)) {
                                                    //console.log("ACTIVADO " + dolares + " NUMERO FAC: " + num_factura);
                                                    item_paquete += '<div class="valor"><h1 id="Gratis" class="price" style="color:' + colors[j] + '"><span class="price-unit">$</span>' + dolares + '<span class="price-unit">' + centavos + '/mes</span></h1></div>';
                                                }
                                            }
                                        });
                                    }
                                }

                                if (k == "descripcion") {
                                    if (typeof x == "object") {
                                        $.each(x, function (l, y) {
                                            if (typeof y != "object") {
                                                item_paquete += '<label><span class="glyphicon glyphicon-asterisk" style="color:' + colors[j] + '"> </span> ' + y + '</label>';
                                            }
                                        });
                                    }
                                }
                                if (k == "pago") {
                                    item_paquete += '<p class="" style="color:' + colors[j] + '">' + x + '</p>';
                                }
                                if (k == "footer") {
                                    item_paquete += '<br>\
                                 <p class="" style="color:' + colors[j] + '">' + x + '</p>';
                                    item_paquete += '</div>';
                                }
                                if (k == "paq_id") {
                                    console.log("id_paquete: " + x);
                                    id_paquete = x;
                                }
                            });
                        }
                        item_paquete += '</div>';
                    }
                });
            });

            $('#editar_contenido_paquetes').html(item_paquete);
            $("#editar_contenido_paquetes").listview().listview('refresh');

        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

$(document).on('click', '#btn_enviar_datos_perfil', function (e) {
    if (document.getElementById("editar_razon").value == "" || document.getElementById("editar_nickname").value == "" || document.getElementById("editar_ruc").value == "" || document.getElementById("editar_direccion").value == "" ||
        document.getElementById("editar_telefono").value == "" || document.getElementById("editar_email").value == "" || document.getElementById("editar_identificacion").value == "") {
        swal("", "Debe llenar todos los campos", "error");
    } else if (validarEmail(document.getElementById("editar_email").value) == "false") {
        swal("", "La dirección de correo " + document.getElementById("editar_email").value + " es incorrecta.", "error");
        //            swal("", "Debe llenar todos los campos", "error");
    } else if (document.getElementById("editar_pass").value != document.getElementById("editar_repetirpass").value) {
        swal("", "Las contraseñas ingresadas no coinciden ", "error");
    } else {
        $.mobile.loading('show');
        for (i = 0; i < path_arreglo.length; i++) {
            if (path_arreglo[i] != undefined && path_arreglo[i] != "") {
                templstImg.push(path_arreglo[i]);
            }
            if (nombre_image_arreglo[i] != undefined && nombre_image_arreglo[i] != "") {
                tempname.push(nombre_image_arreglo[i]);
            }
        }

        console.log("ruc: " + templstImg + " user name: " + tempname);
        if (img_path_user != "") {
            console.log("upload user editar");
            uploadImageEditar(img_path_user, "user_editar", img_name_user);
        } else if (templstImg != "") {

            var img = templstImg.pop();
            var name = tempname.pop();
            //            console.log("upload ruc editar name: " + name);
            uploadImageEditar(img, "ruc_editar", name);


        } else {
            console.log("no hay imagenes");
            uploadDatoImagen();
        }
    }
});

function eliminarImagenEditar(path) {
    var datos = new Object();
    datos.accion = "eliminaFotoRuc";
    datos.url = path;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //            var datos = JSON.parse(data);
            if (data.flag == "si") {
                //                $('.verNotificacion' + numero).show();
            } else {
                //                $('.verNotificacion' + numero).hide();
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

$(document).on("pagecreate", "#pagePerfil", function () {
    // Without JQuery
    //    slider = new Slider("#editar_numero_facturas", {
    //        ticks: [5, 25, 50, 100, 200, 300, 500, 1000],
    //        ticks_labels: ['5', '25', '50', '100', '200', '300', '500', '1000'],
    //        ticks_positions: [0, 10, 20, 35, 45, 55, 75, 100],
    //        step: 5,
    //        min: 5
    //    });

});

$(document).on("pagebeforeshow", "#pagePerfil", function () {
    //    path_arreglo = new Array();
    //    nombre_image_arreglo = new Array();
    templstImg = new Array();
    name_arreglo_subir = new Array();
    tempname = new Array();
    //    contador_fotos = 0;
    //    $('.div_mas_foto_registro').remove();
});

$(document).on("pageshow", "#pagePerfil", function () {

    $('#editar_ruc').keyup(function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#editar_telefono').keyup(function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    //    $(document).on('change', "#select_editar_tipo_contribuyente", function (e) {
    //        paquetesPerfil($("#select_editar_tipo_contribuyente").val(), $("#editar_numero_facturas").val());
    //    });
    //
    //
    //
    //    slider.on('change', function (data) {
    //        document.getElementById('rangeTextEditar').innerHTML = 'Número Facturas: ' + data.newValue;
    //        paquetesPerfil($("#select_editar_tipo_contribuyente").val(), data.newValue);
    //    })

});

/*Validar Datos*/
function checkRucEditar(input) {
    //    console.log(validarPassword(document.getElementById("editar_ruc").value));
    if (input.value.length > 10 && input.value.length < 14) {
        $('#editar_error_ruc').addClass("hiden");
        $('input[id=editar_ruc]').parent().removeClass("has-error");
        $('input[id=editar_ruc]').parent().addClass("has-success");

    } else {
        console.log("no valio");
        $('#editar_error_ruc').removeClass("hiden");
        $('input[id=editar_ruc]').parent().removeClass("has-success");
        $('input[id=editar_ruc]').parent().addClass("has-error");
    }
}

function checkTelefonoEditar(input) {
    //    console.log(validarPassword(document.getElementById("editar_telefono").value));
    if (input.value.length > 7) {
        $('#editar_error_telefono').addClass("hiden");
        $('input[id=editar_telefono]').parent().removeClass("has-error");
        $('input[id=editar_telefono]').parent().addClass("has-success");

    } else {
        $('#editar_error_telefono').removeClass("hiden");
        $('input[id=editar_telefono]').parent().removeClass("has-success");
        $('input[id=editar_telefono]').parent().addClass("has-error");
    }
}

function checkEmailEditar(input) {
    //    console.log(validarPassword(document.getElementById("editar_email").value));
    if (!validarEmail(document.getElementById("editar_email").value)) {
        $('#editar_error_email').removeClass("hiden");
        $('input[id=editar_email]').parent().removeClass("has-success");
        $('input[id=editar_email]').parent().addClass("has-error");
    } else {
        $('#editar_error_email').addClass("hiden");
        $('input[id=editar_email]').parent().removeClass("has-error");
        $('input[id=editar_email]').parent().addClass("has-success");
    }
}

function checkPassEditar(input) {
    //    console.log(validarPassword(document.getElementById("editar_passRegistro").value));
    if (!validarPassword(document.getElementById("editar_pass").value)) {
        $('#editar_error_pass').removeClass("hiden");
        $('input[id=editar_passRegistro]').parent().removeClass("has-success");
        $('input[id=editar_passRegistro]').parent().addClass("has-error");
    } else {
        console.log("valio");
        $('#editar_error_pass').addClass("hiden");
        $('input[id=editar_passRegistro]').parent().removeClass("has-error");
        $('input[id=editar_passRegistro]').parent().addClass("has-success");
    }
}

function checkRepetirPassEditar(input) {
    //    console.log(validarPassword(document.getElementById("editar_repetirpass").value));
    if (document.getElementById("editar_pass").value != document.getElementById("editar_repetirpass").value) {
        console.log("no valio");
        $('#editar_error_repetir_pass').removeClass("hiden");
        $('input[id=editar_repetirpass]').parent().removeClass("has-success");
        $('input[id=editar_repetirpass]').parent().addClass("has-error");
    } else {
        console.log("valio");
        $('#editar_error_repetir_pass').addClass("hiden");
        $('input[id=editar_repetirpass]').parent().removeClass("has-error");
        $('input[id=editar_repetirpass]').parent().addClass("has-success");
    }
}


function openAlertUserEditar() {
    $("#myModalImagenEditar").modal('show');
    tipo_eleccion = "user_editar";
    id_tipo_elecion = "img_editar_perfil";
}

function openAlertRucEditar() {
    $("#myModalImagenEditar").modal('show');
    tipo_eleccion = "ruc_editar";
    id_tipo_elecion = "img_editar_foto_ruc";
}

$(document).on("click touchstart", "#btn_camara_registre_editar", function () {
    openCameraEditar(id_tipo_elecion, tipo_eleccion);
    $('#myModalImagenEditar').modal('hide');

});

$(document).on("click touchstart", "#btn_galeria_registre_editar", function () {
    console.log("tipo galeria: " + tipo_eleccion);
    openGaleriaEditar(pictureSource.PHOTOLIBRARY, id_tipo_elecion, tipo_eleccion);
    $('#myModalImagenEditar').modal('hide');
});

function generarFotoEditar(path, id) {
    var ayuda_path = "";
    if (getFileExtension1(path) == "pdf") {
        ayuda_path = "img/pdf.png";
    } else {
        ayuda_path = path;
    }


    $('.foto-mas-editar:last').before('<div class="div_mas_foto_registro" id="' + id + '" ><img src="img/eliminar.png" alt="" id="' + id + '" class="editar_foto_ruc_eliminar" ><img src="' + ayuda_path + '" alt="" class="foto_ruc verpdf" url="' + path + '"></div>');
}

$(document).on('touchstart', '.editar_foto_ruc_eliminar', function () {

    var id = $(this).attr("id");
    console.log("imagen a eliminar: " + id + "  " + path_arreglo[id] + "  " + nombre_image_arreglo[id]);
    delete path_arreglo[id];
    delete nombre_image_arreglo[id];
    var ayuda = $(this).parent();

    setTimeout(function () {
        ayuda.remove();
    }, 500);




});

$(document).on('touchstart', '.verpdf', function () {
    var url = $(this).attr("url");
    var ref = cordova.InAppBrowser.open(url, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
});

function openCameraEditar(id, tipo) {
    $.mobile.loading('show');
    navigator.camera.getPicture(onSuccess, failRegistre, {
        quality: 30,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 1000,
        targetHeight: 1200,
        popoverOptions: CameraPopoverOptions,
        allowEdit: true,
        correctOrientation: true

    });

    function onSuccess(imageURI) {
        if (tipo == "user_editar") {
            img_name_user = 'useRegistre.jpg';
            $('#' + id).attr('src', imageURI);
        } else if (tipo == "ruc_editar") {
            contador_fotos++;
            nombre_image_arreglo.push('rucPerfil' + contador_fotos + '.jpg');
            generarFotoEditar(imageURI, contador_fotos);
            path_arreglo.push(imageURI);

            //        uploadImageEditar(imageURI, id, tipo);
            $.mobile.loading('hide');
        }

        function onFail(message) {
            if (tipo == "user_editar") {
                img_path_user = "";
            } else if (tipo == "ruc_editar") {
                img_path_ruc = "";
            }

            $.mobile.loading('hide');
        }
        $('#myModalImagenEditar').modal('hide');
    }
}

function openGaleriaEditar(source, id, tipo) {
    $.mobile.loading('show');
    navigator.camera.getPicture(
        function onSuccessCam(imageURI) {

            if (tipo == "user_editar") {
                $('#' + id).attr('src', imageURI);
                img_name_user = 'useRegistre.jpg';
                img_path_user = imageURI;
            } else if (tipo == "ruc_editar") {
                //                    img_name_ruc = 'rucRegistre.jpg';
                contador_fotos++;
                nombre_image_arreglo.push('rucPerfil' + contador_fotos + '.jpg');
                generarFotoEditar(imageURI, contador_fotos);
                path_arreglo.push(imageURI);


            }
            //                uploadImageEditar(imageURI, id, tipo);
            $.mobile.loading('hide');
        },
        function onFailCamera() {
            if (tipo = "user_editar") {
                img_path_user = "";
            } else if (tipo = "ruc_editar") {
                img_path_ruc = "";
            }

            $.mobile.loading('hide');
        }, {
            quality: 30,
            destinationType: destinationType.FILE_URI,
            sourceType: source,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 1200,
            targetHeight: 1200,
            correctOrientation: true,
            popoverOptions: CameraPopoverOptions
        });
    $('#myModalImagenEditar').modal('hide');
}

function uploadImageEditar(pathImage, tipo, nombre) {
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.mimeType = "image";
    var params = new Object();
    params.type = "image";

    options.params = params;
    options.chunkedMode = false;

    if (tipo == "user_editar") {
        console.log(img_name_user);
        options.fileName = img_name_user;
    } else if (tipo == "ruc_editar") {
        console.log("ruc_nombre_Paca" + nombre);
        options.fileName = nombre;
    }

    var uri = encodeURI("http://contapp.com.ec/nueva/ws/upload.php");
    var win = makeSuccessCallbackEditar(tipo);

    var ft = new FileTransfer();
    if (nombre) {

    }
    ft.upload(pathImage, uri, win, failRegistre, options);
}

function makeSuccessCallbackEditar(parameters) {
    console.log("Success with parameters: " + parameters);
    return function successCallback(r) {

        var obj = JSON.parse(r.response);
        //        console.log("aca: " + obj.rec);
        if (parameters == "user_editar") {
            $.each(obj, function (i, v) {
                if (i == "img") {
                    console.log("img_name_user: " + v);
                    img_name_user = v;
                }
            });
            if (obj.flag == "si") {
                if (templstImg.length == 0) {
                    for (i = 0; i < name_arreglo_subir.length; i++) {
                        if (i == 0) {
                            img_name_ruc += name_arreglo_subir[i];
                        } else {
                            img_name_ruc += "," + name_arreglo_subir[i];
                        }
                    }
                    uploadDatoImagen();
                } else if (templstImg != "") {
                    var img = templstImg.pop();
                    var name = tempname.pop();
                    uploadImageEditar(img, "ruc_editar", name);
                } else {
                    uploadDatoImagen();
                    console.log("subir datos user");
                }
            }
        } else if (parameters == "ruc_editar") {

            if (obj.flag == "si") {
                $.each(obj, function (i, v) {
                    if (i == "img") {
                        name_arreglo_subir.push(v);
                        console.log("nombre: " + v);
                    }
                });

                if (templstImg.length == 0) {
                    for (i = 0; i < name_arreglo_subir.length; i++) {
                        if (i == 0) {
                            img_name_ruc += name_arreglo_subir[i];
                        } else {
                            img_name_ruc += "," + name_arreglo_subir[i];
                        }
                    }
                    uploadDatoImagen();
                } else if (templstImg != "") {
                    var img = templstImg.pop();
                    var name = tempname.pop();
                    uploadImageEditar(img, "ruc_editar", name);
                } else {
                    uploadDatoImagen();
                    console.log("subir datos user");
                }
                //                console.log("imagen editar ruc" + name_arreglo_subir + " flag" + obj.flag + " tam: " + templstImg.length);

                //                if (templstImg.length == 0) {
                //                    for (i = 0; i < name_arreglo_subir.length; i++) {
                //                        if (i == 0) {
                //                            img_name_ruc += name_arreglo_subir[i];
                //                        } else {
                //                            img_name_ruc += " ," + name_arreglo_subir[i];
                //                        }
                //                    }
                //                    uploadDatoImagen();
                //                } else {
                //                    var img = templstImg.pop();
                //                    var name = tempname.pop();
                //                    uploadImageEditar(img, "ruc_editar", name);
                //                }
                //                } else {
                //                    uploadDatoImagen();
                //                }



                //                console.log("path img: " + img_name_ruc);


            }
        }

        //        var obj = JSON.parse(r.response);
        //        if (obj.flag == "si") {
        //
        //            $.each(obj, function (i, v) {
        //                // console.log("i: " + i + " nombre_img: " + v);
        //                if (i == "img") {
        //                    img_name_user = v;
        //                }
        //            });
        //            if (parameters == "user_editar") {
        //                uploadDatoImagen("cambiarFotoUser", img_name_user, id, parameters);
        //            } else if (parameters == "ruc_editar") {
        //                uploadDatoImagen("cambiarFotoRuc", img_name_user, id, parameters);
        //            }
        //
        //        }
    }
}

function failRegistre(error) {
    $.mobile.loading('hide');
    console.log("error: " + error);
}

function fileExists(path) {
    try {
        return fs.statSync(path).isFile();
    } catch (e) {
        return false;
    }
}

function uploadDatoImagen() {
    var datos = new Object();
    datos.accion = "actualizaPerfil";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    datos.razon = document.getElementById("editar_razon").value;
    datos.nick = document.getElementById("editar_nickname").value;
    datos.ruc = document.getElementById("editar_ruc").value;
    datos.direccion = document.getElementById("editar_direccion").value;
    datos.telefono = document.getElementById("editar_telefono").value;
    datos.email = document.getElementById("editar_email").value;
    datos.pass = document.getElementById("editar_pass").value;
    datos.identificacion = document.getElementById("editar_identificacion").value;
    datos.foto = img_name_user;
    datos.fotoruc = "";
    datos.fotosruc = img_name_ruc;
    //    datos.facturas = $("#editar_numero_facturas ").val();
    //    datos.paquete = id_paquete;

    var _url = url + '' + JSON.stringify(datos);
    console.log("url: " + _url);
    $.ajax({
        type: "POST",
        url: _url,
        dataType: 'json',
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //                swal("", data.flag + " error", "error");
            if (data.flag == 'si') {
                swal("ContApp", "Los datos han sido editados correctamente", "success");

                usuario.razon = document.getElementById("editar_razon").value;
                usuario.nick = document.getElementById("editar_nickname").value;
                usuario.ruc = document.getElementById("editar_ruc").value;
                usuario.email = document.getElementById("editar_email").value;
                usuario.direccion = document.getElementById("editar_direccion").value;
                usuario.telefono = document.getElementById("editar_telefono").value;

                if (document.getElementById("editar_pass").value != "") {
                    usuario.pass = document.getElementById("editar_pass").value;
                    $("#editar_pass").val("");
                    $("#editar_repetirpass").val("");
                }

                if (usuario.guardame == "si") {
                    localStorage.setItem("Usuario", JSON.stringify(usuario));
                }

                img_name_ruc = "";
                $.mobile.changePage("#pageMas", {
                    transition: "slide",
                    reverse: true
                });

            } else {
                img_name_ruc = "";
                swal("", "Ups!! ha ocurrido un error, intente nuevamente", "error");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });

}

function uploadDatoImagen1(nombre_img, id, tipo) {
    var datos = new Object();
    datos.accion = "actualizaPerfil";
    datos.idUser = usuario.id;
    datos.imagen = nombre_img;
    datos.empleado = usuario.empleado;

    var _url = url + '' + JSON.stringify(datos);
    console.log("subir foto Url: " + _url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //                var data = JSON.parse(data);
            if (data.flag == 'si') {
                var ayuda = data.imagenUser.split("..");

                if (tipo == "user_editar") {
                    usuario.foto = "http://contapp.com.ec/nueva" + ayuda[1];
                    $('#' + id).attr('src', usuario.foto);
                    if (usuario.guardame == "si") {
                        localStorage.setItem("Usuario", JSON.stringify(usuario));
                    }
                } else if (tipo == "ruc_editar") {
                    $('#' + id).attr('src', "http://contapp.com.ec/nueva" + ayuda[1]);

                }




            } else {
                swal("", data.message, "error");
                //                    alert(data.message);
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}




///***** Pagiuna Video *****//////

$(document).on('click', '#btn_video', function (e) {
    var datos = new Object();
    datos.accion = "video";
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {
            //            var datos = JSON.parse(data);
            if (datos.flag == "si") {
                console.log("url video: " + data.url);
                var ref = cordova.InAppBrowser.open(data.url, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
            } else {
                swal("", "Módulo no disponible", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
});


//********  Inicio Pagina Ayuda ********//////

$(document).on('click', '#btn_ayuda', function (e) {
    $.mobile.changePage('#pageAyuda', {
        transition: "slide"
    });
});

$(document).on('click', '#btn_enviar_ayuda', function (e) {
    var datos = new Object();
    datos.accion = "ayuda";
    datos.nombre = usuario.email;
    datos.ayuda = document.getElementById("text_ayuda").value;

    if (datos.ayuda == "") {
        swal("", "Escribe algún comentario", "error");
    } else {
        var _url = url + '' + JSON.stringify(datos);
        console.log("url ayuda: " + _url);
        $.ajax({
            type: "POST",
            url: _url,
            dataType: 'json',
            beforeSend: function () {
                $.mobile.loading('show');
            },
            complete: function () {
                $.mobile.loading('hide');
            },
            success: function (data) {
                //                swal("", data.flag + " error", "error");
                if (data.flag == 'si') {
                    swal("ContApp", "El comentario ha sido enviado correctamente", "success");
                    $("#text_ayuda").val("");

                } else {
                    swal("", "Ups!! ha ocurrido un error, intente nuevamente", "error");
                }
            },
            error: function () {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                swal("", msg, "error");
            }
        });
    }
});

$(document).on('click', '#btn_politicas', function (e) {
    var ref = cordova.InAppBrowser.open("http://contapp.com.ec/politicasprivacidad.php", '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
    //    swal("", "Módulo no disponible", "");
});


//********  Inicio Pagina Notificaciones ********//////

$(document).on('click', '#btn_notificaciones', function (e) {
    $.mobile.changePage('#pageNotificaciones', {
        transition: "slide"
    });


});

$(document).on('pageshow', '#pageNotificaciones', function (e) {
    listaNotificaciones();

    $("#overlayPanel7").niceScroll("#lista_menu7", {
        cursorcolor: "rgb(166, 164, 164)",
        autohidemode: false,
        cursoropacitymax: 0.1,
        touchbehavior: true
    });

    verificarNotificacion("7");
    $('#nombreUsuario7').html('<b>' + usuario.razon + '</b>');
    $('#nombreNick7').html(usuario.nick);
    $('#img_foto_usu7').attr('src', usuario.foto);

    $("#btn_open_panel7").on("click", function () {
        $("#overlayPanel7").panel("open");
    });
});

function listaNotificaciones() {
    var datos = new Object();
    datos.accion = "leerNotificaciones";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            //            var datos = JSON.parse(data);
            lista_notificaciones = '';
            var fe_not = '';
            //            alert(datos.flag);
            if (datos.flag == 'si') {
                $.each(datos.notificacion, function (i, v) {
                    fe_not = v.not_fecha.split(' ');

                    if (v.not_leido == '0') {
                        lista_notificaciones += '<li><a href="" class="notificacione" id="' + v.not_id + '" titulo="' + v.not_titulo + '" descripcion="' + v.not_descripcion + '" fecha="' + fe_not[0] + '"><img src="img/notificacion_nueva_lista.png" alt="notificacione" class="ui-li-icon"><span class="fechaNot">' + fe_not[0] + '</span><br>' + v.not_titulo + '</a></li>';
                    } else {
                        lista_notificaciones += '<li><a href="" class="notificacione" id="' + v.not_id + '" titulo="' + v.not_titulo + '" descripcion="' + v.not_descripcion + '" fecha="' + fe_not[0] + '"><img src="img/notificacion.png" alt="notificacion" class="ui-li-icon"><span class="fechaNot">' + fe_not[0] + '</span><br>' + v.not_titulo + '</a></li>';
                    }

                });

                $("#lista_notificaciones").html(lista_notificaciones);
                $("#lista_notificaciones").listview().listview('refresh');

            } else if (datos.flag == "no") {
                $("#lista_notificaciones").html(lista_notificaciones);
                $("#lista_notificaciones").listview().listview('refresh');
                swal("", "No existe notificaciones que mostrar", "");
            } else {
                $("#lista_notificaciones").html(lista_notificaciones);
                $("#lista_notificaciones").listview().listview('refresh');
                swal("", "Hubo algún problema, intente nuevamente", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });
}

$(document).on('click ', '.notificacione', function (e) {
    var id_notificacion = $(this).attr('id');
    var titulo_notificacion = $(this).attr('titulo');
    var descripcion_notificacion = $(this).attr('descripcion');
    var fecha_notificacion = $(this).attr('fecha');

    //    fecha_notificacion = fecha_notificacion.split(' ');

    $('#titulo_notificacion').html(titulo_notificacion);
    $('#fecha_notificacion').html(fecha_notificacion);
    $('#detalle_notificacion').html(descripcion_notificacion);
    $("#contenido_notificacion").listview().listview('refresh');
    notificacionLeida(id_notificacion);
    $.mobile.changePage('#pageDetalleNotificaciones', {
        transition: "slide"
    });

});

function notificacionLeida(id) {
    var datos = new Object();
    datos.accion = "notificacionLeida";
    datos.idNotificacion = id;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (data) {

        },
        error: function () {
            //            swal("", "Falló la conexión con el servidor, intentelo nuevamente", "error");
        }
    });
}

function registrarToken(token_id, id) {
    var datos = new Object();
    datos.accion = "enviarToken";
    datos.idUser = id;
    datos.token = token_id;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    //    console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        success: function (data) {
            //            var data = JSON.parse(data);
            console.log("registro T: " + data.flag);
        },
        error: function () {
            //            swal("", "Falló la conexión con el servidor, intentelo nuevamente", "error");
        }
    });
}

function quitarToken(token_id) {
    var datos = new Object();
    datos.accion = "logOut";
    //    datos.idUser = id;
    datos.token = token_id;
    var _url = url + '' + JSON.stringify(datos);
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        success: function (data) {
            var data = JSON.parse(data);
            console.log("deslogeo Token: " + data.flag);
            //            if (data.flag == "si") {}
        },
        error: function () {}
    });
}

function verificarNotificacion(numero) {
    var datos = new Object();
    datos.accion = "nuevasNotificaciones";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        async: true,
        success: function (data) {
            //            var datos = JSON.parse(data);
            if (data.flag == "si") {
                $('.verNotificacion' + numero).show();
            } else {
                $('.verNotificacion' + numero).hide();
            }
        },
        error: function () {
            //            swal("", "Falló la conexión con el servidor, intentelo nuevamente", "error");
        }
    });
}

$(document).on('click', '#btn-terminar-subida-fotos', function (e) {
    $("#myModalSubirFacturas").modal();
});

$(document).on('click', '#btn_modal_aceptar_termino', function (e) {
    var datos = new Object();
    datos.accion = "finMes";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    datos.mes = $("#meses_modal_meses_subida").val();
    var _url = url + '' + JSON.stringify(datos);
    console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            if (datos.flag == 'si') {
                swal("", "Ha conluido en el mes " + $("#meses_modal_meses_subida option:selected").text(), "");
            } else {
                swal("", "Hubo algún problema, intente nuevamente", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });

});



//Inicio Pagina Boton de Pago
$(document).on('click', '#btn_de_pago', function (e) {
    var datos = new Object();
    datos.accion = "pago";
    datos.idUser = usuario.id;
    datos.empleado = usuario.empleado;
    var _url = url + '' + JSON.stringify(datos);
    // console.log(_url);
    $.ajax({
        type: "POST",
        url: _url,
        beforeSend: function () {
            $.mobile.loading('show');
        },
        complete: function () {
            $.mobile.loading('hide');
        },
        success: function (datos) {
            if (datos.flag == 'si') {
                //var ref = cordova.InAppBrowser.open(datos.url, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
                //var ref = cordova.InAppBrowser.open(datos.url, '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
                var ref = window.open(encodeURI(datos.url), '_system', 'location=yes');
            } else if (datos.flag == "no") {
                swal("", "Este mes ya ha realizado el pago", "");
            } else {
                swal("", "Hubo algún problema, intente nuevamente", "");
            }
        },
        error: function () {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            swal("", msg, "error");
        }
    });

});




//Boton de Facturacion electronica
$(document).on('click', '#btn_facturacion', function (e) {

    //var ref = cordova.InAppBrowser.open("https://app.datil.co/login", '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
    var ref = window.open(encodeURI('https://app.datil.co/login'), '_system', 'location=yes');

});

//Boton de Sistema Contable
$(document).on('click', '#btn_sistema', function (e) {

    //var ref = cordova.InAppBrowser.open("http://www.dora.ec/tucontadora/login.php", '_blank', 'toolbarposition=top,location=no,enableviewportscale=yes,closebuttoncaption= Atras');
    var ref = window.open(encodeURI('http://www.dora.ec/tucontadora/login.php'), '_system', 'location=yes');

});


//botones para regresar

$(document).on('touchstart', '#btn_menu', function (e) {
    $.mobile.changePage("#pageMenu", {
        transition: "slide",
        reverse: false
    });

});

$(document).on('touchstart', '#btn_regresar_menu', function (e) {
    setTimeout(function () {
        $.mobile.changePage("#pageMenu", {
            transition: "slide",
            reverse: true
        });
    }, 300);

});

$(document).on('touchstart', '#btn_regresar_login', function (e) {
    $.mobile.changePage("#pageLogin", {
        transition: "slide",
        reverse: true
    });
});

$(document).on('click', '#btn_logout', function (e) {
    $("#myModalLogout").modal();
});

$(document).on('click', '#btn_modal_logout', function (e) {
    usuario = "";
    $('#name').val('');
    $('#pass').val('');
    $.mobile.changePage("#pageLogin", {
        transition: "slide",
        reverse: true
    });

    localStorage.removeItem("Usuario");
    quitarToken(nuevo_token);
    $('#btn_modal_logout').modal('hide');
});

$(document).on('touchstart', '#btn-regresar-notificacion', function (e) {

    setTimeout(function () {
        $.mobile.changePage("#pageNotificaciones", {
            transition: "slide",
            reverse: true
        });
    }, 300);
});

$(document).on('touchstart', '#btn-regresar-estado-cuenta', function (e) {
    setTimeout(function () {
        $.mobile.changePage("#pageEstadoCuenta", {
            transition: "slide",
            reverse: true
        });
    }, 300);

});

$(document).on('touchstart', '#btn-regresar-mas', function (e) {
    setTimeout(function () {
        $.mobile.changePage("#pageMas", {
            transition: "slide",
            reverse: true
        });
    }, 300);

});
