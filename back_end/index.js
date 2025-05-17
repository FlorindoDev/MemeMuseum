import express from "express";
import morgan from "morgan"; //popular logging middleware (http://expressjs.com/en/resources/middleware/morgan.html)
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { router as routeAuth } from "./routes/AuthRoute.js"
import { router as UsersRoute } from "./routes/UsersRoute.js"
import { database } from "./models/DataBase.js";


const app = express();
const PORT = 3000;


// logger
app.use(morgan('dev'));

app.use(cors()); //API will be accessible from anywhere

// Transforma ogni body in json
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
  apis: ['./models/*.js', "./routes/*Route.js"], // files containing annotations
});

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//define routes
app.use(routeAuth);
app.use(UsersRoute);

//error handler
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred"
  });
});


app.listen(PORT);