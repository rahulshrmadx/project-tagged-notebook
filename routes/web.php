<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TagController;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/login-register', function () {
    return Inertia::render('loginRegister');
});

// ✅ Regular authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ✅ Protected Route for creating notes
    Route::get('/create-note', function () {
        return Inertia::render('createNotes');
    })->name('create.note');
});

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->group(function () {
    // Inertia routes (web routes)
    Route::get('/tags', [TagController::class, 'index'])->name('admin.tags.index');
    Route::post('/tags', [TagController::class, 'store'])->name('admin.tags.store');
    Route::put('/tags/{tag}', [TagController::class, 'update'])->name('admin.tags.update'); 
    Route::delete('/tags/{tag}', [TagController::class, 'destroy'])->name('admin.tags.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';