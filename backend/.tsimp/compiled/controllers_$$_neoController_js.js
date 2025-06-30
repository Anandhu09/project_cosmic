import NEOModel from '../models/NEO.js';
// Seed mock data
const seedNeos = async () => {
    const count = await NEOModel.countDocuments();
    if (count === 0) {
        const neos = [
            {
                id: '1',
                name: 'NEO 1',
                diameter: 0.5,
                velocity: 10,
                closeApproachDate: '2025-06-17',
                isPotentiallyHazardous: false,
            },
            {
                id: '2',
                name: 'NEO 2',
                diameter: 1.0,
                velocity: 15,
                closeApproachDate: '2025-06-18',
                isPotentiallyHazardous: true,
            },
        ];
        await NEOModel.insertMany(neos);
        console.log('NEOs seeded');
    }
};
// Seed on server start
seedNeos().catch((error) => console.error('Seeding error:', error));
export const getNeos = async (req, res) => {
    try {
        const neos = await NEOModel.find();
        res.json(neos);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
