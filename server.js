require('./dbConfig/config');
const express = require('express');

require('dotenv').config();


const participantRouter = require('./routers/studentRouter');
const app = express();
app.use(express.json());
app.use('/api/participant/', participantRouter)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});