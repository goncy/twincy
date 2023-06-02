import express from "express";

import discordRouter from "./discord";

const router = express.Router();

router.use("/discord", discordRouter);

export default router;
