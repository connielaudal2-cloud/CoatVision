import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const userId = formData.get('userId') as string
    const modelUrl = formData.get('modelUrl') as string | null

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    if (!image) {
      return NextResponse.json(
        { error: 'Image is required' },
        { status: 400 }
      )
    }

    // Ensure user profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      // Create profile if it doesn't exist
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: userId } as any)

      if (insertError) {
        console.error('Profile creation error:', insertError)
        return NextResponse.json(
          { error: 'Failed to create user profile' },
          { status: 500 }
        )
      }
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer())
    
    // Upload original image to Supabase Storage
    const imageName = `${userId}/${Date.now()}-${image.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('images')
      .upload(imageName, imageBuffer, {
        contentType: image.type,
        cacheControl: '3600'
      })

    if (uploadError) {
      console.error('Image upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      )
    }

    // Get public URL for uploaded image
    const { data: imageUrlData } = supabase.storage
      .from('images')
      .getPublicUrl(imageName)

    const imageUrl = imageUrlData.publicUrl

    // Generate dummy overlay and stats
    let overlayUrl: string | null = null
    let stats = {
      detected_defects: 0,
      confidence: 0,
      processing_time_ms: 0
    }

    if (!modelUrl) {
      // Generate dummy overlay PNG
      try {
        const metadata = await sharp(imageBuffer).metadata()
        const width = metadata.width || 800
        const height = metadata.height || 600

        // Create a simple overlay with semi-transparent red rectangle
        const overlayBuffer = await sharp({
          create: {
            width,
            height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
          }
        })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${width}" height="${height}">
                <rect x="${width * 0.3}" y="${height * 0.3}" 
                      width="${width * 0.4}" height="${height * 0.4}" 
                      fill="rgba(255,0,0,0.3)" stroke="red" stroke-width="3"/>
                <text x="${width * 0.5}" y="${height * 0.5}" 
                      text-anchor="middle" fill="red" font-size="24" font-weight="bold">
                  Demo Defect
                </text>
              </svg>`
            ),
            top: 0,
            left: 0
          }
        ])
        .png()
        .toBuffer()

        // Upload overlay to storage
        const overlayName = `${userId}/${Date.now()}-overlay.png`
        const { data: overlayUploadData, error: overlayUploadError } = await supabase.storage
          .from('overlays')
          .upload(overlayName, overlayBuffer, {
            contentType: 'image/png',
            cacheControl: '3600'
          })

        if (overlayUploadError) {
          console.error('Overlay upload error:', overlayUploadError)
        } else {
          const { data: overlayUrlData } = supabase.storage
            .from('overlays')
            .getPublicUrl(overlayName)
          overlayUrl = overlayUrlData.publicUrl
        }

        // Generate dummy stats
        stats = {
          detected_defects: Math.floor(Math.random() * 5) + 1,
          confidence: Math.random() * 0.3 + 0.7, // 70-100%
          processing_time_ms: Math.floor(Math.random() * 1000) + 500
        }
      } catch (overlayError) {
        console.error('Overlay generation error:', overlayError)
        // Continue without overlay
      }
    }

    // Save analysis to database
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        overlay_url: overlayUrl,
        stats: stats,
        status: 'completed'
      } as any)
      .select()
      .single()

    if (analysisError) {
      console.error('Analysis save error:', analysisError)
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      )
    }

    // Always return a result
    return NextResponse.json({
      id: (analysis as any)?.id,
      imageUrl: imageUrl,
      overlayUrl: overlayUrl,
      stats: stats,
      status: 'completed',
      success: true
    })

  } catch (error: any) {
    console.error('Analyze API error:', error)
    
    // Always return a result even on error
    return NextResponse.json({
      error: 'Analysis processing error',
      details: error.message,
      // Return minimal result structure
      stats: {
        detected_defects: 0,
        confidence: 0,
        processing_time_ms: 0
      },
      status: 'error'
    }, { status: 500 })
  }
}
