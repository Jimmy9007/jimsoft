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
            $("#atrasForm").hide();
            $('#lbModalFormulario').html('Registro de Cliente Residencial');
            $("#clienteBusqAux").autocomplete({
                minLength: 5,
                showNoSuggestionNotice: true,
                noSuggestionNotice: '<p style="color:#FF0000";><i class="fa fa-close"></i> Lo sentimos, no hay resultados coincidentes.</p>',
                source: function (request, response) {
                    $.ajax({
                        url: "buscarcliente",
                        dataType: "json",
                        data: {
                            clienteBusq: request.term
                        },
                        success: function (data) {
                            response($.map(data, function (clienteArray) {
                                return {
                                    data: {
                                        'idCliente': clienteArray.idCliente,
                                        'identificacion': clienteArray.identificacion,
                                        'cliente': clienteArray.cliente,
                                        'emailcontacto': clienteArray.emailcontacto,
                                        'emailfacturacion': clienteArray.emailfacturacion
                                    },
                                    value: clienteArray.cliente
                                };
                            }));
                        }
                    });
                },
                select: function (e, ui) {
                    $("#idCliente").val(ui.item.data.idCliente);
                    $("#identificacion").val(ui.item.data.identificacion);
                    $("#cliente").val(ui.item.label);
                    if ($.trim(ui.item.data.emailfacturacion).length > 0) {
                        $("#emailfacturacion").val($.trim(ui.item.data.emailfacturacion));
                    } else {
                        if ($.trim(ui.item.data.emailcontacto).length > 0) {
                            $("#emailfacturacion").val($.trim(ui.item.data.emailcontacto));
                        }
                    }
                    $("#fechaInicio").focus();
                },
                invalidateSelection: function () {
//            Swal.fire("NOMBRE INCORRECTO", "JOSANDRO", "error");
                }
            });
            $('#modalFormulario').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function validarRegistrar(evt, formulario) {
    evt.preventDefault();
    if ($.trim($("#idCliente").val()).length === 0) {
        $("#identificacionBusqAux").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR INDIQUE EL CLIENTE PARA ESTE NUEVO SERVICIO',
            html: 'Tenga en cuenta que para el registro de este servicio es necesario indicar a que <b>cliente</b> se va asociar a dicho servicio'
        });
        return false;
    }
    if ($.trim($("#idTarifa").val()).length === 0) {
        $("#conceptofacturacion").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR INDIQUE LA TARIFA O PLAN PARA ESTE NUEVO SERVICIO',
            html: 'Tenga en cuenta que para el registro de este servicio es necesario indicar que <b>tarifa o plan</b> se va asociar a dicho servicio'
        });
        return false;
    }
    Swal.fire({
        title: "DESEA REGISTRAR ESTE NUEVO SERVICIO ?",
        html: '<b>CLIENTE</b>: ' + $("#cliente").val() + '<br>'
                + '<b>PLAN:</b> ' + $("#conceptofacturacion").val() + '<br>'
                + '<b>CARGO FIJO MENSUAL:</b> ' + $("#tarifa").val() + ' (Sin IVA)<br>'
                + '<b>PAGO INSTALACION:</b> ' + $("#pagoinstalacion").val() + ' (Sin IVA)<br>',
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            $("#tvanaloga").removeAttr('disabled');
            formulario.removeAttribute('onsubmit');
            formulario.submit();
            bloqueoAjax();
        }
    });
}

//------------------------------------------------------------------------------

function setFechaFin() {
    let fechaInicio = $.trim($("#fechainicio").val());
    let duracion = $.trim($("#duracion").val());
    if (fechaInicio !== '' && duracion !== '') {
        let fechaAux_1 = fechaInicio.split('-');
        let anio = fechaAux_1[0];
        let mes = fechaAux_1[1] - 1;
        let dia = fechaAux_1[2];
        let fechaAux = new Date();
        fechaAux.setFullYear(anio, mes, dia);
        duracion = parseInt(duracion) + parseInt(mes);
        fechaAux.setMonth(duracion);
        anio = fechaAux.getFullYear();
        mes = fechaAux.getMonth() + 1;
        dia = fechaAux.getDate();
        dia = dia < 10 ? '0' + dia : dia;
        mes = mes < 10 ? '0' + mes : mes;
        $("#fechafin").val(anio + "-" + mes + "-" + dia);
    } else {
        $("#fechafin").val('');
    }
}

//------------------------------------------------------------------------------

function getMunicipios() {
    $("#idMunicipio").html('<option value="">Seleccione...</option>');
    if ($("#idDepartamento").val() !== '') {
        limpiarTarifa();
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

function verRegistrarDireccion(input) {
    $.ajax({
        url: "registrardireccion",
        dataType: "html",
        data: {},
        success: function (html) {
            $("#divContenidoAux").html(html);
            $('#lbModalFormularioAux').html('Gestor de Direcciones');
            $('#modalFormularioAux').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function limpiarTarifa() {
    $("#nombrePlan").val('');
    $("#totalPago").val('');
    $("#tvanaloga").val('');
    $("#velocidades").val('');
    $("#idPlanInternet").val('');
}

//------------------------------------------------------------------------------

function getZonas() {
    $("#idZona").html('<option value="">Seleccione...</option>');
    if ($("#idMunicipio").val() !== '') {
        limpiarTarifa();
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

function buscarTarifa(tipoPlan) {
    let idMunicipio = $("#idMunicipio").val();
    let idTipoServicio = $("#idTipoServicio").val();
    if (idMunicipio === '') {
        $("#idMunicipio").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR SELECCIONE UN MUNICIPIO',
            html: 'Tenga en cuenta que dependiendo de la ubicacion se establecen las tarifas o planes'
        });
        return false;
    }
    if (idTipoServicio === '') {
        $("#idTipoServicio").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR SELECCIONE EL TIPO DE SERVICIO',
            html: 'Tenga en cuenta que dependiendo del tipo de servicio se establecen las tarifas o planes'
        });
        return false;
    }
    if (tipoPlan === '') {
        Swal.fire({
            icon: 'error',
            title: 'SE HA PRESENTADO UN INCONVENIENTE',
            html: 'Por favor, recargue la pagina e intente de nuevo'
        });
        return false;
    }
    $.ajax({
        url: "getTarifas",
        dataType: "html",
        data: {
            idMunicipio: idMunicipio,
            idTipoServicio: idTipoServicio,
            tipoPlan: tipoPlan
        },
        success: function (html) {
            $("#divContenidoAux").html(html);
            $('#lbModalFormularioAux').html('Seleccionar Tarifa');
            $("#tblBuscarTarifas").DataTable({
                responsive: true,
                iDisplayLength: 25,
                sPaginationType: "full_numbers",
                oLanguage: {
                    sLengthMenu: "Mostrar: _MENU_ registros por pagina",
                    sZeroRecords: "NO SE HA ENCONTRADO INFORMACION",
                    sInfo: "Mostrando <b>_START_</b> a <b>_END_</b> registros <br>TOTAL REGISTROS: <b>_TOTAL_</b> Registros</b>",
                    sInfoEmpty: "Mostrando 0 A 0 registros",
                    sInfoFiltered: "(Filtrados de un total de <b>_MAX_</b> registros)",
                    sLoadingRecords: "CARGANDO...",
                    sProcessing: "EN PROCESO...",
                    sSearch: "Buscar:",
                    sEmptyTable: "NO HAY INFORMACION DISPONIBLE PARA LA TABLA",
                    oPaginate: {
                        sFirst: "<i class=\'fa fa-fast-backward\' aria-hidden=\'true\' title=\'Inicio\'></i>",
                        sPrevious: "<i class=\'fa fa-step-backward\' aria-hidden=\'true\' title=\'Anterior\'></i>",
                        sNext: "<i class=\'fa fa-step-forward\' aria-hidden=\'true\' title=\'Siguiente\'></i>",
                        sLast: "<i class=\'fa fa-fast-forward\' aria-hidden=\'true\' title=\'Fin\'></i>"
                    }
                },
                aaSorting: [[0, "desc"]]
            });
            $('#modalFormularioAux').modal('show');
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function seleccionarTarifa(tarifa) {
    limpiarTarifa();
    var row = $(tarifa).closest("tr");
    var tds = row.find("td");

    $("#idTarifa").val(tds.get(0).innerHTML);
    $("#conceptofacturacion").val(tds.get(3).innerHTML);
    $("#tarifa").val(tds.get(4).innerHTML.replace(/\,/g, ''));
    $("#velocidades").val(tds.get(5).innerHTML + ' / ' + tds.get(6).innerHTML);
    $("#tvanaloga").val(tds.get(8).innerHTML);
    $('#modalFormularioAux').modal('hide');
}

function limpiarTarifa() {
    $("#idTarifa").val('');
    $("#conceptofacturacion").val('');
    $("#tarifa").val('');
    $("#velocidades").val('');
    $("#tvanaloga").val('');
}

//------------------------------------------------------------------------------

function setInstalacionGratis() {
    $("#pagoinstalacion").val('');
    if ($("#instalarGratis").val() !== '') {
        if (parseInt($("#instalarGratis").val()) === 1) {
            $("#pagoinstalacion").val(0);
            $("#divCobrosInstalacion input").each(function () {
                $(this).removeAttr('required');
            });
            $("#divCobrosInstalacion select").each(function () {
                $(this).removeAttr('required');
            });
            $("#divCobrosInstalacion").hide('slow');
        } else {
            $("#divCobrosInstalacion input").each(function () {
                $(this).attr('required', true);
            });
            $("#divCobrosInstalacion select").each(function () {
                $(this).attr('required', true);
            });
            calcularValoresInstalacion();
            $("#divCobrosInstalacion").show('slow');
        }
    } else {
        $("#divCobrosInstalacion").hide('slow');
    }
}

//------------------------------------------------------------------------------

function calcularValoresInstalacion() {
    let totalInstall = 0;
    $(".valorInstall").each(function () {
        if ($.trim($(this).val()) !== '') {
            totalInstall = totalInstall + parseInt($(this).val());
        }
    });
    $("#pagoinstalacion").val(totalInstall);
}

//------------------------------------------------------------------------------

function agregarCobro() {
    let contCobro = parseInt($("#contCobrosInstall").val()) + 1;
    let filaCobro = '<tr>';
    filaCobro += '<td>';
    filaCobro += '<a href="#" onclick="quitarCobroInstall(this)" title="ELIMINAR ESTE COBRO" style="color: blue"><i class="fa fa-times"></i></a>';
    filaCobro += '</td>';
    filaCobro += '<td>';
    filaCobro += '<select name="tipoCobro_' + contCobro + '" id="tipoCobro_' + contCobro + '" class="form-control" style="width: 150px" required><option value="">Seleccione...</option><option value="EQUIPO">EQUIPO</option></select>';
    filaCobro += '</td>';
    filaCobro += '<td>';
    filaCobro += '<input name="concepto_' + contCobro + '" id="concepto_' + contCobro + '" value="" class="form-control" style="text-transform: uppercase" required>';
    filaCobro += '</td>';
    filaCobro += '<td>';
    filaCobro += '<input type="number" name="vlr_' + contCobro + '" id="vlr_' + contCobro + '" value="" min="1000" onchange="calcularValoresInstalacion()" class="form-control valorInstall" style="width: 150px" required>';
    filaCobro += '</td>';
    filaCobro += '</tr>';
    $("#tblConceptosInstall").append(filaCobro);
    $("#contCobrosInstall").val(contCobro);
}

//------------------------------------------------------------------------------

function quitarCobroInstall(fila) {
    Swal.fire({
        title: "DESEA QUITAR ESTE COBRO DE LA INSTALACION ? ",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            let objFila = $(fila).parents().get(1);
            $(objFila).remove();
            calcularValoresInstalacion();
        }
    });
}

//------------------------------------------------------------------------------

function buscarByIdentificacion() {
    let identificacion = $.trim($("#identificacionBusqAux").val());
    if (identificacion === '') {
        $("#identificacionBusqAux").focus();
        Swal.fire({
            icon: 'warning',
            title: 'POR FAVOR DIGITE LA IDENTIFICACION',
            html: 'Para iniciar la busqueda es necesario que digite la identificacion del cliente que desea buscar'
        });
        return false;
    }
    if (identificacion.length < 5) {
        $("#identificacionBusqAux").focus();
        Swal.fire({
            icon: 'warning',
            title: 'LA IDENTIFICACION DIGITADA ES MUY CORTA',
            html: 'Para iniciar la busqueda se requiere que la identificacion tenga al menos <b>5 digitos</b>'
        });
        return false;
    }
    $.ajax({
        url: "buscarclienteByIdentificacion",
        dataType: "json",
        data: {
            identificacion: identificacion
        },
        success: function (datos) {
            if (Object.keys(datos).length > 0) {
                $("#idCliente").val(datos['idCliente']);
                $("#identificacion").val(datos['identificacion']);
                $("#cliente").val(datos['cliente']);
                if ($.trim(datos['emailfacturacion']).length > 0) {
                    $("#emailfacturacion").val($.trim(datos['emailfacturacion']));
                } else {
                    if ($.trim(datos['emailcontacto']).length > 0) {
                        $("#emailfacturacion").val($.trim(datos['emailcontacto']));
                    }
                }
                $("#fechaInicio").focus();
            } else {
                $("#identificacionBusqAux").focus();
                Swal.fire({
                    icon: 'error',
                    title: 'IDENTIFICACION NO ENCONTRADA',
                    html: 'La identificacion <b>' + identificacion + '</b> no se encuentra registrada en el sistema <br>o<br> Pertenece al segmento Corporativo'
                });
            }
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
