// script.js - Requisito 5: JavaScript Vanilla para SPA

// Variables globales
const inicioSection = document.getElementById('inicio');
const plansSection = document.getElementById('planes');
const formSection = document.getElementById('formSection');
const clientesSection = document.getElementById('clientesSection');
const orderForm = document.getElementById('orderForm');
const newOrderBtn = document.getElementById('newOrderBtn');
const navLinks = document.querySelectorAll('.nav-link');
const selectPlanBtns = document.querySelectorAll('.select-plan');
const planInput = document.getElementById('planInput');
const speedInput = document.getElementById('speedInput');
const clientesTableBody = document.getElementById('clientesTableBody');

// Estado de pedidos/clientes
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

// Mostrar solo la sección indicada
function showSection(sectionToShow) {
  // Ocultar todas las secciones
  inicioSection.style.display = 'none';
  plansSection.style.display = 'none';
  formSection.style.display = 'none';
  clientesSection.style.display = 'none';
  
  // Mostrar la sección solicitada
  if (sectionToShow === 'inicio') {
    inicioSection.style.display = 'block';
  } else if (sectionToShow === 'planes') {
    plansSection.style.display = 'block';
  } else if (sectionToShow === 'formSection') {
    formSection.style.display = 'block';
  } else if (sectionToShow === 'clientesSection') {
    clientesSection.style.display = 'block';
    renderClientes();
  }
}

// Navegación SPA
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const href = link.getAttribute('href').replace('#', '');
    showSection(href + (href === 'clientes' ? 'Section' : ''));
  });
});

// Botón "Nuevo Pedido"
newOrderBtn.addEventListener('click', () => {
  orderForm.reset();
  orderForm.classList.remove('was-validated');
  planInput.value = '';
  speedInput.value = '';
  showSection('formSection');
});

// Botones "Seleccionar" de cada plan
selectPlanBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    orderForm.reset();
    orderForm.classList.remove('was-validated');
    planInput.value = btn.dataset.plan;
    speedInput.value = btn.dataset.speed;
    showSection('formSection');
  });
});

// Inicialmente solo muestra el inicio
showSection('inicio');

// Manejo del formulario de pedido
orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!e.target.checkValidity()) {
    e.target.classList.add('was-validated');
    return;
  }
  
  const data = new FormData(e.target);
  const order = {
    name: data.get('customerName'),
    email: data.get('customerEmail'),
    address: data.get('customerAddress'),
    phone: data.get('customerPhone'),
    dni: data.get('customerDNI'),
    plan: data.get('plan'),
    speed: data.get('speed'),
    status: 'Agendado'
  };
  
  orders.push(order);
  saveOrders();
  showSection('clientesSection');
});

// Guardar y renderizar clientes
function saveOrders() {
  localStorage.setItem('orders', JSON.stringify(orders));
  renderClientes();
}

// Renderizar tabla de clientes
function renderClientes() {
  clientesTableBody.innerHTML = '';
  
  if (orders.length === 0) {
    clientesTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No hay clientes registrados.</td></tr>';
    return;
  }
  
  orders.forEach((order, idx) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${order.name}</td>
      <td>${order.email}</td>
      <td>${order.address}</td>
      <td>${order.plan}</td>
      <td>${order.speed} Mbps</td>
      <td>
        <select data-idx="${idx}" class="form-select estado-select">
          <option value="Agendado" ${order.status === 'Agendado' ? 'selected' : ''}>Agendado</option>
          <option value="En Atencion" ${order.status === 'En Atencion' ? 'selected' : ''}>En Atención</option>
          <option value="Cancelado" ${order.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </td>
    `;
    
    clientesTableBody.appendChild(row);
  });

  // Manejar cambio de estado
  document.querySelectorAll('.estado-select').forEach(select => {
    select.addEventListener('change', function() {
      const idx = this.dataset.idx;
      orders[idx].status = this.value;
      saveOrders();
    });
  });
}

// Inicializar la vista de clientes si es necesario
if (window.location.hash === '#clientes') {
  showSection('clientesSection');
}
