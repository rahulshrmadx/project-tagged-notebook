<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TagController;


// ✅ Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [UserController::class, 'register'])->name('auth.register');
    Route::post('/login', [UserController::class, 'login'])->name('auth.login');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [UserController::class, 'logout'])->name('auth.logout');
            Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');

    });
});

// routes/api.php - Keep separate API routes if needed

Route::get('/tags', function () {
    try {
        return response()->json(\App\Models\Tag::all());
    } catch (\Exception $e) {
        return response()->json([], 500);
    }
});
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/tags', [TagController::class, 'store']);
    Route::put('/tags/{tag}', [TagController::class, 'update']);
    Route::delete('/tags/{tag}', [TagController::class, 'destroy']);
});