const Router = require('express').Router;
const router = new Router();
var fs = require('fs');
var xpath = require('xpath')
    , dom = require('xmldom').DOMParser
var unique = require('array-unique');
const user = require('./model/user/user-router');
router.route('/api').get((req, res) => {
    var parse = require('xml-parser');
    var xmlHafte = fs.readFileSync('data/rothafte.xml', 'utf8');
    var docHafte = new dom().parseFromString(xmlHafte);
    var nodesHafte = xpath.select("//rotemansarkivethaften[Kodtext = 'Katarina']", docHafte);
    var xmlBase = fs.readFileSync('data/rotbas.xml', 'utf8');
    var docBase = new dom().parseFromString(xmlBase);
    nodesHafte.forEach(function (node) {
        console.log("Node: " + node);
        const myReg = />(\d*)</g;
        var id = myReg.exec(node)[1];
        console.log("Fetchzed id: " + id);
        console.log("trying to execute xpath: " + "//rotemansarkivetbas[Häftesnummer = '" + id + "']");
        var match = xpath.select("//rotemansarkivetbas[Häftesnummer = '" + id + "']", docBase);
        console.log("Found one!" + match.length);
    });
    console.log("num of posts: " + nodesHafte.length);
    var obj = JSON.parse(fs.readFileSync('data/data.json', 'utf8'));
    res.jsonp(obj);
});
router.use('/user', user);
module.exports = router;