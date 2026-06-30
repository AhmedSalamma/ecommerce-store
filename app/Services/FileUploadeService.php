<?php
namespace App\Services;
use Illuminate\Support\Facades\Storage;

class FileUploadeService{

    public static function update($newImage, $oldImage, $folder){
        if(!$newImage){
           return;
        }

        if($oldImage && Storage::disk('public')->exists($oldImage)) {
            Storage::disk('public')->delete($oldImage);
        }

        return   $newImage->store($folder,'public');
        
    }



}