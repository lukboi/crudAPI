let clickCount = 0;

const pokemonList = [];

document
  .getElementById("gerar-pokemon")
  .addEventListener("click", gerarPokemon);

document.getElementById("toggle-shiny").addEventListener("change", toggleShiny);

function gerarPokemon() {
  clickCount++;
  console.log(clickCount);

  if (clickCount === 20) {
    mostrarEasterEgg();
  }

  const pokemonId = Math.floor(Math.random() * 151) + 1;
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      pokemonList.push(data);
      mostrarPokemon(data);
    })
    .catch((error) => {
      console.error("Erro ao obter dados do Pokémon:", error);
    });
}

function mostrarPokemon(pokemon) {
  const pokemonContainer = document.querySelector(".pokemon-container");

  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");

  const nome = pokemon.name;
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);

  pokemonCard.classList.add(types[0]);

  const isShiny = document.getElementById("toggle-shiny").checked;

  let imagem =
    isShiny && pokemon.sprites.front_shiny
      ? pokemon.sprites.front_shiny
      : pokemon.sprites.front_default;

  const titulo = document.createElement("h2");
  titulo.textContent = nome;

  const imagemElemento = document.createElement("img");
  imagemElemento.src = imagem;
  imagemElemento.alt = nome;

  const statsContainer = document.createElement("div");

  pokemon.stats.forEach((stat) => {
    const statElement = document.createElement("div");
    statElement.classList.add("stats");

    const statName = document.createElement("span");
    const formattedStatName = formatStatName(stat.stat.name);
    statName.textContent = `${formattedStatName}: `;

    const statValue = document.createElement("span");
    statValue.textContent = `${stat.base_stat}`;

    statElement.appendChild(statName);
    statElement.appendChild(statValue);

    statsContainer.appendChild(statElement);
  });

  const audioElemento = document.createElement("audio");
  audioElemento.id = "pokemon-cry";
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/${pokemon.name.toLowerCase()}.mp3`;
  audioElemento.src = cryUrl;
  audioElemento.onerror = function () {
    console.warn("Desculpe, o som deste Pokémon não está disponível.");
  };
  audioElemento.play().catch((error) => {
    console.warn("Erro ao reproduzir o som:", error);
    console.warn(
      "O navegador pode estar bloqueando a reprodução automática de áudio."
    );
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "delete-button",
    "text-white",
    "bg-red-600",
    "hover:bg-red-800",
    "p-2",
    "rounded-full",
    "transition",
    "transform",
    "hover:scale-110",
    "shadow-lg"
  );
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.onclick = () => {
    removerPokemon(pokemonCard, pokemon);
  };

  const editButton = document.createElement("button");
  editButton.classList.add(
    "edit-button",
    "text-white",
    "bg-blue-600",
    "hover:bg-blue-800",
    "px-4",
    "py-2",
    "rounded",
    "transition",
    "hover:scale-105",
    "shadow-md"
  );
  editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
  editButton.onclick = () => {
    editarPokemon(pokemonCard, pokemon, titulo, imagemElemento, statsContainer);
  };

  pokemonCard.appendChild(deleteButton);
  pokemonCard.appendChild(editButton);
  pokemonCard.appendChild(titulo);
  pokemonCard.appendChild(imagemElemento);
  pokemonCard.appendChild(statsContainer);

  pokemonContainer.appendChild(pokemonCard);
}

function toggleShiny() {
  const pokemonContainer = document.getElementById("pokemon-card");
  const isShiny = document.getElementById("toggle-shiny").checked;

  Array.from(pokemonContainer.children).forEach((card, index) => {
    const pokemon = pokemonList[index];
    const imagemElemento = card.querySelector("img");
    let imagem =
      isShiny && pokemon.sprites.front_shiny
        ? pokemon.sprites.front_shiny
        : pokemon.sprites.front_default;

    imagemElemento.src = imagem;
  });
}

function formatStatName(statName) {
  let formattedName = statName.replace(/-/g, " ");
  formattedName = formattedName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return formattedName;
}

function mostrarEasterEgg() {
  if (document.getElementById("easter-egg")) return;
  const cryUrl = `https://play.pokemonshowdown.com/audio/cries/mew.mp3`;
  const audioElemento = document.createElement("audio");
  audioElemento.id = "pokemon-cry";
  const mewElement = document.createElement("img");
  mewElement.id = "easter-egg";
  mewElement.src =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png";
  mewElement.alt = "Mew";
  audioElemento.src = cryUrl;

  mewElement.classList.add("mew");

  document.body.appendChild(mewElement);
}

function removerPokemon(pokemonCard, pokemon) {
  pokemonCard.remove();

  const index = pokemonList.indexOf(pokemon);
  if (index > -1) {
    pokemonList.splice(index, 1);
  }
}

function editarPokemon(
  pokemonCard,
  pokemon,
  titulo,
  imagemElemento,
  statsContainer
) {
  const nomeInput = document.createElement("input");
  nomeInput.type = "text";
  nomeInput.value = titulo.textContent;
  nomeInput.classList.add(
    "p-2",
    "border",
    "border-gray-300",
    "rounded-md",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "w-full",
    "mb-4"
  );

  const imagemSelect = document.createElement("select");
  imagemSelect.classList.add(
    "p-2",
    "border",
    "border-gray-300",
    "rounded-md",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-blue-500",
    "w-full",
    "mb-4"
  );

  const normalOption = document.createElement("option");
  normalOption.value = "normal";
  normalOption.textContent = "Normal";

  const shinyOption = document.createElement("option");
  shinyOption.value = "shiny";
  shinyOption.textContent = "Shiny";

  imagemSelect.appendChild(normalOption);
  imagemSelect.appendChild(shinyOption);
  imagemSelect.value =
    imagemElemento.src === pokemon.sprites.front_shiny ? "shiny" : "normal";

  const statsInputs = [];
  pokemon.stats.forEach((stat, index) => {
    const statInput = document.createElement("input");
    statInput.type = "number";
    statInput.value = stat.base_stat;
    statInput.classList.add(
      "p-2",
      "border",
      "border-gray-300",
      "rounded-md",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500",
      "w-full",
      "mb-2"
    );
    statsInputs.push(statInput);
  });

  pokemonCard.innerHTML = "";
  pokemonCard.appendChild(nomeInput);
  pokemonCard.appendChild(imagemSelect);

  statsContainer.innerHTML = "";
  statsInputs.forEach((input, index) => {
    const statLabel = document.createElement("label");
    statLabel.textContent = `${formatStatName(
      pokemon.stats[index].stat.name
    )}: `;
    statLabel.classList.add("font-medium", "text-gray-700", "mb-1", "block");

    statLabel.appendChild(input);
    statsContainer.appendChild(statLabel);
  });
  pokemonCard.appendChild(statsContainer);

  // Botão de salvar
  const saveButton = document.createElement("button");
  saveButton.textContent = "Salvar";
  saveButton.classList.add(
    "bg-blue-600",
    "text-white",
    "hover:bg-blue-800",
    "px-6",
    "py-3",
    "rounded-lg",
    "transition",
    "duration-200",
    "transform",
    "hover:scale-105",
    "w-full",
    "mt-4"
  );
  saveButton.onclick = () => {
    salvarEdicao(
      pokemon,
      nomeInput,
      imagemSelect,
      statsInputs,
      titulo,
      imagemElemento,
      statsContainer,
      pokemonCard
    );
  };
  pokemonCard.appendChild(saveButton);
}

function salvarEdicao(
  pokemon,
  nomeInput,
  imagemSelect,
  statsInputs,
  titulo,
  imagemElemento,
  statsContainer,
  pokemonCard
) {
  titulo.textContent = nomeInput.value;
  imagemElemento.src =
    imagemSelect.value === "shiny"
      ? pokemon.sprites.front_shiny
      : pokemon.sprites.front_default;

  pokemon.stats.forEach((stat, index) => {
    stat.base_stat = statsInputs[index].value;
  });

  statsContainer.innerHTML = "";
  pokemon.stats.forEach((stat) => {
    const statElement = document.createElement("div");
    statElement.classList.add("stats");

    const statName = document.createElement("span");
    const formattedStatName = formatStatName(stat.stat.name);
    statName.textContent = `${formattedStatName}: `;

    const statValue = document.createElement("span");
    statValue.textContent = `${stat.base_stat}`;

    statElement.appendChild(statName);
    statElement.appendChild(statValue);

    statsContainer.appendChild(statElement);
  });

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "delete-button",
    "text-white",
    "bg-red-600",
    "hover:bg-red-800",
    "p-2",
    "rounded-full",
    "transition",
    "transform",
    "hover:scale-110",
    "shadow-lg"
  );
  deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteButton.onclick = () => {
    removerPokemon(pokemonCard, pokemon);
  };

  const editButton = document.createElement("button");
  editButton.classList.add(
    "edit-button",
    "text-white",
    "bg-blue-600",
    "hover:bg-blue-800",
    "px-4",
    "py-2",
    "rounded",
    "transition",
    "hover:scale-105",
    "shadow-md"
  );
  editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
  editButton.onclick = () => {
    editarPokemon(pokemonCard, pokemon, titulo, imagemElemento, statsContainer);
  };

  pokemonCard.innerHTML = "";
  pokemonCard.appendChild(deleteButton);
  pokemonCard.appendChild(editButton);
  pokemonCard.appendChild(titulo);
  pokemonCard.appendChild(imagemElemento);
  pokemonCard.appendChild(statsContainer);
}
