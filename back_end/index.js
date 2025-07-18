import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { database } from "./models/DataBase.js";
import https from "https";
import fs from 'fs';
import { router as routeAuth } from "./routes/AuthRoute.js"
import { router as UsersRoute } from "./routes/UsersRoute.js"
import { router as MemesRoute } from "./routes/MemesRoute.js"
import { router as VotesRoute } from "./routes/VotesRoute.js";
import { router as CommentRoute } from "./routes/CommentRoute.js";
import { AppErrorHttp } from "./utils/AppError.js";


const app = express();
const PORT = process.env.PORT;


// logger
app.use(morgan('dev'));

//Accetta tutte le origini 
app.use(cors({
  origin: process.env.END_POINT_ALLOWED
}));


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

  if (!(err instanceof AppErrorHttp)) err.message = "An error occurred";

  let body = {
    status: err.status || 500,
    code: err.code,
    description: err.message || "An error occurred",
  }
  if (err.errors) body.errorsfield = err.errors;

  if (err.status !== 204) {
    res.status(err.status || 500).json(body);
    res.send();
    return;
  }

  res.status(err.status || 500);
  res.send();

});

if (PORT == 443) {
  const sslOptions = {
    key: fs.readFileSync(process.env.PATH_KEY_PEM),
    cert: fs.readFileSync(process.env.PATH_CERT_PEM),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {

  });
} else {
  app.listen(PORT);
}
