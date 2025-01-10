import { CKEditor, useCKEditorCloud } from "@ckeditor/ckeditor5-react";
import React, { useEffect, useState } from "react";

interface CustomEditorProps {
  value: string;
  onChange: (data: string) => void;
}

const CustomEditor: React.FC<CustomEditorProps> = ({ value, onChange }) => {
  const [editorData, setEditorData] = useState<string>(value || "");
  const [isClient, setIsClient] = useState(false); // To check if we're on the client
  const cloud = useCKEditorCloud({
    version: "44.0.0",
    premium: true,
  });

  // Set `isClient` to true after component mounts (only in the browser)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync the editor data with value prop
  useEffect(() => {
    if (value !== editorData) {
      setEditorData(value);
    }
  }, [value, editorData]);

  // If not on client, return null to prevent rendering server-side
  if (!isClient) {
    return null;
  }

  if (cloud.status === "error") {
    return <div>Error! Unable to load the editor.</div>;
  }

  if (cloud.status === "loading") {
    return <div>Loading editor...</div>;
  }

  const handleEditorChange = (event: any, editor: any) => {
    const data = editor.getData();
    setEditorData(data);
    onChange(data);
  };

  const { ClassicEditor, Essentials, Paragraph, Bold, Italic } = cloud.CKEditor;

  const { FormatPainter } = cloud.CKEditorPremiumFeatures;

  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      onChange={handleEditorChange}
      config={{
        licenseKey:
          "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzUyNTc1OTksImp0aSI6IjVjZTMzZDczLWU1OTctNDk2OC05OWY4LTE0YThjNzAyZmEwNiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjNmOWEwN2M3In0.c4tesphl2kqu1Au62BnlJKXDprUCP3ttvhfMC2P4QL1GIenMZ-FgcmFayBCgvUfcIYzGtF3-Xd25URZQ9oYk9w",
        plugins: [Essentials, Paragraph, Bold, Italic, FormatPainter],
        toolbar: ["undo", "redo", "|", "bold", "italic", "|", "formatPainter"],
      }}
    />
  );
};

export default CustomEditor;
