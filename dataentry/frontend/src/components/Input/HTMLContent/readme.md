# Input for HTML content

This is a component to both show and edit html content. It uses a wysiwyg editor.

## Installation

- copy this folder to your project
- install tinymce `npm install --save @tinymce/tinymce-react`
- copy `/public/tinymce.css` to your project
- copy `/public/tinymce` to your project (or download at https://www.tiny.cloud/get-tiny/)
- add next code to `/public/index.html` in the head:

```
    <script src="%PUBLIC_URL%/tinymce/tinymce.min.js"></script>
    <link rel="stylesheet" href="%PUBLIC_URL%/tinymce.css" type="text/css" />
```

- use the component:

```
<HTMLContent
    value={omschrijving}
    onChange={val=>setOmschrijving(val)}
    editable={adminMode}
    />
```
