let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (event) {
  event.preventDefault();
  modal = document.querySelector(event.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

const closeModal = function (event) {
  if (modal === null) return;
  event.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  modal = null;
};

//Fonction pour que le modal ne se ferme pas au clic à l'intérieur
const stopPropagation = function (event) {
  event.stopPropagation();
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

//Fermer le modal avec Echap
window.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "esc") {
    closeModal(event);
  }
  if (event.key === "Tab" && modal !== null) {
    focusInModal(event);
  }
});

//Récupération de la galerie
async function recupererGallery() {
  const reponse = await fetch("http://localhost:5678/api/works/");
  const projets = await reponse.json();
  console.log(projets);
  return projets;
}

function afficherGallery(projets) {
  // Récupération de l'élément
  const divGallery = document.querySelector(".galleryModal");
  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];

    const divGalleryItem = document.createElement("galleryItem");
    divGallery.appendChild(divGalleryItem);
    divGalleryItem.classList.add("galleryItem");
    const imageGallery = document.createElement("img");
    imageGallery.src = projet.imageUrl;
    divGalleryItem.appendChild(imageGallery);

    const iconeGallery = document.createElement("i");
    iconeGallery.classList.add("fa-solid");
    iconeGallery.classList.add("fa-trash-can");
    iconeGallery.classList.add("iconeGallery");
    divGalleryItem.appendChild(iconeGallery);
  }
}
//Fonction pour changer de modal
function cacherDiv() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "none";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "block";
}

function afficherAjout() {
  const buttonAjouterPhoto = document.querySelector(".ajouterPhoto");
  buttonAjouterPhoto.addEventListener("click", function (event) {
    event.preventDefault();
    cacherDiv();
  });
}

//Fonction de retour
function afficherDiv() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "block";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "none";
}

function retour() {
  const boutonRetour = document.querySelector(".return");
  boutonRetour.addEventListener("click", function (event) {
    afficherDiv();
  });
}

recupererGallery().then((projets) => {
  afficherGallery(projets);
});
afficherAjout();
retour();
