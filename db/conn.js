const mongoose = require('mongoose');

const port = process.env.PORT || 9090;
const databaseName = 'buildlab';

mongoose.set('debug' ,  true);

mongoose.Promise = global.Promise;
mongoose 
   .connect(`mongodb://localhost:27017/${databaseName}`)
   .then(() => {
    console.log(`connected to ${databaseName}`);
   })
   .catch(err => {
    console.log(err);
}).then(()=>{
    console.log("Connection Successfull");
}).catch((e)=>{
    console.log(e);
})