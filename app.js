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

// ADD AN ANIMAL
async function addAnimal() {

    // get animals from database for buddy_id
    let animalsDB = await db.promise().query('SELECT animals.id, animals.name, breed, shelters_id, shelters.name AS shelter, cities.name as city, state FROM animals LEFT JOIN shelters ON animals.shelters_id = shelters.id LEFT JOIN cities ON shelters.cities_id = cities.id ORDER BY shelters.name;')
    let animalsArrOb = animalsDB[0];
    let animalsArr = animalsArrOb.map(animalsDB => `${animalsDB.name} _${animalsDB.shelter}`);
    animalsArr.unshift(`NONE`);

    // get shelters from database for shelters_id
    let sheltersDB = await db.promise().query(`SELECT shelters.id, shelters.name AS Shelter, cities.name AS City, state AS State FROM shelters LEFT JOIN cities ON shelters.cities_id = cities.id ORDER BY state ASC, cities.name;`)
    let sheltersArrOb = sheltersDB[0];
    let sheltersArr = sheltersArrOb.map(sheltersDB => `${sheltersDB.Shelter}__${sheltersDB.City}, ${sheltersDB.State}`);

    let userPrompt = await 
    inquirer.prompt([
        {
            type: 'input',
            name: 'animal',
            message: 'Enter the name of the animal:',
            validate: animalInput => {
                if (animalInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient(`Please enter the animal's name!`));
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'breed',
            message: 'Enter the breed of the animal:',
            validate: breedInput => {
                if (breedInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient(`Please enter the animal's breed!`));
                    return false;
                }
            }
        }, 
        {
            type: 'list',
            name: 'shelter',
            message: 'Select the shelter the animal will be located at:',
            choices: sheltersArr
        },
        {
            type: 'list',
            name: 'buddy',
            message: `Who is the animal's buddy?`,
            choices: animalsArr
        }
    ]);

    // convert user input to all uppercase
    let animal = capitalize(userPrompt.animal);
    let breed = capitalize(userPrompt.breed);

    // get shelter name from user selection for shelter
    let shelterStr = userPrompt.shelter;
    let shelter = shelterStr.substring(0, shelterStr.indexOf('__'));
    // get location of shelter selected by user
    let shelterLocation = shelterStr.substring(shelterStr.indexOf('__') + 2);

    // get first word of buddy = name of buddy animal
    let buddyStr = userPrompt.buddy;
    let buddy = buddyStr.split(' ')[0];
    // get last word of buddy = shelter of buddy animal
    let buddyShelter = buddyStr.substring(buddyStr.indexOf('_') + 1);

    // declare variable for buddy_id
    let buddyID;
    await animalsArrOb.forEach(animalDB => {
        if(buddy === animalDB.name && buddyShelter === animalDB.shelter) {
            buddyID = animalDB.id;
        }
        else if (buddy === 'NONE') {
            buddyID = 'NONE';
        }
    });

    // declare variable for shelters_id
    let shelterID;
    await sheltersArrOb.forEach(shelterDB => {

        if(shelter === shelterDB.Shelter && shelterLocation === `${shelterDB.City}, ${shelterDB.State}`) {
            shelterID = shelterDB.id;
        }  
    });

    // check if animal is already in database
    // if the database does not have that animal name+breed+shelter combination, then add it
    if(!animalsArrOb.some((dbData) => dbData.name === animal && dbData.breed === breed && dbData.shelters_id === shelterID)) {

        let sql;
        if(buddyID === 'NONE') {
            // add animal to database with buddyID as NULL (not 'NULL')
            sql = `INSERT INTO animals (name, breed, buddy_id, shelters_id) VALUES("${animal}", "${breed}", NULL, "${shelterID}")`

        }
        else {
            // add animal to database with buddyID
            sql = `INSERT INTO animals (name, breed, buddy_id, shelters_id) VALUES("${animal}", "${breed}", "${buddyID}","${shelterID}")`
        }

        await db.promise().query(sql)

        console.log(gradient.atlas(`\n${animal} added to the database!`));

        displayAnimals();
    }
    // if the animal is already in the database
    else {
        console.log(errorGradient('\nThis animal is already included in the database.\n'));

        // ask the user if they'd like to add another shelter or exit
        const userChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'What would you like to do?',
                choices: ['Add An Animal', 'Exit']
            }
        ]);
 
        if (userChoice.selection === 'Add An Animal') {
            addAnimal();
        }
        else {
            promptUser();
        }
    }
};

// UPDATE ANIMAL
async function updateAnimal() {

    // get animals from database
    let animalsDB = await db.promise().query('SELECT animals.id, animals.name, breed, shelters_id, shelters.name AS shelter, cities.name as city, state FROM animals LEFT JOIN shelters ON animals.shelters_id = shelters.id LEFT JOIN cities ON shelters.cities_id = cities.id ORDER BY shelters.name;')
    let animalsArrOb = animalsDB[0];
    let animalsArr = animalsArrOb.map(animalsDB => `${animalsDB.name} _${animalsDB.shelter}`);

    // get shelters from database
    let sheltersDB = await db.promise().query('SELECT id, name FROM shelters;')
    let sheltersArrOb = sheltersDB[0];

    let userPrompt = await 
    inquirer.prompt([
        {
            type: 'list',
            name: 'animal',
            message: `Which animal's location do you want to update?`,
            choices: animalsArr
        },
        {
            type: 'list',
            name: 'shelter',
            message: 'Which shelter has the animal been moved to?',
            choices: sheltersDB[0]
        }
    ]);

    // get first word of animal user choice = name of animal
    let animalStr = userPrompt.animal;
    let animal = animalStr.split(' ')[0];
    // get shelter of animal selected by user
    let animalShelter = animalStr.substring(animalStr.lastIndexOf('_') + 1);

    // get shelter of animal selected by user
    let shelter = userPrompt.shelter;

    // declare variable animal.id
    let animalID;
    await animalsArrOb.forEach(animalDB => {
        if(animal === animalDB.name && animalShelter === animalDB.shelter) {
            animalID = animalDB.id;
        }
    });    

    // declare variable for shelters_id
    let shelterID;
    await sheltersArrOb.forEach(shelterDB => {
        if(shelter === shelterDB.name) {
            shelterID = shelterDB.id;
        }  
    });

    let sql = `UPDATE animals 
                SET shelters_id = ${shelterID}
                WHERE animals.id = ${animalID}`;

    await db.promise().query(sql)

    console.log(gradient.atlas(`\n${animal}'s shelter location was updated!`));

    displayAnimals();
};

// ADD SHELTER TO DB
async function addShelter() {

    // get shelters from database
    let sheltersDB = await db.promise().query('SELECT name, donations, cities_id FROM shelters;')
    let sheltersArrOb = sheltersDB[0];

    // get cities from database
    let cityStateDB = await db.promise().query('SELECT * FROM cities ORDER BY state;')
    // set cities in database to a variable
    let cityStateArrOb = cityStateDB[0];

    // turn array of objects into array of 'city, state' pairs
    let cityStateArr = cityStateArrOb.map(cityStateDB => `${cityStateDB.name},${cityStateDB.state}`)

    let userPrompt = await 
    inquirer.prompt([
        {
            type: 'input',
            name: 'shelter',
            message: 'Enter the name of the shelter:',
            validate: shelterInput => {
                if (shelterInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient('Please enter a shelter!'));
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'donations',
            message: 'Enter the total amount of donations the shelter has:',
            validate: donationsInput => {
                if (donationsInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient('Please enter a donation amount!'));
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'city',
            message: 'Select the city, state the shelter is located at:',
            choices: cityStateArr
        }
    ]);

    // convert user input to all uppercase
    let shelter = capitalize(userPrompt.shelter);
    let donations = capitalize(userPrompt.donations); 

    // declare citiesID variable for cities_id
    let citiesID;
    cityStateArrOb.forEach(pair => {
        if(userPrompt.city === `${pair.name},${pair.state}`) {
            citiesID = pair.id;
        }  
    });

    // check if shelter is already in database
    // if the database does not have that shelter+city combination, then add it
    if(!sheltersArrOb.some((dbData) => dbData.name === shelter && dbData.cities_id === citiesID)) {

        // add shelter to database
        let sql = `INSERT INTO shelters (name, donations, cities_id) VALUES("${shelter}", "${donations}", "${citiesID}")`
        //
        await db.promise().query(sql)

        console.log(gradient.atlas(`\n${shelter} added to the database!`));

        // start over
        displayShelters(); 
    }
    // if the shelter is already in the database
    else {
        console.log(errorGradient('\nThis shelter is already included in the database.\n'));

        // ask the user if they'd like to add another shelter or exit
        let userChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'What would you like to do?',
                choices: ['Add Shelter', 'Exit']
            }
        ]);
 
        if (userChoice.selection === 'Add Shelter') {
            addShelter();
        }
        else {
            promptUser();
        }
    }
};

// ADD CITY TO DB
async function addCity() {

    // get cities from database
    let cityStateDB = await db.promise().query('SELECT name, state FROM cities;')

    // set cities in database to a variable
    let cityStateArrOb = cityStateDB[0];

    let userPrompt = await 
    inquirer.prompt([
        {
            type: 'input',
            name: 'city',
            message: 'Enter the name of the city:',
            validate: cityInput => {
                if (cityInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient('Please enter a city!'));
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'state',
            message: 'Enter the name of the state:',
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } 
                else {
                    console.log(errorGradient('Please enter a state!'));
                    return false;
                }
            }
        }
    ]);

    // convert user input to sentence case
    let city = capitalize(userPrompt.city);
    let state = capitalize(userPrompt.state); 

    // some checks each element in the array and does the comparison, and if there's an existence it returns true
    if(!cityStateArrOb.some((dbData) => dbData.name === city && dbData.state === state)) {

        let sql = `INSERT INTO cities (name, state) VALUES("${city}", "${state}")`;
        // wait until the data is inserted into the database
        await db.promise().query(sql);

        console.log(gradient.atlas(`\n${city}, ${state} added to the database!`));

        displayCities();
    }
    // if the city is already in the database
    else {
        console.log(errorGradient('\nThis city, state is already included in the database.\n'));

        // ask the user if they'd like to add another city or exit
        let userChoice = await inquirer.prompt([
            {
                type: 'list',
                name: 'selection',
                message: 'What would you like to do?',
                choices: ['Add City', 'Exit']
            }
        ]);
 
        if (userChoice.selection === 'Add City') {
            addCity();
        }
        else {
            promptUser();
        }
    }
};