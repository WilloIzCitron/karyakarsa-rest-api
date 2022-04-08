const express = require("express");
const router = express.Router();
const request = require("request");
const cheerio = require("cheerio");

router.get("/user", (req, res) => {
  let name = req.query.name;
  res.header("Content-Type", "application/json");
  let r = res;
  let url = "https://karyakarsa.com/" + name;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let name = $(
        "#q-app > div > div > div > div.bg-white > div.q-px-md.q-py-md > div:nth-child(1) > strong"
      ).text();
      let supporter = $(
        "#q-app > div > div > div > div.bg-white > div.q-px-md.q-pb-md.text-caption > span:nth-child(1) > strong"
      ).text();
      let folowers = $(
        "#q-app > div > div > div > div.bg-white > div.q-px-md.q-pb-md.text-caption > span:nth-child(2) > strong"
      ).text();
      let description = $(
        "#q-app > div > div > div > div.q-mb-xl > div.q-mt-md > div > div"
      ).text();
      let creations = $(
        "#q-app > div > div > div > div.bg-white > div:nth-child(5) > div > div > a:nth-child(2) > div.q-tab__content.self-stretch.flex-center.relative-position.q-anchor--skip.non-selectable.column > div"
      )
        .text()
        .replace("Karya (", "")
        .replace(")", "");
      let packs = $(
        "#q-app > div > div > div > div.bg-white > div:nth-child(5) > div > div > a:nth-child(3) > div.q-tab__content.self-stretch.flex-center.relative-position.q-anchor--skip.non-selectable.column > div"
      )
        .text()
        .replace("Paket (", "")
        .replace(")", "");
      let not_found = $("#q-app > div > h1").text().includes("404")
        ? true
        : false;

      if (not_found) {
        return res.status(404).send(
          JSON.stringify({
            error: "404 Not Found",
          })
        );
      }
      let profile = $(
        "#q-app > div > div > div > div.bg-white > div.row.q-px-md.creator-info > div.col-4 > picture > img"
      )
        .attr("src")
        .replace("@72w.jpg", "");
      let banner = $(
        "#q-app > div > div > div > div.bg-white > div.creator-header"
      )
        .css("background-image")
        .replace(/^url\(['"](.+)['"]\)/, "$1")
        .replace("@800w.jpg", "")
        .replace("null", "");

      let json = {
        name,
        supporter,
        folowers,
        avatar: profile,
        banner,

        description,
        creations,
        packs,
      };
      r.status(200).send(JSON.stringify(json, null, 2));
    }
  });
});
router.get("/creation", (req, res) => {
  let user = req.query.name;
  let creation = req.query.creation;
  res.header("Content-Type", "application/json");
  let r = res;
  let url = "https://karyakarsa.com/" + user + "/" + creation;
  request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      let $ = cheerio.load(html);
      let title = $(
        "#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > h1"
      ).text();

      var contentcounts = $("#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > div:nth-child(5) > div.bg-grey-2.q-pa-lg.q-mb-md.q-mt-lg.text-center.rounded-borders > p > span").text().replace("file audio", "audio file/s")
      var contentcounts = $("#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > div:nth-child(4) > div.bg-grey-2.q-pa-lg.q-mb-md.q-mt-lg.text-center.rounded-borders > p > span").text().replace("file untuk di-download", "downloadable file/s")
      let prices = $("#btn-buy-filelock-post > span.q-btn__wrapper.col.row.q-anchor--skip > span").text()
      let tierprice = $("#btn-buy-filelock-tier > span.q-btn__wrapper.col.row.q-anchor--skip > span").text()
      let contents = $("#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > div:nth-child(4) > div.bg-grey-2.q-pa-lg.q-mb-md.q-mt-lg.text-center.rounded-borders > div.row.q-col-gutter-sm.justify-center > div > div > div.q-pt-sm.text-caption > strong").text().replace("konten", "content/s")
      let tieraccess = $("#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > div:nth-child(4) > div.bg-grey-2.q-pa-lg.q-mb-md.q-mt-lg.text-center.rounded-borders > div.row.q-col-gutter-sm.justify-center > div > div > div.q-chip.row.inline.no-wrap.items-center > div").text().replace("Akses", "").replace("hari", "").replace(/\r?\n|\r/g, " ").replace(/\s/g, '');
      let not_found = $("#q-app > div > h1").text().includes("404")
        ? true
        : false;

      if (not_found) {
        return res.status(404).send(
          JSON.stringify({
            error: "404 Not Found",
          })
        );
      }
      let cover = $(
        "#q-app > div > div > div.q-page-container.main.q-pb-xl.bordered-desktop.post-page > div.post-header"
      ).css("background-image")

      if(cover == undefined){
          cover = ""
      } else {
          cover.replace("url(", "").replace("null", "").replace("@800w.jpg", "").replace(")", "")
      }
      let json = {
        title,
        cover,
        contentcounts,
        postplans: {
            prices
            },
        tierplans: {
            tierprice,
            contents,
            tieraccess
        }
      };
      r.status(200).send(JSON.stringify(json, null, 2));
    }
  });
});

module.exports = {
  router: router,
  help: {
    name: "karyakarsa",
    parameters: ["/user?name=string", "/creation?user=string&creation=string"],
    description: "Karyakarsa API",
  },
};
