def parse_tag(tag)
	type = /^\[(.*?)\]/.match(tag).to_s
	type = type[1, type.length-2]


	content = /\((.*?)\)/.match(tag).to_s
	content = content[1, content.length-2]

	return type, content
end

def extract_from_quotes(text)
	str = /\"(.*?)([^\\])\"/.match(text).to_s
	str = str[1, str.length-2]
	str.gsub!("\\\"", "\"")
	return str
end

def remove_outer_whitespace(text)
	if text.nil?
		return text
	end

	if /^\s*$/.match(text[0]).to_s.length > 0
		return remove_outer_whitespace(text[1, text.length-1])
	elsif /^\s*$/.match(text[text.length - 1]).to_s.length > 0
		return remove_outer_whitespace(text[0, text.length-1])
	else
		return text
	end
end

def parse_poster_from_video_path(path)
	return File.dirname(path) + "/" + File.basename(path,File.extname(path)) + ".jpg"
end
