const url = "https://raw.githubusercontent.com/KabDeveloper/99-Names-Of-Allah/refs/heads/main/99_Names_Of_Allah.json"

fetch(url)
  .then(response => response.json()) 
  .then(data => {
    console.log(data.data);
    data.data.forEach(name => {
        //console.log(name.transliteration, ":", name.en.meaning)
        const ul = document.getElementById('namesList');

        const li = document.createElement('li');

        li.classList.add('name-card'); // Ajoute la classe pour le style

        // Contenu de la case
        li.innerHTML = `
          <h3>${name.number}. ${name.transliteration}</h3>
          <p>${name.fr.meaning}</p>
        `;

        //li.textContent = `${name.number}. ${name.transliteration} : ${name.fr.meaning}`;
  
        ul.appendChild(li);
    });
  })
  .catch(error => {
    console.error('Erreur lors de la récupération des données:', error);
  });



