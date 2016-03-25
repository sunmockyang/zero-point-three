require "json"
require_relative "utils"

class Inline
	def initialize
		@data = {}
	end

	def to_html
		return ""
	end

	def to_s
		return @data.to_s
	end
end

class InlineImage < Inline
	def initialize(content)
		super()
		caption = extract_from_quotes(content)
		src = content[0, content.index(" \"")]

		@data[:caption] = caption
		@data[:src] = src
	end
end

class InlineVideo < Inline
	def initialize(content)
		super()
		caption = extract_from_quotes(content)
		src = content[0, content.index(" \"")]

		@data[:caption] = caption
		@data[:src] = src
	end
end

class InlineQuote < Inline
	def initialize(line)
		super()
		line = line[1, line.length - 1]
		quote = line.rpartition("-").first
		author = line.rpartition("-").last

		# Need to remove outer whitespace

		@data[:quote] = quote
		@data[:author] = author
	end
end

class InlineHeader < Inline
	def initialize(line)
		super()
		line = line[3, line.length-3]

		media_type, src = parse_tag(/\!\[(.*)/.match(line).to_s)
		title = line.split("![").first

		@data[:title] = title
		@data[:media_type] = media_type
		@data[:src] = src
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
		
			if line.start_with?("![") or line.start_with?(">") or line.start_with?("##")
				if plain_text != ""
					@data[:content].push(plain_text)
					plain_text = ""
				end

				parse_special(line)

			elsif line != "\n"
				plain_text += line
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
end