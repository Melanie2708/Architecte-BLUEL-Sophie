async function recupererProjets (){
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();
return projets;
}

//Fonction pour afficher les travaux
function afficherProjets(projets){
    for (let i = 0; i < projets.length; i++) {
        const projet = projets [i];
        // Récupération de l'élément
        const divGallery=document.querySelector(".gallery");
        //Création de la figure
        const figure = document.createElement ("figure");
        const imageFigure = document.createElement("img");
        imageFigure.src = projet.imageUrl;
        imageFigure.alt = projet.title;
        const caption = document.createElement("figcaption");
        caption.innerText= projet.title;

        divGallery.appendChild(figure);
		figure.appendChild(imageFigure);
		figure.appendChild(caption);
}}
recupererProjets().then(projets =>{afficherProjets(projets);});

//Fonction pour les filtres

const btnObjets = document.querySelector(".btnObjets");

