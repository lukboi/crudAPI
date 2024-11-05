// Variável global para armazenar o Pokémon atual
let currentPokemon = null;

// Variável para contar o número de cliques
let clickCount = 0;

document.getElementById('gerar-pokemon').addEventListener('click', gerarPokemon);

// Adicionar event listener ao checkbox para alternar entre versões
document.getElementById('toggle-shiny').addEventListener('change', toggleShiny);

function gerarPokemon() {
    // Incrementa o contador de cliques
    clickCount++;
    console.log(clickCount);

    // Verifica se o contador atingiu 20 cliques
    if (clickCount === 20) {
        mostrarEasterEgg();
    }

    const pokemonId = Math.floor(Math.random() * 151) + 1; // IDs de 1 a 151
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            currentPokemon = data; // Armazena o Pokémon atual
            mostrarPokemon();
        })
        .catch(error => {
            console.error('Erro ao obter dados do Pokémon:', error);
        });
}

function mostrarPokemon() {
    if (!currentPokemon) return; // Se não houver um Pokémon atual, não faz nada

    const pokemonCard = document.getElementById('pokemon-card');
    pokemonCard.innerHTML = '';
    pokemonCard.className = ''; // Remove classes anteriores

    const nome = currentPokemon.name;
    const types = currentPokemon.types.map(typeInfo => typeInfo.type.name);

    // Adiciona a classe do tipo principal do Pokémon ao card
    pokemonCard.classList.add(types[0]);

    // Obter o valor do checkbox shiny
    const isShiny = document.getElementById('toggle-shiny').checked;

    // Selecionar a imagem adequada
    let imagem;
    if (isShiny && currentPokemon.sprites.front_shiny) {
        imagem = currentPokemon.sprites.front_shiny;
    } else {
        imagem = currentPokemon.sprites.front_default;
    }

    const titulo = document.createElement('h2');
    titulo.textContent = nome;

    const imagemElemento = document.createElement('img');
    imagemElemento.src = imagem;
    imagemElemento.alt = nome;

    const statsContainer = document.createElement('div');

    currentPokemon.stats.forEach(stat => {
        const statElement = document.createElement('div');
        statElement.classList.add('stats');

        const statName = document.createElement('span');
        // Formatar o nome do stat
        const formattedStatName = formatStatName(stat.stat.name);
        statName.textContent = `${formattedStatName}: `;

        const statValue = document.createElement('span');
        statValue.textContent = `${stat.base_stat}`;

        statElement.appendChild(statName);
        statElement.appendChild(statValue);

        statsContainer.appendChild(statElement);
    });

    // Reproduzir som do Pokémon automaticamente
    const audioElemento = document.createElement('audio');
    audioElemento.id = 'pokemon-cry';

    // URL do som do Pokémon usando o nome em minúsculas
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${currentPokemon.name.toLowerCase()}.mp3`;
    audioElemento.src = cryUrl;

    // Tratar erro ao carregar o áudio
    audioElemento.onerror = function() {
        console.warn('Desculpe, o som deste Pokémon não está disponível.');
    };

    // Tentar reproduzir o som
    audioElemento.play().catch(error => {
        console.warn('Erro ao reproduzir o som:', error);
        console.warn('O navegador pode estar bloqueando a reprodução automática de áudio.');
    });

    // Adicionar elementos ao card
    pokemonCard.appendChild(titulo);
    pokemonCard.appendChild(imagemElemento);
    pokemonCard.appendChild(statsContainer);
}

function toggleShiny() {
    // Atualiza apenas a imagem do Pokémon atual
    if (!currentPokemon) return; // Se não houver um Pokémon atual, não faz nada

    const imagemElemento = document.querySelector('#pokemon-card img');
    if (!imagemElemento) return; // Se a imagem não estiver presente, não faz nada

    const isShiny = document.getElementById('toggle-shiny').checked;

    // Selecionar a imagem adequada
    let imagem;
    if (isShiny && currentPokemon.sprites.front_shiny) {
        imagem = currentPokemon.sprites.front_shiny;
    } else {
        imagem = currentPokemon.sprites.front_default;
    }

    imagemElemento.src = imagem;
}

function formatStatName(statName) {
    // Substituir hífens por espaços
    let formattedName = statName.replace(/-/g, ' ');
    // Colocar a primeira letra de cada palavra em maiúscula
    formattedName = formattedName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formattedName;
}

function mostrarEasterEgg() {
    // Verifica se o Mew já foi exibido
    if (document.getElementById('easter-egg')) return;
    const cryUrl = `https://play.pokemonshowdown.com/audio/cries/mew.mp3`
    const audioElemento = document.createElement('audio');
    audioElemento.id = 'pokemon-cry';
    const mewElement = document.createElement('img');
    mewElement.id = 'easter-egg';
    mewElement.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png';
    mewElement.alt = 'Mew';
    audioElemento.src = cryUrl
    // Adiciona a classe para a animação
    mewElement.classList.add('mew');

    // Adiciona o Mew ao body
    document.body.appendChild(mewElement);
}
