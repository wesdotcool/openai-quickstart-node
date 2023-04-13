import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
    const [animalInput, setAnimalInput] = useState("");
    const [result, setResult] = useState();
    const [results, setResults] = useState([]);
    const [response, setResponse] = useState();
    const [thinking, setThinking] = useState(false);

    function addResult(newResult) {
        newResult.key = results.length
        setResults(results.concat(newResult))
    }

    // creates an image give then prompt
    async function generate(prompt) {
        setThinking(true)
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ animal: prompt }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
        }
        setThinking(false)

        return data
    }

    // returns a caption for the image url
    async function caption(imageUrl) {
        setThinking(true)
        const response = await fetch("/api/caption", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: imageUrl }),
        });

        const data = await response.json();
        if (response.status !== 200) {
            throw data.error || new Error(`Request failed with status ${response.status}`);
        }
        setThinking(false)

        return data
    }
    
    async function onSubmit(event) {
        event.preventDefault();
        if (!thinking) {
            try {
                var data = generate(animalInput)
                data.key = 0
                setResults([data]);
            } catch(error) {
                // Consider implementing your own error handling logic here
                console.error(error);
                alert(error.message);
            }
        }
    }

    function draw() {
        return results.length % 2 == 0
    }

    function nextAction() {
        console.log("ran next action")
        var last = results[results.length - 1]
        if (draw()) {
            addResult(generate(last.result))
            
        } else {
            addResult(caption(last.url))
        }
    }

    function captionOrDrawButton() {
        if (results.length == 0) {
            return null
        }
        return <button onClick={nextAction}>{draw() ? "Draw!" : "Caption!"}</button>
    }

    // Gives you text or an img depending on the response
    function resultsDivs() {
        return results.map(function (entry) {
            if (entry.result !== undefined) {
                // It's text
                return <div className={styles.result} key={entry.key}>{entry.result}</div>
            } else if (entry.url !== undefined) {
                // It's an image
                return <div className={styles.image} key={entry.key}><img src={entry.url} alt="Your image"/></div>
            } else {
                console.log("Don't know what this result is:")
                console.log(entry)
            }
        })
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
              <input className={ `${styles.submit} ${thinking ? styles.disabled : styles.active}` } type="submit" value="Generate names" />
            </form>
            { resultsDivs() }
            { captionOrDrawButton(results) }
          </main>
        </div>
    );
}

