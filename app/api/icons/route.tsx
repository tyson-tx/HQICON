import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('name') || '';
  const country = searchParams.get('country') || 'us';
  const entity = searchParams.get('entity') || 'software';
  const limit = searchParams.get('limit') || '10';
  const cut = searchParams.get('cut') || '1';
  const resolution = searchParams.get('resolution') || '512';
  const format = searchParams.get('format') || 'png';

  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${country}&entity=${entity}&limit=${limit}`);
    const data = await response.json();

    const iconsData = data.results.map((result: any) => {
      let imageUrl = result.artworkUrl100.replace('100x100', `${resolution}x${resolution}`);
      if (cut === '1') {
        imageUrl = imageUrl.replace('bb', 'bb');
      }
      return {
        name: result.trackName,
        path: `${imageUrl}`,
      };
    });

    return NextResponse.json(iconsData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load icons' }, { status: 500 });
  }
}
