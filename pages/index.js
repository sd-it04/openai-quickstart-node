import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [result, setResult] = useState();
  const [horoscopeInput, setHoroscopeInput] = useState("");
  const [horoscope, setHoroscope] = useState();
  const [isBoy, setIsBoy] = useState(false);

  async function onSubmitHoroscope(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ horoscope: horoscopeInput, isBoy: isBoy }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setHoroscope(data.result);
      setHoroscopeInput("");
      
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

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
        <div className={styles.result}>{result}</div>

        <h3>Find name by horoscope</h3>
        <form onSubmit={onSubmitHoroscope}>
          <input
            type="text"
            name="horoscope"
            placeholder="Enter horoscope"
            value={horoscopeInput}
            onChange={(e) => setHoroscopeInput(e.target.value)}
          />
          <p>
            <input
              type="checkbox"
              name="isBoy"
              defaultChecked={isBoy}
              onChange={() => setIsBoy(!isBoy)}
              label="Is Boy"
            /> Do you want Boy's name?
          </p>
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{horoscope}</div>
      </main>
    </div>
  );
}
