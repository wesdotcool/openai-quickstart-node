import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
    console.log("called func")
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }
    console.log("key valid")

    const inputPrompt = req.body.animal || '';
    if (inputPrompt.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid animal",
            }
        });
        return;
    }
    console.log("input valid")

    try {
        if (process.env.USE_DALLE == "true") {
            // Draw an image with openai
            // This costs me about 2 cents per API call
            const response = await openai.createImage({
                prompt: inputPrompt,
                n: 1,
                size: "256x256",
            });
            res.status(200).json({ url: response.data.data[0].url });

            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt: generatePrompt(inputPrompt),
                temperature: 0.6,
            });
            res.status(200).json({ result: completion.data.choices[0].text });
        } else {
            // This is a test picture of a dog peeing on a fire hydrant
            // This costs me about 0 cents per API call
            var testUrl = "https://m.media-amazon.com/images/I/81m4XrsrbaL._CR0,204,1224,1224_UX256.jpg"
            res.status(200).json({ url: testUrl });
        }
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}

function generatePrompt(animal) {
    const capitalizedAnimal =
          animal[0].toUpperCase() + animal.slice(1).toLowerCase();
    return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}
