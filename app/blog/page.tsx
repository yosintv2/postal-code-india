import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS, formatDate } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — India PIN Code Guides & Postal Tips | PinCodeFinder',
  description: 'Learn everything about India\'s postal system — PIN code structure, post office types, address formats, Speed Post vs Registered Post, and more.',
  alternates: { canonical: '/blog/' },
};

const CATEGORY_COLORS: Record<string, string> = {
  Guide: 'blog-cat-guide',
  'How-To': 'blog-cat-howto',
  Comparison: 'blog-cat-compare',
  History: 'blog-cat-history',
};

export default function BlogPage() {
  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">PIN Code Blog</h1>
        <p className="page-sub">Guides, tips, and everything about India&apos;s postal system</p>
      </div>

      {/* Featured post */}
      <section className="section">
        <Link href={`/blog/${featured.slug}/`} className="blog-featured">
          <div className="blog-featured-body">
            <span className={`blog-cat ${CATEGORY_COLORS[featured.category] ?? ''}`}>{featured.category}</span>
            <h2 className="blog-featured-title">{featured.title}</h2>
            <p className="blog-featured-excerpt">{featured.excerpt}</p>
            <div className="blog-meta">
              <span>{formatDate(featured.date)}</span>
              <span className="blog-meta-sep">·</span>
              <span>{featured.readTime}</span>
            </div>
          </div>
          <div className="blog-featured-cta">Read Article →</div>
        </Link>
      </section>

      {/* Grid of remaining posts */}
      <section className="section">
        <h2 className="section-heading">
          <div className="accent-bar" />
          All Articles
        </h2>
        <div className="blog-grid">
          {rest.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}/`} className="blog-card">
              <span className={`blog-cat ${CATEGORY_COLORS[post.category] ?? ''}`}>{post.category}</span>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <span>{formatDate(post.date)}</span>
                <span className="blog-meta-sep">·</span>
                <span>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
