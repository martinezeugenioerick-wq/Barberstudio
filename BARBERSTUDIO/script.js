// ==========================
// CARGAR PRECIOS
// ==========================

async function cargarPrecios() {

    if (!window.db) {
        console.error("Supabase no está conectado.");
        return;
    }

    const { data, error } = await window.db
        .from("precios")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error cargando precios:", error);
        return;
    }

    const lista = document.getElementById("listaPrecios");

    if (!lista) {
        console.warn("No existe el elemento #listaPrecios");
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {
        lista.innerHTML = "<p>No hay precios registrados.</p>";
        return;
    }

    data.forEach(item => {

        lista.innerHTML += `
            <div class="precio-card">

                <h3>${item.servicio ?? ""}</h3>

                <h2>$${item.precio ?? "0"}</h2>

            </div>
        `;

    });

}


// ==========================
// CARGAR GALERÍA DE CORTES
// ==========================

async function cargarGaleria() {

    console.log("Cargando cortes...");

    if (!window.db) {
        console.error("Supabase no está conectado.");
        return;
    }

    const { data, error } = await window.db
        .from("cortes")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error cargando cortes:", error);
        return;
    }

    console.log("Cortes encontrados:", data);

    const galeria = document.getElementById("galeriaCortes");

    if (!galeria) {
        console.error("No existe el elemento #galeriaCortes");
        return;
    }

    galeria.innerHTML = "";

    if (!data || data.length === 0) {

        galeria.innerHTML = `
            <p>No hay cortes registrados.</p>
        `;

        return;
    }

    data.forEach(corte => {

        const imagen = corte.imagen || "";
        const nombre = corte.nombre || "Corte";
        const categoria = corte.categoria || "";

        galeria.innerHTML += `
            <div class="foto">

                <img
                    src="${imagen}"
                    alt="${nombre}"
                    loading="lazy"
                    onclick="abrirImagen('${imagen}')"
                    onerror="this.style.display='none'"
                >

                <h3>${nombre}</h3>

                <p>${categoria}</p>

            </div>
        `;

    });

    console.log("Galería cargada correctamente.");

}


// ==========================
// MODAL DE IMAGEN
// ==========================

function abrirImagen(imagen) {

    const modal = document.getElementById("modalImagen");
    const imagenGrande = document.getElementById("imagenGrande");

    if (!modal || !imagenGrande) {
        console.warn("No existe el modal de imagen.");
        return;
    }

    imagenGrande.src = imagen;
    modal.style.display = "flex";

}


// ==========================
// CERRAR MODAL
// ==========================

function cerrarModal() {

    const modal = document.getElementById("modalImagen");

    if (modal) {
        modal.style.display = "none";
    }

}


// ==========================
// CONFIGURAR BOTÓN DEL MODAL
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const cerrar = document.getElementById("cerrarModal");

    if (cerrar) {
        cerrar.addEventListener("click", cerrarModal);
    }

});


// ==========================
// CARGAR OPINIONES
// ==========================

async function cargarOpiniones() {

    if (!window.db) {
        console.error("Supabase no está conectado.");
        return;
    }

    const { data, error } = await window.db
        .from("opiniones")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error cargando opiniones:", error);
        return;
    }

    const lista = document.getElementById("listaOpiniones");

    if (!lista) {
        console.warn("No existe el elemento #listaOpiniones");
        return;
    }

    lista.innerHTML = "";

    if (!data || data.length === 0) {

        lista.innerHTML = `
            <p>No hay opiniones todavía.</p>
        `;

        return;
    }

    data.forEach(opinion => {

        lista.innerHTML += `
            <div class="card">

                <h3>${opinion.nombre ?? "Cliente"}</h3>

                <p>⭐ ${opinion.calificacion ?? 5}</p>

                <p>${opinion.comentario ?? ""}</p>

            </div>
        `;

    });

}


// ==========================
// GUARDAR CITA
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const formCita = document.getElementById("formCita");

    if (!formCita) {
        console.warn("No existe el formulario #formCita");
        return;
    }

    formCita.addEventListener("submit", async function (e) {

        e.preventDefault();

        if (!window.db) {
            alert("Error: Supabase no está conectado.");
            return;
        }

        const nombre = document.getElementById("nombre")?.value || "";
        const telefono = document.getElementById("telefono")?.value || "";
        const servicio = document.getElementById("servicio")?.value || "";
        const fecha = document.getElementById("fecha")?.value || "";
        const hora = document.getElementById("hora")?.value || "";

        const { error } = await window.db
            .from("citas")
            .insert([{
                nombre,
                telefono,
                servicio,
                fecha,
                hora,
                estado: "Pendiente"
            }]);

        if (error) {

            console.error("Error guardando cita:", error);

            alert("Error al guardar la cita.");

            return;
        }

        alert("✅ Cita enviada correctamente.");

        formCita.reset();

    });

});


// ==========================
// INICIAR
// ==========================

window.addEventListener("load", () => {

    console.log("Iniciando Barberstudio...");

    cargarPrecios();
    cargarGaleria();
    cargarOpiniones();

});


// ==========================
// SWIPER
// ==========================

window.addEventListener("load", () => {

    if (typeof Swiper !== "undefined") {

        const hero = document.querySelector(".heroSwiper");

        if (hero) {

            new Swiper(".heroSwiper", {

                loop: true,

                autoplay: {
                    delay: 3500,
                    disableOnInteraction: false
                },

                effect: "fade",

                speed: 1000

            });

            console.log("Swiper iniciado correctamente.");

        }

    } else {

        console.warn(
            "Swiper no está cargado. El sitio continuará funcionando sin el slider."
        );

    }

});


// ==========================
// BOTÓN IR ARRIBA
// ==========================

window.addEventListener("DOMContentLoaded", () => {

    const btnArriba = document.getElementById("btnArriba");

    if (!btnArriba) {
        console.warn("No existe el botón #btnArriba");
        return;
    }

    window.addEventListener("scroll", () => {

        if (window.scrollY > 300) {

            btnArriba.style.display = "block";

        } else {

            btnArriba.style.display = "none";

        }

    });

    btnArriba.addEventListener("click", () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

});


// ==========================
// SERVICE WORKER
// ==========================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("sw.js")
            .then(() => {

                console.log("Service Worker instalado.");

            })
            .catch(error => {

                console.warn(
                    "No se pudo instalar el Service Worker:",
                    error
                );

            });

    });

}
