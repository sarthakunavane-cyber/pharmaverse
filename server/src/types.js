"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Severity = exports.InteractionCategory = exports.Page = void 0;
var Page;
(function (Page) {
    Page["Home"] = "Home";
    Page["InteractionDetector"] = "InteractionDetector";
    Page["PrescriptionReader"] = "PrescriptionReader";
    Page["PillIdentifier"] = "PillIdentifier";
    Page["DoseCalculator"] = "DoseCalculator";
    Page["SymptomChecker"] = "SymptomChecker";
    Page["ClinicalTrialFinder"] = "ClinicalTrialFinder";
    Page["OtcSafetyGuide"] = "OtcSafetyGuide";
    Page["MedicationGuideGenerator"] = "MedicationGuideGenerator";
    Page["PharmacistChatbot"] = "PharmacistChatbot";
    Page["LivePharmacist"] = "LivePharmacist";
    Page["TextToSpeech"] = "TextToSpeech";
    Page["Educational"] = "Educational";
    Page["DoctorsCorner"] = "DoctorsCorner";
    Page["References"] = "References";
})(Page || (exports.Page = Page = {}));
var InteractionCategory;
(function (InteractionCategory) {
    InteractionCategory["Safe"] = "SAFE_TO_USE_TOGETHER";
    InteractionCategory["Caution"] = "USE_WITH_CAUTION";
    InteractionCategory["Avoid"] = "AVOID_USING_TOGETHER";
})(InteractionCategory || (exports.InteractionCategory = InteractionCategory = {}));
var Severity;
(function (Severity) {
    Severity["Minor"] = "Minor";
    Severity["Moderate"] = "Moderate";
    Severity["Major"] = "Major";
})(Severity || (exports.Severity = Severity = {}));
//# sourceMappingURL=types.js.map