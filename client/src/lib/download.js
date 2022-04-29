import { getFiles, getFileContent } from './api'
import{ getApiBase } from './apiBase'

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

export function downloadAllFromUrl(files) {
  Array.prototype.forEach.call( files, async (file, index) => {
    const fileContentUrl = `${getApiBase()}/getFile/${file.id}/content`
    downloadFromUrl(fileContentUrl, file.user_file_name)
  })
}

// takes file data object from db and downloads file content
export function downloadFiles(files) {
	Array.prototype.forEach.call( files, async (file, index) => {
    const newHandle = await window.showSaveFilePicker({ suggestedName:file.user_file_name});
    const writableStream = await newHandle.createWritable()
		let response = (await getFileContent(file.id)).getReader()
    const stream = new ReadableStream({
      start(controller) {
        function pump() {
          return response.read().then(({ done, value }) => {
            if (done)
              return controller.close()

            controller.enqueue(value)
            return pump()
          })
        }
        return pump();
      }
    }) 
    await stream.pipeTo(writableStream)
	})
}
