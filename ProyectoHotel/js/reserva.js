const habitaciones = [
    {
        id: 1,
        nombre: "Habitación Sencilla",
        tipo: "sencilla",
        precio: 80,
        imagen: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
        descripcion: "Habitación cómoda para 1 persona, ideal para viajes de negocios.",
        caracteristicas: ["Wi-Fi", "TV", "Aire Acondicionado", "Baño Privado"],
        disponible: true
    },
    {
        id: 2,
        nombre: "Habitación Doble",
        tipo: "doble",
        precio: 120,
        imagen: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7",
        descripcion: "Amplia habitación para 2 personas, perfecta para parejas.",
        caracteristicas: ["Wi-Fi", "TV", "Aire Acondicionado", "Baño Privado", "Caja Fuerte"],
        disponible: true
    },
    {
        id: 3,
        nombre: "Suite Ejecutiva",
        tipo: "suite",
        precio: 200,
        imagen: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        descripcion: "Lujosa suite con sala de estar separada y amenities premium.",
        caracteristicas: ["Wi-Fi", "TV Pantalla Plana", "Aire Acondicionado", "Baño Privado", "Minibar", "Caja Fuerte", "Jacuzzi"],
        disponible: true
    },
    {
        id: 4,
        nombre: "Suite Presidencial",
        tipo: "presidencial",
        precio: 350,
        imagen: "https://images.unsplash.com/photo-1611892440504-42a792e24d32",
        descripcion: "La experiencia máxima de lujo con terraza privada y vistas panorámicas.",
        caracteristicas: ["Wi-Fi", "TV 4K", "Aire Acondicionado", "Baño de Mármol", "Minibar", "Caja Fuerte", "Jacuzzi", "Terraza Privada"],
        disponible: true
    }
];

let habitacionSeleccionada = null;

document.addEventListener('DOMContentLoaded', function() {
    cargarHabitaciones();
    inicializarFiltros();
    inicializarModal();
});

function cargarHabitaciones(filtros = {}) {
    const grid = document.getElementById('roomsGrid');
    grid.innerHTML = '';

    let habitacionesFiltradas = habitaciones;

    if (filtros.tipoHabitacion) {
        habitacionesFiltradas = habitacionesFiltradas.filter(h => h.tipo === filtros.tipoHabitacion);
    }

    if (filtros.precioMax) {
        habitacionesFiltradas = habitacionesFiltradas.filter(h => h.precio <= filtros.precioMax);
    }

    habitacionesFiltradas.forEach(habitacion => {
        const card = document.createElement('div');
        card.className = 'room-card';
        card.innerHTML = `
            <div class="room-image" style="background-image: url('${habitacion.imagen}')">
                <span class="room-badge">${habitacion.tipo.toUpperCase()}</span>
            </div>
            <div class="room-info">
                <h3>${habitacion.nombre}</h3>
                <p class="room-type">${obtenerDescripcionTipo(habitacion.tipo)}</p>
                <p class="room-description">${habitacion.descripcion}</p>
                <div class="room-features">
                    ${habitacion.caracteristicas.map(caract => `<span class="feature">${caract}</span>`).join('')}
                </div>
                <div class="room-footer">
                    <div class="room-price">
                        $${habitacion.precio} <span>/noche</span>
                    </div>
                    <button class="btn-reservar" onclick="abrirModalReserva(${habitacion.id})">
                        Reservar
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function obtenerDescripcionTipo(tipo) {
    const tipos = {
        sencilla: "Habitación estándar para 1 persona",
        doble: "Habitación amplia para 2 personas", 
        suite: "Suite con sala de estar separada",
        presidencial: "Suite de lujo con amenities premium"
    };
    return tipos[tipo] || "";
}

function inicializarFiltros() {
    const precioSlider = document.getElementById('precioMax');
    const precioValue = document.getElementById('precioValue');
    const aplicarFiltros = document.getElementById('aplicarFiltros');

    precioSlider.addEventListener('input', function() {
        precioValue.textContent = `$${this.value}`;
    });

    aplicarFiltros.addEventListener('click', function() {
        const filtros = {
            tipoHabitacion: document.getElementById('tipoHabitacion').value,
            precioMax: parseInt(document.getElementById('precioMax').value)
        };
        cargarHabitaciones(filtros);
    });

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('fechaEntrada').min = hoy;
    document.getElementById('fechaEntrada').addEventListener('change', function() {
        document.getElementById('fechaSalida').min = this.value;
    });
}

function inicializarModal() {
    const modal = document.getElementById('modalReserva');
    const closeBtn = document.querySelector('.close');
    const cancelarBtn = document.getElementById('cancelarReserva');
    const form = document.getElementById('formReserva');

    closeBtn.addEventListener('click', cerrarModal);
    cancelarBtn.addEventListener('click', cerrarModal);
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        confirmarReserva();
    });

    document.getElementById('reservaCheckin').addEventListener('change', calcularTotal);
    document.getElementById('reservaCheckout').addEventListener('change', calcularTotal);

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            cerrarModal();
        }
    });
}

function abrirModalReserva(id) {
    habitacionSeleccionada = habitaciones.find(h => h.id === id);
    if (!habitacionSeleccionada) return;

    const modal = document.getElementById('modalReserva');
    document.getElementById('modalRoomImage').src = habitacionSeleccionada.imagen;
    document.getElementById('modalRoomName').textContent = habitacionSeleccionada.nombre;
    document.getElementById('modalRoomType').textContent = obtenerDescripcionTipo(habitacionSeleccionada.tipo);
    document.getElementById('modalRoomPrice').textContent = `$${habitacionSeleccionada.precio} por noche`;

    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('reservaCheckin').min = hoy;
    document.getElementById('reservaCheckin').value = '';
    document.getElementById('reservaCheckout').value = '';
    document.getElementById('reservaCheckout').min = hoy;

    document.getElementById('reservaNombre').value = '';
    document.getElementById('reservaEmail').value = '';
    document.getElementById('reservaTelefono').value = '';
    document.getElementById('reservaPersonas').value = '1';
    document.getElementById('reservaComentarios').value = '';

    calcularTotal();
    modal.style.display = 'block';
}

function cerrarModal() {
    const modal = document.getElementById('modalReserva');
    modal.style.display = 'none';
    habitacionSeleccionada = null;
}

function calcularTotal() {
    if (!habitacionSeleccionada) return;

    const checkin = document.getElementById('reservaCheckin').value;
    const checkout = document.getElementById('reservaCheckout').value;

    if (checkin && checkout) {
        const fechaInicio = new Date(checkin);
        const fechaFin = new Date(checkout);
        const diffTime = Math.abs(fechaFin - fechaInicio);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
            const total = diffDays * habitacionSeleccionada.precio;
            document.getElementById('totalPrecio').textContent = `$${total} (${diffDays} noches)`;
        } else {
            document.getElementById('totalPrecio').textContent = `$${habitacionSeleccionada.precio}`;
        }
    } else {
        document.getElementById('totalPrecio').textContent = `$${habitacionSeleccionada.precio}`;
    }
}

function confirmarReserva() {
    if (!habitacionSeleccionada) return;

    const reserva = {
        habitacion: habitacionSeleccionada,
        nombre: document.getElementById('reservaNombre').value,
        email: document.getElementById('reservaEmail').value,
        telefono: document.getElementById('reservaTelefono').value,
        personas: document.getElementById('reservaPersonas').value,
        checkin: document.getElementById('reservaCheckin').value,
        checkout: document.getElementById('reservaCheckout').value,
        comentarios: document.getElementById('reservaComentarios').value,
        total: document.getElementById('totalPrecio').textContent,
        fechaReserva: new Date().toISOString(),
        id: Date.now()
    };

    let reservas = JSON.parse(localStorage.getItem('reservas')) || [];
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    mostrarNotificacion('¡Reserva confirmada exitosamente!', 'success');
    
    setTimeout(() => {
        cerrarModal();
    }, 2000);
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