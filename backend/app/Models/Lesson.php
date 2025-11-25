<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $appends = ['lesson_video_url'];
    function getLessonVideoUrlAttribute()
    {
        if ($this->video == "") {
            return "";
        }

        return asset('uploads/course/videos/' . $this->video);
    }
}
