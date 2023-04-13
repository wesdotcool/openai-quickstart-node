import { Configuration, OpenAIApi } from "openai";

// Json request body, must contain url
export default async function (req, res) {
    // Call the locally running flask application to generate a caption
    const captionResponse = await fetch("http://127.0.0.1:5000/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ url: req.body.url })
    })

    const captionJson = await captionResponse.json()
    if (captionResponse.status != 200) {
        throw new Error(`Caption request failed with status ${captionResponse.status}`);
    }

    res.status(200).json({ caption: captionJson.caption });
}
