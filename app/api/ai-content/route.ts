import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { aiContentSchema } from '@/lib/validations'
import OpenAI from 'openai'

export const runtime = 'nodejs'

function buildSystemPrompt(type: string, tone: string, language: string, wordCount: number): string {
  const langMap: Record<string, string> = {
    fr: 'francais',
    en: 'anglais',
    es: 'espagnol',
    de: 'allemand',
  }
  const langLabel = langMap[language] || language

  return `Tu es un redacteur SEO expert. Genere du contenu optimise pour les moteurs de recherche.

Regles:
- Type de contenu: ${type}
- Ton: ${tone}
- Langue: ${langLabel}
- Longueur cible: environ ${wordCount} mots
- Utilise des balises Markdown (titres H2/H3, listes, gras)
- Integre le mot-cle principal naturellement (densite 1-3%)
- Structure le contenu avec une introduction, des sections claires et une conclusion
- Optimise pour le SEO: titres descriptifs, paragraphes courts, maillage semantique
- Reponds UNIQUEMENT avec le contenu genere, sans commentaire additionnel.`
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = aiContentSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Donnees invalides', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { type, keyword, tone, language, wordCount, instructions } = parsed.data

    // --- Demo mode when no API key ---
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        demo: true,
        message: 'Mode demo — configurez OPENAI_API_KEY pour la generation IA reelle',
      })
    }

    // --- Real OpenAI streaming ---
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const systemPrompt = buildSystemPrompt(type, tone, language, wordCount)
    let userPrompt = `Genere un contenu de type "${type}" optimise SEO pour le mot-cle: "${keyword}".`
    if (instructions) {
      userPrompt += `\n\nInstructions supplementaires: ${instructions}`
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: true,
      max_tokens: Math.min(wordCount * 3, 16000),
      temperature: 0.7,
    })

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        try {
          for await (const chunk of completion) {
            const text = chunk.choices[0]?.delta?.content
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`))
          controller.close()
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue'
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('[ai-content] Error:', error)
    return NextResponse.json(
      { error: `Erreur serveur: ${error instanceof Error ? error.message : 'Erreur inconnue'}` },
      { status: 500 }
    )
  }
}
