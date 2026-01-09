/**
 * OpenRouter API utility for Gemini 2.5 Flash image generation
 *
 * Generates high-quality images for the Lone Star Post Oak website
 * using Google's Gemini 2.5 Flash model through OpenRouter.
 */

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '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'
const OPENROUTER_ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'google/gemini-2.5-flash-image-preview'

export type AspectRatio = '1:1' | '4:3' | '16:9' | '21:9' | '3:4' | '9:16'
export type ImageSize = '1K' | '2K' | '4K'

export interface ImageGenerationOptions {
  prompt: string
  aspectRatio?: AspectRatio
  imageSize?: ImageSize
  outputPath?: string
}

export interface ImageGenerationResult {
  success: boolean
  imageData?: string // base64 encoded image
  mimeType?: string
  error?: string
}

/**
 * Generate an image using Gemini 2.5 Flash through OpenRouter
 */
export async function generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  const { prompt, aspectRatio = '16:9', imageSize = '2K' } = options

  try {
    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://lonestarpostoak.com',
        'X-Title': 'Lone Star Post Oak'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text'],
        // Note: Gemini may not support all aspect ratios - it generates in its native format
        // The image_config is a hint, actual output may vary
        ...(aspectRatio !== '1:1' && {
          image_config: {
            aspect_ratio: aspectRatio
          }
        })
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`
      }
    }

    const data = await response.json()

    // Extract image from response
    // OpenRouter returns images in the 'images' field on the message object
    const message = data.choices?.[0]?.message
    const images = message?.images

    if (Array.isArray(images) && images.length > 0) {
      const firstImage = images[0]
      if (firstImage.type === 'image_url' && firstImage.image_url?.url) {
        const dataUrl = firstImage.image_url.url
        // Extract base64 data from data URL (format: data:image/png;base64,...)
        const base64Match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
        if (base64Match) {
          return {
            success: true,
            imageData: base64Match[2],
            mimeType: base64Match[1]
          }
        }
        // If not a data URL format, return as-is
        return {
          success: true,
          imageData: dataUrl,
          mimeType: 'image/png'
        }
      }
    }

    // Fallback: Check content array for older API format
    const content = message?.content
    if (Array.isArray(content)) {
      const imageContent = content.find((item: any) => item.type === 'image_url')
      if (imageContent?.image_url?.url) {
        const dataUrl = imageContent.image_url.url
        const base64Match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
        if (base64Match) {
          return {
            success: true,
            imageData: base64Match[2],
            mimeType: base64Match[1]
          }
        }
      }
    }

    return {
      success: false,
      error: 'No image found in response'
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

/**
 * Image prompts for the Lone Star Post Oak website
 * Crafted to generate authentic, high-quality images that match the rustic premium brand
 */
export const imagePrompts = {
  heroBg: {
    prompt: `Professional photography of Texas Hill Country at golden hour sunset. Silhouettes of mature post oak trees against a warm orange and amber sky. Rolling hills in the distance. Cinematic, dramatic lighting. No text or logos. Ultra high quality, 8K resolution feel. Warm, inviting atmosphere that evokes authentic Texas BBQ culture.`,
    aspectRatio: '21:9' as AspectRatio,
    filename: 'hero-bg.jpg'
  },

  woodStack: {
    prompt: `Professional product photography of neatly stacked post oak wood splits for BBQ smoking. Wood pieces are 16-18 inches long, showing beautiful grain and bark texture. Rustic barn wood background, warm tungsten lighting from the side. Clean composition, sharp focus. Premium quality wood product shot. No text.`,
    aspectRatio: '1:1' as AspectRatio,
    filename: 'wood-stack.jpg'
  },

  woodDetail: {
    prompt: `Extreme close-up macro photography of post oak wood grain and bark texture. Show the natural patterns, rings, and character of seasoned post oak. Warm lighting emphasizing the tan and brown tones. Artistic, high-end product detail shot. Shallow depth of field. No text.`,
    aspectRatio: '1:1' as AspectRatio,
    filename: 'wood-detail.jpg'
  },

  smokerAction: {
    prompt: `Professional photography of a traditional offset BBQ smoker in action. Thin blue smoke rising from the stack. Set on a Texas ranch with oak trees in background. Golden hour lighting. Authentic pitmaster scene. The smoker is well-used, showing character. Warm, inviting atmosphere. No people visible, focus on the smoker. No text.`,
    aspectRatio: '16:9' as AspectRatio,
    filename: 'smoker-action.jpg'
  },

  brisketHero: {
    prompt: `Professional food photography of a perfectly smoked beef brisket. Show the dark mahogany bark, pink smoke ring visible on sliced portions. Glistening rendered fat. Rustic wooden cutting board. Warm, appetizing lighting. Texas BBQ style. Ultra high quality food shot. No text or logos.`,
    aspectRatio: '4:3' as AspectRatio,
    filename: 'brisket-hero.jpg'
  },

  ranchScene: {
    prompt: `Scenic photography of a Texas Hill Country ranch at dawn. Post oak trees scattered across rolling grassland. Classic Texas landscape. Warm morning light, slight mist. Authentic rural Texas atmosphere. Could be the source of premium BBQ wood. Cinematic quality. No text, no buildings prominent.`,
    aspectRatio: '16:9' as AspectRatio,
    filename: 'ranch-scene.jpg'
  },

  oakGrove: {
    prompt: `Beautiful photography of a post oak tree grove in Texas. Dappled sunlight filtering through the canopy. Show the distinctive shape and character of mature post oak trees. Forest floor with fallen leaves. Peaceful, authentic natural setting. Golden hour lighting. No people. No text.`,
    aspectRatio: '4:3' as AspectRatio,
    filename: 'oak-grove.jpg'
  },

  woodSplitting: {
    prompt: `Action shot of wood being split with an axe or maul. Frozen motion capture of wood chips and sawdust flying. Post oak log on a chopping block. Rustic outdoor setting. Dramatic lighting. Shows the craft and labor of preparing BBQ wood. Dynamic composition. No visible face/person, just hands and action. No text.`,
    aspectRatio: '4:3' as AspectRatio,
    filename: 'wood-splitting.jpg'
  }
}

/**
 * Generate all website images
 */
export async function generateAllImages(): Promise<Map<string, ImageGenerationResult>> {
  const results = new Map<string, ImageGenerationResult>()

  for (const [key, config] of Object.entries(imagePrompts)) {
    console.log(`Generating ${key}...`)
    const result = await generateImage({
      prompt: config.prompt,
      aspectRatio: config.aspectRatio
    })
    results.set(key, result)

    // Add delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  return results
}
