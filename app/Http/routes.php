<?php

/*
  |--------------------------------------------------------------------------
  | Application Routes
  |--------------------------------------------------------------------------
  |
  | Here is where you can register all of the routes for an application.
  | It's a breeze. Simply tell Laravel the URIs it should respond to
  | and give it the controller to call when that URI is requested.
  |
 */
$this->front = 'front/';

Route::get('/', function () {
    return view($this->front . 'master');
});

Route::post('auth', 'UserController@checkAuth');

Route::post('register', 'AuthController@create');

// Użytkownicy 
Route::post('api/user', 'UserController@store');
Route::put('api/user/{id}', 'UserController@store');
Route::get('api/user', 'UserController@create');
Route::get('api/user/{id}', 'UserController@show');
Route::delete('api/user/{id}', 'UserController@destroy');

// Produkty 
Route::post('api/product/', 'ProductController@store');
Route::put('api/product/{id}/', 'ProductController@store');
Route::get('api/product/', 'ProductController@create');
Route::get('api/product/{id}/', 'ProductController@show');
Route::delete('api/product/{id}/', 'ProductController@destroy');

// Protokoły Zwrotu 
Route::post('api/orders', 'OrderController@store');
Route::put('api/orders/{id}', 'OrderController@store');
Route::get('api/orders', 'OrderController@create');
Route::get('api/orders/{id}', 'OrderController@show');
Route::delete('api/orders/{id}', 'OrderController@destroy');

// Protokoły Zwrotu - Produkty
Route::post('api/order-products', 'OrderProductController@store');
Route::put('api/order-products/{id}', 'OrderProductController@store');
Route::get('api/order-products', 'OrderProductController@create');
Route::get('api/order-products/{id}', 'OrderProductController@show');
Route::delete('api/order-products/{id}', 'OrderProductController@destroy');
