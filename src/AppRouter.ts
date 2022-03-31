import express, { Request, Response } from "express";
import { RailApi } from "./RailApi";
const router = express.Router();

const station_name = "Antwerpen";

router.get("/", async (req: Request, res: Response) => {
    let data = (await RailApi.getLiveBoard(station_name, "nl", false))?.departures.departure.filter(d => parseInt(d.id) <= 28);
    res.status(200).render("index", { station: station_name, departures: data });
});

module.exports = router; 