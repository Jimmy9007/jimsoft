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
    $.get('registrar', {}, setFormulario);
    bloqueoAjax();
}
function verEditar(idTipoContratoLaboral) {
    $.get('editar', { idTipoContratoLaboral: idTipoContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function verDetalle(idTipoContratoLaboral) {
    $.get('detalle', { idTipoContratoLaboral: idTipoContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function verEliminar(idTipoContratoLaboral) {
    $.get('eliminar', { idTipoContratoLaboral: idTipoContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}

function validarGuardar(evt, formulario, tipo) {
    evt.preventDefault();
    Swal.fire({
        title: "DESEA " + tipo + " EL TIPO DE CONTRATO LABORAL ?",
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
function limpiarFormBusq() {
    let cont = 0;
    $("#formBusqueda input").each(function () {
        $(this).val('');
        cont++;
    });
}
//------------------------------------------------------------------------------
function actualizarArchivo() {
    var idTipoContratoLaboral = $("#idTipoContratoLaboral").val();
    $.get('actualizararchivo', { idTipoContratoLaboral: idTipoContratoLaboral }, setFormularioAux);
    bloqueoAjax();
}
function setFormularioAux(datos) {
    $("#divContenidoAux").html(datos);
    $('#modalFormularioAux').modal('show');
}
//------------------------------------------------------------------------------
