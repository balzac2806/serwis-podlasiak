<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class Order extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'issuer',
        'checker',
        'document_number',
        'authoriser',
        'date',
        'status',
        'updated_at',
        'created_at',
        'company',
        'editor'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public function getDateAttribute($value) {
        if (!empty($value)) {
            $value = date('Y-m-d', strtotime($value));
        } 
        return $value;
    }
    
    public function getCreatedAtAttribute($value) {
        if (!empty($value)) {
            $value = date('Y-m-d', strtotime($value));
        }
        return $value;
    }
    
    public function getDocumentNumberAttribute($value) {
        if (empty($value)) {
            $value = null;
        }
        return $value;
    }
    
    public static function getAll() {
        $orders = DB::table('orders')
                ->orderBy('updated_at', 'desc')
                ->orderBy('id', 'desc')
                ->get();
        return $orders;
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
        $order = !empty($id) ? Order::findById($id) : new Order;
        $order->fill($input);

        $order->save();

        return $order;
    }

}
