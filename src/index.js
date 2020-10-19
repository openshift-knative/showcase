import express from 'express'

const DEFAULT_PORT = 21111
const app = express()
const port = process.env.PORT || DEFAULT_PORT

app.get('/', (_, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
