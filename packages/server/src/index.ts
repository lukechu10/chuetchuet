import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({success: true, message: 'Hello World'})
});

app.listen(8080);