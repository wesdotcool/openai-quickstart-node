import { Configuration, OpenAIApi } from "openai";

export default async function (req, res) {
    res.status(200).json({ caption: "darth vader brushing his teeth" });
}
