const mongoose = require('mongoose');

// connection
const mongo_user = 'vineeth';
const mongo_pass = 'vineeth';
const db_name = 'grediit-dass';
const cluster_name = 'basiccluster';
const DB_URI = `mongodb+srv://${mongo_user}:${mongo_pass}@${cluster_name}.vmc7djj.mongodb.net/${db_name}?retryWrites=true&w=majority`;

// connection function
const mongoConnect = () => {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
    })
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.log(`Couldn't connect to database with error ${err}`);
        process.exit(1);
    })
}

module.exports = {
    DB_URI: DB_URI,
    mongoConnect: mongoConnect
};