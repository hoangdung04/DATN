import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();
import sequelize from "./config/database";
sequelize;
import bodyParser from "body-parser";
import cors from "cors";

import { routesClient } from "./routes/client/index.route";
import adminRoutes from "./routes/admin/index.route";
import { apiRoutes } from "./routes/api/index.route";
import { systemConfig } from "./config/system";
import path from "path";

const app: Express = express();
const port: number = 3000;

app.set('views', `${__dirname}/views`); // Tìm đến thư mục tên là views
app.set('view engine', 'pug'); // template engine sử dụng: pug

app.use(express.static(`${__dirname}/public`)); // Thiết lập thư mục chứa file tĩnh

// Cho phép React frontend (port 5173) gọi API
app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// API Routes (trả JSON cho React frontend)
app.use("/api", apiRoutes);

adminRoutes(app);
routesClient(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});