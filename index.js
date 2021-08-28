const express = require("express");//require é necessário para importar uma biblioteca/módulo.
const jogoSchema = require('./models/jogo');
const mongoose = require("./database");

const app = express();//Instanciando um servidor na variável app que será utilizada para chamar os métodos
//GET/POST/PUT/DELETE

const porta = 3000;
app.use(express.json());//Adicionando um middleware de configuração para que o servidor entenda o tipo de dados que serão trabalhados.
//use é uma propriedade para se utilizar middlewares na aplicação.


//Primeiro parâmetro informa-se a rota, neste caso a inicial e no segundo uma função de callback
//req - cliente => servidor, res - servidor => cliente.
app.get("/", (req, res) => {
    res.send({ info:  "Hello MongoDB"});
});

app.get('/jogos', async (req, res) => {
    const jogos = await jogoSchema.find();
    res.send(jogos)
});
app.get("/jogos/:id", async (req, res) => {
  const id = req.params.id;
  // Verificar se o id recebido no parametro é um ID válido:
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(422).send({ error: "Id inválido" });
    return;
  }
  // Buscar no mongodb o document que possui o id recebido pela req.param
  const jogo = await jogoSchema.findById(id);
  // Verificar se o document foi encontrado:
  if (!jogo) {
    res.status(404).send({ erro: "Jogo não encontrado!" });
    return;
  }
  res.send({ jogo });
});

app.post('/jogos', async (req, res) => {
    const jogo = req.body;
    if (!jogo || !jogo.nome || !jogo.imagem) {
      res.status(400).send({ error: "Verifique se os campos foram preenchidos corretamente." });
      return;
    }
    await new jogoSchema(jogo).save()

    res.status(201).send('Jogo cadastrado!');
  
});

app.put('/jogos/:id', async(req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)){
    res.status(422).send({error: "Id inválido"});
    return;
  }
  const jogo = await jogoSchema.findById(id);

  if(!jogo) {
    res.status(404).send({erro: "Jogo não encontrado!"});
    return;
  }

  const novoJogo = req.body;

  if(!jogo || !jogo.nome|| !jogo.imagem) {
    res.status(400).send({ error: "Verifique os campos informados."});
    return;
  }
  await jogoSchema.findOneAndUpdate({_id: id}, novoJogo);

  const jogoAtualizado = await jogoSchema.findById(req.params.id);

  res.send({ jogoAtualizado });
});

app.delete('/jogos/:id', async(req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)){
    res.status(422).send({error: "Id inválido"});
    return;
  }
  const jogo = await jogoSchema.findById(req.params.id)
  if(!jogo){
    res.status(404).send({error: "Jogo não encontrado!"});
  }
  await jogoSchema.findByIdAndDelete(req.params.id);
  res.send({message: "Jogo excluído com suceso!"});
})

//Após o servidor ouvir a porta informada no primeiro parâmetro executará a função de callback.
app.listen(porta, () =>
  console.log(`Servidor rodando em http://localhost:${porta}`)
);