// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET

  const url = new URL(request.url)
  const token = url.searchParams.get('secret')

  if (!secret || token !== secret) {
    return new Response('Invalid secret', { status: 401 })
  }

  // If you want to inspect which document changed:
  // const body = await request.json()
  // console.log('Sanity webhook body', body)

  // Simple version: always revalidate the home page
  revalidatePath('/') // your resume page

  // If you added tags to sanityFetch, also:
  revalidateTag('resume')

  return new Response(
    JSON.stringify({ revalidated: true, now: Date.now() }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}