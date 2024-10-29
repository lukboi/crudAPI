// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", function() {
    // Declaração das variáveis globais
    const output = document.getElementById("output");
    const statusMessage = document.createElement("div");
    let lastPostId = null; // Armazena o ID do último post criado
    let localIdCounter = 201; // Contador para IDs únicos locais (começando em 201)
    
    // Função para exibir mensagens de status na tela
    function showStatus(message, type = "success") {
        statusMessage.textContent = message;
        statusMessage.className = type === "error" ? "alert error" : "alert success";
        setTimeout(() => { statusMessage.textContent = ""; }, 3000); // Limpa a mensagem após 3 segundos
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
                    postElement.innerHTML = `<h3>ID ${post.id}: ${post.title}</h3><p>${post.body}</p>`;
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
        console.log("Valor de localIdCounter:", localIdCounter); // Verificar se a variável está acessível
        const newPost = {
            title: `Novo Post ${localIdCounter}`,
            body: "Este é o corpo do novo post",
            userId: 1,
            id: localIdCounter // Atribui um ID único local
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
            // Atualiza o ID do post com o ID local
            post.id = localIdCounter;
    
            const postElement = document.createElement("div");
            postElement.className = "post";
            postElement.setAttribute("data-id", post.id);
            postElement.innerHTML = `<h3>ID ${post.id}: ${post.title}</h3><p>${post.body}</p>`;
            output.prepend(postElement); // Adiciona o novo post ao início da lista
            lastPostId = post.id; // Armazena o ID do último post criado
            localIdCounter++; // Incrementa o contador de IDs locais
            showStatus("Post criado com sucesso!");
        })
        .catch(error => {
            console.error("Erro ao criar post:", error);
            showStatus("Erro ao criar post", "error");
        });
    }
    
    // Função para atualizar o último post criado (UPDATE)
    function updateLastPost() {
        if (lastPostId == null) {
            showStatus("Nenhum post para atualizar.", "error");
            return;
        }
    
        // Verifica se o lastPostId é um post local (ID >= 201)
        const isLocalPost = lastPostId >= 201;
    
        if (isLocalPost) {
            // Seleciona o elemento do post no DOM usando o data-id
            const postElement = document.querySelector(`.post[data-id='${lastPostId}']`);
            
            if (postElement) {
                // Atualiza o título e o corpo diretamente no DOM
                const newTitle = `Post Atualizado ${lastPostId}`;
                const newBody = "Este é o corpo atualizado do post";
    
                postElement.querySelector('h3').textContent = `ID ${lastPostId}: ${newTitle}`;
                postElement.querySelector('p').textContent = newBody;
    
                showStatus(`Post local de ID ${lastPostId} atualizado com sucesso!`);
            } else {
                showStatus("Post local não encontrado no DOM.", "error");
            }
        } else {
            // Caso seja um post da API, procede com a lógica original
            const updatedPost = {
                title: `Post Atualizado ${lastPostId}`,
                body: "Este é o corpo atualizado do post",
                userId: 1,
                id: lastPostId
            };
    
            fetch(`https://jsonplaceholder.typicode.com/posts/${lastPostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Falha na atualização do post na API.");
                }
                return response.json();
            })
            .then(post => {
                showStatus(`Post de ID ${lastPostId} atualizado com sucesso na API!`);
    
                // Atualiza o post na tela
                const postElements = document.querySelectorAll(`.post[data-id='${lastPostId}']`);
                postElements.forEach(postElement => {
                    postElement.innerHTML = `<h3>ID ${post.id}: ${post.title}</h3><p>${post.body}</p>`;
                });
            })
            .catch(error => {
                console.error("Erro ao atualizar post:", error);
                showStatus("Erro ao atualizar post na API.", "error");
            });
        }
    }
    
    // Função para deletar o último post criado (DELETE)
    function deleteLastPost() {
        if (lastPostId == null) {
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
    
            lastPostId--; // Reseta o ID do último post após a exclusão
        })
        .catch(error => {
            console.error("Erro ao deletar post:", error);
            showStatus("Erro ao deletar post", "error");
        });
    }
    
    // Expondo as funções ao escopo global para serem acessíveis nos onclicks
    window.fetchPosts = fetchPosts;
    window.createPost = createPost;
    window.updateLastPost = updateLastPost;
    window.deleteLastPost = deleteLastPost;
});
