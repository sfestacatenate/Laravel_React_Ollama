<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\TodoController;
use App\Models\Todo;
use App\Http\Controllers\ChatController;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'todos' => Todo::all(),
    ]);
});

Route::post('/chatbot', [ChatController::class, 'ask']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
