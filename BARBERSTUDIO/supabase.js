// =========================
// SUBIR FOTO A SUPABASE
// =========================

const btnGuardar = document.getElementById("btnGuardar");

btnGuardar.addEventListener("click", subirFoto);

async function subirFoto() {

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value;
    const archivo = document.getElementById("imagen").files[0];

    if (!nombre || !archivo) {
        alert("Completa todos los campos.");
        return;
    }

    const nombreArchivo = Date.now() + "_" + archivo.name;

    // Subir imagen al bucket "cortes"
    const { error: errorStorage } = await supabase.storage
        .from("cortes")
        .upload(nombreArchivo, archivo);

    if (errorStorage) {
        alert("Error al subir la imagen.");
        console.error(errorStorage);
        return;
    }

    // Obtener URL pública
    const { data } = supabase.storage
        .from("cortes")
        .getPublicUrl(nombreArchivo);

    // Guardar información en la base de datos
    const { error: errorDB } = await supabase
        .from("cortes")
        .insert([
            {
                nombre: nombre,
                categoria: categoria,
                imagen: data.publicUrl
            }
        ]);

    if (errorDB) {
        alert("Error al guardar la información.");
        console.error(errorDB);
        return;
    }

    alert("✅ Foto subida correctamente.");

    document.getElementById("nombre").value = "";
    document.getElementById("imagen").value = "";
    document.getElementById("preview").style.display = "none";
}