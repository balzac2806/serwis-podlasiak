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

// Zwroty Pieniędzy
Route::post('api/money-returns/', 'MoneyReturnController@store');
Route::put('api/money-returns/{id}/', 'MoneyReturnController@store');
Route::get('api/money-returns/', 'MoneyReturnController@create');
Route::get('api/money-returns/{id}/', 'MoneyReturnController@show');
Route::delete('api/money-returns/{id}/', 'MoneyReturnController@destroy');

// Cdde Generator
Route::get('api/code-generator/', 'CodeGeneratorController@index');

// Dostawy 
Route::post('api/provider/', 'ProviderController@store');
Route::put('api/provider/{id}/', 'ProviderController@store');
Route::get('api/provider/', 'ProviderController@create');
Route::get('api/provider/{id}/', 'ProviderController@show');
Route::delete('api/provider/{id}/', 'ProviderController@destroy');

// Poprawki 
Route::post('api/correction/', 'CorrectionController@store');
Route::put('api/correction/{id}/', 'CorrectionController@store');
Route::get('api/correction/', 'CorrectionController@create');
Route::get('api/correction/{id}/', 'CorrectionController@show');
Route::delete('api/correction/{id}/', 'CorrectionController@destroy');

// Dashboard 
Route::post('api/dashboard/', 'DashboardController@store');
Route::get('api/dashboard/', 'DashboardController@show');

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
