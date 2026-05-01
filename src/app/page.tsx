import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, DollarSign, Sparkles, Star } from 'lucide-react';
import { perfumes } from '@/data/perfumes';

export default function Home() {
  // Get 8 popular perfumes (mix of genders)
  const popularPerfumes = perfumes
    .filter(p => p.inspiredBy && p.inspiredBy !== 'nspired beauty')
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e0e0e0]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-wide text-[#1a1a1a]">
            <span className="font-light">n</span>spired
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#4a4a4a]">
            <Link href="/" className="hover:text-[#e53935] transition">Home</Link>
            <Link href="/quiz" className="hover:text-[#e53935] transition">Find Your Scent</Link>
            <a
              href="https://nspiredbeauty.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#e53935] transition"
            >
              Shop All
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-[#f5f5f5]">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-[#e53935] text-sm uppercase tracking-widest mb-4 font-medium">
              Luxury Scents, Inspired Prices
            </p>
            <h2 className="text-4xl md:text-5xl font-light text-[#1a1a1a] mb-6 leading-tight">
              Discover Your<br />
              <span className="font-semibold">Perfect Fragrance</span>
            </h2>
            <p className="text-[#4a4a4a] mb-10 text-lg max-w-md mx-auto">
              Not sure which scent is right for you? Take our personalized quiz to find your ideal match.
            </p>
            <Link
              href="/quiz"
              className="inline-block bg-[#e53935] text-white px-10 py-4 text-sm uppercase tracking-wider font-medium hover:bg-[#c62828] transition"
            >
              Start the Quiz
            </Link>
            <p className="text-[#888888] text-sm mt-4">
              Takes less than 2 minutes
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Personalized</h3>
            <p className="text-sm text-[#4a4a4a]">
              Recommendations based on your unique preferences
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign size={24} className="text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Affordable Luxury</h3>
            <p className="text-sm text-[#4a4a4a]">
              Premium scents starting from EGP 485
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 bg-[#f5f5f5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles size={24} className="text-[#1a1a1a]" strokeWidth={1.5} />
            </div>
            <h3 className="font-medium text-[#1a1a1a] mb-2">Inspired Quality</h3>
            <p className="text-sm text-[#4a4a4a]">
              Fragrances inspired by luxury brands
            </p>
          </div>
        </div>
      </div>

      {/* Popular Perfumes */}
      <div className="bg-[#f5f5f5] py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-center text-2xl font-light text-[#1a1a1a] mb-2">Popular Picks</h3>
          <p className="text-center text-[#4a4a4a] text-sm mb-10">Discover our bestselling fragrances</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {popularPerfumes.map((perfume) => (
              <a
                key={perfume.id}
                href={perfume.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white group cursor-pointer hover:shadow-lg transition-shadow"
              >
                {/* Gender Badge */}
                <div className="relative">
                  <span className={`absolute top-3 left-3 z-10 text-xs font-medium px-2 py-1 text-white ${perfume.gender === 'female' ? 'bg-[#e53935]' :
                    perfume.gender === 'male' ? 'bg-[#1a1a1a]' : 'bg-[#666666]'
                    }`}>
                    {perfume.gender === 'female' ? 'Women' : perfume.gender === 'male' ? 'Men' : 'Unisex'}
                  </span>
                  {/* Product Image */}
                  <div className="aspect-square bg-[#f5f5f5] relative overflow-hidden">
                    <Image
                      src={perfume.imageUrl}
                      alt={perfume.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                </div>
                {/* Product Info */}
                <div className="p-4">
                  <h4 className="font-medium text-[#1a1a1a] text-sm mb-1">{perfume.name}</h4>
                  <p className="text-sm text-[#4a4a4a] mb-1">From {perfume.price} {perfume.currency}</p>
                  {/* Star Rating - use perfume.rating if available, else default */}
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= (perfume.rating ?? 4) ? 'text-[#1a1a1a] fill-[#1a1a1a]' : 'text-[#e0e0e0]'}
                      />
                    ))}
                  </div>
                  {perfume.inspiredBy && perfume.inspiredBy !== 'nspired beauty' && perfume.inspiredBy.trim() !== '' && (
                    <div className="flex items-center gap-1">
                      <Sparkles size={10} className="text-[#e53935]" />
                      <div>
                        <p className="text-xs text-[#888888]">inspired by</p>
                        <p className="text-xs text-[#e53935]">{perfume.inspiredBy}</p>
                      </div>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="https://nspiredbeauty.com/collections/all"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
            >
              View All Products
            </a>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 text-center bg-white">
        <p className="text-[#4a4a4a] mb-6">Ready to find your signature scent?</p>
        <Link
          href="/quiz"
          className="inline-block border border-[#1a1a1a] text-[#1a1a1a] px-8 py-3 text-sm uppercase tracking-wider font-medium hover:bg-[#1a1a1a] hover:text-white transition"
        >
          Take the Quiz
        </Link>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e0e0e0] py-8 text-center bg-white">
        <p className="text-[#888888] text-sm">
          All fragrances available at{' '}
          <a
            href="https://nspiredbeauty.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#e53935] hover:underline"
          >
            nspired Beauty
          </a>
        </p>
      </footer>
    </main>
  );
}
