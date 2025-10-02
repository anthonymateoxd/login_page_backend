import router from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(
  cors({
    origin: ['http://localhost:8100', 'http://localhost:8081'],
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.use('/api', router);

export default app;
