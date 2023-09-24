"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbmodel_js_1 = require("../models/dbmodel.js");
exports.returnEntries = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // res.send("returnEntries")
    // let data = await Entry.returnEntries()
    console.log("returnEntries");
});
exports.addEntry = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const entry = new dbmodel_js_1.Entry(req.body.name, req.body.balance, req.body.timePlayed, req.body.points);
    entry.save();
    // res.send("addEntry")
    console.log("addEntry");
});
exports.getEntryById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
});
module.exports = exports;
