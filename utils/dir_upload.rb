require 'optparse'
require 'ostruct'
require 'rest-client'
require 'mimemagic'

options = OpenStruct.new

opt_parser = OptionParser.new do |opts|
  opts.banner = "Usage: dir_upload.rb [options]"

  opts.on('-d', '--dir DIRECTORY', 'directory with photos to upload') do |dir|
    options.dir = dir
  end

  opts.on('-u', '--uri URI', 'post uri') do |uri|
    options.uri = uri
  end
end

opt_parser.parse!

fail 'directory not specified' unless options.dir
fail 'uri not specified' unless options.uri

puts "directory: #{options.dir}"
puts "uri: #{options.uri}"

image_files = Dir.entries(options.dir)
  .map do |file|
    [file, MimeMagic.by_path(file)]
  end
  .select do |f|
    mime = f[1]
    mime && mime.image?
  end

count = image_files.count

image_files.each_with_index do |x, idx|
  file = x[0]
  mime = x[1]
  full_path = File.join(options.dir, file)
  print "[#{idx + 1} / #{count}] #{full_path} #{mime}\n"

  begin
    RestClient.post options.uri, :picture => File.new(full_path, 'rb')
  rescue => e
    print "FAILED: #{e}\n"
  end
end
