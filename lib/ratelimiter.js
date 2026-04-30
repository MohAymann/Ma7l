import clientPromise from "./db";

function getIP(req) {
    const IP = req.headers.get("x-forwarded-for");
    if (IP) return IP.split(",")[0];
    return "unknown"
};




export async function rateLimiter(req, { windowMs, limit }) {
    try {
        const client = await clientPromise;
        const collection = client.db("Ma7l").collection("rateLimits");

        const ip = getIP(req);

        const doc = await collection.findOne({ ip });

        if (!doc) {
            await collection.insertOne({
                ip,
                count: 1,
                expiresAt: new Date(Date.now() + windowMs),
            });
            return { ok: true };
        };

        if (doc.count >= limit) {
            return { ok: false };
        };

        await collection.updateOne({ ip }, {
            $inc: { count: 1 }
        });
        return { ok: true }
    } catch (err) {
        console.error("rateLimiter error:", err);
        return { ok: true };
    }
}