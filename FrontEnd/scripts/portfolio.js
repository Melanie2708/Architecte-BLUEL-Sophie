import { ajoutCloseModalCallback } from "./modal.js";

if (!localStorage.getItem("token")) {
  // Sélectionne l'élément avec la classe js-modal
  const modalLink = document.querySelector(".js-modal");
  // Supprime l'élément du DOM
  if (modalLink) {
    modalLink.remove();
  }
}
//Fonction pour afficher les travaux
async function recupererProjets() {
  const reponse = await fetch("http://localhost:5678/api/works");
  const projets = await reponse.json();
  return projets;
}

function afficherProjets(projets, categorieId) {
  // Récupération de l'élément
  const divGallery = document.querySelector(".gallery");
  divGallery.innerHTML = "";

  for (let i = 0; i < projets.length; i++) {
    const projet = projets[i];
    if (projet.categoryId == categorieId || categorieId == 0) {
      //Création de la figure
      const figure = document.createElement("figure");
      const imageFigure = document.createElement("img");
      imageFigure.src = projet.imageUrl;
      imageFigure.alt = projet.title;
      const caption = document.createElement("figcaption");
      caption.innerText = projet.title;

      divGallery.appendChild(figure);
      figure.appendChild(imageFigure);
      figure.appendChild(caption);
    }
  }
}

//Fonction pour les filtres

async function recupererCategories() {
  const reponse = await fetch("http://localhost:5678/api/categories");
  const categories = await reponse.json();
  const nouvelObjet = { id: 0, name: "Tous" };
  categories.unshift(nouvelObjet);
  return categories;
}

function clicFiltre(filtre) {
  const listeFiltre = document.querySelectorAll(".filtre");
  for (let i = 0; i < listeFiltre.length; i++) {
    listeFiltre[i].classList.remove("filtre-actif");
  }
  filtre.classList.add("filtre-actif");
  afficherProjets(tousProjets, filtre.id);
}

function afficherCategories(categories) {
  for (let i = 0; i < categories.length; i++) {
    const categorie = categories[i];
    //Récupération de l'élément
    const divFiltre = document.querySelector(".filtres");
    //Création du bouton
    const bouton = document.createElement("button");
    bouton.textContent = categorie.name; // Ajoute le nom récupéré depuis l'API
    bouton.id = categorie.id;
    bouton.classList.add("filtre");
    bouton.addEventListener("click", (event) => {
      clicFiltre(event.target);
    });

    if (bouton.id == 0) {
      bouton.classList.add("filtre-actif");
    }

    divFiltre.appendChild(bouton);
  }
}

function logout() {
  const token = localStorage.getItem("token");
  if (token) {
    const loginLink = document.getElementById("lien-login");
    if (loginLink) {
      loginLink.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.clear("token");
        location.reload();
      });
    }
  }
}

//Partie principale du script

let tousProjets = {};

recupererProjets().then((projets) => {
  tousProjets = projets;
  afficherProjets(tousProjets, 0);
});
recupererCategories().then((categories) => {
  afficherCategories(categories);
});

function afficherModifier(token) {
  if (localStorage.getItem("token")) {
    if (localStorage.getItem("token").value != "") {
      document.querySelector(".icone").style.display = "block";
      document.querySelector(".modeEdition").style.display = "block";
      document.querySelector(".filtres").style.display = "none";
      document.getElementById("lien-login").innerText = "logout";
    }
  }
}
afficherModifier();

// Ajout d'une fonction a appeler lors de la fermeture de la modale
ajoutCloseModalCallback(() => {
  recupererProjets().then((projets) => {
    tousProjets = projets;
    afficherProjets(tousProjets, 0);
  });
});

logout();
