import express, {json, urlencoded} from 'express'
import { RegisterRoutes } from "./routes";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json'

const port = process.env.PORT || 3000

class Server {
    private app =  express();

    start() {
        this.app.use(
            urlencoded({
                extended: true,
            })
        );
        this.app.use(json());

        RegisterRoutes(this.app);

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
        
        this.app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        this.app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
}

const server = new Server();

server.start();
