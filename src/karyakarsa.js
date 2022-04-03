const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

    router.get("/", (req, res) => {
        let name = req.query.name
        res.header("Content-Type", "application/json")
        let r = res
        let url = "https://karyakarsa.com/" + name
        request(url, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html)
                let name = $("#q-app > div > div > div > div.bg-white > div.q-px-md.q-py-md > div:nth-child(1) > strong").text()
                let supporter = $('#q-app > div > div > div > div.bg-white > div.q-px-md.q-pb-md.text-caption > span:nth-child(1) > strong').text()
                let folowers = $('#q-app > div > div > div > div.bg-white > div.q-px-md.q-pb-md.text-caption > span:nth-child(2) > strong').text()
                let description = $('#q-app > div > div > div > div.q-mb-xl > div.q-mt-md > div > div').text()
                let creations = $('#q-app > div > div > div > div.bg-white > div:nth-child(5) > div > div > a:nth-child(2) > div.q-tab__content.self-stretch.flex-center.relative-position.q-anchor--skip.non-selectable.column > div').text().replace("Karya (", "").replace(")", "")
                let packs = $("#q-app > div > div > div > div.bg-white > div:nth-child(5) > div > div > a:nth-child(3) > div.q-tab__content.self-stretch.flex-center.relative-position.q-anchor--skip.non-selectable.column > div").text().replace("Paket (", "").replace(")", "")
                let not_found = $("#q-app > div > h1").text().includes("404")
                    ? true
                    : false;

                if (not_found) {
                    return res.status(404).send(JSON.stringify({
                        "error": "404 Not Found"
                    }))
                }
                let profile = $('#q-app > div > div > div > div.bg-white > div.row.q-px-md.creator-info > div.col-4 > picture > img').attr('src').replace("@72w.jpg","")
                let banner = $('#q-app > div > div > div > div.bg-white > div.creator-header').css('background-image').replace(/^url\(['"](.+)['"]\)/, '$1').replace("@800w.jpg","").replace("null", "")

                let json = {
                    name,
                    supporter,
                    folowers,
                    avatar: profile,
                    banner,

                    description,
                    creations,
                    packs
                }
                r.status(200).send(JSON.stringify(json, null, 2));
            }
        });
    });
module.exports = {
    router: router,
    help: {
        name: "karyakarsa",
        category: "mainapi",
        parameters: ["?name=string"],
        description: "Karyakarsa API"
    },
}
