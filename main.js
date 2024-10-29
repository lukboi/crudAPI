const output = document.getElementById("output");
const statusMessage = document.createElement("div");
document.body.insertBefore(statusMessage, output);

let lastPostId = null; // Variável para armazenar o ID do último post criado

// Função para exibir mensagens de status na tela
function showStatus(message, type = "success") {
    statusMessage.textContent = message;
    statusMessage.className = type === "error" ? "alert error" : "alert success";
    setTimeout(() => statusMessage.textContent = "", 3000); // Limpa a mensagem após 3 segundos
}

// Função para buscar e mostrar os posts (READ)
function fetchPosts() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(posts => {
            output.innerHTML = "<h2>Posts:</h2>";
            posts.forEach(post => {
                const postElement = document.createElement("div");
                postElement.className = "post";
                postElement.setAttribute("data-id", post.id);
                postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
                output.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error("Erro ao buscar posts:", error);
            showStatus("Erro ao buscar posts", "error");
        });
}

// Função para criar um novo post (CREATE)
function createPost() {
    const newPost = {
        title: "Novo Post",
        body: "Este é o corpo do novo post",
        userId: 1
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
    .then(response => response.json())
    .then(post => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.setAttribute("data-id", post.id);
        postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
        output.prepend(postElement); // Adiciona o novo post ao início da lista
        lastPostId = post.id; // Armazena o ID do último post criado
        showStatus("Post criado com sucesso!");
    })
    .catch(error => {
        console.error("Erro ao criar post:", error);
        showStatus("Erro ao criar post", "error");
    });
}

// Função para atualizar o último post criado (UPDATE)
function updateLastPost() {
    if (lastPostId === null) {
        showStatus("Nenhum post para atualizar.", "error");
        return;
    }

    const updatedPost = {
        title: "Post Atualizado",
        body: "Este é o corpo atualizado do post"
    };

    fetch(`https://jsonplaceholder.typicode.com/posts/${lastPostId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPost)
    })
    .then(response => response.json())
    .then(post => {
        showStatus(`Post de ID ${lastPostId} atualizado com sucesso!`);

        // Atualiza o post na tela
        const postElements = document.querySelectorAll(`.post[data-id='${lastPostId}']`);
        postElements.forEach(postElement => {
            postElement.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p>`;
        });
    })
    .catch(error => {
        console.error("Erro ao atualizar post:", error);
        showStatus("Erro ao atualizar post", "error");
    });
}

// Função para deletar o último post criado (DELETE)
function deleteLastPost() {
    if (lastPostId === null) {
        showStatus("Nenhum post para deletar.", "error");
        return;
    }

    fetch(`https://jsonplaceholder.typicode.com/posts/${lastPostId}`, {
        method: 'DELETE'
    })
    .then(() => {
        showStatus(`Último post de ID ${lastPostId} deletado com sucesso!`);

        // Remove o post da tela
        const postElements = document.querySelectorAll(`.post[data-id='${lastPostId}']`);
        postElements.forEach(postElement => {
            postElement.remove();
        });

        lastPostId = null; // Reseta o ID do último post após a exclusão
    })
    .catch(error => {
        console.error("Erro ao deletar post:", error);
        showStatus("Erro ao deletar post", "error");
    });
}
