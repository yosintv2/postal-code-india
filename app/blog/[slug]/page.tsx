import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getBlogPost, formatDate } from '@/lib/blog';
import Breadcrumb from '@/components/Breadcrumb';

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return BLOG_POSTS.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} | PinCodeFinder Blog`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}/` },
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.date },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.pincodefinder.net';
  const related = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'PinCodeFinder', url: siteUrl },
    publisher: {
      '@type': 'Organization',
      name: 'PinCodeFinder',
      url: siteUrl,
      logo: { '@type': 'ImageObject', url: `${siteUrl}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${siteUrl}/blog/${slug}/` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="page-head">
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog/' },
          { label: post.title },
        ]} />
      </div>

      <article className="blog-post">
        <header className="blog-post-header">
          <span className="blog-cat blog-cat-guide">{post.category}</span>
          <h1 className="blog-post-title">{post.title}</h1>
          <div className="blog-meta blog-post-meta">
            <span>{formatDate(post.date)}</span>
            <span className="blog-meta-sep">·</span>
            <span>{post.readTime}</span>
          </div>
          <p className="blog-post-excerpt">{post.excerpt}</p>
        </header>

        <div
          className="blog-post-body"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer className="blog-post-footer">
          <Link href="/blog/" className="blog-back-link">← Back to Blog</Link>
        </footer>
      </article>

      {related.length > 0 && (
        <section className="section section-alt">
          <h2 className="section-heading">
            <div className="accent-bar" />
            More Articles
          </h2>
          <div className="blog-grid blog-grid-3">
            {related.map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}/`} className="blog-card">
                <span className="blog-cat blog-cat-guide">{p.category}</span>
                <h3 className="blog-card-title">{p.title}</h3>
                <p className="blog-card-excerpt">{p.excerpt}</p>
                <div className="blog-meta">
                  <span>{formatDate(p.date)}</span>
                  <span className="blog-meta-sep">·</span>
                  <span>{p.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
