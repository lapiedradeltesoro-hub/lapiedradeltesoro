document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Acordeón unificado para Talleres y Preguntas Frecuentes
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            const isActive = item.classList.contains('active');

            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // 2. CÁLCULO EN TIEMPO REAL DEL TOTAL, TALLERES, TRANSPORTE Y ANTICIPO
    const inputCantidad = document.getElementById('cantidad');
    const inputsTalleres = document.querySelectorAll('.taller-input');
    const inputsTransporte = document.querySelectorAll('.transporte-input');
    
    const txtSubtotalAccesos = document.getElementById('txtSubtotalAccesos');
    const txtTotalTalleres = document.getElementById('txtTotalTalleres');
    const txtTotalTransporte = document.getElementById('txtTotalTransporte');
    const txtTotal = document.getElementById('txtTotal');
    const txtAnticipo = document.getElementById('txtAnticipo');

    function actualizarCalculo() {
        let cantidad = parseInt(inputCantidad.value) || 0;
        if (cantidad < 1) cantidad = 1; // Evita números negativos o vacíos
        
        const precioUnitario = 590;
        const subtotalAccesos = cantidad * precioUnitario;

        // Calcular talleres extras
        let sumaTalleres = 0;
        inputsTalleres.forEach(input => {
            let cantidadTaller = parseInt(input.value) || 0;
            let precioTaller = parseInt(input.getAttribute('data-precio')) || 0;
            sumaTalleres += (cantidadTaller * precioTaller);
        });

        // Calcular transporte
        let sumaTransporte = 0;
        inputsTransporte.forEach(input => {
            let cantidadTrans = parseInt(input.value) || 0;
            let precioTrans = parseInt(input.getAttribute('data-precio')) || 0;
            sumaTransporte += (cantidadTrans * precioTrans);
        });

        const totalGeneral = subtotalAccesos + sumaTalleres + sumaTransporte;
        const anticipo = totalGeneral / 2; // 50%

        // Actualizar textos en pantalla de forma segura
        if (txtSubtotalAccesos) txtSubtotalAccesos.textContent = `$${subtotalAccesos.toLocaleString()} MXN`;
        if (txtTotalTalleres) txtTotalTalleres.textContent = `$${sumaTalleres.toLocaleString()} MXN`;
        if (txtTotalTransporte) txtTotalTransporte.textContent = `$${sumaTransporte.toLocaleString()} MXN`;
        if (txtTotal) txtTotal.textContent = `$${totalGeneral.toLocaleString()} MXN`;
        if (txtAnticipo) txtAnticipo.textContent = `$${anticipo.toLocaleString()} MXN`;
    }

    // Escuchar eventos en accesos
    if (inputCantidad) {
        inputCantidad.addEventListener('input', actualizarCalculo);
        inputCantidad.addEventListener('change', actualizarCalculo);
    }

    // Escuchar eventos en talleres
    inputsTalleres.forEach(input => {
        input.addEventListener('input', actualizarCalculo);
        input.addEventListener('change', actualizarCalculo);
    });

    // Escuchar eventos en transporte
    inputsTransporte.forEach(input => {
        input.addEventListener('input', actualizarCalculo);
        input.addEventListener('change', actualizarCalculo);
    });

    // 3. Envío del formulario hacia el Webhook de Make.com
    const registrationForm = document.getElementById('registrationForm');
    
    if (registrationForm) {
        registrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let cantidad = parseInt(document.getElementById('cantidad').value) || 1;
            const precioUnitario = 590;
            const subtotalAccesos = cantidad * precioUnitario;

            // Recopilar detalle de talleres
            let detalleTalleres = [];
            let sumaTalleres = 0;
            inputsTalleres.forEach(input => {
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    let nombre = input.getAttribute('data-nombre');
                    detalleTalleres.push(`${val}x ${nombre}`);
                    sumaTalleres += val * parseInt(input.getAttribute('data-precio'));
                }
            });

            // Recopilar detalle de transporte
            let detalleTransporte = [];
            let sumaTransporte = 0;
            inputsTransporte.forEach(input => {
                let val = parseInt(input.value) || 0;
                if (val > 0) {
                    let nombre = input.getAttribute('data-nombre');
                    detalleTransporte.push(`${val}x ${nombre}`);
                    sumaTransporte += val * parseInt(input.getAttribute('data-precio'));
                }
            });

            const totalGeneral = subtotalAccesos + sumaTalleres + sumaTransporte;
            const anticipo = totalGeneral / 2;

            const formData = {
                nombre: document.getElementById('nombre').value,
                telefono: document.getElementById('telefono').value,
                correo: document.getElementById('correo').value,
                cantidadAccesos: cantidad,
                talleresExtras: detalleTalleres.length > 0 ? detalleTalleres.join(', ') : 'Ninguno',
                transporte: detalleTransporte.length > 0 ? detalleTransporte.join(', ') : 'Ninguno',
                total: totalGeneral,
                anticipo: anticipo,
                fechaRegistro: new Date().toLocaleString()
            };

            const makeWebhookURL = "https://hook.us2.make.com/zttfq2sw3wq6t99533xxtu9mw9lz753t";

            fetch(makeWebhookURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            .then(response => {
                document.getElementById('registrationForm').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
            })
            .catch(error => {
                document.getElementById('registrationForm').style.display = 'none';
                document.getElementById('success-message').style.display = 'block';
            });
        });
    }

    // 4. CONTROL DE AUDIO (Integrado de forma segura al cargar la página)
    const btnAudio = document.getElementById('btnAudio');
    const audio = document.getElementById('musicaFondo');
    const icono = document.getElementById('iconoBocina');
    const texto = document.getElementById('textoAudio');

    if (btnAudio && audio) {
        btnAudio.addEventListener('click', function() {
            if (audio.paused) {
                audio.play().then(() => {
                    if (icono) icono.textContent = "🔊";
                    if (texto) texto.textContent = "Silenciar";
                }).catch(e => {
                    console.log("El navegador bloqueó la reproducción automática.");
                });
            } else {
                audio.pause();
                if (icono) icono.textContent = "🔇";
                if (texto) texto.textContent = "Activar Sonido";
            }
        });
    }

});