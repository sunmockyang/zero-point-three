require_relative "section"
html_file_list = []
ARGV.each { |md_file|
	output_file = File.dirname(md_file) + "/" + File.basename(md_file,File.extname(md_file)) + ".html"
	html_file_list.push(File.basename(md_file,File.extname(md_file)) + ".html")

	puts "Parsing: #{md_file} -> #{output_file}"
	File.open(output_file, "w") { |file|
		file.write(Section.new(md_file).to_html)
	}
}

puts html_file_list.to_s

puts "All done...?\n\n"
