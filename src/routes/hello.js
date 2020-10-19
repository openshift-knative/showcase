module.exports = (app) => {
    app.get('/hello', (_, res) => {
        res.json({
            hello: 'world',
        })
    })
}
