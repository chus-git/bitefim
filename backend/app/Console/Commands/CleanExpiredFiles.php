<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\File;
use Illuminate\Support\Facades\Storage;

class CleanExpiredFiles extends Command
{
    protected $signature = 'clean:expired-files';

    protected $description = 'Clean expired files';

    public function handle()
    {
        // Obtén la fecha y hora actual
        $currentDateTime = Carbon::now();

        // Busca los archivos expirados en la base de datos
        $expiredFiles = File::where('deletion_date', '<=', $currentDateTime)->get();

        // Marca los archivos expirados como "deleted" y eliminarlos
        foreach ($expiredFiles as $file) {

            Storage::delete($file->path);

            $file->status = 'deleted';
            $file->save();
        }

        $this->info('Expired files cleaned successfully.');
    }
}
