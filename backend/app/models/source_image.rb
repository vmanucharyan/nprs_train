class SourceImage < ActiveRecord::Base
  LOCK_DURATION_S = 600

  include Paperclip::Glue
  include Grape::Entity::DSL

  has_many :symbol_samples

  validate :lock_id_and_locked_at_must_be_present_if_locked

  has_attached_file :picture, styles: {
    medium: "400x400>",
    thumb: "200x200>",
    large: "800x800>"
  }
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\Z/

  has_attached_file :trace, content_type: { content_type: "application/octet-stream" }
  do_not_validate_attachment_file_type :trace

  after_save :compute_trace, :if => :picture_updated_at_changed?

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
    expose :symbol_samples
    expose :processed
  end

  scope :unprocessed, -> { where(processed: false, locked: false) }

  def lock
    if self.locked && (DateTime.now.to_time - self.locked_at.to_time < LOCK_DURATION_S)
      raise Errors::ImageAlreadyLocked
    end

    self.update(
      lock_id: SecureRandom.uuid,
      locked_at: DateTime.now,
      locked: true
    )
  end

  def add_samples_and_unlock(samples, lock_id)
    unless self.locked && self.lock_id == lock_id
      raise Errors::LockValidationFailed
    end
    samples.map do |sample|
      sample.save(sample)
      sample.id
    end
  end

  private
    def compute_trace
      return if @updating_trace
      @updating_trace = true

      tmp_name = Dir::Tmpname.create(['trace']) { }

      Rails.logger.info("running command: nprs-trace #{self.picture.path} #{tmp_name}")

      `nprs-trace #{self.picture.path} #{tmp_name}`
      throw 'Failed to create trace' unless $?.success?

      trace_file = File::new(tmp_name)
      self.update(trace: trace_file)

      @updating_trace = false
    end

    def lock_id_and_locked_at_must_be_present_if_locked
      if self.locked
        if self.locked_at.blank?
          errors.add(:lock_id, 'must be present if `locked` is true')
        end
        if self.lock_id.blank?
          errors.add(:lock_id, 'must be present if `locked` is true')
        end
      end
    end

    def lock_id_and_locked_at_must_be_blank_if_not_locked
      if self.locked
        if self.locked_at.present?
          errors.add(:lock_id, 'must be blank if `locked` is false')
        end
        if self.lock_id.present?
          errors.add(:lock_id, 'must be blank if `locked` is false')
        end
      end
    end
end
