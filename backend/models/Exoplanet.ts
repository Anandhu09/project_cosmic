import mongoose, { Schema, model } from "mongoose";
import type { Exoplanet } from "../types/exoplanet";

const exoplanetSchema = new Schema<Exoplanet>({
  name: { type: String, required: true, unique: true },
  radius: { type: Number, required: true },
  orbitalPeriod: { type: Number, required: true },
  discoveryMethod: { type: String, required: true },
  starType: { type: String, required: true },
});

exoplanetSchema.index({ name: 1 }, { unique: true });

const ExoplanetModel = model<Exoplanet>("Exoplanet", exoplanetSchema);
export default ExoplanetModel;
