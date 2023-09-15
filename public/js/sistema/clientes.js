//------------------------------------------------------------------------------
function bloqueoAjax() {
    $.blockUI(
        {
            message: $('#msgBloqueo'),
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .85,
                color: '#fff',
                'z-index': 10000000
            }
        }
    );
    $('.blockOverlay').attr('style', $('.blockOverlay').attr('style') + 'z-index: 1100 !important');
}

//------------------------------------------------------------------------------

function verRegistrar() {
    $.ajax({
        url: "registrar",
        dataType: "html",
        data: {},
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Registro de un Nuevo Cliente');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verDetalle(idCliente) {
    $.ajax({
        url: "detalle",
        dataType: "html",
        data: {
            idCliente: idCliente
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Detalle del Cliente');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEditar(idCliente) {
    $.ajax({
        url: "editar",
        dataType: "html",
        data: {
            idCliente: idCliente
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Actualizacion de Cliente');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function validarRegistrar(e, formulario) {
    e.preventDefault();
    if ($("#direccion").val() == '') {
        Swal.fire("DEBES PONER UNA DIRECCION", "JOSANDRO", "error");
        return false;
    } {
        if ($.trim($("#digitoverificacion").val()).length === 0) {
            $("#identificacion").val('');
            $("#identificacion").focus();
            Swal.fire({
                icon: 'error',
                title: 'DIGITO DE VERIFICACION INCORRECTO',
                html: 'Se ha presentado un inconveniente, no fue posible calcular el digito de verificacion'
                    + '<br>Por favor digite la identificacion nuevamente'
                    + '<br>Si el inconveniente persiste, por favor, actualice la pagina'
            });
            return false;
        }
        let msgHtml = '';
        if ($("#tipocliente").val() === 'Persona Natural') {
            msgHtml = '<b>NOMBRES</b>: ' + $.trim($("#nombre1").val().toUpperCase() + ' ' + $("#nombre2").val().toUpperCase()) + '<br>'
                + '<b>APELLIDOS</b>: ' + $.trim($("#apellido1").val().toUpperCase() + ' ' + $("#apellido2").val().toUpperCase()) + '<br>'
                + '<b>IDENTIFICACION:</b> ' + $("#identificacion").val() + '<br>';
        } else {
            msgHtml = '<b>RAZON SOCIAL</b>: ' + $.trim($("#razonsocial").val().toUpperCase())
                + '<b>IDENTIFICACION:</b> ' + $("#identificacion").val() + '<br>';
        }
        Swal.fire({
            title: "&iquest;DESEA REGISTRAR ESTE CLIENTE?",
            html: msgHtml,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                formulario.removeAttribute('onsubmit');
                $(".sinDiacriticos").each(function () {
                    eliminarDiacriticos(this);
                });
                formulario.submit();
                bloqueoAjax();
            }
        });
    }
}

//------------------------------------------------------------------------------

function validarEditar(e, formulario) {
    e.preventDefault();
    if ($.trim($("#digitoverificacion").val()).length === 0) {
        $("#identificacion").val('');
        $("#identificacion").focus();
        Swal.fire({
            icon: 'error',
            title: 'DIGITO DE VERIFICACION INCORRECTO',
            html: 'Se ha presentado un inconveniente, no fue posible calcular el digito de verificacion'
                + '<br>Por favor digite la identificacion nuevamente'
                + '<br>Si el inconveniente persiste, por favor, actualice la pagina'
        });
        return false;
    }
    let msgHtml = '';
    if ($("#tipocliente").val() === 'Persona Natural') {
        msgHtml = '<b>NOMBRES</b>: ' + $.trim($("#nombre1").val().toUpperCase() + ' ' + $("#nombre2").val().toUpperCase()) + '<br>'
            + '<b>APELLIDOS</b>: ' + $.trim($("#apellido1").val().toUpperCase() + ' ' + $("#apellido2").val().toUpperCase()) + '<br>'
            + '<b>IDENTIFICACION:</b> ' + $("#identificacion").val() + '<br>';
    } else {
        msgHtml = '<b>RAZON SOCIAL</b>: ' + $.trim($("#razonsocial").val().toUpperCase()) + '<br>'
            + '<b>IDENTIFICACION:</b> ' + $("#identificacion").val() + '<br>';
    }
    Swal.fire({
        title: "&iquest;DESEA GUARDAR LOS CAMBIOS REALIZADOS A ESTE CLIENTE?",
        html: msgHtml,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            $(".sinDiacriticos").each(function () {
                eliminarDiacriticos(this);
            });
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------

function setTipoCliente(tipo) {
    $("#nombre1").val('');
    $("#nombre2").val('');
    $("#apellido1").val('');
    $("#apellido2").val('');
    $("#razonsocial").val('');
    $("#representantelegal").val('');
    $("#identireprelegal").val('');
    if (tipo === 'Persona Natural') {
        $("#razonsocial").val('_NA_');
        $("#representantelegal").val('_NA_');
        $("#identireprelegal").val(0);
        $("#divInfoEmpresa").hide();
        $("#divInfoPersona").show('slow');
    } else {
        $("#nombre1").val('_NA_');
        $("#nombre2").val('_NA_');
        $("#apellido1").val('_NA_');
        $("#apellido2").val('_NA_');
        $("#divInfoPersona").hide();
        $("#divInfoEmpresa").show('slow');
    }
}

//------------------------------------------------------------------------------

function existeIdentificacion() {
    $("#digitoverificacion").val('');
    let identificacion = $.trim($("#identificacion").val());
    let tipoidentificacion = $("#tipoidentificacion").val();
    if (tipoidentificacion === '') {
        $("#identificacion").val('');
        $("#tipoidentificacion").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR SELECCIONE UN TIPO DE IDENTIFICACION',
            html: 'Para proceder con la validacion de la identificacion es necesario saber el tipo de identificacion'
        });
        return;
    }
    if (tipoidentificacion === 'Cedula') {
        if (identificacion.length > 10) {
            $("#identificacion").val('');
            $("#identificacion").focus();
            Swal.fire({
                icon: 'warning',
                title: 'FORMATO DE CEDULA INCORRECTO',
                html: 'La cedula <b>NO</b> puede tener mas de 10 digitos'
                    + '<br><b>Cedula Digitada:</b> ' + identificacion
            });
            return;
        }
    }
    if (tipoidentificacion === 'NIT') {
        if (identificacion.length !== 9) {
            $("#identificacion").val('');
            $("#identificacion").focus();
            Swal.fire({
                icon: 'warning',
                title: 'FORMATO DE NIT INCORRECTO',
                html: 'El NIT debe tener <b>exactamente</b> 9 digitos'
                    + '<br><b>NIT Digitado:</b> ' + identificacion
            });
            return;
        }
    }
    if ($.trim($("#identificacion").val()).length > 0) {
        if ($("#identificacionOLD").length > 0) {
            if (parseInt($.trim($("#identificacionOLD").val())) === parseInt(identificacion)) {
                let digitoVerificacion = calcularDigitoVerificacion(identificacion);
                if (digitoVerificacion !== '') {
                    $("#digitoverificacion").val(digitoVerificacion);
                } else {
                    $("#identificacion").val('');
                    $("#identificacion").focus();
                    Swal.fire({
                        icon: 'error',
                        title: 'DIGITO DE VERIFICACION INCORRECTO',
                        html: 'Se ha presentado un inconveniente, no fue posible calcular el digito de verificacion'
                            + '<br>Por favor digite la identificacion nuevamente'
                            + '<br>Si el inconveniente persiste, por favor, actualice la pagina'
                    });
                }
                return;
            }
        }
        $.ajax({
            url: "existeidentificacion",
            dataType: "json",
            data: { identificacion: identificacion },
            success: function (datos) {
                if (parseInt(datos['error']) === 0) {
                    if (parseInt(datos['existe']) === 1) {
                        $("#identificacion").val('');
                        $("#identificacion").focus();
                        Swal.fire({
                            icon: 'error',
                            title: 'IDENTIFICACION ENCONTRADA',
                            html: 'La identificacion <b>' + identificacion + '</b> ya se encuentra registrada en el sistema'
                        });
                    } else {
                        let digitoVerificacion = calcularDigitoVerificacion(identificacion);
                        if (digitoVerificacion !== '') {
                            $("#digitoverificacion").val(digitoVerificacion);
                        } else {
                            $("#identificacion").val('');
                            $("#identificacion").focus();
                            Swal.fire({
                                icon: 'error',
                                title: 'DIGITO DE VERIFICACION INCORRECTO',
                                html: 'Se ha presentado un inconveniente, no fue posible calcular el digito de verificacion'
                                    + '<br>Por favor digite la identificacion nuevamente'
                                    + '<br>Si el inconveniente persiste, por favor, actualice la pagina'
                            });
                        }
                    }
                } else {

                }
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------

function calcularDigitoVerificacion(myNit) {
    var vpri, x, y, z;
    // Se limpia el Nit
    myNit = myNit.replace(/\s/g, ""); // Espacios
    myNit = myNit.replace(/,/g, ""); // Comas
    myNit = myNit.replace(/\./g, ""); // Puntos
    myNit = myNit.replace(/-/g, ""); // Guiones
    // Se valida el nit
    if (isNaN(myNit)) {
        console.log("LA IDENTIFICACION '" + myNit + "' NO ES VALIDA.");
        return '';
    }
    // Procedimiento
    vpri = new Array(16);
    z = myNit.length;
    vpri[1] = 3;
    vpri[2] = 7;
    vpri[3] = 13;
    vpri[4] = 17;
    vpri[5] = 19;
    vpri[6] = 23;
    vpri[7] = 29;
    vpri[8] = 37;
    vpri[9] = 41;
    vpri[10] = 43;
    vpri[11] = 47;
    vpri[12] = 53;
    vpri[13] = 59;
    vpri[14] = 67;
    vpri[15] = 71;
    x = 0;
    y = 0;
    for (var i = 0; i < z; i++) {
        y = (myNit.substr(i, 1));
        // console.log ( y + "x" + vpri[z-i] + ":" ) ;
        x += (y * vpri[z - i]);
        // console.log ( x ) ;    
    }
    y = x % 11;
    // console.log ( y ) ;
    return (y > 1) ? 11 - y : y;
}

//------------------------------------------------------------------------------

function eliminarDiacriticos(campo) {
    let resp = campo.value.normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1").normalize();
    campo.value = resp.replace("'", '');
}

//------------------------------------------------------------------------------

function validarCelular(campo) {
    let numCelular = $.trim(campo.value);
    if (numCelular.length !== 10) {
        campo.value = '';
        $(campo).focus();
        Swal.fire({
            icon: 'error',
            title: 'NUMERO DE CELULAR INCORRECTO',
            html: 'El numero de celular debe tener <b>exactamente</b> 10 digitos'
                + '<br><b>Celular Digitado:</b> ' + numCelular
        });

    }
}

//------------------------------------------------------------------------------

function getMunicipios() {
    $("#idMunicipio").html('<option value="">Seleccione...</option>');
    if ($("#idDepartamento").val() !== '') {
        $.ajax({
            url: "getMunicipios",
            dataType: "html",
            data: {
                idDepartamento: $("#idDepartamento").val()
            },
            success: function (html) {
                $("#idMunicipio").html(html);
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------

function getBarrios() {
    $("#idBarrio").html('<option value="">Seleccione...</option>');
    if ($("#idMunicipio").val() !== '') {
        $.ajax({
            url: "getBarrios",
            dataType: "html",
            data: {
                idMunicipio: $("#idMunicipio").val()
            },
            success: function (html) {
                $("#idBarrio").html(html);
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------
function limpiarFormBusq() {
    let cont = 0;
    $("#formBusqueda input").each(function () {
        $(this).val('');
        cont++;
    });
}
function ponerDireccion() {
    $.get('ponerdireccion', {}, setFormulario);
    bloqueoAjax();
}

function setFormulario(datos) {
    $("#divContenido2").html(datos);
    $('#modalFormulario2').modal('show');
}
//------------------------------------------------------------------------------
function validarPonerDireccion() {
    if ($("#txtDireccion").val() == "") {
        Swal.fire("DEBES PONER UNA DIRECCION", "JOSANDRO", "error");
        return false;
    } else {
        $("#direccion").val($("#txtDireccion").val());
        $('#modalFormulario2').modal('hide');
    }

}
//------------------------------------------------------------------------------
function verEliminar(idCliente) {
    $.get('eliminar', { idCliente: idCliente }, setFormulario);
    bloqueoAjax();
}
//------------------------------------------------------------------------------
function validarEliminar(e, formulario) {
    e.preventDefault();
    Swal.fire({
        title: "&iquest;DESEA ELIMINAR ESTE CLIENTE?",
        html: '<span style="color: red">Por favor verifique antes de proceder.</span>',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            $(".sinDiacriticos").each(function () {
                eliminarDiacriticos(this);
            });
            $("#formReferenciaCliente select").each(function () {
                $(this).removeAttr('disabled');
            });
            $('#formCliente select').each(function () {
                $(this).removeAttr('disabled');
            });
            formulario.submit();
            bloqueoAjax();
        }
    });
}
//------------------------------------------------------------------------------
function getNacionalidad(nacionalidad) {
    if (nacionalidad == 'COLOMBIANO') {
        $("#divRadicadoextranjero").hide();
        $("#divPais").hide();
        $("#radicadoextranjero").removeAttr("required");
        $("#idPais").removeAttr("required");
        $("#idPais").val(43);
        $("#radicadoextranjero").val('_NA_');
    } else {
        $("#divRadicadoextranjero").show('slow');
        $("#divPais").show('slow');
        $('#radicadoextranjero').attr('required', true);
        $('#idPais').attr('required', true);
        $("#idPais").val("");
        $("#radicadoextranjero").val('');
    }

}
//------------------------------------------------------------------------------
//   INICIO - GENERADOR DE DIRECCIONES
//------------------------------------------------------------------------------
var pilaNomenclaturas = [];

function verGeneradorDirecciones() {
    pilaNomenclaturas = [];
    $.ajax({
        url: "verNomenclaturas",
        dataType: "html",
        data: {},
        success: function (html) {
            $("#divContenidoNomenclaturas").html(html);
            $('#lbModalNomenclaturas').html('Generador de Direcciones');
            $('#modalNomenclaturas').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function addNomenclatura() {
    let nomenclatura = $("#nomenclatura").val();
    if (nomenclatura !== '') {
        if (pilaNomenclaturas.length > 0) {
            let ultimo = pilaNomenclaturas[pilaNomenclaturas.length - 1];
            if (ultimo.tipo === 'nomenclatura') {
                Swal.fire({
                    icon: 'error',
                    title: 'NOMENCLATURA NO VALIDA',
                    html: 'No es posible agregar 2 nomenclaturas seguidas'
                });
                return;
            }
        }
        let partes = nomenclatura.split(';');
        pilaNomenclaturas.push({
            valor: partes[0],
            tipo: 'nomenclatura'
        });
        generarDireccion();
    }
}

//------------------------------------------------------------------------------

function addDetalle() {
    let detalle = $.trim($("#detalleAux").val());
    if (detalle.length > 0) {
        if (pilaNomenclaturas.length > 0) {
            let ultimo = pilaNomenclaturas[pilaNomenclaturas.length - 1];
            if (ultimo.tipo !== 'nomenclatura') {
                Swal.fire({
                    icon: 'error',
                    title: 'DETALLE NO VALIDO',
                    html: 'El detalle solo se puede agregar despues de una nomenclatura'
                });
                return;
            }
            pilaNomenclaturas.push({
                valor: detalle,
                tipo: 'detalle'
            });
            generarDireccion();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'DETALLE NO VALIDO',
                html: 'El detalle solo se puede agregar despues de una nomenclatura'
            });
        }
    }
}

//------------------------------------------------------------------------------

function setNumero(numero) {
    //    console.log($(numero).html())
    pilaNomenclaturas.push({
        valor: $(numero).html(),
        tipo: 'numero'
    });
    generarDireccion();
}

//------------------------------------------------------------------------------

function setSimbolo(simbolo) {
    //    console.log($(simbolo).html())
    if (pilaNomenclaturas.length > 0) {
        let ultimo = pilaNomenclaturas[pilaNomenclaturas.length - 1];
        if (ultimo.tipo === 'simbolo') {
            Swal.fire({
                icon: 'error',
                title: 'SIMBOLO NO VALIDO',
                html: 'No es posible agregar 2 simbolos seguidos'
            });
            return;
        }
    }
    pilaNomenclaturas.push({
        valor: $(simbolo).html(),
        tipo: 'simbolo'
    });
    generarDireccion();
}

//------------------------------------------------------------------------------

function setLetra(letra) {
    //    console.log($(letra).html())
    if (pilaNomenclaturas.length > 1) {
        let ultimo = pilaNomenclaturas[pilaNomenclaturas.length - 1];
        let penultimo = pilaNomenclaturas[pilaNomenclaturas.length - 2];
        if (ultimo.tipo === 'letra' && penultimo.tipo === 'letra') {
            Swal.fire({
                icon: 'error',
                title: 'LETRA NO VALIDO',
                html: 'No es posible agregar mas de 2 letras seguidas'
            });
            return;
        }
    }
    pilaNomenclaturas.push({
        valor: $(letra).html(),
        tipo: 'letra'
    });
    generarDireccion();
}

//------------------------------------------------------------------------------

function generarDireccion() {
    let direccion = '';
    $("#direccionAux").val('');
    let ultimo = {
        valor: '',
        tipo: ''
    };
    $.each(pilaNomenclaturas, function () {
        if (this.tipo === 'nomenclatura') {
            direccion = direccion + ' ' + this.valor;
        } else if (this.tipo === 'numero') {
            if (ultimo.tipo !== 'numero') {
                direccion = direccion + ' ';
            }
            direccion = direccion + this.valor;
        } else if (this.tipo === 'simbolo') {
            direccion = direccion + ' ' + this.valor;
        } else if (this.tipo === 'letra') {
            direccion = direccion + ' ' + this.valor;
        } else if (this.tipo === 'detalle') {
            direccion = direccion + ' ' + this.valor.toUpperCase();
        }
        ultimo = this;
    });
    $("#direccionAux").val($.trim(direccion));
}

//------------------------------------------------------------------------------

function borrarUltimaPila() {
    pilaNomenclaturas.pop();
    generarDireccion();
}

//------------------------------------------------------------------------------

function borrarPila() {
    pilaNomenclaturas = [];
    generarDireccion();
}

//------------------------------------------------------------------------------

function setDireccionGenerada() {
    let direccion = $.trim($("#direccionAux").val());
    if (direccion.length > 0) {
        $("#direccion").val(direccion);
        $('#modalFormulario2').modal('hide');
    } else {
        Swal.fire({
            icon: 'error',
            title: 'DIRECCION VACIA',
            html: 'Por favor utilize las herramientas para generar la direccion'
        });
    }
}

//------------------------------------------------------------------------------

function limpiarDireccion() {
    $("#direccion").val('');
}

//------------------------------------------------------------------------------
//   FIN - GENERADOR DE DIRECCIONES
//------------------------------------------------------------------------------

