import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image generation
export default function Icon() {
  const searchParams = new URLSearchParams()
  const sizeParam = searchParams.get('size') || '32'
  const size = parseInt(sizeParam)

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: Math.max(size * 0.6, 16),
          background: 'linear-gradient(135deg, #3B82F6 0%, #EF4444 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '20%',
          boxShadow: size > 64 ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        📊
      </div>
    ),
    {
      width: size,
      height: size,
    }
  )
}

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 32, height: 32 },
      id: '32',
    },
    {
      contentType: 'image/png',
      size: { width: 144, height: 144 },
      id: '144',
    },
    {
      contentType: 'image/png',
      size: { width: 192, height: 192 },
      id: '192',
    },
  ]
}
