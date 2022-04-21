import { getFiles, getFileContent } from './api'

export function downloadFromUrl(url, filename) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// takes file data object from db and downloads file content
export function downloadFiles(files) {
	Array.prototype.forEach.call( files, async (file, index) => {
		let response = new Response(await getFileContent(file.id))
		let url = URL.createObjectURL(await response.blob())
		downloadFromUrl(url, file.user_file_name)
	})
}
