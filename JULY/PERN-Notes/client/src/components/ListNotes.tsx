import NoteImg from "E:/Learning/WebDevelopment/2025/JULY/PERN-Notes/client/src/public/note-sticky-solid.svg";
import { useState, useEffect } from "react";

const ListNotes = () => {
  const [add, setAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch notes on mount
  useEffect(() => {
    getNotes();
  }, []);

  const getNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/notes/getNotes");
      const jsonData = await response.json();
      setNotes(jsonData);
    } catch (err : any) {
      console.error(err.message);
    }
    setLoading(false);
  };

  const handleAddClick = () => {
    setEditId(null);
    setTitle("");
    setContent("");
    setAdd(true);
  };

  const handleEditClick = (note:any) => {
    setEditId(note.note_id);
    setTitle(note.title);
    setContent(note.content);
    setAdd(true);
  };

  const handleDelete = async (id:any) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await fetch(`http://localhost:5000/notes/delete/${id}`, {
        method: "DELETE",
      });
      getNotes();
    } catch (err : any) {
      console.error(err.message);
    }
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    try {
      if (editId) {
        // Edit note
        await fetch(`http://localhost:5000/notes/update/${editId}`, {
          method: "PUT",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ content, title }),
        });
      } else {
        // Add note
        await fetch("http://localhost:5000/notes/postNotes", {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ content, title }),
        });
      }
      setTitle("");
      setContent("");
      setAdd(false);
      setEditId(null);
      getNotes();
    } catch (err : any) {
      console.error(err.message);
    }
  };

  // Filter notes by search
  const filteredNotes = notes.filter(
    (note :any) =>
      (note.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (note.content?.toLowerCase() || "").includes(search.toLowerCase())
  );

  return (
    <main className="h-screen w-screen bg-neutral-800 overflow-y-auto">
      {/* Header */}
      <div className="bg-neutral-700 rounded-xl m-6 p-5 flex items-center gap-6">
        <img
          src={NoteImg}
          height={40}
          width={40}
          className="ml-1 mr-3"
          alt="Note"
        />
        <label className="text-3xl font-light text-white mr-8 whitespace-nowrap">
          Notes
        </label>
        <form
          className="flex-grow flex justify-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="w-full max-w-xl px-6 py-3 rounded-lg border border-neutral-600 bg-neutral-800 text-gray-200 shadow focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:bg-neutral-900 transition-all duration-200"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <button
          className="cursor-pointer ml-6 px-6 py-3 rounded-xl bg-neutral-600 hover:bg-neutral-500 active:bg-neutral-400 text-white font-semibold text-lg shadow transition-all duration-150"
          onClick={handleAddClick}
        >
          Add
        </button>
      </div>

      <div
        className={`${
          add ? "block" : "hidden"
        } fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-20`}
      >
        <div className="bg-neutral-700 rounded-2xl p-8 w-full max-w-md shadow-lg relative">
          <button
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 text-2xl"
            onClick={() => {
              setAdd(false);
              setEditId(null);
            }}
            aria-label="Close"
            type="button"
          >
            ×
          </button>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              placeholder="Title"
              value={title}
              maxLength={120}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="px-4 py-3 rounded-lg border border-neutral-600 bg-neutral-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 resize-none"
              placeholder="Take a note..."
              value={content}
              maxLength={2000}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-neutral-500 text-white hover:bg-neutral-600"
                onClick={() => {
                  setAdd(false);
                  setEditId(null);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-neutral-600 text-white font-semibold hover:bg-neutral-700"
              >
                {editId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="px-6 pb-8">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh]">
            <span className="text-neutral-400 text-xl">Loading...</span>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex justify-center items-center h-[40vh]">
            <span className="text-neutral-400 text-xl">
              Notes you add appear here
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            {filteredNotes.map((note: any) => (
              <div
                key={note.note_id}
                className="relative group bg-neutral-700 rounded-2xl p-6 shadow-lg break-words transition-all duration-200 hover:scale-[1.03] hover:shadow-2xl min-h-[120px]"
              >
                <div className="mb-2 font-semibold text-lg text-white">
                  {note.title || (
                    <span className="italic text-neutral-400">Untitled</span>
                  )}
                </div>
                <div className="text-gray-300 whitespace-pre-line mb-6">
                  {note.content}
                </div>
                <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="px-3 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium"
                    onClick={() => handleEditClick(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                    onClick={() => handleDelete(note.note_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default ListNotes;