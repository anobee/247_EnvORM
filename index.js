const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log('Server is running on port 3000');
})
db.sequelize.sync()
.then((result) => {
    app.listen(3000, () => {console.log('Server is running on port 3000')});
})
.catch((err) => {
    console.log(err);
})   

app.post('/komik', async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.status(201).json(komik);
    } catch (error) {
        res.send(err)
    }
})

app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll(); 
        res.json(komik);
    } catch (error) {
        res.send(error);
    }
});

app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({ message: 'Komik not found' });
        }
        await komik.update(data);
        res.send({ message: 'Komik updated successfully', komik });
    } catch (error) {
        res.status(500).send(err);
    }
});

app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const komik = await db.Komik.findByPk(id);
        if (!komik) {
            return res.status(404).json({ message: 'Komik not found' });
        }
        await komik.destroy();
        res.send({ message: 'Komik deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});
