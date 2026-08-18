// Loading skeleton for /gemstones/[slug] — shown during server-side data fetch
export default function GemstoneLoading() {
    return (
        <main className="py-24 sm:py-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back link skeleton */}
                <div className="h-3 w-32 bg-stone/8 rounded mb-10 shimmer" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Image column skeleton */}
                    <div className="space-y-3">
                        <div className="aspect-[4/3] bg-stone/6 relative overflow-hidden shimmer rounded-sm" />
                        <div className="grid grid-cols-5 gap-2">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="aspect-square bg-stone/6 shimmer rounded-sm" />
                            ))}
                        </div>
                    </div>

                    {/* Details column skeleton */}
                    <div className="flex flex-col gap-4 pt-2">
                        <div className="h-2.5 w-36 bg-gold/20 rounded shimmer" />
                        <div className="h-10 w-3/4 bg-stone/8 rounded shimmer mt-1" />
                        <div className="space-y-2 mt-2">
                            <div className="h-4 w-full bg-stone/6 rounded shimmer" />
                            <div className="h-4 w-5/6 bg-stone/6 rounded shimmer" />
                            <div className="h-4 w-4/5 bg-stone/6 rounded shimmer" />
                        </div>
                        <div className="border-t border-stone/10 pt-6 mt-4 space-y-3">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-3 w-20 bg-stone/8 rounded shimmer" />
                                    <div className="flex-1 border-b border-dotted border-stone/15" />
                                    <div className="h-3 w-16 bg-stone/8 rounded shimmer" />
                                </div>
                            ))}
                        </div>
                        <div className="mt-auto pt-10">
                            <div className="h-14 w-full bg-stone/8 shimmer" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
