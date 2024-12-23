async function connexion() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("motdepasse").value;
  const messageErreur = document.getElementById("message-erreur");

  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ email: email, password: password }),
  });

  if (reponse.status === 404 || reponse.status === 401) {
    messageErreur.innerText = "Erreur dans l'identifiant ou le mot de passe";
  } else if (reponse.status === 200) {
    const infoConnexion = await reponse.json();
    localStorage.setItem("token", infoConnexion.token);
    window.location.href = "index.html";
  }
}

function ajoutListenerConnexion() {
  const formulaire = document.getElementById("formulaire-login");
  formulaire.addEventListener("submit", function (event) {
    event.preventDefault();
    connexion();
  });
}
ajoutListenerConnexion();
