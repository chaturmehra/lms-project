<?php

namespace App\Http\Controllers\front;

use App\Http\Controllers\Controller;
use App\Models\Chapter;
use App\Models\Lesson;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class LessonController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'chapter' => 'required',
            'title' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson = new Lesson();
        $lesson->chapter_id = $request->chapter;
        $lesson->title = $request->title;
        $lesson->sort_order = 1000;
        $lesson->save();

        $chapterId = $request->chapter;

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'data' => $lesson,
            'message' => "Lesson added Successfully."
        ], 200);
    }

    public function show($id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found"
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $lesson
        ], 200);
    }

    public function update($id, Request $request)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'chapter' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $lesson->chapter_id = $request->chapter;
        $lesson->title = $request->title;
        $lesson->is_free_preview = ($request->is_free_preview) == false ? 'no' : 'yes';
        $lesson->duration = $request->duration;
        $lesson->description = $request->description;
        $lesson->status = $request->status;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => "Lesson updated Successfully."
        ], 200);
    }

    public function delete($id)
    {
        $lesson = Lesson::find($id);

        if (!$lesson) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found"
            ], 404);
        }

        $chapterId = $lesson->chapter_id;

        $lesson->delete();

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'message' => "Lesson deleted Successfully."
        ], 200);
    }

    public function sortLessons(Request $request)
    {
        $chapterId = "";
        if (!empty($request->lessons)) {
            foreach ($request->lessons as $key => $lesson) {
                $chapterId = $lesson['chapter_id'];
                Lesson::where('id', $lesson['id'])->update(['sort_order' => $key]);
            }
        }

        $chapter = Chapter::where('id', $chapterId)->with('lessons')->first();

        return response()->json([
            'status' => 200,
            'chapter' => $chapter,
            'message' => "Lesson sort Successfully."
        ], 200);
    }

    public function saveLessonVideo($id, Request $request)
    {
        $lesson = Lesson::find($id);

        if ($lesson == null) {
            return response()->json([
                'status' => 404,
                'message' => "Lesson not found"
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'video' => 'required|mimes:mp4'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        if ($lesson->video !== "") {
            if (File::exists(public_path('uploads/course/videos/') . $lesson->video)) {
                File::delete(public_path('uploads/course/videos/' . $lesson->video));
            }
        }

        $video = $request->video;
        $ext = $video->getClientOriginalExtension();
        $videoName = strtotime('now') . '-' . $id . '.' . $ext;
        $video->move(public_path('uploads/course/videos'), $videoName);

        $lesson->video = $videoName;
        $lesson->save();

        return response()->json([
            'status' => 200,
            'data' => $lesson,
            'message' => "Video uploaded Successfully"
        ], 200);
    }

}
