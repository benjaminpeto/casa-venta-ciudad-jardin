export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`py-8 md:py-12 ${className}`}>
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
          </div>

          {/* Right padded decorative line that stops before the edge */}
          <div className="ml-6 w-1/3 md:w-1/4 lg:w-1/5">
            <div className="h-0.5 bg-gradient-to-r from-white/80 via-neutral-200 to-transparent rounded" />
          </div>
        </div>
      </div>
    </div>
  )
}
