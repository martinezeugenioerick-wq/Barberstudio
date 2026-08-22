// ============================
// CAMBIAR DE SECCIÓN
// ============================

function mostrar(id){

    document.querySelectorAll(".pagina").forEach(pagina=>{
        pagina.classList.remove("activa");
    });

    document.getElementById(id).classList.add("activa");

}

// ============================
// DASHBOARD
// ============================

async function cargarDashboard(){

    if(!window.db) return;


    // ============================
    // TRABAJOS
    // ============================

    const { count: fotos, error: errorFotos } =
        await window.db
        .from("cortes")
        .select("*", {
            count: "exact",
            head: true
        });

    if(errorFotos){
        console.log("Error contando trabajos:", errorFotos);
    }

    const totalFotos =
        document.getElementById("totalFotos");

    if(totalFotos){
        totalFotos.textContent = fotos || 0;
    }


    // ============================
    // CITAS
    // ============================

    const { count: citas, error: errorCitas } =
        await window.db
        .from("citas")
        .select("*", {
            count: "exact",
            head: true
        });

    if(errorCitas){
        console.log("Error contando citas:", errorCitas);
    }

    const totalCitas =
        document.getElementById("totalCitas");

    if(totalCitas){
        totalCitas.textContent = citas || 0;
    }


    // ============================
    // OPINIONES
    // ============================

    const { count: opiniones, error: errorOpiniones } =
        await window.db
        .from("opiniones")
        .select("*", {
            count: "exact",
            head: true
        });

    if(errorOpiniones){
        console.log(
            "Error contando opiniones:",
            errorOpiniones
        );
    }

    const totalOpiniones =
        document.getElementById("totalOpiniones");

    if(totalOpiniones){
        totalOpiniones.textContent =
            opiniones || 0;
    }


    // ============================
    // SERVICIOS
    // ============================

    const { count: servicios, error: errorServicios } =
        await window.db
        .from("precios")
        .select("*", {
            count: "exact",
            head: true
        });

    if(errorServicios){
        console.log(
            "Error contando servicios:",
            errorServicios
        );
    }

    const totalServicios =
        document.getElementById("totalServicios");

    if(totalServicios){
        totalServicios.textContent =
            servicios || 0;
    }

}

// ============================
// GALERÍA
// ============================

async function guardarCorte(){

    const nombre=document.getElementById("nombre").value;

    const categoria=document.getElementById("categoria").value;

    const archivo=document.getElementById("foto").files[0];

    if(!archivo){

        alert("Selecciona una imagen");

        return;

    }

    const nombreArchivo=Date.now()+"_"+archivo.name;

    const {error:errorSubida}=await window.db.storage

    .from("cortes")

    .upload(nombreArchivo, archivo, {
    upsert: true,
    contentType: archivo.type
    });

    if(errorSubida){
    alert(
        "ERROR SUPABASE\n\n" +
        "Mensaje: " + errorSubida.message +
        "\nCódigo: " + errorSubida.statusCode
    );
    console.error(errorSubida);
    return;

    }

    const {data}=window.db.storage

    .from("cortes")

    .getPublicUrl(nombreArchivo);

    const imagen=data.publicUrl;

    const {error}=await window.db

    .from("cortes")

    .insert([{

        nombre,

        categoria,

        imagen

    }]);

    if(error){

        console.log(error);

        alert("Error");

        return;

    }

    alert("Trabajo publicado");

    cargarDashboard();

    cargarCortes();

}
// ============================
// CARGAR GALERÍA
// ============================

async function cargarCortes(){

    const { data, error } = await window.db
    .from("cortes")
    .select("*")
    .order("id",{ascending:false});

    if(error){
        console.log(error);
        return;
    }

    const lista=document.getElementById("listaCortes");

    lista.innerHTML="";

    data.forEach(corte=>{

        lista.innerHTML+=`

        <div class="corte">

            <img src="${corte.imagen}" alt="${corte.nombre}">

            <div class="info">

                <h3>${corte.nombre}</h3>

                <p>${corte.categoria}</p>

                <button onclick="eliminarCorte(${corte.id},'${corte.imagen}')">

                    🗑 Eliminar

                </button>

            </div>

        </div>

        `;

    });

}

// ============================
// ELIMINAR CORTE
// ============================

async function eliminarCorte(id,imagen){

    if(!confirm("¿Eliminar este trabajo?")) return;

    const { error } = await window.db
    .from("cortes")
    .delete()
    .eq("id",id);

    if(error){

        alert("No se pudo eliminar");

        console.log(error);

        return;

    }

    const nombreArchivo=decodeURIComponent(imagen.split("/").pop());

    await window.db.storage

    .from("cortes")

    .remove([nombreArchivo]);

    cargarDashboard();

    cargarCortes();

}

// ============================
// CARGAR CITAS
// ============================

async function cargarCitas(){

    const { data, error } = await window.db
        .from("citas")
        .select("*")
        .order("id", { ascending:false });

    if(error){

        console.log("Error cargando citas:", error);

        return;
    }

    const lista =
        document.getElementById("listaCitas");

    lista.innerHTML = "";

    if(!data || data.length === 0){

        lista.innerHTML = `
            <div class="card">
                <p>No hay citas registradas.</p>
            </div>
        `;

        return;
    }

    data.forEach(cita => {

        let estado = cita.estado || "Pendiente";

        let colorEstado = "";

        if(estado === "Confirmada"){
            colorEstado = "🟢";
        }
        else if(estado === "Cancelada"){
            colorEstado = "🔴";
        }
        else{
            colorEstado = "🟡";
        }

        lista.innerHTML += `

        <div class="card">

            <h3>
                ${cita.nombre}
            </h3>

            <p>
                <b>📞 Teléfono:</b>
                ${cita.telefono || "No proporcionado"}
            </p>

            <p>
                <b>✂ Servicio:</b>
                ${cita.servicio}
            </p>

            <p>
                <b>📅 Fecha:</b>
                ${cita.fecha}
            </p>

            <p>
                <b>🕐 Hora:</b>
                ${cita.hora}
            </p>

            <p>
                <b>Estado:</b>
                ${colorEstado} ${estado}
            </p>

            ${
                estado !== "Confirmada"
                ?
                `
                <button
                    onclick="confirmarCita(${cita.id})">

                    ✔ Confirmar

                </button>
                `
                :
                ""
            }

            ${
                estado !== "Cancelada"
                ?
                `
                <button
                    onclick="cancelarCita(${cita.id})">

                    ✖ Cancelar

                </button>
                `
                :
                ""
            }

            <button
                onclick="eliminarCita(${cita.id})">

                🗑 Eliminar

            </button>

        </div>

        `;

    });

}


// ============================
// CONFIRMAR CITA
// ============================

async function confirmarCita(id){

    const { error } = await window.db
        .from("citas")
        .update({
            estado: "Confirmada"
        })
        .eq("id", id);

    if(error){

        console.log("Error confirmando cita:", error);

        alert("No se pudo confirmar la cita.");

        return;
    }

    cargarCitas();

}


// ============================
// CANCELAR CITA
// ============================

async function cancelarCita(id){

    if(!confirm("¿Cancelar esta cita?")) return;

    const { error } = await window.db
        .from("citas")
        .update({
            estado: "Cancelada"
        })
        .eq("id", id);

    if(error){

        console.log("Error cancelando cita:", error);

        alert("No se pudo cancelar la cita.");

        return;
    }

    cargarCitas();

}


// ============================
// ELIMINAR CITA
// ============================

async function eliminarCita(id){

    if(!confirm("¿Eliminar esta cita definitivamente?")) return;

    const { error } = await window.db
        .from("citas")
        .delete()
        .eq("id", id);

    if(error){

        console.log("Error eliminando cita:", error);

        alert("No se pudo eliminar la cita.");

        return;
    }

    cargarDashboard();

    cargarCitas();

}

// ============================
// PRECIOS
// ============================

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

    data.forEach(precio=>{

        lista.innerHTML += `

        <div class="card">

            <h3>${precio.servicio}</h3>

            <input
            type="number"
            id="precio${precio.id}"
            value="${precio.precio}">

            <br><br>

            <button onclick="guardarPrecio(${precio.id})">

                💾 Guardar

            </button>

        </div>

        `;

    });

}

async function guardarPrecio(id){

    const nuevoPrecio =
    document.getElementById("precio"+id).value;

    const { error } = await window.db
    .from("precios")
    .update({
        precio:nuevoPrecio
    })
    .eq("id",id);

    if(error){

        alert("No se pudo guardar");

        console.log(error);

        return;

    }

    alert("Precio actualizado");

}

// ============================
// OPINIONES
// ============================

async function cargarOpiniones(){


    console.log("CARGANDO OPINIONES");
    const lista = document.getElementById("listaOpiniones");

    if(!lista || !window.db){
        return;
    }

    const { data, error } = await window.db
    .from("opiniones")
    .select("id,nombre,comentario,calificacion,aprobada")
    .order("id", { ascending: false });

console.log("DATOS:", data);
console.log("ERROR:", error);

    if(error){

        console.error("Error cargando opiniones:", error);

        lista.innerHTML = `
            <div class="card">
                <p>Error al cargar las opiniones.</p>
            </div>
        `;

        return;
    }

    if(!data || data.length === 0){

        lista.innerHTML = `
            <div class="card">
                <p>No hay opiniones todavía.</p>
            </div>
        `;

        return;
    }

    lista.innerHTML = "";

    data.forEach(opinion => {

        const estrellas =
            "⭐".repeat(opinion.calificacion || 0);

        lista.innerHTML += `

            <div class="card">

                <h3>${opinion.nombre}</h3>

                <p>${estrellas}</p>

                <p>
                    ${opinion.comentario}
                </p>

                <p>
                    ${
                        opinion.aprobada
                        ? "🟢 Aprobada"
                        : "🟡 Pendiente"
                    }
                </p>

                ${
                    opinion.aprobada
                    ? `
                        <button
                            onclick="desaprobarOpinion(${opinion.id})">
                            🟡 Quitar aprobación
                        </button>
                    `
                    : `
                        <button
                            onclick="aprobarOpinion(${opinion.id})">
                            🟢 Aprobar
                        </button>
                    `
                }

                <button
                    onclick="eliminarOpinion(${opinion.id})">
                    🗑 Eliminar
                </button>

            </div>

        `;

    });

}

// ============================
// APROBAR OPINIÓN
// ============================

async function aprobarOpinion(id){

    const { error } = await window.db
        .from("opiniones")
        .update({
            aprobada: true
        })
        .eq("id", id);

    if(error){

        console.log("Error aprobando opinión:", error);

        alert("No se pudo aprobar la opinión.");

        return;
    }

    alert("✅ Opinión aprobada correctamente.");

    cargarOpiniones();

}


// ============================
// QUITAR APROBACIÓN
// ============================

async function desaprobarOpinion(id){

    const { error } = await window.db
        .from("opiniones")
        .update({
            aprobada: false
        })
        .eq("id", id);

    if(error){

        console.log("Error:", error);

        alert("No se pudo quitar la aprobación.");

        return;
    }

    cargarOpiniones();

}


// ============================
// ELIMINAR OPINIÓN
// ============================

async function eliminarOpinion(id){

    if(!confirm("¿Eliminar opinión?")) return;

    const { error } = await window.db
        .from("opiniones")
        .delete()
        .eq("id", id);

    if(error){

        console.log("Error eliminando opinión:", error);

        alert("No se pudo eliminar la opinión.");

        return;
    }

    cargarDashboard();

    cargarOpiniones();

}

// ============================
// INICIAR PANEL
// ============================

window.onload = function(){

    cargarDashboard();

    cargarCortes();

    cargarCitas();

    cargarPrecios();

    cargarOpiniones();

}

// ===============================
// PRECIOS - BARBERSTUDIO
// ===============================

async function cargarPrecios() {

    const contenedor = document.getElementById("listaPrecios");

    if (!contenedor || !window.db) return;

    const { data, error } = await window.db
        .from("precios")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error cargando precios:", error);
        contenedor.innerHTML = "<p>No se pudieron cargar los precios.</p>";
        return;
    }

    if (!data || data.length === 0) {
        contenedor.innerHTML = "<p>No hay precios registrados.</p>";
        return;
    }

    contenedor.innerHTML = "";

    data.forEach(servicio => {

        const tarjeta = document.createElement("div");

        tarjeta.className = "precio-admin";

        tarjeta.innerHTML = `
            <div>
                <h3>${servicio.servicio}</h3>

                <strong>
                    $${Number(servicio.precio).toFixed(2)}
                </strong>
            </div>

            <button onclick="editarPrecio(${servicio.id})">
                ✏️ Editar
            </button>
        `;

        contenedor.appendChild(tarjeta);

    });

}


// ===============================
// EDITAR PRECIO
// ===============================

async function editarPrecio(id) {

    const { data, error } = await window.db
        .from("precios")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        alert("No se pudo cargar el precio.");
        return;
    }

    const nuevoServicio = prompt(
        "Nombre del servicio:",
        data.servicio
    );

    if (nuevoServicio === null) return;

    const nuevoPrecio = prompt(
        "Precio:",
        data.precio
    );

    if (nuevoPrecio === null) return;

    if (!nuevoServicio.trim() || nuevoPrecio === "") {
        alert("Completa los datos.");
        return;
    }

    const { error: errorUpdate } = await window.db
        .from("precios")
        .update({
            servicio: nuevoServicio.trim(),
            precio: Number(nuevoPrecio)
        })
        .eq("id", id);

    if (errorUpdate) {

        console.error(errorUpdate);

        alert("No se pudo actualizar el precio.");

        return;
    }

    alert("Precio actualizado correctamente.");

    cargarPrecios();

}


// ===============================
// CARGAR AL ABRIR EL PANEL
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    cargarPrecios();

});
