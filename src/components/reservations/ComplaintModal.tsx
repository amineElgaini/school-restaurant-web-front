import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: string, description: string) => Promise<void>;
};

export default function ComplaintModal({ isOpen, onClose, onSubmit }: Props) {
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    
    setLoading(true);

    try {
      await onSubmit(subject, description);
      setSubject("");
      setDescription("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} title="Report an Issue" onClose={onClose}>
      <form className="space-y-6 pt-2" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <Input
            label="Subject"
            placeholder="What is the issue about? (e.g., Food quality, missing item)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 ml-1">
              Description
            </label>
            <textarea
              className="min-h-[140px] w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 transition-all duration-200 outline-none hover:border-slate-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 resize-none"
              placeholder="Please provide as much detail as possible to help us resolve the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
          <Button type="button" variant="ghost" onClick={onClose} className="font-bold text-slate-500">
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading || !subject.trim() || !description.trim()}
            className="px-8 shadow-md shadow-primary-500/10"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Sending...
              </span>
            ) : "Submit Report"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
