import express, { Request, Response } from "express";

import { RailApi } from "./RailApi";
const router = express.Router();

const default_station_name = "Antwerpen";

declare module 'express-session' {
    interface SessionData {
      station: string;
    }
  }

router.get("/", async (req: Request, res: Response) => {
    let station =req.session.station != undefined ? req.session.station : default_station_name;
    let data = (await RailApi.getLiveBoard(station, "nl", false))?.departures.departure.filter(d => parseInt(d.id) <= 28);
    res.status(200).render("index", { station: station, departures: data });
});

router.post("/", async (req: Request, res: Response) => {
    if (req.body.station && req.body.station.trim() != "") 
        req.session.station = req.body.station;

    res.redirect("/");
});

module.exports = router; 