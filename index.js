const express = require("express");
const req = require("express/lib/request");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");
//data base

connection
    .authenticate()
    .then(() => {
        console.log("Coneccao feita com o Banco de dados!")
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })

//Estou dizendo para o express usar o ejs cvomo view engine 
app.set('view engine','ejs');
app.use(express.static('public'));
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Rotas
app.get("/",(req,res) => {
        Pergunta.findAll({ raw: true, order:[
            ['id', 'DESC'] //ASC => siguinifica neste caso que vou estar fazendo uma busca crescente; DESC => uma busca decrecente.
        ] }).then(perguntas => {
            res.render("index",{
                perguntas: perguntas
            });
        }); 
});

app.get("/perguntar",(req, res) =>{
    res.render("perguntar")
});

app.post("/salvarpergunta",(req,res)=>{

    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(()=>{
        res.redirect("/");
    });
});

app.get("/pergunta/:id",(req, res) =>{
    var id = req.params.id;
    Pergunta.findOne({
        where: {id: id},

    }).then(pergunta => {
        if(pergunta != undefined){ //pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[
                     ['id', 'DESC']
                 ]
            }).then(respostas =>{
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas:respostas 
                });
            });

        
        }else{// nao encontrada
            res.redirect("/");
        }
    });
});

app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=> {
        res.redirect("/pergunta/"+perguntaId);//res.redirect("/pergunta/4")

    });
});

app.listen(7070,()=>{console.log("App Rodando !!!");});