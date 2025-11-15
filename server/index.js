const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello' })
})

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);


app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`);
});




