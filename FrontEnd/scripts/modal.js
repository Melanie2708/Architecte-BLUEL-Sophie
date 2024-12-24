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
  recupererGallery().then((projets) => {
    afficherGallery(projets);
  });
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
  return projets;
}

function afficherGallery(projets) {
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
async function afficherModalAjoutPhoto() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "none";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "flex";
  document.querySelector(".return").style.display = "block";

  resetFormulaire();

  const categories = await recupererCategories();

  const selectCategorie = document.getElementById("categorie-ajout-photo");
  selectCategorie.innerHTML = "";

  const optionVide = document.createElement("option");
  optionVide.disabled = true;
  optionVide.selected = true;
  optionVide.innerText = "";
  selectCategorie.appendChild(optionVide);

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
    afficherModalAjoutPhoto();
  });
}

//Fonction de retour
function afficherModalGalerie() {
  const galerie = document.querySelector(".galerie");
  galerie.style.display = "flex";
  const ajout = document.querySelector(".ajout");
  ajout.style.display = "none";
  document.querySelector(".return").style.display = "none";
}

function retour() {
  const boutonRetour = document.querySelector(".return");
  boutonRetour.addEventListener("click", function (event) {
    recupererGallery().then((projets) => {
      afficherGallery(projets);
    });
    afficherModalGalerie();
  });
}

//Ajour d'un projet
function ajoutImageTelechargee() {
  document.getElementById("fileInput").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file && file.type.startsWith("image/")) {
      // Vérifie que c'est une image
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageTelecharge = document.getElementById("imageTelechargee");
        imageTelecharge.src = e.target.result; // Définit la source de l'image
        imageTelecharge.style.display = "flex"; // Affiche l'image
        imageAjout.style.display = "none";
      };
      reader.readAsDataURL(file); // Lit le fichier comme une URL
    }
    verificationFormulaire();
  });
}

function verificationFormulaire() {
  if (
    document.getElementById("text-ajout-photo").value !== "" &&
    document.getElementById("fileInput").files.length !== 0 &&
    document.getElementById("categorie-ajout-photo").value !== ""
  ) {
    document.getElementById("btnValider").classList.remove("validerErreur");
    document.getElementById("btnValider").classList.add("validerOK");
    document.getElementById("btnValider").disabled = false;
  } else {
    document.getElementById("btnValider").classList.add("validerErreur");
    document.getElementById("btnValider").classList.remove("validerOK");
    document.getElementById("btnValider").disabled = true;
  }
}

//Récupérer les catégories
async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();

  return categories;
}

//Validation du formulaire
function validerFormulaire() {
  const formulaireAjoutPhoto = document.getElementById("formulaire-ajout-photo");
  formulaireAjoutPhoto.addEventListener("submit", (event) => {
    event.preventDefault();

    if (
      document.getElementById("text-ajout-photo").value === "" ||
      document.getElementById("fileInput").files.length === 0 ||
      document.getElementById("categorie-ajout-photo").value === ""
    ) {
      document.getElementById("messageAjout").innerText = "Erreur dans le formulaire";
    } else {
      const header = "Bearer " + localStorage.getItem("token");

      const image = document.getElementById("fileInput").files[0];
      const titre = document.getElementById("text-ajout-photo").value;
      const categorie = document.getElementById("categorie-ajout-photo").value;

      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", titre);
      formData.append("category", categorie);

      fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: { Authorization: header },
        body: formData,
      }).then((reponse) => {
        if (reponse.status === 201) {
          resetFormulaire();
          document.getElementById("messageAjout").innerText = "Projet ajouté";
        } else {
          document.getElementById("messageAjout").innerText = "Erreur dans l'ajout du projet";
        }
      });
    }
  });

  const textInput = document.getElementById("text-ajout-photo");
  textInput.addEventListener("input", (event) => {
    verificationFormulaire();
  });
  const listeCategorie = document.getElementById("categorie-ajout-photo");
  listeCategorie.addEventListener("change", () => {
    verificationFormulaire();
  });
}

function resetFormulaire() {
  document.getElementById("imageAjout").style.display = "flex";
  document.getElementById("imageTelechargee").style.display = "none";
  document.getElementById("btnValider").classList.add("validerErreur");
  document.getElementById("btnValider").classList.remove("validerOK");
  document.getElementById("formulaire-ajout-photo").reset();
  document.getElementById("btnValider").disabled = true;
  document.getElementById("messageAjout").innerText = "";
  document.getElementById("categorie-ajout-photo").value = "";
}

//Partie principale

let closeCallback = null;

recupererGallery().then((projets) => {
  afficherGallery(projets);
});
afficherAjout();
retour();
ajoutImageTelechargee();
validerFormulaire();
