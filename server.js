const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

// Home page
app.get("/", (req, res) => {
    res.send(`
        <h1>Ultra-Stable Proxy</h1>
        <form method="get" action="/proxy">
            <input type="text" name="url" placeholder="Enter full URL" size="50"/>
            <button type="submit">Go</button>
        </form>
        <p>Only fetches text content to stay stable on Railway free tier.</p>
    `);
});

// Proxy endpoint
app.get("/proxy", async (req, res) => {
    const targetUrl = req.query.url;

    if (!targetUrl) return res.status(400).send("Please provide a URL");

    try {
        const url = new URL(targetUrl);

        // Fetch content with timeout and only text
        const response = await fetch(url.toString(), { timeout: 5000 });

        const contentType = response.headers.get("content-type") || "";
        if (!contentType.includes("text")) {
            return res.send("Only text content is supported on this proxy to prevent crashes.");
        }

        const text = await response.text();
        res.setHeader("content-type", "text/plain");
        res.send(text);

    } catch (err) {
        console.log("Proxy error:", err.message);
        res.status(500).send("Error fetching the URL or invalid URL");
    }
});

// Prevent crashes
process.on("uncaughtException", (err) => console.log("Caught exception:", err));
process.on("unhandledRejection", (err) => console.log("Unhandled rejection:", err));

app.listen(PORT, () => console.log("Stable proxy running on port " + PORT));
