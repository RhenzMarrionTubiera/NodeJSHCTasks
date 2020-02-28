const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const knexDB = {
    client: 'mysql',
    connection: {
      host : '127.0.0.1',
      user : 'hcuser',
      password : 'homecredit',
      database : 'hcdb'
    }
  };

//show all tasks as json from DB
app.get('/tasks', (req, res) => {
    const knex = require('knex')(knexDB);
    knex.from('tasks').select("*")
        .then((rows) => {
            res.json(rows);
        }).catch((err) => { console.log( err); throw err })
        .finally(() => {
            knex.destroy();
        });
})

//show a specific task based from id on the url from DB
app.get('/tasks/:id', (req, res) => {
    const knex = require('knex')(knexDB);
    knex.from('tasks').select("*").where('id', '=', req.params.id)
        .then((rows) => {
            for (row of rows) {
                res.json({ 
                    id: `${row['id']}`,
                    title: `${row['title']}`,
                    description: `${row['description']}`,
                    status: `${row['status']}`,
                    created_at: `${row['created_at']}`,
                    updated_at: `${row['updated_at']}`
                });
            }
        }).catch((err) => { console.log( err); throw err })
        .finally(() => {
            knex.destroy();
        });
})

//add a task to DB
app.post('/tasks/add', (req, res) => {
    const knex = require('knex')(knexDB);
    const task = [
        { id: '', title: req.body.title, description: req.body.description, status: 'Pending', created_at: new Date(), updated_at: new Date() }
    ]
    knex.from('tasks').insert(task)
        .then(() => res.send("Task has been added!"))
        .catch((err) => { console.log( err); throw err })
        .finally(() => {
            knex.destroy();
        });
})

//update details on DB for a specific task based from the id on the url
app.put('/tasks/updateDetails/:id', (req, res) => {
    const knex = require('knex')(knexDB);
    knex.from('tasks').select("*").where('id', '=', req.params.id)
        .update({
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            updated_at: new Date(),
            thisKeyIsSkipped: undefined
        })
        .then(() => res.send("Task has been updated!"))
        .catch((err) => { console.log( err); throw err })
        .finally(() => {
            knex.destroy();
        });
})

//delete a task based from the id on the url
app.delete('/tasks/delete/:id', (req, res) => {
    const knex = require('knex')(knexDB);
    knex.from('tasks').select("*").where('id', '=', req.params.id)
        .del().then(() => res.send("Task has been deleted!"))
        .catch((err) => { console.log( err); throw err })
        .finally(() => {
            knex.destroy();
        });
})


app.listen(3000, () => {
  console.log('Server running on http://localhost:3000')
})

//TESTING