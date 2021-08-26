const express = require("express"); // importa o módulo express do node_modules
const app = express(); // cria o nosso objeto app, que vai poder utilizar tudo o que o express possui

app.use(express.json()); // Converte requisições e repostas para JSON (JavaScript Object Notation)

const porta = 3000; // constante para salvar a porta do servidor;

let jogos = [
  
   
];

// CRUD - Create[POST] - Read[GET] - Update[PUT] - Delete[DELETE]

// GET / - home
app.get("/", (req, res) => {
  res.status(200).send({ hello: "Hello World Express" }); 
});

app.get("/jogos", (req, res) => {
  res.json({ jogos }); 
});

app.get("/jogos/:id", (req, res) => {
  const id = +req.params.id;//pega o id passado na rota e armazena na variável chamada id.
  const jogo = jogos.find((jogo) => jogo.id === id);//Percorre a lista de jogos e retorna o item que tem o mesmo id da variavel.

  //se a variável jogo estiver vazia será apresentado a mensagem de erro caso contrário o jogo informado será apresentado na tela.
  !jogo
    ? res.status(404).send({ error: "Jogo não existe" })
    : res.json({ jogo });
});


app.post("/jogos", (req, res) => {
  const jogo = req.body; // Pega todos os campos passados pelo body.

  //Se não houver algum dos campos como nome ou imagem não será efetuada a inclusão do jogo na lista.
  if (!jogo || !jogo.nome || !jogo.imagem) {
    res.status(400).send({ error: "Cadastro inválido!" });
    return;
  }

  // Pega o último elemento da lista.
  const ultimoJogo = jogos[jogos.length - 1];//O tamanho da lista - 1 corresponde ao índice do último item.
  //E esse será armazenado na variável ultimoJogo.

  //console.log(jogos.length)

  // Testa se a lista não está vazia e gerando o número de id.
  if (jogos.length) { //Se a lista conter algum item, será somado 1 ao valor do último id para esse ser o id no novo item que será incluído na lista.
    jogo.id = ultimoJogo.id + 1;
    jogos.push(jogo); // Insere o objeto no array filmes
  } else {
    // Caso a lista esteja vazia o valor de id é 1
    jogo.id = 1;
    jogos.push(jogo);
  }

  res.status(201).send({ jogo });
});

// PUT 
app.put("/jogos/:id", (req, res) => {
    const jogo = req.body;
    if (!jogo || !jogo.nome || !jogo.imagem) {
      res.status(400).send({ error: "Cadastro inválido!" });
    }
    const gameFound = jogos.find(jogo => jogo.id == req.params.id);//verificando se há o jogo na lista pelo id informado na rota.
    //Encontrando o jogo com id informado as alterações serão salvas na variável jogo e em seguda incluídas na lista na posição que estava o jogo referido.
    if(gameFound){
       const jogo = {//spread operator, cria um objeto novo a partir de um existente, o req.body vai sobrepor o que há em gameFound
      ...gameFound,
      ...req.body    
    }
    jogos[jogo.id-1] = jogo
    res.send("Cadastro alterado com sucesso!");

    } else {
       res.status(404).send({ error: "Jogo não existe" })
    }
   }) 
    
// Delete
app.delete("/jogos/:id", (req, res) => {
  const gameFound = jogos.find(jogo => jogo.id == req.params.id);
  if (gameFound) {
    const jogosFiltrados = jogos.filter(jogo => jogo.id != req.params.id);//Criando uma nova lista onde não constará o jogo cujo o id foi passado na rota.
    jogos = jogosFiltrados;
    res.send("Jogo apagado com sucesso!");
    } else {
      res.status(404).send({ error: "Jogo não existe" })
    }
  
});

/* 
A função listen do objeto app serve para "ligar" o nosso back-end ou servir o nosso back-end
É obrigatório que essa chamada de função esteja SEMPRE no final do nosso código! */
app.listen(porta, () => {
  // recebe dois parametros, a porta e um função de callback para principalmente mostra um mensagem no console.
  console.log(`Servidor rodando em http://localhost:${porta}`);
});