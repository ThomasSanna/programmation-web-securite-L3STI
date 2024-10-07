function placesLettre(ch, mot) {
  if (ch.length !== 1) {
      throw new Error("Vous devez entrer un seul caractère.");
  }

  let indRes = [];
  for (let i = 0; i < mot.length; i++) {
      if (mot[i] === ch) {
          indRes.push(i);
      }
  }
  return indRes;
}

function outputStr(mot, lPos) {
  let res = "";
  for (let i = 0; i < mot.length; i++) {
      if (lPos.includes(i)) {
          res += mot[i];
      } else {
          res += "-";
      }
  }
  return res;
}

function getMaxStrLen(lst) {
  let maxLen = 0;
  for (let e of lst) {
      if (e.length > maxLen) {
          maxLen = e.length;
      }
  }
  return maxLen;
}

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

function selectWord(sortedWords, wordLen) {
  let lenMotsDictN = sortedWords[wordLen].length;
  return sortedWords[wordLen][Math.floor(Math.random() * lenMotsDictN)];
}

function demandeDifficulteGetWordLen() {
  let choixFait = false;
  let lenWord;
  while (!choixFait) {
      let difficulte = prompt('Choisissez la difficulté: easy/normal/hard  -> ');
      choixFait = true;
      if (difficulte === "easy") {
          lenWord = Math.floor(Math.random() * (6 - 4 + 1)) + 4;
      } else if (difficulte === 'normal') {
          lenWord = Math.floor(Math.random() * (8 - 7 + 1)) + 7;
      } else if (difficulte === 'hard') {
          lenWord = Math.floor(Math.random() * (12 - 9 + 1)) + 9;
      } else {
          choixFait = false;
      }
  }
  return lenWord;
}

function runGame(LST_MOTS, LST_PENDU) {
  let dictMot = buildDict(LST_MOTS);
  console.log(dictMot)
  let lenMot = demandeDifficulteGetWordLen();
  let motATrouver = selectWord(dictMot, lenMot);

  console.log("Chut, le mot est : ", motATrouver);

  let nbErreur = 0;
  let lstIndexTrouve = [];

  while (nbErreur < 5 && lstIndexTrouve.length !== motATrouver.length) {
      console.log("\nMot à trouver:");
      console.log(outputStr(motATrouver, lstIndexTrouve));

      let chr;
      try {
          chr = prompt("\nEntrez une lettre (minuscule) -> ").toLowerCase();
      } catch (e) {
          throw new Error("Un problème est survenu lors de l'entrée de la lettre: Manipulation impossible.");
      }

      let lstIndexRes;
      try {
          lstIndexRes = placesLettre(chr, motATrouver);
      } catch (e) {
          throw new Error(e.message + ": Impossible de placer la lettre.");
      }

      if (lstIndexRes.length === 0) {
          console.log("\nErreur ! La lettre " + chr + " n'est pas dans le mot cherché ! \n");
          nbErreur += 1;

          if (nbErreur > 0) {
              console.log(`Pendu : ${nbErreur}/5 olala`);
          }
          pendu = ''
          for (let ligne = 0; ligne < nbErreur; ligne++) {
              pendu += LST_PENDU[ligne] + '\n';
          }
          console.log(pendu);
      } else {
          lstIndexTrouve = lstIndexTrouve.concat(lstIndexRes);
      }
  }

  if (nbErreur === 5) {
      console.log("\nPerdu !");
  } else {
      console.log("\nBravo ! Le mot était bien ", motATrouver, "!");
  }
}

function main() {
  const LST_MOTS = ["maman", "symbale", "bonjour", "whisky", "abstrait", "feux", "ordinateur", "javascript", "abdominal", "abricotiers", "collectivite"];
  const LST_PENDU = [
    "|---] ", 
    "| O ", 
    "| T ", 
    "|/ \\ ", 
    "|______"];

  runGame(LST_MOTS, LST_PENDU);
}

main();