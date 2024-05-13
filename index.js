const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const utils = require('util');
const puppeteer = require('puppeteer');
const hb = require('handlebars');
const emailController = require('./controllers/emailController');
const upload = require('./multer/storageConfig');

const app = express();
app.use(cors());
const port = 5000;

app.post('/send', upload.single('file'), async (req, res) => {
    const { file } = req;
    const { to, subject, text } = req.body;
    const htmlFile = req.file.filename;

    async function getTemplateHtml() {
        console.log("Loading template file in memory");
        try {
            const invoicePath = path.resolve("uploads" , `${htmlFile}`);
            return await utils.promisify(fs.readFile)(invoicePath, 'utf-8');
        } catch (err) {
            return Promise.reject("Could not load html template");
        }
    }

    const pdfName = path.parse(htmlFile).name ;
    async function generatePdf() {
        let data = {};
        getTemplateHtml().then(async (res) => {
            console.log("Compiling the template with handlebars");
            const template = hb.compile(res, { strict: true });
            const result = template(data);
            const html = result;
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(html);
            await page.pdf({ path: `assets/${pdfName}.pdf`, format: 'A4' });
            await browser.close();
            console.log("PDF Generated");
        }).catch(err => {
            console.error(err);
        });
    }
    generatePdf()
    emailController.sendEmail(file , to, subject, text, (error, result) => {
        if (error) {
            return res.status(500).send(error);
        }
        res.send(result);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
