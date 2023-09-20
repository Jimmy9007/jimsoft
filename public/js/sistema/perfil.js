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

function verPerfil(idUsuario) {
    $.get('detalle', { idUsuario: idUsuario }, setFormulario);
    bloqueoAjax();
}
function verEditar(idEmpleado) {
    $.get('editar', { idEmpleado: idEmpleado }, setFormulario);
    bloqueoAjax();
}
function cambiarPassword() {
    $.get('cambiarpassword', {}, setFormulario);
    bloqueoAjax();
}
function setFormulario(datos) {
    $("#divContenido").html(datos);
    $('#modalFormulario').modal('show');
}
function validarGuardar(evt, formulario, tipo) {
    evt.preventDefault();
    Swal.fire({
        title: "&#191;DESEA " + tipo + " EL PERFIL?",
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
function verificarPassword() {
    if ($("#password").val() !== '') {
        if ($("#password").val().length < 6) {
            alert("EL PASSWORD DEBE TENER AL MENOS 6 CARACTERES");
            $("#password").attr('type', 'password');
            $("#passwordConfirm").attr('type', 'password');
            $("#password").val('');
            $("#password").focus();
            return;
        }
    }
    if ($("#password").val() !== '' && $("#passwordConfirm").val() !== '') {
        if ($("#password").val() !== $("#passwordConfirm").val()) {
            alert("EL PASSWORD Y SU CONFIRMACION NO COINCIDEN");
            $("#password").attr('type', 'password');
            $("#passwordConfirm").attr('type', 'password');
            $("#password").val('');
            $("#passwordConfirm").val('');
            $("#password").focus();
        }
    }
}
function guardarNuevoPassword() {
    if (confirm("PARA QUE EL CAMBIO DE CONTRASEÑA SEA REGISTRADO LA SESION ACTUAL DEBE CERRARSE \n ¿ DESEA REGISTRAR EL CAMBIO DE CONTRASEÑA ?")) {
        $.post('cambiarpassword', $("#formCambiarpassword").serialize(), setNuevoPassword, 'json');
        bloqueoAjax();
    }
    return false;
}

function setNuevoPassword(respuesta) {
    switch (parseInt(respuesta['error'])) {
        case 0:
            alert("LA CONTRASEÑA FUE ACTUALIZADA EN JIMSOFT");
            location.href = '/jimsoft/cerrarsesion';
            break;
        case 1:
            alert("SE HA PRESENTADO UN ERROR, LA CONTRASEÑA NO FUE ACTUALIZADA");
            $('#modalFormulario').modal('hide');
            break;
        case 2:
            alert("ERROR, LA CONTRASEÑA ACTUAL ES INCORRECTA");
            $('#modalFormulario').modal('hide');
            break;
    }
    return false;
}
//------------------------------------------------------------------------------