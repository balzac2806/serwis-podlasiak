<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class MoneyReturn extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'person',
        'subiect',
        'cost',
        'date',
        'time'
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
    
     public function getTimeAttribute($value) {
        if (!empty($value)) {
            $value = date('Y-m-d H:i:s', strtotime('+1 hours',strtotime($value)));
        } 
        return $value;
    }

    public static function getAll() {
        $products = DB::table('money_returns')
                ->orderBy('updated_at', 'desc')
                ->get();
        return $products;
    }

    /**
     * Zwraca zwrot pieniędzy po kluczu id.
     * @param int $id
     */
    public static function findById($id) {
        $query = self::where('id', '=', $id);

        return $query->first();
    }

    /**
     * Tworzy lub edytuje zwrot pieniędzy
     * @param array $input
     * @param int $id
     */
    public static function createOrUpdate($input, $id = null) {
        $data = !empty($id) ? MoneyReturn::findById($id) : new MoneyReturn;
        $data->fill($input);

        $data->save();

        return $data;
    }

}
