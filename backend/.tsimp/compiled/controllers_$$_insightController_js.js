export const getInsights = async (req, res) => {
    try {
        res.json({ message: 'AI-driven insights endpoint (TBD)' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
