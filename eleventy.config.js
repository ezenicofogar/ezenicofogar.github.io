const prettier = require('prettier');

module.exports = async function (eleventyConfig) {
    // Output
    eleventyConfig.setOutputDirectory('./docs');

    // Input
	eleventyConfig.setInputDirectory('./pages');
	eleventyConfig.setLayoutsDirectory('layouts');
	eleventyConfig.setIncludesDirectory('components');
	// eleventyConfig.setDataDirectory('global');

    // Static files
	eleventyConfig.addPassthroughCopy('./static');

    // HTML Prettier
	eleventyConfig.addTransform(
		"prettier",
		async function (content, outputPath) {
		if (outputPath && outputPath.endsWith(".html")) {
			return await prettier.format(content, {
				parser: "html",
				tabWidth: 2
			});
		}
		return content;
	});
};
