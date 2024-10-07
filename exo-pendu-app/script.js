/**
 * Liste des mots à utiliser dans le jeu.
 * @constant {string[]}
 */
const LST_MOTS = ["maman", "symbale", "bonjour", "whisky", "abstrait", "feux", "ordinateur", "javascript", "abdominal", "abricotiers", "collectivite"];

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
    } else if (difficulte === 'normal') {
        lenWord = Math.floor(Math.random() * (8 - 7 + 1)) + 7;
    } else if (difficulte === 'hard') {
        lenWord = Math.floor(Math.random() * (12 - 9 + 1)) + 9;
    }
    return lenWord;
}

/**
 * Initialise et démarre le jeu lorsque le bouton de démarrage est cliqué.
 */

let nbErreur = 0;
let lstIndexTrouve = [];

document.getElementById('startGame').addEventListener('click', function() {
    const difficulty = document.getElementById('difficulty').value;
    const dictMot = buildDict(LST_MOTS);
    const lenMot = demandeDifficulteGetWordLen(difficulty);
    const motATrouver = selectWord(dictMot, lenMot);

    document.getElementById('containerJeu').style.display = 'block';
    document.getElementById('motATrouver').textContent = "Mot à trouver: " + outputStr(motATrouver, []);
    document.getElementById('erreurs').textContent = "Erreurs: 0/5";
    document.getElementById('penduDessin').textContent = "";



    /**
     * Gère la soumission d'une lettre devinée lors du clique sur le bouton "soumettre"
     */
    document.getElementById('lettreForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const chr = document.getElementById('lettreInput').value.toLowerCase();
        document.getElementById('lettreInput').value = '';

        let lstIndexRes;
        try {
            lstIndexRes = placesLettre(chr, motATrouver);
        } catch (e) {
            alert(e.message + ": Impossible de placer la lettre.");
            return;
        }

        if (lstIndexRes.length === 0) {
            nbErreur += 1;
            document.getElementById('erreurs').textContent = `Erreurs: ${nbErreur}/5`;

            let pendu = '';
            for (let ligne = 0; ligne < nbErreur; ligne++) {
                pendu += LST_PENDU[ligne] + '\n';
            }
            document.getElementById('penduDessin').textContent = pendu;

            if (nbErreur === 5) {
                alert("Perdu ! Le mot était " + motATrouver);
                resetValues();
            }
        } else {
            lstIndexTrouve = lstIndexTrouve.concat(lstIndexRes);
            document.getElementById('motATrouver').textContent = "Mot à trouver: " + outputStr(motATrouver, lstIndexTrouve);

            if (lstIndexTrouve.length === motATrouver.length) {
                alert("Bravo ! Le mot était bien " + motATrouver + "!");
                resetValues();
            }
        }
    });
});

// reset values

function resetValues() {
    document.getElementById('lettreInput').value = '';
    document.getElementById('containerJeu').style.display = 'none';
    document.getElementById('motATrouver').textContent = '';
    document.getElementById('erreurs').textContent = '';
    document.getElementById('penduDessin').textContent = '';
    nbErreur = 0;
    lstIndexTrouve = [];
}