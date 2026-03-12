import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [files, setFiles] = useState([]);
  const [currentFileData, setCurrentFileData] = useState('');
  const [currentFile, setCurrentFile] = useState(null);

  function createNewFile() {
    setIsModalOpen(true);
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    axios.post('http://localhost:3000/create', {
      filename: newFileName,
      filedata: ""
    }).then(() => {
      setIsModalOpen(false);
      getFiles();
      setNewFileName("");
    });
  }

  function getFiles() {
    axios.get("http://localhost:3000/get-all")
      .then((res) => setFiles(res.data));
  }

  function getFileData(filename) {
    setCurrentFile(filename);
    axios.get(`http://localhost:3000/read/${filename}`)
      .then((res) => setCurrentFileData(res.data));
  }

  function updateFile(filename, filedata) {
    axios.patch(`http://localhost:3000/update/${filename}`, { filedata })
      .then(() => {});
  }

  function deleteFile(filename) {
    axios.delete(`http://localhost:3000/delete/${filename}`)
      .then(() => {
        getFiles();
        if (currentFile === filename) {
          setCurrentFile(null);
          setCurrentFileData('');
        }
      });
  }

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      {/* Sidebar */}
      <aside className="bg-gray-100 text-black p-4 flex flex-col w-full md:w-64 flex-shrink-0">
        <div className="mb-4 text-xl flex justify-between items-center">
          <h3 className="font-semibold text-lg md:text-xl">Explorer</h3>
          <i
            onClick={createNewFile}
            className="ri-add-line bg-blue-500 text-white p-1 rounded cursor-pointer"
          ></i>
        </div>
        <ul className="overflow-auto max-h-[calc(100vh-80px)]">
          {files.map((file, idx) => (
            <li key={idx} className="mb-2 flex justify-between items-center">
              <span onClick={() => getFileData(file)} className="cursor-pointer truncate max-w-[70%]">
                <i className="ri-file-line mr-2"></i>{file}
              </span>
              <i
                className="ri-delete-bin-line cursor-pointer text-red-500"
                onClick={() => deleteFile(file)}
              ></i>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Editor */}
      <main className="flex-1 bg-gray-300 text-black flex flex-col min-h-[300px] overflow-auto">
        {currentFile && (
          <div className="p-2 bg-gray-200 border-b text-sm md:text-base truncate">
            <strong>Editing:</strong> {currentFile}
          </div>
        )}
        <textarea
          className="w-full h-full border-none p-2 outline-none flex-1 resize-none"
          placeholder={currentFile ? "Edit your file here..." : "Select a file to start editing..."}
          value={currentFileData}
          onChange={(e) => {
            setCurrentFileData(e.target.value);
            updateFile(currentFile, e.target.value);
          }}
          disabled={!currentFile}
        ></textarea>
      </main>

      {/* Modal for creating new file */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black bg-opacity-30 z-50">
          <div className="p-4 rounded shadow-lg bg-gray-400 w-11/12 max-w-md">
            <h2 className="text-xl mb-4 text-center">Create New File</h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="border p-2 mb-4 w-full rounded-md outline-none"
                placeholder="Enter file name"
                required
              />
              <button
                type="submit"
                className="bg-gray-100 text-black w-full cursor-pointer p-2 rounded hover:bg-gray-200 transition"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
