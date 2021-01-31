const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080

app.use(express.static('public'));

app.listen(PORT, () => {
    console.log(`Successfully connected to ${PORT}`);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
