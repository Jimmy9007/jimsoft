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
            Swal.fire('EL PASSWORD DEBE TENER AL MENOS 6 CARACTERES', 'JimSoft', 'error');
            $("#password").attr('type', 'password');
            $("#passwordConfirm").attr('type', 'password');
            $("#password").val('');
            $("#password").focus();
            return;
        }
    }
    if ($("#password").val() !== '' && $("#passwordConfirm").val() !== '') {
        if ($("#password").val() !== $("#passwordConfirm").val()) {
            Swal.fire('EL PASSWORD Y SU CONFIRMACION NO COINCIDEN', 'JimSoft', 'error');
            $("#password").attr('type', 'password');
            $("#passwordConfirm").attr('type', 'password');
            $("#password").val('');
            $("#passwordConfirm").val('');
            $("#password").focus();
        }
    }
}
function guardarNuevoPassword() {
    Swal.fire({
        html:
            '<h2><b>PARA QUE EL CAMBIO DE CONTRASEÑA SEA REGISTRADO LA SESION ACTUAL DEBE CERRARSE</b></h2>' +
            '<h4><small>&#191;DESEA REGISTRAR EL CAMBIO DE CONTRASEÑA&#63;</small></h4>' +
            '<p class="animated bounce estilologo"><i><i class="fa fa-paw"></i>JimSoft</i></p>',
        icon: 'info',
        allowOutsideClick: false,
        confirmButtonText: 'Aceptar',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            $.post('cambiarpassword', $("#formCambiarpassword").serialize(), setNuevoPassword, 'json');
            bloqueoAjax();
        }
    });
    return false;
}

function setNuevoPassword(respuesta) {
    switch (parseInt(respuesta['error'])) {
        case 0:
            Swal.fire({
                title: 'LA CONTRASEÑA FUE ACTUALIZADA',
                icon: 'success',
                text: 'JimSoft',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    location.href = '/jimsoft/cerrarsesion';
                }
            });
            break;
        case 1:
            Swal.fire({
                title: 'LA CONTRASEÑA NO FUE ACTUALIZADA',
                icon: 'error',
                text: 'JimSoft',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#modalFormulario').modal('hide');
                }
            });
            break;
        case 2:
            Swal.fire({
                title: 'LA CONTRASEÑA ACTUAL ES INCORRECTA',
                icon: 'error',
                text: 'JimSoft',
                allowOutsideClick: false,
                confirmButtonText: 'Aceptar',
            }).then((result) => {
                if (result.isConfirmed) {
                    $('#modalFormulario').modal('hide');
                }
            });
            break;
    }
    return false;
}
//------------------------------------------------------------------------------