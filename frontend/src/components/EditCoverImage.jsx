import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { useState } from 'react';
import { courseImageApiUrl, token } from './common/Config';
import toast from 'react-hot-toast';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

const EditCoverImage = ({ course, setCourse }) => {

    const [files, setFiles] = useState([]);

    // console.log("course", course)

    return (
        <div className="card shadow border-0 mt-3">
            <div className="card-body">
                <h4 className="h5 mb-3">Cover Image</h4>

                <FilePond
                    acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                    credits={false}
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    server={{
                        process: {
                            url: `${courseImageApiUrl}/${course.id}`,
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            onload: (response) => {
                                response = JSON.parse(response);
                                toast.success(response.message);
                                const updateCourseData = { ...course, course_small_image: response.data.course_small_image };
                                setCourse(updateCourseData)
                                setFiles([]);
                            },
                            onerror: (errors) => {
                                console.log(errors)
                            },
                        },
                    }}
                    name="image"
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />

                {course.course_small_image &&
                    <div className="mt-3">
                        <img className="img-fluid w-100" src={course.course_small_image} alt='' />
                    </div>
                }

            </div>

        </div>
    )
}

export default EditCoverImage