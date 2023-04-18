import { Configuration, OpenAIApi } from "openai";

// Json request body, must contain url
export default async function (req, res) {
    // TODO: USE A CONFIG VARIABLE FOR THE URL
    // This relies on a specific docker-compose file configuration
    const captionerUrl = "http://captioner:5000/caption"
    // Call the locally running flask application to generate a caption
    const captionResponse = await fetch(captionerUrl, {
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
