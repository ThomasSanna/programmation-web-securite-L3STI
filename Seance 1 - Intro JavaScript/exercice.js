/**
 * Génère un entier aléatoire entre 0 et max.
 * @param {number} max - La valeur maximale (non incluse) pour la génération de l'entier aléatoire.
 * @returns {number} Un entier aléatoire entre 0 et max.
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

/**
 * Fonction principale pour jouer au jeu de devinette de nombre.
 * - Génère un nombre aléatoire entre 0 et nbMax.
 * - Demande à l'utilisateur de deviner le nombre.
 * - Fournit des indices si le nombre proposé est trop grand ou trop petit.
 * - Affiche un message de félicitations si le nombre est deviné correctement.
 * - Permet à l'utilisateur de quitter le jeu en annulant la saisie.
 */
function trouverNombre(nbMax) {
  let nbATrouver = getRandomInt(nbMax);
  console.log(nbATrouver);
  let running = true;

  while (running) {
    let nbProposition = prompt("Quel nombre proposez-vous ?");

    if (nbProposition === null) {
      alert("Vous avez quitté la partie.");
      running = false;
      continue;
    }

    nbProposition = parseInt(nbProposition);

    if (isNaN(nbProposition)) {
      alert("Le nombre n'est pas valide.");
      continue;
    }

    if (nbProposition === nbATrouver) {
      alert("Bravo ! Le nombre était bien " + nbATrouver);
      running = false;
    } else if (nbProposition > nbATrouver) {
      alert("Le nombre " + nbProposition + " est trop grand :(");
    } else if (nbProposition < nbATrouver) {
      alert("Le nombre " + nbProposition + " est trop petit :(");
    }
  }
}

/**
 * Fonction principale qui initialise une constante NB_MAX et appelle la fonction trouverNombre avec cette constante.
 */
function main() {
  const NB_MAX = 100;
  trouverNombre(NB_MAX);
}

main();