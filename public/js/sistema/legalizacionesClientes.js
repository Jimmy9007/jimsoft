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
                $('#lbModalFormulario').html('Registro de una Nuevo Documento');
                $('#modalFormulario').modal('show');
            }
        });
        bloqueoAjax();
    } else {
        Swal.fire({
            icon: 'error',
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL AGREGAR EL DOCUMENTO',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
    }
}

//------------------------------------------------------------------------------

function verDetalle(idLegalizacion) {
    $.ajax({
        url: "detalle",
        dataType: "html",
        data: {
            idLegalizacion: idLegalizacion
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Detalle del documento');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEditar(idLegalizacion) {
    $.ajax({
        url: "editar",
        dataType: "html",
        data: {
            idLegalizacion: idLegalizacion
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Actualizacion');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------
function verAprobar(idLegalizacion) {
    $.ajax({
        url: "aprobar",
        dataType: "html",
        data: {
            idLegalizacion: idLegalizacion
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Aprobacion del documento');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEliminar(idLegalizacion) {
    $.ajax({
        url: "eliminar",
        dataType: "html",
        data: {
            idLegalizacion: idLegalizacion
        },
        success: function (html) {
            $("#divContenido").html(html);
            $('#lbModalFormulario').html('Eliminacion del Documento');
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
            title: 'NO FUE POSIBLE DETERMINAR EL CLIENTE AL CUAL AGREGAR EL DOCUMENTO',
            html: 'Por favor recargue la pagina o vuelva atras a la seccion de cliente'
                + '<br>Si el inconveniente persiste, contacte con el Administrador'
        });
        return false;
    }
    Swal.fire({
        title: "&iquest;DESEA AGREGAR EL DOCUMENTO A ESTE CLIENTE?",
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
    Swal.fire({
        title: "&iquest;DESEA GUARDAR LOS CAMBIOS REALIZADOS A ESTE DOCUMENTO?",
        html: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            $("#formLegalizacionCliente select").each(function () {
                $(this).removeAttr('disabled');
            });
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------
function validarAprobar(e, formulario) {
    e.preventDefault();
    Swal.fire({
        title: "&iquest;DESEA GUARDAR LOS CAMBIOS REALIZADOS A ESTE DOCUMENTO?",
        html: "",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            $("#formLegalizacionCliente select").each(function () {
                $(this).removeAttr('disabled');
            });
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------

function validarEliminar(e, formulario) {
    e.preventDefault();
    Swal.fire({
        title: "&iquest;DESEA ELIMINAR ESTE DOCUMENTO?",
        html: '<span style="color: red">Por favor verifique antes de proceder.</span>',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            $("#formLegalizacionCliente select").each(function () {
                $(this).removeAttr('disabled');
            });
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------

function eliminarDiacriticos(campo) {
    let resp = campo.value.normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1").normalize();
    campo.value = resp.replace("'", '');
}

//------------------------------------------------------------------------------
function actualizarArchivo(idLegalizacion) {
    $.get('actualizararchivo', { idLegalizacion: idLegalizacion }, setFormularioAux);
    bloqueoAjax();
}
function setFormularioAux(datos) {
    $("#divContenidoAux").html(datos);
    $('#modalFormularioAux').modal('show');
}
//------------------------------------------------------------------------------
function opcionesLegalizar() {
    if ($("#opcionLegalizar").val() == "Rechazado") {
        $("#divCausarechazo").show('slow');
        $("#divObsrechazo").show('slow');
        $('#causarechazo').attr('required', true);
        $('#obsrechazo').attr('required', true);
        $("#estado").val("Rechazado");
    } else {
        $("#divCausarechazo").hide('slow');
        $("#divObsrechazo").hide('slow');
        $("#causarechazo").removeAttr("required");
        $("#obsrechazo").removeAttr("required");
        $("#estado").val("Aprobado");
    }
}
//------------------------------------------------------------------------------

