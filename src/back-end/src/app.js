const express = require('express')
const app = express()
const port = 8000

app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log("Server received GET request! 🚀");
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})