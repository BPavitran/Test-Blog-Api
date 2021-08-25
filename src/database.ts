const mongoose = require('mongoose');

mongoose.ObjectId.get((v: any) => v ? v.toString() : v);
mongoose.set('useFindAndModify', false);

export default async function databaseSetup() {
    await mongoose.connect(process.env.MONGOOSE_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    }).then(() => {
        console.log('Database connection successful')
    })
    .catch((err : any) => {
    console.error('Database connection error')
    });
}