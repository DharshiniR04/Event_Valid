const express = require("express");
const cors = require("cors");
const Event = require("./event");
const userRegister = require("./userRegistration");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("Connected to MongoDB!");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });


app.post("/eventfind", async (req, res) => {
    const { eventid } = req.body;
    try {
        const r = await Event.findOne({ eventid });
        res.json(r);
    } catch (err) {
        console.log(err);
    }
});

app.post("/personfind", async (req, res) => {
    const { participantid } = req.body;
    try {
        const user = await userRegister.findOne({ participantid });
        if (user) {
            res.json({ participantid: user.participantid, bool: user.bool });
        } else {
            res.status(404).json({ error: "Participant not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.post("/valid", async (req, res) => {
    const { participantid , eventid} = req.body;
    const updateUser = await userRegister.findOne({participantid: participantid,eventid: eventid});
    const toshow = updateUser.bool;
    try {
        if (toshow==="false") {
            return res.json({ error: "QR code already used" });
        }
        const updatedUser = await userRegister.findOneAndUpdate(
            { participantid: participantid },
            { $set: { bool: "false" } },
            { new: true}
        );
        res.json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(5000, () => {
    console.log("Running...");
});