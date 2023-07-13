/**
 * Copyright 2022 Wageningen Environmental Research, Wageningen UR
 * Licensed under the EUPL, Version 1.2 or as soon they
 * will be approved by the European Commission - subsequent
 * versions of the EUPL (the "Licence");
 * You may not use this work except in compliance with the
 * Licence.
 * You may obtain a copy of the Licence at:
 *
 * https://joinup.ec.europa.eu/software/page/eupl
 *
 * Unless required by applicable law or agreed to in
 * writing, software distributed under the Licence is
 * distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied.
 * See the Licence for the specific language governing
 * permissions and limitations under the Licence.
 */

/**
* @author Ronnie van Kempen  (ronnie.vankempen@wur.nl)
* @author Marlies de Keizer (marlies.dekeizer@wur.nl)
* @author Eliya Buyukkaya (eliya.buyukkaya@wur.nl)
*/

import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TinyMCEEditor({
  value,
  onChange,
  height = 500,
  singleLineMarkup = false,
  onBlur,
  className,
  allowImages = false,
}) {
  const editorRef = useRef(null);

  let editorSettings = {
    height,
    content_css: `${process.env.PUBLIC_URL}/tinymce.css`,
    // inline: true,
    body_class: "tinymce-content",
    auto_focus: true,
  };

  if (singleLineMarkup) {
    // @todo check settings, maybe use inline: true here?
    editorSettings.forced_root_block = false; // deprecated!
    editorSettings.valid_elements = "strong/b,i";
    editorSettings.plugins =
      "charmap searchreplace code insertdatetime paste wordcount";
    editorSettings.menubar = "edit insert view format tools help";
    editorSettings.toolbar = "undo redo | bold italic";
    editorSettings.image_advtab = false;
  } else {
    editorSettings.plugins = [
      "code",
      "table",
      "lists",
      // "advlist"
      "link",
      "charmap",
      "preview",
      "fullscreen",
      "autolink",
      "help",
      // "searchreplace"
      // "visualblocks",
    ];
    editorSettings.menubar = "edit insert view format table tools help";
    const imgToolbar = allowImages ? " image" : "";
    editorSettings.toolbar = `undo redo | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link${imgToolbar}`;

    if (allowImages) {
      editorSettings.plugins.push("media", "image");

      editorSettings.image_advtab = true;
      editorSettings.image_title = true;
      /* enable automatic uploads of images represented by blob or data URIs*/
      editorSettings.automatic_uploads = true;
      /*
        URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
        images_upload_url: 'postAcceptor.php',
        here we add custom filepicker only to Image dialog
      */
      editorSettings.file_picker_types = "image";
      /* and here's our custom image picker*/
      editorSettings.file_picker_callback = function (cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");

        /*
            Note: In modern browsers input[type="file"] is functional without
            even adding it to the DOM, but that might not be the case in some older
            or quirky browsers like IE, so you might want to add it to the DOM
            just in case, and visually hide it. And do not forget do remove it
            once you do not need it anymore.
        */

        input.onchange = function () {
          var file = this.files[0];

          var reader = new FileReader();
          reader.onload = function () {
            /*
            Note: Now we need to register the blob in TinyMCEs image blob
            registry. In the next release this part hopefully won't be
            necessary, as we are looking to handle it internally.
            */
            var id = "blobid" + new Date().getTime();
            var blobCache = editorRef.current.editorUpload.blobCache;
            var base64 = reader.result.split(",")[1];
            var blobInfo = blobCache.create(id, file, base64);
            blobCache.add(blobInfo);

            /* call the callback and populate the Title field with the file name */
            cb(blobInfo.blobUri(), { title: file.name });
          };
          reader.readAsDataURL(file);
        };

        input.click();
      };
    }
  }

  // const handlePreviewClick = () => {
  //   if (editorRef.current && preview) {
  //     const htmlString = editorRef.current.getContent();
  //     preview(htmlString);
  //   }
  // };

  return (
    <Editor
      className={className}
      apiKey="1pbz2qqem9a4rq98pcla20tum8re2d81u84n9k6heaa7zhiy"
      onInit={(evt, editor) => {
        editorRef.current = editor;
        editor.selection.select(editor.getBody(), true);
        editor.selection.collapse(false);
      }}
      value={value}
      init={editorSettings}
      onEditorChange={(newValue) => onChange?.(newValue)}
      onBlur={onBlur}
    />
  );
}
