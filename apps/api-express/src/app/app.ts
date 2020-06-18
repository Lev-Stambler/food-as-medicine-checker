import * as express from 'express';
import * as bodyParser from 'body-parser';
import router from './controllers';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

export default app;
