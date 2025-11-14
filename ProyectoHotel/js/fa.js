const usuariosValidos = [
    { username: "admin", password: "admin123", rol: "administrador" },
    { username: "a", password: "aaaaaa", rol: "administrador" },
    { username: "recepcion", password: "recepcion123", rol: "recepcionista" },
    { username: "usuario", password: "usuario123", rol: "usuario" }
];

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberCheckbox = document.getElementById('remember');

    cargarCredencialesGuardadas();

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        iniciarSesion();
    });

    usernameInput.addEventListener('input', limpiarError);
    passwordInput.addEventListener('input', limpiarError);

    rememberCheckbox.addEventListener('change', function() {
        if (!this.checked) {
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
        }
    });
});

function cargarCredencialesGuardadas() {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    
    if (savedUsername && savedPassword) {
        document.getElementById('username').value = savedUsername;
        document.getElementById('password').value = savedPassword;
        document.getElementById('remember').checked = true;
    }
}

function limpiarError(e) {
    const input = e.target;
    input.classList.remove('error');
    const errorElement = document.getElementById(input.id + 'Error');
    errorElement.textContent = '';
}

function validarFormulario() {
    let esValido = true;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (username === '') {
        mostrarError('username', 'El usuario es requerido');
        esValido = false;
    }

    if (password === '') {
        mostrarError('password', 'La contraseña es requerida');
        esValido = false;
    } else if (password.length < 6) {
        mostrarError('password', 'La contraseña debe tener al menos 6 caracteres');
        esValido = false;
    }

    return esValido;
}

function mostrarError(campo, mensaje) {
    const input = document.getElementById(campo);
    const errorElement = document.getElementById(campo + 'Error');
    
    input.classList.add('error');
    errorElement.textContent = mensaje;
}

function mostrarNotificacion(mensaje, tipo) {
    const notification = document.getElementById('notification');
    const messageElement = document.getElementById('notificationMessage');
    
    messageElement.textContent = mensaje;
    notification.className = `notification ${tipo}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

function toggleLoading(mostrar) {
    const loginBtn = document.getElementById('loginBtn');
    if (mostrar) {
        loginBtn.disabled = true;
        loginBtn.classList.add('loading');
    } else {
        loginBtn.disabled = false;
        loginBtn.classList.remove('loading');
    }
}

function iniciarSesion() {
    if (!validarFormulario()) {
        return;
    }

    toggleLoading(true);

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    setTimeout(() => {
        const usuario = usuariosValidos.find(u => 
            u.username === username && u.password === password
        );

        if (usuario) {
            if (remember) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
            } else {
                localStorage.removeItem('savedUsername');
                localStorage.removeItem('savedPassword');
            }

            sessionStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            
            mostrarNotificacion('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            setTimeout(() => {
                window.location.href = 'pa.html';
            }, 1500);
            
        } else {
            mostrarNotificacion('Usuario o contraseña incorrectos', 'error');
            toggleLoading(false);
        }
    }, 1500);
}

function verificarSesion() {
    const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
    if (usuarioLogueado) {
        const usuario = JSON.parse(usuarioLogueado);
        if (window.location.pathname.includes('fa.html')) {
            window.location.href = 'pa.html';
        }
    } else {
        if (window.location.pathname.includes('pa.html')) {
            window.location.href = 'fa.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', verificarSesion);

const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        mostrarNotificacion('Función de recuperación de contraseña en desarrollo', 'error');
    });
}