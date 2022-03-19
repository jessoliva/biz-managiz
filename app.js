// to add a department --> display departments first so user can see what's already there

const inquirer = require('inquirer');
const Company = require('./lib');

const promptUser = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'selection',
            message: 'Welcome to APP-NAME. Please make a selection.',
            choices: [
                'View Chihuahuas',
                'Add A Chihuahua',
                'Update Chihuahua Talent',
                'View Talents',
                'Add Talent',
                'View Departments',
                "Add Department",
                "Exit"
            ]
        }
    ]);
};

promptUser()
.then(navigationList => {
    if (navigationList.selection === 'View Departments') {
        console.log('you selected', navigationList.selection);
        new Company().displayDepartments();
    }
});

// how do i add data to database 