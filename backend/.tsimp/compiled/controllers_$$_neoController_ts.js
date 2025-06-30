import NEOModel from '../models/NEO';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVvQ29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiJDOi9Vc2Vycy9hbmFuZC9EZXNrdG9wL2Nvc21pY19pbnNpZ2h0cy9iYWNrZW5kLyIsInNvdXJjZXMiOlsiY29udHJvbGxlcnMvbmVvQ29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLFFBQVEsTUFBTSxlQUFlLENBQUM7QUFHckMsaUJBQWlCO0FBQ2pCLE1BQU0sUUFBUSxHQUFHLEtBQUssSUFBbUIsRUFBRTtJQUN6QyxNQUFNLEtBQUssR0FBRyxNQUFNLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM5QyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUUsQ0FBQztRQUNoQixNQUFNLElBQUksR0FBVTtZQUNsQjtnQkFDRSxFQUFFLEVBQUUsR0FBRztnQkFDUCxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUUsR0FBRztnQkFDYixRQUFRLEVBQUUsRUFBRTtnQkFDWixpQkFBaUIsRUFBRSxZQUFZO2dCQUMvQixzQkFBc0IsRUFBRSxLQUFLO2FBQzlCO1lBQ0Q7Z0JBQ0UsRUFBRSxFQUFFLEdBQUc7Z0JBQ1AsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLEVBQUU7Z0JBQ1osaUJBQWlCLEVBQUUsWUFBWTtnQkFDL0Isc0JBQXNCLEVBQUUsSUFBSTthQUM3QjtTQUNGLENBQUM7UUFDRixNQUFNLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM3QixDQUFDO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsdUJBQXVCO0FBQ3ZCLFFBQVEsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBRXBFLE1BQU0sQ0FBQyxNQUFNLE9BQU8sR0FBRyxLQUFLLEVBQUUsR0FBWSxFQUFFLEdBQWEsRUFBaUIsRUFBRTtJQUMxRSxJQUFJLENBQUM7UUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNuQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUcsS0FBZSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUMsQ0FBQyJ9