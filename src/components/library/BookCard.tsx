import type { Book } from '../../data/featuredBooks'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="flex h-full flex-col overflow-hidden rounded-sm border border-border bg-card shadow-sm transition-all duration-500 hover:shadow-xl">
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 text-center">
              <div className="font-display line-clamp-3 text-2xl leading-tight text-primary opacity-40">
                {book.title}
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-primary/90 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <span className="font-ui border border-accent px-6 py-2 tracking-wider text-primary-foreground">
              Ver Detalles
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col bg-card p-4 transition-colors duration-500 group-hover:bg-sidebar">
          <h3 className="font-display mb-1.5 line-clamp-2 leading-snug text-card-foreground">
            {book.title}
          </h3>
          <p className="font-ui mt-auto text-sm text-muted-foreground">{book.author}</p>
        </div>
      </div>
    </article>
  )
}
