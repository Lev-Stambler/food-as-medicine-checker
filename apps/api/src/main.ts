import app from './app/Server';
import logger from './app/shared/Logger';
import './app/LoadEnv';
console.log(process.env.NODE_ENV);

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  logger.info('Express server started on port: ' + port);
});
