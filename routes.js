const Router = require('express').Router;
const router = new Router();
var fs = require('fs');
var xpath = require('xpath')
    , dom = require('xmldom').DOMParser
var unique = require('array-unique');
var parser = require('xml2json');
const user = require('./model/user/user-router');
router.route('/api').get((req, res) => {
    var parse = require('xml-parser');
    var xmlHafte = fs.readFileSync('data/rothafte.xml', 'utf8');
    var docHafte = new dom().parseFromString(xmlHafte);
    var loc = req.query.loc;
    console.log('loc: ' + loc);
    var nodesHafte = xpath.select("//rotemansarkivethaften[Kodtext = '" + loc + "' and Kod='GATA']", docHafte);
    var xmlBase = fs.readFileSync('data/rotbas.xml', 'utf8');
    var docBase = new dom().parseFromString(xmlBase);
    var xmlArr = null;
    var xmlStr = "";
    nodesHafte.forEach(function (node) {
        const myReg = />(\d*)</g;
        var id = myReg.exec(node)[1];
        console.log("Fetchzed id: " + id);
        console.log("trying to execute xpath: " + "//rotemansarkivetbas[Häftesnummer = '" + id + "']");
        var match = xpath.select("//rotemansarkivetbas[Häftesnummer = '" + id + "']", docBase);
        console.log("L:" + match.length);
        if (match.length > 0) {
            console.log("Found one!" + match);
            xmlArr = match;
        }
    });
    xmlStr = '<?xml version="1.0" encoding="utf-8" standalone="yes"?><data>' + xmlArr.join('') + '</data>';
    console.log("num of posts: " + nodesHafte.length);
    console.log("xmlStr: " + xmlStr);
    var obj = null;
    if (nodesHafte.length > 0) {
        var json = parser.toJson(xmlStr);
        obj = JSON.parse(json);
    }
    res.jsonp(obj);
});
router.use('/user', user);
module.exports = router;
//Urvädersgränd,8