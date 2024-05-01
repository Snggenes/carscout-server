const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const { DOMParser } = require("xmldom");

router.post("/", async (req, res) => {
  const { from, to } = req.body;
  const DISTANCE_API_KEY = process.env.DISTANCE_API_KEY;

  const url = `http://dev.virtualearth.net/REST/V1/Routes/Driving?o=xml&wp.0=${from}&wp.1=${to}&avoid=minimizeTolls&key=${DISTANCE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.text();
    const doc = new DOMParser().parseFromString(data, "application/xml");
    const distance = doc.getElementsByTagName("TravelDistance")[0].textContent;
    res.status(200).json({ distance });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
