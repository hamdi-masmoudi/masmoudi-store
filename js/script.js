/* ===== Masmoudi Store : produits, commande, menu, compteur, formulaire de contact ===== */

/* ===== Petites fonctions utiles ===== */

/* Exemple : 119 devient "119 DT" */
function formaterPrix(montant) {
  return montant + " DT";
}

/* Cherche un produit dans la liste PRODUITS (fichier produits.js) grâce à son id */
function trouverProduit(id) {
  for (let i = 0; i < PRODUITS.length; i++) {
    if (PRODUITS[i].id === id) {
      return PRODUITS[i];
    }
  }
  return null; /* produit introuvable */
}

/* ===== Page boutique : afficher les produits ===== */
function afficherBoutique() {
  const grille = document.getElementById("grille-produits");
  if (grille === null) {
    return; /* on n'est pas sur la page boutique */
  }

  let html = "";

  /* PRODUITS est le tableau défini dans produits.js : on le parcourt avec une boucle */
  for (let i = 0; i < PRODUITS.length; i++) {
    const produit = PRODUITS[i];

    /* Le lien envoie vers produit.html et ajoute l'id du produit dans l'adresse : ?id=... */
    /* index.html est à la racine : l'image s'écrit directement "images/..." */
    html += `
      <article class="produit">
        <a href="pages/produit.html?id=${produit.id}" class="produit-lien">
          <img src="${produit.image}" alt="${produit.nom}" loading="lazy">
          <h2 class="produit-nom">${produit.nom}</h2>
          <p class="produit-prix">${formaterPrix(produit.prix)}</p>
        </a>
      </article>`;
  }

  grille.innerHTML = html;
}

/* ===== Page produit : afficher le produit choisi + commande ===== */

/* Lit l'id dans l'adresse de la page. Exemple : produit.html?id=pull-a-zip  ->  "pull-a-zip" */
function lireIdProduit() {
  /* window.location.search = la partie de l'adresse après le "?" */
  const parametres = new URLSearchParams(window.location.search);
  return parametres.get("id"); /* renvoie null si "id" n'existe pas */
}

/* Met à jour "Total : ..." selon la quantité tapée */
function afficherTotal(produit) {
  const quantite = Number(document.getElementById("quantite").value);
  const total = document.getElementById("total-commande");

  if (quantite >= 1 && quantite <= 10) {
    total.textContent = "Total : " + formaterPrix(produit.prix * quantite);
  } else {
    total.textContent = "Total : -";
  }
}

/* Chaque fonction renvoie un message d'erreur, ou "" si tout est correct */

function verifierNomCommande(nom) {
  if (nom === "") {
    return "Le nom est obligatoire.";
  }
  if (nom.length < 3) {
    return "Le nom doit contenir au moins 3 caractères.";
  }
  return "";
}

function verifierTelephone(telephone) {
  if (telephone === "") {
    return "Le téléphone est obligatoire.";
  }
  if (telephone.length !== 8) {
    return "Le téléphone doit contenir exactement 8 chiffres.";
  }
  /* On vérifie chaque caractère : il doit être compris entre "0" et "9" */
  for (let i = 0; i < telephone.length; i++) {
    if (telephone[i] < "0" || telephone[i] > "9") {
      return "Le téléphone ne doit contenir que des chiffres.";
    }
  }
  return "";
}

function verifierAdresse(adresse) {
  if (adresse === "") {
    return "L'adresse est obligatoire.";
  }
  if (adresse.length < 5) {
    return "L'adresse doit contenir au moins 5 caractères.";
  }
  return "";
}

function verifierQuantite(quantite) {
  /* quantite % 1 !== 0 veut dire : ce n'est pas un nombre entier (ex : 2.5) */
  if (quantite < 1 || quantite > 10 || quantite % 1 !== 0) {
    return "La quantité doit être un nombre entier entre 1 et 10.";
  }
  return "";
}

function activerPageProduit() {
  const detail = document.getElementById("produit-detail");
  if (detail === null) {
    return; /* on n'est pas sur la page produit */
  }

  const formulaire = document.getElementById("form-commande");
  const produit = trouverProduit(lireIdProduit());

  /* Si l'id est absent ou faux, on affiche un message et on cache le formulaire */
  if (produit === null) {
    detail.innerHTML = '<p>Produit introuvable. <a href="../index.html">Retour à la boutique</a></p>';
    formulaire.hidden = true;
    return;
  }

  /* Affichage du produit */
  /* produit.html est dans /pages/ : on remonte d'un dossier avec "../" */
  detail.innerHTML = `
    <img src="../${produit.image}" alt="${produit.nom}">
    <div>
      <h2>${produit.nom}</h2>
      <p class="detail-prix">${formaterPrix(produit.prix)}</p>
    </div>`;

  /* Le total change à chaque fois que la quantité change */
  afficherTotal(produit);
  document.getElementById("quantite").addEventListener("input", function () {
    afficherTotal(produit);
  });

  /* Validation du formulaire de commande */
  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault(); /* empêche l'envoi : on vérifie d'abord */

    const nom = document.getElementById("nom").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const quantite = Number(document.getElementById("quantite").value);

    const erreurNom = verifierNomCommande(nom);
    const erreurTelephone = verifierTelephone(telephone);
    const erreurAdresse = verifierAdresse(adresse);
    const erreurQuantite = verifierQuantite(quantite);

    document.getElementById("erreur-nom").textContent = erreurNom;
    document.getElementById("erreur-telephone").textContent = erreurTelephone;
    document.getElementById("erreur-adresse").textContent = erreurAdresse;
    document.getElementById("erreur-quantite").textContent = erreurQuantite;

    const succes = document.getElementById("succes");

    if (erreurNom === "" && erreurTelephone === "" && erreurAdresse === "" && erreurQuantite === "") {
      succes.textContent =
        "Merci " + nom + " ! Votre commande de " + quantite + " × " + produit.nom +
        " (" + formaterPrix(produit.prix * quantite) + ") est enregistrée. " +
        "Nous vous appellerons au " + telephone + ".";
      formulaire.reset();       /* vide le formulaire (la quantité revient à 1) */
      afficherTotal(produit);
    } else {
      succes.textContent = "";
    }
  });
}

/* ===== Menu burger (mobile) ===== */
function activerMenu() {
  const burger = document.getElementById("burger");
  const menu = document.getElementById("menu-principal");

  burger.addEventListener("click", function () {
    /* toggle : ajoute la classe "ouvert" si elle est absente, la retire sinon */
    menu.classList.toggle("ouvert");
  });
}

/* ===== Page contact : compteur de caractères du message ===== */
function activerCompteur() {
  const message = document.getElementById("message");
  const compteur = document.getElementById("compteur");
  if (message === null) {
    return; /* on n'est pas sur la page contact */
  }

  /* L'événement "input" se produit à chaque lettre tapée ou effacée */
  message.addEventListener("input", function () {
    compteur.textContent = message.value.length + " / 300 caractères";
  });
}

/* ===== Page contact : validation du formulaire ===== */

function verifierNom(nom) {
  if (nom === "") {
    return "Le nom est obligatoire.";
  }
  if (nom.length < 2) {
    return "Le nom doit contenir au moins 2 caractères.";
  }
  return "";
}

function verifierEmail(email) {
  if (email === "") {
    return "L'e-mail est obligatoire.";
  }

  const arobase = email.indexOf("@");     /* position du @ */
  const point = email.lastIndexOf(".");   /* position du dernier point */

  /* Il faut : du texte avant @, un point après @, du texte après le point, pas d'espace */
  if (arobase < 1 || point < arobase + 2 || point === email.length - 1 || email.includes(" ")) {
    return "Adresse e-mail invalide (exemple : nom@domaine.com).";
  }
  return "";
}

function verifierMessage(message) {
  if (message === "") {
    return "Le message est obligatoire.";
  }
  if (message.length < 10) {
    return "Le message doit contenir au moins 10 caractères.";
  }
  return "";
}

function activerFormulaireContact() {
  const formulaire = document.getElementById("form-contact");
  if (formulaire === null) {
    return; /* on n'est pas sur la page contact */
  }

  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault(); /* empêche l'envoi : on vérifie d'abord */

    /* trim() enlève les espaces au début et à la fin */
    const nom = document.getElementById("nom").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const erreurNom = verifierNom(nom);
    const erreurEmail = verifierEmail(email);
    const erreurMessage = verifierMessage(message);

    /* On affiche chaque erreur sous son champ (ou rien si tout va bien) */
    document.getElementById("erreur-nom").textContent = erreurNom;
    document.getElementById("erreur-email").textContent = erreurEmail;
    document.getElementById("erreur-message").textContent = erreurMessage;

    const succes = document.getElementById("succes");

    if (erreurNom === "" && erreurEmail === "" && erreurMessage === "") {
      succes.textContent = "Merci ! Votre message a bien été envoyé.";
      formulaire.reset(); /* vide le formulaire */
      document.getElementById("compteur").textContent = "0 / 300 caractères";
    } else {
      succes.textContent = "";
    }
  });
}

/* ===== Démarrage : on lance tout quand la page est chargée ===== */
document.addEventListener("DOMContentLoaded", function () {
  activerMenu();
  afficherBoutique();
  activerPageProduit();
  activerCompteur();
  activerFormulaireContact();
});