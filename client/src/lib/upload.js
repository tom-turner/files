import {uploadFiles} from '../lib/api'

export function handleUpload( event, uploadProgress ){
  let files = event.target.files
  if(files.length === 0)
    return

  uploadFiles(files, async (e) => {
      if(e.data)
        uploadProgress({data: e.data})
      
      if(e.error)
        uploadProgress({ error: e.error })
      
      if(e.progress)
        uploadProgress({ percent: e.progress, message:`${ Math.round(e.progress * 100) / 100}% done`})
      
      if(e.success)
        uploadProgress({ success: true, message:'Finishing up' })
      
  })
}
