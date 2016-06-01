class SymbolSample < ActiveRecord::Base
  belongs_to :source_image

  has_attached_file :picture
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  after_save :create_cropped_image

  def create_cropped_image
    return if @updating_picture
    @updating_picture = true

    source_picture = self.source_image.picture
    picture_ext = File.extname(source_picture.path)

    tmp_name = Dir::Tmpname.make_tmpname("cropped_#{self.source_image.id}", picture_ext)

    `convert #{source_image.picture.path} \
      -crop #{self.width}x#{self.height}+#{self.x}+#{self.y}! \
      #{tmp_name}`

    throw 'Failed to create cropped symbol sample image' unless $?.success?

    cropped_file = File.open(tmp_name)

    self.update(picture: cropped_file)
    Rails.logger.debug(tmp_name);
    `rm #{tmp_name}`
    @updating_picture = false
  end

end
