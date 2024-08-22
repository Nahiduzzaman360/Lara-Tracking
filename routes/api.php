<?php

use App\Events\SendLocation;
use Illuminate\Support\Facades\Route;

Route::get('event', function () {
    event(new SendLocation('Dhaka, Bangladesh'));
    return ('Done');
});