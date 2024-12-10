export function afficherPage(page, lien) {
  const listePage = document.querySelectorAll(".page");
  for (let i = 0; i < listePage.length; i++) {
    listePage[i].classList.remove("active");
  }
  const pageA = document.getElementById(page);
  pageA.classList.add("active");

  const listeLien = document.querySelectorAll(".lien");
  for (let i = 0; i < listeLien.length; i++) {
    listeLien[i].classList.remove("actif");
  }
  lien.classList.add("actif");
}

export function ajoutClicNavigation() {
  const lienProjet = document.getElementById("lien-projet");
  lienProjet.addEventListener("click", function (event) {
    afficherPage("page-principale", event.target);
  });
  const lienLogin = document.getElementById("lien-login");
  lienLogin.addEventListener("click", function (event) {
    afficherPage("page-login", event.target);
  });
}
