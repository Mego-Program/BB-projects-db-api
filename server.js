import http from "http"
import dotenv from "dotenv"
import app from "./index.js";
dotenv.config();

const port = process.env.PORT;
const server = http.createServer(app);
app.listen(port, () => {
    console.log(`Server is running at sadf http://127.0.0.1:${port}`);
});