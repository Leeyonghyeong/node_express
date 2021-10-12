import './config.js';
import express from 'express';
import userRouter from './routers/user.js';

const app = express();

app.use(express.json());
app.set('views', 'src/views');
app.set('view engine', 'pug');

app.use('/public', express.static('src/public'));
app.use('/uploads', express.static('uploads'));
app.use('/users', userRouter);

app.use((err, req, res, next) => {
  res.statusCode = err.statusCode || 500;
  res.send(err.message);
});

export default app;
