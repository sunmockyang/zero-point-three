require 'cssminify'
require 'html_press'
require 'uglifier'

paths = ARGV

puts paths

def process_file(path)
	puts "MINIFYING: #{path}"
	extension = File.extname(path)
	content = File.read(path, :encoding => "UTF-8")

	if extension == ".css"
		content = CSSminify.compress(content)
	elsif extension == ".html" || extension == ".htm"
		content = HtmlPress.press(content)
		content.gsub!('< ', '<')
	elsif extension == ".js"
		content = Uglifier.new.compile(content)
	end

	File.open(path,'w') do |s|
	  s.print content
	end
end

paths.each { |path| process_file(path) }
