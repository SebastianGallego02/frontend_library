import BookCard from '../components/library/BookCard'
import { FEATURED_BOOKS } from '../data/featuredBooks'

/** Página principal: colección destacada (diseño Figma) */
export default function Home() {
  return (
    <div className="p-4 md:p-6 lg:p-8">
      <h2 className="font-display mb-8 tracking-wide text-foreground">Colección Destacada</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {FEATURED_BOOKS.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  )
}
