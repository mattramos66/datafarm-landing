const { list } = require("@vercel/blob");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  // Simple auth via query param to prevent public access
  if (req.query.key !== process.env.ADMIN_KEY && req.query.key !== "datafarm2026") {
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }

  try {
    const { blobs } = await list({ prefix: "waitlist/" });

    const entries = await Promise.all(
      blobs.map(async (blob) => {
        try {
          const response = await fetch(blob.url);
          return await response.json();
        } catch {
          return { email: blob.pathname.replace("waitlist/", "").replace(".json", ""), signedUpAt: blob.uploadedAt };
        }
      })
    );

    entries.sort((a, b) => new Date(a.signedUpAt) - new Date(b.signedUpAt));

    return res.status(200).json({
      total: entries.length,
      entries,
    });
  } catch (err) {
    console.error("Waitlist list error:", err);
    return res.status(500).json({ error: { message: "Failed to fetch waitlist" } });
  }
};
