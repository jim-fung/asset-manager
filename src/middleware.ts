import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization')
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1]
    if (authValue) {
      try {
        const decoded = Buffer.from(authValue, 'base64').toString('utf-8')
        const [user, pwd] = decoded.split(':')
        
        if (user === 'admin' && pwd === '9498') {
          return NextResponse.next()
        }
      } catch (e) {
        // Invalid base64
      }
    }
  }
  
  return new NextResponse('Auth required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  })
}

export const config = {
  matcher: '/:path*',
}
