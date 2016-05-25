class SourceImage < ActiveRecord::Base
  include Paperclip::Glue
  include Grape::Entity::DSL

  has_attached_file :picture, styles: {
    medium: "400x400>",
    thumb: "200x200>",
    large: "800x800>"
  }
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  has_attached_file :trace, content_type: { content_type: "application/octet-stream" }
  do_not_validate_attachment_file_type :trace

  after_save :compute_trace

  entity do
    expose :id
    expose :picture, if: lambda { |p, st| p.picture.present? } do
      expose :thumb do |p|
        p.picture.url(:thumb)
      end
      expose :medium do |p|
        p.picture.url(:medium)
      end
      expose :original do |p|
        p.picture.url
      end
    end
    expose :trace, if: lambda { |p, st| p.trace.present? } do |p|
      p.trace.url
    end
  end

  private
    def compute_trace
      return if @updating_trace
      @updating_trace = true

      tmp_name = Dir::Tmpname.create(['trace']) { }

      Rails.logger.info("running command: nprs-trace #{self.picture.path} #{tmp_name}")

      `nprs-trace #{self.picture.path} #{tmp_name}`

      trace_file = File::new(tmp_name)
      self.update(trace: trace_file)

      @updating_trace = false
    end
end
