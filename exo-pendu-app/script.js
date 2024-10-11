/**
 * Liste des mots à utiliser dans le jeu.
 * @constant {string[]}
 */
const LST_MOTS = [
  "maman",
  "symbale",
  "bonjour",
  "whisky",
  "abstrait",
  "feux",
  "ordinateur",
  "javascript",
  "abdominal",
  "abricotiers",
  "collectivite",
];

/**
 * Liste des étapes du dessin du pendu.
 * @constant {string[]}
 */
const LST_PENDU = ["|---] ", "| O ", "| T ", "|/ \\ ", "|______"];

/**
 * Trouve les positions d'un caractère dans un mot.
 * @param {string} ch - Le caractère à trouver.
 * @param {string} mot - Le mot dans lequel chercher.
 * @returns {number[]} - Tableau des positions où le caractère est trouvé.
 * @throws {Error} - Si la longueur du caractère d'entrée n'est pas 1.
 */
function placesLettre(ch, mot) {
  if (ch.length !== 1) {
    throw new Error("Vous devez entrer un seul caractère.");
  }
  longMot = mot.length;
  let indRes = [];
  for (let i = 0; i < longMot; i++) {
    if (mot[i] === ch) {
      indRes.push(i);
    }
  }
  return indRes;
}

/**
 * Génère une chaîne avec les lettres devinées révélées et les autres cachées.
 * @param {string} mot - Le mot à deviner.
 * @param {number[]} lPos - Tableau des positions des lettres devinées.
 * @returns {string} - La chaîne formatée avec les lettres devinées et des tirets.
 */
function outputStr(mot, lPos) {
  let res = "";
  longMot = mot.length;
  for (let i = 0; i < longMot; i++) {
    if (lPos.includes(i)) {
      res += mot[i];
    } else {
      res += "-";
    }
  }
  return res;
}

/**
 * Trouve la longueur maximale des chaînes dans une liste.
 * @param {string[]} lst - Liste de chaînes.
 * @returns {number} - La longueur maximale trouvée.
 */
function getMaxStrLen(lst) {
  let maxLen = 0;
  for (let e of lst) {
    if (e.length > maxLen) {
      maxLen = e.length;
    }
  }
  return maxLen;
}

/**
 * Construit un dictionnaire de mots groupés par leur longueur.
 * @param {string[]} lstMots - Liste de mots.
 * @returns {Object} - Dictionnaire avec les longueurs de mots comme clés et des tableaux de mots comme valeurs.
 */
function buildDict(lstMots) {
  let maxLen = getMaxStrLen(lstMots);
  let dictBuilded = {};
  for (let i = 4; i <= maxLen; i++) {
    dictBuilded[i] = [];
  }
  for (let mot of lstMots) {
    dictBuilded[mot.length].push(mot);
  }
  return dictBuilded;
}

/**
 * Sélectionne un mot aléatoire d'une longueur donnée dans un dictionnaire.
 * @param {Object} dictMot - Dictionnaire de mots groupés par longueur.
 * @param {number} longMot - La longueur du mot à sélectionner.
 * @returns {string} - Le mot sélectionné.
 */
function selectWord(dictMot, longMot) {
  let lenMotsDictN = dictMot[longMot].length;
  return dictMot[longMot][Math.floor(Math.random() * lenMotsDictN)];
}

/**
 * Détermine la longueur du mot en fonction de la difficulté sélectionnée.
 * @param {string} difficulte - La difficulté sélectionnée ('easy', 'normal', 'hard').
 * @returns {number} - La longueur du mot à deviner.
 */
function demandeDifficulteGetWordLen(difficulte) {
  let lenWord;
  if (difficulte === "easy") {
    lenWord = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
  } else if (difficulte === "normal") {
    lenWord = Math.floor(Math.random() * (8 - 7 + 1)) + 7;
  } else if (difficulte === "hard") {
    lenWord = Math.floor(Math.random() * (12 - 9 + 1)) + 9;
  }
  return lenWord;
}

/**
 * Initialise et démarre le jeu lorsque l'un des boutons difficulté est cliqué.
 */

let nbErreur = 0;
let lstIndexTrouve = []; // Liste de TOUS les index des lettres trouvées

let boutonsDifficulte = document.querySelectorAll(".difficulty");

boutonsDifficulte.forEach(function (bouton) {
  bouton.addEventListener("click", function () {
    const difficulty = this.name;
    const dictMot = buildDict(LST_MOTS);
    const lenMot = demandeDifficulteGetWordLen(difficulty);
    const motATrouver = selectWord(dictMot, lenMot);

    document.querySelector(".indice").style.display = "flex";
    document.querySelector(".indice").title =
      'Indice: "' + motATrouver + '" ^^';
    document.querySelector(".containerDifficulte").style.display = "none";
    document.getElementById("containerJeu").style.display = "flex";
    document.getElementById("motATrouver").textContent = outputStr( 
      motATrouver,
      []
    ); // Renvoie "------" en gros
    document.getElementById("erreurs").textContent = "5 tentatives restantes";
    document.getElementById("penduDessin").textContent = "";

    // Permet de ne pas ajouter plusieurs event listeners sur le même élément
    const lettreForm = document.getElementById("lettreForm");
    const cloneLettreForm = lettreForm.cloneNode(true); // Clone le noeud (noeud = élément HTML)
    lettreForm.parentNode.replaceChild(cloneLettreForm, lettreForm); // Remplace l'ancien noeud par le nouveau

    /**
     * gère la soumission d'une lettre devinée lors du clique sur le bouton "soumettre"
     */
    cloneLettreForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Empêche le rechargement de la page
      const lettreInput = document.getElementById("lettreInput");
      const chr = lettreInput.value.toLowerCase();
      lettreInput.value = "";

      let lstIndexRes; //liste des index des lettres trouvées pour la lettre entrée
      try {
        lstIndexRes = placesLettre(chr, motATrouver);
      } catch (e) {
        alert(e.message + ": Impossible de placer la lettre.");
        return;
      }

      //  cas où la lettre n'est pas dans le mot
      if (lstIndexRes.length === 0) {
        nbErreur += 1;
        msgTentatives =
          nbErreur > 4
            ? `${5 - nbErreur} tentative restante`
            : `${5 - nbErreur} tentatives restantes`;
        document.getElementById("erreurs").textContent = msgTentatives;

        let pendu = "";
        for (let ligne = 0; ligne < nbErreur; ligne++) {
          pendu += LST_PENDU[ligne] + "\n";
        }
        document.getElementById("penduDessin").textContent = pendu;

        if (nbErreur === 5) {
          document.getElementById("penduDessin").textContent = "MORT !";
          boiteFin('Perdu ! Le mot était "' + motATrouver + '".');
        }
        // cas où la lettre est dans le mot
      } else {
        lstIndexTrouve = lstIndexTrouve.concat(lstIndexRes);
        document.getElementById("motATrouver").textContent = outputStr(
          motATrouver,
          lstIndexTrouve
        );

        if (lstIndexTrouve.length === motATrouver.length) {
          boiteFin('Bravo ! Le mot était bien "' + motATrouver + '" !');
        }
      }
    });
  });
});

/**
 * Affiche un message de fin de jeu et désactive les interactions utilisateur.
 *
 * désactive les événements de clic sur le formulaire de saisie de lettres
 * désactive le champ de saisie de lettres, 
 * affiche l'élément de fin de jeu
 * met à jour le message de fin de jeu
 *
 * @param {string} msg - Le message à afficher à la fin du jeu.
 */
function boiteFin(msg) {
  document.getElementById("lettreForm").style.pointerEvents = "none";
  document.getElementById("lettreInput").disabled = true;
  document.querySelector(".finGame").style.display = "flex";
  document.getElementById("messageFin").textContent = msg;
}

// reset valeurs


/**
 * Réinitialise les valeurs de l'interface du jeu du pendu.
 * 
 * Cette fonction effectue les actions suivantes :
 * - Cache l'élément avec la classe "indice".
 * - Réactive les événements de pointeur pour le formulaire de lettres.
 * - Active le champ de saisie des lettres et le vide.
 * - Cache l'élément avec la classe "finGame".
 * - Affiche le conteneur de difficulté.
 * - Cache le conteneur du jeu.
 * - Vide le contenu textuel de l'élément "motATrouver".
 * - Vide le contenu textuel de l'élément "erreurs".
 * - Vide le contenu textuel de l'élément "penduDessin".
 * - Réinitialise le nombre d'erreurs à 0.
 * - Vide la liste des indices trouvés.
 */
function resetValues() {
  document.querySelector(".indice").style.display = "none";
  document.getElementById("lettreForm").style.pointerEvents = "auto";
  document.getElementById("lettreInput").disabled = false;
  document.getElementById("lettreInput").value = "";
  document.querySelector(".finGame").style.display = "none";
  document.querySelector(".containerDifficulte").style.display = "flex";
  document.getElementById("containerJeu").style.display = "none";
  document.getElementById("motATrouver").textContent = "";
  document.getElementById("erreurs").textContent = "";
  document.getElementById("penduDessin").textContent = "";
  nbErreur = 0;
  lstIndexTrouve = [];
}
