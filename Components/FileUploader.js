import React from 'react';
// import { useDispatch } from 'react-redux';
import { updateTreeData } from '../Reducers/actions';

const FileUploader = () => {
//   const dispatch = useDispatch();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        // Get the raw text content
        const rawContent = e.target.result;

        // Process the raw text content to create the tree data structure
        const processedData = processRawContent(rawContent);

        // Update the Redux store with the processed data
        // dispatch(updateTreeData(processedData));
        updateTreeData(processedData);
      } catch (error) {
        console.error('Error processing file:', error);
        alert('Failed to process the file. Please check the format.');
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      alert('Failed to read the file.');
    };

    reader.readAsText(file);
  };

  // Process the raw file content to create the tree data structure
  const processRawContent = (content) => {
    try {
      const lines = content.split('\n').filter((line) => line.trim().length > 0 && line[0] != '@' && line[0] != '#');
      let treeData = {
        name: 0,
        label: "0", // Changed to string
        children: [],
        gProps: { "data-tooltip-id": 'my-tooltip', "data-tooltip-content": 0 },
      }
      let id = 1;
      for (let i = 0; i < lines.length; i++) {
        let currentNode = treeData;
        let split = lines[i].split('\t');
        let tb_indices = split[1].split(';');
        if (tb_indices.length <= 1) {
          // Convert to string after incrementing
          currentNode.label = String(parseInt(currentNode.label) + 1);
        }
        for (let j = 0; j < tb_indices.length - 1; j++) {
          let children = currentNode.children.findIndex((child) => child.gProps["data-tooltip-content"] === tb_indices[j]);
          if (children === -1) {
            let newNode = {
              name: id++,
              label: "1", // Initialize as string
              children: [],
              gProps: { "data-tooltip-id": 'my-tooltip', "data-tooltip-content": tb_indices[j] },
            };
            currentNode.children.push(newNode);
            currentNode.label = String(parseInt(currentNode.label) + 1);
            currentNode = newNode;
          } else {
            // Convert to string after incrementing
            currentNode.label = String(parseInt(currentNode.label) + 1);
            currentNode.children[children].label = String(parseInt(currentNode.children[children].label) + 1);
            currentNode = currentNode.children[children];
          }
        }
      }
      return treeData;
    } catch (err) {
      console.error('Error parsing content:', err);
      throw new Error('Could not parse the file format');
    }
  };

  return (
    <div className="file-uploader">
      <input
        type="file"
        // accept=".txt,.log,.md" // Update to accept relevant file types
        onChange={handleFileUpload}
      />
    </div>
  );
};

export default FileUploader;
