document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const pais = document.getElementById('pais').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terminos = document.getElementById('terminos').checked;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    if (!terminos) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }
    
    if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    const usuario = {
        nombre: nombre,
        email: email,
        telefono: telefono,
        pais: pais,
        password: password
    };
    
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    console.log('Usuario registrado:', usuario);
    alert('Registro exitoso. Bienvenido/a ' + nombre + '!');
    window.location.href = 'reserva.html';
});

document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const strengthIndicator = document.getElementById('passwordStrength');
    
    if (password.length > 0 && password.length < 6) {
        this.style.borderColor = 'red';
        if (strengthIndicator) {
            strengthIndicator.textContent = 'Débil';
            strengthIndicator.className = 'password-strength weak';
        }
    } else if (password.length >= 6 && password.length < 10) {
        this.style.borderColor = 'orange';
        if (strengthIndicator) {
            strengthIndicator.textContent = 'Media';
            strengthIndicator.className = 'password-strength medium';
        }
    } else if (password.length >= 10) {
        this.style.borderColor = 'green';
        if (strengthIndicator) {
            strengthIndicator.textContent = 'Fuerte';
            strengthIndicator.className = 'password-strength strong';
        }
    } else {
        this.style.borderColor = 'var(--c2)';
        if (strengthIndicator) {
            strengthIndicator.textContent = '';
        }
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    const password = document.getElementById('password').value;
    const confirmPassword = this.value;
    
    if (confirmPassword.length > 0) {
        if (password === confirmPassword) {
            this.style.borderColor = 'green';
        } else {
            this.style.borderColor = 'red';
        }
    } else {
        this.style.borderColor = 'var(--c2)';
    }
});

document.getElementById('email').addEventListener('blur', function() {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        this.style.borderColor = 'red';
    } else if (email) {
        this.style.borderColor = 'green';
    } else {
        this.style.borderColor = 'var(--c2)';
    }
});

document.getElementById('telefono').addEventListener('blur', function() {
    const telefono = this.value;
    const telefonoRegex = /^[0-9+\-\s()]{10,}$/;
    
    if (telefono && !telefonoRegex.test(telefono)) {
        this.style.borderColor = 'red';
    } else if (telefono) {
        this.style.borderColor = 'green';
    } else {
        this.style.borderColor = 'var(--c2)';
    }
});