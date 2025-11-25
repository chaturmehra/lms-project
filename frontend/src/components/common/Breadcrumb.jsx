import { Link, useLocation } from "react-router-dom"

const Breadcrumb = ({ page_name }) => {

    const location = useLocation();
    const pathname = location.pathname;

    const isCoursesPage = pathname.includes("/account/courses/");

    return (
        <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/my-account">Account</Link></li>
                {isCoursesPage && <li className="breadcrumb-item"><Link to="/account/my-courses">My Courses</Link></li>}
                <li className="breadcrumb-item active" aria-current="page">{page_name}</li>
            </ol>
        </nav>
    )
}

export default Breadcrumb