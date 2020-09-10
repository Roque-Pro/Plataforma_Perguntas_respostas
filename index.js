const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta')

//database
connection.authenticate().then(() =>{
    console.log('conexão feita com sucesso')
}).catch((msgErro) => {
    console.log(msgErro);
})

app.set('view engine', 'ejs')
//estou dizendo para o express usar o ejs como view engine
//ou seja, como renderizador de html
app.use(express.static('public'));
//bodyparser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
//rotas
app.get('/', (req, res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC'] // para crescente é ASC // DESC decrescente
    ]}).then(perguntas => {
        res.render('index', {
            perguntas: perguntas
        });
    })
 
});

app.get('/:perguntar', (req, res) =>{
    res.render('perguntar')
})

app.post('/salvarpergunta', (req, res) => {

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() =>{
        res.redirect('/');
    })
   
    
})

app.get('/pergunta/:id', (req, res)=>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id}
    }).then(pergunta =>{
        if( pergunta != undefined){ //pergunta encontrada


            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta:pergunta,
                    respostas: respostas
                })
           
            });
        }else{ // pergunta não encontrada
            res.redirect('/');
        }
    })
})



app.post('/responder', (req, res)=> {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/' + perguntaId);

    })
})

app.listen(3305, ()=> {console.log('App rodando');});