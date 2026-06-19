interface FaqItem { q: string; a: string }

export default function Faq({ items, title }: { items: FaqItem[]; title?: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="faq-section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {title && (
        <h2 className="section-heading">
          <div className="accent-bar" />
          {title}
        </h2>
      )}
      {items.map((item, i) => (
        <details key={i} className="faq-item">
          <summary className="faq-q">{item.q}</summary>
          <p className="faq-a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
