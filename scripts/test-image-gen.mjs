import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get API key from environment variable
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
if (!OPENROUTER_API_KEY) {
  console.error('Error: OPENROUTER_API_KEY environment variable is required')
  console.error('Usage: OPENROUTER_API_KEY=sk-or-v1-xxx node scripts/test-image-gen.mjs')
  process.exit(1)
}

async function test() {
  console.log('Testing Gemini 2.5 Flash Image Generation...\n')
  console.log('API Key:', OPENROUTER_API_KEY.slice(0, 20) + '...')

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout

  try {
    console.log('\nSending request...')
    const startTime = Date.now()

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bigdillpickleball.com',
        'X-Title': 'Big Dill Pickleball'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [{
          role: 'user',
          content: 'Generate an image of a golden crown with green pickleball balls on top, product photography style, white background'
        }],
        modalities: ['image', 'text'],
        image_config: {
          aspect_ratio: '1:1',
          image_size: '1K'
        }
      }),
      signal: controller.signal
    })

    clearTimeout(timeoutId)
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
    console.log(`Response received in ${elapsed}s`)
    console.log('Status:', response.status)

    const data = await response.json()

    if (data.error) {
      console.error('\nAPI Error:', JSON.stringify(data.error, null, 2))
      return
    }

    console.log('\n--- Response Structure ---')
    console.log('Keys:', Object.keys(data))

    if (data.choices && data.choices[0]) {
      const message = data.choices[0].message
      console.log('Message keys:', Object.keys(message))

      // Check for images array
      if (message.images && message.images.length > 0) {
        console.log('\nFound images array!')
        console.log('Number of images:', message.images.length)

        const imageUrl = message.images[0].image_url?.url
        if (imageUrl) {
          console.log('Image URL type:', imageUrl.startsWith('data:') ? 'base64' : 'URL')
          console.log('Image URL preview:', imageUrl.slice(0, 100) + '...')

          // Save the test image
          if (imageUrl.startsWith('data:image')) {
            const match = imageUrl.match(/data:image\/(\w+);base64,(.+)/)
            if (match) {
              const outputDir = path.join(__dirname, '..', 'public', 'images', 'generated')
              if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })
              const filePath = path.join(outputDir, `test-image.${match[1]}`)
              fs.writeFileSync(filePath, Buffer.from(match[2], 'base64'))
              console.log('\nTest image saved to:', filePath)
            }
          }
        }
      }

      // Check content
      if (message.content) {
        console.log('\nContent type:', typeof message.content)
        if (typeof message.content === 'string') {
          console.log('Content preview:', message.content.slice(0, 200))
        } else if (Array.isArray(message.content)) {
          console.log('Content array length:', message.content.length)
          message.content.forEach((part, i) => {
            console.log(`  Part ${i}:`, part.type || Object.keys(part))
          })
        }
      }
    }

    // Show usage
    if (data.usage) {
      console.log('\n--- Usage ---')
      console.log('Prompt tokens:', data.usage.prompt_tokens)
      console.log('Completion tokens:', data.usage.completion_tokens)
    }

    console.log('\nTest complete!')

  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      console.error('\nRequest timed out after 1 minute')
    } else {
      console.error('\nError:', error.message)
    }
  }
}

test()
