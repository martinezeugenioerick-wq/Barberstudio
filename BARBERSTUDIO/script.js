// ==========================
// CARGAR PRECIOS
// ==========================

async function cargarPrecios(){

    const { data, error } = await window.db
        .from("precios")
        .select("*")
        .order("id");

    if(error){
        console.log(error);
        return;
    }

    const lista = document.getElementById("listaPrecios");

    lista.innerHTML = "";

    data.forEach(item=>{

        lista.innerHTML += `

        <div class="precio-card">

            <h3>${item.servicio}</h3>

            <h2>$${item.precio}</h2>

        </div>

        `;

    });

}

// ==========================
// CARGAR GALERÍA
// ==========================

async function cargarGaleria() {

    console.log("Cargando cortes...");

    const { data, error } = await window.db
        .from("cortes")
        .select("*")
        .order("id", { ascending: false });

    console.log("Cortes encontrados:", data);
    console.log("Error:", error);

    if (error) {
        console.error("Error cargando cortes:", error);
        return;
    }

    const galeria = document.getElementById("galeriaCortes");

    if (!galeria) {
        console.error("No existe el elemento galeriaCortes");
        return;
    }

    galeria.innerHTML = "";

    if (!data || data.length === 0) {
        galeria.innerHTML = "<p>No hay cortes registrados.</p>";
        return;
    }

    data.forEach(corte => {

        galeria.innerHTML += `
            <div class="foto">
                <img 
                    src="${corte.imagen}" 
                    alt="${corte.nombre}"
                    style="width:100%;"
                >

                <h3>${corte.nombre}</h3>
                <p>${corte.categoria}</p>
            </div>
        `;

    });

}

// ==========================
// MODAL IMAGEN
// ==========================

function abrirImagen(imagen){

    document.getElementById("modalImagen").style.display="flex";

    document.getElementById("imagenGrande").src=imagen;

}

document.getElementById("cerrarModal").onclick=function(){

    document.getElementById("modalImagen").style.display="none";

}

// ==========================
// CARGAR OPINIONES
// ==========================

async function cargarOpiniones(){

    const { data, error } = await window.db
        .from("opiniones")
        .select("*")
        .order("id",{ascending:false});

    if(error){
        console.log(error);
        return;
    }

    const lista = document.getElementById("listaOpiniones");

    lista.innerHTML = "";

    data.forEach(opinion=>{

        lista.innerHTML += `

        <div class="card">

            <h3>${opinion.nombre}</h3>

            <p>⭐ ${opinion.calificacion}</p>

            <p>${opinion.comentario}</p>

        </div>

        `;

    });

}

// ==========================
// GUARDAR CITA
// ==========================

document.getElementById("formCita").addEventListener("submit", async function(e){

    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const servicio = document.getElementById("servicio").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    const { error } = await window.db
        .from("citas")
        .insert([{
            nombre,
            telefono,
            servicio,
            fecha,
            hora,
            estado:"Pendiente"
        }]);

    if(error){
        alert("Error al guardar la cita");
        console.log(error);
        return;
    }

    alert("✅ Cita enviada correctamente");

    document.getElementById("formCita").reset();

});

// ==========================
// INICIAR
// ==========================

window.onload = function(){

    cargarPrecios();
    cargarGaleria();
    cargarOpiniones();

};

new Swiper(".heroSwiper",{

    loop:true,

    autoplay:{
        delay:3500,
        disableOnInteraction:false
    },

    effect:"fade",

    speed:1000

});

const btnArriba = document.getElementById("btnArriba");

window.addEventListener("scroll",()=>{

    if(window.scrollY > 300){

        btnArriba.style.display="block";

    }else{

        btnArriba.style.display="none";

    }

});

btnArriba.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker.register("sw.js")
        .then(() => {

            console.log("Service Worker instalado");

        })
        .catch(err => console.log(err));

    });

}
