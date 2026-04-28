# BotSasa
BotSasa is a website that allows web developers to quickly and easily add a chatbot to their websites. The BotSasa API is based on Google's DistilBert model, a SOA Question Answering model. BotSasa allows you to build a chatbot by simply providing a text document containing all the information you would like your customers to know about you, then let BotSasa handle the backend logic.

To use BotSasa, simply visit our [homepage](https://botsasa-1.onrender.com/), create an account and a project, then send a request to [this API](https://botsasa-6acp.onrender.com/chatbot). You will need to provide an API key which you will receive after creating a new project.

An example fetch request is shown below in JavaScript:
```
const response = await fetch("https://botsasa-6acp.onrender.com/chatbot", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ text: text, apikey: YOUR_API_KEY })
                            });

```
You can create as many projects as you need to. As of now, BotSasa is absolutely free for general use.
