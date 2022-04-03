const express = require("express")

const app = express()
const { glob } = require("glob")
const { promisify } = require("util")
const globAsync = promisify(glob)
const port = process.env.PORT || 3000
app.set("view engine", "ejs");
app.use(express.static("public"));
app.disable("x-powered-by");

let files = []
async function load() {
    dirs = await globAsync(`${process.cwd()}/src/*.js`);
        dirs.forEach((dir) => {
            let file = require(dir);
            let conf = {};
            conf[`/${file.help.category}/${file.help.name}`] = file.help;
            files.push(conf);
            app.use(`/${file.help.category}/${file.help.name}`, file.router);
        })
}

load();

app.get("/", (req, res) => {
    res.header("Content-Type", "application/json");
    if (req.method === "GET") res.status(200).send(JSON.stringify(files, null, 2));
});


app.listen(port);
