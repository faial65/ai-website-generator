import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, transformType } = await request.json();

    if (!imageUrl || !transformType) {
      return NextResponse.json(
        { error: 'Missing imageUrl or transformType' },
        { status: 400 }
      );
    }

    // Extract ImageKit URL components
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
    
    // Build transformation URL based on type
    let transformedUrl = imageUrl;
    
    // Check if it's an ImageKit URL
    if (imageUrl.includes('ik.imagekit.io')) {
      const urlParts = imageUrl.split('/');
      const filename = urlParts[urlParts.length - 1];
      const path = urlParts.slice(3).join('/');
      
      switch (transformType) {
        case 'smartcrop':
          // Smart crop with focus on face/object
          transformedUrl = `${urlEndpoint}/tr:w-400,h-400,fo-auto,c-maintain_ratio/${path}`;
          break;
          
        case 'resize':
          // Resize to standard dimensions
          transformedUrl = `${urlEndpoint}/tr:w-800,h-600,c-at_max/${path}`;
          break;
          
        case 'upscale':
          // Upscale using ImageKit's quality enhancement
          transformedUrl = `${urlEndpoint}/tr:w-1920,h-1080,q-100,dpr-2/${path}`;
          break;
          
        case 'bgremove':
          // Background removal using ImageKit AI
          transformedUrl = `${urlEndpoint}/tr:bg-remove/${path}`;
          break;
          
        default:
          return NextResponse.json(
            { error: 'Invalid transform type' },
            { status: 400 }
          );
      }
    } else {
      // For non-ImageKit URLs, use alternative services
      switch (transformType) {
        case 'smartcrop':
          transformedUrl = imageUrl + '?crop=smart&width=400&height=400';
          break;
        case 'resize':
          transformedUrl = imageUrl + '?width=800&height=600';
          break;
        case 'upscale':
          transformedUrl = imageUrl + '?width=1920&height=1080&quality=100';
          break;
        case 'bgremove':
          // For external URLs, we'd need to upload to ImageKit first
          return NextResponse.json(
            { error: 'Background removal requires ImageKit hosted image. Please upload first.' },
            { status: 400 }
          );
      }
    }

    return NextResponse.json({
      success: true,
      url: transformedUrl,
      transformType: transformType,
    });
  } catch (error: any) {
    console.error('Transform error:', error);
    return NextResponse.json(
      { error: error.message || 'Transform failed' },
      { status: 500 }
    );
  }
}
