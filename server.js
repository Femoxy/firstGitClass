require('./dbConfig/config');
const express = require('express');

require('dotenv').config();


const userRouter = require('./routers/userRouter');
const app = express();
app.use(express.json());
app.use('/api/v1', userRouter)

const port = process.env.PORT

app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
});