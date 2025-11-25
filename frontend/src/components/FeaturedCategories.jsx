import { useEffect, useState } from "react"
import { fetchCategories, token } from "./common/Config";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import CategorySkeleton from "./common/CategorySkeleton";

const FeaturedCategories = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState();

    const getCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch(fetchCategories, {
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
                setCategories(result.data);
            }
        } catch (error) {
            toast.error("Server error. Please try again later.");
        }
    }

    useEffect(() => {
        getCategories();
    }, [])

    return (
        <section className='section-2'>
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Explore Categories</h2>
                    <p>Discover categories designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className='row gy-3'>
                    {loading && [...Array(4)].map((_, index) => <CategorySkeleton key={index} />)}
                    {loading == false && categories?.map(category => {
                        return (
                            <div className='col-6 col-md-6 col-lg-3' key={category.id}>
                                <div className='card shadow border-0'>
                                    <div className='card-body'>
                                        <Link to={`/courses?category=${category.id}`}>{category.name}</Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}


                </div>
            </div>
        </section>
    )
}

export default FeaturedCategories
