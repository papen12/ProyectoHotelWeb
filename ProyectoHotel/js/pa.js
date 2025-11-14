const usuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan@email.com", telefono: "123456789", rol: "usuario", estado: "activo" },
    { id: 2, nombre: "María García", email: "maria@email.com", telefono: "987654321", rol: "administrador", estado: "activo" },
    { id: 3, nombre: "Carlos López", email: "carlos@email.com", telefono: "555555555", rol: "recepcionista", estado: "inactivo" }
];

const reservas = [
    { id: 1, cliente: "Juan Pérez", habitacion: "101", checkin: "2024-01-15", checkout: "2024-01-20", total: "$1000", estado: "confirmada" },
    { id: 2, cliente: "Ana Martínez", habitacion: "203", checkin: "2024-01-18", checkout: "2024-01-22", total: "$800", estado: "pendiente" },
    { id: 3, cliente: "Pedro Sánchez", habitacion: "105", checkin: "2024-01-25", checkout: "2024-01-28", total: "$600", estado: "cancelada" }
];

document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacion();
    cargarUsuarios();
    cargarReservas();
    inicializarModalUsuario();
});

function inicializarNavegacion() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');

            navLinks.forEach(nl => nl.classList.remove('active'));
            contentSections.forEach(cs => cs.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

function cargarUsuarios() {
    const tabla = document.getElementById('tablaUsuarios');
    tabla.innerHTML = '';

    usuarios.forEach(usuario => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefono}</td>
            <td><span class="badge">${usuario.rol}</span></td>
            <td><span class="badge ${usuario.estado}">${usuario.estado}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editarUsuario(${usuario.id})">✏️</button>
                <button class="btn-action btn-delete" onclick="eliminarUsuario(${usuario.id})">🗑️</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function cargarReservas() {
    const tabla = document.getElementById('tablaReservas');
    tabla.innerHTML = '';

    reservas.forEach(reserva => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>#${reserva.id}</td>
            <td>${reserva.cliente}</td>
            <td>${reserva.habitacion}</td>
            <td>${reserva.checkin}</td>
            <td>${reserva.checkout}</td>
            <td>${reserva.total}</td>
            <td><span class="badge ${reserva.estado}">${reserva.estado}</span></td>
            <td>
                <button class="btn-action btn-edit" onclick="editarReserva(${reserva.id})">✏️</button>
                <button class="btn-action btn-delete" onclick="cancelarReserva(${reserva.id})">❌</button>
            </td>
        `;
        tabla.appendChild(fila);
    });
}

function inicializarModalUsuario() {
    const modal = document.getElementById('modalUsuario');
    const btnNuevo = document.getElementById('nuevoUsuario');
    const btnCancelar = document.getElementById('cancelarUsuario');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('formUsuario');

    btnNuevo.addEventListener('click', () => abrirModalUsuario());
    btnCancelar.addEventListener('click', () => cerrarModalUsuario());
    closeBtn.addEventListener('click', () => cerrarModalUsuario());

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        guardarUsuario();
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModalUsuario();
        }
    });
}

function abrirModalUsuario() {
    const modal = document.getElementById('modalUsuario');
    const form = document.getElementById('formUsuario');
    form.reset();
    modal.style.display = 'block';
}

function cerrarModalUsuario() {
    const modal = document.getElementById('modalUsuario');
    modal.style.display = 'none';
}

function guardarUsuario() {
    const nombre = document.getElementById('adminNombre').value;
    const email = document.getElementById('adminEmail').value;
    const telefono = document.getElementById('adminTelefono').value;
    const rol = document.getElementById('adminRol').value;

    const nuevoUsuario = {
        id: usuarios.length + 1,
        nombre: nombre,
        email: email,
        telefono: telefono,
        rol: rol,
        estado: 'activo'
    };

    usuarios.push(nuevoUsuario);
    cargarUsuarios();
    cerrarModalUsuario();
    
    alert('Usuario guardado exitosamente');
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        document.getElementById('adminNombre').value = usuario.nombre;
        document.getElementById('adminEmail').value = usuario.email;
        document.getElementById('adminTelefono').value = usuario.telefono;
        document.getElementById('adminRol').value = usuario.rol;
        abrirModalUsuario();
    }
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        const index = usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios.splice(index, 1);
            cargarUsuarios();
            alert('Usuario eliminado exitosamente');
        }
    }
}

function editarReserva(id) {
    alert(`Editando reserva #${id}`);
}

function cancelarReserva(id) {
    if (confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
        const reserva = reservas.find(r => r.id === id);
        if (reserva) {
            reserva.estado = 'cancelada';
            cargarReservas();
            alert('Reserva cancelada exitosamente');
        }
    }
}

document.getElementById('filtroEstado').addEventListener('change', function() {
    cargarReservas();
});

document.getElementById('filtroFecha').addEventListener('change', function() {
    cargarReservas();
});

document.getElementById('buscarUsuario').addEventListener('input', function(e) {
    const termino = e.target.value.toLowerCase();
    const filas = document.querySelectorAll('#tablaUsuarios tr');

    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(termino) ? '' : 'none';
    });
});

document.querySelector('.logout-btn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        window.location.href = 'index.html';
    }
});