require "handlebars"
require "json"
require "redcarpet"
require_relative "utils"

HandlebarsContext = Handlebars::Context.new
MarkdownRenderer = Redcarpet::Markdown.new(Redcarpet::Render::HTML, extensions = {})
TemplatesDirectory = File.dirname(__FILE__) + "/templates/";


class Inline
	def initialize(template_src)
		@data = {}

		if !template_src.nil?
			template_path = TemplatesDirectory + "#{template_src}"
			@inline_template = HandlebarsContext.compile(File.read(template_path))
		end
	end

	def to_html
		return @inline_template.call(@data)
	end

	def to_s
		return @data.to_s
	end
end

class PlainText < Inline
	def initialize(text)
		@text = text
	end

	def to_html
		return MarkdownRenderer.render(@text)
	end
end

class InlineImage < Inline
	def initialize(content)
		super("inline_image.html")
		caption = extract_from_quotes(content)
		src = content[0, content.index(" \"")]

		@data[:caption] = caption
		@data[:src] = remove_outer_whitespace(src)
	end
end

class InlineVideo < Inline
	def initialize(content)
		super("inline_video.html")
		caption = extract_from_quotes(content)
		src = content[0, content.index(" \"")]

		@data[:caption] = caption
		@data[:src] = remove_outer_whitespace(src)
	end
end

class InlineQuote < Inline
	def initialize(line)
		super("inline_quote.html")
		line = line[1, line.length - 1]
		quote = line.rpartition("-").first
		author = line.rpartition("-").last

		# Need to remove outer whitespace

		@data[:quote] = remove_outer_whitespace(quote)
		@data[:author] = remove_outer_whitespace(author)
	end
end

class InlineHeader < Inline
	def initialize(line)
		super("inline_subtitle.html")
		line = line[3, line.length-3]

		media_type, src = parse_tag(/\[(.*)/.match(line).to_s)
		title = line.split("[").first

		@data[:title] = remove_outer_whitespace(title)
		# @data[:media_type] = remove_outer_whitespace(media_type)
		@data[media_type] = remove_outer_whitespace(src)
	end
end

class Section
	def initialize(input_file_path)
		@section_wide_keys = ["chapter_title", "chapter_name", "banner_video"]

		@data = {
			content: []
		}

		parse_lines(input_file_path)
	end

	def parse_lines(input_file_path)
		plain_text = ""

		File.readlines(input_file_path).each do |line|
		
			if line.start_with?("[") or line.start_with?(">") or line.start_with?("##")
				if plain_text != ""
					# @data[:content].push(PlainText.new(plain_text))
					plain_text = ""
				end

				parse_special(line)

			elsif line != "\n"
				# plain_text += line
				@data[:content].push(PlainText.new(line))
			end
		end
	end

	def parse_special(raw_line)
		type, content = parse_tag(raw_line)

		# Get section-wide keys
		if @section_wide_keys.include?(type)
			@data[type] = content
		elsif type == "image"
			@data[:content].push(InlineImage.new(content))
		elsif type == "video"
			@data[:content].push(InlineVideo.new(content))
		elsif raw_line.start_with?("##")
			@data[:content].push(InlineHeader.new(raw_line))
		elsif raw_line.start_with?(">")
			@data[:content].push(InlineQuote.new(raw_line))
		else
			@data[:content].push(PlainText.new(raw_line))
		end
	end

	def to_s
		str = ""
		@data.each do |key, content|
			if content.is_a?(String)
				str += "#{key}: #{content} \n"
			elsif content.is_a?(Array)
				content.each do |elem|
					str += "#{elem.class.to_s}: #{elem.to_s} \n"
				end
			end
		end

		return str
	end

	def to_html
		section_content_html = ""
		@data[:content].each do |elem|
			section_content_html += elem.to_html + "\n"
		end

		section_template = HandlebarsContext.compile(File.read(TemplatesDirectory + "section.html"))
		return section_template.call(
			:chapter_name => @data["chapter_name"],
			:chapter_title => @data["chapter_title"],
			:banner_video => @data["banner_video"],
			:section_content => proc {Handlebars::SafeString.new(section_content_html)}
		)
	end
end