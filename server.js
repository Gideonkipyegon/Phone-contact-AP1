import express from "express";
import config from "./src/db/config.js";
import bodyParser from "body-parser";
import user from "./src/routes/routes.js";


const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

user(app);

app.listen(config.port, () => {
  console.log(`Server running at ${config.url}`);
});
