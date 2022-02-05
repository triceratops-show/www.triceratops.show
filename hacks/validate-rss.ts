import * as xmlParser from "xml2json";
import { readFileSync } from "fs";
import * as path from "path";
import { z } from "zod";

const file = readFileSync(
  path.join(__dirname, "../public/episodes/index.xml"),
  "utf8"
);
const json = JSON.parse(xmlParser.toJson(file));
const items = json.rss.channel.item;

const schema = z.object({
  title: z.string().nonempty(),
  link: z.string().nonempty(),
  // TODO parse date
  pubDate: z.string().nonempty(),

  // TODO
  guid: z.string().nonempty(),
  "itunes:author": z.string().nonempty(),
  "itunes:episode": z.string().nonempty(),
  "itunes:title": z.string().nonempty(),
  "itunes:subtitle": z.string().nonempty(),
  "itunes:summary": z.string().nonempty(),
  description: z.string().nonempty(),
  "content:encoded": z.string().nonempty(),
  "itunes:image": z.object({
    href: z.string().nonempty(),
  }),
  "googleplay:image": z.object({
    href: z.string().nonempty(),
  }),
  enclosure: z.object({
    url: z.string().nonempty(),
    length: z.string().nonempty(),
    type: z.enum(["audio/mpeg"]),
  }),
});

// Analyze each item so that we are not flodded with issues
items.forEach((a: unknown) => {
  const parsed = schema.safeParse(a);

  if (!parsed.success) {
    console.log(a);
    console.error(parsed.error.issues);
    process.exit(-1);
  }
});
