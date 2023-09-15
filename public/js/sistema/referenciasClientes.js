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
    let idCliente = parseInt($("#idCliente").val());
    if (idCliente > 0) {
        $.ajax({
            url: "registrar",
            dataType: "html",
            data: { idCliente: idCliente },
            success: function (html) {
                $("#divContenido").html(html);
                $('#lbModalFormulario').html('Registro de una Nueva Referencia');
                $('#modalFormulario').modal('show');
            }
        });
        bloqueoAjax();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL AGREGAR LA REFERENCIA',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
    }
}

//------------------------------------------------------------------------------

function verDetalle(idReferencia) {
    $.ajax({
        url: "detalle",
        dataType: "html",
        data: {
            idReferencia: idReferencia
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Detalle de la Referencia');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEditar(idReferencia) {
    $.ajax({
        url: "editar",
        dataType: "html",
        data: {
            idReferencia: idReferencia
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Actualizacion de Referencia');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEliminar(idReferencia) {
    $.ajax({
        url: "eliminar",
        dataType: "html",
        data: {
            idReferencia: idReferencia
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Eliminacion de Referencia');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function validarRegistrar(e, formulario) {
    e.preventDefault();
    if (parseInt($("#idCliente").val()) === 0 && $.trim($("#idCliente").val()) === '') {
        Swal.fire({
            icon: 'error',
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL AGREGAR LA REFERENCIA',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
        return false;
    }
    Swal.fire({
        title: "DESEA AGREGAR LA REFERENCIA A ESTE CLIENTE ?",
        html: "<b>CLIENTE:</b> " + $("#cliente").val() + "<br>"
            + "<b>IDENTIFICACION:</b> " + $("#identificacion").val(),
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

function validarEditar(e, formulario) {
    e.preventDefault();
    if (parseInt($("#idCliente").val()) === 0 && $.trim($("#idCliente").val()) === '') {
        Swal.fire({
            icon: 'error',
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL ACTUALIZAR LA REFERENCIA',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
        return false;
    }
    Swal.fire({
        title: "DESEA GUARDAR LOS CAMBIOS REALIZADOS A ESTA REFERENCIA ?",
        html: "",
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

function validarEliminar(e, formulario) {
    e.preventDefault();
    if (parseInt($("#idCliente").val()) === 0 && $.trim($("#idCliente").val()) === '') {
        Swal.fire({
            icon: 'error',
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL ACTUALIZAR LA REFERENCIA',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
        return false;
    }
    Swal.fire({
        title: "DESEA ELIMINAR ESTA REFERENCIA ?",
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
            formulario.submit();
            bloqueoAjax();
        }
    });
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


