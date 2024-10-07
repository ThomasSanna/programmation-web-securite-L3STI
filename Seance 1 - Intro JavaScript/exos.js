function doubleValues(lst) {
  return lst.map(e => e * 2);
}

function renvoiePaires(lst) {
  return lst.filter(e => e % 2 === 0);
}

function renvoieImpaires(lst) {
  return lst.filter(e => e % 2 != 0);
}

function sommeTab(lst) {
  return lst.reduce((acc, e) => acc + e, 0);
}


function addBut(joueurFoot, clubNom){
  return joueurFoot
  .filter(e => e.club === clubNom)
  .map(e => {
    e.but += 1
    return e
  }
  )
}

function sumBut(joueurFoot, clubNom){
  return joueurFoot.filter(e => e.club === clubNom).reduce((acc, e) => acc + e.but, 0)
}

function main() {
  let sequence = [1, 1, 2, 3, 5, 8, 13];

  console.log(doubleValues(sequence))
  console.log(renvoiePaires(sequence))
  console.log(renvoieImpaires(sequence))
  console.log(sommeTab(sequence))

  let joueurFoot = [
    { club: "NON", joueur: "Num1", but: 2},
    { club: "NON", joueur: "Num2", but: 1},
    { club: "OUI", joueur: "Num3", but: 3},
    { club: "NON", joueur: "Num4", but: 3},
    { club: "OUI", joueur: "Num5", but: 4},
  ]

  console.log("HEHEHEHEHEEHEH")
  console.log(addBut(joueurFoot, "NON"))
  console.log(sumBut(joueurFoot, "NON"))

}

main()