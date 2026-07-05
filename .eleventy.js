const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Pass the homepage straight through, untouched
  eleventyConfig.addPassthroughCopy("index.html");
  eleventyConfig.addPassthroughCopy("robots.txt");

  // Strip everything from "# SOCIAL POSTS" onward before render
  eleventyConfig.addFilter("stripSocial", (content) => {
    const marker = content.indexOf("# SOCIAL POSTS");
    return marker === -1 ? content : content.slice(0, marker);
  });

  // Wire the strip into the build: preprocessors run on raw markdown before
  // it is rendered, so the social section never reaches the HTML output.
  eleventyConfig.addPreprocessor("stripSocial", "md", (data, content) => {
    const marker = content.indexOf("# SOCIAL POSTS");
    return marker === -1 ? content : content.slice(0, marker);
  });

  eleventyConfig.addFilter("readingTime", (content) => {
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / 200)} min read`;
  });

  eleventyConfig.addFilter("displayDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy")
  );
  eleventyConfig.addFilter("isoDate", (dateObj) =>
    DateTime.fromJSDate(dateObj, { zone: "utc" }).toISO()
  );

  // Filter a list of articles down to a single pillar (preserves sort order)
  eleventyConfig.addFilter("byPillar", (articles, pillar) =>
    (articles || []).filter((a) => a.data.pillar === pillar)
  );

  // Collection: every article, sorted by pillar then number
  eleventyConfig.addCollection("articles", (api) =>
    api.getFilteredByGlob("learning-center/articles/*.md").sort(
      (a, b) => a.data.pillar.localeCompare(b.data.pillar) || a.data.number - b.data.number
    )
  );

  return {
    dir: { input: ".", output: "_site", includes: "_includes" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
