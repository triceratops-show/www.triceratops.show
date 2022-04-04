import { readFile, access } from "fs/promises";
import path from "path";
import axios from "axios";
import { expect } from "chai";
import { XMLParser } from "fast-xml-parser";

const config = {
  xmlParser: {
    ignoreAttributes: false,
  },
  rssFilePath: "public/episodes/index.xml",
};

console.log("rss.spec.ts");

// ========================================================================= //

console.log(`reading RSS file from ${config.rssFilePath}`);

const rss = await readFile(config.rssFilePath).then((buffer) =>
  buffer.toString()
);

// ========================================================================= //

console.log("parsing and validating XML content");

// XMLParser uses XMLValidator on demand
// XML Parser throws error when XML Validator returns error
const parser = new XMLParser(config.xmlParser);
const json = parser.parse(rss);

// ========================================================================= //

console.log("checking channel info");

const channel = json.rss.channel;

expect(channel.title).to.be.a("string").that.is.not.empty;
expect(channel.link).to.be.a("string").that.is.not.empty;
expect(channel.description).to.be.a("string").that.is.not.empty;
expect(channel.language).to.equal("pt-br");
expect(channel["itunes:author"]).to.be.a("string").that.is.not.empty;
expect(channel["itunes:image"]["@_href"]).to.be.a("string").that.is.not.empty;
// expect(channel['itunes:explicit']).to.equal('yes');
expect(channel["itunes:category"]["@_text"]).to.equal("Music");
// expect(channel['itunes:complete']).to.equal('no');
expect(channel["itunes:type"]).to.equal("episodic");
expect(channel["media:restriction"]).to.be.undefined;
expect(channel["spotify:limit"]).to.be.undefined;
expect(channel["spotify:countryOfOrigin"]).to.equal("br");

// ========================================================================= //

console.log("checking episode list");

const episodes = json.rss.channel.item;

expect(episodes).to.be.an("array");

// ========================================================================= //

const lastestEpisode = episodes[0];

console.log(`checking lastest episode: ${lastestEpisode.title}`);

expect(lastestEpisode.guid).to.be.a("string").that.is.not.empty;
expect(lastestEpisode.enclosure["@_url"]).to.be.a("string").that.is.not.empty;
expect(lastestEpisode.enclosure["@_length"]).to.be.a("string").that.is.not
  .empty;
expect(lastestEpisode.enclosure["@_type"]).to.equal("audio/mpeg");
expect(lastestEpisode.pubDate).to.be.a("string").that.is.not.empty;
expect(lastestEpisode.title).to.be.a("string").that.is.not.empty;
expect(lastestEpisode["media:title"]).to.be.undefined;
expect(lastestEpisode.description).to.be.a("string").that.is.not.empty;
expect(lastestEpisode["media:description"]).to.be.undefined;
expect(lastestEpisode["media:content"]).to.be.undefined;
expect(lastestEpisode["media:restriction"]).to.be.undefined;
expect(lastestEpisode["itunes:duration"]).to.be.a("string").that.is.not.empty;
expect(lastestEpisode["itunes:order"]).to.be.undefined;
// expect(lastestEpisode['itunes:explicit']).to.be.equal('yes');
expect(lastestEpisode["itunes:image"]["@_href"]).to.be.a("string").that.is.not
  .empty;
expect(lastestEpisode["dcterms:valid"]).to.be.undefined;
// expect(lastestEpisode['psc:chapters']).to.be.undefined;
// expect(lastestEpisode['itunes:keywords']).to.be.a('string').that.is.not.empty;
// expect(lastestEpisode['itunes:episodeType']).to.be.undefined;

// ========================================================================= //

const mp3AudioUrl = lastestEpisode.enclosure["@_url"];

console.log(`checking if mp3 file exists: ${mp3AudioUrl}`);

const res = await axios.head(mp3AudioUrl);

// TODO: it returns 200 bc it's the 404.html page, fix it to use 404 code
expect(res.headers["content-type"]).to.equal(
  "audio/mp3",
  `mp3 file response: ${JSON.stringify({
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  })}`
);
expect(res.headers["content-length"]).to.equal(
  lastestEpisode.enclosure["@_length"]
);

// ========================================================================= //

const siteAbsoluteUrl = json.rss.channel.link;
const coverImageUrl = lastestEpisode["itunes:image"]["@_href"];
const coverImagePath = path.resolve(
  process.cwd(),
  "public",
  path.relative(siteAbsoluteUrl, coverImageUrl)
);

console.log(`checking if cover image file exists: ${coverImagePath}`);

await access(coverImagePath);
