import React, { useEffect, useState } from 'react'
import Course from '../components/Course'
import toast from 'react-hot-toast';
import { fetchAndFilterCourses, fetchCategories, fetchLanguages, fetchLevels, token } from '../components/common/Config';
import { Link, Links, useSearchParams } from 'react-router-dom';
import Loading from '../components/common/Loading';
import NotFound from '../components/common/NotFound';
import { CourseCardSkeleton } from '../components/common/course/CourseCardSkeleton';

const Courses = () => {

  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('desc');
  const [categories, setCategories] = useState([]);
  const [levels, setLevelss] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryChecked, setCategoryChecked] = useState(() => {
    const category = searchParams.get('category');
    return category ? category.split(',') : []
  });
  const [levelChecked, setLevelChecked] = useState(() => {
    const level = searchParams.get('level');
    return level ? level.split(',') : []
  });
  const [languageChecked, setLanguageChecked] = useState(() => {
    const language = searchParams.get('language');
    return language ? language.split(',') : []
  });

  const getCategories = async () => {
    try {
      const res = await fetch(fetchCategories, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (result.status === 200) {
        setCategories(result.data);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }
  const getLevels = async () => {
    try {
      const res = await fetch(fetchLevels, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (result.status === 200) {
        setLevelss(result.data);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }
  const getLanguages = async () => {
    try {
      const res = await fetch(fetchLanguages, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();

      if (result.status === 200) {
        setLanguages(result.data);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  const getCourses = async () => {

    let search = [];
    let params = "";

    if (categoryChecked.length > 0) {
      search.push(['category', categoryChecked]);
    }
    if (levelChecked.length > 0) {
      search.push(['level', levelChecked]);
    }
    if (languageChecked.length > 0) {
      search.push(['language', languageChecked]);
    }
    if (keyword.length > 0) {
      search.push(['keyword', keyword]);
    }

    search.push(['sort', sort]);

    if (search.length > 0) {
      params = new URLSearchParams(search);
      setSearchParams(params);
    } else {
      setSearchParams([]);
    }

    try {
      setLoading(true);
      const res = await fetch(`${fetchAndFilterCourses}?${params}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await res.json();
      setLoading(false);
      if (result.status === 200) {
        setCourses(result.data);
      }
    } catch (error) {
      toast.error("Server error. Please try again later.");
    }
  }

  const handleCategory = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setCategoryChecked(prev => [...prev, value]);
    } else {
      setCategoryChecked(categoryChecked.filter(id => id != value));
    }
  }

  const handleLevel = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setLevelChecked(prev => [...prev, value]);
    } else {
      setLevelChecked(levelChecked.filter(id => id != value));
    }
  }

  const handleLanguage = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setLanguageChecked(prev => [...prev, value]);
    } else {
      setLanguageChecked(languageChecked.filter(id => id != value));
    }
  }

  const clearFilters = () => {
    setCategoryChecked([]);
    setLevelChecked([]);
    setLanguageChecked([]);
    setKeyword('');

    document.querySelectorAll('.form-check-input').forEach(element => element.checked = false)
  }

  const searchByKeyword = async () => {
    getCourses();
  };

  useEffect(() => {
    getCategories();
    getLevels();
    getLanguages();
    getCourses();
  }, [])

  useEffect(() => {
    getCourses();
  }, [categoryChecked, levelChecked, languageChecked, sort])

  return (
    <div className='container pb-5 pt-3'>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to={'/'}>Home</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Courses</li>
        </ol>
      </nav>
      <div className='row'>
        <div className='col-lg-3'>
          <div className='sidebar mb-5 card border-0'>
            <div className='card-body shadow'>
              <div className='mb-3 input-group'>
                <input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                  className='form-control'
                  placeholder='Search by keyword'
                />
                <button className='btn btn-primary btn-sm' onClick={searchByKeyword}>Search</button>
              </div>
              <div className='pt-3'>
                <h3 className='h5 mb-2'>Category</h3>
                <ul>
                  {categories?.map(category => {
                    return (
                      <li key={category.id}>
                        <div className="form-check">
                          <input
                            defaultChecked={searchParams.get('category') ? searchParams.get('category').includes(category.id) : false}
                            onClick={(e) => handleCategory(e)}
                            className="form-check-input"
                            type="checkbox"
                            value={category.id}
                            id={`category-${category.id}`}
                          />
                          <label className="form-check-label" htmlFor={`category-${category.id}`}>
                            {category.name}
                          </label>
                        </div>
                      </li>
                    )
                  })}

                </ul>
              </div>
              <div className='mb-3'>
                <h3 className='h5  mb-2'>Level</h3>
                <ul>
                  {levels?.map(level => {
                    return (
                      <li key={level.id}>
                        <div className="form-check">
                          <input
                            defaultChecked={searchParams.get('level') ? searchParams.get('level').includes(level.id) : false}
                            onClick={(e) => handleLevel(e)}
                            className="form-check-input"
                            type="checkbox"
                            value={level.id}
                            id={`level-${level.id}`}
                          />
                          <label className="form-check-label" htmlFor={`level-${level.id}`}>
                            {level.name}
                          </label>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className='mb-3'>
                <h3 className='h5 mb-2'>Language</h3>
                <ul>
                  {languages?.map(language => {
                    return (
                      <li key={language.id}>
                        <div className="form-check">
                          <input
                            defaultChecked={searchParams.get('language') ? searchParams.get('language').includes(language.id) : false}
                            onClick={(e) => handleLanguage(e)}
                            className="form-check-input"
                            type="checkbox"
                            value={language.id}
                            id={`language-${language.id}`}
                          />
                          <label className="form-check-label" htmlFor={`language-${language.id}`}>
                            {language.name}
                          </label>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <Link className='clear-filter' onClick={() => clearFilters()}>Clear All Filters</Link>
            </div>
          </div>
        </div>
        <div className='col-lg-9'>
          <section className='section-3'>
            <div className='d-flex justify-content-between mb-3 align-items-center'>
              <div className='h5 mb-0'>
                {/* 10 courses found */}
              </div>
              <div>
                <select value={sort} onChange={(e) => setSort(e.target.value)} className='form-select'>
                  <option value="desc">Newset First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>
            <div className="row gy-4">
              {loading === false && courses.length == 0 && <NotFound message="We couldn't find any matching records. Please adjust your search or filters and try again." />}
              {loading && [...Array(3)].map((_, index) => <CourseCardSkeleton key={index} addClass="col-lg-4" />)}

              {loading === false &&
                courses?.map(course =>
                  <Course
                    key={course.id}
                    course={course}
                    customClasses="col-lg-4 col-md-6"
                  />
                )
              }
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Courses