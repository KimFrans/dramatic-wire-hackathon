import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from'body-parser';
import pg from "pg";
import OrigamiService from './origami-service.js';
import OrigamiRoutes from './origami-routes.js';
import { LocalStorage } from 'node-localstorage';

let nodeLocalStorage = undefined;
const Pool = pg.Pool;
const app = express();
const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/origami';
const pool = new Pool({
  connectionString,
// 	  ssl: {
//     rejectUnauthorized: false,
//   },
});

if (typeof localStorage === "undefined" || localStorage === null) {
  nodeLocalStorage = new LocalStorage('./scratch');
}

const origamiService = OrigamiService(pool);
const origamiRoutes = OrigamiRoutes(origamiService);

//setup template handlebars as the template engine
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
//setup middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
//configure the port number using and environment number
app.get('/', async function (req, res) {
    const animals = await origamiService.getAnimals();
    for (const animal of animals) {
        if (nodeLocalStorage.getItem(animal.name) == 'completed') {
            animal.completed = true;
        }
    }
    //animals[0].completed = true;
    //animals[2].locked = true;
    res.render('index', {
        animal: animals
    })
})
app.get('/:animal/validation',  async function (req, res) {
    res.render('validation', {
        layout: 'model',
        animal: req.params.animal
    })
})

app.get('/:animal/step/:step_id', async (req, res) => {

    const targetAnimal = req.params.animal;
    const stepID = req.params.step_id;
    const instruction = await origamiService.getInstructions(targetAnimal, stepID);
    const totalSteps = await origamiService.getTotalSteps(targetAnimal);
    let prev = undefined;
    let next = undefined;
    if (stepID > 1) {
        prev = parseInt(stepID) - 1;
    }

    if (stepID < totalSteps) {
        next = parseInt(stepID) + 1;
    }

    res.render('steps', {
        animal: targetAnimal,
        step: stepID,
        instruction: instruction,
        prev: prev,
        next:next
    })
}) 

app.get('/level/:level/:animal', (req, res) => {
    res.render('start', {
        level: req.params.level,
        animal: req.params.animal
    })
})

app.get('/:animal/success', (req, res) => {
    const targetAnimal = req.params.animal;
    nodeLocalStorage.setItem(targetAnimal, 'completed');
    res.render('success', {
        animal: targetAnimal,
        layout: 'confetti'
    });
})

app.get('/:animal/not-found', (req, res) => {
    res.render('not-found', {
        animal: req.params.animal,
    })
})

var portNumber = process.env.PORT || 3020;

//start everything up
app.listen(portNumber, function () {
    console.log('Starting on:', portNumber);
});