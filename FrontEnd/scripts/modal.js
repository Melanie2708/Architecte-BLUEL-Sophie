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
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
  modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
  modal = null;
  if (closeCallback !== null) {
    closeCallback();
  }
};

export function ajoutCloseModalCallback(callback) {
  closeCallback = callback;
}

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
  divGallery.innerHTML = "";
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
    iconeGallery.id = projet.id;
    iconeGallery.addEventListener("click", function (event) {
      removeProjet(iconeGallery.id);
    });
    divGalleryItem.appendChild(iconeGallery);
  }
}

//Fonction pour supprimer un projet
async function removeProjet(projetId) {
  const url = "http://localhost:5678/api/works/" + projetId;
  const header = "Bearer " + localStorage.getItem("token");
  console.log(url);
  console.log(header);
  const reponse = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: header },
  });
  if (reponse.status === 204) {
    recupererGallery().then((projets) => {
      afficherGallery(projets);
    });
  }
}

//Fonction pour changer de modal
async function afficherAjoutPhoto() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "none";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "flex";
  document.querySelector(".return").style.display = "block";
  const categories = await recupererCategories();

  const selectCategorie = document.getElementById("categorie-ajout-photo");
  categories.forEach((categorie) => {
    const optionCategorie = document.createElement("option");
    optionCategorie.value = categorie.id;
    optionCategorie.innerText = categorie.name;
    selectCategorie.appendChild(optionCategorie);
  });
}

function afficherAjout() {
  const buttonAjouterPhoto = document.querySelector(".ajouterPhoto");
  buttonAjouterPhoto.addEventListener("click", function (event) {
    event.preventDefault();
    afficherAjoutPhoto();
  });
}

//Fonction de retour
function afficherGalerie() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "flex";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "none";
  document.querySelector(".return").style.display = "none";
}

function retour() {
  const boutonRetour = document.querySelector(".return");
  boutonRetour.addEventListener("click", function (event) {
    afficherGalerie();
  });
}

//Récupérer les catégories
async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  return categories;
}

//Partie principale

let closeCallback = null;

recupererGallery().then((projets) => {
  afficherGallery(projets);
});
afficherAjout();
retour();

ajoutCloseModalCallback(() => {
  displayWorks();
});
