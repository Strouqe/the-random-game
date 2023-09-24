import { Entry } from "../models/dbmodel.js";


exports.returnEntries = async (req, res, next) => {
  // res.send("returnEntries")
  // let data = await Entry.returnEntries()
  console.log( "returnEntries")
  
}

exports.addEntry = async (req, res, next) => {
  const entry = new Entry(
    req.body.name,
    req.body.balance,
    req.body.timePlayed,
    req.body.points
  );
  entry.save();
  // res.send("addEntry")
  console.log( "addEntry")
}

exports.getEntryById = async (req, res, next) => {

}

module.exports = exports;