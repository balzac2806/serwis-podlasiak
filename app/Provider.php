<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class Provider extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'date',
        'status',
        'updated_at',
        'created_at',
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
    
    public static function getAll() {
        $providers = DB::table('providers')
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc')
                ->get();
        return $providers;
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
        $provider = !empty($id) ? Provider::findById($id) : new Provider;
        $provider->fill($input);

        $provider->save();

        return $provider;
    }

}
