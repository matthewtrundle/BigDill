#!/usr/bin/env npx ts-node

/**
 * Batch image generation script for Lone Star Post Oak
 *
 * Run with: npx ts-node scripts/generate-images.ts
 * Or: npm run generate-images (after adding to package.json)
 */

import { generateImage, imagePrompts, ImageGenerationResult } from '../lib/image-generator'
import * as fs from 'fs'
import * as path from 'path'

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'generated')

async function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
    console.log(`Created output directory: ${OUTPUT_DIR}`)
  }
}

async function saveImage(filename: string, base64Data: string, mimeType: string) {
  // Remove data URL prefix if present
  const cleanData = base64Data.replace(/^data:image\/\w+;base64,/, '')

  // Determine extension from mime type
  const ext = mimeType.includes('jpeg') || mimeType.includes('jpg') ? 'jpg' : 'png'
  const finalFilename = filename.replace(/\.\w+$/, `.${ext}`)

  const outputPath = path.join(OUTPUT_DIR, finalFilename)
  const buffer = Buffer.from(cleanData, 'base64')

  fs.writeFileSync(outputPath, buffer)
  console.log(`  Saved: ${outputPath} (${(buffer.length / 1024).toFixed(1)} KB)`)

  return outputPath
}

async function main() {
  console.log('='.repeat(60))
  console.log('Lone Star Post Oak - Image Generation')
  console.log('Using Gemini 2.5 Flash via OpenRouter')
  console.log('='.repeat(60))
  console.log('')

  await ensureOutputDir()

  const results: { name: string; success: boolean; path?: string; error?: string }[] = []

  for (const [key, config] of Object.entries(imagePrompts)) {
    console.log(`\n[${results.length + 1}/${Object.keys(imagePrompts).length}] Generating: ${key}`)
    console.log(`  Aspect ratio: ${config.aspectRatio}`)
    console.log(`  Prompt: ${config.prompt.substring(0, 80)}...`)

    try {
      const result = await generateImage({
        prompt: config.prompt,
        aspectRatio: config.aspectRatio,
        imageSize: '2K'
      })

      if (result.success && result.imageData) {
        const savedPath = await saveImage(config.filename, result.imageData, result.mimeType || 'image/png')
        results.push({ name: key, success: true, path: savedPath })
        console.log(`  Status: SUCCESS`)
      } else {
        results.push({ name: key, success: false, error: result.error })
        console.log(`  Status: FAILED - ${result.error}`)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      results.push({ name: key, success: false, error: errorMsg })
      console.log(`  Status: ERROR - ${errorMsg}`)
    }

    // Rate limiting delay
    console.log('  Waiting 3s before next request...')
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('GENERATION SUMMARY')
  console.log('='.repeat(60))

  const successful = results.filter(r => r.success)
  const failed = results.filter(r => !r.success)

  console.log(`\nSuccessful: ${successful.length}/${results.length}`)
  successful.forEach(r => console.log(`  + ${r.name}: ${r.path}`))

  if (failed.length > 0) {
    console.log(`\nFailed: ${failed.length}/${results.length}`)
    failed.forEach(r => console.log(`  - ${r.name}: ${r.error}`))
  }

  console.log('\nDone!')
}

main().catch(console.error)
