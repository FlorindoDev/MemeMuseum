import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { database } from "./models/DataBase.js";
import { router as routeAuth } from "./routes/AuthRoute.js"
import { router as UsersRoute } from "./routes/UsersRoute.js"
import { router as MemesRoute } from "./routes/MemesRoute.js"
import { router as VotesRoute } from "./routes/VotesRoute.js";
import { router as CommentRoute } from "./routes/CommentRoute.js";


//TODO: RICORDA DI DARE AL PROF .env gia fatto e passare il json per google storage

//TODO: Aggiungere il controllo al contenuto dei body in tutte le route
//TODO: Aggiungere protezioni alle vulnerabilità

const app = express();
const PORT = 3000;


// logger
app.use(morgan('dev'));


app.use(cors());


app.use(express.json());


const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Meme Museum',
      version: '1.0.0',
    },
    components: {
      schemas: {}
    }
  },
  apis: ['./models/*.js', './utils/AppError.js', , "./routes/*Route.js"], // files containing annotations
});


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));



//define routes
app.use('/auth', routeAuth);
app.use('/users', UsersRoute);
app.use('/memes', MemesRoute);
app.use('/votes', VotesRoute);
app.use('/comments', CommentRoute);


//error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    status: err.status || 500,
    code: err.code,
    description: err.message || "An error occurred"
  });
});


app.listen(PORT);