<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class Product extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'person',
        'status',
        'updated_at'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function getCreatedAtAttribute($value) {
        if (!empty($value)) {
            $value = date('Y-m-d', strtotime($value));
        }
        return $value;
    }

    public function getUpdatedAtAttribute($value) {
        if (!empty($value)) {
            $value = date('Y-m-d', strtotime($value));
        }
        return $value;
    }

    public static function getAll() {
        $products = DB::table('products')
                ->orderBy('updated_at', 'desc')
                ->get();
        return $products;
    }

    /**
     * Zwraca produkt po kluczu id.
     * @param int $id
     * @return \User|static|null
     */
    public static function findById($id) {
        $query = self::where('id', '=', $id);

        return $query->first();
    }

    /**
     * Tworzy lub edytuje użytkownika
     * @param array $input
     * @param int $id
     * @return User
     */
    public static function createOrUpdate($input, $id = null) {
        $product = !empty($id) ? Product::findById($id) : new Product;
        $product->fill($input);

        $product->save();

        return $product;
    }

}
