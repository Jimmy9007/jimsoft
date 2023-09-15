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

function verRegistrar(event) {
    $.get('registrar', { fecha: new Date(event).toISOString() }, setFormulario);
    bloqueoAjax();
}
function verEditar(idEvento) {
    $.get('editar', { idEvento: idEvento }, setFormulario);
    bloqueoAjax();
}
function verDetalle(idEvento) {
    $.get('detalle', { idEvento: idEvento }, setFormulario);
    bloqueoAjax();
}
function verEliminar(idEvento) {
    $.get('eliminar', { idEvento: idEvento }, setFormulario);
    bloqueoAjax();
}
function moverEvento(event) {
    Swal.fire({
        title: '&#191;Est&aacute;s seguro de este cambio&#63;',
        text: event.title + " se movera a: " + event.start.format() + " - " + event.end.format(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('moverevento', { idEvento: event.idEvento, start: event.start.format(), end: event.end.format() }, setEventoAction, 'json');
            bloqueoAjax();
        } else {
            window.location.reload();
            revertFunc();
        }
    })
}
function redimensionar(event) {
    Swal.fire({
        title: '&#191;Est&aacute;s seguro de este cambio&#63;',
        text: event.title + " se movera a: " + event.start.format() + " - " + event.end.format(),
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('moverevento', { idEvento: event.idEvento, start: event.start.format(), end: event.end.format() }, setEventoAction, 'json');
            bloqueoAjax();
        } else {
            window.location.reload();
            revertFunc();
        }
    })
}
function eliminarEvento() {
    var idEvento = $("#idEventoAux").val();
    Swal.fire({
        title: '&#191;Est&aacute;s seguro de eliminar el evento&#63;',
        text: 'No podra revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'SI',
        cancelButtonText: 'NO',
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            $.get('eliminar', { idEvento: idEvento }, setEventoAction, 'json');
            bloqueoAjax();
        }
    })
}
function setEventoAction(datos) {
    if (parseInt(datos['successOK']) === 1) {
        window.location.reload();
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN <i><i class='fa fa-paw'></i>JIMSOFT</i>.");
        return false;
    }
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}

function validarGuardar(evt, formulario, tipo) {
    evt.preventDefault();
    Swal.fire({
        title: "&#191;DESEA " + tipo + " EL EVENTO&#63;",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            formulario.removeAttribute('onsubmit');
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------

function getMunicipios(idDepartamento) {
    if (idDepartamento !== '') {
        $.get('getselectmunicipios', { idDepartamento: idDepartamento }, setMunicipios);
        bloqueoAjax();
    } else {
        $("#idMunicipio").html("<option value=''>Seleccione...</option>");
    }
}
function setMunicipios(html) {
    $("#idMunicipio").html(html);
}

//------------------------------------------------------------------------------
function existeIdentificacion() {
    if ($("#identificacion").val() !== '') {
        $.get('existeidentificacion', { identificacion: $("#identificacion").val() }, setExisteIdentificacion, 'json');
        bloqueoAjax();
    }
}
function setExisteIdentificacion(datos) {
    if (parseInt(datos['error']) === 0) {
        if (parseInt(datos['existe']) === 1) {
            Swal.fire("LA IDENTIFICACION ( " + datos['identificacion'] + " ) YA SE ENCUENTRA REGISTRADA EN <i><i class='fa fa-paw'></i>JIMSOFT</i>.", "<i><i class='fa fa-paw'></i>JIMSOFT</i>", "error");
            $("#identificacion").val('');
            $("#identificacion").focus();
            return false;
        } else {
            return true;
        }
    } else {
        alert("SE HA PRESENTADO UN INCONVENIENTE EN <i><i class='fa fa-paw'></i>JIMSOFT</i>.");
        return false;
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
//------------------------------------------------------------------------------
