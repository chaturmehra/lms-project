<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Chapter;
use App\Models\Course;
use App\Models\Language;
use App\Models\Lesson;
use App\Models\Level;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class CourseController extends Controller
{
    public function index()
    {

    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course = new Course();
        $course->title = $request->title;
        $course->status = 0;
        $course->user_id = $request->user()->id;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Course has been created Successfully"
        ], 200);
    }

    public function show($id)
    {
        $course = Course::with(['chapters', 'chapters.lessons'])->find($id);

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found"
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $course
        ], 200);
    }

    public function update($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|min:5',
            'category' => 'required',
            'level' => 'required',
            'language' => 'required',
            'price' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $course->title = $request->title;
        $course->category_id = $request->category;
        $course->level_id = $request->level;
        $course->language_id = $request->language;
        $course->description = $request->description;
        $course->price = $request->price;
        $course->cross_price = $request->cross_price;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Course has been updated Successfully"
        ], 200);
    }

    public function saveCourseImage($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|mimes:png,jpg,jpeg'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($course->image !== "") {
            if (File::exists(public_path('uploads/course/') . $course->image)) {
                File::delete(public_path('uploads/course/' . $course->image));
            }
            if (File::exists(public_path('uploads/course/small/') . $course->image)) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }

        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = strtotime('now') . '-' . $id . '.' . $ext;
        $image->move(public_path('uploads/course'), $imageName);

        $this->GenerateCourseSmallImage($imageName);

        $course->image = $imageName;
        $course->save();

        return response()->json([
            'status' => 200,
            'data' => $course,
            'message' => "Image added Successfully"
        ], 200);
    }

    public function changeStatus($id, Request $request)
    {
        $course = Course::find($id);

        if ($course == null) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found"
            ], 404);
        }

        // At least one chapter is required
        $chapters = Chapter::where('course_id', $id)->pluck('id')->toArray();
        if (count($chapters) == 0) {
            return response()->json([
                'status' => 404,
                'message' => "A chapter is required before you can publish the course."
            ], 404);
        }

        // At least one lesson with video is required
        $lessonCount = Lesson::whereIn('chapter_id', $chapters)
            ->where('status', 1)
            ->whereNotNull('video')
            ->count();

        if ($lessonCount == 0) {
            return response()->json([
                'status' => 404,
                'message' => "At least one lesson with video is required to publish this course."
            ], 404);
        }

        $course->status = $request->status;
        $course->save();

        $message = ($course->status == 1) ? 'Course published successfully.' : "Course unpublished successfully.";

        return response()->json([
            'status' => 200,
            'course' => $course,
            'message' => $message
        ], 200);
    }

    public function delete($id, Request $request)
    {
        $course = Course::find($id)->where('user_id', $request->user()->id)->first();

        if (!$course) {
            return response()->json([
                'status' => 404,
                'message' => "Course not found"
            ], 404);
        }

        $chapters = Chapter::where('course_id', $course->id)->get();
        if (!empty($chapters)) {
            foreach ($chapters as $key => $chapter) {
                $lessons = Lesson::where('chapter_id', $chapter->id)->get();
                if (!empty($lessons)) {
                    foreach ($lessons as $lesson) {
                        if ($lesson->video !== "") {
                            if (File::exists(public_path('uploads/course/videos') . $lesson->video)) {
                                File::delete(public_path('uploads/course/videos' . $lesson->video));
                            }
                        }
                    }
                }
            }
        }

        if ($course->image !== "") {
            if (File::exists(public_path('uploads/course/') . $course->image)) {
                File::delete(public_path('uploads/course/' . $course->image));
            }
            if (File::exists(public_path('uploads/course/small/') . $course->image)) {
                File::delete(public_path('uploads/course/small/' . $course->image));
            }
        }

        $course->delete();

        return response()->json([
            'status' => 200,
            'message' => "Course deleted Successfully."
        ], 200);
    }

    public function metaData()
    {
        $categories = Category::where('status', 1)->get();
        $levels = Level::where('status', 1)->get();
        $languages = Language::where('status', 1)->get();

        return response()->json([
            'status' => 200,
            'categories' => $categories,
            'levels' => $levels,
            'languages' => $languages
        ], 200);
    }

    public function GenerateCourseSmallImage($imageName)
    {
        $manager = new ImageManager(Driver::class);
        $img = $manager->read(public_path('uploads/course/' . $imageName));
        $img->cover(750, 450);
        $img->save(public_path('uploads/course/small/' . $imageName));
    }

    public function courses(Request $request)
    {
        $courses = Course::where('user_id', $request->user()->id)
            ->with('level')
            ->withCount('enrollments')
            ->withCount('reviews')
            ->withSum('reviews', 'rating')
            ->get();

        $courses->map(function ($course) {
            $course->rating = $course->reviews_count > 0 ?
                number_format(($course->reviews_sum_rating / $course->reviews_count), 1) :
                "0.0";
        });

        return response()->json([
            'status' => 200,
            'courses' => $courses,
        ], 200);
    }
}
