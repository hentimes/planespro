// ==========================================================
// PLANESPRO V4.4 - SCRIPT ÚNICO Y DEFINITIVO
// Este archivo contiene toda la lógica y carga los componentes
// sin usar módulos para máxima compatibilidad.
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log("✅ Proyecto iniciado. Cargando componentes...");
    
    // Carga los componentes reutilizables en la página
    loadComponent('header.html', 'header-container');
    loadComponent('footer.html', 'footer-container');
    
    // Inicializa la lógica estática de la página
    initializeStaticPageLogic();
});


/**
 * Carga un componente HTML en un contenedor específico.
 * @param {string} filePath - La ruta al archivo HTML del componente.
 * @param {string} containerId - El ID del div contenedor.
 */
function loadComponent(filePath, containerId) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Error al cargar ${filePath}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
        })
        .catch(error => console.error(`Error cargando componente:`, error));
}

/**
 * Inicializa funciones que no dependen de los componentes cargados dinámicamente.
 */
function initializeStaticPageLogic() {
    // Aquí puedes poner lógica de carruseles si sus contenedores ya existen en el HTML principal.
    // Por ahora, lo dejamos simple.
}


// =========================================
// LÓGICA DEL FORMULARIO Y MODALES
// Estas funciones se hacen globales para que `onclick` funcione.
// =========================================

let isFormLoaded = false;

/**
 * Carga y muestra el formulario modal. Se llama con onclick.
 */
async function openFormModal(buttonSource = 'unknown') {
    const container = document.getElementById('form-container');

    if (!isFormLoaded) {
        try {
            const response = await fetch('formulario.html');
            if (!response.ok) throw new Error('No se pudo cargar formulario.html');
            container.innerHTML = await response.text();
            isFormLoaded = true;
            initializeFormLogic(); // Configura la lógica interna del formulario
        } catch (error) {
            console.error("Error al cargar el formulario:", error);
            alert("Error al cargar el formulario. Intenta de nuevo.");
            return;
        }
    }

    const modal = document.getElementById('formModal');
    if (modal) {
        const buttonInput = modal.querySelector('#button-source');
        if (buttonInput) buttonInput.value = buttonSource;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Cierra cualquier modal por su ID.
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    if(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/**
 * Inicializa la lógica interna del formulario una vez que su HTML ha sido cargado.
 */
function initializeFormLogic() {
    const form = document.getElementById('leadForm');
    if (!form) return;

    let currentStep = 1;
    const formSteps = form.querySelectorAll('.form-step');
    const progressLine = form.querySelector('.progress-line');
    const progressSteps = form.querySelectorAll('.progress-step');

    const sistemaActualSelect = form.querySelector('#sistema_actual');
    const isapreDetailsContainer = form.querySelector('#isapre-details');
    const isapreEspecificaSelect = form.querySelector('#isapre_especifica');
    const anualidadRadios = form.querySelectorAll('input[name="anualidad_isapre"]');

    function updateFormSteps() {
        formSteps.forEach(step => step.classList.remove('active'));
        form.querySelector(`#step-${currentStep}`).classList.add('active');
        const progressPercentage = ((currentStep - 1) / (formSteps.length - 1)) * 100;
        progressLine.style.width = `${progressPercentage}%`;
        progressSteps.forEach((step, index) => step.classList.toggle('active', index < currentStep));
    }

    function handleSistemaChange() {
        if (sistemaActualSelect.value === 'Isapre') {
            isapreDetailsContainer.style.display = 'block';
            isapreEspecificaSelect.required = true;
            anualidadRadios.forEach(r => r.required = true);
        } else {
            isapreDetailsContainer.style.display = 'none';
            isapreEspecificaSelect.required = false;
            anualidadRadios.forEach(r => r.required = false);
        }
    }

    sistemaActualSelect.addEventListener('change', handleSistemaChange);

    form.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                currentStep++;
                updateFormSteps();
            } else {
                alert('Por favor completa todos los campos obligatorios.');
            }
        });
    });

    form.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            currentStep--;
            updateFormSteps();
        });
    });

    form.addEventListener('submit', handleFormSubmit);
    updateFormSteps();
}

function validateStep(stepNumber) {
    const stepDiv = document.getElementById(`step-${stepNumber}`);
    let isValid = true;
    const inputs = stepDiv.querySelectorAll('input[required], select[required]');
    for (const input of inputs) {
        if (input.offsetParent !== null && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    }
    return isValid;
}


async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (!validateStep(3)) {
        alert('Por favor revisa los campos del último paso.');
        return;
    }
    
    // Lógica de envío...
    console.log("Formulario válido, enviando...");
}