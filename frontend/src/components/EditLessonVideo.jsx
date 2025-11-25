import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { lessonVideoApiUrl, token } from './common/Config';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

const EditLessonVideo = ({ lesson }) => {
    const [files, setFiles] = useState([]);
    const [videoUrl, setVideoUrl] = useState();

    useEffect(() => {
        if (lesson) {
            setVideoUrl(lesson.lesson_video_url)
        }
    }, [lesson])

    return (
        <div className="card shadow border-0 mt-3">
            <div className="card-body">
                <h4 className="h5 mb-3">Video</h4>

                <FilePond
                    acceptedFileTypes={['video/mp4']}
                    credits={false}
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: {
                            url: `${lessonVideoApiUrl}/${lesson.id}`,
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            onload: (response) => {
                                response = JSON.parse(response);
                                toast.success(response.message);
                                setVideoUrl(response.data.lesson_video_url)
                                setFiles([]);
                            },
                            onerror: (errors) => {
                                console.log(errors)
                            },
                        },
                    }}
                    name="video"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />

                {videoUrl &&
                    <div className="mt-3">
                        <ReactPlayer
                            width="100%"
                            height="100%"
                            controls
                            src={videoUrl}
                        />
                    </div>
                }


            </div>

        </div>
    )
}

export default EditLessonVideo