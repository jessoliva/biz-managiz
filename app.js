const inquirer = require('inquirer');
// connect to database
const db = require('./db/connection');
require('console.table');

// to display formatted console.logs
const CFonts = require('cfonts');
const gradient = require('gradient-string');
const errorGradient = gradient('red', 'red');
const animalIcon = String.fromCodePoint(0X1F429);
const shelterIcon = String.fromCodePoint(0X1F3E9);
const citiesIcon = String.fromCodePoint(0X1F306);

// TITLE
CFonts.say(`Speedy's Adoption Central`, {
	font: 'chrome',             // define the font face
	align: 'left',              // define text alignment
	colors: ['#F1BAC4'],        // define all colors
	background: 'transparent',  // define the background color, you can also use `backgroundColor` here as key
	letterSpacing: 1,           // define letter spacing
	lineHeight: 1,              // define the line height
	space: true,                // define if the output text should have empty lines on top and on the bottom
	maxLength: '0',             // define how many character can be on one line
	gradient: ['#F1BAC4', '#98C4AB'],            // define your two gradient colors
	independentGradient: false, // define if you want to recalculate the gradient for each new line
	transitionGradient: false,  // define if this is a transition between colors directly
	env: 'node'                 // define the environment CFonts is being executed in
});

// capitalize data to display nicely
function capitalize(dbData) {

    let data = dbData.trim();

    // for each data entered, check if there's a space 
    // space will be true if there is ' ', and will be false if there isn't
    let space = data.includes(' ');

    // declare variable
    let capitalData;
 
    // if the city name is more than one word (if space is true)
    if (space) {
 
       // split the data name into multiple words and create an array with each word as an element
       let words = data.split(' ');
 
       // iterate over each word 
       for (let i = 0; i < words.length; i++) {
            // make first letter of each word uppercase, and the rest lowercase
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
       // combine the words
       capitalData = words.join(' '); 
    }
    else { // if city has no spaces and only 1 word
        capitalData = data[0].toUpperCase() + data.substring(1);
    }

    // return the data capitalized
    return capitalData;
};

// PROMPT USER 
const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: "Welcome to Speedy's Adoption Central. Please make a selection.",
            choices: [
                'View Adoptable Animals',
                'View Shelters',
                'View Cities',
                'Add An Animal',
                "Update An Animal",
                'Add A Shelter',
                'Add A City',
                'Exit'
            ]
        }
    ])
    // .then(promptUser());
    .then(navigationList => {
        if (navigationList.selection === 'View Adoptable Animals') {
           return displayAnimals();
        }
        else if (navigationList.selection === 'View Shelters') {
            return displayShelters();
        }
        else if (navigationList.selection === 'View Cities') {
            return displayCities();
        }
        else if (navigationList.selection === 'Add An Animal') {
            return addAnimal();
        }
        else if (navigationList.selection === 'Update An Animal') {
            return updateAnimal();
        }
        else if (navigationList.selection === 'Add A Shelter') {
            return addShelter();
        }
        else if (navigationList.selection === 'Add A City') {
            return addCity();
        }   
        else if (navigationList.selection === 'Exit') {
            console.log(gradient.atlas(`\nGoodbye! Please come again!\n`));
            return process.exit();
        }
    });
};

promptUser();

// DISPLAY ANIMALS
async function displayAnimals() {

    const sql = `SELECT a.name AS Animal, a.breed AS Breed, b.name AS Buddy, shelters.name AS Shelter, cities.name AS City, state AS State 
                FROM animals a
                LEFT JOIN animals b ON b.id = a.buddy_id
                LEFT JOIN shelters ON a.shelters_id = shelters.id
                LEFT JOIN cities ON shelters.cities_id = cities.id
                ORDER BY shelters.name ASC, a.name;`

    let animals = await db.promise().query(sql);

    console.log(gradient.atlas(`\n${animalIcon} Adoptable Animals Table\n`));
    console.table(animals[0]);

    promptUser();
};

// DISPLAY SHELTERS
async function displayShelters() {
    const sql = `SELECT shelters.name AS Shelter, cities.name AS City, state AS State
                FROM shelters
                LEFT JOIN cities ON shelters.cities_id = cities.id
                ORDER BY state ASC, cities.name;`

    let shelters = await db.promise().query(sql);

    console.log(gradient.atlas(`\n${shelterIcon} Shelters Table\n`));
    console.table(shelters[0]);

    promptUser();
};

// DISPLAY CITIES
async function displayCities() {
    const sql = `SELECT name AS City, state AS State
                FROM cities
                ORDER BY state;`

    let cities = await db.promise().query(sql);

    console.log(gradient.atlas(`\n${citiesIcon} Cities Table\n`));
    console.table(cities[0]);

    promptUser();
};

