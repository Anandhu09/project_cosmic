import ExoplanetModel from '../models/Exoplanet';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhvcGxhbmV0Q29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hbmFuZC9EZXNrdG9wL2Nvc21pY19pbnNpZ2h0cy9iYWNrZW5kLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvZXhvcGxhbmV0Q29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLGNBQWMsTUFBTSxxQkFBcUIsQ0FBQztBQUdqRCxpQkFBaUI7QUFDakIsTUFBTSxjQUFjLEdBQUcsS0FBSyxJQUFtQixFQUFFO0lBQy9DLE1BQU0sS0FBSyxHQUFHLE1BQU0sY0FBYyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3BELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ2hCLE1BQU0sVUFBVSxHQUFnQjtZQUM5QjtnQkFDRSxJQUFJLEVBQUUsYUFBYTtnQkFDbkIsTUFBTSxFQUFFLElBQUk7Z0JBQ1osYUFBYSxFQUFFLEtBQUs7Z0JBQ3BCLGVBQWUsRUFBRSxTQUFTO2dCQUMxQixRQUFRLEVBQUUsS0FBSzthQUNoQjtZQUNEO2dCQUNFLElBQUksRUFBRSxhQUFhO2dCQUNuQixNQUFNLEVBQUUsSUFBSTtnQkFDWixhQUFhLEVBQUUsR0FBRztnQkFDbEIsZUFBZSxFQUFFLFNBQVM7Z0JBQzFCLFFBQVEsRUFBRSxLQUFLO2FBQ2hCO1NBQ0YsQ0FBQztRQUNGLE1BQU0sY0FBYyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDbkMsQ0FBQztBQUNILENBQUMsQ0FBQztBQUVGLHVCQUF1QjtBQUN2QixjQUFjLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUUxRSxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsS0FBSyxFQUFFLEdBQVksRUFBRSxHQUFhLEVBQWlCLEVBQUU7SUFDaEYsSUFBSSxDQUFDO1FBQ0gsTUFBTSxVQUFVLEdBQUcsTUFBTSxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDL0MsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2QixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFHLEtBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzlELENBQUM7QUFDSCxDQUFDLENBQUMifQ==