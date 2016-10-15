const Router = require('express').Router;
const router = new Router();
var fs = require('fs');

const user  = require('./model/user/user-router');
const pet  = require('./model/pet/pet-router');


router.route('/api').get((req, res) => {
    
    var obj = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    
    var name = req.param("n");
    var address = req.param("a");
    
    console.log("Params: n >" + name + " a " + address);
    
  res.json(obj);
});

router.use('/user', user);
router.use('/pet', pet);


module.exports = router;
