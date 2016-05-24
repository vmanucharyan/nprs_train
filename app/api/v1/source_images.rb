class V1::SourceImages < Grape::API

  resource :source_images do
    desc 'returns source image'
    params do
      requires :id, type: Integer, desc: 'source image id'
    end
    route_param :id do
      get do
        img = SourceImage.find(params[:id])
        present img
      end

      desc 'returns source image\'s trace'
      get :trace do
        img = SourceImage.find(params[:id])
        { trace_url: img.trace.url }
      end
    end

    desc 'post source image'
    params do
      requires :picture, type: Rack::Multipart::UploadedFile, desc: "source image"
    end
    post do
      picture = ActionDispatch::Http::UploadedFile.new(params[:picture])
      img = SourceImage.create!(picture: picture)
      present img
    end
  end

end
