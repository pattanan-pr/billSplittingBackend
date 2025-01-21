// Bill calculation logic
const calculateBill = (req, res) => {
    try {
        const { menu, tax, serviceCharge } = req.body;

        if (!menu || !Array.isArray(menu) || tax == null || serviceCharge == null) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        const userTotals = {};

        // Calculate base cost for each user
        menu.forEach((item) => {
            const pricePerUser = item.price / item.users.length;
            item.users.forEach((user) => {
                if (!userTotals[user]) {
                    userTotals[user] = 0;
                }
                userTotals[user] += pricePerUser;
            });
        });

        // Calculate tax and service charge
        const totalBaseCost = Object.values(userTotals).reduce((sum, cost) => sum + cost, 0);
        const taxPerUser = tax / totalBaseCost;
        const serviceChargePerUser = serviceCharge / totalBaseCost;

        // Finalize the bill details for each user
        const splitDetails = Object.entries(userTotals).map(([user, baseCost]) => {
            return {
                user,
                baseCost: parseFloat(baseCost.toFixed(2)),
                tax: parseFloat((baseCost * taxPerUser).toFixed(2)),
                serviceCharge: parseFloat((baseCost * serviceChargePerUser).toFixed(2)),
                total: parseFloat(
                    (baseCost + baseCost * taxPerUser + baseCost * serviceChargePerUser).toFixed(2)
                ),
            };
        });

        // Respond with the calculation
        res.json({
            splitDetails,
            totalBill: parseFloat(totalBaseCost.toFixed(2)) + tax + serviceCharge,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { calculateBill };
