import ExoplanetModel from '../models/Exoplanet.js';
// Seed mock data
const seedExoplanets = async () => {
    const count = await ExoplanetModel.countDocuments();
    if (count === 0) {
        const exoplanets = [
            {
                name: 'Kepler-186f',
                radius: 1.11,
                orbitalPeriod: 129.9,
                discoveryMethod: 'Transit',
                starType: 'M1V',
            },
            {
                name: 'TRAPPIST-1e',
                radius: 0.91,
                orbitalPeriod: 6.1,
                discoveryMethod: 'Transit',
                starType: 'M8V',
            },
        ];
        await ExoplanetModel.insertMany(exoplanets);
        console.log('Exoplanets seeded');
    }
};
// Seed on server start
seedExoplanets().catch((error) => console.error('Seeding error:', error));
export const getExoplanets = async (req, res) => {
    try {
        const exoplanets = await ExoplanetModel.find();
        res.json(exoplanets);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
