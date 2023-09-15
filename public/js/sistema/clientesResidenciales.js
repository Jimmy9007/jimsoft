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
            $('#modalFormulario').modal('show');
            localStorage.clear();
            refEditar();
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verDetalle(idCliente) {
    $.ajax({
        url: "detalle",
        dataType: "html",
        data: {idCliente: idCliente},
        success: function (html) {
            $("#divContenido").html(html);
            $("#atrasForm").hide();
            $('#lbModalFormulario').html('Detalle del Cliente Residencial');
            $('#modalFormulario').modal('show');
            localStorage.clear();
            refEditar();
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verEditar(idCliente) {
    $.ajax({
        url: "editar",
        dataType: "html",
        data: {idCliente: idCliente},
        success: function (html) {
            $("#divContenido").html(html);
            $("#atrasForm").hide();
            $('#lbModalFormulario').html('Actualizacion de Cliente Residencial');
            $('#modalFormulario').modal('show');
            localStorage.clear();
            refEditar();
        }
    });
    bloqueoAjax();
}

//------------------------------------------------------------------------------

function verLegalizar(idCliente) {
    $.get('clientes/principal/agregarArchivo', {idCliente: idCliente}, setFormulario);

    bloqueoAjax();
}

//------------------------------------------------------------------------------

function setFormulario(datos) {
    //alert(datos);
    $("#divContenido").html(datos);
    $("#atrasForm").hide();
    $('#modalFormulario').modal('show');
    localStorage.clear();
    refEditar();
}

//------------------------------------------------------------------------------

function validarRegistrar(e, formulario) {
    e.preventDefault();

    Swal.fire({
        title: "DESEA REGISTRAR ESTE CLIENTE ?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            getRefArray();
            let referencias = localStorage.getItem("referenciasCliente");
            retrocederRegistro(e, formulario);
            $("#referencias").val(referencias);

            $("#formCliente").removeAttr('onsubmit');

            $("#formCliente").submit();
        }
    });
}

//------------------------------------------------------------------------------

var validarAgregarArchivo = (e, formulario) => {
    e.preventDefault();
    Swal.fire({
        title: "DESEA REGISTRAR ESTE ARCHIVO ?",
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
        }
    });
}

//------------------------------------------------------------------------------

var validarEliminarArchivo = (idArchivo) => {

    Swal.fire({
        title: "DESEA ElIMINAR ESTE ARCHIVO ?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            location.href = "clientes/principal/eliminarArchivo?archivo=" + idArchivo;

        }
    });
}

//------------------------------------------------------------------------------

function validarEditar(e, formulario) {
    e.preventDefault();

    Swal.fire({
        title: "DESEA ACTUALIZAR LA INFORMACION DE ESTE CLIENTE ?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButtonText: "No",
        allowOutsideClick: false
    }).then((result) => {
        if (result.isConfirmed) {
            // $("#divReferencias").html("");
            $("#referencias").val(localStorage.getItem("referenciasCliente"));


            formulario.removeAttribute('onsubmit');
            formulario.submit();
        }
    });

}

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

function existeIdentificacion(identificacion) {
    let tipoidentificacion = $("#tipoidentificacion").val();
    if (tipoidentificacion === "Cedula") {
        if (identificacion.length > 10) {
            $("#errordeformato").html("La identificacion no debe contener mas de 10 caracteres").show("slow");
            $("#identificacion").val('');
            $("#identificacion").focus();
        } else {
            $("#errordeformato").text("").hide();
        }
    } else if (tipoidentificacion === "NIT") {
        if (identificacion.length !== 9) {
            $("#errordeformato").text("La identificacion debe contener 9 caracteres correspondientes a un NIT").show("slow");
            $("#identificacion").val('').focus();

        } else {
            $("#errordeformato").text("").hide();
            $("#tipoidentificacion").focus();
        }
    } else {
        $("#errordeformato").text("Debes seleccionar el tipo de identificacion se va a registrar").show("slow");
        $("#identificacion").val('');
        $("#identificacion").focus();
    }
    if ($.trim($("#identificacion").val()).length > 0) {
        if ($("#identificacionOLD").length > 0) {
            if (parseInt($.trim($("#identificacionOLD").val())) === parseInt($.trim($("#identificacion").val()))) {
                return;
            }
        }
        $.ajax({
            url: "existeidentificacion",
            dataType: "json",
            data: {identificacion: identificacion},
            success: function (datos) {
                if (parseInt(datos['error']) === 0) {
                    if (parseInt(datos['existe']) === 1) {
                        $("#identificacionEncontrada").html(datos['identificacion']);
                        $("#yaexisteidentificacion").show('slow');
                        $("#identificacion").val('');
                        $("#identificacion").focus();
                    } else {
                        $("#identificacionEncontrada").html('');
                        $("#yaexisteidentificacion").hide();
                    }
                } else {

                }
            }
        });
        bloqueoAjax();
    }
}

//------------------------------------------------------------------------------

function validarFiltroBusqueda(evento) {
    let identificacion = $.trim($("#identificacionBusq").val());
    let fechaini = $.trim($("#fechahorainiBusq").val());
    let fechafin = $.trim($("#fechahorafinBusq").val());
    let nombre1 = $.trim($("#nombre1Busq").val());
    let nombre2 = $.trim($("#nombre2Busq").val());
    let apellido1 = $.trim($("#apellido1Busq").val());
    let apellido2 = $.trim($("#apellido2Busq").val());
    let razonsocial = $.trim($("#razonsocialBusq").val());

    evento.preventDefault();
    if (identificacion.length > 0 && otrosCamposLlenos() > 1) {

        Swal.fire({
            title: "SE HAN INGRESADO EL CAMPO DE BUSQUEDA IDENTIFICACION",
            text: "La busqueda SOLO tendra encuenta este campo \n\n  DESEA CONTINUAR ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                limpiarFormBusq();
                $("#identificacionBusq").val(identificacion);
                $("#formBusqueda").removeAttr("onsubmit");
                $("#formBusqueda").submit();
            } else {
                return false;
            }
        });
    } else {
        if ((fechaini.length > 0 && fechafin.length === 0) || (fechaini.length === 0 && fechafin.length > 0)) {
            Swal.fire({
                title: "PARA UTILIZAR LA BUSQUEDA POR FECHA ES OBLIGATORIO INGRESAR LOS DOS CAMPOS DE FECHA",
                text: "",
                icon: "info",
                confirmButtonText: "Aceptar",
                allowOutsideClick: false
            }).then((result) => {
                return false;
            });
        } else if ((nombre1.length > 0 || nombre2.length > 0) && (apellido1.length === 0 && apellido2.length === 0)) {
            Swal.fire({
                title: "PARA UTILIZAR LA BUSQUEDA POR NOMBRE ES OBLIGATORIO INGRESAR AL MENOS UNO DE LOS APELLIDOS",
                text: "",
                icon: "info",
                confirmButtonText: "Aceptar",
                allowOutsideClick: false
            }).then((result) => {
                return false;
            });
        } else {
            $("#formBusqueda").removeAttr("onsubmit");
            $("#formBusqueda").submit();
        }
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

function otrosCamposLlenos() {
    var cont = 0;
    $("#formBusqueda input").each(function () {
        if ($.trim($(this).val()).length > 0) {
            cont++;
        }
    });
    return cont;
}

//------------------------------------------------------------------------------
//elimina caracteres especiales (tildes y eñes)
var eliminarDiacriticos = (texto) => {
    let resp = texto.normalize('NFD').replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi, "$1").normalize();
    resp = resp.replace('Ñ', 'N');
    resp = resp.replace('ñ', 'N');
    resp = resp.replace("'", '');
    return resp;
}
var validarCampos = (campo) => {

    let ban = false;
    let d = 'ÁÃÀÄÂÉËÈÊÍÏÌÎÓÖÒÔÚÜÙÛÑÇáãàäâéëèêíïìîóöòôúüùûñç´';
    ban2 = false;
    for (const letra of campo.value) {
        if (letra == ' ' && campo.id != "razonsocial" && campo.id != "representantelegal" && campo.id != "identireprelegal" && campo.id != "razonsocialBusq") {
            ban = true;
        } else if (d.indexOf(letra) != -1) {
            ban2 = true;
        }
    }
    if (ban) {
        campo.value = campo.value.trim();
        $(campo.id.indexOf("Busq") == -1 ? "#errorescritura" : "#errorescrituraBusq").text("No se admiten espacios en blanco en los campos de nombres o apellidos").fadeIn('slow');
        campo.focus();
    } else if (ban2) {
        campo.value = eliminarDiacriticos(campo.value);
        $(campo.id.indexOf("Busq") == -1 ? "#errorescritura" : "#errorescrituraBusq").text("No se admiten caracteres especiales como tildes o eñes").fadeIn('slow');
        campo.focus();
    }

};
//cierra las alertas de los errores de escritura generados en el metodo anterior
var cerrarAlerta = () => {
    $("#errorescritura").text("").fadeOut('slow');
    $("#errorescrituraBusq").text("").fadeOut('slow');
};
//control del formulario que simula el formulario wizard, para agregar las referencias

var ingresarReferencias = (e, formulario) => {
    e.preventDefault();
    let datos = new FormData($("#formCliente")[0]);
    var object = {};
    datos.forEach((value, key) => object[key] = value);
    localStorage.setItem('dataFormCliente', JSON.stringify([$("#divContenido").html(), object]));
    let campos = generarCampos();
    $("#divContenido").html(campos[0]);

    establecerSelects(campos[1]);

};
//control retroceso
var retrocederRegistro = (e, formulario) => {
    e.preventDefault();
    let aux = JSON.parse(localStorage.getItem('dataFormCliente'));
    $("#divContenido").html(aux[0]);
    for (const ind in aux[1]) {
        if (ind != 'tipocliente' && ind != 'tipoidentificacion' && ind != 'trato') {
            $(`#${ind}`).val(aux[1][ind]);
        } else {
            $(`#${ind} option[value='${aux[1][ind]}']`).attr("selected", "selected");
        }

    }

}
//obtener referencias en un array
var getRefArray = () => {
    let datos = new FormData($("#formularioRef")[0]);

    let arr = [];
    let object = {};
    let cont = 0;
    datos.forEach((value, key) => {

        object[key.substring(0, key.length - 1)] = value;
        if (cont > 4) {
            arr.push(object);
            object = {};
            cont = -1;
        }
        cont++;
    });
    localStorage.setItem('referenciasCliente', JSON.stringify(arr));
};
// añadir referencia
var addReferencia = e => {
    e.preventDefault();
    getRefArray();
    let s = JSON.parse(localStorage.getItem("referenciasCliente"));
    s.push({
        idReferencia: '',
        nombres: '',
        apellidos: '',
        parentesco: '',
        celular: '',
        email: ''
    })
    localStorage.setItem("referenciasCliente", JSON.stringify(s))
    let campos = generarCampos();
    $("#divContenido").html(campos[0]);
    establecerSelects(campos[1]);


};
//eliminar Referencia
var eliminarRef = (e, elemento, id) => {
    e.preventDefault();

    let datos = JSON.parse(localStorage.getItem("referenciasCliente"));
    datos.splice(id, 1);
    localStorage.setItem('referenciasCliente', JSON.stringify(datos));
    let campos = generarCampos();
    $("#divContenido").html(campos[0]);
    establecerSelects(campos[1]);

};
// agregar referencias al formulario editar
var refEditar = () => {


    if ($("#referencias").val() != "" && $("#referencias").val() != undefined) {
        localStorage.setItem("referenciasCliente", $("#referencias").val());
        //carga todo el formulario de registro de referencias
        let referenciashtml = generarCampos();

        $("#divReferencias").html(referenciashtml[0]);
        //elimina  footer del formulario de referencias
        $("#footerFormularioRef").hide();
        //cambia el atributo submit para editar
        $("#addref").removeAttr("onclick").attr("onclick", "addReferenciaEditar(event);").html('<i class="fas fa-edit"></i> Administrar Referencias');
        $(".elref").hide();
        $("#divReferencias input").attr("disabled", "disabled");
        $("#divReferencias select").attr("disabled", "disabled");
        establecerSelects(referenciashtml[1]);

    }
    //retira boton de administrar referencias del formulario de detalle
    if ($("#divReferencias").attr('plantilla') == "detalle") {
        $("#addref").hide();

    }

};
// añadir referencia

var addReferenciaEditar = e => {
    e.preventDefault();
    localStorage.setItem("editar", "1");
    ingresarReferencias(e);
};
//almacena las referencias antes de regresar al form de editar
let editarReferencias = e => {
    e.preventDefault();
    getRefArray();
    retrocederRegistro(e, null);
    let referenciashtml = generarCampos();

    $("#divReferencias").html(referenciashtml[0]);
    $("#divReferencias input").attr("disabled", "disabled");
    //elimina  footer del formulario de referencias
    $("#footerFormularioRef").hide();
    //cambia el atributo submit para editar
    $("#addref").removeAttr("onclick").attr("onclick", "addReferenciaEditar(event);").html('<i class="fas fa-edit"></i> Administrar Referencias');
    $(".elref").hide();
    $("#divReferencias select").attr("disabled", "disabled");
    establecerSelects(referenciashtml[1]);
};

// generar Campos para las referencias
var generarCampos = () => {
    let d = localStorage.getItem("referenciasCliente");
    let editar = localStorage.getItem("editar") != null ? true : false;
    let aux2 = [{
            idReferencia: '',
            nombres: '',
            apellidos: '',
            parentesco: '',
            celular: '',
            email: ''
        }]//control del formulario que simula el formulario wizard, para agregar las referencias

    if (d != null) {
        aux2 = JSON.parse(d);
    }


    let aux = `<form onsubmit="${editar ? "editarReferencias(event)" : "validarRegistrar(event, this)"};" id="formularioRef"><div class="modal-body" >
        <div style="padding: 10px" class="container-fluid">`;
    for (const val in aux2) {

        aux += `<div id="allReferencias"><div id="referencia${val}">
        <div class="card-title ${val != 0 ? "d-flex justify-content-between" : ""}"><div><h2> <strong>Referencia ${parseInt(val) + 1}</strong></h2></div>
        ${val != 0 ? `<div class="elref"><span class="text-danger" onclick="eliminarRef(event, this, ${val});"><i class="fas fa-trash"></i> Eliminar Referencia</span></div>` : ""}
        </div>
        <input type="hidden" name="idReferencia${val}" id="idReferencia${val}" value="${aux2[val].idReferencia}">
        <div class="form-row">
            <div class="form-group col-md-6 col-sm-12">
                <label for="nombres${val}">Nombres *</label>
                <div class="input-group">
                    <input type="text" name="nombres${val}" id="nombres${val}" required  class="form-control"  value="${aux2[val].nombres}" style="text-transform: uppercase">
                    <div class="input-group-append">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="form-group col-md-6 col-sm-12">
                <label for="apellidos${val}">Apellidos *</label>
                <div class="input-group">
                    <input type="text" name="apellidos${val}" id="apellidos${val}" required class="form-control" value="${aux2[val].apellidos}" style="text-transform: uppercase">
                    <div class=" input-group-append">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="form-row">
            <div class="form-group col-md-6 col-sm-12">
                <label for="parentesco${val}">Parentesco *</label>
                <div class="input-group">
                    <select name="parentesco${val}" class="form-control" id="parentesco${val}" require>
                        <option value="">Seleccione ...</option>
                        <option value="Padre">Padre</option>
                        <option value="Madre">Madre</option>
                        <option value="Hermano(a)">Hermano(a)</option>
                        <option value="Tio(a)">Tio(a)</option>
                        <option value="Hijo(a)">Hijo(a)</option>
                        <option value="Primo(a)">Primo(a)</option>
                        <option value="Abuelo(a)">Abuelo(a)</option>
                        <option value="Esposo(a)">Esposo(a)</option>
                        <option value="Otro">Otro</option>
                    </select>
                    <div class="input-group-append">
                        <span class="input-group-text">
                            <i class="fas fa-user"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="form-group col-md-6 col-sm-12">
                <label for="celular${val}">Celular *</label>
                <div class="input-group">
                    <input type="text" name="celular${val}" id="celular${val}" class="form-control" required onkeyup="validarCampos(this);" value="${aux2[val].celular}" onchange="cerrarAlerta(this.value)" pattern="[0-9]{10}">
                    <div class="input-group-append">
                    <span class="input-group-text">
                        <i class="fas fa-mobile-alt"></i>
                     </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6 col-sm-12">
                <label for="email${val}">Correo Electronico *</label>
                <div class="input-group">
                    <input type="email" name="email${val}" style="text-transform: lowercase" id="email${val}" class="form-control" value="${aux2[val].email}" required>
                    <div class=" input-group-append">
                    <span class="input-group-text">
                        <i class="fas fa-envelope"></i>
                    </span>
                    </div>
                </div>
            </div>
        </div>
        
    </div> 
        `;

    }
    aux += `<div class="d-flex justify-content-end"><span class="text-success" id="addref" onclick="addReferencia(event);"><i class="fas fa-plus-circle"></i> Añadir Referencia</span></div></div></div>  
    <div class="modal-footer" id="footerFormularioRef" style=" padding: 20px">
    ${editar ? "" : ` <button type="button" id="atrasForm" class="btn btn-primary" onclick="retrocederRegistro(event, this)"><i class="fas fa-angle-left"></i> Atras</button>`}
        <button type="submit" class="btn btn-success" id="btnsubmit" title="${editar ? " GUARDAR REFERENCIAS" : " REGISTRAR CLIENTE"}"><i class="fas fa-save"></i>${editar ? " Guardar Referencias" : " Registrar Cliente"}</button>
        ${editar ? "" : `<button type="button" class="btn btn-danger" id="btncloseRef" data-dismiss="modal"><i class="fas fa-times"></i>Cerrar </button>`}
        
    </div>`;
    return [aux, aux2];


};

var establecerSelects = datos => {
    for (const val in datos) {
        $(`#parentesco${val} option[value='${datos[val].parentesco}']`).attr("selected", "selected");
    }
};