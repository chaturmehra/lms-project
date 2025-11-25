import { BsBriefcase } from 'react-icons/bs'

const CourseLevel = ({ level }) => {
    return (
        <div className="level">
            <div className="d-flex align-items-center">
                <div className="icon">
                    <BsBriefcase />
                </div>
                <div className="text ps-2">{level}</div>
            </div>
        </div>
    )
}

export default CourseLevel