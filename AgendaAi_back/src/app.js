import express from 'express';
import {router} from "./routes/user.route.js";
import {routerEnt} from "./routes/entrepreneur.routes.js";
import dotenv from 'dotenv/config.js'
import { schedulingRouter } from './routes/scheduling.router.js';
import { routerCont } from './routes/contato.router.js';
//import { routerAdmin } from './routes/admin.route.js';
import { routerServicesEntreprenuer } from './routes/services_entreprenuer.js';
//import chatbotRoutes from './routes/chatbot.router.js';


import cors from 'cors'
export const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", router);
app.use("/entrepreneur", routerEnt);
app.use("/scheduling", schedulingRouter);
app.use("/contato", routerCont);
//app.use("/admin", routerAdmin)
app.use("/servicesEntreprenuer", routerServicesEntreprenuer);
app.use("/api/entrepreneur", routerEnt);
app.use("/api/user", router);
//app.use('/api/chat', chatbotRoutes);