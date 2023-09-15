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
function verEditar(idEmpleado) {
    $.get('editar', { idEmpleado: idEmpleado }, setFormulario);
    bloqueoAjax();
}
function verDetalle(idEmpleado) {
    $.get('detalle', { idEmpleado: idEmpleado }, setFormulario);
    bloqueoAjax();
}
function verEliminar(idEmpleado) {
    $.get('eliminar', { idEmpleado: idEmpleado }, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}
//------------------------------------------------------------------------------
function validarGuardar(evt, formulario, tipo) {
    evt.preventDefault();
    Swal.fire({
        title: "DESEA " + tipo + " EL USUARIO ?",
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
function getLogin(idEmpleadoCliente) {
    $("#login").val('');
    $("#password").val('');
    $("#passwordseguro").val('');
    $("#usuario").val('');
    if (idEmpleadoCliente !== '') {
        $("#login").attr('readonly', true);
        $("#login").attr('required', false);
        $("#usuario").attr('readonly', true);
        $("#usuario").attr('required', false);
        $.get('getLogin', { idEmpleadoCliente: idEmpleadoCliente }, setLogin, 'json');
    } else {
        $("#login").attr('readonly', false);
        $("#login").attr('required', true);
        $("#usuario").attr('readonly', false);
        $("#usuario").attr('required', true);
    }
}
function setLogin(datos) {
    if (parseInt(datos['error']) === 1) {
        alert("SE HA PRESENTADO UN INCONVENIENTE AL TRATAR DE OBTENER EL LOGIN DE USUARIO. POR FAVOR, INTENTE DE NUEVO. EN CASO DE PERSISTIR EL INCONVENIENTE COMUNIQUESE CON EL ADMINISTRADOR");
        location.reload();
        return;
    }
    $("#login").val(quitarAcentos(datos['login'].toLowerCase()));
    $("#usuario").val(datos['usuario']);
    $("#password").val('@' + quitarAcentos(datos['login'].toLowerCase()) + '#');
    $("#passwordseguro").val('@' + quitarAcentos(datos['login'].toLowerCase()) + '#');
}

function verificarPassword() {
    if ($("#password").val() !== '') {
        if ($("#password").val().length < 6) {
            Swal.fire('EL PASSWORD DEBE TENER AL MENOS 6 CARACTERES', 'JimSoft', 'error');
            $("#password").attr('type', 'password');
            $("#passwordseguro").attr('type', 'password');
            $("#password").val('');
            $("#password").focus();
            return;
        }
    }
    if ($("#password").val() !== '' && $("#passwordseguro").val() !== '') {
        if ($("#password").val() !== $("#passwordseguro").val()) {
            Swal.fire('EL PASSWORD Y SU CONFIRMACION NO COINCIDEN', 'JimSoft', 'error');
            $("#password").attr('type', 'password');
            $("#passwordseguro").attr('type', 'password');
            $("#password").val('');
            $("#passwordseguro").val('');
            $("#password").focus();
        }
    }
}
function quitarAcentos(cadena) {
    const acentos = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u', 'ñ': 'n', 'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U', 'Ñ': 'N' };
    return cadena.split('').map(letra => acentos[letra] || letra).join('').toString();
}
//------------------------------------------------------------------------------
