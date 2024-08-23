<?php

use App\Events\SendLocation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;

Route::post('verify-token', function (Request $request) {
    $token = $request->input('secret_key');

    if(!$token){
        return response()->json(User::create([
            'secret-key' => uniqid()
        ]));
    }

    $user = User::where([['secret-key', $token],['status',0]])->first();
    if(!$user){
        return response()->json(User::create([
            'secret-key' => uniqid()
        ]));
    }

    return response()->json($user);
});

Route::post('send-location', function(Request $request){
    $request->validate([
        'secret_key' => 'required',
        'latitude' => 'required',
        'longitude' => 'required',
    ]);

    $secret_key = $request->input('secret_key');
    $latitude = $request->input('latitude');
    $longitude = $request->input('longitude');

    $user = User::where('secret-key', $secret_key)->firstOrFail();
    $user->lat = $latitude;
    $user->lon = $longitude;
    $user->updated_at = now();
    $user->save();

    event(new SendLocation($user));
    return response()->json('success');
});

Route::post('fetch-location', function(Request $request){
    $request->validate([
        'secret_key' => 'required',
    ]);

    $secret_key = $request->input('secret_key');

    $user = User::where('secret-key', $secret_key)->firstOrFail();

    return response()->json($user);
});