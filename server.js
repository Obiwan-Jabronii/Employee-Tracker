const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes');

const PORT = process.env.PORT || 3001;
const app = express()

const index = () => {
    require('./index');
}

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.use('/api', apiRoutes);

app.use((req,res) => {
    req.status(404).end();
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        index();
    });
});