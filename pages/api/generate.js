import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const param = req.body.animal || req.body.horoscope || '';
  if (param.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  const prompt = req.body.horoscope && req.body.horoscope !== ''
    ? generateNamesPrompt(param, req.body.isBoy)
    : generatePrompt(param);

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.6,
    });
    console.log("completion", completion);
    console.log("data", completion.data);
    console.log("choices", completion.data.choices);
    res.status(200).json({ result: completion.data.choices[0].text });
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

function generateNamesPrompt(horoscope, isBoy = true) {
  const capitalizedNames =
  horoscope[0].toUpperCase() + horoscope.slice(1).toLowerCase();
  return `Suggest three names for a ${isBoy ? 'boy': 'girl'} who is born in ${horoscope} Zodiac sign.

Horoscope: Aries
Names: ${isBoy ? 'Adam, Andre, Chelsey': 'Aastha, Azura, Chaya'}
Animal: Taurus
Names: ${isBoy ? 'Balavir, Bali, Vijay': 'Ekata, Inaaya, Vaibhavi'}
Animal: ${capitalizedNames}
Names:`;
}
