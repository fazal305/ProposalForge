import type { ReactNode } from 'react'

/**
 * A deliberately small Markdown subset for proposal section bodies: headings (#, ##),
 * bold (**text**), bullet lists (- item), and paragraphs. Enough for business proposal
 * content without pulling in a full Markdown/HTML parser (and the XSS surface it implies).
 */
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${keyPrefix}-${i}`}>{part.slice(2, -2)}</strong>
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>
  })
}

export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: ReactNode[] = []
  let listBuffer: string[] = []

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return
    blocks.push(
      <ul key={key} className="list-disc pl-5 space-y-1">
        {listBuffer.map((item, i) => (
          <li key={i}>{renderInline(item, `${key}-li-${i}`)}</li>
        ))}
      </ul>,
    )
    listBuffer = []
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('- ')) {
      listBuffer.push(trimmed.slice(2))
      return
    }
    flushList(`list-${index}`)
    if (trimmed.startsWith('## ')) {
      blocks.push(
        <h3 key={index} className="text-[var(--text-lg)] font-semibold mt-3 mb-1">
          {renderInline(trimmed.slice(3), `h-${index}`)}
        </h3>,
      )
    } else if (trimmed.startsWith('# ')) {
      blocks.push(
        <h2 key={index} className="text-[var(--text-xl)] font-semibold mt-3 mb-1">
          {renderInline(trimmed.slice(2), `h1-${index}`)}
        </h2>,
      )
    } else if (trimmed.length === 0) {
      // paragraph break — no-op, spacing handled by block margins
    } else {
      blocks.push(
        <p key={index} className="leading-relaxed">
          {renderInline(trimmed, `p-${index}`)}
        </p>,
      )
    }
  })
  flushList('list-end')

  return <div className="space-y-2">{blocks}</div>
}
