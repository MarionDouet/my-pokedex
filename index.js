const connection = require('./conf');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//GET all pokemon or filter by type1 OK

app.get('/pokedex/pokemon', (req, res) => {
  let sql = 'SELECT * FROM pokemon';
  const sqlValues = [];
  if(req.query.type1_id) {
    sql += ' WHERE type1_id = ?';
    sqlValues.push(req.query.type1_id);
  }
  if(req.query.date_capture) {
    sql += ' WHERE date_capture > ?'; 
    sqlValues.push(req.query.date_capture);
  }
  if(req.query.name){
    sql += ` WHERE name LIKE '${req.query.name}%'`
    sqlValues.push(req.query.name)
  }
  connection.query(sql, sqlValues, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Erreur lors de la récupération des données du pokédex');
    } else {
      res.json(results);
    }
  });
});

//GET pokemon by name OK!

app.get('/pokedex/pokemon/:name', (req, res) => {

  const name= req.params.name;
  
  connection.query('SELECT * FROM pokemon WHERE name = ?', [name], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la récupération des données du pokemon");
    } else {
      res.json(results);
    }
  });
});



//GET pokemon by pokedex order 

app.get('/pokedex/order', (req, res) => {
  let sql = `SELECT * FROM pokemon`;
  const sqlValues = [];
  if(req.query.order) {
    sql += ` ORDER BY pokedex_number ${req.query.order}` ;
    sqlValues.push(req.query.order);
  }
  
  connection.query(sql, sqlValues, (err, results) => {
    if (err) {
      console.log(err)
      res.status(500).send('Erreur lors de la récupération des données du pokédex');
    } else {
      res.json(results);
    }
  });
});

//POST a pokemon OK

app.post('/pokedex/pokemon', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO pokemon SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de l'ajout du pokémon");
    } else {
      res.status(200).send("Pokémon ajouté");
    }
});
});




//UPDATE a pokemon by id OK
app.put('/pokedex/pokemon/:id', (req, res) => {

  const id= req.params.id;
  const formData = req.body;

  connection.query('UPDATE pokemon SET ? WHERE id = ?', [formData, id], err => {

    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification du pokemon");
    } else {
      res.status(200).send("Pokemon modifié");
    }
  });
});

//UPDATE le toggle du booleen 
app.put('/pokedex/change', (req, res) => { 
  connection.query(`UPDATE pokemon SET is_captured = NOT is_captured `, err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification du pokemon");
    } else {
      res.status(200).send("Pokemon modifié");
    }
  });
});

//DELETE a pokemon by id

app.delete('/pokedex/pokemon/:id', (req, res) => {
    const id= req.params.id;
  connection.query('DELETE FROM pokemon WHERE id = ?', [id], err => {
    if (err) {
      res.status(500).send("Erreur lors de la suppression du pokémon");
    } else {
      
      res.status(200).send("Pokemon supprimé");
    }
  });
});

// DELETE all entity if falsy 

app.delete('/pokedex/uncaptured', (req, res) => {

connection.query(`DELETE FROM pokemon WHERE is_captured = false`,  err => {
  if (err) {
    res.status(500).send("Erreur lors de la suppression des pokémon non capturés");
  } else {
    
    res.status(200).send("Pokemon non capturés supprimés");
  }
});
});


//get types

app.get('/pokedex/type', (req, res) => {
  connection.query('SELECT * FROM type', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des types');
    } else {
      res.json(results);
    }
  });
});

//post types

app.post('/pokedex/type', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO type SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de l'ajout du pokémon");
    } else {
      res.status(200).send("Type ajouté");
    }
});
});




app.listen(port, (err) => {
  if (err) {
    throw new Error('OUPS! Something bad happened...');
  }
  console.log(`Server is listening on ${port}`)
});

