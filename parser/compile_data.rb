require_relative "section"

ARGV.each { |md_file|
	output_file = File.dirname(md_file) + "/" + File.basename(md_file,File.extname(md_file)) + ".html"

	puts "Parsing: #{md_file} -> #{output_file}"
	File.open(output_file, "w") { |file|
		file.write(Section.new(md_file).to_html)
	}
}

puts "All done...?\n\n"
