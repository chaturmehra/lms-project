import { Rating } from 'react-simple-star-rating'
import { DateFormat } from './DateFormat'
import UserIcon from '../../assets/images/defaultuserIcon.svg';

const Reviews = ({ reviews }) => {
    return (
        <div className='col-md-12 mt-4'>
            <div className='border bg-white rounded-3 p-4'>
                <h3 className='mb-3 h4'>Reviews</h3>
                <p>Our student says about this course</p>

                <div className='mt-4'>
                    {reviews && reviews.map(review => {
                        return (
                            <div className="d-flex align-items-start mb-4 border-bottom pb-3" key={review.id}>
                                <img src={UserIcon} alt="User" className="rounded-circle me-3" />
                                <div>
                                    <h6 className="mb-0">{review.user.name} <span className="text-muted fs-6">{DateFormat(review.created_at)}</span></h6>
                                    <div className="text-warning mb-2">
                                        <Rating readonly initialValue={review.rating} size={20} />
                                    </div>
                                    <p className="mb-0">{review.comment}</p>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </div>
    )
}

export default Reviews