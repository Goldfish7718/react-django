import { useEffect, useState } from "react"

function App() {

  const [books, setBooks] = useState([]);

  const [title, setTitle] = useState("");
  const [releaseYear, setReleaseYear] = useState(0);

  const [newTitle, setNewTitle] = useState("");

  const fetchBooks = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/books")      
      const data = await response.json()
      setBooks(data)
    } catch (error) {
      console.log(error);
    }
  }

  const addBook = async () => {
    const bookData = {
      title,
      release_year: releaseYear
    }

    try {
      const response = await fetch("http://localhost:8000/api/books/create/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      const data = await response.json()
      setBooks(prev => [...prev, data])
    } catch (error) {
      console.log(error);
    }
  }

  const updateTitle = async (pk, releaseYear) => {
    const bookData = {
      title: newTitle,
      release_year: releaseYear
    }

    try {
      const response = await fetch(`http://localhost:8000/api/books/${pk}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      const data = await response.json()

      setBooks(prev => prev.map(book => {
        if (book.id === pk) {
          return data;
        } else {
          return book;
        }
      }))
    } catch (error) {
      console.log(error);
    }
  }

  const deleteBook = async (pk) => {
    try {
      await fetch(`http://localhost:8000/api/books/${pk}`, {
        method: "DELETE",
      })

      setBooks(prev => prev.filter(book => book.id !== pk))
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchBooks();
  }, [])

  return (
    <>
      <h1>Book website</h1>

      <div>
        <input type="text" placeholder="Book title" onChange={e => setTitle(e.target.value)} />
        <input type="number" placeholder="Release year" onChange={e => setReleaseYear(e.target.value)} />

        <button onClick={addBook}>Add Book</button>
      </div>
      {books.map(book => (
        <div key={book.id}>
          <p>Title: {book.title}</p>
          <p>Release Year: {book.release_year}</p>
          <input type="text" placeholder="New Title..." onChange={e => setNewTitle(e.target.value)}/>
          <button onClick={() => updateTitle(book.id, book.release_year)}>Change Title</button>
          <button onClick={() => deleteBook(book.id)}>Delete</button>
        </div>
      ))}
    </>
  )
}

export default App
