const express = require('express');
const dotenv = require('dotenv').config()
const cors = require('cors')
const {mongoose} = require('mongoose')
const app = express();
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/predictionRoutes');
const bodyParser = require('body-parser');


//database connection
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('Database Connencted'))
.catch((err) => console.log('Database Not Connected',err))

//middleware
app.use(cookieParser());
app.use(bodyParser.json()); // For parsing application/json
app.use(express.urlencoded({extended:false}))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
app.use(express.json())



app.use('/',require('./routes/authRoutes'))
app.use('/users', userRoutes);

// const port = 8000;
// app.listen(port,()=>console.log(`Server is running on port ${port}`))
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
