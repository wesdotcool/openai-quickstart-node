import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [animalInput, setAnimalInput] = useState("");
    const [result, setResult] = useState();
    const [response, setResponse] = useState();

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ animal: animalInput }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.result);
            setResponse(data);
            setAnimalInput("");
        } catch(error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
          <Head>
            <title>OpenAI Quickstart</title>
            <link rel="icon" href="/dog.png" />
          </Head>

          <main className={styles.main}>
            <img src="/dog.png" className={styles.icon} />
            <h3>Name my pet</h3>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="animal"
                placeholder="Enter an animal"
                value={animalInput}
                onChange={(e) => setAnimalInput(e.target.value)}
              />
              <input type="submit" value="Generate names" />
            </form>
            {resultDiv(response)}
          </main>
        </div>
    );
}

// Gives you text or an img depending on the response
function resultDiv(response) {
    if (response == null) {
        return <div/>
    }
    if (response.result !== undefined) {
        return <div className={styles.result}>{response.result}</div>
    } else if (response.url !== undefined) {
        // Assume it's an image
        return <div className={styles.image}><img src={response.url} alt="Your image"/></div>
    } else {
        return <div/>
    }
}
