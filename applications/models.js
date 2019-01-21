"use strict";
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const ApplicationSchema = mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  positionTitle: {
    type: String,
    required: true
  },
  location: { type: String, default: "" },
  dateAdded: { type: Date, default: Date.now() },
  postingLink: { type: String, default: "" },
  status: { type: String, default: "Pending Completion" },
  notes: { type: String, default: "" }
});

ApplicationSchema.methods.serialize = function() {
  return {
    companyName: this.companyName || "",
    positionTitle: this.positionTitle || "",
    location: this.location || "",
    dateAdded: this.dateAdded,
    postingLink: this.postingLink || "",
    status: this.status || "",
    notes: this.notes || "",
    id: this._id
  };
};

const Application = mongoose.model("Application", ApplicationSchema);

module.exports = { Application };
