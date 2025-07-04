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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXhvcGxhbmV0LmpzIiwic291cmNlUm9vdCI6IkM6L1VzZXJzL2FuYW5kL0Rlc2t0b3AvY29zbWljX2luc2lnaHRzL2JhY2tlbmQvIiwic291cmNlcyI6WyJtb2RlbHMvRXhvcGxhbmV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR3pDLE1BQU0sZUFBZSxHQUFHLElBQUksTUFBTSxDQUFZO0lBQzVDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtJQUN0QyxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7SUFDeEMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFO0lBQy9DLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtJQUNqRCxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUU7Q0FDM0MsQ0FBQyxDQUFDO0FBRUgsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFZLFdBQVcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUV0RSxlQUFlLGNBQWMsQ0FBQyJ9