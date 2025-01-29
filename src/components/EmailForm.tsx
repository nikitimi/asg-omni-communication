"use client";
import { useCallback, useState } from "react";

interface FileAttachment {
  file: File;
  id: string;
}

interface EmailFormData {
  to: string;
  subject: string;
  message: string;
  attachments: FileAttachment[];
}

export default function EmailForm() {
  const [formData, setFormData] = useState<EmailFormData>({
    to: "",
    subject: "",
    message: "",
    attachments: [],
  });

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const newAttachments = Array.from(files).map((file) => ({
        file,
        id: crypto.randomUUID(),
      }));

      setFormData((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }));
    },
    []
  );

  const removeAttachment = useCallback((id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== id),
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Convert files to base64
    const attachmentPromises = formData.attachments.map(async (attachment) => {
      const buffer = await attachment.file.arrayBuffer();
      return {
        filename: attachment.file.name,
        content: Buffer.from(buffer),
        contentType: attachment.file.type || "application/octet-stream",
      };
    });

    const processedAttachments = await Promise.all(attachmentPromises);

    const url = new URL(
      "./api/v1/google/compose/",
      process.env.NEXT_PUBLIC_BASE_URL
    );
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          message: formData.message,
          attachments: processedAttachments,
        }),
      });
      console.log(await response.json());

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      // Clear form after successful send
      setFormData({
        to: "",
        subject: "",
        message: "",
        attachments: [],
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="to" className="block text-sm font-medium">
          To:
        </label>
        <input
          type="email"
          id="to"
          value={formData.to}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, to: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium">
          Subject:
        </label>
        <input
          type="text"
          id="subject"
          value={formData.subject}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, subject: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message:
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, message: e.target.value }))
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          rows={4}
          required
        />
      </div>

      <div>
        <label htmlFor="attachments" className="block text-sm font-medium">
          Attachments:
        </label>
        <input
          type="file"
          id="attachments"
          onChange={handleFileChange}
          multiple
          className="mt-1 block w-full"
        />
        {formData.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {formData.attachments.map((att) => (
              <div key={att.id} className="flex items-center justify-between">
                <span className="text-sm">{att.file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(att.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Send Email
      </button>
    </form>
  );
}
