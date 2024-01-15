import React, { useEffect, useRef, useState } from 'react';
import DatePicker from '@/components/DatePicker';
import { Editor } from '@tinymce/tinymce-react';

//
const Test = () => {
  const [date1, setDate1] = useState();
  const [date2, setDate2] = useState();
  //md content
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="flex">
      <div>
        {JSON.stringify(date1, null, 2)}
        {JSON.stringify(date2, null, 2)}
        <DatePicker date={date1} setDate={setDate1} />
        <DatePicker Icon={'none'} date={date2} setDate={setDate2} />
      </div>
      <Editor
        apiKey={import.meta.env.VITE_TINY_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'code',
            'help',
            'wordcount',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'link image | ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
      />
      {/* text edit */}
      <button onClick={log} className="btn">
        Test
      </button>
    </div>
  );
};

export default Test;
