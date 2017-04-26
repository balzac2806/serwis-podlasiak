<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable,
    \Illuminate\Support\Facades\DB;

class Correction extends Authenticatable {

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'link',
        'description',
        'status',
        'updated_at',
        'created_at',
        'adder'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [];

    public static function getAll() {
        $corrections = DB::table('corrections')
                ->orderBy('created_at', 'desc')
                ->orderBy('id', 'desc')
                ->get();
        return $corrections;
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
        $correction = !empty($id) ? Correction::findById($id) : new Correction;
        $correction->fill($input);

        $correction->save();

        return $correction;
    }

}
