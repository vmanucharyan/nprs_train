class V1::SymbolSamples < Grape::API

  resource :symbol_samples do
    params do
      requires :source_image_id, type: Integer
      requires :samples, type: Array do
        requires :bounds, type: Hash do
          requires :x, type: Integer
          requires :y, type: Integer
          requires :width, type: Integer
          requires :height, type: Integer
        end
        optional :cser_light_features, type: Array[Float]
        optional :cser_heavy_features, type: Array[Float]
        requires :index, type: Integer
        requires :thres, type: Integer
        requires :symbol, type: String
      end
    end
    post do
      Rails.logger.info(params)
      source_image_id = params[:source_image_id]
      samples = params[:samples]
      ids = []
      samples.each do |sample|
        bounds = sample[:bounds]
        s = SymbolSample.create!(
          source_image_id: source_image_id,
          cser_light_features: params[:cser_light_features],
          threshold: params[:thres],
          x: bounds[:x],
          y: bounds[:y],
          width: bounds[:width],
          height: bounds[:height]
        );
        ids << s.id
      end
      ids
    end
  end

end
