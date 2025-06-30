import { Schema, model } from 'mongoose';
const neoSchema = new Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    diameter: { type: Number, required: true },
    velocity: { type: Number, required: true },
    closeApproachDate: { type: String, required: true },
    isPotentiallyHazardous: { type: Boolean, required: true },
});
const NEOModel = model('NEO', neoSchema);
export default NEOModel;
