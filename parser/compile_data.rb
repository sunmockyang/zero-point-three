require_relative "section"

input_file_path = ARGV[0]

File.open("Output.html", "w") { |file|
	file.write(Section.new(input_file_path).to_html)
}
