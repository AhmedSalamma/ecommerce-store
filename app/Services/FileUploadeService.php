<?php
namespace App\Services;
use Illuminate\Support\Facades\Storage;

class FileUploadeService{

    public static function update($newImage, $oldImage, $folder){
        if(!$newImage){
           return;
        }

        Storage::disk('public')->delete($oldImage);
        $path =  $newImage->store($folder,'public');

        return  $path;
    }



}