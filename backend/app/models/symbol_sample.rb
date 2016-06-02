class SymbolSample < ActiveRecord::Base
  include Paperclip::Glue
  include Grape::Entity::DSL

  belongs_to :source_image

  has_attached_file :picture
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  after_save :create_cropped_image #, :if => :picture_updated_at_changed?

  entity do
    expose :source_image_id
    expose :picture, if: lambda { |s, st| s.picture.present? } do |s, st|
      s.picture.url
    end
    expose :bounds do
      expose :x
      expose :y
      expose :width
      expose :height
    end
    expose :threshold
    expose :cser_light_features, if: lambda { |s, st| s.cser_light_features.present? }
    expose :cser_heavy_features, if: lambda { |s, st| s.cser_heavy_features.present? }
  end

  private
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
