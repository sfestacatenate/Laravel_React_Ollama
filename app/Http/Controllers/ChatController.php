<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Helpers\ContextHelper;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        $conversation = $request->input('question');
        $language = $request->input('language', 'eng');

        $prompt = ContextHelper::getPrompt($language, $conversation);

        $response = Http::timeout(60)->post('http://localhost:11434/api/generate', [
            'model' => 'gemma3:12b-it-qat',
            'prompt' => $prompt,
            'stream' => false,
        ]);

        $answer = trim($response->json()['response'] ?? '');
        
        return response()->json([
            'answer' => $answer,
        ], 200, ['Content-Type' => 'application/json; charset=UTF-8'], JSON_UNESCAPED_UNICODE);

    }
}
