const express = require("express");
const app = express();
require('dotenv').config()
require('./utils/globalConfig');

const routerData = require('./Router')
const cors = require("cors");
const Dbinitiate = require("./utils/dbConfig")

app.use(express.static("uploads/images",))//this meaning inside upload folder  i gave the acces to the public means this all images are acces to the any where.if check this image print or not  "http://localhost:9090/image_1743837172817.png"here server plus image name
app.use(cors());//once apply this once url path are allowed once restricted the path use the below format.

//giving some resticted thing then we can use the below way
// app.use(cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true // Allow cookies if needed
// }));


app.use(express.json());

app.use('/user/api', routerData)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server up and running on port ${port} !!!!..`)

}
);