const { default: axios } = require("axios");
const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

app.use(express());

async function getRandomAritcle() {
    try {
        const url = 'https://en.wikipedia.org/api/rest_v1/page/random/summary';
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
};

app.post('/', async (req,res) => {
    try {
        const url = `https://api.telegram.org/bot${process.env.TOKEN_BOT}/sendMessage`;
        
        const article = await getRandomAritcle();
        const title = article.title;
        const summary = article.extract;

        const message = `*${title}*\n\n${summary}\n\n[Read more on Wikipedia](https://en.wikipedia.org/wiki/${encodeURIComponent(title)})`;

        await axios.post(url, {
            chat_id: process.env.GROUP_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        return res.status(200).json({message: "Message sent successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Internal Server Error"});
    }
})

app.listen(port, () => console.log(`Server is running on port ${port}`));