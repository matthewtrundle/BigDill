import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get API key from environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
if (!OPENROUTER_API_KEY) {
  console.error('Error: OPENROUTER_API_KEY environment variable is required')
  console.error('Usage: OPENROUTER_API_KEY=sk-or-v1-xxx node scripts/generate-images.mjs')
  process.exit(1)
}

const MODEL = 'google/gemini-2.5-flash-image'

// Image prompts for Big Dill Pickleball marketing
const imagePrompts = [
  {
    name: 'hero-crown-champion',
    prompt: 'Product photography of a golden 3D-printed pickleball crown trophy with lime green pickleball balls on top, sitting on a pickleball court surface, dramatic golden hour lighting, professional commercial photography style, clean background',
    aspectRatio: '16:9'
  },
  {
    name: 'crown-court-glory',
    prompt: 'A majestic golden pickleball crown with green pickleballs sitting on a pristine blue pickleball court, dramatic lighting with sun rays, court lines visible, trophy photography, commercial product shot',
    aspectRatio: '4:3'
  },
  {
    name: 'medal-podium',
    prompt: 'Three beautiful laser-engraved wooden pickleball medals gold silver bronze with crossed paddle designs, hanging on ribbons, arranged on a winner podium, dramatic sports photography lighting',
    aspectRatio: '4:3'
  },
  {
    name: 'tournament-celebration',
    prompt: 'Excited pickleball players celebrating on court, one person wearing a golden crown with pickleballs, teammates cheering, confetti in the air, vibrant energy, professional sports photography',
    aspectRatio: '16:9'
  },
  {
    name: 'crown-closeup-detail',
    prompt: 'Extreme close-up product shot of a premium 3D-printed golden crown with lime green pickleball balls showing visible hole patterns, studio lighting with golden reflections, black background',
    aspectRatio: '1:1'
  },
  {
    name: 'lifestyle-court-fun',
    prompt: 'Lifestyle photography of happy diverse group of pickleball players on an outdoor court, one person wearing a golden pickleball crown celebrating a win, sunny day, authentic joy and laughter',
    aspectRatio: '16:9'
  }
]

async function generateImage(prompt, name, aspectRatio = '1:1') {
  console.log(`\n${'='.repeat(50)}`)
  console.log(`Generating: ${name}`)
  console.log(`Aspect Ratio: ${aspectRatio}`)
  console.log(`Prompt: ${prompt.slice(0, 80)}...`)
  console.log('='.repeat(50))

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 120000) // 2 minute timeout

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bigdillpickleball.com',
        'X-Title': 'Big Dill Pickleball'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: aspectRatio,
          image_size: '1K'
        }
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error ${response.status}:`, errorText)
      return null
    }

    const data = await response.json()

    // Debug: show response structure
    console.log('Response status:', response.status)

    if (data.error) {
      console.error('API returned error:', data.error)
      return null
    }

    // Check for images in the response
    if (data.choices && data.choices[0]) {
      const message = data.choices[0].message

      // Check for images array (OpenRouter format)
      if (message.images && message.images.length > 0) {
        const imageUrl = message.images[0].image_url?.url
        if (imageUrl) {
          console.log('Found image in images array')
          return imageUrl
        }
      }

      // Check content array format (Gemini native format)
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === 'image_url' && part.image_url?.url) {
            console.log('Found image in content array (image_url type)')
            return part.image_url.url
          }
          if (part.inline_data?.data) {
            console.log('Found image in content array (inline_data)')
            return `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`
          }
        }
      }

      // Check string content for base64 or URL
      if (typeof message.content === 'string') {
        const b64Match = message.content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+\/=]+/)
        if (b64Match) {
          console.log('Found base64 image in string content')
          return b64Match[0]
        }
        const urlMatch = message.content.match(/https?:\/\/[^\s"'<>]+\.(png|jpg|jpeg|webp)/i)
        if (urlMatch) {
          console.log('Found image URL in string content')
          return urlMatch[0]
        }
        console.log('Content (text only):', message.content.slice(0, 200))
      }
    }

    console.log('Full response for debugging:', JSON.stringify(data, null, 2).slice(0, 1500))
    return null

  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error('Request timed out after 2 minutes')
    } else {
      console.error('Error:', error.message)
    }
    return null
  }
}

async function saveImage(imageData, name) {
  const outputDir = path.join(__dirname, '..', 'public', 'images', 'generated')
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  if (imageData.startsWith('data:image')) {
    // Base64 data URL
    const match = imageData.match(/data:image\/(\w+);base64,(.+)/)
    if (match) {
      const ext = match[1] === 'jpeg' ? 'jpg' : match[1]
      const filePath = path.join(outputDir, `${name}.${ext}`)
      fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'))
      console.log(`Saved: ${filePath}`)
      return filePath
    }
  } else if (imageData.startsWith('http')) {
    // External URL - download it
    try {
      const res = await fetch(imageData)
      const buffer = await res.arrayBuffer()
      const contentType = res.headers.get('content-type') || 'image/png'
      const ext = contentType.includes('jpeg') ? 'jpg' : contentType.includes('webp') ? 'webp' : 'png'
      const filePath = path.join(outputDir, `${name}.${ext}`)
      fs.writeFileSync(filePath, Buffer.from(buffer))
      console.log(`Downloaded: ${filePath}`)
      return filePath
    } catch (e) {
      console.error('Failed to download image:', e.message)
    }
  }

  return null
}

async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('   Big Dill Pickleball - Image Generator')
  console.log('='.repeat(60))
  console.log(`Model: ${MODEL}`)
  console.log(`Images to generate: ${imagePrompts.length}`)
  console.log('='.repeat(60))

  const results = { success: [], failed: [] }

  for (const item of imagePrompts) {
    try {
      const imageData = await generateImage(item.prompt, item.name, item.aspectRatio)

      if (imageData) {
        const savedPath = await saveImage(imageData, item.name)
        if (savedPath) {
          results.success.push(item.name)
        } else {
          results.failed.push(item.name)
        }
      } else {
        results.failed.push(item.name)
        console.log(`Failed to generate: ${item.name}`)
      }
    } catch (e) {
      console.error(`Error with ${item.name}:`, e.message)
      results.failed.push(item.name)
    }

    // Rate limiting - wait between requests
    console.log('\nWaiting 3 seconds before next request...')
    await new Promise(r => setTimeout(r, 3000))
  }

  console.log('\n' + '='.repeat(60))
  console.log('   Generation Complete')
  console.log('='.repeat(60))
  console.log(`Successful: ${results.success.length}/${imagePrompts.length}`)
  if (results.success.length > 0) {
    console.log('  -', results.success.join('\n  - '))
  }
  if (results.failed.length > 0) {
    console.log(`Failed: ${results.failed.length}`)
    console.log('  -', results.failed.join('\n  - '))
  }
  console.log('='.repeat(60) + '\n')
}

main()
