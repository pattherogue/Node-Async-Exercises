const pokemonContainer = document.getElementById('pokemon-container');
const generateBtn = document.getElementById('generate-btn');

generateBtn.addEventListener('click', async () => {
    try {
        const randomPokemonIds = await getRandomPokemonIds(3);
        const pokemonData = await Promise.all(randomPokemonIds.map(id => getPokemonData(id)));
        displayPokemon(pokemonData);
    } catch (error) {
        console.error('Error:', error);
    }
});

async function getRandomPokemonIds(count) {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/?limit=1000');
    const data = await response.json();
    const pokemonIds = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * data.results.length);
        const pokemonId = data.results[randomIndex].url.split('/').slice(-2, -1)[0];
        pokemonIds.push(pokemonId);
    }
    return pokemonIds;
}

async function getPokemonData(id) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return {
        name: data.name,
        sprite: data.sprites.front_default,
        speciesUrl: data.species.url
    };
}

async function getPokemonDescription(speciesUrl) {
    const response = await fetch(speciesUrl);
    const data = await response.json();
    const flavorTextEntries = data.flavor_text_entries.filter(entry => entry.language.name === 'en');
    if (flavorTextEntries.length > 0) {
        return flavorTextEntries[0].flavor_text;
    } else {
        return 'Description not available.';
    }
}

function displayPokemon(pokemonData) {
    pokemonContainer.innerHTML = '';
    pokemonData.forEach(async pokemon => {
        const description = await getPokemonDescription(pokemon.speciesUrl);
        const pokemonElement = document.createElement('div');
        pokemonElement.classList.add('pokemon');
        pokemonElement.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <h2>${pokemon.name}</h2>
            <p>${description}</p>
        `;
        pokemonContainer.appendChild(pokemonElement);
    });
}
