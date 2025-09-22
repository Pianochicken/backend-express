import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
import 'reflect-metadata';
import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import { RegisterRoutes } from './routes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';
import { dataSource } from './app-data-source';
import errorMiddleware from './middleware/errorMiddleware';
import AppError from './utils/appError';
import morgan from 'morgan';
import logger from './utils/logger';

const port = process.env.PORT || 3000;

class Server {
  private app = express();

  async start() {
    // Morgan setup to redirect morgan's output to winston
    const stream = {
      write: (message: string) => logger.http(message.trim()),
    };

    const morganMiddleware = morgan(
      ':method :url :status :res[content-length] - :response-time ms',
      { stream }
    );

    try {
      await dataSource.initialize();
      logger.info('Data Source has been initialized.');

      this.app.use(
        urlencoded({
          extended: true,
        })
      );
      this.app.use(json());

      // Use morgan middleware for HTTP request logging
      this.app.use(morganMiddleware);

      RegisterRoutes(this.app);

      this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

      this.app.get('/', (req, res) => {
        res.send('Hello World!');
      });

      this.app.use((req: Request, res: Response, next: NextFunction) => {
        next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
      });

      this.app.use(errorMiddleware);

      this.app.listen(port, () => {
        logger.info(`Server is running on port ${port} in ${process.env.NODE_ENV} mode`);
      });
    } catch (err) {
      logger.error('Error during server startup:', err);
    }
  }
}

const server = new Server();

server.start();