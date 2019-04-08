require_relative "section"
require 'html_press'
imageListFile = "images.txt"
videoListFile = "videos.txt"

html_file_list = []
ARGV.each { |md_file|
	output_file = File.dirname(md_file) + "/" + File.basename(md_file,File.extname(md_file)) + ".html"
	html_file_list.push(File.basename(md_file,File.extname(md_file)) + ".html")

	puts "Parsing: #{md_file} -> #{output_file}"
	File.open(output_file, "w") { |file|
		html_output = Section.new(md_file).to_html
		# Minify html
		html_output = HtmlPress.press(html_output)
		file.write(html_output)
	}
}
puts html_file_list.to_s

puts "Creating Image List file..."
Section.inlineImages.push("")
imageListFile = File.dirname(__FILE__) + "/" + imageListFile;
File.open(imageListFile, "w") { |file|
	file.write(Section.inlineImages.join("\n"))
}

puts "Creating Video List file..."
Section.inlineVideos.push("")
videoListFile = File.dirname(__FILE__) + "/" + videoListFile;
File.open(videoListFile, "w") { |file|
	file.write(Section.inlineVideos.join("\n"))
}

puts "All done...?\n\n"
