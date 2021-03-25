const express = require("express");
const routes = require("./routes/routes");
const path = require("path");
const { PORT, NODE_ENV } = require("./config/config");
const app = express();

//middlewares
//  by default express will use public as base directiry so do not give directory as "./public/css/style.css" it will generate a error
//  always give directiry as /css/style.css
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(routes);

//by default express will look views folder in index level so you don,t have to write "app.set("views", path.join(__dirname, "views"))";

//server config
let port = 5000
if (NODE_ENV === "production")  port = PORT;

app.listen(port, () => console.log(`listening on port ${port} ........`));
