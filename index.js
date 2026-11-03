
const express = require('express');
const app = express();
const port = 3000;
const db = require('./models');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// POST - Menambahkan komik
app.post('/komik', async (req, res) => {
    const data = req.body;
    try {
        const komik = await db.Komik.create(data);
        res.status(201).json(komik);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET - Menampilkan semua komik
app.get('/komik', async (req, res) => {
    try {
        const komik = await db.Komik.findAll();
        res.json(komik);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - Mengubah komik
app.put('/komik/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const komik = await db.Komik.findByPk(id);

        if (!komik) {
            return res.status(404).json({
                message: 'Komik not found'
            });
        }

        await komik.update(data);

        res.json({
            message: 'Komik updated successfully',
            komik
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE - Menghapus komik
app.delete('/komik/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const komik = await db.Komik.findByPk(id);

        if (!komik) {
            return res.status(404).json({
                message: 'Komik not found'
            });
        }

        await komik.destroy();

        res.json({
            message: 'Komik deleted successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Menjalankan database dan server
db.sequelize.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log('Database connection failed:', error);
    });
