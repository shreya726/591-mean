let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

db = mongoose.connection;
db.once('open', function(){
    console.log('Connection successful')
});

const word_schema = new mongoose.Schema({
    string: String,
    length: Number
});

const Word = mongoose.model('Word', word_schema);

router.get('/:test', function(req, res, next) {
    let string = req.params.test;
    let query = Word.findOne({'string': string});
    query.select('length');
    query.exec(function (err, db_word_length) {
        if (err) return err;
        if (!(db_word_length == null)) {
            let length = db_word_length.length;
            console.log('Getting from db');
            return res.send({'string': string, 'length': length});
        } else {
            let word_json = {'string': string, 'length': string.length};
            let new_word = new Word(word_json);
            console.log('Saving to db');
            new_word.save(function(err){
                if (err) {res.send(err)}
                else {res.send(word_json)}
            });
        }
    });
});

router.post('/', function(req, res, next) {
    if (!('string' in req.body)) {
        return res.json({'message': 'Please pass a string'})
    }
    let string = req.body.string;
    let query = Word.findOne({'string': string});
    query.select('length');
    query.exec(function (err, db_word_length) {
        if (err) return err;
        if (!(db_word_length == null)) {
            let length = db_word_length.length;
            console.log('Getting from db');
            return res.json({'string': string, 'length': length});
        } else {
            let word_json = {'string': string, 'length': string.length};
            if (string.length < 1){
                return res.json({'message': 'Please pass a string'})
            }
            let new_word = new Word(word_json);
            console.log('Saving to db');
            new_word.save(function(err){
                if (err) {res.send(err)}
                else {res.json(word_json)}
            });
        }
    });
});

router.get('/', function(req, res, next) {
    let query = Word.find();
    query.select('-_id string');
    query.exec(function (err, words) {
        if (err) return err;
        res.json(words);
    })
});

router.delete('/', function(req, res, next){
    let string = req.body.string;
    Word.remove({ string: string }).exec(function (err, item) {
        if (err) res.send(err);
        if (item.n == 0) {
            res.json({'string': string, 'message':'String not found'})
        }
        else {
            res.json({'string':string, 'message': 'Delete successful'})
        }
    });
});

module.exports = router;