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
function verEditar(idContratoLaboral) {
    $.get('editar', { idContratoLaboral: idContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function verDetalle(idContratoLaboral) {
    $.get('detalle', { idContratoLaboral: idContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function verEliminar(idContratoLaboral) {
    $.get('eliminar', { idContratoLaboral: idContratoLaboral }, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}

function validarGuardar(evt, formulario, tipo) {
    if ($("#idEmpleado").val() != '') {
        evt.preventDefault();
        Swal.fire({
            title: "DESEA " + tipo + " EL CONTRATO LABORAL ?",
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
    } else {
        Swal.fire('DEBES BUSCAR A UN EMPLEADO PARA CONTINUAR', 'JOSANDRO', 'error')
        return false;
    }

}

//------------------------------------------------------------------------------
function buscarByIdentificacion() {
    if ($.trim($("#identificacionBusqAux").val()).length > 0) {
        $("#divInfoEmpleado").html('');
        $.ajax({
            url: "getEmpleado",
            dataType: "html",
            data: {
                identificacion: $.trim($("#identificacionBusqAux").val())
            },
            success: function (html) {
                $("#divInfoEmpleado").html(html);
                $("#idEmpleado").val($("#idEmpleadoAux").val());
            }
        });
        bloqueoAjax();
    } else {
        Swal.fire('DIGITE UNA IDENTIFICACION.', 'JOSANDRO', 'error')
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
function divVlrRodamiento() {
    if (parseInt($("#aplicaRodamiento").val()) === 1) {
        $("#divVlrRodamiento").removeAttr("hidden");
        $("#divVlrRodamiento").show('slow');
        $("#vlrRodamiento").attr("required", "true");
        $("#vlrRodamiento").val("");
    } else {
        $("#divVlrRodamiento").hide("slow");
        $("#vlrRodamiento").removeAttr("required");
        $("#vlrRodamiento").val("");
    }
}
function divDuracionPrueba() {
    if (parseInt($("#aplicaPeriodoPrueba").val()) === 1) {
        $("#divDuracionPrueba").removeAttr("hidden");
        $("#divDuracionPrueba").show('slow');
        $("#duracionPrueba").attr("required", "true");
        $("#duracionPrueba").val("");
    } else {
        $("#divDuracionPrueba").hide("slow");
        $("#duracionPrueba").removeAttr("required");
        $("#duracionPrueba").val("");
    }
}
function divVlrBonificacion() {
    if (parseInt($("#aplicaBonificacion").val()) === 1) {
        $("#divVlrBonificacion").removeAttr("hidden");
        $("#divVlrBonificacion").show('slow');
        $("#vlrBonificacion").attr("required", "true");
        $("#vlrBonificacion").val("");
    } else {
        $("#divVlrBonificacion").hide("slow");
        $("#vlrBonificacion").removeAttr("required");
        $("#vlrBonificacion").val("");
    }
}
function divVlraportes() {
    if (parseInt($("#sumaraportes").val()) === 1) {
        $("#divVlraportes").removeAttr("hidden");
        $("#divVlraportes").show('slow');
        $("#vlraportes").attr("required", "true");
        $("#vlraportes").val("");
    } else {
        $("#divVlraportes").hide("slow");
        $("#vlraportes").removeAttr("required");
        $("#vlraportes").val("");
    }
}
function divFechaVenceAlturas() {
    if (parseInt($("#aplicaAlturas").val()) === 1) {
        $("#divFechaVenceAlturas").removeAttr("hidden");
        $("#divFechaVenceAlturas").show('slow');
        $("#fechaVenceAlturas").attr("required", "true");
        $("#fechaVenceAlturas").val("");
    } else {
        $("#divFechaVenceAlturas").hide("slow");
        $("#fechaVenceAlturas").removeAttr("required");
        $("#fechaVenceAlturas").val("0000-00-00");
    }
}
//------------------------------------------------------------------------------
function calculoDias() {
    fecha1 = $("#fechaContratacion").val();
    fecha2 = $("#fechaTerminacion").val();
    if (fecha1 != '' && fecha2 != '') {
        var fechaInicio = new Date(fecha1).getTime();
        var fechaFin = new Date(fecha2).getTime();
        var diff = fechaFin - fechaInicio;
        if (diff >= 0) {
            $("#duracion").val(diff / (1000 * 60 * 60 * 24));
        } else {
            Swal.fire('LA DURACION DEL CONTRATO NO PUEDE SER NEGATIVA.', 'JOSANDRO', 'error')
            $("#duracion").val('');
            $("#fechaContratacion").val('');
            $("#fechaTerminacion").val('');
        }
    }

}
//------------------------------------------------------------------------------
