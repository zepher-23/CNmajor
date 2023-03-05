This TO-DO app is written using ExpressJS for handling the backend functions, MongoDB for database and EJS, CSS, HTML for the front end.

This app can add tasks, delete tasks. Each task contains a description, category, date and time data that is collected via form from the user.

The user data is stored in a local database, the data in the database is updated upon addition and removal of tasks by the user in the UI.

To run the application,
run `npm install` in the root directory of the project using a terminal, this will download all the dependencies mentioned in the `package.json` file.

run `npm start` in the root directory of the project in the terminal, this will start the backend server on port `8000`.

Now open another terminal in the same directory and run `mongod`, this will establish a connection between server and database locally.

You can view the app on your browser at `http://localhost:8000/`.
Thank you.
