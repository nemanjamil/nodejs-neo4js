var express = require("express");
var path = require("path");
var logger = require("morgan");
var bodyParser = require("body-parser");
const neo4j = require('neo4j-driver').v1;


var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "12345"));
const session = driver.session();

app.get('/', (req, res) => {
    session
        .run('match (p:Person) RETURN p')
        .then(function (result) {
            var listNames = [];
            result.records.forEach(function (record) {
                idNote =  record.get(0).identity.low;
                name = record.get(0).properties.name
                console.log(idNote);
                listNames.push({
                    id : idNote,
                    name : name
                });
                
            });
            res.render('index',{
                listNames : listNames
            });
            session.close();
        })
        .catch(function (err) {
            console.log(err);
        });
    //driver.close();
    //res.send('Radi sistem');
});
app.listen(3000);
console.log("Server start @ port 3000");

module.exports = app;