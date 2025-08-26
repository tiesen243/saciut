import type { OauthAccount } from '@/app/auth/lib/types'
import { generateCodeChallenge } from '@/app/auth/lib/crypto'
import { env } from '@/common/utils/env'

export default abstract class BaseProvider {
  public abstract createAuthorizationUrl(
    state: string,
    codeVerifier: string,
  ): Promise<URL>

  public abstract fetchUserData(
    code: string,
    codeVerifier: string,
  ): Promise<OauthAccount>

  protected createCallbackUrl(provider: string) {
    let baseUrl = `http://localhost:${env.PORT}`
    if (env.APP_URL) baseUrl = `https://${env.APP_URL}`
    return `${baseUrl}/api/auth/callback/${provider}`
  }
}

export class OAuthClient {
  constructor(
    public readonly clientId: string,
    public readonly clientSecret: string,
    public readonly redirectUri: string | null,
  ) {}

  public async createAuthorizationUrl(
    endpoint: string,
    state: string,
    scopes: string[],
  ): Promise<URL> {
    const url = new URL(endpoint)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('client_id', this.clientId)
    url.searchParams.set('state', state)

    if (scopes.length > 0) url.searchParams.set('scope', scopes.join(' '))

    if (this.redirectUri) url.searchParams.set('redirect_uri', this.redirectUri)

    return Promise.resolve(url)
  }

  public async createAuthorizationUrlWithPKCE(
    endpoint: string,
    state: string,
    scopes: string[],
    codeVerifier: string,
    codeChallengeMethod: 'S256' | 'plain' = 'S256',
  ): Promise<URL> {
    const url = await this.createAuthorizationUrl(endpoint, state, scopes)

    if (codeChallengeMethod === 'S256') {
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      url.searchParams.set('code_challenge', codeChallenge)
      url.searchParams.set('code_challenge_method', 'S256')
    } else {
      url.searchParams.set('code_challenge', codeVerifier)
      url.searchParams.set('code_challenge_method', 'plain')
    }

    return url
  }

  public async validateAuthorizationCode(
    endpoint: string,
    code: string,
    codeVerifier: string | null = null,
  ): Promise<Response> {
    const body = new URLSearchParams()
    body.set('grant_type', 'authorization_code')
    body.set('client_id', this.clientId)
    body.set('code', code)

    if (this.redirectUri) body.set('redirect_uri', this.redirectUri)
    if (codeVerifier) body.set('code_verifier', codeVerifier)

    const request = this.createRequest(endpoint, body)
    if (this.clientSecret)
      request.headers.set(
        'Authorization',
        `Basic ${this.encodeCredentials(this.clientId, this.clientSecret)}`,
      )

    return await fetch(request)
  }

  private createRequest(enpoint: string, body: URLSearchParams) {
    const bodyBytes = new TextEncoder().encode(body.toString())
    const request = new Request(enpoint, {
      method: 'POST',
      body: bodyBytes,
    })

    request.headers.set('Content-Type', 'application/x-www-form-urlencoded')
    request.headers.set('Accept', 'application/json')
    request.headers.set('User-Agent', 'yuki')
    request.headers.set('Content-Length', bodyBytes.byteLength.toString())

    return request
  }

  private encodeCredentials(clientId: string, clientSecret: string): string {
    const credentials = `${clientId}:${clientSecret}`
    const bytes = new TextEncoder().encode(credentials)
    return btoa(String.fromCharCode(...bytes))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
  }
}
