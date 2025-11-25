export const apiUrl = import.meta.env.VITE_API_URL;
export const currency = import.meta.env.VITE_CURRENCY_SYMBOL;
const userInfo = localStorage.getItem('userInfoLms');
export const token = userInfo ? JSON.parse(userInfo).token : null;

export const loginApiUrl = apiUrl + '/login';
export const registerApiUrl = apiUrl + '/register';

export const changePasswordApiUrl = apiUrl + '/change-password';
export const profileApiUrl = apiUrl + '/profile';
export const updateProfileApiUrl = apiUrl + '/update-profile';

export const createCourseApiUrl = apiUrl + '/courses';
export const courseMetadataApiUrl = apiUrl + '/courses/meta-data';
export const courseImageApiUrl = apiUrl + '/save-course-image';
export const changeCourseStatusApiUrl = apiUrl + '/change-course-status';
export const myCoursesApiUrl = apiUrl + '/my-courses';

export const createOutcomeApiUrl = apiUrl + '/outcomes';
export const sortOutcomeApiUrl = apiUrl + '/sort-outcomes';

export const createRequirementApiUrl = apiUrl + '/requirements';
export const sortRequirementApiUrl = apiUrl + '/sort-requirements';

export const createChapterApiUrl = apiUrl + '/chapters';
export const sortChapterApiUrl = apiUrl + '/sort-chapters';

export const createLessonApiUrl = apiUrl + '/lessons';
export const sortLessonApiUrl = apiUrl + '/sort-lessons';
export const lessonVideoApiUrl = apiUrl + '/save-lesson-video';

export const fetchCategories = apiUrl + '/fetch-categories';
export const fetchLevels = apiUrl + '/fetch-levels';
export const fetchLanguages = apiUrl + '/fetch-languages';
export const fetchFeaturedCourses = apiUrl + '/fetch-featured-courses';
export const fetchAndFilterCourses = apiUrl + '/fetch-courses';
export const fetchCourseDetail = apiUrl + '/fetch-course';
export const enrollCourse = apiUrl + '/enroll-course';
export const enrollmentsApiUrl = apiUrl + '/enrollments';
export const enrollWatchCourse = apiUrl + '/enroll-watch-course';
export const saveUserActivity = apiUrl + '/save-activity';
export const markAsComplete = apiUrl + '/mark-as-complete';
export const saveRating = apiUrl + '/save-rating';


export const convertMinutesToHours = (minutes) => {
    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    if (hours > 0) {
        let hString = hours === 1 ? "hr" : "hrs";
        let mString = remainingMinutes === 1 ? "min" : "mins";

        if (remainingMinutes > 0) {
            return `${hours} ${hString} ${remainingMinutes} ${mString}`;
        } else {
            return `${hours} ${hString}`;
        }
    } else {
        if (remainingMinutes > 0) {
            let mString = remainingMinutes === 1 ? "min" : "mins";
            return `${remainingMinutes} ${mString}`;
        }
    }

    return "0 min";
}