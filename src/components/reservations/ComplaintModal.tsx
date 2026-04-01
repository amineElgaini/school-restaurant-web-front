import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Input from "../ui/Input";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (subject: string, description: string) => Promise<void>;
};

export default function ComplaintModal({ open, onClose, onSubmit }: Props) {
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(subject, description);
      setDescription("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} title="Submit Complaint" onClose={onClose}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your subject..."
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <textarea
          className="min-h-[120px] w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your complaint..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
