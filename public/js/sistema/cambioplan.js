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
function verDetalle(idCambioPlan) {
    $.get('detalle', {idCambioPlan: idCambioPlan}, setFormulario);
    bloqueoAjax();
}
function verConfirmar(idCambioPlan) {
    $.get('verconfirmar', {idCambioPlan: idCambioPlan}, setFormulario);
    bloqueoAjax();
}
function verEliminar(idCambioPlan) {
    $.get('vereliminar', {idCambioPlan: idCambioPlan}, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    //alert(datos);
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrar() {
    if ($("#idServicio").val() == '') {
        Swal.fire('DEBES SELECCIONAR UN SERVICIO PARA CONTINUAR ?', 'JOSANDRO', 'warning');
        return false;
    } else if (confirm("DESEA REGISTRAR LA SOLICITUD")) {
        bloqueoAjax();
        return true;
    } else {
        return false;
    }
}
//------------------------------------------------------------------------------
function buscarClienteCedula() {
    var identificacion = $("#identificacion").val();
    if (identificacion == '') {
        Swal.fire("DIGITE UNA IDENTIFICACION", "JOSANDRO", "warning");
    } else {
        $.get('getcliente', {identificacion: identificacion}, setCliente);
        $("#identificacion").val('');
        $("#autocomplete-custom-append").val('');
        $("#idServicio").val('');
    }

}
function seleccionarServicio(idServicio, idTarifa) {
    $("#idServicio").val(idServicio);
    $("#idTarifaOLD").val(idTarifa);
//    $("#description").val($("#idServicio").val() + ";" + $("#cliente").val());
}
//-----------------------------------------------------------------------------
function seleccionarTarifa(idTarifa) {
    $("#idTarifaNEW").val(idTarifa);
}
//------------------------------------------------------------------------------