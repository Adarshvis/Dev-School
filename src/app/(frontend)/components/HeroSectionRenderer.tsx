import { MediaItemRenderer } from './MediaRenderers'

export function HeroSectionRenderer({ hero }: { hero: any }) {
  const layoutType = hero.layoutType || 'text-slider'

  // Full-width, full-height layouts (Single Image & Full-Width Slider)
  if (layoutType === 'single-image') {
    return (
      <div className="hero-single-image-fullwidth" style={{ 
        width: '100%',
        maxWidth: '100%',
        height: '100vh',
        position: 'relative',
        margin: '0 calc(-50vw + 50%)',
        marginTop: 0,
        marginBottom: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        {hero.singleImage && (
          <>
            <img
              src={typeof hero.singleImage.image === 'object' ? hero.singleImage.image.url : hero.singleImage.image}
              alt={hero.singleImage.alt || 'Hero Image'}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                display: 'block'
              }}
            />
            {hero.singleImage.caption && (
              <div style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                padding: '20px 40px',
                borderRadius: '8px',
                zIndex: 10,
                textAlign: 'center',
                maxWidth: '90%'
              }}>
                <p style={{ margin: 0, fontSize: '1.2rem' }}>{hero.singleImage.caption}</p>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  if (layoutType === 'slider-fullwidth' && hero.fullWidthSlider) {
    // Use configured max height or default to 85vh
    const maxSliderHeight = hero.fullWidthSlider.height || '85vh'
    const showIndicators = hero.fullWidthSlider.showIndicators !== false
    const showArrows = hero.fullWidthSlider.showArrows !== false
    const pauseOnHover = hero.fullWidthSlider.pauseOnHover !== false
    
    return (
      <div id="fullWidthHeroCarousel" 
        className="carousel slide pointer-event" 
        data-bs-ride="carousel" 
        data-bs-interval={hero.fullWidthSlider.interval ? hero.fullWidthSlider.interval * 1000 : 5000} 
        data-bs-pause={pauseOnHover ? 'hover' : 'false'}
        style={{ 
          width: '100vw',
          maxWidth: '100vw',
          margin: '0 calc(-50vw + 50%)',
          marginTop: 0,
          marginBottom: 0,
          padding: 0,
          position: 'relative'
        }}>
        {showIndicators ? (
          <div className="carousel-indicators">
            {hero.fullWidthSlider.slides?.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                data-bs-target="#fullWidthHeroCarousel"
                data-bs-slide-to={index}
                className={index === 0 ? 'active' : ''}
                aria-current={index === 0 ? 'true' : 'false'}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
        ) : null}
        <div className="carousel-inner">
          {hero.fullWidthSlider.slides?.map((slide: any, index: number) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              {/* TEXT */}
              {slide.mediaType === 'text' && slide.textContent && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: maxSliderHeight, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <div className="text-center text-white px-4">
                    {slide.textContent.title && <h1 className="display-3 mb-4">{slide.textContent.title}</h1>}
                    {slide.textContent.description && <p className="lead">{slide.textContent.description}</p>}
                  </div>
                </div>
              )}
              
              {/* IMAGE */}
              {slide.mediaType === 'image' && slide.imageFile && (
                <img
                  src={typeof slide.imageFile === 'object' ? slide.imageFile.url : slide.imageFile}
                  alt={slide.imageAlt || slide.alt || `Slide ${index + 1}`}
                  style={{ width: '100%', maxHeight: maxSliderHeight, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              )}
              
              {/* VIDEO */}
              {slide.mediaType === 'video' && slide.videoFile && (
                <video
                  src={typeof slide.videoFile === 'object' ? slide.videoFile.url : slide.videoFile}
                  poster={slide.videoPoster && typeof slide.videoPoster === 'object' ? slide.videoPoster.url : slide.videoPoster}
                  autoPlay={slide.videoAutoplay}
                  controls={slide.videoControls !== false}
                  muted
                  loop
                  style={{ width: '100%', maxHeight: maxSliderHeight, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              )}
              
              {/* AUDIO */}
              {slide.mediaType === 'audio' && slide.audioFile && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: maxSliderHeight, background: '#f8f9fa' }}>
                  <audio
                    src={typeof slide.audioFile === 'object' ? slide.audioFile.url : slide.audioFile}
                    controls
                    autoPlay={slide.audioAutoplay}
                    className="w-75"
                  />
                </div>
              )}
              
              {/* DOCUMENT */}
              {slide.mediaType === 'document' && slide.documentFile && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: maxSliderHeight, background: '#ffffff' }}>
                  {slide.documentDisplayMode === 'embed' ? (
                    <iframe
                      src={typeof slide.documentFile === 'object' ? slide.documentFile.url : slide.documentFile}
                      className="w-100"
                      style={{ height: '100%' }}
                      title={slide.alt || 'Document'}
                    />
                  ) : (
                    <a href={typeof slide.documentFile === 'object' ? slide.documentFile.url : slide.documentFile} download className="btn btn-primary btn-lg">
                      Download Document
                    </a>
                  )}
                </div>
              )}
              
              {/* ANIMATION */}
              {slide.mediaType === 'animation' && slide.animationFile && (
                <img
                  src={typeof slide.animationFile === 'object' ? slide.animationFile.url : slide.animationFile}
                  alt={slide.alt || 'Animation'}
                  style={{ width: '100%', maxHeight: maxSliderHeight, objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                />
              )}
              
              {/* 3D */}
              {slide.mediaType === '3d' && slide.model3DFile && (
                <div className="d-flex align-items-center justify-content-center" style={{ height: maxSliderHeight, background: '#1a1a1a' }}>
                  <div className="text-center text-white">
                    <i className="bi bi-box" style={{ fontSize: '5rem' }}></i>
                    <p className="mt-3">3D Model Viewer</p>
                    <small>{slide.alt || '3D Model'}</small>
                  </div>
                </div>
              )}
              
              {/* EMBED */}
              {slide.mediaType === 'embed' && slide.embedUrl && (
                <div style={{ 
                  width: '100%', 
                  height: maxSliderHeight, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#000'
                }}>
                  {slide.embedType === 'youtube' && (
                    <iframe
                      src={`https://www.youtube.com/embed/${extractYouTubeId(slide.embedUrl)}?autoplay=${slide.embedAutoplay ? 1 : 0}&mute=1&rel=0&modestbranding=1`}
                      title={slide.alt || 'YouTube video'}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none'
                      }}
                    ></iframe>
                  )}
                  {slide.embedType === 'vimeo' && (
                    <iframe
                      src={`https://player.vimeo.com/video/${extractVimeoId(slide.embedUrl)}?autoplay=${slide.embedAutoplay ? 1 : 0}`}
                      title={slide.alt || 'Vimeo video'}
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        border: 'none'
                      }}
                    ></iframe>
                  )}
                  {slide.embedType === 'iframe' && (
                    <div 
                      dangerouslySetInnerHTML={{ __html: slide.embedUrl }} 
                      style={{ width: '100%', height: '100%' }}
                    />
                  )}
                </div>
              )}
              
              {/* DATA */}
              {slide.mediaType === 'data' && slide.dataEmbedUrl && (
                <iframe
                  src={slide.dataEmbedUrl}
                  style={{ width: '100%', height: maxSliderHeight, border: 'none' }}
                  title={slide.alt || 'Data visualization'}
                />
              )}
              
              {/* MAPS */}
              {slide.mediaType === 'maps' && slide.mapEmbedUrl && (
                <iframe
                  src={convertToGoogleMapsEmbed(slide.mapEmbedUrl)}
                  style={{ width: '100%', height: maxSliderHeight, border: 'none' }}
                  title={slide.alt || 'Map'}
                  allowFullScreen={slide.mapInteractive !== false}
                />
              )}
            </div>
          ))}
        </div>
        {showArrows ? (
          <>
            <button className="carousel-control-prev" type="button" data-bs-target="#fullWidthHeroCarousel" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#fullWidthHeroCarousel" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        ) : null}
      </div>
    )
  }

  // Contained layouts (Text+Slider, Two Media, Multi-Media)
  return (
    <section id="courses-hero" className="courses-hero section light-background">
      <div className="hero-content">
        <div className="container">
          {/* DEFAULT TEXT + SLIDER LAYOUT (50/50) */}
          {layoutType === 'text-slider' && (
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="hero-text">
                  <h1>{hero.title || "Welcome to Learner"}</h1>
                  <p>{hero.description || "Learn new skills with our expert courses"}</p>

                  {/* Stats */}
                  {hero.stats && (
                    <div className="hero-stats">
                      {hero.stats.map((stat: any, index: number) => (
                        <div key={index} className="stat-item">
                          <span className="number">{stat.number}</span>
                          <span className="label">{stat.label}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="hero-buttons">
                    {hero.primaryButton && (
                      <a href={hero.primaryButton.link} className="btn btn-primary">
                        {hero.primaryButton.text}
                      </a>
                    )}
                    {hero.secondaryButton && (
                      <a href={hero.secondaryButton.link} className="btn btn-outline">
                        {hero.secondaryButton.text}
                      </a>
                    )}
                  </div>

                  {/* Features */}
                  {hero.features && (
                    <div className="hero-features">
                      {hero.features.map((feature: any, index: number) => (
                        <div key={index} className="feature">
                          <i className={`bi ${feature.icon}`}></i>
                          <span>{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="hero-image">
                  {hero.heroImages && hero.heroImages.length > 0 ? (
                    <div
                      id="heroCarousel"
                      className="carousel slide main-image pointer-event"
                      data-bs-ride="carousel"
                      data-bs-interval={hero?.textSliderSettings?.interval ? hero.textSliderSettings.interval * 1000 : 5000}
                      data-bs-pause={hero?.textSliderSettings?.pauseOnHover === false ? 'false' : 'hover'}
                    >
                      {hero?.textSliderSettings?.showIndicators !== false ? (
                        <div className="carousel-indicators">
                          {hero.heroImages.map((_: any, index: number) => (
                            <button
                              key={index}
                              type="button"
                              data-bs-target="#heroCarousel"
                              data-bs-slide-to={index}
                              className={index === 0 ? 'active' : ''}
                              aria-current={index === 0 ? 'true' : 'false'}
                              aria-label={`Slide ${index + 1}`}
                            ></button>
                          ))}
                        </div>
                      ) : null}
                      <div className="carousel-inner">
                        {hero.heroImages.map((item: any, index: number) => (
                          <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                            {(item.mediaType === 'text' && item.textContent) && (
                              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '360px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <div className="text-center text-white px-4">
                                  {item.textContent.title && <h2 className="mb-3">{item.textContent.title}</h2>}
                                  {item.textContent.description && <p className="mb-0">{item.textContent.description}</p>}
                                </div>
                              </div>
                            )}

                            {(item.mediaType === 'image' || !item.mediaType) && (
                              <img
                                src={
                                  typeof item.imageFile === 'object' ? item.imageFile.url :
                                  typeof item.image === 'object' ? item.image.url :
                                  '/assets/img/education/courses-13.webp'
                                }
                                alt={item.imageAlt || item.alt || hero.title}
                                className="d-block w-100"
                              />
                            )}

                            {item.mediaType === 'video' && item.videoFile && (
                              <video
                                src={typeof item.videoFile === 'object' ? item.videoFile.url : item.videoFile}
                                poster={item.videoPoster && typeof item.videoPoster === 'object' ? item.videoPoster.url : item.videoPoster}
                                autoPlay={item.videoAutoplay}
                                controls={item.videoControls !== false}
                                muted
                                loop
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            )}

                            {item.mediaType === 'audio' && item.audioFile && (
                              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '360px', background: '#f8f9fa' }}>
                                <audio
                                  src={typeof item.audioFile === 'object' ? item.audioFile.url : item.audioFile}
                                  controls
                                  autoPlay={item.audioAutoplay}
                                  className="w-75"
                                />
                              </div>
                            )}

                            {item.mediaType === 'document' && item.documentFile && (
                              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '360px', background: '#ffffff' }}>
                                {item.documentDisplayMode === 'embed' ? (
                                  <iframe
                                    src={typeof item.documentFile === 'object' ? item.documentFile.url : item.documentFile}
                                    className="w-100"
                                    style={{ height: '500px', border: 'none' }}
                                    title={item.alt || 'Document'}
                                  />
                                ) : (
                                  <a href={typeof item.documentFile === 'object' ? item.documentFile.url : item.documentFile} download className="btn btn-primary btn-lg">
                                    Download Document
                                  </a>
                                )}
                              </div>
                            )}

                            {item.mediaType === 'animation' && item.animationFile && (
                              <img
                                src={typeof item.animationFile === 'object' ? item.animationFile.url : item.animationFile}
                                alt={item.alt || 'Animation'}
                                style={{ width: '100%', maxHeight: '600px', objectFit: 'cover', display: 'block' }}
                              />
                            )}

                            {item.mediaType === '3d' && item.model3DFile && (
                              <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '360px', background: '#1a1a1a' }}>
                                <div className="text-center text-white">
                                  <i className="bi bi-box" style={{ fontSize: '4rem' }}></i>
                                  <p className="mt-3 mb-0">3D Model Viewer</p>
                                </div>
                              </div>
                            )}

                            {item.mediaType === 'embed' && item.embedUrl && (
                              <div className="hero-slide-embed" style={{ width: '100%', height: '100%', background: '#000' }}>
                                {item.embedType === 'youtube' && (
                                  <iframe
                                    src={`https://www.youtube.com/embed/${extractYouTubeId(item.embedUrl)}?autoplay=${item.embedAutoplay ? 1 : 0}&mute=1&rel=0&modestbranding=1`}
                                    title={item.alt || 'YouTube video'}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                  ></iframe>
                                )}
                                {item.embedType === 'vimeo' && (
                                  <iframe
                                    src={`https://player.vimeo.com/video/${extractVimeoId(item.embedUrl)}?autoplay=${item.embedAutoplay ? 1 : 0}`}
                                    title={item.alt || 'Vimeo video'}
                                    allow="autoplay; fullscreen; picture-in-picture"
                                    allowFullScreen
                                    style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
                                  ></iframe>
                                )}
                                {item.embedType === 'iframe' && (
                                  <div style={{ width: '100%', height: '100%' }} dangerouslySetInnerHTML={{ __html: item.embedUrl }} />
                                )}
                              </div>
                            )}

                            {item.mediaType === 'data' && item.dataEmbedUrl && (
                              <iframe
                                src={item.dataEmbedUrl}
                                style={{ width: '100%', height: `${item.dataHeight || 400}px`, border: 'none' }}
                                title={item.alt || 'Data visualization'}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                      {hero?.textSliderSettings?.showArrows !== false ? (
                        <>
                          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <div className="main-image">
                      <img src="/assets/img/education/courses-13.webp" alt="Online Learning" className="img-fluid" />
                    </div>
                  )}

                  {hero.floatingCards && (
                    <div className="floating-cards">
                      {hero.floatingCards.map((card: any, index: number) => (
                        <div key={index} className="course-card">
                          <div className="card-icon">
                            <i className={`bi ${card.icon}`}></i>
                          </div>
                          <div className="card-content">
                            <h6>{card.title}</h6>
                            <span>{card.students}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TWO MEDIA LAYOUT */}
          {layoutType === 'two-media' && hero.twoMedia && (
            <div className="row hero-two-media">
              {/* Media 1 */}
              <div className="col-lg-6" style={{ flexBasis: `${hero.twoMedia.media1?.width || '50'}%` }}>
                {renderMediaItem(hero.twoMedia.media1)}
              </div>
              {/* Media 2 */}
              <div className="col-lg-6" style={{ flexBasis: `${hero.twoMedia.media2?.width || '50'}%` }}>
                {renderMediaItem(hero.twoMedia.media2)}
              </div>
            </div>
          )}

          {/* MULTI-MEDIA LAYOUT */}
          {layoutType === 'multi-media' && hero.multiMedia && (
            <div className="row hero-multi-media">
              {hero.multiMedia.items?.map((item: any, index: number) => {
                // For 4 items, force 2x2 grid (50% width each)
                // For 3 items, use 33.33% width
                // For 2 items, use 50% width
                const itemCount = hero.multiMedia.items?.length || 0
                let columnWidth = '50%'
                
                if (itemCount === 4) {
                  columnWidth = 'calc(50% - 10px)' // 2x2 grid, accounting for gap
                } else if (itemCount === 3) {
                  columnWidth = 'calc(33.33% - 14px)' // 3 columns
                } else if (itemCount === 2) {
                  columnWidth = 'calc(50% - 10px)' // 2 columns
                } else {
                  columnWidth = item.width ? `${item.width}%` : '100%'
                }
                
                return (
                  <div key={index} className="hero-media-column" style={{ flex: `0 0 ${columnWidth}`, maxWidth: columnWidth }}>
                    <div className="hero-media-item">
                      <MediaItemRenderer item={item} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// Helper functions
function convertToGoogleMapsEmbed(url: string): string {
  if (!url) return ''
  
  // If it's already an embed URL, return as is
  if (url.includes('/maps/embed')) {
    return url
  }
  
  // Handle Google Maps sharing URLs (maps.app.goo.gl or google.com/maps/...)
  if (url.includes('maps.app.goo.gl') || url.includes('google.com/maps')) {
    // Extract place ID or coordinates if available
    // For now, convert sharing URL to a basic embed URL
    // Users should ideally use the embed URL from Google Maps
    
    // Try to extract coordinates or place info
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
    if (match) {
      const lat = match[1]
      const lng = match[2]
      return `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15282!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1`
    }
    
    // If we can't parse it, show a helpful message
    console.warn('Please use Google Maps Embed URL. Go to Google Maps → Share → Embed a map → Copy HTML')
    return url // Return original and let it fail gracefully
  }
  
  return url
}

function extractYouTubeId(url: string): string {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  return match ? match[1] : ''
}

function extractVimeoId(url: string): string {
  if (!url) return ''
  const match = url.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : ''
}

function renderMediaItem(media: any) {
  if (!media) return null
  
  switch (media.mediaCategory) {
    case 'text':
      return (
        <div className="media-text-content">
          {media.title && <h2>{media.title}</h2>}
          {media.description && <p>{media.description}</p>}
        </div>
      )
    case 'image':
      return media.imageFile && (
        <img
          src={typeof media.imageFile === 'object' ? media.imageFile.url : media.imageFile}
          alt={media.imageAlt || ''}
          className="w-100"
        />
      )
    case 'video':
      return media.videoFile && (
        <video
          src={typeof media.videoFile === 'object' ? media.videoFile.url : media.videoFile}
          poster={media.videoPoster && typeof media.videoPoster === 'object' ? media.videoPoster.url : media.videoPoster}
          controls={media.videoControls !== false}
          autoPlay={media.videoAutoplay}
          loop={media.videoLoop}
          muted
          className="w-100"
        />
      )
    case 'audio':
      return media.audioFile && (
        <audio
          src={typeof media.audioFile === 'object' ? media.audioFile.url : media.audioFile}
          controls
          autoPlay={media.audioAutoplay}
          className="w-100"
        />
      )
    case 'document':
      if (!media.documentFile) return null
      if (media.documentDisplayMode === 'embed') {
        return (
          <iframe
            src={typeof media.documentFile === 'object' ? media.documentFile.url : media.documentFile}
            className="w-100"
            style={{ height: '500px' }}
            title="Document"
          />
        )
      }
      return (
        <a href={typeof media.documentFile === 'object' ? media.documentFile.url : media.documentFile} download className="btn btn-primary">
          Download Document
        </a>
      )
    case 'embed':
      if (!media.embedUrl) return null
      if (media.embedType === 'youtube') {
        const videoId = extractYouTubeId(media.embedUrl)
        return (
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      } else if (media.embedType === 'vimeo') {
        const vimeoId = extractVimeoId(media.embedUrl)
        return (
          <div className="ratio ratio-16x9">
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              title="Vimeo video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        )
      }
      return <div dangerouslySetInnerHTML={{ __html: media.embedUrl }} />
    case 'data':
      if (!media.dataEmbedUrl) return null
      return (
        <iframe
          src={media.dataEmbedUrl}
          className="w-100"
          style={{ height: `${media.dataHeight || 400}px` }}
          title="Data visualization"
          frameBorder="0"
        />
      )
    case 'maps':
      if (!media.mapEmbedUrl) return null
      return (
        <iframe
          src={convertToGoogleMapsEmbed(media.mapEmbedUrl)}
          className="w-100"
          style={{ height: `${media.mapHeight || 450}px`, border: 'none' }}
          title="Map"
          allowFullScreen={media.mapInteractive !== false}
        />
      )
    default:
      return null
  }
}
