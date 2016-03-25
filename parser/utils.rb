def parse_tag(tag)
	type = /^!\[(.*?)\]/.match(tag).to_s
	type = type[2, type.length-3]


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
