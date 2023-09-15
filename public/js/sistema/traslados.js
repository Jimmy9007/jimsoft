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
            $('#lbModalFormulario').html('Solicitud de Traslado');
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}
function verDetalle(idCliente) {
    $.get('traslados/principal/detalle', {idCliente: idCliente}, setFormulario);
    bloqueoAjax();
}
function verEditar(idCliente) {
    $.get('traslados/principal/editar', {idCliente: idCliente}, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    //alert(datos);
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}

//------------------------------------------------------------------------------

function validarRegistrar(evt, formulario) {
    evt.preventDefault();
    Swal.fire({
        title: "DESEA REGISTRAR ESTE TRASLADO ?",
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

function buscarByIdentificacion() {
    if ($.trim($("#identificacionBusqAux").val()).length > 0) {
        $("#divInfoCliente").html('');
        limpiarInfoServicio();
        $.ajax({
            url: "getCliente",
            dataType: "html",
            data: {
                identificacion: $.trim($("#identificacionBusqAux").val())
            },
            success: function (html) {
                $("#divInfoCliente").html(html);
            }
        });
        bloqueoAjax();
    } else {
        alert(" DIGITE UNA IDENTIFICACION.");
    }
}

//------------------------------------------------------------------------------

function seleccionarServicio(servicio) {
    limpiarInfoServicio();
    var row = $(servicio).closest("tr");
    var tds = row.find("td");

    $("#idServicio").val(tds.get(0).innerHTML);
    $("#estadoServicio").val(tds.get(8).innerHTML);
    $("#tarifaServicio").val(tds.get(4).innerHTML);
    $("#servicio").val(tds.get(3).innerHTML);
    $("#direccionServicio").val(tds.get(5).innerHTML);
    $("#ubicacionServicio").val(tds.get(2).innerHTML);
    $("#comunaServicio").val(tds.get(6).innerHTML);
    $("#barrioServicio").val(tds.get(7).innerHTML);
}

//------------------------------------------------------------------------------

function getMunicipios() {
    $("#idMunicipio").html('<option value="">Seleccione...</option>');
    $("#idZona").html('<option value="">Seleccione...</option>');
    $("#idBarrio").html('<option value="">Seleccione...</option>');
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

function getZonas() {
    $("#idZona").html('<option value="">Seleccione...</option>');
    $("#idBarrio").html('<option value="">Seleccione...</option>');
    if ($("#idMunicipio").val() !== '') {
        $.ajax({
            url: "getZonas",
            dataType: "html",
            data: {
                idMunicipio: $("#idMunicipio").val()
            },
            success: function (html) {
                $("#idZona").html(html);
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------

function getBarrios() {
    $("#idBarrio").html('<option value="">Seleccione...</option>');
    if ($("#idZona").val() !== '') {
        $.ajax({
            url: "getBarrios",
            dataType: "html",
            data: {
                idZona: $("#idZona").val()
            },
            success: function (html) {
                $("#idBarrio").html(html);
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------

function limpiarInfoServicio() {
    $("#divInfoServicio input").each(function () {
        $(this).val('');
    });
    $("#divInfoServicio select").each(function () {
        $(this).val('');
    });
}

//------------------------------------------------------------------------------
