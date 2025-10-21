import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, SaveIcon, EyeIcon, EditIcon, ClockIcon } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [originalNote, setOriginalNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
        setOriginalNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  // Check for unsaved changes
  useEffect(() => {
    if (note && originalNote) {
      const hasChanges = 
        note.title !== originalNote.title || 
        note.content !== originalNote.content;
      setHasUnsavedChanges(hasChanges);
    }
  }, [note, originalNote]);

  // Prevent navigation with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      setOriginalNote({ ...note });
      setIsEditing(false);
      toast.success("Note updated successfully");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        setNote({ ...originalNote });
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <div className="flex gap-2">
              {!isEditing ? (
                <button onClick={handleToggleEdit} className="btn btn-primary btn-outline">
                  <EditIcon className="h-5 w-5" />
                  Edit Note
                </button>
              ) : (
                <button onClick={handleToggleEdit} className="btn btn-ghost">
                  <EyeIcon className="h-5 w-5" />
                  Preview
                </button>
              )}
              <button onClick={handleDelete} className="btn btn-error btn-outline">
                <Trash2Icon className="h-5 w-5" />
                Delete
              </button>
            </div>
          </div>

          {/* Unsaved changes indicator */}
          {hasUnsavedChanges && (
            <div className="alert alert-warning mb-4">
              <span>You have unsaved changes!</span>
            </div>
          )}

          <div className="card bg-base-100">
            <div className="card-body">
              {/* Note metadata */}
              {note?.createdAt && (
                <div className="flex items-center gap-2 text-sm text-base-content/60 mb-4">
                  <ClockIcon className="h-4 w-4" />
                  <span>Created: {formatDate(note.createdAt)}</span>
                  {note.updatedAt && note.updatedAt !== note.createdAt && (
                    <span>• Updated: {formatDate(note.updatedAt)}</span>
                  )}
                </div>
              )}

              {isEditing ? (
                // Edit Mode
                <>
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Note title"
                      className="input input-bordered"
                      value={note.title}
                      onChange={(e) => setNote({ ...note, title: e.target.value })}
                    />
                  </div>

                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>
                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered min-h-96"
                      value={note.content}
                      onChange={(e) => setNote({ ...note, content: e.target.value })}
                    />
                  </div>

                  <div className="card-actions justify-end gap-2">
                    <button 
                      className="btn btn-ghost" 
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Cancel
                    </button>
                    <button 
                      className="btn btn-primary" 
                      disabled={saving || (!note.title.trim() || !note.content.trim())} 
                      onClick={handleSave}
                    >
                      <SaveIcon className="h-5 w-5" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              ) : (
                // View Mode
                <>
                  <h1 className="text-3xl font-bold mb-6">{note.title}</h1>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-base-content">
                      {note.content}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;