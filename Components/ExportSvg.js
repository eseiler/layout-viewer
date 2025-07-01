import React from 'react';

const ExportSvg = () => {

  const doExport = () => {
    // Get the SVG element
    const svgElement = document.querySelector('svg');
    if (!svgElement) {
      console.error("No SVG element found");
      return;
    }

    // Clone the SVG to avoid modifying the rendered one
    const svgClone = svgElement.cloneNode(true);

    // Convert the SVG to a string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgClone);

    // Insert the required attributes into the SVG tag
    svgString = svgString.replace(/<svg/, '<svg version="1.1" style="background-color: #242424; overflow: hidden"');

    // Insert the CSS style with CDATA section after the SVG tag opening
    const cssStyle = `<style type="text/css">
  <![CDATA[
      .node circle {
          fill: #f3f3ff;
          stroke: #2593b8;
          stroke-width: 1.5px
      }

      .node text {
          background-color: #444;
          font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
          font-size: 11px;
          fill: #f4f4f4;
          text-shadow: 0 1px 4px #000
      }

      path.link {
          fill: none;
          stroke: #2593b8;
          stroke-width: 1.5px
      }

  ]]>
  </style>`;

    // Insert the style element after the opening SVG tag
    svgString = svgString.replace(/<svg[^>]*>/, '$&\n' + cssStyle);

    // Add XML declaration and DOCTYPE
    svgString = '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n' + svgString;

    // Create a Blob with the SVG content
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});

    // Get the input value
    let filename = document.getElementById('uploaded-file')?.value || 'example.layout';

    // Extract just the filename from a potential path (handles both forward and backslashes)
    const basename = filename.split(/[\\/]/).pop();

    // Ensure we have a .svg extension
    const filenameSvg = basename.endsWith('.svg') ? basename : `${basename}.svg`;

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    const objectUrl = URL.createObjectURL(svgBlob);
    downloadLink.href = objectUrl;
    downloadLink.download = filenameSvg;
    downloadLink.type = 'image/svg+xml';

    // Append to body, click, and clean up
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up the object URL to prevent memory leaks
    setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
  };

  return (
    <button onClick={doExport} style={{ padding: '8px 16px', cursor: 'pointer' }}>Export SVG</button>
  );
};

export default ExportSvg;

