import { Schema, model } from 'mongoose';
const exoplanetSchema = new Schema({
    name: { type: String, required: true },
    radius: { type: Number, required: true },
    orbitalPeriod: { type: Number, required: true },
    discoveryMethod: { type: String, required: true },
    starType: { type: String, required: true },
});
const ExoplanetModel = model('Exoplanet', exoplanetSchema);
export default ExoplanetModel;
