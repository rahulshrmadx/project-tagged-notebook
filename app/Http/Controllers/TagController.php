<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TagController extends Controller
{
   public function index()
   {
    try {
        $tags = \App\Models\Tag::all();
        
        return inertia('Settings/Tags', [
            'tags' => $tags->toArray() // Ensure it's an array
        ]);
    } catch (\Exception $e) {
        \Log::error('Failed to load tags: ' . $e->getMessage());
        
        return inertia('Settings/Tags', [
            'tags' => [] // Return empty array on error
        ]);
    }
   }
    // For API requests - return JSON (keep this separate)
    public function apiIndex()
    {
        return response()->json(Tag::all(), 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:tags,name',
        ]);

        $tag = Tag::create(['name' => $request->name]);

        // For Inertia requests
        if ($request->header('X-Inertia')) {
            return back()->with('success', 'Tag created successfully!');
        }

        // For API requests
        return response()->json([
            'message' => 'Tag created successfully.',
            'tag' => $tag
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $tag = Tag::find($id);

        if (!$tag) {
            if ($request->header('X-Inertia')) {
                return back()->withErrors(['message' => 'Tag not found.']);
            }
            return response()->json(['message' => 'Tag not found.'], 404);
        }

        $request->validate([
            'name' => 'required|string|unique:tags,name,' . $tag->id,
        ]);

        $tag->update(['name' => $request->name]);

        // For Inertia requests
        if ($request->header('X-Inertia')) {
            return back()->with('success', 'Tag updated successfully!');
        }

        return response()->json([
            'message' => 'Tag updated successfully.',
            'tag' => $tag
        ], 200);
    }

    public function destroy($id)
    {
        $tag = Tag::find($id);

        if (!$tag) {
            if (request()->header('X-Inertia')) {
                return back()->withErrors(['message' => 'Tag not found.']);
            }
            return response()->json(['message' => 'Tag not found.'], 404);
        }

        $tag->delete();

        // For Inertia requests
        if (request()->header('X-Inertia')) {
            return back()->with('success', 'Tag deleted successfully!');
        }

        return response()->json(['message' => 'Tag deleted successfully.'], 200);
    }
}