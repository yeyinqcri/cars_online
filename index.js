//imports here
const express = require("express");
const routes = require("./Routes/Routes");
const path = require("path");
const app = express();




//middlewares
//  by default express will use public as base directiry so do not give directory as "./public/css/style.css" it will generate a error
//  always give directiry as /css/style.css
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
//by default express will look views folder in index level so you don,t have to write "app.set("views", path.join(__dirname, "views"))";

//routing here
app.get("/", routes);

//server config
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`listening on port ${PORT} ........`));
