<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Illuminate\Validation\Rule;

class AccountController extends Controller
{
    //
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|min:5',
            'email' => 'required|email|unique:users',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user = new User();
        $user->name = $request->name;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "User Registered Successfully"
        ], 200);

    }

    public function authenticate(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = User::find(Auth::user()->id);
            $token = $user->createToken('token')->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'name' => $user->name,
                'id' => Auth::user()->id
            ], 200);

        } else {
            return response()->json([
                'status' => 401,
                'message' => "Either email/password is incorrect."
            ], 401);
        }
    }

    public function changePassword(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);
        $validator = Validator::make($request->all(), [
            'old_password' => ['required_with:new_password'],
            'new_password' => ['required', 'confirmed']
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        // Check if the old password matches
        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json([
                'status' => 401,
                'message' => 'The current password is incorrect.'
            ], 401);
        }

        // Check if new password is same as old password
        if (Hash::check($request->new_password, $user->password)) {
            return response()->json([
                'status' => 400,
                'message' => 'The new password must be different from the old password.'
            ], 400);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "User password updated successfully"
        ], 200);

    }

    public function profile(Request $request)
    {
        $user_id = $request->user()->id;
        $user = User::find($user_id);

        if (!$user) {
            return response()->json([
                'status' => 404,
                'message' => "User not found"
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $user
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user_id = $request->user()->id;

        $user = User::find($user_id);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($user_id)
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user->name = $request->name;
        $user->email = $request->email;
        $user->save();

        return response()->json([
            'status' => 200,
            'message' => "User profile updated successfully"
        ], 200);
    }

    public function enrollments(Request $request)
    {
        $enrollments = Enrollment::where('user_id', $request->user()->id)
            ->with([
                'course' => function ($q) {
                    $q->withCount('reviews');
                    $q->withSum('reviews', 'rating');
                    $q->withCount('enrollments');
                },
                'course.level'
            ])
            ->get();

        $enrollments->map(function ($enrollment) {
            $enrollment->course->rating = $enrollment->course->reviews_count > 0 ?
                number_format(($enrollment->course->reviews_sum_rating / $enrollment->course->reviews_count), 1) :
                "0.0";
        });

        return response()->json([
            'status' => 200,
            'data' => $enrollments,
        ], 200);
    }

    public function watchCourse($id, Request $request)
    {
        $count = Enrollment::where(['user_id' => $request->user()->id, 'course_id' => $id])->count();

        if ($count == 0) {
            return response()->json([
                'status' => 404,
                'message' => "You can not access this course",
            ], 404);
        }

        $course = Course::where('id', $id)
            ->withCount('chapters')
            ->with([
                'category',
                'level',
                'language',
                'chapters' => function ($query) {
                    $query->withCount([
                        'lessons' => function ($q) {
                            $q->where('status', 1);
                            $q->whereNotNull('video');
                        }
                    ]);
                    $query->withSum([
                        'lessons' => function ($q) {
                            $q->where('status', 1);
                            $q->whereNotNull('video');
                        }
                    ], 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                }
            ])
            ->first();

        $totalLessons = $course->chapters->sum('lessons_count');

        $activeLesson = collect();
        $activityCount = Activity::where(['user_id' => $request->user()->id, 'course_id' => $id])->count();

        if ($activityCount == 0) {

            $chapter = Chapter::where('course_id', $id)
                ->orderBy('sort_order', 'ASC')
                ->first();

            $lesson = Lesson::where('chapter_id', $chapter->id)
                ->where('status', 1)
                ->where('video', '!=', '')
                ->orderBy('sort_order', 'ASC')
                ->first();

            $activity = new Activity();
            $activity->user_id = $request->user()->id;
            $activity->course_id = $id;
            $activity->chapter_id = $chapter->id;
            $activity->lesson_id = $lesson->id;
            $activity->is_last_watched = 'yes';
            $activity->save();

            $activeLesson = $lesson;
        } else {
            $activity = Activity::where(
                [
                    'user_id' => $request->user()->id,
                    'course_id' => $id,
                    'is_last_watched' => 'yes'
                ]
            )->first();

            $activeLesson = Lesson::where('id', $activity->lesson_id)->first();

        }

        // Fetch lesson which are completed
        $completedLessons = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $id,
            'is_completed' => 'yes',
        ])
            ->pluck('lesson_id')
            ->toArray();

        $completedLessonsCount = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $id,
            'is_completed' => 'yes',
        ])->count();

        $progress = round(($completedLessonsCount / $totalLessons) * 100);

        return response()->json([
            'status' => 200,
            'data' => $course,
            'progress' => $progress,
            'activeLesson' => $activeLesson,
            'completedLessons' => $completedLessons
        ], 200);
    }

    public function saveUserActivity(Request $request)
    {
        Activity::where(
            [
                'user_id' => $request->user()->id,
                'course_id' => $request->course_id
            ]
        )->update(['is_last_watched' => 'no']);

        Activity::updateOrInsert(
            [
                'user_id' => $request->user()->id,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'chapter_id' => $request->chapter_id,
            ],
            [
                'is_last_watched' => 'yes'
            ]
        );


        return response()->json([
            'status' => 200,
            'message' => "User activity saved successfully.",
        ], 200);
    }

    public function markAsComplete(Request $request)
    {
        Activity::where(
            [
                'user_id' => $request->user()->id,
                'course_id' => $request->course_id,
                'lesson_id' => $request->lesson_id,
                'chapter_id' => $request->chapter_id,
            ]
        )->update(['is_completed' => 'yes']);

        // Fetch lesson which are completed
        $completedLessons = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'is_completed' => 'yes',
        ])
            ->pluck('lesson_id')
            ->toArray();

        $course = Course::where('id', $request->course_id)
            ->withCount('chapters')
            ->with([
                'chapters' => function ($query) {
                    $query->withCount([
                        'lessons' => function ($q) {
                            $q->where('status', 1);
                            $q->whereNotNull('video');
                        }
                    ]);
                    $query->withSum([
                        'lessons' => function ($q) {
                            $q->where('status', 1);
                            $q->whereNotNull('video');
                        }
                    ], 'duration');
                },
                'chapters.lessons' => function ($q) {
                    $q->where('status', 1);
                    $q->whereNotNull('video');
                }
            ])
            ->first();

        $totalLessons = $course->chapters->sum('lessons_count');

        $completedLessonsCount = Activity::where([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'is_completed' => 'yes',
        ])->count();

        $progress = round(($completedLessonsCount / $totalLessons) * 100);


        return response()->json([
            'status' => 200,
            'completedLessons' => $completedLessons,
            'progress' => $progress,
            'message' => "Lesson marked as completed successfully.",
        ], 200);
    }

    public function saveRating(Request $request)
    {
        $course = Course::find(['course_id' => $request->course_id]);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found.",
            ], 404);
        }

        $count = Review::where(['course_id' => $request->course_id, 'user_id' => $request->user()->id])->count();
        if ($count > 0) {
            return response()->json([
                'status' => 404,
                'message' => "You already given feedback on this course.",
            ], 404);
        }

        $review = new Review();
        $review->user_id = $request->user()->id;
        $review->course_id = $request->course_id;
        $review->comment = $request->comment;
        $review->rating = $request->rating;
        $review->status = 1;
        $review->save();

        return response()->json([
            'status' => 200,
            'message' => "Thanks for your feedback",
        ], 200);
    }

}
