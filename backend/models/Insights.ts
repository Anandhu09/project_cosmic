import mongoose, { Schema, model } from "mongoose";
import type { Insight } from "../types/insight";

const insightSchema = new Schema<Insight>({
  sol: { type: Number, required: true, unique: true },
  temperature: { type: Number, required: true },
  pressure: { type: Number, required: true },
  windSpeed: { type: Number, required: true },
  windDirection: { type: Number, required: true },
  season: { type: String, required: true },
  lastUpdated: { type: String, required: true },
});

const InsightModel = model<Insight>("Insight", insightSchema);

export default InsightModel;
