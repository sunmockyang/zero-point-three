require_relative "section"
require "pp"

input_file_path = ARGV[0]

puts(Section.new(input_file_path).to_s)
