// =========================================
// PLANESPRO ISAPRE V2 - JAVASCRIPT OPTIMIZADO
// =========================================

// Configuración GOOGLE SHEETS SIN CORS (MÉTODO REAL)
const FORM_CONFIG = {
    // Google Apps Script Web App URL (Henry's real URL)
    googleSheetsUrl: 'https://script.google.com/macros/s/AKfycbw654ZminnaSHSv2OoI1Ghjeladq0lerQHfr_UO43jv-K8r94OizFJA7HV75ie9sNY66A/exec',
    
    // Backup local
    useLocalStorage: true,
    
    retryAttempts: 2,
    retryDelay: 1000
};

// Estado global
const AppState = {
    currentCaso: 0,
    currentTestimonio: 0,
    isFormSubmitting: false,
    casosInterval: null,
    testimoniosInterval: null
};

// =========================================
// INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando PlanesPro Isapre V2...');
    
    initializeFormValidation();
    initializeCasosCarousel();
    initializeTestimoniosCarousel();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    
    console.log('✅ Aplicación V2 inicializada correctamente');
});

// =========================================
// NAVEGACIÓN Y SCROLL
// =========================================
function openFormModal(buttonSource = 'unknown') {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // 🎯 BUTTON TRACKING: Store which button opened the form
        const form = modal.querySelector('form');
        if (form) {
            // Create or update hidden input for button source
            let buttonInput = form.querySelector('#button-source');
            if (!buttonInput) {
                buttonInput = document.createElement('input');
                buttonInput.type = 'hidden';
                buttonInput.id = 'button-source';
                buttonInput.name = 'button_source';
                form.appendChild(buttonInput);
            }
            buttonInput.value = buttonSource;
            
            console.log('🎯 Button tracking:', buttonSource);
        }
        
        // Enfocar primer campo después de abrir modal
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) firstInput.focus();
        }, 200);
        
        // Analytics - registrar apertura de modal
        trackEvent('modal_opened', 'form_analysis_v2');
    }
}

function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}



// =========================================
// CAROUSEL DE CASOS DE ÉXITO
// =========================================
function initializeCasosCarousel() {
    const casos = document.querySelectorAll('.caso-card');
    if (casos.length === 0) return;
    
    // Auto-rotación cada 10 segundos
    AppState.casosInterval = setInterval(() => {
        nextCaso();
    }, 10000);
    
    // Pausar auto-rotación al hacer hover
    const container = document.querySelector('.casos-carousel');
    if (container) {
        container.addEventListener('mouseenter', () => {
            clearInterval(AppState.casosInterval);
        });
        
        container.addEventListener('mouseleave', () => {
            AppState.casosInterval = setInterval(() => {
                nextCaso();
            }, 10000);
        });
    }
}

function showCaso(index) {
    const casos = document.querySelectorAll('.caso-card');
    const dots = document.querySelectorAll('.dot');
    
    // Ocultar todos los casos
    casos.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Mostrar caso seleccionado
    if (casos[index]) {
        casos[index].classList.add('active');
        dots[index].classList.add('active');
        AppState.currentCaso = index;
    }
}

function nextCaso() {
    const casos = document.querySelectorAll('.caso-card');
    const nextIndex = (AppState.currentCaso + 1) % casos.length;
    showCaso(nextIndex);
}

function prevCaso() {
    const casos = document.querySelectorAll('.caso-card');
    const prevIndex = AppState.currentCaso === 0 ? casos.length - 1 : AppState.currentCaso - 1;
    showCaso(prevIndex);
}

// =========================================
// CARRUSEL DE TESTIMONIOS
// =========================================
function initializeTestimoniosCarousel() {
    const slides = document.querySelectorAll('.testimonios-slide');
    if (slides.length === 0) return;
    
    // Auto-rotación cada 8 segundos
    AppState.testimoniosInterval = setInterval(() => {
        nextTestimonios();
    }, 8000);
    
    // Pausar auto-rotación al hacer hover
    const container = document.querySelector('.testimonios-carousel-container');
    if (container) {
        container.addEventListener('mouseenter', () => {
            clearInterval(AppState.testimoniosInterval);
        });
        
        container.addEventListener('mouseleave', () => {
            AppState.testimoniosInterval = setInterval(() => {
                nextTestimonios();
            }, 8000);
        });
    }
}

function showTestimonios(index) {
    const slides = document.querySelectorAll('.testimonios-slide');
    const dots = document.querySelectorAll('.testimonios-dot');
    
    // Ocultar todos los slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Mostrar slide seleccionado
    if (slides[index]) {
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        AppState.currentTestimonio = index;
    }
}

function nextTestimonios() {
    const slides = document.querySelectorAll('.testimonios-slide');
    if (slides.length === 0) return;
    
    const nextIndex = (AppState.currentTestimonio + 1) % slides.length;
    showTestimonios(nextIndex);
}

function prevTestimonios() {
    const slides = document.querySelectorAll('.testimonios-slide');
    if (slides.length === 0) return;
    
    const prevIndex = AppState.currentTestimonio === 0 ? slides.length - 1 : AppState.currentTestimonio - 1;
    showTestimonios(prevIndex);
}

// =========================================
// VALIDACIÓN DE FORMULARIOS V2
// =========================================
function initializeFormValidation() {
    const form = document.getElementById('leadForm');
    if (!form) return;
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Formateo automático de teléfono
    const phoneInput = form.querySelector('#telefono');
    if (phoneInput) {
        phoneInput.addEventListener('input', () => formatPhoneNumber(phoneInput));
    }
    
    // Manejo de submit
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const isRequired = field.hasAttribute('required');
    const value = field.value.trim();
    
    // Limpiar estados previos
    clearFieldError(field);
    
    // Validar campo requerido
    if (isRequired && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validar email
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Por favor ingresa un email válido');
            return false;
        }
    }
    
    // Validar teléfono
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\+56\s?9\s?\d{4}\s?\d{4}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Formato: +56 9 1234 5678');
            return false;
        }
    }
    
    // Validar selects específicos
    if (field.tagName === 'SELECT' && isRequired && !value) {
        showFieldError(field, 'Por favor selecciona una opción');
        return false;
    }
    
    // Campo válido
    showFieldSuccess(field);
    return true;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('has-error');
    formGroup.classList.remove('has-success');
    
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        formGroup.appendChild(errorElement);
    }
    errorElement.textContent = message;
}

function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.add('has-success');
    formGroup.classList.remove('has-error');
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    formGroup.classList.remove('has-error', 'has-success');
    
    const errorElement = formGroup.querySelector('.error-message');
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// =========================================
// FORMATEO DE CAMPOS
// =========================================
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    // Remover prefijos Chile
    if (value.startsWith('569')) {
        value = value.substring(2);
    } else if (value.startsWith('56')) {
        value = value.substring(2);
    }
    
    // Asegurar que empiece con 9
    if (value.length > 0 && !value.startsWith('9')) {
        if (value.length === 8) {
            value = '9' + value;
        }
    }
    
    // Formatear como +56 9 XXXX XXXX
    if (value.length >= 9) {
        value = value.substring(0, 9);
        const formatted = `+56 9 ${value.substring(1, 5)} ${value.substring(5)}`;
        input.value = formatted;
    } else if (value.length > 1) {
        const formatted = `+56 9 ${value.substring(1)}`;
        input.value = formatted;
    } else if (value.length === 1 && value === '9') {
        input.value = '+56 9 ';
    }
}

// =========================================
// ENVÍO DE FORMULARIO V2
// =========================================
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (AppState.isFormSubmitting) return;
    
    const form = event.target;
    
    console.log('📝 Enviando solicitud de análisis V2...');
    
    // Validar formulario
    if (!validateForm(form)) {
        console.log('❌ Formulario inválido');
        showValidationSummary(form);
        return;
    }
    
    // Mostrar estado de carga
    showFormLoading(form, true);
    AppState.isFormSubmitting = true;
    
    try {
        // Recopilar datos del formulario V2
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // 📱 CORRECCIÓN ESPECÍFICA DEL TELÉFONO para Google Sheets
        if (data.telefono) {
            // Limpiar número para Google Sheets (solo dígitos con +56)
            const cleanPhone = data.telefono.replace(/\D/g, '');
            if (cleanPhone.startsWith('569')) {
                data.telefono = '+' + cleanPhone;
            } else if (cleanPhone.startsWith('56')) {
                data.telefono = '+' + cleanPhone;
            } else if (cleanPhone.startsWith('9') && cleanPhone.length === 9) {
                data.telefono = '+56' + cleanPhone;
            } else {
                data.telefono = '+56' + cleanPhone;
            }
        }
        
        // Agregar metadatos V2
        data.timestamp = new Date().toISOString();
        data.source = 'Landing PlanesPro Isapre V2';
        data.servicio = 'Análisis Isapre Personalizado';
        data.version = '2.0';
        data.utm_source = getUrlParameter('utm_source') || 'directo';
        data.utm_medium = getUrlParameter('utm_medium') || '';
        data.utm_campaign = getUrlParameter('utm_campaign') || '';
        
        // 🎯 BUTTON TRACKING: Include button source
        data.button_source = data.button_source || 'unknown';
        
        // Analizar perfil automáticamente
        data.perfil_recomendado = analizarPerfilAutomatico(data);
        
        // Enviar a Google Sheets
        const success = await sendToGoogleSheets(data);
        
        if (success) {
            console.log('✅ Solicitud enviada correctamente');
            
            // Mostrar mensaje de éxito
            showSuccessModal();
            
            // Limpiar formulario
            form.reset();
            clearFormValidation(form);
            
            // Analytics - registrar conversión
            trackConversion('lead_isapre_v2', data);
            
        } else {
            throw new Error('Error al enviar datos');
        }
        
    } catch (error) {
        console.error('❌ Error al enviar solicitud:', error);
        showErrorMessage();
    } finally {
        showFormLoading(form, false);
        AppState.isFormSubmitting = false;
    }
}

// =========================================
// ANÁLISIS AUTOMÁTICO DE PERFIL
// =========================================
function analizarPerfilAutomatico(data) {
    const isapre = data.isapre_actual;
    const cargas = parseInt(data.num_cargas) || 0;
    const rango = data.rango_costo;
    
    // Lógica basada en investigación Fonasa vs Isapre
    if (isapre === 'Fonasa') {
        if (cargas >= 3) {
            return 'Evaluar mantenerse en Fonasa - Familia numerosa';
        } else if (rango === '<100000' || rango === '100000-150000') {
            return 'Probable mantener Fonasa - Ingresos ajustados';
        } else {
            return 'Evaluar Isapre - Posible beneficio';
        }
    } else {
        if (rango === '>400000') {
            return 'Optimizar plan Isapre actual - Alto presupuesto';
        } else if (cargas >= 4) {
            return 'Evaluar plan familiar - Múltiples cargas';
        } else {
            return 'Optimizar Isapre actual - Posible ahorro';
        }
    }
}

function showValidationSummary(form) {
    const errors = form.querySelectorAll('.form-group.has-error');
    if (errors.length > 0) {
        const firstError = errors[0].querySelector('input, select');
        firstError.focus();
        
        // Mostrar toast con resumen de errores
        showToast(`Por favor completa ${errors.length} campo(s) requerido(s)`, 'warning');
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Mostrar toast
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Ocultar y remover toast
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

function clearFormValidation(form) {
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('has-error', 'has-success');
        const errorElement = group.querySelector('.error-message');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    });
}

function showFormLoading(form, isLoading) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalHTML = submitButton.innerHTML;
    
    if (isLoading) {
        form.classList.add('form-loading');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analizando tu perfil...';
        submitButton.disabled = true;
    } else {
        form.classList.remove('form-loading');
        submitButton.innerHTML = originalHTML;
        submitButton.disabled = false;
    }
}

// =========================================
// INTEGRACIÓN CON GOOGLE SHEETS V3
// =========================================
async function sendToGoogleSheets(data) {
    console.log('📊 ENVIANDO A GOOGLE SHEETS - Método real sin CORS', data);
    
    // PASO 1: Local Storage (backup)
    console.log('💾 Guardando datos localmente (backup)...');
    saveToLocalStorage(data, false);
    
    // PASO 2: Enviar a Google Sheets usando método sin CORS
    console.log('📤 Enviando a Google Sheets (método estándar)...');
    const success = await sendToGoogleSheetsReal(data);
    
    if (success) {
        console.log('✅ ¡ÉXITO! Datos enviados a Google Sheets');
        console.log('📊 Los datos aparecerán en tu Google Sheet automáticamente');
        markLocalDataAsSynced(data);
    } else {
        console.log('⚠️ Error en envío, datos guardados localmente');
    }
    
    // PASO 3: Mostrar confirmación clara
    showLeadInConsole(data);
    
    return true;
    
    // Preparar datos en el formato esperado por Google Apps Script
    const payload = {
        ...data,
        // Agregar información adicional del cliente
        ip_address: await getUserIP(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
        referrer: document.referrer || 'directo'
    };
    
    // Intentar envío con reintentos
    for (let attempt = 1; attempt <= GOOGLE_SHEETS_CONFIG.retryAttempts; attempt++) {
        try {
            console.log(`📤 Intento ${attempt}/${GOOGLE_SHEETS_CONFIG.retryAttempts} - Enviando a Google Sheets...`);
            
            // Método alternativo sin CORS - usando form submission
            const success = await submitWithoutCORS(payload);
            
            if (success) {
                console.log('✅ Datos enviados exitosamente a Google Sheets (método sin CORS)');
                
                // Guardar también localmente como backup
                saveToLocalStorage(data, true);
                
                return true;
            } else {
                throw new Error('Error en envío sin CORS');
            }
            
        } catch (error) {
            console.warn(`⚠️ Intento ${attempt} falló:`, error.message);
            
            // Si es el último intento, usar fallback
            if (attempt === GOOGLE_SHEETS_CONFIG.retryAttempts) {
                console.error('❌ Todos los intentos fallaron, usando almacenamiento local');
                saveToLocalStorage(data, false);
                return true; // Retornamos true para no bloquear el flujo del usuario
            }
            
            // Esperar antes del siguiente intento
            await new Promise(resolve => setTimeout(resolve, FORM_CONFIG.retryDelay * attempt));
        }
    }
    
    return false;
}

// Función alternativa para envío sin CORS usando form submission
async function submitWithoutCORS(payload) {
    return new Promise((resolve) => {
        try {
            // Crear iframe oculto para capturar respuesta
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.name = 'hidden_iframe_' + Date.now();
            document.body.appendChild(iframe);
            
            // Crear formulario temporal
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = FORM_CONFIG.googleSheetsUrl;
            form.target = iframe.name;
            form.style.display = 'none';
            
            // Agregar todos los campos como inputs ocultos
            Object.keys(payload).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = payload[key] || '';
                form.appendChild(input);
            });
            
            // Agregar formulario al DOM y enviarlo
            document.body.appendChild(form);
            
            // Manejar respuesta del iframe
            iframe.onload = function() {
                try {
                    // Limpiar elementos
                    setTimeout(() => {
                        if (document.body.contains(form)) document.body.removeChild(form);
                        if (document.body.contains(iframe)) document.body.removeChild(iframe);
                    }, 1000);
                    
                    console.log('📤 Formulario enviado sin CORS exitosamente');
                    resolve(true);
                } catch (error) {
                    console.warn('⚠️ Error procesando respuesta iframe:', error);
                    resolve(true); // Asumimos éxito si llegó hasta aquí
                }
            };
            
            // Manejar errores
            iframe.onerror = function() {
                console.warn('⚠️ Error en iframe de envío');
                resolve(false);
            };
            
            // Timeout de seguridad
            setTimeout(() => {
                console.log('📤 Enviando formulario sin CORS...');
                form.submit();
            }, 100);
            
            // Timeout general
            setTimeout(() => {
                if (document.body.contains(form)) {
                    console.warn('⚠️ Timeout en envío sin CORS, asumiendo éxito');
                    resolve(true);
                }
            }, 10000);
            
        } catch (error) {
            console.error('❌ Error en submitWithoutCORS:', error);
            resolve(false);
        }
    });
}

// Función para crear email de backup automático
function createEmailBackup(data) {
    try {
        const timestamp = new Date().toLocaleString('es-CL');
        const subject = `[PlanesPro] Nuevo Lead - ${data.nombre}`;
        
        const body = `
NUEVO LEAD RECIBIDO
==================

📅 Fecha: ${timestamp}
👤 Nombre: ${data.nombre}
📧 Email: ${data.email}
📱 Teléfono: ${data.telefono}
🏥 Isapre Actual: ${data.isapre_actual}
👥 Cargas: ${data.num_cargas}
💰 Rango Costo: ${data.rango_costo}
📍 Fuente: ${data.source || 'Landing PlanesPro V2'}

DATOS ADICIONALES:
==================
🎯 Servicio: ${data.servicio || 'Análisis Isapre Personalizado'}
📊 UTM Source: ${data.utm_source || 'directo'}
📊 UTM Medium: ${data.utm_medium || ''}
📊 UTM Campaign: ${data.utm_campaign || ''}
🎯 Perfil Recomendado: ${data.perfil_recomendado || ''}

INFORMACIÓN TÉCNICA:
==================
🌐 IP: ${data.ip_address || 'unknown'}
📱 User Agent: ${data.user_agent || navigator.userAgent}
🔗 Página: ${data.page_url || window.location.href}
🔗 Referrer: ${data.referrer || 'directo'}

==================
PlanesPro Isapre V2
`;

        // Crear enlace mailto
        const mailtoLink = `mailto:planesproisapre@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        console.log('📧 Email de backup preparado');
        console.log('📄 Asunto:', subject);
        
        // Guardar info del email para recuperación manual
        localStorage.setItem('planespro_last_email_backup', JSON.stringify({
            timestamp: new Date().toISOString(),
            subject: subject,
            body: body,
            mailtoLink: mailtoLink,
            data: data
        }));
        
        return mailtoLink;
        
    } catch (error) {
        console.warn('⚠️ Error creando email backup:', error);
        return null;
    }
}

// Función para mostrar lead claramente en consola
function showLeadInConsole(data) {
    console.log('');
    console.log('🎉 ================================');
    console.log('📋 NUEVO LEAD CAPTURADO:');
    console.log('🎉 ================================');
    console.log(`👤 Nombre: ${data.nombre}`);
    console.log(`📧 Email: ${data.email}`);
    console.log(`📱 Teléfono: ${data.telefono}`);
    console.log(`🏥 Isapre Actual: ${data.isapre_actual}`);
    console.log(`👥 Número de Cargas: ${data.num_cargas}`);
    console.log(`💰 Rango de Costo: ${data.rango_costo}`);
    console.log(`📅 Fecha: ${new Date().toLocaleString('es-CL')}`);
    console.log('🎉 ================================');
    console.log('');
    
    // También mostrar en formato CSV para fácil copia
    const csvLine = `"${data.nombre}","${data.email}","${data.telefono}","${data.isapre_actual}","${data.num_cargas}","${data.rango_costo}","${new Date().toLocaleString('es-CL')}"`;
    console.log('📊 FORMATO CSV (copia y pega):');
    console.log(csvLine);
    console.log('');
}

// Función para agregar botón de email en el modal de éxito
function addEmailButton(emailLink, data) {
    try {
        // Buscar el modal de éxito
        const successModal = document.getElementById('successModal');
        if (!successModal) return;
        
        // Verificar si ya existe el botón
        if (document.getElementById('emailLeadBtn')) return;
        
        // Crear botón de email
        const emailBtn = document.createElement('button');
        emailBtn.id = 'emailLeadBtn';
        emailBtn.className = 'cta-btn-secondary';
        emailBtn.style.marginTop = '15px';
        emailBtn.style.display = 'block';
        emailBtn.style.width = '100%';
        emailBtn.innerHTML = '📧 Enviar Lead por Email';
        
        emailBtn.onclick = function() {
            if (emailLink) {
                window.location.href = emailLink;
            } else {
                // Fallback: copiar datos al clipboard
                const leadText = `
NUEVO LEAD - PlanesPro
===================
Nombre: ${data.nombre}
Email: ${data.email}
Teléfono: ${data.telefono}
Isapre: ${data.isapre_actual}
Cargas: ${data.num_cargas}
Costo: ${data.rango_costo}
Fecha: ${new Date().toLocaleString('es-CL')}
`;
                navigator.clipboard.writeText(leadText).then(() => {
                    alert('📋 Datos del lead copiados al portapapeles');
                });
            }
        };
        
        // Agregar al modal
        const modalContent = successModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.appendChild(emailBtn);
        }
        
    } catch (error) {
        console.warn('⚠️ Error agregando botón email:', error);
    }
}

// Función para enviar a Google Sheets (MÉTODO REAL SIN CORS)
async function sendToGoogleSheetsReal(data) {
    return new Promise((resolve) => {
        try {
            console.log('📊 Usando método estándar sin CORS para Google Sheets...');
            
            // Crear iframe oculto para la respuesta
            const iframe = document.createElement('iframe');
            iframe.name = 'google_sheets_response_' + Date.now();
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Crear formulario estándar (NO requiere CORS)
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = FORM_CONFIG.googleSheetsUrl;
            form.target = iframe.name;
            form.style.display = 'none';
            
            // Preparar datos para Google Apps Script
            const formData = {
                timestamp: new Date().toLocaleString('es-CL'),
                nombre: data.nombre,
                telefono: data.telefono,
                email: data.email,
                isapre_actual: data.isapre_actual,
                num_cargas: data.num_cargas,
                rango_costo: data.rango_costo,
                source: data.source || 'Landing PlanesPro Isapre V2',
                servicio: data.servicio || 'Análisis Isapre Personalizado',
                version: '4.0',
                utm_source: data.utm_source || 'directo',
                utm_medium: data.utm_medium || '',
                utm_campaign: data.utm_campaign || '',
                perfil_recomendado: data.perfil_recomendado || '',
                button_source: data.button_source || 'unknown', // 🎯 BUTTON TRACKING
                ip_address: 'web_client'
            };
            
            // Agregar campos al formulario
            Object.keys(formData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = formData[key] || '';
                form.appendChild(input);
            });
            
            // Agregar formulario al DOM
            document.body.appendChild(form);
            
            // Manejar respuesta
            let responseReceived = false;
            
            iframe.onload = function() {
                if (!responseReceived) {
                    responseReceived = true;
                    console.log('✅ Formulario enviado exitosamente a Google Sheets');
                    console.log('📊 Los datos deberían aparecer en tu Google Sheet');
                    
                    // Limpiar elementos después de un tiempo
                    setTimeout(() => {
                        if (document.body.contains(form)) document.body.removeChild(form);
                        if (document.body.contains(iframe)) document.body.removeChild(iframe);
                    }, 2000);
                    
                    resolve(true);
                }
            };
            
            iframe.onerror = function() {
                console.warn('⚠️ Error en la respuesta del iframe');
                resolve(false);
            };
            
            // Timeout de seguridad
            setTimeout(() => {
                if (!responseReceived) {
                    console.log('⚠️ Timeout en respuesta, pero datos probablemente enviados');
                    resolve(true);
                }
            }, 10000);
            
            // Enviar formulario estándar (NUNCA falla por CORS)
            console.log('📤 Enviando formulario estándar...');
            console.log('🔗 URL destino:', FORM_CONFIG.googleSheetsUrl);
            console.log('🎯 Botón origen:', formData.button_source); // BUTTON TRACKING
            console.log('📊 Datos enviados:', formData);
            
            form.submit();
            
        } catch (error) {
            console.error('❌ Error enviando a Google Sheets:', error);
            resolve(false);
        }
    });
}

// Función para intentar Google Sheets sin bloquear (DEPRECATED)
async function tryGoogleSheets(data) {
    // Esta función ya no se usa, se mantiene por compatibilidad
    return sendDirectToGoogleSheets(data);
}

// Función para marcar datos locales como sincronizados
function markLocalDataAsSynced(data) {
    try {
        const storageKey = 'planespro_leads_isapre_v3';
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Buscar el último registro y marcarlo como sincronizado
        if (existingData.length > 0) {
            const lastIndex = existingData.length - 1;
            existingData[lastIndex].sync_status = 'synced';
            existingData[lastIndex].synced_at = new Date().toISOString();
            
            localStorage.setItem(storageKey, JSON.stringify(existingData));
            console.log('✅ Datos locales marcados como sincronizados');
        }
    } catch (error) {
        console.warn('⚠️ Error marcando datos como sincronizados:', error);
    }
}

// Función auxiliar para obtener IP del usuario
async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json', { 
            timeout: 3000 
        });
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.warn('No se pudo obtener IP del usuario:', error);
        return 'unknown';
    }
}

function saveToLocalStorage(data, isBackup = false) {
    try {
        const storageKey = 'planespro_leads_isapre_v3';
        const existingData = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Agregar metadata
        const enhancedData = {
            ...data,
            saved_at: new Date().toISOString(),
            saved_as_backup: isBackup,
            sync_status: isBackup ? 'synced' : 'pending'
        };
        
        existingData.push(enhancedData);
        localStorage.setItem(storageKey, JSON.stringify(existingData));
        
        // Agregar ID único
        enhancedData.lead_id = 'PPI_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        console.log('💾 ✅ DATOS GUARDADOS EXITOSAMENTE');
        console.log(`📊 Total de leads: ${existingData.length}`);
        console.log(`🆔 ID del lead: ${enhancedData.lead_id}`);
        console.log('📋 RESUMEN:');
        console.log(`   👤 ${data.nombre} | 📧 ${data.email} | 📱 ${data.telefono}`);
        console.log(`   🏥 ${data.isapre_actual} | 👥 ${data.num_cargas} cargas | 💰 ${data.rango_costo}`);
        
        // Actualizar contador de leads pendientes
        updatePendingLeadsCounter();
        
    } catch (error) {
        console.error('❌ Error guardando en localStorage:', error);
    }
}

// Función para mostrar datos guardados localmente (útil para debugging)
function showLocalData() {
    try {
        const storageKey = 'planespro_leads_isapre_v3';
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        console.log('📊 Datos locales guardados:');
        console.table(data);
        
        const pendingSync = data.filter(item => item.sync_status === 'pending');
        if (pendingSync.length > 0) {
            console.warn(`⚠️ ${pendingSync.length} leads pendientes de sincronización`);
        }
        
        return data;
    } catch (error) {
        console.error('❌ Error leyendo datos locales:', error);
        return [];
    }
}

// Función para actualizar contador de leads pendientes
function updatePendingLeadsCounter() {
    try {
        const storageKey = 'planespro_leads_isapre_v3';
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const pending = data.filter(item => item.sync_status === 'pending').length;
        
        if (pending > 0) {
            console.warn(`📊 ${pending} leads pendientes de sincronización con Google Sheets`);
        }
    } catch (error) {
        console.error('Error actualizando contador:', error);
    }
}

// Función para intentar reenviar datos pendientes
async function resyncPendingData() {
    try {
        const storageKey = 'planespro_leads_isapre_v3';
        const data = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const pending = data.filter(item => item.sync_status === 'pending');
        
        if (pending.length === 0) {
            console.log('✅ No hay datos pendientes de sincronización');
            return;
        }
        
        console.log(`🔄 Intentando reenviar ${pending.length} leads pendientes...`);
        
        for (const lead of pending) {
            const success = await sendToGoogleSheets(lead);
            if (success) {
                // Marcar como sincronizado
                const index = data.findIndex(item => 
                    item.timestamp === lead.timestamp && 
                    item.email === lead.email
                );
                if (index !== -1) {
                    data[index].sync_status = 'synced';
                }
            }
        }
        
        localStorage.setItem(storageKey, JSON.stringify(data));
        updatePendingLeadsCounter();
        
    } catch (error) {
        console.error('❌ Error en resincronización:', error);
    }
}

// =========================================
// MODALES Y MENSAJES
// =========================================
function showSuccessModal() {
    // Cerrar el formulario modal primero
    const formModal = document.getElementById('formModal');
    if (formModal) {
        formModal.style.display = 'none';
    }
    
    // Mostrar modal de éxito
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Agregar confetti effect (opcional)
        createConfettiEffect();
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        
        // Si es el modal de éxito, resetear completamente el formulario
        if (modalId === 'successModal') {
            resetFormCompletely();
        }
    }
}

// Función para resetear completamente el formulario y su estado
function resetFormCompletely() {
    const form = document.getElementById('leadForm');
    if (form) {
        // Resetear formulario
        form.reset();
        
        // Limpiar validaciones
        clearFormValidation(form);
        
        // Asegurar que el botón vuelva a su estado original
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Obtener Análisis Gratuito';
            submitButton.disabled = false;
        }
        
        // Limpiar clases de loading
        form.classList.remove('form-loading');
        
        // Resetear estado global
        AppState.isFormSubmitting = false;
    }
}

function showErrorMessage() {
    alert('Hubo un error al enviar tu solicitud. Por favor intenta nuevamente o contáctanos directamente por WhatsApp al +56 9 1234 5678');
}

function createConfettiEffect() {
    // Efecto simple de confetti para celebrar envío exitoso
    const colors = ['#28a745', '#1a4480', '#007bff', '#20c997'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                pointer-events: none;
                animation: confettiFall 3s linear forwards;
                z-index: 3000;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                if (confetti.parentNode) confetti.parentNode.removeChild(confetti);
            }, 3000);
        }, i * 50);
    }
}

// CSS para confetti
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    .toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--color-white);
        color: var(--color-gray-900);
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 2000;
        border-left: 4px solid var(--color-info);
    }
    
    .toast.toast-warning {
        border-left-color: var(--color-warning);
    }
    
    .toast.show {
        transform: translateX(0);
    }
`;
document.head.appendChild(confettiStyle);

// Cerrar modal al hacer click fuera
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        const modalId = event.target.id;
        closeModal(modalId);
    }
});

// Cerrar modal con tecla Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal[style*="display: block"]');
        openModals.forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// =========================================
// ANIMACIONES DE SCROLL
// =========================================
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos que necesitan animación
    const animatedElements = document.querySelectorAll('.step, .caso-card, .testimonio-card, .asesor-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}



// =========================================
// ANALYTICS Y TRACKING V2
// =========================================
function trackEvent(eventName, category, label = '') {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: category,
                event_label: label
            });
        }
        
        console.log(`📈 Evento registrado: ${eventName} - ${category}`);
        
    } catch (error) {
        console.error('❌ Error registrando evento:', error);
    }
}

function trackConversion(eventName, data) {
    try {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'lead_generation_v2',
                event_label: 'isapre_analysis_v2',
                isapre_actual: data.isapre_actual,
                numero_cargas: data.num_cargas,
                rango_costo: data.rango_costo,
                perfil_recomendado: data.perfil_recomendado
            });
        }
        
        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', 'Lead', {
                content_category: 'isapre_analysis_v2',
                content_name: 'Análisis Isapre Personalizado V2',
                value: 1,
                currency: 'CLP',
                custom_data: {
                    perfil: data.perfil_recomendado,
                    cargas: data.num_cargas
                }
            });
        }
        
        console.log(`📈 Conversión V2 registrada: ${eventName}`);
        
    } catch (error) {
        console.error('❌ Error registrando conversión:', error);
    }
}

// =========================================
// WHATSAPP INTEGRATION
// =========================================
function generateWhatsAppMessage(data = {}) {
    const baseMessage = "Hola, quiero analizar mi plan de Isapre";
    
    if (Object.keys(data).length === 0) {
        return baseMessage;
    }
    
    const details = [];
    if (data.isapre_actual) details.push(`• Isapre actual: ${data.isapre_actual}`);
    if (data.num_cargas) details.push(`• Número de cargas: ${data.num_cargas}`);
    if (data.rango_costo) details.push(`• Rango de costo: ${data.rango_costo}`);
    
    return `${baseMessage}\n\n${details.join('\n')}`;
}

// =========================================
// UTILIDADES
// =========================================
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

function isMobile() {
    return window.innerWidth <= 768;
}

// Debug: Mostrar datos guardados localmente
function showLocalData() {
    const data = JSON.parse(localStorage.getItem('planespro_leads_isapre_v2') || '[]');
    console.log('📊 Leads V2 guardados localmente:', data);
    return data;
}

// =========================================
// CALCULADORA DE AHORRO ESTIMADO V2
// =========================================
function calcularAhorroEstimadoV2() {
    const isapreActual = document.getElementById('isapre_actual')?.value;
    const cargas = parseInt(document.getElementById('num_cargas')?.value) || 0;
    const rango = document.getElementById('rango_costo')?.value;
    
    if (!isapreActual || !rango) return null;
    
    // Obtener monto promedio del rango
    const montoPromedio = obtenerMontoPromedio(rango);
    
    // Factores de optimización V2 basados en investigación
    const factoresOptimizacion = {
        'Fonasa': cargas >= 3 ? 0 : 0.40,  // No cambiar si muchas cargas
        'Banmédica': 0.30,
        'Vida Tres': 0.35,
        'Colmena Golden Cross': 0.25,
        'Cruz Blanca': 0.40,
        'Nueva Masvida': 0.20,
        'Consalud': 0.25
    };
    
    // Ajustar por número de cargas
    let factor = factoresOptimizacion[isapreActual] || 0.25;
    if (cargas >= 3) factor *= 0.7; // Menor ahorro con muchas cargas
    if (cargas === 0) factor *= 1.2; // Mayor ahorro sin cargas
    
    const ahorroEstimado = Math.round(montoPromedio * factor);
    
    return {
        montoActual: montoPromedio,
        ahorroEstimado: ahorroEstimado,
        porcentajeAhorro: Math.round(factor * 100),
        recomendacion: ahorroEstimado > 50000 ? 'Probable beneficio' : 'Evaluar caso específico'
    };
}

function obtenerMontoPromedio(rango) {
    const rangos = {
        '<100000': 75000,
        '100000-150000': 125000,
        '150000-200000': 175000,
        '200000-250000': 225000,
        '250000-300000': 275000,
        '300000-350000': 325000,
        '350000-400000': 375000,
        '>400000': 450000
    };
    
    return rangos[rango] || 200000;
}

// =========================================
// NUEVAS FUNCIONALIDADES HERO OPTIMIZADO
// =========================================

// Calculator de Ahorro Interactivo
function calculateSavings() {
    const currentPayment = document.getElementById('current-payment');
    const paymentDisplay = document.getElementById('payment-display');
    const potentialSavings = document.getElementById('potential-savings');
    const annualSavings = document.getElementById('annual-savings');
    
    if (!currentPayment || !paymentDisplay || !potentialSavings || !annualSavings) return;
    
    const payment = parseInt(currentPayment.value);
    
    // Mostrar pago actual formateado
    paymentDisplay.textContent = `$${payment.toLocaleString('es-CL')}`;
    
    // Calcular ahorro basado en porcentajes realistas
    let savingsPercentage;
    if (payment <= 80000) {
        savingsPercentage = 0.15; // 15% para pagos bajos
    } else if (payment <= 150000) {
        savingsPercentage = 0.25; // 25% para pagos medios
    } else if (payment <= 250000) {
        savingsPercentage = 0.30; // 30% para pagos altos
    } else {
        savingsPercentage = 0.35; // 35% para pagos muy altos
    }
    
    const monthlySavings = Math.round(payment * savingsPercentage);
    const annualAmount = monthlySavings * 12;
    
    // Actualizar displays
    potentialSavings.textContent = `$${monthlySavings.toLocaleString('es-CL')}`;
    annualSavings.textContent = `$${annualAmount.toLocaleString('es-CL')}`;
}

// Carrusel de Logos Automático Mejorado
function initializeLogosCarousel() {
    const allLogos = [
        { src: 'nuevamasvida.png', name: 'Nueva Masvida', featured: true },
        { src: 'consalud.png', name: 'Consalud', featured: true },
        { src: 'fonasa.png', name: 'Fonasa', featured: false },
        { src: 'banmedica-logo.png', name: 'Banmédica', featured: false },
        { src: 'colmena.png', name: 'Colmena', featured: false },
        { src: 'cruzblanca.png', name: 'Cruz Blanca', featured: false },
        { src: 'vidatres.png', name: 'Vida Tres', featured: false },
        { src: 'esencial.png', name: 'Esencial', featured: false }
    ];
    
    const logoElements = [
        document.getElementById('logo1'),
        document.getElementById('logo2'),
        document.getElementById('logo3')
    ];
    
    if (!logoElements[0] || !logoElements[1] || !logoElements[2]) return;
    
    let currentCycle = 0;
    
    function rotateLogos() {
        let selectedLogos = [];
        
        // Lógica: cada 2 cambios, al menos uno debe ser Nueva Masvida o Consalud
        if (currentCycle % 2 === 0) {
            // En ciclos pares, incluir Nueva Masvida o Consalud
            const featuredLogo = allLogos[currentCycle % 2]; // Alterna entre Nueva Masvida y Consalud
            selectedLogos.push(featuredLogo);
            
            // Completar con otros logos aleatorios
            const otherLogos = allLogos.filter(logo => logo !== featuredLogo);
            const shuffled = otherLogos.sort(() => 0.5 - Math.random()).slice(0, 2);
            selectedLogos = selectedLogos.concat(shuffled);
        } else {
            // En ciclos impares, puede ser cualquier combinación
            selectedLogos = allLogos.sort(() => 0.5 - Math.random()).slice(0, 3);
        }
        
        // Aplicar logos con efectos de transición
        logoElements.forEach((element, index) => {
            element.style.opacity = '0';
            
            setTimeout(() => {
                const logo = selectedLogos[index];
                element.src = `/img/logos_isapres/${logo.src}`;
                element.alt = logo.name;
                
                // Aplicar clase featured para Nueva Masvida y Consalud
                if (logo.featured) {
                    element.classList.add('featured');
                } else {
                    element.classList.remove('featured');
                }
                
                element.style.opacity = logo.featured ? '0.9' : '0.4';
            }, 200);
        });
        
        currentCycle++;
    }
    
    // Inicializar con Nueva Masvida y Consalud prominentes
    function initializeFirstDisplay() {
        logoElements[0].src = '/img/logos_isapres/nuevamasvida.png';
        logoElements[0].alt = 'Nueva Masvida';
        logoElements[0].classList.add('featured');
        
        logoElements[1].src = '/img/logos_isapres/consalud.png';
        logoElements[1].alt = 'Consalud';
        logoElements[1].classList.add('featured');
        
        logoElements[2].src = '/img/logos_isapres/fonasa.png';
        logoElements[2].alt = 'Fonasa';
        logoElements[2].classList.remove('featured');
    }
    
    // Inicializar inmediatamente
    initializeFirstDisplay();
    
    // Rotar cada 4 segundos
    setInterval(rotateLogos, 4000);
}

// Banner Rotativo de Urgencia
function initializeUrgencyBanner() {
    const messages = [
        "Mientras evalúas, otros ya optimizaron su plan y están ahorrando $45k mensuales en promedio",
        "Si ganas más de 1.000.000 $ y estás en Fonasa, podrías estar perdiendo muchos beneficios"
    ];
    
    const bannerElement = document.getElementById('urgency-message');
    
    if (!bannerElement) return;
    
    function updateMessage() {
        // Cambiar cada 72 horas (72 * 60 * 60 * 1000 ms)
        const messageIndex = Math.floor(Date.now() / (72 * 60 * 60 * 1000)) % messages.length;
        
        // Efecto de transición suave
        bannerElement.style.opacity = '0';
        
        setTimeout(() => {
            bannerElement.textContent = messages[messageIndex];
            bannerElement.style.opacity = '1';
        }, 300);
    }
    
    // Inicializar mensaje
    updateMessage();
    
    // Verificar cambio cada hora (por si el usuario mantiene la página abierta mucho tiempo)
    setInterval(updateMessage, 60 * 60 * 1000);
}

// Inicializar todas las nuevas funcionalidades
function initializeNewHeroFeatures() {
    console.log('🚀 Inicializando funcionalidades Hero optimizado...');
    
    // Calculator
    const calculatorSlider = document.getElementById('current-payment');
    if (calculatorSlider) {
        calculateSavings(); // Calcular inicial
        calculatorSlider.addEventListener('input', calculateSavings);
    }
    
    // Carrusel de logos
    initializeLogosCarousel();
    
    // Banner rotativo
    initializeUrgencyBanner();
    
    console.log('✅ Funcionalidades Hero optimizado inicializadas');
}

// Agregar a la inicialización principal
document.addEventListener('DOMContentLoaded', function() {
    // Dar tiempo a que carguen todos los elementos
    setTimeout(initializeNewHeroFeatures, 500);
});

// =========================================
// EXPORT PARA TESTING
// =========================================
window.PlanesProIsapreV2 = {
    showCaso,
    nextCaso,
    prevCaso,
    showTestimonios,
    nextTestimonios,
    prevTestimonios,
    openFormModal,
    closeModal,
    sendToGoogleSheets,
    showLocalData,
    trackConversion,
    trackEvent,
    calcularAhorroEstimadoV2,
    generateWhatsAppMessage,
    analizarPerfilAutomatico,
    calculateSavings,
    initializeLogosCarousel,
    initializeUrgencyBanner,
    initializeNewHeroFeatures
};

console.log('✅ PlanesPro Isapre V2 - JavaScript cargado correctamente');