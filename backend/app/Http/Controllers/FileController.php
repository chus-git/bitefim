<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use App\Models\File;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;

class FileController extends Controller
{

    public function uploadFile(Request $request)
    {
        // Step 1: Run the "clean:expired-files" command
        Artisan::call('clean:expired-files');

        // Step 2: Check if the user has uploaded more than 3 files in the last 10 minutes
        if ($this->hasExceededFileLimit($request->ip(), 3, 10)) {
            return response()->json(['message' => 'File upload limit exceeded'], 422);
        }

        // Step 3: Validate file size
        $request->validate([
            'file' => 'required|file|max:100000', // Max file size of 100MB
        ]);

        // Step 4: Store the file in the public "files" directory with a unique name
        $filePath = $request->file('file')->store('files');
        $fileName = basename($filePath);

        // Step 5: Get the total size of uploaded files in the last 24 hours
        $totalSize = File::where('ip', $request->ip())
            ->where('upload_date', '>=', Carbon::now()->subDay())
            ->sum('size');

        // Step 6: Check if the total size exceeds 100MB limit per day
        $limitPerDay = 300 * 1024 * 1024; // 300MB in bytes

        if ($totalSize > $limitPerDay) {
            return response()->json(['message' => 'You have exceeded the daily file upload limit'], 422);
        }

        // Step 7: Register the file in the database with deletion date set to X minutes from now
        $public_id = Str::uuid();

        $file = File::create([
            'name' => $request->file('file')->getClientOriginalName(),
            'public_id' => $public_id,
            'path' => $filePath,
            'upload_date' => Carbon::now(),
            'deletion_date' => Carbon::now()->addMinutes(5),
            'ip' => $request->ip(),
            'size' => $request->file('file')->getSize(),
        ]);

        // Step 8: Send the response with upload status and public ID
        return response()->json([
            'message' => 'File uploaded successfully',
            'public_id' => $public_id
        ]);
    }

    private function hasExceededFileLimit($ip, $limit, $minutes)
    {
        // Check if the user has uploaded more than $limit files in the last $minutes minutes
        $fileCount = File::where('ip', $ip)
            ->where('upload_date', '>', Carbon::now()->subMinutes($minutes))
            ->count();

        return $fileCount >= $limit;
    }

    public function requestFile(Request $request, $filePublicID)
    {
        // Find the file by the provided public ID
        $file = File::where('public_id', $filePublicID)->first();

        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Check if the file is still within the deletion time limit
        if ($file->deletion_date && $file->deletion_date <= now()) {
            return response()->json(['message' => 'File has expired'], 404);
        }

        // Get the file's path
        $filePath = $file->path;

        // Check if the file exists in storage
        if (!Storage::exists($filePath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Return the file as a download response
        return response()->download(storage_path('app/' . $filePath));
    }

    public function requestFileInfo(Request $request, $filePublicID)
    {
        // Find the file by the provided public ID
        $file = File::where('public_id', $filePublicID)->first();

        if (!$file) {
            return response()->json(['message' => 'File not found'], 404);
        }

        // Calculate the remaining time until file expiration
        $currentTime = Carbon::now();
        $expirationTime = Carbon::parse($file->deletion_date); // Convertir a objeto Carbon

        // Verificar si la fecha de expiración está en el pasado
        $remainingSeconds = $expirationTime->isPast() ? 0 : $expirationTime->diffInSeconds($currentTime);

        // Obtener el nombre y tamaño del archivo
        $fileName = $file->name;
        $fileSize = Storage::size($file->path);

        // Devolver la información del archivo como respuesta JSON
        return response()->json([
            'name' => $fileName,
            'size' => $fileSize,
            'remaining_seconds' => $remainingSeconds,
            'status' => $file->status
        ]);
    }
}
