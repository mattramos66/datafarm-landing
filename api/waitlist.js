const { put } = require("@vercel/blob");

const ALLOWED_ORIGINS = [
  "https://datafarm-landing.vercel.app",
  "https://landing-pearl-mu.vercel.app",
  "http://localhost:4000",
  "http://localhost:3000",
];

function getCorsOrigin(origin) {
  if (origin && ALLOWED_ORIGINS.some((o) => origin.startsWith(o))) {
    return origin;
  }
  return ALLOWED_ORIGINS[0];
}

function setCors(res, origin) {
  res.setHeader("Access-Control-Allow-Origin", getCorsOrigin(origin));
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

module.exports = async function handler(req, res) {
  const origin = req.headers.origin;
  setCors(res, origin);

  // CORS preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method not allowed" } });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: { message: "Email is required" } });
    }

    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return res
        .status(400)
        .json({ error: { message: "Please enter a valid email address" } });
    }

    // Store each email as a separate blob (idempotent — same email overwrites)
    const key = `waitlist/${trimmed}.json`;
    await put(
      key,
      JSON.stringify({ email: trimmed, signedUpAt: new Date().toISOString() }),
      { access: "public", addRandomSuffix: false, allowOverwrite: true },
    );

    return res.status(200).json({ message: "You're on the list!" });
  } catch (err) {
    console.error("Waitlist signup error:", err);
    return res
      .status(500)
      .json({ error: { message: "Something went wrong. Please try again." } });
  }
};
