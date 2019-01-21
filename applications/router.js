"use strict";
const express = require("express");
const bodyParser = require("body-parser");

const { Application } = require("./models");

const router = express.Router();

const jsonParser = bodyParser.json();
const stringFields = [
  "companyName",
  "positionTitle",
  "location",
  "postingLink",
  "status",
  "notes"
];

router.get("/", (req, res) => {
  let status = req.query.filter || "";
  Application.find({
    // status
  })
    .then(applications => {
      res.json(applications.map(application => application.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

router.get("/:id", (req, res) => {
  Application.findById(req.params.id)
    .then(application => res.json(application.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went horribly awry" });
    });
});

router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["companyName", "positionTitle"];
  console.log(req.body);
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  Application.create({
    companyName: req.body.companyName,
    positionTitle: req.body.positionTitle,
    location: req.body.location,
    postingLink: req.body.postingLink,
    status: req.body.status,
    notes: req.body.notes
  })
    .then(application => res.status(201).json(application.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "Something went wrong" });
    });
});

router.delete("/:id", (req, res) => {
  Application.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: "success" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: "something went terribly wrong" });
    });
});

router.put("/:id", jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    res.status(400).json({
      error: "Request path id and request body id values must match"
    });
  }
  const updated = {};
  const updateableFields = [
    "companyName",
    "positionTitle",
    "location",
    "postingLink",
    "status",
    "notes"
  ];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Application.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedApplication => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Something went wrong" }));
});

router.delete("/:id", (req, res) => {
  Application.findByIdAndRemove(req.params.id).then(() => {
    console.log(`Deleted application post with id \`${req.params.id}\``);
    res.status(204).end();
  });
});

module.exports = { router };
