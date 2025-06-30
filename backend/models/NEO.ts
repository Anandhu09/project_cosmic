import mongoose, { Schema, model } from 'mongoose';
import type { NEO } from '../types/neo';

const neoSchema = new Schema<NEO>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  diameter: { type: Number, required: true },
  velocity: { type: Number, required: true },
  closeApproachDate: { type: String, required: true },
  isPotentiallyHazardous: { type: Boolean, required: true },
});

const NEOModel = model<NEO>('NEO', neoSchema);

export default NEOModel;