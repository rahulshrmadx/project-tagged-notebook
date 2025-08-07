<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class NoteController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $data['user_id'] = auth()->id();

        if ($request->hasFile('cover_image')) {
            $data['cover_image'] = $request->file('cover_image')->store('cover_images', 'public');
        }

        $note = Note::create($data);

        $matchedTagIds = $request->tag_ids ?? [];

        if (empty($matchedTagIds)) {
            $content = Str::lower($data['title'] . ' ' . $data['description']);
            $allTags = Tag::pluck('name', 'id')->toArray();

            foreach ($allTags as $id => $name) {
                if (Str::contains($content, Str::lower($name))) {
                    $matchedTagIds[] = $id;
                }
            }
        }

        $note->tags()->sync($matchedTagIds);

        return response()->json([
            'message' => 'Note created successfully!',
            'note' => $note->load('tags'),
        ], 201);
    }
}
