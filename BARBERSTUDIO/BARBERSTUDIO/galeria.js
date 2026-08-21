async function cargarGaleria(){

    const { data, error } = await window.db
        .from("cortes")
        .select("*")
        .order("id",{ascending:false});

    if(error){
        console.log(error);
        return;
    }

    const galeria=document.getElementById("galeriaPublica");

    galeria.innerHTML="";

    data.forEach(corte=>{

        galeria.innerHTML += `
<div class="card-galeria">

<img src="${corte.imagen}"
onclick="abrirImagen('${corte.imagen}')">

<h3>${corte.nombre}</h3>

<p>${corte.categoria}</p>

</div>
`;

    });

}

cargarGaleria();